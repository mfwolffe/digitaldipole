/**
 * FunctionCall Component
 *
 * Renders a mathematical function like exp(), ln(), sqrt().
 */
import React from 'react';

// Map function names to display text
const FUNCTION_DISPLAY = {
  'exp': 'e',
  'ln': 'ln',
  'log': 'log',
  'sqrt': '√',
  'sin': 'sin',
  'cos': 'cos',
  'tan': 'tan',
  'abs': '|',
};

export function FunctionCall({ name, argument, className = '' }) {
  const displayName = FUNCTION_DISPLAY[name.toLowerCase()] || name;

  // Special case for exp: render as e^(argument)
  if (name.toLowerCase() === 'exp') {
    return (
      <span className={`eq-function eq-exp ${className}`}>
        <span className="eq-exp-base">e</span>
        <sup className="eq-exp-power">{argument}</sup>
      </span>
    );
  }

  // Special case for abs: render as |argument|
  if (name.toLowerCase() === 'abs') {
    return (
      <span className={`eq-function eq-abs ${className}`}>
        <span className="eq-abs-bar">|</span>
        {argument}
        <span className="eq-abs-bar">|</span>
      </span>
    );
  }

  // Standard function: name(argument)
  return (
    <span className={`eq-function ${className}`}>
      <span className="eq-fn-name">{displayName}</span>
      <span className="eq-fn-paren">(</span>
      <span className="eq-fn-arg">{argument}</span>
      <span className="eq-fn-paren">)</span>
    </span>
  );
}

export default FunctionCall;
