/**
 * InlineEquationInput Component
 *
 * Renders an equation with inline input fields embedded where variables should be entered.
 * Uses the new AST-based EquationRenderer for all equations.
 */
import React from 'react';
import { EquationRenderer } from './equation-renderer';
import './InlineEquationInput.css';

export function InlineEquationInput({
  symbolicRaw,
  symbolicLatex,  // kept for API compatibility
  unknownVariable,
  knownVariables,
  inputValues,
  onVariableChange,
  logConfig = null
}) {
  if (!symbolicRaw || !unknownVariable) {
    return null;
  }

  return (
    <EquationRenderer
      expression={symbolicRaw}
      unknownVariable={unknownVariable}
      knownVariables={knownVariables}
      inputValues={inputValues}
      onVariableChange={onVariableChange}
      logConfig={logConfig}
    />
  );
}

export default InlineEquationInput;
