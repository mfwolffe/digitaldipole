/**
 * Tokenizer for Chemical Equations
 *
 * Converts chemical equation strings into tokens for parsing.
 * Handles elements, subscripts, charges, parentheses, and reaction arrows.
 *
 * Examples:
 *   "CH4 + O2 -> CO2 + H2O"
 *   "Fe^3+ + e^- -> Fe^2+"
 *   "Ca(OH)2 + H2SO4 -> CaSO4 + 2H2O"
 */

export const TokenType = {
  ELEMENT: 'ELEMENT',       // H, O, Ca, Fe
  NUMBER: 'NUMBER',         // 2, 4, 12
  LPAREN: 'LPAREN',         // (
  RPAREN: 'RPAREN',         // )
  PLUS: 'PLUS',             // +
  ARROW: 'ARROW',           // ->, →, =, ⇌, <->
  CHARGE: 'CHARGE',         // ^2+, ^-, ^3-
  DOT: 'DOT',               // . or · (for hydrates)
  EOF: 'EOF',
};

// Element symbols - all valid periodic table elements
const ELEMENTS = new Set([
  'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
  'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar',
  'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
  'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr',
  'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd',
  'In', 'Sn', 'Sb', 'Te', 'I', 'Xe',
  'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy',
  'Ho', 'Er', 'Tm', 'Yb', 'Lu',
  'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg',
  'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn',
  'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf',
  'Es', 'Fm', 'Md', 'No', 'Lr',
  'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn',
  'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og',
]);

// Arrow patterns (order matters - check longer patterns first)
const ARROW_PATTERNS = ['<=>', '<->', '⇌', '->', '→', '=>', '='];

/**
 * Create a token object
 */
function token(type, value, position) {
  return { type, value, position };
}

/**
 * Check if a string is a valid element symbol
 */
export function isElement(str) {
  return ELEMENTS.has(str);
}

/**
 * Tokenize a chemical equation string
 *
 * @param {string} equation - Chemical equation (e.g., "CH4 + O2 -> CO2 + H2O")
 * @returns {Array<{type: string, value: string, position: number}>} Array of tokens
 * @throws {Error} If tokenization fails
 */
export function tokenize(equation) {
  if (!equation || typeof equation !== 'string') {
    return [token(TokenType.EOF, '', 0)];
  }

  const tokens = [];
  let i = 0;
  const len = equation.length;

  while (i < len) {
    const char = equation[i];
    const startPos = i;

    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Check for arrows (multi-character patterns first)
    let foundArrow = false;
    for (const arrow of ARROW_PATTERNS) {
      if (equation.slice(i, i + arrow.length) === arrow) {
        tokens.push(token(TokenType.ARROW, arrow, startPos));
        i += arrow.length;
        foundArrow = true;
        break;
      }
    }
    if (foundArrow) continue;

    // Plus sign (compound separator)
    if (char === '+') {
      // Check if this is a charge indicator (after ^)
      const prevToken = tokens[tokens.length - 1];
      if (prevToken && prevToken.type === TokenType.CHARGE) {
        // Append to existing charge
        prevToken.value += '+';
        i++;
        continue;
      }
      tokens.push(token(TokenType.PLUS, '+', startPos));
      i++;
      continue;
    }

    // Minus sign (could be charge)
    if (char === '-') {
      // Check if this is part of a charge
      const prevToken = tokens[tokens.length - 1];
      if (prevToken && prevToken.type === TokenType.CHARGE) {
        prevToken.value += '-';
        i++;
        continue;
      }
      // Otherwise skip (shouldn't appear alone in valid formula)
      i++;
      continue;
    }

    // Parentheses
    if (char === '(' || char === '[') {
      tokens.push(token(TokenType.LPAREN, '(', startPos));
      i++;
      continue;
    }
    if (char === ')' || char === ']') {
      tokens.push(token(TokenType.RPAREN, ')', startPos));
      i++;
      continue;
    }

    // Charge indicator (^)
    if (char === '^') {
      i++; // consume ^
      let chargeStr = '';

      // Parse optional number
      while (i < len && /\d/.test(equation[i])) {
        chargeStr += equation[i];
        i++;
      }

      // Parse sign (+ or -)
      if (i < len && (equation[i] === '+' || equation[i] === '-')) {
        chargeStr += equation[i];
        i++;
      }

      // If we got a number but no sign, default to +
      if (chargeStr && !/[+-]/.test(chargeStr)) {
        chargeStr += '+';
      }

      // If we only got a sign, that's valid (e.g., ^+ means +1)
      if (!chargeStr) {
        chargeStr = '1';
      }

      tokens.push(token(TokenType.CHARGE, chargeStr, startPos));
      continue;
    }

    // Dot (hydrate separator)
    if (char === '.' || char === '·' || char === '•') {
      tokens.push(token(TokenType.DOT, '.', startPos));
      i++;
      continue;
    }

    // Numbers (subscripts or coefficients)
    if (/\d/.test(char)) {
      let numStr = '';
      while (i < len && /\d/.test(equation[i])) {
        numStr += equation[i];
        i++;
      }
      tokens.push(token(TokenType.NUMBER, numStr, startPos));
      continue;
    }

    // Element symbols (uppercase letter optionally followed by lowercase)
    if (/[A-Z]/.test(char)) {
      let symbol = char;
      i++;

      // Check for lowercase continuation
      if (i < len && /[a-z]/.test(equation[i])) {
        symbol += equation[i];
        i++;
      }

      // Validate it's a real element
      if (ELEMENTS.has(symbol)) {
        tokens.push(token(TokenType.ELEMENT, symbol, startPos));
      } else if (symbol.length === 2 && ELEMENTS.has(symbol[0])) {
        // Two-letter combo wasn't valid, but first letter is an element
        // Push the single letter and back up
        tokens.push(token(TokenType.ELEMENT, symbol[0], startPos));
        i--;
      } else {
        throw new Error(`Unknown element "${symbol}" at position ${startPos}`);
      }
      continue;
    }

    // Lowercase 'e' for electron
    if (char === 'e' && (i + 1 >= len || !/[a-zA-Z]/.test(equation[i + 1]))) {
      tokens.push(token(TokenType.ELEMENT, 'e', startPos));
      i++;
      continue;
    }

    // Unknown character
    throw new Error(`Unexpected character "${char}" at position ${i}`);
  }

  tokens.push(token(TokenType.EOF, '', len));
  return tokens;
}

/**
 * Debug helper: format tokens as readable string
 */
export function tokensToString(tokens) {
  return tokens
    .filter(t => t.type !== TokenType.EOF)
    .map(t => `${t.type}(${t.value})`)
    .join(' ');
}

export default { tokenize, tokensToString, TokenType, isElement };
