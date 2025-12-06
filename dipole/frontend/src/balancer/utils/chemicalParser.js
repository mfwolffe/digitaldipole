/**
 * Parser for Chemical Equations
 *
 * Builds structured equation objects from tokens.
 * Grammar:
 *   equation     ::= side ARROW side
 *   side         ::= compound (PLUS compound)*
 *   compound     ::= coefficient? compoundBody charge?
 *   compoundBody ::= (element | group)+
 *   element      ::= ELEMENT subscript?
 *   group        ::= LPAREN compoundBody RPAREN subscript?
 *   subscript    ::= NUMBER
 *   coefficient  ::= NUMBER
 *   charge       ::= CHARGE
 *
 * Output structure:
 *   Equation: { reactants: Compound[], products: Compound[], arrowType: string }
 *   Compound: { id, elements, groups, charge, coefficient, formula }
 *   Element: { symbol, count }
 *   Group: { elements, multiplier }
 */

import { TokenType } from './chemicalTokenizer.js';

let compoundIdCounter = 0;

/**
 * Generate unique compound ID
 */
function generateId() {
  return `compound-${++compoundIdCounter}`;
}

/**
 * Parser class - maintains position in token stream
 */
class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  peek() {
    return this.tokens[this.pos] || null;
  }

  consume() {
    return this.tokens[this.pos++] || null;
  }

  match(type, value = null) {
    const token = this.peek();
    if (!token) return false;
    if (token.type !== type) return false;
    if (value !== null && token.value !== value) return false;
    return true;
  }

  expect(type, value = null) {
    const token = this.consume();
    if (!token || token.type !== type) {
      const got = token ? `${token.type}(${token.value})` : 'EOF';
      throw new Error(`Expected ${type}${value ? `(${value})` : ''}, got ${got}`);
    }
    return token;
  }

  isAtEnd() {
    return !this.peek() || this.peek().type === TokenType.EOF;
  }
}

/**
 * Parse a chemical equation string
 * @param {string} equationStr - Equation string (e.g., "CH4 + O2 -> CO2 + H2O")
 * @returns {Object} Parsed equation object
 */
export function parseEquation(tokens) {
  if (!tokens || tokens.length === 0) {
    throw new Error('Empty equation');
  }

  const parser = new Parser(tokens);
  const equation = parseEquationInternal(parser);

  return equation;
}

/**
 * Parse equation: side ARROW side
 */
function parseEquationInternal(parser) {
  const reactants = parseSide(parser, 'reactant');

  if (!parser.match(TokenType.ARROW)) {
    throw new Error('Expected reaction arrow (-> or =)');
  }
  const arrowToken = parser.consume();

  const products = parseSide(parser, 'product');

  return {
    reactants,
    products,
    arrowType: arrowToken.value,
    isBalanced: false,
  };
}

/**
 * Parse one side of equation: compound (PLUS compound)*
 */
function parseSide(parser, side) {
  const compounds = [];

  compounds.push(parseCompound(parser, side));

  while (parser.match(TokenType.PLUS)) {
    parser.consume(); // consume +
    compounds.push(parseCompound(parser, side));
  }

  return compounds;
}

/**
 * Parse compound: coefficient? compoundBody charge?
 */
function parseCompound(parser, side) {
  let coefficient = 1;

  // Check for leading coefficient
  if (parser.match(TokenType.NUMBER)) {
    // Peek ahead - if next is ELEMENT or LPAREN, this is a coefficient
    const nextToken = parser.tokens[parser.pos + 1];
    if (nextToken && (nextToken.type === TokenType.ELEMENT || nextToken.type === TokenType.LPAREN)) {
      coefficient = parseInt(parser.consume().value, 10);
    }
  }

  // Parse compound body (elements and groups)
  const { elements, groups, formula } = parseCompoundBody(parser);

  // Parse optional charge
  let charge = 0;
  if (parser.match(TokenType.CHARGE)) {
    charge = parseCharge(parser.consume().value);
  }

  return {
    id: generateId(),
    elements,      // Flattened element list for balancing
    groups,        // Nested structure for display
    charge,
    coefficient,
    formula,
    side,
  };
}

/**
 * Parse compound body: (element | group)+
 * Returns both a flat element list and nested group structure
 */
function parseCompoundBody(parser) {
  const groups = [];
  const allElements = [];
  let formula = '';

  while (
    parser.match(TokenType.ELEMENT) ||
    parser.match(TokenType.LPAREN)
  ) {
    if (parser.match(TokenType.LPAREN)) {
      // Parse group: (elements) subscript?
      const group = parseGroup(parser);
      groups.push(group);

      // Expand group elements into flat list
      for (const elem of group.elements) {
        addElement(allElements, elem.symbol, elem.count * group.multiplier);
      }

      formula += `(${group.elements.map(e => e.symbol + (e.count > 1 ? e.count : '')).join('')})`;
      if (group.multiplier > 1) formula += group.multiplier;
    } else {
      // Parse single element
      const element = parseElement(parser);
      groups.push({ elements: [element], multiplier: 1 });
      addElement(allElements, element.symbol, element.count);

      formula += element.symbol;
      if (element.count > 1) formula += element.count;
    }
  }

  if (groups.length === 0) {
    throw new Error('Expected element or group in compound');
  }

  return { elements: allElements, groups, formula };
}

/**
 * Parse group: LPAREN compoundBody RPAREN subscript?
 */
function parseGroup(parser) {
  parser.expect(TokenType.LPAREN);

  const groupElements = [];

  while (!parser.match(TokenType.RPAREN) && !parser.isAtEnd()) {
    if (parser.match(TokenType.ELEMENT)) {
      groupElements.push(parseElement(parser));
    } else if (parser.match(TokenType.LPAREN)) {
      // Nested group - flatten it
      const nested = parseGroup(parser);
      for (const elem of nested.elements) {
        addElement(groupElements, elem.symbol, elem.count * nested.multiplier);
      }
    } else {
      break;
    }
  }

  parser.expect(TokenType.RPAREN);

  // Parse optional subscript
  let multiplier = 1;
  if (parser.match(TokenType.NUMBER)) {
    multiplier = parseInt(parser.consume().value, 10);
  }

  return { elements: groupElements, multiplier };
}

/**
 * Parse element: ELEMENT subscript?
 */
function parseElement(parser) {
  const elemToken = parser.expect(TokenType.ELEMENT);

  let count = 1;
  if (parser.match(TokenType.NUMBER)) {
    count = parseInt(parser.consume().value, 10);
  }

  return { symbol: elemToken.value, count };
}

/**
 * Parse charge string (e.g., "2+", "3-", "+", "-")
 * @returns {number} Charge value (positive or negative integer)
 */
function parseCharge(chargeStr) {
  if (!chargeStr) return 0;

  const match = chargeStr.match(/^(\d*)([+-])$/);
  if (!match) return 0;

  const num = match[1] ? parseInt(match[1], 10) : 1;
  const sign = match[2] === '+' ? 1 : -1;

  return num * sign;
}

/**
 * Add element to list, combining counts for duplicate symbols
 */
function addElement(elements, symbol, count) {
  const existing = elements.find(e => e.symbol === symbol);
  if (existing) {
    existing.count += count;
  } else {
    elements.push({ symbol, count });
  }
}

/**
 * Convert equation back to string representation
 */
export function equationToString(equation) {
  const reactantStr = equation.reactants.map(compoundToString).join(' + ');
  const productStr = equation.products.map(compoundToString).join(' + ');
  const arrow = equation.arrowType || '->';

  return `${reactantStr} ${arrow} ${productStr}`;
}

/**
 * Convert compound to string representation
 */
export function compoundToString(compound) {
  let str = '';

  if (compound.coefficient > 1) {
    str += compound.coefficient;
  }

  str += compound.formula || buildFormula(compound.groups);

  if (compound.charge !== 0) {
    str += '^';
    if (Math.abs(compound.charge) !== 1) {
      str += Math.abs(compound.charge);
    }
    str += compound.charge > 0 ? '+' : '-';
  }

  return str;
}

/**
 * Build formula string from groups
 */
function buildFormula(groups) {
  let formula = '';

  for (const group of groups) {
    if (group.multiplier > 1 || group.elements.length > 1) {
      formula += '(';
      for (const elem of group.elements) {
        formula += elem.symbol;
        if (elem.count > 1) formula += elem.count;
      }
      formula += ')';
      if (group.multiplier > 1) formula += group.multiplier;
    } else {
      for (const elem of group.elements) {
        formula += elem.symbol;
        if (elem.count > 1) formula += elem.count;
      }
    }
  }

  return formula;
}

/**
 * Get all unique elements in an equation
 */
export function getAllElements(equation) {
  const elements = new Set();

  for (const compound of [...equation.reactants, ...equation.products]) {
    for (const elem of compound.elements) {
      if (elem.symbol !== 'e') { // Exclude electrons
        elements.add(elem.symbol);
      }
    }
  }

  return Array.from(elements).sort();
}

/**
 * Get element count in a compound (considering coefficient)
 */
export function getElementCount(compound, elementSymbol) {
  const elem = compound.elements.find(e => e.symbol === elementSymbol);
  return elem ? elem.count * compound.coefficient : 0;
}

/**
 * Reset compound ID counter (for testing)
 */
export function resetIdCounter() {
  compoundIdCounter = 0;
}

export default {
  parseEquation,
  equationToString,
  compoundToString,
  getAllElements,
  getElementCount,
  resetIdCounter,
};
