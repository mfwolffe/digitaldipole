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

/**
 * Get symbolic solution for logarithmic equations with proper LaTeX rendering
 *
 * For logarithmic equations, we need custom LaTeX that shows the actual
 * logarithm instead of the 'lnRatio' intermediate variable.
 *
 * @param {string} equation - Equation with lnRatio intermediate variable
 * @param {string} unknown - Variable to solve for
 * @param {Object} logConfig - Logarithmic configuration
 * @param {string} logConfig.numerator - Variable in numerator of log
 * @param {string} logConfig.denominator - Variable in denominator of log
 * @param {Object<string, string>} [symbolMap] - Map of variable IDs to LaTeX symbols
 * @returns {{success: boolean, latex?: string, raw?: string, error?: string}}
 */
export function solveSymbolicLogarithmic(equation, unknown, logConfig, symbolMap = {}) {
  const { numerator, denominator } = logConfig;
  const getSymbol = (id) => symbolMap[id] || id;

  try {
    // Case 1: Solving for the numerator (e.g., k2 in ln(k2/k1))
    if (unknown === numerator) {
      // First solve for lnRatio symbolically
      const lnRatioSolution = nerdamer.solve(equation, 'lnRatio');
      const lnRatioRaw = lnRatioSolution.text().replace(/^\[|\]$/g, '');
      const lnRatioLatex = lnRatioSolution.toTeX().replace(/^\[|\]$/g, '');

      // The solution is: numerator = denominator * e^(lnRatio expression)
      const latex = `${getSymbol(denominator)} \\cdot e^{${lnRatioLatex}}`;

      // For the raw expression, use the actual solved lnRatio expression
      // This gives us: k1*exp(-Ea/R*(1/T2-1/T1)) for Arrhenius
      const raw = `${denominator}*exp(${lnRatioRaw})`;

      return {
        success: true,
        latex,
        raw
      };
    }

    // Case 2: Solving for the denominator (e.g., k1 in ln(k2/k1))
    if (unknown === denominator) {
      // First solve for lnRatio symbolically
      const lnRatioSolution = nerdamer.solve(equation, 'lnRatio');
      const lnRatioRaw = lnRatioSolution.text().replace(/^\[|\]$/g, '');
      const lnRatioLatex = lnRatioSolution.toTeX().replace(/^\[|\]$/g, '');

      // The solution is: denominator = numerator / e^(lnRatio expression)
      const latex = `\\frac{${getSymbol(numerator)}}{e^{${lnRatioLatex}}}`;

      // For the raw expression: numerator * exp(-lnRatioRaw)
      // Since k1 = k2/e^x = k2*e^(-x)
      const raw = `${numerator}*exp(-(${lnRatioRaw}))`;

      return {
        success: true,
        latex,
        raw
      };
    }

    // Case 3: Solving for other variables - replace lnRatio with proper log notation in LaTeX
    const solutions = nerdamer.solve(equation, unknown);
    let latex = solutions.toTeX().replace(/^\[|\]$/g, '');
    const raw = solutions.text().replace(/^\[|\]$/g, '');

    // Replace 'lnRatio' with proper LaTeX notation: \ln\left(\frac{num}{denom}\right)
    const logLatex = `\\ln\\left(\\frac{${getSymbol(numerator)}}{${getSymbol(denominator)}}\\right)`;
    latex = latex.replace(/\\mathrm\{lnRatio\}/g, logLatex);
    latex = latex.replace(/lnRatio/g, logLatex);

    return {
      success: true,
      latex,
      raw
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Solve logarithmic equations using substitution strategy
 *
 * For equations like ln(P2/P1) = expression, Nerdamer struggles to solve
 * for variables inside the log. We use a substitution approach:
 * 1. Replace ln(ratio) with intermediate variable 'lnRatio'
 * 2. Solve algebraically for all variables
 * 3. For variables that were inside the log, compute: base * e^lnRatio
 *
 * @param {Object} config - Logarithmic equation configuration
 * @param {string} config.equation - Equation with lnRatio as intermediate variable
 * @param {string} config.logNumerator - Variable in numerator of log (e.g., 'P2')
 * @param {string} config.logDenominator - Variable in denominator of log (e.g., 'P1')
 * @param {string} unknown - Variable to solve for
 * @param {Object<string, number>} knownValues - Map of variable IDs to numeric values
 * @param {Object<string, string>} [symbolMap] - Map of variable IDs to LaTeX symbols
 * @returns {SolveResult}
 */
export function solveLogarithmic(config, unknown, knownValues, symbolMap = {}) {
  const { equation, logNumerator, logDenominator } = config;

  try {
    // Case 1: Solving for the numerator variable (e.g., P2)
    if (unknown === logNumerator) {
      // First solve for lnRatio
      const lnRatioSolution = nerdamer.solve(equation, 'lnRatio');
      const lnRatioText = lnRatioSolution.text().replace(/^\[|\]$/g, '');

      // Substitute known values into lnRatio expression
      let substituted = nerdamer(lnRatioText);
      for (const [variable, value] of Object.entries(knownValues)) {
        if (variable !== logNumerator && variable !== 'lnRatio') {
          substituted = substituted.sub(variable, value);
        }
      }

      // Evaluate lnRatio
      const lnRatioValue = parseFloat(substituted.evaluate().text());

      // Compute numerator = denominator * e^lnRatio
      const denominatorValue = knownValues[logDenominator];
      const numericValue = denominatorValue * Math.exp(lnRatioValue);

      // Generate steps
      const steps = [
        {
          description: 'Solve for ln(ratio)',
          latex: `\\ln\\left(\\frac{${symbolMap[logNumerator] || logNumerator}}{${symbolMap[logDenominator] || logDenominator}}\\right) = ${lnRatioValue.toFixed(4)}`
        },
        {
          description: `Solve for ${symbolMap[logNumerator] || logNumerator}`,
          latex: `${symbolMap[logNumerator] || logNumerator} = ${symbolMap[logDenominator] || logDenominator} \\cdot e^{${lnRatioValue.toFixed(4)}}`
        },
        {
          description: 'Calculate',
          latex: `${symbolMap[logNumerator] || logNumerator} = ${numericValue.toPrecision(6)}`
        }
      ];

      return {
        success: true,
        numericValue,
        symbolicLatex: `${symbolMap[logDenominator] || logDenominator} \\cdot e^{\\text{lnRatio}}`,
        steps,
        engine: 'nerdamer-log'
      };
    }

    // Case 2: Solving for the denominator variable (e.g., P1)
    if (unknown === logDenominator) {
      // First solve for lnRatio
      const lnRatioSolution = nerdamer.solve(equation, 'lnRatio');
      const lnRatioText = lnRatioSolution.text().replace(/^\[|\]$/g, '');

      // Substitute known values into lnRatio expression
      let substituted = nerdamer(lnRatioText);
      for (const [variable, value] of Object.entries(knownValues)) {
        if (variable !== logDenominator && variable !== 'lnRatio') {
          substituted = substituted.sub(variable, value);
        }
      }

      // Evaluate lnRatio
      const lnRatioValue = parseFloat(substituted.evaluate().text());

      // Compute denominator = numerator / e^lnRatio
      const numeratorValue = knownValues[logNumerator];
      const numericValue = numeratorValue / Math.exp(lnRatioValue);

      // Generate steps
      const steps = [
        {
          description: 'Solve for ln(ratio)',
          latex: `\\ln\\left(\\frac{${symbolMap[logNumerator] || logNumerator}}{${symbolMap[logDenominator] || logDenominator}}\\right) = ${lnRatioValue.toFixed(4)}`
        },
        {
          description: `Solve for ${symbolMap[logDenominator] || logDenominator}`,
          latex: `${symbolMap[logDenominator] || logDenominator} = \\frac{${symbolMap[logNumerator] || logNumerator}}{e^{${lnRatioValue.toFixed(4)}}}`
        },
        {
          description: 'Calculate',
          latex: `${symbolMap[logDenominator] || logDenominator} = ${numericValue.toPrecision(6)}`
        }
      ];

      return {
        success: true,
        numericValue,
        symbolicLatex: `\\frac{${symbolMap[logNumerator] || logNumerator}}{e^{\\text{lnRatio}}}`,
        steps,
        engine: 'nerdamer-log'
      };
    }

    // Case 3: Solving for any other variable (standard algebraic solve)
    const symbolicSolutions = nerdamer.solve(equation, unknown);
    const symbolicLatex = symbolicSolutions.toTeX();
    const solutionText = symbolicSolutions.text().replace(/^\[|\]$/g, '');

    // For non-log variables, we need to compute lnRatio from the known log vars
    let workingKnownValues = { ...knownValues };

    // If both log variables are known, compute lnRatio
    if (logNumerator in knownValues && logDenominator in knownValues) {
      workingKnownValues.lnRatio = Math.log(knownValues[logNumerator] / knownValues[logDenominator]);
    }

    // Substitute known values
    let substituted = nerdamer(solutionText);
    for (const [variable, value] of Object.entries(workingKnownValues)) {
      if (variable !== unknown) {
        substituted = substituted.sub(variable, value);
      }
    }

    const numericResult = substituted.evaluate();
    const numericValue = parseFloat(numericResult.text());

    const steps = generateStepsForLog(equation, unknown, workingKnownValues, symbolMap);

    return {
      success: true,
      numericValue,
      symbolicLatex,
      steps,
      engine: 'nerdamer-log'
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      engine: 'nerdamer-log'
    };
  }
}

/**
 * Generate steps for logarithmic equation solutions
 */
function generateStepsForLog(equation, unknown, knownValues, symbolMap) {
  const steps = [];
  const getSymbol = (id) => symbolMap[id] || id;

  try {
    // Step 1: Show original equation
    const origExpr = nerdamer(equation);
    steps.push({
      description: 'Start with the equation',
      latex: `${origExpr.toTeX()} = 0`
    });

    // Step 2: Solve symbolically
    const symbolic = nerdamer.solve(equation, unknown);
    steps.push({
      description: `Solve for ${getSymbol(unknown)}`,
      latex: `${getSymbol(unknown)} = ${symbolic.toTeX()}`
    });

    // Step 3: Substitution
    if (Object.keys(knownValues).length > 0) {
      const subsDescription = Object.entries(knownValues)
        .filter(([v]) => v !== unknown)
        .map(([v, val]) => `${getSymbol(v)} = ${typeof val === 'number' ? val.toPrecision(4) : val}`)
        .join(', ');

      let substituted = nerdamer(symbolic.text().replace(/^\[|\]$/g, ''));
      for (const [v, val] of Object.entries(knownValues)) {
        if (v !== unknown) {
          substituted = substituted.sub(v, val);
        }
      }

      steps.push({
        description: `Substitute: ${subsDescription}`,
        latex: `${getSymbol(unknown)} = ${substituted.toTeX()}`
      });

      // Step 4: Final result
      const final = substituted.evaluate();
      steps.push({
        description: 'Calculate',
        latex: `${getSymbol(unknown)} = ${final.text()}`
      });
    }
  } catch (e) {
    steps.push({
      description: 'Solution',
      latex: `${unknown} = ?`
    });
  }

  return steps;
}

export default { solve, solveSymbolic, solveSymbolicLogarithmic, solveLogarithmic, derivative, integrate };
