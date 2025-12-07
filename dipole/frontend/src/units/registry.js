/**
 * Unit Registry
 *
 * Central registry for looking up and managing unit definitions.
 * Provides fast lookup by ID and filtering by dimension.
 */

import { allUnitDefinitions } from './units/index.js';
import { siBaseUnits } from './dimensions.js';

// Build lookup maps for fast access
const unitById = new Map();
const unitsByDimension = new Map();

// Initialize the registry
function initializeRegistry() {
  for (const unit of allUnitDefinitions) {
    // Add to ID map
    unitById.set(unit.id, unit);

    // Add to dimension map
    if (!unitsByDimension.has(unit.dimension)) {
      unitsByDimension.set(unit.dimension, []);
    }
    unitsByDimension.get(unit.dimension).push(unit);
  }
}

// Initialize on module load
initializeRegistry();

/**
 * Get a unit definition by ID
 * @param {string} id - Unit ID (e.g., 'atm', 'L', 'K')
 * @returns {Object|undefined} Unit definition or undefined if not found
 */
export function getUnit(id) {
  return unitById.get(id);
}

/**
 * Check if a unit exists in the registry
 * @param {string} id - Unit ID
 * @returns {boolean}
 */
export function hasUnit(id) {
  return unitById.has(id);
}

/**
 * Get all units for a given dimension
 * @param {string} dimension - Dimension value from Dimension enum
 * @returns {Object[]} Array of unit definitions
 */
export function getUnitsForDimension(dimension) {
  return unitsByDimension.get(dimension) || [];
}

/**
 * Get the SI base unit for a dimension
 * @param {string} dimension - Dimension value
 * @returns {Object|undefined} Base unit definition
 */
export function getBaseUnit(dimension) {
  const baseUnitId = siBaseUnits[dimension];
  return baseUnitId ? getUnit(baseUnitId) : undefined;
}

/**
 * Get the SI base unit ID for a dimension
 * @param {string} dimension - Dimension value
 * @returns {string|undefined} Base unit ID
 */
export function getBaseUnitId(dimension) {
  return siBaseUnits[dimension];
}

/**
 * Get all units compatible with a given unit (same dimension)
 * @param {string} unitId - Unit ID
 * @returns {Object[]} Array of compatible unit definitions
 */
export function getCompatibleUnits(unitId) {
  const unit = getUnit(unitId);
  if (!unit) return [];
  return getUnitsForDimension(unit.dimension);
}

/**
 * Get all registered units
 * @returns {Object[]} Array of all unit definitions
 */
export function getAllUnits() {
  return [...unitById.values()];
}

/**
 * Get units filtered by tags
 * @param {string[]} tags - Tags to filter by (OR logic)
 * @returns {Object[]} Units that have at least one of the specified tags
 */
export function getUnitsByTags(tags) {
  return getAllUnits().filter(unit =>
    unit.tags && unit.tags.some(tag => tags.includes(tag))
  );
}

/**
 * Get units filtered by system
 * @param {string} system - System to filter by (e.g., 'SI', 'imperial', 'metric')
 * @returns {Object[]} Units that belong to the specified system
 */
export function getUnitsBySystem(system) {
  return getAllUnits().filter(unit => unit.system === system);
}

/**
 * Get a default alternative unit for a dimension (for converter UI)
 * Returns a commonly used non-base unit
 * @param {string} dimension - Dimension value
 * @returns {Object|undefined} A common non-base unit for the dimension
 */
export function getDefaultAltUnit(dimension) {
  const units = getUnitsForDimension(dimension);
  // Return first non-base unit, or the base unit if only one exists
  return units.find(u => !u.isBase) || units[0];
}

/**
 * Search units by name or symbol
 * @param {string} query - Search query
 * @returns {Object[]} Matching units
 */
export function searchUnits(query) {
  const lowerQuery = query.toLowerCase();
  return getAllUnits().filter(unit =>
    unit.name.toLowerCase().includes(lowerQuery) ||
    unit.symbol.toLowerCase().includes(lowerQuery) ||
    unit.id.toLowerCase().includes(lowerQuery)
  );
}

export default {
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
};
