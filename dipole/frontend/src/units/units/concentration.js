/**
 * Concentration Units
 *
 * SI base unit: mol/m³
 * Common unit: mol/L (Molar, M)
 */

import { Dimension } from '../dimensions.js';

export const concentrationUnits = [
  {
    id: 'mol_per_m3',
    name: 'Mole per Cubic Meter',
    symbol: 'mol/m³',
    htmlSymbol: 'mol/m<sup>3</sup>',
    dimension: Dimension.CONCENTRATION,
    factor: 1,
    offset: 0,
    system: 'SI',
    isBase: true,
    tags: ['physics'],
  },
  {
    id: 'M',
    name: 'Molar',
    symbol: 'M',
    htmlSymbol: 'M',
    dimension: Dimension.CONCENTRATION,
    factor: 1000,  // 1 M = 1 mol/L = 1000 mol/m³
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['chemistry', 'solutions'],
  },
  {
    id: 'mol_per_L',
    name: 'Mole per Liter',
    symbol: 'mol/L',
    htmlSymbol: 'mol/L',
    dimension: Dimension.CONCENTRATION,
    factor: 1000,
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['chemistry', 'solutions'],
  },
  {
    id: 'mM',
    name: 'Millimolar',
    symbol: 'mM',
    htmlSymbol: 'mM',
    dimension: Dimension.CONCENTRATION,
    factor: 1,  // 1 mM = 1 mmol/L = 1 mol/m³
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['chemistry', 'biochemistry'],
  },
  {
    id: 'uM',
    name: 'Micromolar',
    symbol: 'μM',
    htmlSymbol: 'μM',
    dimension: Dimension.CONCENTRATION,
    factor: 0.001,
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['biochemistry'],
  },
  {
    id: 'nM',
    name: 'Nanomolar',
    symbol: 'nM',
    htmlSymbol: 'nM',
    dimension: Dimension.CONCENTRATION,
    factor: 0.000001,
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['biochemistry'],
  },
  {
    id: 'pM',
    name: 'Picomolar',
    symbol: 'pM',
    htmlSymbol: 'pM',
    dimension: Dimension.CONCENTRATION,
    factor: 1e-9,
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['biochemistry'],
  },
  {
    id: 'N',
    name: 'Normal',
    symbol: 'N',
    htmlSymbol: 'N',
    dimension: Dimension.CONCENTRATION,
    factor: 1000,  // Equivalent concentration, same as M for monoprotic
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['chemistry', 'analytical'],
  },
  {
    id: 'molal',
    name: 'Molal',
    symbol: 'm',
    htmlSymbol: 'm',
    dimension: Dimension.CONCENTRATION,
    // Note: molality is mol/kg solvent, not exactly same dimension
    // but commonly treated as concentration for dilute aqueous solutions
    factor: 1000,  // Approximation for dilute aqueous
    offset: 0,
    system: 'chemistry',
    isBase: false,
    tags: ['chemistry', 'solutions'],
  },
  {
    id: 'g_per_L',
    name: 'Gram per Liter',
    symbol: 'g/L',
    htmlSymbol: 'g/L',
    dimension: Dimension.CONCENTRATION,
    // This is mass concentration, not molar - included for convenience
    // Factor is placeholder; actual conversion needs molar mass
    factor: 1,  // Placeholder - needs context
    offset: 0,
    system: 'common',
    isBase: false,
    tags: ['laboratory'],
  },
  {
    id: 'ppm',
    name: 'Parts per Million',
    symbol: 'ppm',
    htmlSymbol: 'ppm',
    dimension: Dimension.CONCENTRATION,
    // For aqueous solutions: 1 ppm ≈ 1 mg/L ≈ 1 g/m³
    factor: 0.001,  // Approximate for dilute aqueous
    offset: 0,
    system: 'common',
    isBase: false,
    tags: ['environmental', 'analytical'],
  },
  {
    id: 'ppb',
    name: 'Parts per Billion',
    symbol: 'ppb',
    htmlSymbol: 'ppb',
    dimension: Dimension.CONCENTRATION,
    factor: 0.000001,
    offset: 0,
    system: 'common',
    isBase: false,
    tags: ['environmental', 'analytical'],
  },
];

export default concentrationUnits;
