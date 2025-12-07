/**
 * useCalculator Hook
 *
 * React hook for managing calculator state and solving equations.
 * Includes unit management with automatic reconciliation.
 */
import { useState, useCallback, useMemo, useEffect } from 'react';
import { getCalculator } from '../registry';
import { solve, solveSymbolic, solveSymbolicLogarithmic, solveLogarithmic } from '../engine/nerdamer-solver';
import {
  reconcileUnits,
  applyReconciliation,
  convertResult,
  describeReconciliation,
  getUnit,
  getUnitsForDimension,
  getCompatibleUnits,
} from '../../units/index.js';

/**
 * Hook for managing a single calculator's state
 * @param {string} calculatorId - ID of the calculator from registry
 * @param {Object} options - Optional configuration
 * @param {Object} options.userPreferences - User's preferred units { dimension: unitId }
 */
export function useCalculator(calculatorId, options = {}) {
  const { userPreferences = {} } = options;

  const [unknownVariable, setUnknownVariable] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [result, setResult] = useState(null);
  const [symbolicPreview, setSymbolicPreview] = useState(null);  // LaTeX format
  const [symbolicRaw, setSymbolicRaw] = useState(null);          // Raw parseable format
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Unit state: map of variable ID to selected unit ID
  const [selectedUnits, setSelectedUnits] = useState({});
  // Track reconciliation details for display (optional)
  const [reconciliationSteps, setReconciliationSteps] = useState(null);

  // Get calculator definition from registry
  const calculator = useMemo(
    () => getCalculator(calculatorId),
    [calculatorId]
  );

  // Initialize selectedUnits when calculator loads or changes
  // Uses user preferences if available, falls back to calculator defaults
  useEffect(() => {
    if (!calculator) return;

    const initial = {};
    calculator.variables.forEach(v => {
      if (v.isConstant) return; // Constants don't have user-selectable units

      // Priority: user preference for dimension > defaultUnit > unit field
      if (v.dimension && userPreferences[v.dimension]) {
        initial[v.id] = userPreferences[v.dimension];
      } else {
        initial[v.id] = v.defaultUnit || v.unit || null;
      }
    });
    setSelectedUnits(initial);
  }, [calculator, userPreferences]);

  // Build symbol map for LaTeX display
  const symbolMap = useMemo(() => {
    if (!calculator) return {};
    return Object.fromEntries(
      calculator.variables.map(v => [v.id, v.symbol])
    );
  }, [calculator]);

  // Get variables that need input (not the unknown, not constants)
  const knownVariables = useMemo(() => {
    if (!calculator || !unknownVariable) return [];
    return calculator.variables.filter(
      v => v.id !== unknownVariable && !v.isConstant
    );
  }, [calculator, unknownVariable]);

  // Update symbolic preview when unknown changes
  const updateUnknown = useCallback((variableId) => {
    setUnknownVariable(variableId);
    setResult(null);
    setError(null);

    if (variableId && calculator) {
      let preview;

      // Use logarithmic symbolic solver for equations with ln(ratio)
      if (calculator.logarithmic) {
        preview = solveSymbolicLogarithmic(
          calculator.equation,
          variableId,
          calculator.logarithmic,
          symbolMap
        );
      } else {
        preview = solveSymbolic(calculator.equation, variableId);
      }

      if (preview.success) {
        setSymbolicPreview(preview.latex);
        setSymbolicRaw(preview.raw);
      } else {
        setSymbolicPreview(null);
        setSymbolicRaw(null);
        setError(preview.error);
      }
    } else {
      setSymbolicPreview(null);
      setSymbolicRaw(null);
    }
  }, [calculator, symbolMap]);

  // Update a single input value
  const setVariable = useCallback((variableId, value) => {
    setInputValues(prev => ({
      ...prev,
      [variableId]: value
    }));
    // Clear previous result when inputs change
    setResult(null);
  }, []);

  // Update the unit for a variable
  const setUnitForVariable = useCallback((variableId, unitId) => {
    setSelectedUnits(prev => ({
      ...prev,
      [variableId]: unitId
    }));
    // Clear previous result when units change
    setResult(null);
    setReconciliationSteps(null);
  }, []);

  // Get compatible units for a variable (based on its dimension)
  const getCompatibleUnitsFor = useCallback((variableId) => {
    if (!calculator) return [];

    const variable = calculator.variables.find(v => v.id === variableId);
    if (!variable || variable.isConstant) return [];

    // If variable has explicit dimension, use it
    if (variable.dimension) {
      return getUnitsForDimension(variable.dimension);
    }

    // Fall back to compatible units based on current selection
    const currentUnit = selectedUnits[variableId];
    if (currentUnit) {
      return getCompatibleUnits(currentUnit);
    }

    return [];
  }, [calculator, selectedUnits]);

  // Solve the equation
  const doSolve = useCallback(() => {
    if (!calculator || !unknownVariable) {
      setError('Please select an unknown variable');
      return;
    }

    setIsLoading(true);
    setError(null);
    setReconciliationSteps(null);

    try {
      // Build the raw input values map (before unit conversion)
      const rawValues = {};

      // Add user inputs (parse numbers)
      for (const variable of knownVariables) {
        const rawValue = inputValues[variable.id];
        if (rawValue === undefined || rawValue === '') {
          setError(`Please enter a value for ${variable.name}`);
          setIsLoading(false);
          return;
        }
        const parsed = parseFloat(rawValue);
        if (isNaN(parsed)) {
          setError(`Invalid number for ${variable.name}`);
          setIsLoading(false);
          return;
        }
        rawValues[variable.id] = parsed;
      }

      // Check if calculator has unit-aware variables (dimension field)
      const hasUnitSupport = calculator.variables.some(v => v.dimension);

      let values;
      let reconciliationPlan = null;

      if (hasUnitSupport) {
        // Use reconciliation engine to handle unit conversions
        reconciliationPlan = reconcileUnits(calculator, selectedUnits, unknownVariable);

        // Check for reconciliation errors
        if (reconciliationPlan.errors.length > 0) {
          setError(reconciliationPlan.errors[0]);
          setIsLoading(false);
          return;
        }

        // Apply conversions to get SI-based values
        values = applyReconciliation(rawValues, reconciliationPlan);

        // Store reconciliation steps for display
        if (reconciliationPlan.conversions.length > 0 || reconciliationPlan.outputConversion) {
          setReconciliationSteps(describeReconciliation(reconciliationPlan));
        }
      } else {
        // Legacy path: no unit support, use values as-is with default constants
        values = { ...rawValues };

        // Add constants with default values (legacy behavior)
        calculator.variables
          .filter(v => v.isConstant && v.defaultValue !== undefined)
          .forEach(v => {
            values[v.id] = v.defaultValue;
          });
      }

      // Solve using appropriate solver
      let solveResult;

      if (calculator.logarithmic) {
        // Use logarithmic solver for equations with ln(ratio)
        solveResult = solveLogarithmic(
          {
            equation: calculator.equation,
            logNumerator: calculator.logarithmic.numerator,
            logDenominator: calculator.logarithmic.denominator
          },
          unknownVariable,
          values,
          symbolMap
        );
      } else {
        // Standard algebraic solver
        solveResult = solve(
          calculator.equation,
          unknownVariable,
          values,
          symbolMap
        );
      }

      if (solveResult.success) {
        // Convert result from SI back to user's selected output unit
        let finalValue = solveResult.value;

        if (hasUnitSupport && reconciliationPlan) {
          finalValue = convertResult(solveResult.value, reconciliationPlan);
        }

        // Get the output unit for display
        const outputUnit = selectedUnits[unknownVariable] ||
          calculator.variables.find(v => v.id === unknownVariable)?.unit;

        setResult({
          ...solveResult,
          value: finalValue,
          unit: outputUnit,
          // Include original SI value if conversion happened
          siValue: hasUnitSupport && reconciliationPlan?.outputConversion ? solveResult.value : null,
        });
      } else {
        setError(solveResult.error || 'Failed to solve equation');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [calculator, unknownVariable, knownVariables, inputValues, selectedUnits, symbolMap]);

  // Reset all state
  const reset = useCallback(() => {
    setUnknownVariable(null);
    setInputValues({});
    setResult(null);
    setSymbolicPreview(null);
    setSymbolicRaw(null);
    setError(null);
    setReconciliationSteps(null);

    // Reset units to defaults
    if (calculator) {
      const initial = {};
      calculator.variables.forEach(v => {
        if (v.isConstant) return;
        initial[v.id] = v.defaultUnit || v.unit || null;
      });
      setSelectedUnits(initial);
    }
  }, [calculator]);

  return {
    // Calculator definition
    calculator,

    // State
    unknownVariable,
    inputValues,
    result,
    symbolicPreview,   // LaTeX for display
    symbolicRaw,       // Raw for parsing
    isLoading,
    error,

    // Unit state
    selectedUnits,
    reconciliationSteps,

    // Computed
    knownVariables,
    symbolMap,

    // Actions
    setUnknownVariable: updateUnknown,
    setVariable,
    solve: doSolve,
    reset,

    // Unit actions
    setUnitForVariable,
    getCompatibleUnitsFor,
  };
}

export default useCalculator;
