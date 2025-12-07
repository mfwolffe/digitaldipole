/**
 * Compound Unit Definitions
 *
 * Units that are composed of multiple base dimensions.
 * Includes: molar mass, density, molar heat capacity, specific heat, etc.
 */

import { Dimension } from '../dimensions.js';

// Molar Mass (mass/amount)
export const molarMassUnits = [
  {
    id: 'kg_per_mol',
    name: 'Kilogram per Mole',
    symbol: 'kg/mol',
    htmlSymbol: 'kg/mol',
    dimension: Dimension.MOLAR_MASS,
    factor: 1,
    offset: 0,
    system: 'SI',
    isBase: true,
    tags: ['chemistry'],
    // Composition info for compound conversion
    composition: { mass: 'kg', amount: 'mol' },
  },
  {
    id: 'g_per_mol',
    name: 'Gram per Mole',
    symbol: 'g/mol',
    htmlSymbol: 'g/mol',
    dimension: Dimension.MOLAR_MASS,
    factor: 0.001,
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['chemistry'],
    composition: { mass: 'g', amount: 'mol' },
  },
  {
    id: 'mg_per_mol',
    name: 'Milligram per Mole',
    symbol: 'mg/mol',
    htmlSymbol: 'mg/mol',
    dimension: Dimension.MOLAR_MASS,
    factor: 0.000001,
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['chemistry'],
    composition: { mass: 'mg', amount: 'mol' },
  },
  {
    id: 'kg_per_kmol',
    name: 'Kilogram per Kilomole',
    symbol: 'kg/kmol',
    htmlSymbol: 'kg/kmol',
    dimension: Dimension.MOLAR_MASS,
    factor: 0.001,  // 1 kg/kmol = 0.001 kg/mol = 1 g/mol
    offset: 0,
    system: 'engineering',
    isBase: false,
    tags: ['engineering'],
    composition: { mass: 'kg', amount: 'kmol' },
  },
];

// Density (mass/volume)
export const densityUnits = [
  {
    id: 'kg_per_m3',
    name: 'Kilogram per Cubic Meter',
    symbol: 'kg/m³',
    htmlSymbol: 'kg/m<sup>3</sup>',
    dimension: Dimension.DENSITY,
    factor: 1,
    offset: 0,
    system: 'SI',
    isBase: true,
    tags: ['physics'],
    composition: { mass: 'kg', volume: 'm3' },
  },
  {
    id: 'g_per_L',
    name: 'Gram per Liter',
    symbol: 'g/L',
    htmlSymbol: 'g/L',
    dimension: Dimension.DENSITY,
    factor: 1,  // 1 g/L = 1 kg/m³
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['chemistry', 'gas-laws'],
    composition: { mass: 'g', volume: 'L' },
  },
  {
    id: 'g_per_mL',
    name: 'Gram per Milliliter',
    symbol: 'g/mL',
    htmlSymbol: 'g/mL',
    dimension: Dimension.DENSITY,
    factor: 1000,  // 1 g/mL = 1000 kg/m³
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['chemistry'],
    composition: { mass: 'g', volume: 'mL' },
  },
  {
    id: 'g_per_cm3',
    name: 'Gram per Cubic Centimeter',
    symbol: 'g/cm³',
    htmlSymbol: 'g/cm<sup>3</sup>',
    dimension: Dimension.DENSITY,
    factor: 1000,  // Same as g/mL
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['chemistry'],
    composition: { mass: 'g', volume: 'cm3' },
  },
  {
    id: 'kg_per_L',
    name: 'Kilogram per Liter',
    symbol: 'kg/L',
    htmlSymbol: 'kg/L',
    dimension: Dimension.DENSITY,
    factor: 1000,
    offset: 0,
    system: 'common',
    isBase: false,
    tags: ['common'],
    composition: { mass: 'kg', volume: 'L' },
  },
  {
    id: 'lb_per_ft3',
    name: 'Pound per Cubic Foot',
    symbol: 'lb/ft³',
    htmlSymbol: 'lb/ft<sup>3</sup>',
    dimension: Dimension.DENSITY,
    factor: 16.0185,  // 1 lb/ft³ ≈ 16.0185 kg/m³
    offset: 0,
    system: 'imperial',
    isBase: false,
    tags: ['imperial'],
    composition: { mass: 'lb', volume: 'ft3' },
  },
];

// Molar Heat Capacity (energy/(amount·temperature))
// Different from regular heat capacity which is energy/(mass·temperature)
export const molarHeatCapacityUnits = [
  {
    id: 'J_per_mol_K',
    name: 'Joule per Mole Kelvin',
    symbol: 'J/(mol·K)',
    htmlSymbol: 'J/(mol·K)',
    dimension: Dimension.MOLAR_HEAT_CAPACITY,
    factor: 1,
    offset: 0,
    system: 'SI',
    isBase: true,
    tags: ['thermodynamics'],
    composition: { energy: 'J', amount: 'mol', temperature: 'K' },
  },
  {
    id: 'kJ_per_mol_K',
    name: 'Kilojoule per Mole Kelvin',
    symbol: 'kJ/(mol·K)',
    htmlSymbol: 'kJ/(mol·K)',
    dimension: Dimension.MOLAR_HEAT_CAPACITY,
    factor: 1000,
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['thermodynamics'],
    composition: { energy: 'kJ', amount: 'mol', temperature: 'K' },
  },
  {
    id: 'cal_per_mol_K',
    name: 'Calorie per Mole Kelvin',
    symbol: 'cal/(mol·K)',
    htmlSymbol: 'cal/(mol·K)',
    dimension: Dimension.MOLAR_HEAT_CAPACITY,
    factor: 4.184,
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['thermodynamics'],
    composition: { energy: 'cal', amount: 'mol', temperature: 'K' },
  },
  {
    id: 'kcal_per_mol_K',
    name: 'Kilocalorie per Mole Kelvin',
    symbol: 'kcal/(mol·K)',
    htmlSymbol: 'kcal/(mol·K)',
    dimension: Dimension.MOLAR_HEAT_CAPACITY,
    factor: 4184,
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['thermodynamics'],
    composition: { energy: 'kcal', amount: 'mol', temperature: 'K' },
  },
];

// Specific Heat Capacity (energy/(mass·temperature))
// Already defined in other.js as heatCapacityUnits, but adding more variants
export const specificHeatUnits = [
  {
    id: 'J_per_kg_K_specific',
    name: 'Joule per Kilogram Kelvin',
    symbol: 'J/(kg·K)',
    htmlSymbol: 'J/(kg·K)',
    dimension: Dimension.HEAT_CAPACITY,
    factor: 1,
    offset: 0,
    system: 'SI',
    isBase: true,
    tags: ['thermodynamics'],
    composition: { energy: 'J', mass: 'kg', temperature: 'K' },
  },
  {
    id: 'kJ_per_kg_K',
    name: 'Kilojoule per Kilogram Kelvin',
    symbol: 'kJ/(kg·K)',
    htmlSymbol: 'kJ/(kg·K)',
    dimension: Dimension.HEAT_CAPACITY,
    factor: 1000,
    offset: 0,
    system: 'SI',
    isBase: false,
    tags: ['thermodynamics'],
    composition: { energy: 'kJ', mass: 'kg', temperature: 'K' },
  },
  {
    id: 'BTU_per_lb_F',
    name: 'BTU per Pound Fahrenheit',
    symbol: 'BTU/(lb·°F)',
    htmlSymbol: 'BTU/(lb·°F)',
    dimension: Dimension.HEAT_CAPACITY,
    factor: 4186.8,  // 1 BTU/(lb·°F) ≈ 4186.8 J/(kg·K)
    offset: 0,
    system: 'imperial',
    isBase: false,
    tags: ['thermodynamics', 'imperial'],
    composition: { energy: 'BTU', mass: 'lb', temperature: 'F' },
  },
];

// Molar Entropy (energy/(amount·temperature)) - same dimension as molar heat capacity
export const molarEntropyUnits = [
  {
    id: 'J_per_mol_K_entropy',
    name: 'Joule per Mole Kelvin',
    symbol: 'J/(mol·K)',
    htmlSymbol: 'J/(mol·K)',
    dimension: Dimension.MOLAR_ENTROPY,
    factor: 1,
    offset: 0,
    system: 'SI',
    isBase: true,
    tags: ['thermodynamics'],
    composition: { energy: 'J', amount: 'mol', temperature: 'K' },
  },
  {
    id: 'kJ_per_mol_K_entropy',
    name: 'Kilojoule per Mole Kelvin',
    symbol: 'kJ/(mol·K)',
    htmlSymbol: 'kJ/(mol·K)',
    dimension: Dimension.MOLAR_ENTROPY,
    factor: 1000,
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['thermodynamics'],
    composition: { energy: 'kJ', amount: 'mol', temperature: 'K' },
  },
  {
    id: 'cal_per_mol_K_entropy',
    name: 'Calorie per Mole Kelvin',
    symbol: 'cal/(mol·K)',
    htmlSymbol: 'cal/(mol·K)',
    dimension: Dimension.MOLAR_ENTROPY,
    factor: 4.184,
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['thermodynamics'],
    composition: { energy: 'cal', amount: 'mol', temperature: 'K' },
  },
];

// Molality (amount/mass) - moles of solute per kg of solvent
export const molalityUnits = [
  {
    id: 'mol_per_kg',
    name: 'Molal',
    symbol: 'm',
    htmlSymbol: 'm',
    dimension: Dimension.MOLALITY,
    factor: 1,
    offset: 0,
    system: 'chemistry',
    isBase: true,
    tags: ['solutions'],
    composition: { amount: 'mol', mass: 'kg' },
  },
  {
    id: 'mmol_per_kg',
    name: 'Millimolal',
    symbol: 'mm',
    htmlSymbol: 'mm',
    dimension: Dimension.MOLALITY,
    factor: 0.001,
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['solutions'],
    composition: { amount: 'mmol', mass: 'kg' },
  },
];

export const compoundUnits = [
  ...molarMassUnits,
  ...densityUnits,
  ...molarHeatCapacityUnits,
  ...specificHeatUnits,
  ...molarEntropyUnits,
  ...molalityUnits,
];

export default compoundUnits;
