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
 * Check if a React element tree contains complex structures (fractions, products, additions)
 * that would render poorly as a tiny superscript.
 *
 * We recursively check the React element tree for className props that indicate complexity.
 */
function isComplexArgument(element) {
  if (!element || typeof element !== 'object') return false;

  // Handle React elements
  if (element.props) {
    // Check this element's className
    const className = element.props.className || '';
    const complexClasses = ['eq-fraction', 'eq-product', 'eq-add', 'eq-subtract', 'eq-log-ratio', 'eq-var-input'];
    if (complexClasses.some(cls => className.includes(cls))) {
      return true;
    }

    // Recursively check children
    const children = element.props.children;
    if (Array.isArray(children)) {
      return children.some(child => isComplexArgument(child));
    }
    if (children && typeof children === 'object') {
      return isComplexArgument(children);
    }
  }

  // Handle arrays directly (from React.Fragment or map results)
  if (Array.isArray(element)) {
    return element.some(child => isComplexArgument(child));
  }

  return false;
}

export function FunctionCall({ name, argument, className = '' }) {
  const displayName = FUNCTION_DISPLAY[name.toLowerCase()] || name;

  // Special case for exp: render as e^(argument)
  if (name.toLowerCase() === 'exp') {
    const hasComplexArg = isComplexArgument(argument);

    // For complex arguments (fractions, additions, inputs), use raised layout with parentheses
    // For chemistry/physics, this is almost always the case
    if (hasComplexArg) {
      return (
        <span className={`eq-function eq-exp-raised ${className}`}>
          <span className="eq-exp-base">e</span>
          <span className="eq-exp-exponent">
            <span className="eq-exp-paren">(</span>
            {argument}
            <span className="eq-exp-paren">)</span>
          </span>
        </span>
      );
    }

    // For simple arguments (like e^x or e^2), render as e^x with traditional superscript
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
