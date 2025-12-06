/**
 * Tokenizer for Nerdamer Expression Output
 *
 * Converts Nerdamer's text output into a stream of tokens for parsing.
 *
 * Token Types:
 *   - NUMBER: numeric literal (e.g., "0.693147", "-1", "2")
 *   - VARIABLE: identifier (e.g., "P1", "T2", "lnRatio")
 *   - OPERATOR: *, +, -, ^, /
 *   - LPAREN: (
 *   - RPAREN: )
 *   - FUNCTION: function name followed by ( (e.g., "exp", "sqrt", "log")
 */

export const TokenType = {
  NUMBER: 'NUMBER',
  VARIABLE: 'VARIABLE',
  OPERATOR: 'OPERATOR',
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  FUNCTION: 'FUNCTION',
};

// Known function names in Nerdamer output
const FUNCTIONS = new Set(['exp', 'sqrt', 'log', 'ln', 'sin', 'cos', 'tan', 'abs']);

/**
 * Create a token object
 */
function token(type, value) {
  return { type, value };
}

/**
 * Tokenize a Nerdamer expression string
 *
 * @param {string} expr - Nerdamer expression (e.g., "P1*V1*P2^(-1)")
 * @returns {Array<{type: string, value: string}>} Array of tokens
 */
export function tokenize(expr) {
  if (!expr || typeof expr !== 'string') {
    return [];
  }

  const tokens = [];
  let i = 0;
  const len = expr.length;

  while (i < len) {
    const char = expr[i];

    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Operators
    if (char === '*' || char === '+' || char === '^' || char === '/') {
      tokens.push(token(TokenType.OPERATOR, char));
      i++;
      continue;
    }

    // Minus sign - could be operator or part of number
    if (char === '-') {
      // Check if this is a negative number (after operator, lparen, or at start)
      const prevToken = tokens[tokens.length - 1];
      const isNegativeNumber = !prevToken ||
                               prevToken.type === TokenType.OPERATOR ||
                               prevToken.type === TokenType.LPAREN;

      // Look ahead: is next char a digit?
      if (isNegativeNumber && i + 1 < len && /\d/.test(expr[i + 1])) {
        // Parse as negative number
        let numStr = '-';
        i++;
        while (i < len && /[\d.]/.test(expr[i])) {
          numStr += expr[i];
          i++;
        }
        tokens.push(token(TokenType.NUMBER, numStr));
        continue;
      } else {
        // It's a subtraction operator
        tokens.push(token(TokenType.OPERATOR, '-'));
        i++;
        continue;
      }
    }

    // Parentheses
    if (char === '(') {
      tokens.push(token(TokenType.LPAREN, '('));
      i++;
      continue;
    }
    if (char === ')') {
      tokens.push(token(TokenType.RPAREN, ')'));
      i++;
      continue;
    }

    // Numbers (including decimals)
    if (/\d/.test(char)) {
      let numStr = '';
      while (i < len && /[\d.]/.test(expr[i])) {
        numStr += expr[i];
        i++;
      }
      tokens.push(token(TokenType.NUMBER, numStr));
      continue;
    }

    // Identifiers (variables or functions)
    if (/[a-zA-Z_]/.test(char)) {
      let ident = '';
      while (i < len && /[a-zA-Z0-9_]/.test(expr[i])) {
        ident += expr[i];
        i++;
      }

      // Check if this is a function (followed by parenthesis)
      if (FUNCTIONS.has(ident.toLowerCase()) && i < len && expr[i] === '(') {
        tokens.push(token(TokenType.FUNCTION, ident));
      } else {
        tokens.push(token(TokenType.VARIABLE, ident));
      }
      continue;
    }

    // Unknown character - skip it (shouldn't happen with valid Nerdamer output)
    console.warn(`Tokenizer: skipping unknown character '${char}' at position ${i}`);
    i++;
  }

  return tokens;
}

/**
 * Debug helper: format tokens as readable string
 */
export function tokensToString(tokens) {
  return tokens.map(t => `${t.type}(${t.value})`).join(' ');
}

export default { tokenize, tokensToString, TokenType };
