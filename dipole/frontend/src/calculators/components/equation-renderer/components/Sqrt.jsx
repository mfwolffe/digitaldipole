/**
 * Sqrt Component
 *
 * Renders a square root with the radical symbol.
 */
import React from 'react';

export function Sqrt({ children, className = '' }) {
  return (
    <span className={`eq-sqrt ${className}`}>
      <span className="eq-sqrt-symbol">√</span>
      <span className="eq-sqrt-content">{children}</span>
    </span>
  );
}

export default Sqrt;
