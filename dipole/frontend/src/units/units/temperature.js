/**
 * Temperature Units
 *
 * SI base unit: Kelvin (K)
 *
 * Note: Temperature conversions are non-linear (have offsets),
 * so we use toBase/fromBase functions instead of simple factors.
 */

import { Dimension } from '../dimensions.js';

export const temperatureUnits = [
  {
    id: 'K',
    name: 'Kelvin',
    symbol: 'K',
    htmlSymbol: 'K',
    dimension: Dimension.TEMPERATURE,
    // For Kelvin, toBase and fromBase are identity functions
    toBase: (value) => value,
    fromBase: (value) => value,
    system: 'SI',
    isBase: true,
    tags: ['chemistry', 'physics', 'thermodynamics'],
  },
  {
    id: 'degC',
    name: 'Celsius',
    symbol: '°C',
    htmlSymbol: '°C',
    dimension: Dimension.TEMPERATURE,
    toBase: (value) => value + 273.15,
    fromBase: (value) => value - 273.15,
    system: 'metric',
    isBase: false,
    tags: ['chemistry', 'everyday'],
  },
  {
    id: 'degF',
    name: 'Fahrenheit',
    symbol: '°F',
    htmlSymbol: '°F',
    dimension: Dimension.TEMPERATURE,
    toBase: (value) => (value - 32) * 5 / 9 + 273.15,
    fromBase: (value) => (value - 273.15) * 9 / 5 + 32,
    system: 'imperial',
    isBase: false,
    tags: ['everyday'],
  },
  {
    id: 'degR',
    name: 'Rankine',
    symbol: '°R',
    htmlSymbol: '°R',
    dimension: Dimension.TEMPERATURE,
    toBase: (value) => value * 5 / 9,
    fromBase: (value) => value * 9 / 5,
    system: 'imperial',
    isBase: false,
    tags: ['engineering'],
  },
];

export default temperatureUnits;
