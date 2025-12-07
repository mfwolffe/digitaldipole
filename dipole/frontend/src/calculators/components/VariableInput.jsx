/**
 * VariableInput Component
 *
 * Input field for a calculator variable with label and unit display.
 * Supports clickable unit selection when compatible units are available.
 */
import React from 'react';
import { Input, InputGroup, InputAddon, Label, FormGroup } from '../../components/ui';
import { UnitPicker } from '../../components/UnitPicker';

export function VariableInput({
  variable,
  value,
  onChange,
  disabled = false,
  // Unit selection props
  selectedUnit,
  compatibleUnits = [],
  onUnitChange,
}) {
  // Determine displayed unit: selectedUnit if provided, otherwise variable.unit
  const displayUnit = selectedUnit || variable.unit;
  const hasUnitPicker = compatibleUnits.length > 1 && onUnitChange;

  return (
    <FormGroup className="mb-3">
      <Label
        htmlFor={`var-${variable.id}`}
        className="mb-1"
      >
        <span dangerouslySetInnerHTML={{ __html: `${variable.htmlSymbol} - ${variable.name}` }} />
      </Label>
      <InputGroup>
        <Input
          id={`var-${variable.id}`}
          type="number"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${variable.name.toLowerCase()}`}
          disabled={disabled}
          aria-label={variable.name}
          className="rounded-r-none"
        />
        {hasUnitPicker ? (
          <div className="flex items-center border border-l-0 border-gray-300 bg-gray-50 px-2 rounded-r-md">
            <UnitPicker
              currentUnit={displayUnit}
              compatibleUnits={compatibleUnits}
              onChange={onUnitChange}
              disabled={disabled}
            />
          </div>
        ) : (
          <InputAddon position="end">{displayUnit}</InputAddon>
        )}
      </InputGroup>
      {variable.description && (
        <p className="mt-1 text-xs text-gray-500">
          {variable.description}
        </p>
      )}
    </FormGroup>
  );
}

export default VariableInput;
