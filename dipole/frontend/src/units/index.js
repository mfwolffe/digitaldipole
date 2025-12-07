/**
 * Units System - Public API
 *
 * This is the main entry point for the units system.
 * Import from this file for access to all unit functionality.
 *
 * @example
 * import { convert, getUnit, Dimension } from '../units';
 *
 * // Convert 1 atmosphere to kilopascals
 * const kPa = convert(1, 'atm', 'kPa');  // 101.325
 *
 * // Get unit definition
 * const atm = getUnit('atm');
 *
 * // Get all pressure units
 * const pressureUnits = getUnitsForDimension(Dimension.PRESSURE);
 */

// Dimensions
export { Dimension, dimensionLabels, siBaseUnits } from './dimensions.js';

// Registry functions
export {
  getUnit,
  hasUnit,
  getUnitsForDimension,
  getBaseUnit,
  getBaseUnitId,
  getCompatibleUnits,
  getAllUnits,
  getUnitsByTags,
  getUnitsBySystem,
  getDefaultAltUnit,
  searchUnits,
} from './registry.js';

// Conversion functions
export {
  convert,
  getConversionFactor,
  canConvert,
  convertToSI,
  convertFromSI,
  convertBatch,
  formatValue,
  UnitConversionError,
} from './conversion.js';

// Constants
export {
  constants,
  getConstant,
  getAllConstants,
  R,
  F,
  NA,
  h,
  c,
  kB,
} from './constants.js';

// Reconciliation
export {
  reconcileUnits,
  applyReconciliation,
  convertResult,
  describeReconciliation,
  validateUnitSelections,
  getDisabledUnits,
  ReconciliationError,
} from './reconciliation.js';

// Re-export unit definitions for direct access if needed
export { allUnitDefinitions } from './units/index.js';
