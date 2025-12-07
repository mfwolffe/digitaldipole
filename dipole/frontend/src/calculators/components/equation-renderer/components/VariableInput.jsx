/**
 * VariableInput Component
 *
 * Inline input field for entering variable values within the equation.
 * Styled to fit naturally within the mathematical expression.
 * Supports clickable unit selection when compatible units are available.
 */
import React from 'react';
import { UnitPicker } from '../../../../components/UnitPicker';

export function VariableInput({
  variable,
  value,
  onChange,
  size = 'normal',
  // Unit selection props
  selectedUnit,
  compatibleUnits = [],
  onUnitChange,
}) {
  const sizeClasses = size === 'small'
    ? 'w-16 text-sm py-0.5 px-1.5'
    : 'w-20 text-base py-1 px-2';

  // Determine displayed unit: selectedUnit if provided, otherwise variable.unit
  const displayUnit = selectedUnit || variable.unit;
  const hasUnitPicker = compatibleUnits.length > 1 && onUnitChange;

  return (
    <span className="eq-var-input inline-flex items-center gap-1">
      <input
        type="number"
        step="any"
        value={value || ''}
        onChange={(e) => onChange(variable.id, e.target.value)}
        placeholder={variable.htmlSymbol?.replace(/<[^>]*>/g, '') || variable.id}
        className={`
          eq-input-field
          ${sizeClasses}
          border border-gray-300 rounded
          text-center font-math
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          transition-colors duration-200
        `}
        aria-label={variable.name}
        title={`${variable.name} (${displayUnit})`}
      />
      {hasUnitPicker ? (
        <UnitPicker
          currentUnit={displayUnit}
          compatibleUnits={compatibleUnits}
          onChange={(unitId) => onUnitChange(variable.id, unitId)}
          className="eq-input-unit"
        />
      ) : (
        <span className="eq-input-unit text-xs text-gray-500">{displayUnit}</span>
      )}
    </span>
  );
}

export default VariableInput;
