/**
 * Time Units
 *
 * SI base unit: Second (s)
 */

import { Dimension } from '../dimensions.js';

export const timeUnits = [
  {
    id: 's',
    name: 'Second',
    symbol: 's',
    htmlSymbol: 's',
    dimension: Dimension.TIME,
    factor: 1,
    offset: 0,
    system: 'SI',
    isBase: true,
    tags: ['chemistry', 'physics', 'kinetics'],
  },
  {
    id: 'ms',
    name: 'Millisecond',
    symbol: 'ms',
    htmlSymbol: 'ms',
    dimension: Dimension.TIME,
    factor: 0.001,
    offset: 0,
    system: 'SI',
    isBase: false,
    tags: ['kinetics'],
  },
  {
    id: 'us',
    name: 'Microsecond',
    symbol: 'μs',
    htmlSymbol: 'μs',
    dimension: Dimension.TIME,
    factor: 0.000001,
    offset: 0,
    system: 'SI',
    isBase: false,
    tags: ['kinetics'],
  },
  {
    id: 'ns',
    name: 'Nanosecond',
    symbol: 'ns',
    htmlSymbol: 'ns',
    dimension: Dimension.TIME,
    factor: 1e-9,
    offset: 0,
    system: 'SI',
    isBase: false,
    tags: ['kinetics'],
  },
  {
    id: 'min',
    name: 'Minute',
    symbol: 'min',
    htmlSymbol: 'min',
    dimension: Dimension.TIME,
    factor: 60,
    offset: 0,
    system: 'common',
    isBase: false,
    tags: ['kinetics', 'everyday'],
  },
  {
    id: 'h',
    name: 'Hour',
    symbol: 'h',
    htmlSymbol: 'h',
    dimension: Dimension.TIME,
    factor: 3600,
    offset: 0,
    system: 'common',
    isBase: false,
    tags: ['kinetics', 'everyday'],
  },
  {
    id: 'd',
    name: 'Day',
    symbol: 'd',
    htmlSymbol: 'd',
    dimension: Dimension.TIME,
    factor: 86400,
    offset: 0,
    system: 'common',
    isBase: false,
    tags: ['everyday'],
  },
  {
    id: 'yr',
    name: 'Year',
    symbol: 'yr',
    htmlSymbol: 'yr',
    dimension: Dimension.TIME,
    factor: 31557600,  // Julian year (365.25 days)
    offset: 0,
    system: 'common',
    isBase: false,
    tags: ['nuclear', 'geology'],
  },
];

export default timeUnits;
