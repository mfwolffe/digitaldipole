/**
 * EquationRenderer Component
 *
 * Main component for rendering interactive equations.
 * Takes a Nerdamer expression and converts it to an interactive React component
 * with inline input fields for known variables.
 *
 * Usage:
 *   <EquationRenderer
 *     expression="P1*V1*P2^(-1)"
 *     unknownVariable={{ id: 'V2', symbol: 'V_2', ... }}
 *     knownVariables={[{ id: 'P1', ... }, { id: 'V1', ... }, { id: 'P2', ... }]}
 *     inputValues={{ P1: '1', V1: '2', P2: '0.5' }}
 *     onVariableChange={(varId, value) => {...}}
 *     logConfig={{ numerator: 'k2', denominator: 'k1' }}  // optional
 *   />
 */
import React, { useMemo } from 'react';
import { tokenize } from './tokenizer.js';
import { parse } from './astParser.js';
import { simplify } from './astSimplify.js';
import { renderEquation } from './renderAST.jsx';
import { VariableSymbol } from './components/VariableSymbol.jsx';
import './styles/equation-renderer.css';

export function EquationRenderer({
  expression,
  unknownVariable,
  knownVariables,
  inputValues,
  onVariableChange,
  logConfig = null,
  className = ''
}) {
  // Parse and simplify the expression
  const ast = useMemo(() => {
    if (!expression) return null;

    try {
      const tokens = tokenize(expression);
      const parsed = parse(tokens);
      return simplify(parsed);
    } catch (error) {
      console.error('EquationRenderer parse error:', error);
      return null;
    }
  }, [expression]);

  // Build context for rendering
  const context = useMemo(() => {
    // Map variable IDs to variable objects
    const variableMap = new Map();

    if (unknownVariable) {
      variableMap.set(unknownVariable.id, unknownVariable);
    }

    if (knownVariables) {
      knownVariables.forEach(v => variableMap.set(v.id, v));
    }

    // Set of known variable IDs (need input fields)
    const knownVarIds = new Set(knownVariables?.map(v => v.id) || []);

    return {
      variableMap,
      knownVarIds,
      inputValues: inputValues || {},
      onVariableChange: onVariableChange || (() => {}),
      logConfig
    };
  }, [unknownVariable, knownVariables, inputValues, onVariableChange, logConfig]);

  // Error state
  if (!ast) {
    return (
      <div className={`equation-renderer equation-renderer-error ${className}`}>
        <span className="eq-error">Unable to parse equation</span>
      </div>
    );
  }

  // Render the equation
  const renderedEquation = renderEquation(ast, context);

  return (
    <div className={`equation-renderer ${className}`}>
      <div className="eq-display">
        {/* Unknown variable on the left */}
        <VariableSymbol variable={unknownVariable} className="eq-unknown-var" />
        <span className="eq-equals">=</span>
        {/* Rendered expression on the right */}
        <span className="eq-expression">{renderedEquation}</span>
      </div>
    </div>
  );
}

export default EquationRenderer;
