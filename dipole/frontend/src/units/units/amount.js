/**
 * Amount of Substance Units
 *
 * SI base unit: Mole (mol)
 */

import { Dimension } from '../dimensions.js';

export const amountUnits = [
  {
    id: 'mol',
    name: 'Mole',
    symbol: 'mol',
    htmlSymbol: 'mol',
    dimension: Dimension.AMOUNT,
    factor: 1,
    offset: 0,
    system: 'SI',
    isBase: true,
    tags: ['chemistry'],
  },
  {
    id: 'mmol',
    name: 'Millimole',
    symbol: 'mmol',
    htmlSymbol: 'mmol',
    dimension: Dimension.AMOUNT,
    factor: 0.001,
    offset: 0,
    system: 'metric',
    isBase: false,
    tags: ['chemistry', 'biochemistry'],
  },
  {
    id: 'umol',
    name: 'Micromole',
    symbol: 'μmol',
    htmlSymbol: 'μmol',
    dimension: Dimension.AMOUNT,
    factor: 0.000001,
    offset: 0,
    system: 'metric',
    isBase: false,
    tags: ['biochemistry'],
  },
  {
    id: 'nmol',
    name: 'Nanomole',
    symbol: 'nmol',
    htmlSymbol: 'nmol',
    dimension: Dimension.AMOUNT,
    factor: 1e-9,
    offset: 0,
    system: 'metric',
    isBase: false,
    tags: ['biochemistry'],
  },
  {
    id: 'pmol',
    name: 'Picomole',
    symbol: 'pmol',
    htmlSymbol: 'pmol',
    dimension: Dimension.AMOUNT,
    factor: 1e-12,
    offset: 0,
    system: 'metric',
    isBase: false,
    tags: ['biochemistry'],
  },
  {
    id: 'kmol',
    name: 'Kilomole',
    symbol: 'kmol',
    htmlSymbol: 'kmol',
    dimension: Dimension.AMOUNT,
    factor: 1000,
    offset: 0,
    system: 'metric',
    isBase: false,
    tags: ['industrial'],
  },
];

export default amountUnits;
