/**
 * UnitConverter Component
 *
 * Bidirectional unit converter with dimension selection.
 * Can be used as a standalone component or embedded in a drawer.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Input, Select, Label, FormGroup } from './ui';
import {
  Dimension,
  dimensionLabels,
  getUnitsForDimension,
  getUnit,
  convert,
  getConversionFactor,
  getBaseUnitId,
  getDefaultAltUnit,
} from '../units/index.js';

/**
 * UnitConverter - bidirectional unit conversion
 *
 * @param {string} initialDimension - Initial dimension to show (e.g., 'pressure')
 * @param {boolean} compact - Whether to use compact layout
 * @param {boolean} fullWidth - Whether to use full width layout
 */
export function UnitConverter({
  initialDimension = 'pressure',
  compact = false,
  fullWidth = false,
}) {
  const [dimension, setDimension] = useState(initialDimension);
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [activeInput, setActiveInput] = useState('from');

  // Get available units for the current dimension
  const availableUnits = useMemo(() => {
    return getUnitsForDimension(dimension);
  }, [dimension]);

  // Initialize units when dimension changes
  useEffect(() => {
    if (availableUnits.length > 0) {
      const baseUnit = getBaseUnitId(dimension);
      const altUnit = getDefaultAltUnit(dimension);

      // Try to use base unit and a common alternative
      const defaultFrom = availableUnits.find(u => u.id === baseUnit)?.id
        || availableUnits[0]?.id;
      const defaultTo = availableUnits.find(u => u.id === altUnit)?.id
        || (availableUnits[1]?.id || availableUnits[0]?.id);

      setFromUnit(defaultFrom);
      setToUnit(defaultTo !== defaultFrom ? defaultTo : (availableUnits[1]?.id || defaultFrom));
      setFromValue('');
      setToValue('');
    }
  }, [dimension, availableUnits]);

  // Convert when "from" value changes
  useEffect(() => {
    if (activeInput === 'from' && fromValue && fromUnit && toUnit) {
      try {
        const num = parseFloat(fromValue);
        if (!isNaN(num)) {
          const result = convert(num, fromUnit, toUnit);
          setToValue(formatNumber(result));
        }
      } catch {
        setToValue('');
      }
    }
  }, [fromValue, fromUnit, toUnit, activeInput]);

  // Convert when "to" value changes
  useEffect(() => {
    if (activeInput === 'to' && toValue && fromUnit && toUnit) {
      try {
        const num = parseFloat(toValue);
        if (!isNaN(num)) {
          const result = convert(num, toUnit, fromUnit);
          setFromValue(formatNumber(result));
        }
      } catch {
        setFromValue('');
      }
    }
  }, [toValue, fromUnit, toUnit, activeInput]);

  // Swap units and values
  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  // Format number for display
  function formatNumber(num) {
    if (num === 0) return '0';
    const abs = Math.abs(num);
    if (abs >= 1e6 || abs < 1e-4) {
      return num.toExponential(6);
    }
    // Use toPrecision but strip trailing zeros
    const str = num.toPrecision(8);
    // Convert to number and back to string to strip trailing zeros
    return parseFloat(str).toString();
  }

  // Get conversion factor for display
  const conversionFactor = useMemo(() => {
    if (!fromUnit || !toUnit) return null;
    try {
      return getConversionFactor(fromUnit, toUnit);
    } catch {
      return null;
    }
  }, [fromUnit, toUnit]);

  // Dimension tabs/selector
  const dimensions = [
    Dimension.PRESSURE,
    Dimension.VOLUME,
    Dimension.TEMPERATURE,
    Dimension.MASS,
    Dimension.AMOUNT,
    Dimension.ENERGY,
    Dimension.CONCENTRATION,
    Dimension.LENGTH,
    Dimension.TIME,
  ];

  return (
    <div className={`unit-converter ${fullWidth ? 'max-w-2xl mx-auto' : ''}`}>
      {/* Dimension selector */}
      {compact ? (
        <FormGroup className="mb-4">
          <Label htmlFor="dimension-select">Dimension</Label>
          <Select
            id="dimension-select"
            value={dimension}
            onChange={(e) => setDimension(e.target.value)}
          >
            {dimensions.map(d => (
              <option key={d} value={d}>{dimensionLabels[d] || d}</option>
            ))}
          </Select>
        </FormGroup>
      ) : (
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {dimensions.map(d => (
            <button
              key={d}
              onClick={() => setDimension(d)}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                ${dimension === d
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {dimensionLabels[d] || d}
            </button>
          ))}
        </div>
      )}

      {/* Conversion inputs */}
      <div className={`flex items-end gap-3 ${compact ? 'flex-col' : ''}`}>
        {/* From input */}
        <div className="flex-1 min-w-0">
          <FormGroup>
            <Label htmlFor="from-value">From</Label>
            <div className="flex gap-2">
              <Input
                id="from-value"
                type="number"
                step="any"
                value={fromValue}
                onChange={(e) => {
                  setActiveInput('from');
                  setFromValue(e.target.value);
                }}
                placeholder="Enter value"
                className="flex-1"
              />
              <Select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-24"
                aria-label="From unit"
              >
                {availableUnits.map(u => (
                  <option key={u.id} value={u.id}>{u.symbol}</option>
                ))}
              </Select>
            </div>
          </FormGroup>
        </div>

        {/* Swap button */}
        <button
          onClick={handleSwap}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors mb-1"
          title="Swap units"
          aria-label="Swap units"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        {/* To input */}
        <div className="flex-1 min-w-0">
          <FormGroup>
            <Label htmlFor="to-value">To</Label>
            <div className="flex gap-2">
              <Input
                id="to-value"
                type="number"
                step="any"
                value={toValue}
                onChange={(e) => {
                  setActiveInput('to');
                  setToValue(e.target.value);
                }}
                placeholder="Result"
                className="flex-1"
              />
              <Select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-24"
                aria-label="To unit"
              >
                {availableUnits.map(u => (
                  <option key={u.id} value={u.id}>{u.symbol}</option>
                ))}
              </Select>
            </div>
          </FormGroup>
        </div>
      </div>

      {/* Conversion factor display */}
      {fromUnit && toUnit && (
        <p className="text-sm text-gray-500 mt-4 text-center">
          1 {getUnit(fromUnit)?.symbol || fromUnit}
          {' = '}
          {conversionFactor !== null
            ? formatNumber(conversionFactor)
            : '(non-linear conversion)'
          }
          {' '}{getUnit(toUnit)?.symbol || toUnit}
        </p>
      )}
    </div>
  );
}

export default UnitConverter;
