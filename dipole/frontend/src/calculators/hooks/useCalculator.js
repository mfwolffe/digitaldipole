/**
 * useCalculator Hook
 *
 * React hook for managing calculator state and solving equations.
 */
import { useState, useCallback, useMemo } from 'react';
import { getCalculator } from '../registry';
import { solve, solveSymbolic } from '../engine/nerdamer-solver';

/**
 * Hook for managing a single calculator's state
 * @param {string} calculatorId - ID of the calculator from registry
 */
export function useCalculator(calculatorId) {
  const [unknownVariable, setUnknownVariable] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [result, setResult] = useState(null);
  const [symbolicPreview, setSymbolicPreview] = useState(null);  // LaTeX format
  const [symbolicRaw, setSymbolicRaw] = useState(null);          // Raw parseable format
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get calculator definition from registry
  const calculator = useMemo(
    () => getCalculator(calculatorId),
    [calculatorId]
  );

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
      const preview = solveSymbolic(calculator.equation, variableId);
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
  }, [calculator]);

  // Update a single input value
  const setVariable = useCallback((variableId, value) => {
    setInputValues(prev => ({
      ...prev,
      [variableId]: value
    }));
    // Clear previous result when inputs change
    setResult(null);
  }, []);

  // Solve the equation
  const doSolve = useCallback(() => {
    if (!calculator || !unknownVariable) {
      setError('Please select an unknown variable');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Build the values map with parsed numbers
      const values = {};

      // Add constants with default values
      calculator.variables
        .filter(v => v.isConstant && v.defaultValue !== undefined)
        .forEach(v => {
          values[v.id] = v.defaultValue;
        });

      // Add user inputs
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
        values[variable.id] = parsed;
      }

      // Solve using nerdamer
      const solveResult = solve(
        calculator.equation,
        unknownVariable,
        values,
        symbolMap
      );

      if (solveResult.success) {
        setResult(solveResult);
      } else {
        setError(solveResult.error || 'Failed to solve equation');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [calculator, unknownVariable, knownVariables, inputValues, symbolMap]);

  // Reset all state
  const reset = useCallback(() => {
    setUnknownVariable(null);
    setInputValues({});
    setResult(null);
    setSymbolicPreview(null);
    setSymbolicRaw(null);
    setError(null);
  }, []);

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

    // Computed
    knownVariables,
    symbolMap,

    // Actions
    setUnknownVariable: updateUnknown,
    setVariable,
    solve: doSolve,
    reset
  };
}

export default useCalculator;
