/**
 * VariableInput Component
 *
 * Inline input field for entering variable values within the equation.
 * Styled to fit naturally within the mathematical expression.
 */
import React from 'react';

export function VariableInput({ variable, value, onChange, size = 'normal' }) {
  const sizeClasses = size === 'small'
    ? 'w-16 text-sm py-0.5 px-1.5'
    : 'w-20 text-base py-1 px-2';

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
        title={`${variable.name} (${variable.unit})`}
      />
      <span className="eq-input-unit text-xs text-gray-500">{variable.unit}</span>
    </span>
  );
}

export default VariableInput;
