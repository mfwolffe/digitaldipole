/**
 * Validation Utilities for Chemical Equations
 *
 * Provides validation for:
 * - Element symbols
 * - Compound formulas
 * - Equation structure
 * - Conservation laws (mass, charge)
 */

import { isElement } from './chemicalTokenizer.js';
import { getAllElements } from './chemicalParser.js';
import { POLYATOMIC_IONS } from './polyatomicIons.js';

/**
 * Validate a single element symbol
 */
export function validateElement(symbol) {
  if (!symbol || typeof symbol !== 'string') {
    return { valid: false, error: 'Empty element symbol' };
  }

  if (!isElement(symbol) && symbol !== 'e') {
    return { valid: false, error: `Unknown element: ${symbol}` };
  }

  return { valid: true };
}

/**
 * Validate a compound structure
 */
export function validateCompound(compound) {
  const errors = [];

  if (!compound) {
    return { valid: false, errors: ['Compound is null'] };
  }

  if (!compound.elements || compound.elements.length === 0) {
    errors.push('Compound has no elements');
  }

  // Check each element
  for (const elem of compound.elements || []) {
    if (!isElement(elem.symbol) && elem.symbol !== 'e') {
      errors.push(`Unknown element: ${elem.symbol}`);
    }
    if (elem.count < 1) {
      errors.push(`Invalid count for ${elem.symbol}: ${elem.count}`);
    }
  }

  // Check coefficient
  if (compound.coefficient !== undefined && compound.coefficient < 1) {
    errors.push(`Invalid coefficient: ${compound.coefficient}`);
  }

  // Validate charge (must be integer)
  if (compound.charge !== undefined && !Number.isInteger(compound.charge)) {
    errors.push(`Charge must be integer: ${compound.charge}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate equation structure
 */
export function validateEquationStructure(equation) {
  const errors = [];

  if (!equation) {
    return { valid: false, errors: ['Equation is null'] };
  }

  if (!equation.reactants || equation.reactants.length === 0) {
    errors.push('No reactants');
  }

  if (!equation.products || equation.products.length === 0) {
    errors.push('No products');
  }

  // Validate each compound
  for (const compound of equation.reactants || []) {
    const result = validateCompound(compound);
    if (!result.valid) {
      errors.push(`Reactant ${compound.formula}: ${result.errors.join(', ')}`);
    }
  }

  for (const compound of equation.products || []) {
    const result = validateCompound(compound);
    if (!result.valid) {
      errors.push(`Product ${compound.formula}: ${result.errors.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check conservation of mass (element counts)
 */
export function checkMassConservation(equation, coefficients = {}) {
  const elements = getAllElements(equation);
  const imbalances = [];

  for (const element of elements) {
    const reactantCount = sumElementCount(equation.reactants, element, coefficients);
    const productCount = sumElementCount(equation.products, element, coefficients);

    if (reactantCount !== productCount) {
      imbalances.push({
        element,
        reactantCount,
        productCount,
        difference: reactantCount - productCount,
      });
    }
  }

  return {
    balanced: imbalances.length === 0,
    imbalances,
  };
}

/**
 * Check conservation of charge
 */
export function checkChargeConservation(equation, coefficients = {}) {
  let reactantCharge = 0;
  let productCharge = 0;

  for (const compound of equation.reactants) {
    const coeff = coefficients[compound.id] || compound.coefficient || 1;
    reactantCharge += (compound.charge || 0) * coeff;
  }

  for (const compound of equation.products) {
    const coeff = coefficients[compound.id] || compound.coefficient || 1;
    productCharge += (compound.charge || 0) * coeff;
  }

  return {
    balanced: reactantCharge === productCharge,
    reactantCharge,
    productCharge,
    difference: reactantCharge - productCharge,
  };
}

/**
 * Sum element count across compounds
 */
function sumElementCount(compounds, element, coefficients) {
  let total = 0;

  for (const compound of compounds) {
    const coeff = coefficients[compound.id] || compound.coefficient || 1;
    const elem = compound.elements.find(e => e.symbol === element);
    if (elem) {
      total += elem.count * coeff;
    }
  }

  return total;
}

/**
 * Validate full equation (structure + conservation)
 */
export function validateEquation(equation, coefficients = {}) {
  const structureResult = validateEquationStructure(equation);
  if (!structureResult.valid) {
    return structureResult;
  }

  const massResult = checkMassConservation(equation, coefficients);
  const chargeResult = checkChargeConservation(equation, coefficients);

  const errors = [];

  if (!massResult.balanced) {
    for (const imb of massResult.imbalances) {
      errors.push(`${imb.element}: ${imb.reactantCount} → ${imb.productCount}`);
    }
  }

  if (!chargeResult.balanced) {
    errors.push(`Charge: ${chargeResult.reactantCharge} → ${chargeResult.productCharge}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    massBalance: massResult,
    chargeBalance: chargeResult,
  };
}

/**
 * Get detailed element inventory for an equation
 */
export function getElementInventory(equation, coefficients = {}) {
  const elements = getAllElements(equation);
  const inventory = [];

  for (const element of elements) {
    const reactantCount = sumElementCount(equation.reactants, element, coefficients);
    const productCount = sumElementCount(equation.products, element, coefficients);

    inventory.push({
      element,
      reactants: reactantCount,
      products: productCount,
      balanced: reactantCount === productCount,
    });
  }

  return inventory;
}

/**
 * Suggest possible issues with an unbalanced equation
 */
export function suggestFixes(equation) {
  const suggestions = [];
  const elements = getAllElements(equation);

  // Check for missing elements
  const reactantElements = new Set();
  const productElements = new Set();

  for (const compound of equation.reactants) {
    for (const elem of compound.elements) {
      reactantElements.add(elem.symbol);
    }
  }

  for (const compound of equation.products) {
    for (const elem of compound.elements) {
      productElements.add(elem.symbol);
    }
  }

  for (const elem of reactantElements) {
    if (!productElements.has(elem)) {
      suggestions.push(`Element ${elem} appears in reactants but not products`);
    }
  }

  for (const elem of productElements) {
    if (!reactantElements.has(elem)) {
      suggestions.push(`Element ${elem} appears in products but not reactants`);
    }
  }

  // Check for unusual charges
  for (const compound of [...equation.reactants, ...equation.products]) {
    if (compound.charge && Math.abs(compound.charge) > 4) {
      suggestions.push(`Unusual charge on ${compound.formula}: ${compound.charge}`);
    }
  }

  return suggestions;
}

export default {
  validateElement,
  validateCompound,
  validateEquationStructure,
  checkMassConservation,
  checkChargeConservation,
  validateEquation,
  getElementInventory,
  suggestFixes,
};
