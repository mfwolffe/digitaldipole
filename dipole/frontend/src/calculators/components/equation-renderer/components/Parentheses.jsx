/**
 * Parentheses Component
 *
 * Wraps content in parentheses that scale with content height.
 */
import React from 'react';

export function Parentheses({ children, className = '' }) {
  return (
    <span className={`eq-parens ${className}`}>
      <span className="eq-paren-left">(</span>
      <span className="eq-paren-content">{children}</span>
      <span className="eq-paren-right">)</span>
    </span>
  );
}

export default Parentheses;
