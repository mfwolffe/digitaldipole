/**
 * Power Component
 *
 * Renders base^exponent with the exponent as a superscript.
 */
import React from 'react';

export function Power({ base, exponent, className = '' }) {
  return (
    <span className={`eq-power ${className}`}>
      <span className="eq-power-base">{base}</span>
      <sup className="eq-power-exp">{exponent}</sup>
    </span>
  );
}

export default Power;
