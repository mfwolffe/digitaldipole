/**
 * Equation Renderer Module
 *
 * Exports the main EquationRenderer component and utilities.
 */

// Main component
export { EquationRenderer } from './EquationRenderer.jsx';

// Sub-components (for custom usage)
export { Fraction } from './components/Fraction.jsx';
export { Product } from './components/Product.jsx';
export { Power } from './components/Power.jsx';
export { Sqrt } from './components/Sqrt.jsx';
export { Parentheses } from './components/Parentheses.jsx';
export { FunctionCall } from './components/FunctionCall.jsx';
export { VariableInput } from './components/VariableInput.jsx';
export { VariableSymbol } from './components/VariableSymbol.jsx';

// Utilities (for debugging/testing)
export { tokenize, TokenType } from './tokenizer.js';
export { parse, astToCompact } from './astParser.js';
export { simplify, simplifiedToCompact } from './astSimplify.js';
export { renderEquation, renderNode } from './renderAST.jsx';

// Default export
export { EquationRenderer as default } from './EquationRenderer.jsx';
