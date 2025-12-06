/**
 * AST Parser for Tokenized Expressions
 *
 * Builds an Abstract Syntax Tree from tokens using recursive descent parsing.
 * Handles operator precedence: parentheses > exponents > multiplication/division > addition/subtraction
 *
 * AST Node Types:
 *   - number: { type: 'number', value: string }
 *   - variable: { type: 'variable', name: string }
 *   - negate: { type: 'negate', child: node }
 *   - add: { type: 'add', left: node, right: node }
 *   - subtract: { type: 'subtract', left: node, right: node }
 *   - multiply: { type: 'multiply', left: node, right: node }
 *   - divide: { type: 'divide', left: node, right: node }
 *   - power: { type: 'power', base: node, exponent: node }
 *   - function: { type: 'function', name: string, argument: node }
 */

import { TokenType } from './tokenizer.js';

/**
 * Parser class - maintains position in token stream
 */
class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  // Get current token without consuming
  peek() {
    return this.tokens[this.pos] || null;
  }

  // Get current token and advance
  consume() {
    return this.tokens[this.pos++] || null;
  }

  // Check if current token matches expected type and optionally value
  match(type, value = null) {
    const token = this.peek();
    if (!token) return false;
    if (token.type !== type) return false;
    if (value !== null && token.value !== value) return false;
    return true;
  }

  // Expect a token of given type, throw if not found
  expect(type, value = null) {
    const token = this.consume();
    if (!token || token.type !== type || (value !== null && token.value !== value)) {
      throw new Error(`Expected ${type}${value ? `(${value})` : ''}, got ${token ? `${token.type}(${token.value})` : 'EOF'}`);
    }
    return token;
  }

  // Check if at end of tokens
  isAtEnd() {
    return this.pos >= this.tokens.length;
  }
}

/**
 * Parse tokens into AST
 * @param {Array} tokens - Token array from tokenizer
 * @returns {Object} AST root node
 */
export function parse(tokens) {
  if (!tokens || tokens.length === 0) {
    return null;
  }

  const parser = new Parser(tokens);
  const ast = parseExpression(parser);

  // Check for unconsumed tokens
  if (!parser.isAtEnd()) {
    console.warn('Parser: unconsumed tokens remaining:', parser.tokens.slice(parser.pos));
  }

  return ast;
}

/**
 * Expression: handles addition and subtraction (lowest precedence)
 */
function parseExpression(parser) {
  let left = parseTerm(parser);

  while (parser.match(TokenType.OPERATOR, '+') || parser.match(TokenType.OPERATOR, '-')) {
    const op = parser.consume();
    const right = parseTerm(parser);

    if (op.value === '+') {
      left = { type: 'add', left, right };
    } else {
      left = { type: 'subtract', left, right };
    }
  }

  return left;
}

/**
 * Term: handles multiplication and division
 */
function parseTerm(parser) {
  let left = parsePower(parser);

  while (parser.match(TokenType.OPERATOR, '*') || parser.match(TokenType.OPERATOR, '/')) {
    const op = parser.consume();
    const right = parsePower(parser);

    if (op.value === '*') {
      left = { type: 'multiply', left, right };
    } else {
      left = { type: 'divide', left, right };
    }
  }

  return left;
}

/**
 * Power: handles exponentiation (right-associative)
 */
function parsePower(parser) {
  const base = parseUnary(parser);

  if (parser.match(TokenType.OPERATOR, '^')) {
    parser.consume();
    const exponent = parsePower(parser); // Right-associative
    return { type: 'power', base, exponent };
  }

  return base;
}

/**
 * Unary: handles negation
 */
function parseUnary(parser) {
  if (parser.match(TokenType.OPERATOR, '-')) {
    parser.consume();
    const child = parseUnary(parser);
    return { type: 'negate', child };
  }

  return parsePrimary(parser);
}

/**
 * Primary: handles atoms (numbers, variables, functions, parentheses)
 */
function parsePrimary(parser) {
  const token = parser.peek();

  if (!token) {
    throw new Error('Unexpected end of expression');
  }

  // Number
  if (token.type === TokenType.NUMBER) {
    parser.consume();
    return { type: 'number', value: token.value };
  }

  // Variable
  if (token.type === TokenType.VARIABLE) {
    parser.consume();
    return { type: 'variable', name: token.value };
  }

  // Function call
  if (token.type === TokenType.FUNCTION) {
    parser.consume();
    parser.expect(TokenType.LPAREN);
    const argument = parseExpression(parser);
    parser.expect(TokenType.RPAREN);
    return { type: 'function', name: token.value, argument };
  }

  // Parenthesized expression
  if (token.type === TokenType.LPAREN) {
    parser.consume();
    const expr = parseExpression(parser);
    parser.expect(TokenType.RPAREN);
    return expr; // Don't wrap in group node - just return the expression
  }

  throw new Error(`Unexpected token: ${token.type}(${token.value})`);
}

/**
 * Debug helper: format AST as readable string
 */
export function astToString(node, indent = 0) {
  if (!node) return 'null';

  const pad = '  '.repeat(indent);

  switch (node.type) {
    case 'number':
      return `${pad}NUMBER(${node.value})`;
    case 'variable':
      return `${pad}VAR(${node.name})`;
    case 'negate':
      return `${pad}NEGATE\n${astToString(node.child, indent + 1)}`;
    case 'add':
      return `${pad}ADD\n${astToString(node.left, indent + 1)}\n${astToString(node.right, indent + 1)}`;
    case 'subtract':
      return `${pad}SUBTRACT\n${astToString(node.left, indent + 1)}\n${astToString(node.right, indent + 1)}`;
    case 'multiply':
      return `${pad}MULTIPLY\n${astToString(node.left, indent + 1)}\n${astToString(node.right, indent + 1)}`;
    case 'divide':
      return `${pad}DIVIDE\n${astToString(node.left, indent + 1)}\n${astToString(node.right, indent + 1)}`;
    case 'power':
      return `${pad}POWER\n${pad}  base:\n${astToString(node.base, indent + 2)}\n${pad}  exp:\n${astToString(node.exponent, indent + 2)}`;
    case 'function':
      return `${pad}FUNC(${node.name})\n${astToString(node.argument, indent + 1)}`;
    default:
      return `${pad}UNKNOWN(${node.type})`;
  }
}

/**
 * Compact string representation of AST (for debugging)
 */
export function astToCompact(node) {
  if (!node) return 'null';

  switch (node.type) {
    case 'number':
      return node.value;
    case 'variable':
      return node.name;
    case 'negate':
      return `(-${astToCompact(node.child)})`;
    case 'add':
      return `(${astToCompact(node.left)} + ${astToCompact(node.right)})`;
    case 'subtract':
      return `(${astToCompact(node.left)} - ${astToCompact(node.right)})`;
    case 'multiply':
      return `(${astToCompact(node.left)} * ${astToCompact(node.right)})`;
    case 'divide':
      return `(${astToCompact(node.left)} / ${astToCompact(node.right)})`;
    case 'power':
      return `(${astToCompact(node.base)} ^ ${astToCompact(node.exponent)})`;
    case 'function':
      return `${node.name}(${astToCompact(node.argument)})`;
    default:
      return `?${node.type}?`;
  }
}

export default { parse, astToString, astToCompact };
