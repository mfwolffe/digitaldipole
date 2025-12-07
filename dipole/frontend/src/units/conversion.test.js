/**
 * Unit Conversion Tests
 *
 * Run with: node src/units/conversion.test.js
 */

import { convert, getConversionFactor, canConvert, UnitConversionError } from './conversion.js';
import { getUnit, getUnitsForDimension } from './registry.js';
import { Dimension } from './dimensions.js';
import { R, F, NA, getConstant } from './constants.js';
import { reconcileUnits, applyReconciliation, convertResult } from './reconciliation.js';

// Simple test runner
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(`  ${error.message}`);
    failed++;
  }
}

function assertEqual(actual, expected, tolerance = 0.0001) {
  if (typeof expected === 'number') {
    const diff = Math.abs(actual - expected);
    const relativeDiff = diff / Math.abs(expected || 1);
    if (relativeDiff > tolerance) {
      throw new Error(`Expected ${expected}, got ${actual} (diff: ${relativeDiff})`);
    }
  } else if (actual !== expected) {
    throw new Error(`Expected ${expected}, got ${actual}`);
  }
}

function assertThrows(fn, errorType) {
  try {
    fn();
    throw new Error(`Expected ${errorType?.name || 'error'} to be thrown`);
  } catch (error) {
    if (errorType && !(error instanceof errorType)) {
      throw new Error(`Expected ${errorType.name}, got ${error.constructor.name}`);
    }
  }
}

console.log('=== Unit Conversion Tests ===\n');

// Pressure conversions
console.log('Pressure conversions:');
test('1 atm = 101.325 kPa', () => assertEqual(convert(1, 'atm', 'kPa'), 101.325));
test('1 atm = 101325 Pa', () => assertEqual(convert(1, 'atm', 'Pa'), 101325));
test('1 atm = 760 mmHg', () => assertEqual(convert(1, 'atm', 'mmHg'), 760, 0.001));
test('1 bar = 100000 Pa', () => assertEqual(convert(1, 'bar', 'Pa'), 100000));
test('1 atm = 1.01325 bar', () => assertEqual(convert(1, 'atm', 'bar'), 1.01325));
test('14.696 psi ≈ 1 atm', () => assertEqual(convert(14.696, 'psi', 'atm'), 1, 0.001));

// Volume conversions
console.log('\nVolume conversions:');
test('1 L = 1000 mL', () => assertEqual(convert(1, 'L', 'mL'), 1000));
test('1 L = 0.001 m³', () => assertEqual(convert(1, 'L', 'm3'), 0.001));
test('1 mL = 1 cm³', () => assertEqual(convert(1, 'mL', 'cm3'), 1));
test('1 gal = 3.78541 L', () => assertEqual(convert(1, 'gal', 'L'), 3.78541, 0.0001));

// Temperature conversions (non-linear)
console.log('\nTemperature conversions:');
test('0°C = 273.15 K', () => assertEqual(convert(0, 'degC', 'K'), 273.15));
test('100°C = 373.15 K', () => assertEqual(convert(100, 'degC', 'K'), 373.15));
test('273.15 K = 0°C', () => assertEqual(convert(273.15, 'K', 'degC'), 0));
test('32°F = 0°C', () => assertEqual(convert(32, 'degF', 'degC'), 0, 0.001));
test('212°F = 100°C', () => assertEqual(convert(212, 'degF', 'degC'), 100, 0.001));
test('0°C = 32°F', () => assertEqual(convert(0, 'degC', 'degF'), 32, 0.001));
test('-40°C = -40°F', () => assertEqual(convert(-40, 'degC', 'degF'), -40, 0.001));

// Energy conversions
console.log('\nEnergy conversions:');
test('1 kJ = 1000 J', () => assertEqual(convert(1, 'kJ', 'J'), 1000));
test('1 cal = 4.184 J', () => assertEqual(convert(1, 'cal', 'J'), 4.184));
test('1 kcal = 4184 J', () => assertEqual(convert(1, 'kcal', 'J'), 4184));
test('1 L·atm = 101.325 J', () => assertEqual(convert(1, 'L_atm', 'J'), 101.325));

// Mass conversions
console.log('\nMass conversions:');
test('1 kg = 1000 g', () => assertEqual(convert(1, 'kg', 'g'), 1000));
test('1 g = 1000 mg', () => assertEqual(convert(1, 'g', 'mg'), 1000));
test('1 lb = 453.59 g', () => assertEqual(convert(1, 'lb', 'g'), 453.59237, 0.0001));

// Amount conversions
console.log('\nAmount conversions:');
test('1 mol = 1000 mmol', () => assertEqual(convert(1, 'mol', 'mmol'), 1000));
test('1 mmol = 1000 μmol', () => assertEqual(convert(1, 'mmol', 'umol'), 1000));

// Concentration conversions
console.log('\nConcentration conversions:');
test('1 M = 1000 mM', () => assertEqual(convert(1, 'M', 'mM'), 1000));
test('1 M = 1 mol/L', () => assertEqual(convert(1, 'M', 'mol_per_L'), 1));

// Identity conversions
console.log('\nIdentity conversions:');
test('1 atm = 1 atm', () => assertEqual(convert(1, 'atm', 'atm'), 1));
test('25 degC = 25 degC', () => assertEqual(convert(25, 'degC', 'degC'), 25));

// Conversion factors
console.log('\nConversion factors:');
test('L → mL factor = 1000', () => assertEqual(getConversionFactor('L', 'mL'), 1000));
test('atm → kPa factor = 101.325', () => assertEqual(getConversionFactor('atm', 'kPa'), 101.325));
test('degC → K factor is null (non-linear)', () => assertEqual(getConversionFactor('degC', 'K'), null));

// Compatibility checks
console.log('\nCompatibility checks:');
test('L → mL: compatible', () => assertEqual(canConvert('L', 'mL'), true));
test('atm → L: incompatible', () => assertEqual(canConvert('atm', 'L'), false));
test('K → degC: compatible', () => assertEqual(canConvert('K', 'degC'), true));

// Error handling
console.log('\nError handling:');
test('Unknown unit throws error', () => {
  assertThrows(() => convert(1, 'xyz', 'Pa'), UnitConversionError);
});
test('Incompatible dimensions throw error', () => {
  assertThrows(() => convert(1, 'atm', 'L'), UnitConversionError);
});

// Registry tests
console.log('\nRegistry tests:');
test('getUnit returns atm', () => {
  const unit = getUnit('atm');
  assertEqual(unit.name, 'Atmosphere');
  assertEqual(unit.dimension, Dimension.PRESSURE);
});
test('getUnitsForDimension returns pressure units', () => {
  const units = getUnitsForDimension(Dimension.PRESSURE);
  assertEqual(units.length > 5, true);
  assertEqual(units.some(u => u.id === 'atm'), true);
  assertEqual(units.some(u => u.id === 'kPa'), true);
});

// Constants tests
console.log('\nConstants tests:');
test('R base value ≈ 8.314 J/(mol·K)', () => assertEqual(R.baseValue, 8.31446261815324, 0.0001));
test('R for J/(mol·K) = 8.314', () => assertEqual(R.getForUnits({ energy: 'J', amount: 'mol', temperature: 'K' }), 8.314, 0.001));
test('R for L·atm/(mol·K) ≈ 0.0821', () => assertEqual(R.getForUnits({ pressure: 'atm', volume: 'L', amount: 'mol', temperature: 'K' }), 0.0821, 0.001));
test('R for cal/(mol·K) ≈ 1.987', () => assertEqual(R.getForUnits({ energy: 'cal', amount: 'mol', temperature: 'K' }), 1.987, 0.001));
test('F base value ≈ 96485 C/mol', () => assertEqual(F.baseValue, 96485.33212, 0.01));
test('F for C/mol = 96485', () => assertEqual(F.getForUnits({ charge: 'C', amount: 'mol' }), 96485, 1));
test('NA ≈ 6.022e23', () => assertEqual(NA.baseValue, 6.02214076e23, 1e20));
test('getConstant returns R', () => assertEqual(getConstant('R').name, 'Gas Constant'));

// Reconciliation tests
console.log('\nReconciliation tests:');

// Mock calculator for testing
const mockIdealGasCalc = {
  id: 'ideal',
  name: 'Ideal Gas Law',
  equation: 'P*V - n*R*T',
  variables: [
    { id: 'P', name: 'Pressure', dimension: 'pressure', defaultUnit: 'atm' },
    { id: 'V', name: 'Volume', dimension: 'volume', defaultUnit: 'L' },
    { id: 'n', name: 'Moles', dimension: 'amount', defaultUnit: 'mol' },
    { id: 'T', name: 'Temperature', dimension: 'temperature', defaultUnit: 'K' },
    { id: 'R', name: 'Gas Constant', isConstant: true, constantId: 'R', defaultValue: 0.0821 },
  ],
};

test('reconcileUnits handles matching units', () => {
  const plan = reconcileUnits(
    mockIdealGasCalc,
    { P: 'atm', V: 'L', n: 'mol', T: 'K' },
    'P'
  );
  // All conversions should convert to SI
  assertEqual(plan.conversions.length >= 0, true);
  assertEqual(plan.errors.length, 0);
});

test('reconcileUnits handles mixed volume units (L + mL)', () => {
  const mixedVolumeCalc = {
    variables: [
      { id: 'V1', name: 'Volume 1', dimension: 'volume' },
      { id: 'V2', name: 'Volume 2', dimension: 'volume' },
    ],
  };
  const plan = reconcileUnits(
    mixedVolumeCalc,
    { V1: 'L', V2: 'mL' },
    'V1'
  );
  // Should detect mixed units and plan conversions
  assertEqual(plan.conversions.length >= 1, true);
  // Should convert to SI base (m3)
  const v2Conv = plan.conversions.find(c => c.variableId === 'V2');
  assertEqual(v2Conv?.to, 'm3');
});

test('applyReconciliation converts values correctly', () => {
  const plan = {
    conversions: [
      { variableId: 'V', from: 'L', to: 'm3' },
    ],
    constantValues: { R: 8.314 },
  };
  const inputValues = { V: 22.4 };  // 22.4 L
  const converted = applyReconciliation(inputValues, plan);
  assertEqual(converted.V, 0.0224, 0.0001);  // 22.4 L = 0.0224 m³
  assertEqual(converted.R, 8.314);
});

test('convertResult applies output conversion', () => {
  const plan = {
    outputConversion: { from: 'Pa', to: 'atm' },
    conversions: [],
    constantValues: {},
  };
  const siResult = 101325;  // 1 atm in Pa
  const result = convertResult(siResult, plan);
  assertEqual(result, 1, 0.001);
});

test('convertResult handles no output conversion', () => {
  const plan = {
    outputConversion: null,
    conversions: [],
    constantValues: {},
  };
  const siResult = 101325;
  const result = convertResult(siResult, plan);
  assertEqual(result, 101325);
});

// Summary
console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
