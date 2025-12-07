/**
 * Unit Auto-Reconciliation Engine
 *
 * Analyzes a calculator's unit selections and determines what conversions
 * are needed to make the equation solvable. The key insight is that users
 * shouldn't have to think about unit compatibility - the system automatically
 * converts same-dimension units under the hood.
 *
 * "Units just happen" - errors only occur for truly incompatible dimensions.
 */

import { convert, getConversionFactor, canConvert } from './conversion.js';
import { getUnit, getBaseUnitId } from './registry.js';
import { getConstant } from './constants.js';

/**
 * Custom error for reconciliation failures
 */
export class ReconciliationError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'ReconciliationError';
    this.details = details;
  }
}

/**
 * Group an array by a key function
 */
function groupBy(array, keyFn) {
  return array.reduce((result, item) => {
    const key = keyFn(item);
    if (!result[key]) result[key] = [];
    result[key].push(item);
    return result;
  }, {});
}

/**
 * Analyze a calculator's current unit selections and determine what
 * conversions are needed to make the equation solvable.
 *
 * @param {Object} calculator - Calculator definition from registry
 * @param {Object} selectedUnits - Map of variable ID to selected unit ID
 * @param {string} unknownVariable - ID of the variable being solved for
 * @returns {Object} Reconciliation plan
 *
 * @example
 * const plan = reconcileUnits(idealGasCalc, {
 *   P: 'atm',
 *   V: 'L',
 *   n: 'mol',
 *   T: 'K',
 *   R: 'L_atm_mol_K'  // or derived from context
 * }, 'n');
 */
export function reconcileUnits(calculator, selectedUnits, unknownVariable) {
  const plan = {
    // Conversions to apply to input values before solving
    conversions: [],

    // Constant values to use (adjusted for unit context)
    constantValues: {},

    // How to convert the result from SI to user's selected output unit
    outputConversion: null,

    // Unit context for display (what units are being used)
    unitContext: {},

    // Only populated if there's an unresolvable issue
    errors: [],
  };

  // Get non-constant variables, excluding the unknown
  const inputVariables = calculator.variables.filter(
    v => !v.isConstant && v.id !== unknownVariable
  );

  const unknownVar = calculator.variables.find(v => v.id === unknownVariable);

  // Group input variables by dimension
  const byDimension = groupBy(
    inputVariables.filter(v => v.dimension),
    v => v.dimension
  );

  // For each dimension, check if we have mixed units
  for (const [dimension, vars] of Object.entries(byDimension)) {
    const units = vars.map(v => selectedUnits[v.id]).filter(Boolean);
    const uniqueUnits = [...new Set(units)];

    if (uniqueUnits.length > 1) {
      // Multiple different units for the same dimension
      // Strategy: Convert all to SI base unit for calculation
      const baseUnitId = getBaseUnitId(dimension);

      vars.forEach(v => {
        const currentUnit = selectedUnits[v.id];
        if (currentUnit && currentUnit !== baseUnitId) {
          plan.conversions.push({
            variableId: v.id,
            variableName: v.name,
            from: currentUnit,
            to: baseUnitId,
            dimension,
          });
        }
      });

      plan.unitContext[dimension] = baseUnitId;
    } else if (uniqueUnits.length === 1) {
      // All same unit for this dimension - record it
      plan.unitContext[dimension] = uniqueUnits[0];
    }
  }

  // Also convert any remaining variables to SI for consistent calculation
  inputVariables.forEach(v => {
    if (!v.dimension) return;

    const currentUnit = selectedUnits[v.id];
    const baseUnitId = getBaseUnitId(v.dimension);

    // Skip if already in the conversion list
    if (plan.conversions.some(c => c.variableId === v.id)) return;

    // Convert to SI base for calculation
    if (currentUnit && currentUnit !== baseUnitId) {
      plan.conversions.push({
        variableId: v.id,
        variableName: v.name,
        from: currentUnit,
        to: baseUnitId,
        dimension: v.dimension,
      });
    }

    if (!plan.unitContext[v.dimension]) {
      plan.unitContext[v.dimension] = currentUnit || baseUnitId;
    }
  });

  // Handle constants - get appropriate values based on SI context
  // Since we're converting everything to SI, we use SI values for constants
  calculator.variables.filter(v => v.isConstant && v.constantId).forEach(v => {
    const constant = getConstant(v.constantId);
    if (constant) {
      // Use base SI value since all inputs are converted to SI
      plan.constantValues[v.id] = constant.baseValue;
    } else if (v.defaultValue !== undefined) {
      // Fallback to default value if no constant definition
      plan.constantValues[v.id] = v.defaultValue;
    }
  });

  // Handle output conversion
  // Result comes out in SI base units, convert to user's selection
  if (unknownVar && unknownVar.dimension) {
    const userOutputUnit = selectedUnits[unknownVariable];
    const siBaseUnit = getBaseUnitId(unknownVar.dimension);

    if (userOutputUnit && userOutputUnit !== siBaseUnit) {
      plan.outputConversion = {
        variableId: unknownVariable,
        variableName: unknownVar.name,
        from: siBaseUnit,
        to: userOutputUnit,
        dimension: unknownVar.dimension,
      };
    }
  }

  return plan;
}

/**
 * Apply reconciliation plan to input values
 *
 * @param {Object} inputValues - Map of variable ID to numeric value
 * @param {Object} plan - Reconciliation plan from reconcileUnits()
 * @returns {Object} Converted values ready for solving
 */
export function applyReconciliation(inputValues, plan) {
  const result = { ...inputValues };

  // Apply input conversions
  for (const conv of plan.conversions) {
    if (result[conv.variableId] !== undefined) {
      result[conv.variableId] = convert(
        result[conv.variableId],
        conv.from,
        conv.to
      );
    }
  }

  // Add constant values
  for (const [varId, value] of Object.entries(plan.constantValues)) {
    result[varId] = value;
  }

  return result;
}

/**
 * Convert the result from SI to the user's selected output unit
 *
 * @param {number} siResult - Result in SI base units
 * @param {Object} plan - Reconciliation plan
 * @returns {number} Result in user's selected unit
 */
export function convertResult(siResult, plan) {
  if (!plan.outputConversion) {
    return siResult;
  }

  return convert(
    siResult,
    plan.outputConversion.from,
    plan.outputConversion.to
  );
}

/**
 * Build a user-friendly description of what conversions were applied
 *
 * @param {Object} plan - Reconciliation plan
 * @returns {string[]} Array of conversion descriptions
 */
export function describeReconciliation(plan) {
  const descriptions = [];

  for (const conv of plan.conversions) {
    const factor = getConversionFactor(conv.from, conv.to);
    const factorStr = factor ? ` (×${factor.toPrecision(4)})` : '';
    descriptions.push(
      `${conv.variableName}: ${conv.from} → ${conv.to}${factorStr}`
    );
  }

  if (plan.outputConversion) {
    const factor = getConversionFactor(
      plan.outputConversion.from,
      plan.outputConversion.to
    );
    const factorStr = factor ? ` (×${factor.toPrecision(4)})` : '';
    descriptions.push(
      `Result: ${plan.outputConversion.from} → ${plan.outputConversion.to}${factorStr}`
    );
  }

  return descriptions;
}

/**
 * Check if a set of unit selections is valid for a calculator
 * Returns issues if any, empty array if valid
 *
 * @param {Object} calculator - Calculator definition
 * @param {Object} selectedUnits - Map of variable ID to unit ID
 * @returns {Array} Array of issue descriptions (empty if valid)
 */
export function validateUnitSelections(calculator, selectedUnits) {
  const issues = [];

  for (const variable of calculator.variables) {
    if (variable.isConstant) continue;

    const selectedUnit = selectedUnits[variable.id];
    if (!selectedUnit) continue;

    const unit = getUnit(selectedUnit);
    if (!unit) {
      issues.push(`Unknown unit "${selectedUnit}" for ${variable.name}`);
      continue;
    }

    // Check dimension compatibility
    if (variable.dimension && unit.dimension !== variable.dimension) {
      issues.push(
        `Unit ${selectedUnit} (${unit.dimension}) is not compatible with ${variable.name} (${variable.dimension})`
      );
    }
  }

  return issues;
}

/**
 * Get which units should be disabled in the picker for a variable
 * based on the current context (dimension-based filtering)
 *
 * @param {Object} variable - Variable definition
 * @param {Object} calculator - Calculator definition
 * @param {Object} selectedUnits - Current unit selections
 * @returns {string[]} Array of unit IDs that should be disabled
 */
export function getDisabledUnits(variable, calculator, selectedUnits) {
  // For our design, we don't disable units within the same dimension
  // because we auto-reconcile. Only truly incompatible dimensions
  // would be disabled, and those are already filtered out by dimension.
  return [];
}

export default {
  reconcileUnits,
  applyReconciliation,
  convertResult,
  describeReconciliation,
  validateUnitSelections,
  getDisabledUnits,
  ReconciliationError,
};
