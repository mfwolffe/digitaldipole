/**
 * VariableSymbol Component
 *
 * Displays a variable as a mathematical symbol (for unknowns and constants).
 * Uses HTML for subscripts/superscripts.
 */
import React from 'react';

export function VariableSymbol({ variable, className = '' }) {
  if (!variable) {
    return <span className={`eq-var-symbol ${className}`}>?</span>;
  }

  return (
    <span
      className={`eq-var-symbol ${className}`}
      dangerouslySetInnerHTML={{ __html: variable.htmlSymbol || variable.id }}
      title={variable.name}
    />
  );
}

export default VariableSymbol;
