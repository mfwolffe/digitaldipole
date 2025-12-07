/**
 * Other Chemistry-Related Units
 *
 * Includes: charge, voltage, entropy, heat capacity, rate constants, etc.
 */

import { Dimension } from '../dimensions.js';

// Electric Charge
export const chargeUnits = [
  {
    id: 'C',
    name: 'Coulomb',
    symbol: 'C',
    htmlSymbol: 'C',
    dimension: Dimension.CHARGE,
    factor: 1,
    offset: 0,
    system: 'SI',
    isBase: true,
    tags: ['electrochemistry'],
  },
  {
    id: 'mC',
    name: 'Millicoulomb',
    symbol: 'mC',
    htmlSymbol: 'mC',
    dimension: Dimension.CHARGE,
    factor: 0.001,
    offset: 0,
    system: 'SI',
    isBase: false,
    tags: ['electrochemistry'],
  },
  {
    id: 'uC',
    name: 'Microcoulomb',
    symbol: 'μC',
    htmlSymbol: 'μC',
    dimension: Dimension.CHARGE,
    factor: 0.000001,
    offset: 0,
    system: 'SI',
    isBase: false,
    tags: ['electrochemistry'],
  },
  {
    id: 'e',
    name: 'Elementary Charge',
    symbol: 'e',
    htmlSymbol: 'e',
    dimension: Dimension.CHARGE,
    factor: 1.602176634e-19,
    offset: 0,
    system: 'atomic',
    isBase: false,
    tags: ['atomic'],
  },
];

// Voltage
export const voltageUnits = [
  {
    id: 'V',
    name: 'Volt',
    symbol: 'V',
    htmlSymbol: 'V',
    dimension: Dimension.VOLTAGE,
    factor: 1,
    offset: 0,
    system: 'SI',
    isBase: true,
    tags: ['electrochemistry'],
  },
  {
    id: 'mV',
    name: 'Millivolt',
    symbol: 'mV',
    htmlSymbol: 'mV',
    dimension: Dimension.VOLTAGE,
    factor: 0.001,
    offset: 0,
    system: 'SI',
    isBase: false,
    tags: ['electrochemistry'],
  },
  {
    id: 'kV',
    name: 'Kilovolt',
    symbol: 'kV',
    htmlSymbol: 'kV',
    dimension: Dimension.VOLTAGE,
    factor: 1000,
    offset: 0,
    system: 'SI',
    isBase: false,
    tags: ['electrical'],
  },
];

// First-order rate constant (1/time)
export const rateConstantFirstUnits = [
  {
    id: 's_inv',
    name: 'Per Second',
    symbol: 's⁻¹',
    htmlSymbol: 's<sup>-1</sup>',
    dimension: Dimension.RATE_CONSTANT_FIRST,
    factor: 1,
    offset: 0,
    system: 'SI',
    isBase: true,
    tags: ['kinetics'],
  },
  {
    id: 'min_inv',
    name: 'Per Minute',
    symbol: 'min⁻¹',
    htmlSymbol: 'min<sup>-1</sup>',
    dimension: Dimension.RATE_CONSTANT_FIRST,
    factor: 1 / 60,
    offset: 0,
    system: 'common',
    isBase: false,
    tags: ['kinetics'],
  },
  {
    id: 'h_inv',
    name: 'Per Hour',
    symbol: 'h⁻¹',
    htmlSymbol: 'h<sup>-1</sup>',
    dimension: Dimension.RATE_CONSTANT_FIRST,
    factor: 1 / 3600,
    offset: 0,
    system: 'common',
    isBase: false,
    tags: ['kinetics'],
  },
];

// Second-order rate constant (volume/(amount·time))
export const rateConstantSecondUnits = [
  {
    id: 'm3_per_mol_s',
    name: 'Cubic Meter per Mole Second',
    symbol: 'm³/(mol·s)',
    htmlSymbol: 'm<sup>3</sup>/(mol·s)',
    dimension: Dimension.RATE_CONSTANT_SECOND,
    factor: 1,
    offset: 0,
    system: 'SI',
    isBase: true,
    tags: ['kinetics'],
  },
  {
    id: 'L_per_mol_s',
    name: 'Liter per Mole Second',
    symbol: 'L/(mol·s)',
    htmlSymbol: 'L/(mol·s)',
    dimension: Dimension.RATE_CONSTANT_SECOND,
    factor: 0.001,
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['kinetics'],
  },
  {
    id: 'M_inv_s_inv',
    name: 'Per Molar per Second',
    symbol: 'M⁻¹s⁻¹',
    htmlSymbol: 'M<sup>-1</sup>s<sup>-1</sup>',
    dimension: Dimension.RATE_CONSTANT_SECOND,
    factor: 0.001,  // Same as L/(mol·s)
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['kinetics'],
  },
];

// Entropy (energy/temperature)
export const entropyUnits = [
  {
    id: 'J_per_K',
    name: 'Joule per Kelvin',
    symbol: 'J/K',
    htmlSymbol: 'J/K',
    dimension: Dimension.ENTROPY,
    factor: 1,
    offset: 0,
    system: 'SI',
    isBase: true,
    tags: ['thermodynamics'],
  },
  {
    id: 'J_per_mol_K',
    name: 'Joule per Mole Kelvin',
    symbol: 'J/(mol·K)',
    htmlSymbol: 'J/(mol·K)',
    dimension: Dimension.ENTROPY,
    factor: 1,  // This is molar entropy; context-dependent
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['thermodynamics'],
  },
  {
    id: 'kJ_per_mol_K',
    name: 'Kilojoule per Mole Kelvin',
    symbol: 'kJ/(mol·K)',
    htmlSymbol: 'kJ/(mol·K)',
    dimension: Dimension.ENTROPY,
    factor: 1000,
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['thermodynamics'],
  },
  {
    id: 'cal_per_mol_K',
    name: 'Calorie per Mole Kelvin',
    symbol: 'cal/(mol·K)',
    htmlSymbol: 'cal/(mol·K)',
    dimension: Dimension.ENTROPY,
    factor: 4.184,
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['thermodynamics'],
  },
];

// Heat Capacity (energy/(mass·temperature))
export const heatCapacityUnits = [
  {
    id: 'J_per_kg_K',
    name: 'Joule per Kilogram Kelvin',
    symbol: 'J/(kg·K)',
    htmlSymbol: 'J/(kg·K)',
    dimension: Dimension.HEAT_CAPACITY,
    factor: 1,
    offset: 0,
    system: 'SI',
    isBase: true,
    tags: ['thermodynamics'],
  },
  {
    id: 'J_per_g_K',
    name: 'Joule per Gram Kelvin',
    symbol: 'J/(g·K)',
    htmlSymbol: 'J/(g·K)',
    dimension: Dimension.HEAT_CAPACITY,
    factor: 1000,
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['thermodynamics'],
  },
  {
    id: 'J_per_g_C',
    name: 'Joule per Gram Celsius',
    symbol: 'J/(g·°C)',
    htmlSymbol: 'J/(g·°C)',
    dimension: Dimension.HEAT_CAPACITY,
    factor: 1000,  // Same as J/(g·K) since ΔT is same in K and °C
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['thermodynamics'],
  },
  {
    id: 'cal_per_g_C',
    name: 'Calorie per Gram Celsius',
    symbol: 'cal/(g·°C)',
    htmlSymbol: 'cal/(g·°C)',
    dimension: Dimension.HEAT_CAPACITY,
    factor: 4184,
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['thermodynamics'],
  },
];

// Dimensionless
export const dimensionlessUnits = [
  {
    id: 'unitless',
    name: 'Unitless',
    symbol: '',
    htmlSymbol: '',
    dimension: Dimension.DIMENSIONLESS,
    factor: 1,
    offset: 0,
    system: 'any',
    isBase: true,
    tags: [],
  },
  {
    id: 'percent',
    name: 'Percent',
    symbol: '%',
    htmlSymbol: '%',
    dimension: Dimension.DIMENSIONLESS,
    factor: 0.01,
    offset: 0,
    system: 'common',
    isBase: false,
    tags: ['common'],
  },
];

export const otherUnits = [
  ...chargeUnits,
  ...voltageUnits,
  ...rateConstantFirstUnits,
  ...rateConstantSecondUnits,
  ...entropyUnits,
  ...heatCapacityUnits,
  ...dimensionlessUnits,
];

export default otherUnits;
