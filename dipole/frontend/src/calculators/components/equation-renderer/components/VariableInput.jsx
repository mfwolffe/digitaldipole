/**
 * VariableInput Component
 *
 * Inline input field for entering variable values within the equation.
 * Styled to fit naturally within the mathematical expression.
 */
import React from 'react';
import { Form } from 'react-bootstrap';

export function VariableInput({ variable, value, onChange, size = 'normal' }) {
  const sizeClass = size === 'small' ? 'eq-input-sm' : '';

  return (
    <span className={`eq-var-input ${sizeClass}`}>
      <Form.Control
        type="number"
        step="any"
        value={value || ''}
        onChange={(e) => onChange(variable.id, e.target.value)}
        placeholder={variable.htmlSymbol?.replace(/<[^>]*>/g, '') || variable.id}
        className="eq-input-field"
        aria-label={variable.name}
        title={`${variable.name} (${variable.unit})`}
      />
      <span className="eq-input-unit">{variable.unit}</span>
    </span>
  );
}

export default VariableInput;
