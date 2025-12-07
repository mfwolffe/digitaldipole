/**
 * Dimension Types
 *
 * Physical dimensions that units can belong to.
 * Used to ensure unit compatibility during conversions.
 */

export const Dimension = {
  // Base SI dimensions
  LENGTH: 'length',
  MASS: 'mass',
  TIME: 'time',
  TEMPERATURE: 'temperature',
  AMOUNT: 'amount',           // moles
  ELECTRIC_CURRENT: 'electric_current',

  // Derived dimensions commonly used in chemistry
  PRESSURE: 'pressure',       // force/area
  VOLUME: 'volume',           // length³
  ENERGY: 'energy',           // mass·length²/time²
  CONCENTRATION: 'concentration',
  DENSITY: 'density',         // mass/volume
  MOLAR_MASS: 'molar_mass',   // mass/amount
  CHARGE: 'charge',           // current·time
  VOLTAGE: 'voltage',         // energy/charge
  RATE_CONSTANT_FIRST: 'rate_constant_first',   // 1/time (first order)
  RATE_CONSTANT_SECOND: 'rate_constant_second', // 1/(concentration·time)
  ENTROPY: 'entropy',         // energy/temperature (absolute)
  HEAT_CAPACITY: 'heat_capacity', // energy/(mass·temperature) - specific heat
  MOLAR_HEAT_CAPACITY: 'molar_heat_capacity', // energy/(amount·temperature)
  MOLAR_ENTROPY: 'molar_entropy', // energy/(amount·temperature) - for ΔS
  MOLALITY: 'molality',       // amount/mass (mol/kg)

  // Dimensionless
  DIMENSIONLESS: 'dimensionless',
};

/**
 * Human-readable labels for dimensions
 */
export const dimensionLabels = {
  [Dimension.LENGTH]: 'Length',
  [Dimension.MASS]: 'Mass',
  [Dimension.TIME]: 'Time',
  [Dimension.TEMPERATURE]: 'Temperature',
  [Dimension.AMOUNT]: 'Amount (moles)',
  [Dimension.ELECTRIC_CURRENT]: 'Electric Current',
  [Dimension.PRESSURE]: 'Pressure',
  [Dimension.VOLUME]: 'Volume',
  [Dimension.ENERGY]: 'Energy',
  [Dimension.CONCENTRATION]: 'Concentration',
  [Dimension.DENSITY]: 'Density',
  [Dimension.MOLAR_MASS]: 'Molar Mass',
  [Dimension.CHARGE]: 'Electric Charge',
  [Dimension.VOLTAGE]: 'Voltage',
  [Dimension.RATE_CONSTANT_FIRST]: 'Rate Constant (1st order)',
  [Dimension.RATE_CONSTANT_SECOND]: 'Rate Constant (2nd order)',
  [Dimension.ENTROPY]: 'Entropy',
  [Dimension.HEAT_CAPACITY]: 'Specific Heat Capacity',
  [Dimension.MOLAR_HEAT_CAPACITY]: 'Molar Heat Capacity',
  [Dimension.MOLAR_ENTROPY]: 'Molar Entropy',
  [Dimension.MOLALITY]: 'Molality',
  [Dimension.DIMENSIONLESS]: 'Dimensionless',
};

/**
 * SI base unit IDs for each dimension
 */
export const siBaseUnits = {
  [Dimension.LENGTH]: 'm',
  [Dimension.MASS]: 'kg',
  [Dimension.TIME]: 's',
  [Dimension.TEMPERATURE]: 'K',
  [Dimension.AMOUNT]: 'mol',
  [Dimension.ELECTRIC_CURRENT]: 'A',
  [Dimension.PRESSURE]: 'Pa',
  [Dimension.VOLUME]: 'm3',
  [Dimension.ENERGY]: 'J',
  [Dimension.CONCENTRATION]: 'mol_per_m3',
  [Dimension.DENSITY]: 'kg_per_m3',
  [Dimension.MOLAR_MASS]: 'kg_per_mol',
  [Dimension.CHARGE]: 'C',
  [Dimension.VOLTAGE]: 'V',
  [Dimension.RATE_CONSTANT_FIRST]: 's_inv',
  [Dimension.RATE_CONSTANT_SECOND]: 'm3_per_mol_s',
  [Dimension.ENTROPY]: 'J_per_K',
  [Dimension.HEAT_CAPACITY]: 'J_per_kg_K',
  [Dimension.MOLAR_HEAT_CAPACITY]: 'J_per_mol_K',
  [Dimension.MOLAR_ENTROPY]: 'J_per_mol_K_entropy',
  [Dimension.MOLALITY]: 'mol_per_kg',
  [Dimension.DIMENSIONLESS]: 'unitless',
};

export default Dimension;
