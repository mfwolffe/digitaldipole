/**
 * Fraction Component
 *
 * Renders a mathematical fraction with a horizontal bar.
 * Numerator stacks above denominator.
 */
import React from 'react';

export function Fraction({ numerator, denominator, className = '' }) {
  return (
    <span className={`eq-fraction ${className}`}>
      <span className="eq-fraction-num">{numerator}</span>
      <span className="eq-fraction-bar" />
      <span className="eq-fraction-denom">{denominator}</span>
    </span>
  );
}

export default Fraction;
