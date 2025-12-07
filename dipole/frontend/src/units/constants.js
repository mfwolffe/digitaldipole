/**
 * Physical Constants System
 *
 * Provides chemistry constants (R, F, NA, etc.) with unit-aware values.
 * Uses a hybrid approach: pre-computed common variants for speed,
 * with runtime calculation fallback for exotic unit combinations.
 */

import { convert, getConversionFactor } from './conversion.js';
import { getBaseUnitId } from './registry.js';

/**
 * Gas Constant (R)
 *
 * Appears in: PV = nRT (ideal gas law), Arrhenius equation, Nernst equation
 * SI base: 8.31446261815324 J/(mol·K)
 */
export const R = {
  id: 'R',
  name: 'Gas Constant',
  symbol: 'R',
  htmlSymbol: 'R',

  // Base value in SI units: J/(mol·K)
  baseValue: 8.31446261815324,
  baseDimensions: {
    energy: 'J',
    amount: 'mol',
    temperature: 'K',
  },

  // Pre-computed variants for common unit combinations (fast lookup)
  variants: [
    {
      value: 8.31446261815324,
      units: { energy: 'J', amount: 'mol', temperature: 'K' },
      display: 'J/(mol·K)',
      htmlDisplay: 'J/(mol·K)',
    },
    {
      value: 8.314,
      units: { energy: 'J', amount: 'mol', temperature: 'K' },
      display: 'J/(mol·K)',
      htmlDisplay: 'J/(mol·K)',
      rounded: true,
    },
    {
      // For PV = nRT with P in atm, V in L
      value: 0.0820574614,
      units: { pressure: 'atm', volume: 'L', amount: 'mol', temperature: 'K' },
      display: 'L·atm/(mol·K)',
      htmlDisplay: 'L·atm/(mol·K)',
    },
    {
      value: 0.0821,
      units: { pressure: 'atm', volume: 'L', amount: 'mol', temperature: 'K' },
      display: 'L·atm/(mol·K)',
      htmlDisplay: 'L·atm/(mol·K)',
      rounded: true,
    },
    {
      value: 62.363598,
      units: { pressure: 'mmHg', volume: 'L', amount: 'mol', temperature: 'K' },
      display: 'L·mmHg/(mol·K)',
      htmlDisplay: 'L·mmHg/(mol·K)',
    },
    {
      value: 62.364,
      units: { pressure: 'mmHg', volume: 'L', amount: 'mol', temperature: 'K' },
      display: 'L·mmHg/(mol·K)',
      htmlDisplay: 'L·mmHg/(mol·K)',
      rounded: true,
    },
    {
      value: 8.20574e-2,
      units: { pressure: 'bar', volume: 'L', amount: 'mol', temperature: 'K' },
      display: 'L·bar/(mol·K)',
      htmlDisplay: 'L·bar/(mol·K)',
    },
    {
      value: 8.31446261815324e-3,
      units: { energy: 'kJ', amount: 'mol', temperature: 'K' },
      display: 'kJ/(mol·K)',
      htmlDisplay: 'kJ/(mol·K)',
    },
    {
      value: 1.98720425864,
      units: { energy: 'cal', amount: 'mol', temperature: 'K' },
      display: 'cal/(mol·K)',
      htmlDisplay: 'cal/(mol·K)',
    },
    {
      value: 1.987,
      units: { energy: 'cal', amount: 'mol', temperature: 'K' },
      display: 'cal/(mol·K)',
      htmlDisplay: 'cal/(mol·K)',
      rounded: true,
    },
  ],

  /**
   * Get constant value for a given unit context
   * First checks pre-computed variants, then falls back to runtime calculation
   * @param {Object} unitContext - Map of dimension to unit ID
   * @returns {number} Constant value for that unit context
   */
  getForUnits(unitContext) {
    // Try to find pre-computed variant (prefer exact match, allow rounded)
    const exactMatch = this.variants.find(v =>
      !v.rounded && Object.entries(v.units).every(([dim, unit]) => unitContext[dim] === unit)
    );
    if (exactMatch) return exactMatch.value;

    const roundedMatch = this.variants.find(v =>
      Object.entries(v.units).every(([dim, unit]) => unitContext[dim] === unit)
    );
    if (roundedMatch) return roundedMatch.value;

    // Fall back to runtime calculation
    return this.computeForUnits(unitContext);
  },

  /**
   * Compute R for arbitrary unit combinations using conversion factors
   */
  computeForUnits(unitContext) {
    // R has dimensions: energy/(amount·temperature)
    // R_new = R_SI * (J → target_energy) / (mol → target_amount) / (K → target_temp)
    let value = this.baseValue;

    if (unitContext.energy && unitContext.energy !== 'J') {
      const factor = getConversionFactor('J', unitContext.energy);
      if (factor) value *= factor;
    }

    if (unitContext.amount && unitContext.amount !== 'mol') {
      const factor = getConversionFactor('mol', unitContext.amount);
      if (factor) value /= factor;
    }

    // Temperature: for R, we're dealing with temperature differences (ΔT)
    // which are the same in K and °C, so only worry about actual scale changes

    // For PV = nRT form (pressure × volume units)
    if (unitContext.pressure && unitContext.volume) {
      // Need to convert from J to pressure × volume
      // J = Pa × m³, so:
      // R in pressure × volume = R_SI × (Pa → target_pressure) × (m³ → target_volume)
      const pressureFactor = getConversionFactor('Pa', unitContext.pressure) || 1;
      const volumeFactor = getConversionFactor('m3', unitContext.volume) || 1;
      // Recalculate from base
      value = this.baseValue * pressureFactor * volumeFactor;
    }

    return value;
  },

  /**
   * Get display string for a unit context
   */
  getDisplayForUnits(unitContext) {
    const variant = this.variants.find(v =>
      Object.entries(v.units).every(([dim, unit]) => unitContext[dim] === unit)
    );
    return variant?.display || 'J/(mol·K)';
  },
};

/**
 * Faraday Constant (F)
 *
 * Appears in: Nernst equation, electrolysis calculations
 * SI base: 96485.33212 C/mol
 */
export const F = {
  id: 'F',
  name: 'Faraday Constant',
  symbol: 'F',
  htmlSymbol: 'F',

  baseValue: 96485.33212,
  baseDimensions: {
    charge: 'C',
    amount: 'mol',
  },

  variants: [
    {
      value: 96485.33212,
      units: { charge: 'C', amount: 'mol' },
      display: 'C/mol',
      htmlDisplay: 'C/mol',
    },
    {
      value: 96485,
      units: { charge: 'C', amount: 'mol' },
      display: 'C/mol',
      htmlDisplay: 'C/mol',
      rounded: true,
    },
    {
      value: 96.485,
      units: { charge: 'C', amount: 'mmol' },
      display: 'C/mmol',
      htmlDisplay: 'C/mmol',
    },
    {
      value: 23.061,
      units: { energy: 'kcal', amount: 'mol', voltage: 'V' },
      display: 'kcal/(mol·V)',
      htmlDisplay: 'kcal/(mol·V)',
      rounded: true,
    },
  ],

  getForUnits(unitContext) {
    const match = this.variants.find(v =>
      Object.entries(v.units).every(([dim, unit]) => unitContext[dim] === unit)
    );
    if (match) return match.value;
    return this.computeForUnits(unitContext);
  },

  computeForUnits(unitContext) {
    let value = this.baseValue;

    if (unitContext.charge && unitContext.charge !== 'C') {
      const factor = getConversionFactor('C', unitContext.charge);
      if (factor) value *= factor;
    }

    if (unitContext.amount && unitContext.amount !== 'mol') {
      const factor = getConversionFactor('mol', unitContext.amount);
      if (factor) value /= factor;
    }

    return value;
  },
};

/**
 * Avogadro's Number (NA)
 *
 * Appears in: Converting between particles and moles
 * Dimensionless: 6.02214076 × 10²³ mol⁻¹
 */
export const NA = {
  id: 'NA',
  name: "Avogadro's Number",
  symbol: 'N_A',
  htmlSymbol: 'N<sub>A</sub>',

  baseValue: 6.02214076e23,
  baseDimensions: {},  // Dimensionless

  variants: [
    {
      value: 6.02214076e23,
      units: {},
      display: 'mol⁻¹',
      htmlDisplay: 'mol<sup>-1</sup>',
    },
    {
      value: 6.022e23,
      units: {},
      display: 'mol⁻¹',
      htmlDisplay: 'mol<sup>-1</sup>',
      rounded: true,
    },
  ],

  getForUnits(_unitContext) {
    // Dimensionless - always the same value
    return this.baseValue;
  },

  computeForUnits(_unitContext) {
    return this.baseValue;
  },
};

/**
 * Planck's Constant (h)
 *
 * Appears in: Quantum chemistry, spectroscopy
 * SI base: 6.62607015 × 10⁻³⁴ J·s
 */
export const h = {
  id: 'h',
  name: "Planck's Constant",
  symbol: 'h',
  htmlSymbol: 'h',

  baseValue: 6.62607015e-34,
  baseDimensions: {
    energy: 'J',
    time: 's',
  },

  variants: [
    {
      value: 6.62607015e-34,
      units: { energy: 'J', time: 's' },
      display: 'J·s',
      htmlDisplay: 'J·s',
    },
    {
      value: 4.135667696e-15,
      units: { energy: 'eV', time: 's' },
      display: 'eV·s',
      htmlDisplay: 'eV·s',
    },
  ],

  getForUnits(unitContext) {
    const match = this.variants.find(v =>
      Object.entries(v.units).every(([dim, unit]) => unitContext[dim] === unit)
    );
    if (match) return match.value;
    return this.computeForUnits(unitContext);
  },

  computeForUnits(unitContext) {
    let value = this.baseValue;

    if (unitContext.energy && unitContext.energy !== 'J') {
      const factor = getConversionFactor('J', unitContext.energy);
      if (factor) value *= factor;
    }

    if (unitContext.time && unitContext.time !== 's') {
      const factor = getConversionFactor('s', unitContext.time);
      if (factor) value *= factor;
    }

    return value;
  },
};

/**
 * Speed of Light (c)
 */
export const c = {
  id: 'c',
  name: 'Speed of Light',
  symbol: 'c',
  htmlSymbol: 'c',

  baseValue: 299792458,  // m/s (exact by definition)
  baseDimensions: {
    length: 'm',
    time: 's',
  },

  variants: [
    {
      value: 299792458,
      units: { length: 'm', time: 's' },
      display: 'm/s',
      htmlDisplay: 'm/s',
    },
    {
      value: 2.998e8,
      units: { length: 'm', time: 's' },
      display: 'm/s',
      htmlDisplay: 'm/s',
      rounded: true,
    },
    {
      value: 2.998e10,
      units: { length: 'cm', time: 's' },
      display: 'cm/s',
      htmlDisplay: 'cm/s',
    },
  ],

  getForUnits(unitContext) {
    const match = this.variants.find(v =>
      Object.entries(v.units).every(([dim, unit]) => unitContext[dim] === unit)
    );
    if (match) return match.value;
    return this.computeForUnits(unitContext);
  },

  computeForUnits(unitContext) {
    let value = this.baseValue;

    if (unitContext.length && unitContext.length !== 'm') {
      const factor = getConversionFactor('m', unitContext.length);
      if (factor) value *= factor;
    }

    if (unitContext.time && unitContext.time !== 's') {
      const factor = getConversionFactor('s', unitContext.time);
      if (factor) value /= factor;
    }

    return value;
  },
};

/**
 * Boltzmann Constant (kB)
 */
export const kB = {
  id: 'kB',
  name: 'Boltzmann Constant',
  symbol: 'k_B',
  htmlSymbol: 'k<sub>B</sub>',

  baseValue: 1.380649e-23,  // J/K
  baseDimensions: {
    energy: 'J',
    temperature: 'K',
  },

  variants: [
    {
      value: 1.380649e-23,
      units: { energy: 'J', temperature: 'K' },
      display: 'J/K',
      htmlDisplay: 'J/K',
    },
    {
      value: 8.617333262e-5,
      units: { energy: 'eV', temperature: 'K' },
      display: 'eV/K',
      htmlDisplay: 'eV/K',
    },
  ],

  getForUnits(unitContext) {
    const match = this.variants.find(v =>
      Object.entries(v.units).every(([dim, unit]) => unitContext[dim] === unit)
    );
    if (match) return match.value;
    return this.computeForUnits(unitContext);
  },

  computeForUnits(unitContext) {
    let value = this.baseValue;

    if (unitContext.energy && unitContext.energy !== 'J') {
      const factor = getConversionFactor('J', unitContext.energy);
      if (factor) value *= factor;
    }

    return value;
  },
};

/**
 * All constants in a registry
 */
export const constants = {
  R,
  F,
  NA,
  h,
  c,
  kB,
};

/**
 * Get a constant by ID
 * @param {string} id - Constant ID (e.g., 'R', 'F', 'NA')
 * @returns {Object|undefined} Constant definition
 */
export function getConstant(id) {
  return constants[id];
}

/**
 * Get all available constants
 * @returns {Object[]} Array of constant definitions
 */
export function getAllConstants() {
  return Object.values(constants);
}

export default constants;
