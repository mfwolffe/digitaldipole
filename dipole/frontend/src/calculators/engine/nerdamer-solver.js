/**
 * Client-side symbolic math solver using Nerdamer
 */
import nerdamer from 'nerdamer';
import 'nerdamer/Algebra';
import 'nerdamer/Calculus';
import 'nerdamer/Solve';

/**
 * @typedef {Object} SolveResult
 * @property {boolean} success - Whether the solve was successful
 * @property {number} [numericValue] - The computed numeric result
 * @property {string} [symbolicLatex] - LaTeX of the symbolic solution
 * @property {Array<{description: string, latex: string}>} [steps] - Solution steps
 * @property {string} [error] - Error message if failed
 * @property {string} engine - Which engine was used ('nerdamer')
 */

/**
 * Solve an equation for an unknown variable
 * @param {string} equation - Equation in form "LHS - RHS" (equals zero)
 * @param {string} unknown - Variable ID to solve for
 * @param {Object<string, number>} knownValues - Map of variable IDs to numeric values
 * @param {Object<string, string>} [symbolMap] - Map of variable IDs to LaTeX symbols
 * @returns {SolveResult}
 */
export function solve(equation, unknown, knownValues, symbolMap = {}) {
  try {
    // Step 1: Solve symbolically (before substitution)
    const symbolicSolutions = nerdamer.solve(equation, unknown);
    const symbolicLatex = symbolicSolutions.toTeX();

    // Step 2: Get the first solution as a string, then substitute
    // nerdamer.solve returns an array-like; we need the expression text
    const solutionText = symbolicSolutions.text().replace(/^\[|\]$/g, '');

    // Step 3: Substitute known values into the solution expression
    let substituted = nerdamer(solutionText);
    for (const [variable, value] of Object.entries(knownValues)) {
      substituted = substituted.sub(variable, value);
    }

    // Step 4: Evaluate to get numeric result
    const numericResult = substituted.evaluate();
    const numericValue = parseFloat(numericResult.text());

    // Step 5: Generate solution steps
    const steps = generateSteps(equation, unknown, knownValues, symbolMap);

    return {
      success: true,
      numericValue,
      symbolicLatex,
      steps,
      engine: 'nerdamer'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      engine: 'nerdamer'
    };
  }
}

/**
 * Generate step-by-step solution for educational display
 */
function generateSteps(equation, unknown, knownValues, symbolMap) {
  const steps = [];
  const getSymbol = (id) => symbolMap[id] || id;

  try {
    // Step 1: Original equation
    const origExpr = nerdamer(equation);
    steps.push({
      description: 'Start with the equation',
      latex: `${origExpr.toTeX()} = 0`
    });

    // Step 2: Solve for unknown symbolically
    const symbolic = nerdamer.solve(equation, unknown);
    steps.push({
      description: `Solve for ${getSymbol(unknown)}`,
      latex: `${getSymbol(unknown)} = ${symbolic.toTeX()}`
    });

    // Step 3: Show substitution
    if (Object.keys(knownValues).length > 0) {
      let substituted = symbolic;
      for (const [v, val] of Object.entries(knownValues)) {
        substituted = nerdamer(substituted).sub(v, val);
      }

      const subsDescription = Object.entries(knownValues)
        .map(([v, val]) => `${getSymbol(v)} = ${val}`)
        .join(', ');

      steps.push({
        description: `Substitute: ${subsDescription}`,
        latex: `${getSymbol(unknown)} = ${substituted.toTeX()}`
      });

      // Step 4: Final numeric result
      const final = nerdamer(substituted).evaluate();
      steps.push({
        description: 'Calculate',
        latex: `${getSymbol(unknown)} = ${final.text()}`
      });
    }
  } catch (e) {
    // If step generation fails, return minimal steps
    steps.push({
      description: 'Solution',
      latex: `${unknown} = ?`
    });
  }

  return steps;
}

/**
 * Get the symbolic solution without numeric evaluation
 * @param {string} equation - Equation string
 * @param {string} unknown - Variable to solve for
 * @returns {{success: boolean, latex?: string, raw?: string, error?: string}}
 */
export function solveSymbolic(equation, unknown) {
  try {
    const solutions = nerdamer.solve(equation, unknown);
    // Get both LaTeX (for display) and raw text (for parsing)
    const latex = solutions.toTeX();
    const raw = solutions.text();

    // Clean up the raw text: remove brackets
    const cleanRaw = raw.replace(/^\[|\]$/g, '');

    return {
      success: true,
      latex: latex.replace(/^\[|\]$/g, ''),  // Remove brackets from LaTeX too
      raw: cleanRaw
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Compute derivative (for future calculus support)
 * @param {string} expression - Expression to differentiate
 * @param {string} variable - Variable to differentiate with respect to
 */
export function derivative(expression, variable) {
  try {
    const result = nerdamer(`diff(${expression}, ${variable})`);
    return {
      success: true,
      expression: result.text(),
      latex: result.toTeX()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Compute indefinite integral (for future calculus support)
 * @param {string} expression - Expression to integrate
 * @param {string} variable - Variable to integrate with respect to
 */
export function integrate(expression, variable) {
  try {
    const result = nerdamer(`integrate(${expression}, ${variable})`);
    return {
      success: true,
      expression: result.text(),
      latex: result.toTeX()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

export default { solve, solveSymbolic, derivative, integrate };
