/**
 * Chemical Equation Balancer
 *
 * Uses matrix-based Gaussian elimination to find stoichiometric coefficients.
 * The problem: find integer coefficients c1, c2, ... cn such that for each element,
 * the sum on the reactant side equals the sum on the product side.
 *
 * Algorithm:
 * 1. Build a matrix where rows = elements, columns = compounds
 *    - Reactant coefficients are positive
 *    - Product coefficients are negative (moved to other side)
 * 2. For ionic equations, add a row for charge conservation
 * 3. Find the null space using Gaussian elimination (RREF)
 * 4. Convert to smallest positive integers
 */

import { getAllElements, getElementCount } from './chemicalParser.js';
import { balanceRedoxEquation, identifyRedoxChanges } from './redoxBalancer.js';

/**
 * Balance a chemical equation
 * @param {Object} equation - Parsed equation object
 * @param {Object} options - { mode: 'molecular'|'ionic', showSteps: boolean }
 * @returns {Object} { success, coefficients, steps, error }
 */
export function balanceEquation(equation, options = {}) {
  const { mode = 'molecular', showSteps = true, solution = 'acidic' } = options;
  const steps = [];

  try {
    // For redox mode, use the half-reaction method
    if (mode === 'redox') {
      return balanceRedoxEquation(equation, { solution, showSteps });
    }

    // Get all compounds in order
    const allCompounds = [...equation.reactants, ...equation.products];
    const numReactants = equation.reactants.length;

    // Get all unique elements
    const elements = getAllElements(equation);

    if (elements.length === 0) {
      return { success: false, error: 'No elements found in equation' };
    }

    if (showSteps) {
      steps.push({
        description: 'Identify elements',
        detail: `Elements: ${elements.join(', ')}`,
      });
    }

    // Build the coefficient matrix
    const matrix = buildMatrix(allCompounds, elements, numReactants, mode);

    if (showSteps) {
      steps.push({
        description: 'Build element matrix',
        detail: `Matrix size: ${matrix.length} rows × ${matrix[0].length} columns`,
      });
    }

    // Solve using null space method
    const solution = findNullSpace(matrix);

    if (!solution) {
      return { success: false, error: 'No solution found - equation may be impossible to balance' };
    }

    // Convert to smallest positive integers
    const coefficients = toSmallestIntegers(solution);

    if (showSteps) {
      steps.push({
        description: 'Find coefficients',
        detail: `Raw solution: [${solution.map(x => x.toFixed(4)).join(', ')}]`,
      });
      steps.push({
        description: 'Convert to integers',
        detail: `Coefficients: [${coefficients.join(', ')}]`,
      });
    }

    // Build coefficient map keyed by compound id
    const coefficientMap = {};
    allCompounds.forEach((compound, i) => {
      coefficientMap[compound.id] = coefficients[i];
    });

    // Validate the solution
    const validation = validateBalance(equation, coefficientMap);

    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    if (showSteps) {
      steps.push({
        description: 'Verify balance',
        detail: 'Mass and charge conserved ✓',
      });
    }

    return {
      success: true,
      coefficients: coefficientMap,
      steps,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Build the coefficient matrix
 * Rows = elements (+ charge for ionic)
 * Columns = compounds
 * Reactants get positive values, products get negative
 */
function buildMatrix(compounds, elements, numReactants, mode) {
  const matrix = [];

  // Add a row for each element
  for (const element of elements) {
    const row = [];
    for (let i = 0; i < compounds.length; i++) {
      const compound = compounds[i];
      const count = getElementCountInCompound(compound, element);
      // Products get negative sign (equation form: reactants - products = 0)
      const sign = i >= numReactants ? -1 : 1;
      row.push(sign * count);
    }
    matrix.push(row);
  }

  // Add charge conservation row for ionic mode
  if (mode === 'ionic' || mode === 'net-ionic') {
    const chargeRow = [];
    for (let i = 0; i < compounds.length; i++) {
      const compound = compounds[i];
      const charge = compound.charge || 0;
      const sign = i >= numReactants ? -1 : 1;
      chargeRow.push(sign * charge);
    }
    // Only add if there are non-zero charges
    if (chargeRow.some(c => c !== 0)) {
      matrix.push(chargeRow);
    }
  }

  return matrix;
}

/**
 * Get element count in a compound (without coefficient multiplier)
 */
function getElementCountInCompound(compound, elementSymbol) {
  const elem = compound.elements.find(e => e.symbol === elementSymbol);
  return elem ? elem.count : 0;
}

/**
 * Find null space of matrix using Gaussian elimination
 * Returns a non-trivial solution vector
 */
function findNullSpace(matrix) {
  const m = matrix.length;      // rows (constraints)
  const n = matrix[0].length;   // columns (variables/compounds)

  if (n <= m) {
    // Need more variables than constraints for a non-trivial solution
    // This can still work if the system is underdetermined
  }

  // Create augmented matrix (copy)
  const aug = matrix.map(row => [...row]);

  // Perform Gaussian elimination with partial pivoting
  let pivotRow = 0;
  const pivotCols = [];

  for (let col = 0; col < n && pivotRow < m; col++) {
    // Find the best pivot (largest absolute value in column)
    let maxRow = pivotRow;
    for (let row = pivotRow + 1; row < m; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) {
        maxRow = row;
      }
    }

    // Skip if pivot is essentially zero
    if (Math.abs(aug[maxRow][col]) < 1e-10) {
      continue;
    }

    // Swap rows
    [aug[pivotRow], aug[maxRow]] = [aug[maxRow], aug[pivotRow]];

    // Scale pivot row
    const pivotVal = aug[pivotRow][col];
    for (let j = 0; j < n; j++) {
      aug[pivotRow][j] /= pivotVal;
    }

    // Eliminate other rows
    for (let row = 0; row < m; row++) {
      if (row !== pivotRow && Math.abs(aug[row][col]) > 1e-10) {
        const factor = aug[row][col];
        for (let j = 0; j < n; j++) {
          aug[row][j] -= factor * aug[pivotRow][j];
        }
      }
    }

    pivotCols.push(col);
    pivotRow++;
  }

  // Find free variables (columns without pivots)
  const freeVars = [];
  for (let col = 0; col < n; col++) {
    if (!pivotCols.includes(col)) {
      freeVars.push(col);
    }
  }

  if (freeVars.length === 0) {
    // System is fully determined - only trivial solution exists
    // This means the equation can't be balanced (or is already balanced with all 1s)
    // Try setting last variable as free
    freeVars.push(n - 1);
  }

  // Build solution by setting first free variable to 1
  const solution = new Array(n).fill(0);
  const freeVar = freeVars[0];
  solution[freeVar] = 1;

  // Back-substitute to find other values
  for (let i = pivotCols.length - 1; i >= 0; i--) {
    const col = pivotCols[i];
    let sum = 0;
    for (let j = col + 1; j < n; j++) {
      sum += aug[i][j] * solution[j];
    }
    solution[col] = -sum;
  }

  // Check if solution is valid (no zeros, all same sign or correctable)
  const nonZero = solution.filter(x => Math.abs(x) > 1e-10);
  if (nonZero.length !== n) {
    // Some coefficients are zero - try different free variable
    for (let tryFree = 1; tryFree < freeVars.length; tryFree++) {
      solution.fill(0);
      solution[freeVars[tryFree]] = 1;

      for (let i = pivotCols.length - 1; i >= 0; i--) {
        const col = pivotCols[i];
        let sum = 0;
        for (let j = col + 1; j < n; j++) {
          sum += aug[i][j] * solution[j];
        }
        solution[col] = -sum;
      }

      const nonZero2 = solution.filter(x => Math.abs(x) > 1e-10);
      if (nonZero2.length === n) break;
    }
  }

  // Ensure all coefficients are positive (flip signs if needed)
  const hasNegative = solution.some(x => x < -1e-10);
  const hasPositive = solution.some(x => x > 1e-10);

  if (hasNegative && hasPositive) {
    // Mixed signs - this shouldn't happen for valid equations
    // Try flipping all signs
    const flipped = solution.map(x => -x);
    if (flipped.every(x => x >= -1e-10)) {
      return flipped;
    }
  } else if (hasNegative) {
    return solution.map(x => -x);
  }

  return solution;
}

/**
 * Convert solution to smallest positive integers
 */
function toSmallestIntegers(solution) {
  // First, make all values positive
  let values = solution.map(x => Math.abs(x));

  // Handle near-zero values
  values = values.map(x => x < 1e-10 ? 0 : x);

  // Find the smallest non-zero value
  const nonZero = values.filter(x => x > 1e-10);
  if (nonZero.length === 0) return values.map(() => 1);

  const minVal = Math.min(...nonZero);

  // Scale so smallest is 1
  values = values.map(x => x / minVal);

  // Convert to fractions and find LCM of denominators
  const fractions = values.map(x => toFraction(x, 1e-6));
  const lcm = fractions.reduce((acc, f) => lcmOf(acc, f.denominator), 1);

  // Multiply by LCM to get integers
  let integers = fractions.map(f => Math.round((f.numerator * lcm) / f.denominator));

  // Divide by GCD to get smallest integers
  const gcd = integers.reduce((acc, n) => gcdOf(acc, n), integers[0]);
  if (gcd > 1) {
    integers = integers.map(n => n / gcd);
  }

  // Ensure all positive (at least 1)
  integers = integers.map(n => Math.max(1, Math.round(n)));

  return integers;
}

/**
 * Convert decimal to fraction
 */
function toFraction(decimal, tolerance = 1e-6) {
  if (Math.abs(decimal - Math.round(decimal)) < tolerance) {
    return { numerator: Math.round(decimal), denominator: 1 };
  }

  let h1 = 1, h2 = 0;
  let k1 = 0, k2 = 1;
  let b = decimal;

  do {
    const a = Math.floor(b);
    let aux = h1;
    h1 = a * h1 + h2;
    h2 = aux;
    aux = k1;
    k1 = a * k1 + k2;
    k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(decimal - h1 / k1) > tolerance && k1 < 10000);

  return { numerator: h1, denominator: k1 };
}

/**
 * Greatest common divisor
 */
function gcdOf(a, b) {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

/**
 * Least common multiple
 */
function lcmOf(a, b) {
  return Math.abs(a * b) / gcdOf(a, b);
}

/**
 * Validate that an equation is balanced
 */
export function validateBalance(equation, coefficients) {
  const errors = [];

  // Check each element
  const elements = getAllElements(equation);

  for (const element of elements) {
    let reactantCount = 0;
    let productCount = 0;

    for (const compound of equation.reactants) {
      const coeff = coefficients[compound.id] || compound.coefficient || 1;
      reactantCount += getElementCountInCompound(compound, element) * coeff;
    }

    for (const compound of equation.products) {
      const coeff = coefficients[compound.id] || compound.coefficient || 1;
      productCount += getElementCountInCompound(compound, element) * coeff;
    }

    if (Math.abs(reactantCount - productCount) > 0.001) {
      errors.push(`${element}: ${reactantCount} ≠ ${productCount}`);
    }
  }

  // Check charge conservation
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

  if (Math.abs(reactantCharge - productCharge) > 0.001) {
    errors.push(`Charge: ${reactantCharge} ≠ ${productCharge}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    error: errors.length > 0 ? `Unbalanced: ${errors.join(', ')}` : null,
  };
}

/**
 * Check if equation is already balanced
 */
export function isAlreadyBalanced(equation) {
  const coefficients = {};
  for (const compound of [...equation.reactants, ...equation.products]) {
    coefficients[compound.id] = compound.coefficient || 1;
  }
  return validateBalance(equation, coefficients).valid;
}

export default {
  balanceEquation,
  validateBalance,
  isAlreadyBalanced,
};
