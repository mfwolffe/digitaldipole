/**
 * Unit Conversion Engine
 *
 * Handles conversion between units of the same dimension.
 * All conversions go through the SI base unit as an intermediary.
 */

import { getUnit, getBaseUnitId } from './registry.js';

/**
 * Custom error for unit conversion failures
 */
export class UnitConversionError extends Error {
  constructor(message, fromUnit, toUnit) {
    super(message);
    this.name = 'UnitConversionError';
    this.fromUnit = fromUnit;
    this.toUnit = toUnit;
  }
}

/**
 * Convert a value to the SI base unit for its dimension
 * @param {number} value - The value to convert
 * @param {Object} unit - The unit definition
 * @returns {number} Value in SI base units
 */
function toBase(value, unit) {
  // Temperature and other non-linear conversions use functions
  if (typeof unit.toBase === 'function') {
    return unit.toBase(value);
  }
  // Linear conversions use factor and offset
  // baseValue = (value + offset) * factor
  // For most units, offset is 0
  return (value + (unit.offset || 0)) * unit.factor;
}

/**
 * Convert a value from the SI base unit to a target unit
 * @param {number} baseValue - The value in SI base units
 * @param {Object} unit - The target unit definition
 * @returns {number} Value in the target unit
 */
function fromBase(baseValue, unit) {
  // Temperature and other non-linear conversions use functions
  if (typeof unit.fromBase === 'function') {
    return unit.fromBase(baseValue);
  }
  // Linear conversions use factor and offset
  // value = baseValue / factor - offset
  return baseValue / unit.factor - (unit.offset || 0);
}

/**
 * Convert a value between units
 *
 * @param {number} value - The numeric value to convert
 * @param {string} fromUnitId - Source unit ID (e.g., 'atm')
 * @param {string} toUnitId - Target unit ID (e.g., 'kPa')
 * @returns {number} The converted value
 * @throws {UnitConversionError} If units are incompatible or not found
 *
 * @example
 * convert(1, 'atm', 'kPa')     // 101.325
 * convert(25, 'C', 'K')        // 298.15
 * convert(1, 'L', 'mL')        // 1000
 */
export function convert(value, fromUnitId, toUnitId) {
  // Short-circuit if same unit
  if (fromUnitId === toUnitId) {
    return value;
  }

  // Handle null/undefined values
  if (value === null || value === undefined || isNaN(value)) {
    return value;
  }

  // Get unit definitions
  const fromUnit = getUnit(fromUnitId);
  const toUnit = getUnit(toUnitId);

  if (!fromUnit) {
    throw new UnitConversionError(
      `Unknown source unit: ${fromUnitId}`,
      fromUnitId,
      toUnitId
    );
  }

  if (!toUnit) {
    throw new UnitConversionError(
      `Unknown target unit: ${toUnitId}`,
      fromUnitId,
      toUnitId
    );
  }

  // Check dimension compatibility
  if (fromUnit.dimension !== toUnit.dimension) {
    throw new UnitConversionError(
      `Cannot convert ${fromUnitId} (${fromUnit.dimension}) to ${toUnitId} (${toUnit.dimension}): incompatible dimensions`,
      fromUnitId,
      toUnitId
    );
  }

  // Convert: source → SI base → target
  const baseValue = toBase(value, fromUnit);
  return fromBase(baseValue, toUnit);
}

/**
 * Get the conversion factor between two units (for display)
 * Only works for linear conversions (not temperature)
 *
 * @param {string} fromUnitId - Source unit ID
 * @param {string} toUnitId - Target unit ID
 * @returns {number|null} Conversion factor, or null if non-linear
 *
 * @example
 * getConversionFactor('L', 'mL')   // 1000
 * getConversionFactor('atm', 'kPa')  // 101.325
 * getConversionFactor('C', 'K')   // null (non-linear)
 */
export function getConversionFactor(fromUnitId, toUnitId) {
  if (fromUnitId === toUnitId) return 1;

  const fromUnit = getUnit(fromUnitId);
  const toUnit = getUnit(toUnitId);

  if (!fromUnit || !toUnit) return null;
  if (fromUnit.dimension !== toUnit.dimension) return null;

  // Check if either unit uses non-linear conversion
  if (typeof fromUnit.toBase === 'function' || typeof toUnit.fromBase === 'function') {
    return null;
  }

  // Linear conversion: factor = fromUnit.factor / toUnit.factor
  return fromUnit.factor / toUnit.factor;
}

/**
 * Check if conversion between two units is possible
 *
 * @param {string} fromUnitId - Source unit ID
 * @param {string} toUnitId - Target unit ID
 * @returns {boolean} True if conversion is possible
 */
export function canConvert(fromUnitId, toUnitId) {
  if (fromUnitId === toUnitId) return true;

  const fromUnit = getUnit(fromUnitId);
  const toUnit = getUnit(toUnitId);

  if (!fromUnit || !toUnit) return false;
  return fromUnit.dimension === toUnit.dimension;
}

/**
 * Convert a value to SI base units
 *
 * @param {number} value - The value to convert
 * @param {string} unitId - Current unit ID
 * @returns {number} Value in SI base units
 */
export function convertToSI(value, unitId) {
  const unit = getUnit(unitId);
  if (!unit) {
    throw new UnitConversionError(`Unknown unit: ${unitId}`, unitId, null);
  }

  const baseUnitId = getBaseUnitId(unit.dimension);
  return convert(value, unitId, baseUnitId);
}

/**
 * Convert a value from SI base units to a target unit
 *
 * @param {number} value - The value in SI base units
 * @param {string} dimension - The dimension
 * @param {string} toUnitId - Target unit ID
 * @returns {number} Converted value
 */
export function convertFromSI(value, dimension, toUnitId) {
  const baseUnitId = getBaseUnitId(dimension);
  return convert(value, baseUnitId, toUnitId);
}

/**
 * Batch convert multiple values
 *
 * @param {number[]} values - Array of values to convert
 * @param {string} fromUnitId - Source unit ID
 * @param {string} toUnitId - Target unit ID
 * @returns {number[]} Array of converted values
 */
export function convertBatch(values, fromUnitId, toUnitId) {
  if (fromUnitId === toUnitId) return [...values];
  return values.map(v => convert(v, fromUnitId, toUnitId));
}

/**
 * Format a converted value with appropriate precision
 *
 * @param {number} value - The numeric value
 * @param {number} significantFigures - Number of significant figures (default 6)
 * @returns {string} Formatted value string
 */
export function formatValue(value, significantFigures = 6) {
  if (value === 0) return '0';
  if (!isFinite(value)) return String(value);

  const magnitude = Math.floor(Math.log10(Math.abs(value)));

  // Use scientific notation for very large or small numbers
  if (magnitude > 6 || magnitude < -4) {
    return value.toExponential(significantFigures - 1);
  }

  // Use fixed notation for reasonable numbers
  const decimalPlaces = Math.max(0, significantFigures - magnitude - 1);
  return value.toFixed(decimalPlaces);
}

export default {
  convert,
  getConversionFactor,
  canConvert,
  convertToSI,
  convertFromSI,
  convertBatch,
  formatValue,
  UnitConversionError,
};
