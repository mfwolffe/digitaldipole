/**
 * VariableInput Component
 *
 * Input field for a calculator variable with label and unit display.
 */
import React from 'react';
import { Input, InputGroup, InputAddon, Label, FormGroup } from '../../components/ui';

export function VariableInput({ variable, value, onChange, disabled = false }) {
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
        <InputAddon position="end">{variable.unit}</InputAddon>
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
