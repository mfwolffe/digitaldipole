/**
 * Calculator Registry
 *
 * Central registry for all calculator definitions.
 * Calculators are defined in separate files by category.
 */
import { gasLawCalculators, gasLawsInfo } from './gas-laws';
import { thermodynamicsCalculators, thermodynamicsInfo } from './thermodynamics';

// Combine all calculators
const allCalculators = [
  ...gasLawCalculators,
  ...thermodynamicsCalculators
];

// Create lookup map by ID
const calculatorMap = new Map(
  allCalculators.map(calc => [calc.id, calc])
);

/**
 * Get a calculator definition by ID
 * @param {string} id - Calculator ID
 * @returns {Object|undefined} Calculator definition or undefined
 */
export function getCalculator(id) {
  return calculatorMap.get(id);
}

/**
 * Get all calculators for a category
 * @param {string} category - Category code (e.g., 'GSLW', 'THRM')
 * @returns {Object[]} Array of calculator definitions
 */
export function getCalculatorsByCategory(category) {
  return allCalculators.filter(calc => calc.category === category);
}

/**
 * Get all calculator IDs
 * @returns {string[]} Array of calculator IDs
 */
export function getAllCalculatorIds() {
  return Array.from(calculatorMap.keys());
}

/**
 * Check if a calculator exists
 * @param {string} id - Calculator ID
 * @returns {boolean}
 */
export function hasCalculator(id) {
  return calculatorMap.has(id);
}

// Export individual category arrays and info
export {
  gasLawCalculators,
  gasLawsInfo,
  thermodynamicsCalculators,
  thermodynamicsInfo
};

// Export all calculators
export { allCalculators };

export default {
  getCalculator,
  getCalculatorsByCategory,
  getAllCalculatorIds,
  hasCalculator,
  gasLawCalculators,
  thermodynamicsCalculators
};
