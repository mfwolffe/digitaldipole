/**
 * InlineEquationInput Component
 *
 * Renders an equation with inline input fields embedded where variables should be entered.
 * Uses the new AST-based EquationRenderer for all equations.
 * Supports unit selection through clickable unit labels.
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
  logConfig = null,
  // Unit selection props
  selectedUnits = {},
  onUnitChange = null,
  getCompatibleUnitsFor = null,
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
      // Unit selection props
      selectedUnits={selectedUnits}
      onUnitChange={onUnitChange}
      getCompatibleUnitsFor={getCompatibleUnitsFor}
    />
  );
}

export default InlineEquationInput;
