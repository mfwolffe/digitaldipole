/**
 * Unit Definitions Index
 *
 * Aggregates all unit definitions from individual dimension files.
 */

import pressureUnits from './pressure.js';
import volumeUnits from './volume.js';
import temperatureUnits from './temperature.js';
import massUnits from './mass.js';
import amountUnits from './amount.js';
import energyUnits from './energy.js';
import concentrationUnits from './concentration.js';
import timeUnits from './time.js';
import lengthUnits from './length.js';
import otherUnits from './other.js';
import compoundUnits from './compound.js';

/**
 * All unit definitions combined
 */
export const allUnitDefinitions = [
  ...pressureUnits,
  ...volumeUnits,
  ...temperatureUnits,
  ...massUnits,
  ...amountUnits,
  ...energyUnits,
  ...concentrationUnits,
  ...timeUnits,
  ...lengthUnits,
  ...otherUnits,
  ...compoundUnits,
];

export {
  pressureUnits,
  volumeUnits,
  temperatureUnits,
  massUnits,
  amountUnits,
  energyUnits,
  concentrationUnits,
  timeUnits,
  lengthUnits,
  otherUnits,
  compoundUnits,
};

export default allUnitDefinitions;
