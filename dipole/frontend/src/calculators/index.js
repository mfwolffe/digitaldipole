/**
 * Calculators Module
 *
 * Main entry point for the calculator system.
 */

// Components
export { Calculator, VariableInput, EquationDisplay, SolutionSteps } from './components';

// Registry
export {
  getCalculator,
  getCalculatorsByCategory,
  getAllCalculatorIds,
  hasCalculator,
  gasLawCalculators,
  gasLawsInfo,
  thermodynamicsCalculators,
  thermodynamicsInfo
} from './registry';

// Hooks
export { useCalculator } from './hooks/useCalculator';

// Engine (for advanced usage)
export * as solver from './engine/nerdamer-solver';
