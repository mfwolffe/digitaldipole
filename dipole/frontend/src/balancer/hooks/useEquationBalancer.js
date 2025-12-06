/**
 * useEquationBalancer - State management hook for equation balancer
 *
 * Manages:
 * - Equation parsing from text input
 * - Coefficient state (auto-balanced or manually edited)
 * - Balance results and steps
 * - Validation state
 */

import { useState, useCallback, useMemo } from 'react';
import { tokenize } from '../utils/chemicalTokenizer.js';
import { parseEquation, equationToString, resetIdCounter } from '../utils/chemicalParser.js';
import { balanceEquation, validateBalance } from '../utils/balancer.js';
import { validateEquation, getElementInventory } from '../utils/validation.js';

/**
 * Main hook for equation balancer state management
 */
export function useEquationBalancer() {
  // Core state
  const [equation, setEquation] = useState(null);
  const [coefficients, setCoefficients] = useState({});
  const [balanceResult, setBalanceResult] = useState(null);
  const [mode, setMode] = useState('molecular'); // 'molecular' | 'ionic' | 'redox'
  const [solution, setSolution] = useState('acidic'); // 'acidic' | 'basic' (for redox)

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parseError, setParseError] = useState(null);

  /**
   * Parse text input into equation structure
   */
  const parseText = useCallback((text) => {
    if (!text || !text.trim()) {
      setEquation(null);
      setCoefficients({});
      setBalanceResult(null);
      setParseError(null);
      setError(null);
      return { success: true, equation: null };
    }

    try {
      resetIdCounter();
      const tokens = tokenize(text.trim());
      const parsed = parseEquation(tokens);

      setEquation(parsed);
      setParseError(null);
      setError(null);
      setBalanceResult(null);

      // Initialize coefficients to 1
      const initialCoeffs = {};
      for (const compound of [...parsed.reactants, ...parsed.products]) {
        initialCoeffs[compound.id] = compound.coefficient || 1;
      }
      setCoefficients(initialCoeffs);

      return { success: true, equation: parsed };
    } catch (e) {
      setParseError(e.message);
      return { success: false, error: e.message };
    }
  }, []);

  /**
   * Update a single coefficient
   */
  const setCoefficient = useCallback((compoundId, value) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 1) return;

    setCoefficients(prev => ({ ...prev, [compoundId]: numValue }));
    setBalanceResult(null); // Clear result when manually editing
  }, []);

  /**
   * Auto-balance the equation
   */
  const balance = useCallback(async () => {
    if (!equation) {
      setError('No equation to balance');
      return { success: false };
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = balanceEquation(equation, {
        mode,
        solution,
        showSteps: true,
      });

      if (result.success) {
        setBalanceResult(result);
        setCoefficients(result.coefficients);
        return { success: true, result };
      } else {
        setError(result.error || 'Unable to balance equation');
        return { success: false, error: result.error };
      }
    } catch (e) {
      setError(e.message);
      return { success: false, error: e.message };
    } finally {
      setIsLoading(false);
    }
  }, [equation, mode, solution]);

  /**
   * Verify current coefficients are balanced
   */
  const verify = useCallback(() => {
    if (!equation) {
      return { valid: false, errors: ['No equation'] };
    }

    const result = validateBalance(equation, coefficients);
    return result;
  }, [equation, coefficients]);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setEquation(null);
    setCoefficients({});
    setBalanceResult(null);
    setError(null);
    setParseError(null);
  }, []);

  /**
   * Update arrow type
   */
  const setArrowType = useCallback((arrowType) => {
    if (equation) {
      setEquation(prev => ({ ...prev, arrowType }));
    }
  }, [equation]);

  /**
   * Reorder compounds within the same side (reactants or products)
   */
  const reorderCompound = useCallback((side, fromIndex, toIndex) => {
    if (!equation) return;

    setEquation(prev => {
      const key = side === 'reactant' ? 'reactants' : 'products';
      const items = [...prev[key]];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      return { ...prev, [key]: items };
    });
  }, [equation]);

  /**
   * Move compound between sides (reactant <-> product)
   */
  const moveCompound = useCallback((compoundId, fromSide, toSide, toIndex) => {
    if (!equation) return;

    setEquation(prev => {
      const fromKey = fromSide === 'reactant' ? 'reactants' : 'products';
      const toKey = toSide === 'reactant' ? 'reactants' : 'products';

      const fromItems = [...prev[fromKey]];
      const toItems = fromKey === toKey ? fromItems : [...prev[toKey]];

      const compoundIndex = fromItems.findIndex(c => c.id === compoundId);
      if (compoundIndex === -1) return prev;

      const [moved] = fromItems.splice(compoundIndex, 1);

      // Insert at target position (-1 means append)
      if (toIndex === -1 || toIndex >= toItems.length) {
        toItems.push(moved);
      } else {
        toItems.splice(toIndex, 0, moved);
      }

      return {
        ...prev,
        [fromKey]: fromItems,
        [toKey]: toItems,
      };
    });

    // Clear balance result when structure changes
    setBalanceResult(null);
  }, [equation]);

  /**
   * Remove a compound from the equation
   */
  const removeCompound = useCallback((compoundId) => {
    if (!equation) return;

    setEquation(prev => ({
      ...prev,
      reactants: prev.reactants.filter(c => c.id !== compoundId),
      products: prev.products.filter(c => c.id !== compoundId),
    }));

    setCoefficients(prev => {
      const { [compoundId]: removed, ...rest } = prev;
      return rest;
    });

    setBalanceResult(null);
  }, [equation]);

  // Computed: equation with current coefficients applied
  const equationWithCoefficients = useMemo(() => {
    if (!equation) return null;

    return {
      ...equation,
      reactants: equation.reactants.map(c => ({
        ...c,
        coefficient: coefficients[c.id] ?? c.coefficient ?? 1,
      })),
      products: equation.products.map(c => ({
        ...c,
        coefficient: coefficients[c.id] ?? c.coefficient ?? 1,
      })),
    };
  }, [equation, coefficients]);

  // Computed: equation as string
  const equationString = useMemo(() => {
    if (!equationWithCoefficients) return '';
    return equationToString(equationWithCoefficients);
  }, [equationWithCoefficients]);

  // Computed: element inventory
  const elementInventory = useMemo(() => {
    if (!equation) return [];
    return getElementInventory(equation, coefficients);
  }, [equation, coefficients]);

  // Computed: is balanced
  const isBalanced = useMemo(() => {
    if (!equation) return false;
    return validateBalance(equation, coefficients).valid;
  }, [equation, coefficients]);

  // Computed: validation status
  const validation = useMemo(() => {
    if (!equation) return null;
    return validateEquation(equation, coefficients);
  }, [equation, coefficients]);

  return {
    // State
    equation: equationWithCoefficients,
    rawEquation: equation,
    coefficients,
    balanceResult,
    mode,
    solution,
    isLoading,
    error,
    parseError,

    // Computed
    equationString,
    elementInventory,
    isBalanced,
    validation,

    // Actions
    parseText,
    setCoefficient,
    balance,
    verify,
    reset,
    setMode,
    setSolution,
    setArrowType,
    reorderCompound,
    moveCompound,
    removeCompound,
  };
}

export default useEquationBalancer;
