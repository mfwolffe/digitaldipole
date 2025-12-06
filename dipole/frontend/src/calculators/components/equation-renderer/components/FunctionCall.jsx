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

/**
 * Check if a React element tree contains complex structures (fractions, products)
 * that would render poorly as a tiny superscript
 */
function isComplexArgument(element) {
  if (!element || typeof element !== 'object') return false;

  // Check if this element has a className indicating complexity
  const className = element.props?.className || '';
  if (className.includes('eq-fraction') || className.includes('eq-product')) {
    return true;
  }

  // Recursively check children
  const children = element.props?.children;
  if (Array.isArray(children)) {
    return children.some(child => isComplexArgument(child));
  }
  if (children && typeof children === 'object') {
    return isComplexArgument(children);
  }

  return false;
}

export function FunctionCall({ name, argument, className = '' }) {
  const displayName = FUNCTION_DISPLAY[name.toLowerCase()] || name;

  // Special case for exp: render as e^(argument)
  if (name.toLowerCase() === 'exp') {
    // For complex arguments (fractions), use raised block layout that doesn't shrink content
    if (isComplexArgument(argument)) {
      return (
        <span className={`eq-function eq-exp-raised ${className}`}>
          <span className="eq-exp-base">e</span>
          <span className="eq-exp-exponent">
            {argument}
          </span>
        </span>
      );
    }

    // For simple arguments, render as e^x with traditional superscript
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
