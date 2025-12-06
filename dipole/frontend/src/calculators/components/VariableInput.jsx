/**
 * VariableInput Component
 *
 * Input field for a calculator variable with label and unit display.
 */
import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

export function VariableInput({ variable, value, onChange, disabled = false }) {
  return (
    <Form.Group className="mb-2">
      <Form.Label
        className="mb-1"
        dangerouslySetInnerHTML={{ __html: `${variable.htmlSymbol} - ${variable.name}` }}
      />
      <InputGroup size="sm">
        <Form.Control
          type="number"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${variable.name.toLowerCase()}`}
          disabled={disabled}
          aria-label={variable.name}
        />
        <InputGroup.Text>{variable.unit}</InputGroup.Text>
      </InputGroup>
      {variable.description && (
        <Form.Text className="text-muted" style={{ fontSize: '0.75rem' }}>
          {variable.description}
        </Form.Text>
      )}
    </Form.Group>
  );
}

export default VariableInput;
