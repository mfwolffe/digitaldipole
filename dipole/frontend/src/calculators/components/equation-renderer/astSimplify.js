/**
 * AST Simplifier
 *
 * Transforms the parsed AST into a form that's easier to render as fractions.
 * Main transformations:
 *   1. x^(-1) → treated as 1/x (moves to denominator)
 *   2. Collect multiplication chains into numerator/denominator groups
 *   3. Flatten nested multiplications
 *   4. Create proper fraction nodes
 *
 * New node types after simplification:
 *   - fraction: { type: 'fraction', numerator: [...nodes], denominator: [...nodes] }
 *   - product: { type: 'product', factors: [...nodes] }
 */

/**
 * Check if a node represents x^(-1) pattern
 */
function isInverse(node) {
  if (node.type !== 'power') return false;
  if (node.exponent.type !== 'number') return false;
  return node.exponent.value === '-1';
}

/**
 * Check if a node represents x^(-n) for any negative n
 */
function hasNegativeExponent(node) {
  if (node.type !== 'power') return false;
  if (node.exponent.type === 'number') {
    return parseFloat(node.exponent.value) < 0;
  }
  if (node.exponent.type === 'negate') {
    return true;
  }
  return false;
}

/**
 * Flatten a multiplication tree into an array of factors
 * Returns { numerator: [...], denominator: [...] }
 */
function flattenMultiply(node) {
  const numerator = [];
  const denominator = [];

  function collect(n) {
    if (n.type === 'multiply') {
      collect(n.left);
      collect(n.right);
    } else if (isInverse(n)) {
      // x^(-1) goes to denominator
      denominator.push(n.base);
    } else if (n.type === 'power' && hasNegativeExponent(n)) {
      // x^(-n) where n > 1: put x^n in denominator
      const positiveExp = negateNode(n.exponent);
      denominator.push({ type: 'power', base: n.base, exponent: positiveExp });
    } else if (n.type === 'divide') {
      // a/b: a goes to numerator, b to denominator
      collect(n.left);
      denominator.push(n.right);
    } else {
      numerator.push(n);
    }
  }

  collect(node);
  return { numerator, denominator };
}

/**
 * Negate a node (for converting negative exponents to positive)
 */
function negateNode(node) {
  if (node.type === 'number') {
    const val = parseFloat(node.value);
    return { type: 'number', value: String(-val) };
  }
  if (node.type === 'negate') {
    return node.child;
  }
  return { type: 'negate', child: node };
}

/**
 * Simplify the AST for rendering
 * Main entry point
 */
export function simplify(node) {
  if (!node) return null;

  switch (node.type) {
    case 'number':
    case 'variable':
      return node;

    case 'negate': {
      const child = simplify(node.child);
      // Collapse double negation: -(-x) → x
      if (child.type === 'negate') {
        return child.child;
      }
      // Collapse negation of negative number: -(-5) → 5
      if (child.type === 'number' && child.value.startsWith('-')) {
        return { type: 'number', value: child.value.slice(1) };
      }
      return {
        type: 'negate',
        child
      };
    }

    case 'add':
      return {
        type: 'add',
        left: simplify(node.left),
        right: simplify(node.right)
      };

    case 'subtract':
      return {
        type: 'subtract',
        left: simplify(node.left),
        right: simplify(node.right)
      };

    case 'multiply': {
      // Flatten multiplication and separate into numerator/denominator
      const { numerator, denominator } = flattenMultiply(node);

      // Recursively simplify each factor
      const simplifiedNum = numerator.map(simplify);
      const simplifiedDenom = denominator.map(simplify);

      if (simplifiedDenom.length === 0) {
        // No denominator - just a product
        if (simplifiedNum.length === 1) {
          return simplifiedNum[0];
        }
        return { type: 'product', factors: simplifiedNum };
      }

      // Has denominator - create fraction
      return {
        type: 'fraction',
        numerator: simplifiedNum.length === 1 ? simplifiedNum[0] : { type: 'product', factors: simplifiedNum },
        denominator: simplifiedDenom.length === 1 ? simplifiedDenom[0] : { type: 'product', factors: simplifiedDenom }
      };
    }

    case 'divide': {
      // Treat as fraction directly
      return {
        type: 'fraction',
        numerator: simplify(node.left),
        denominator: simplify(node.right)
      };
    }

    case 'power': {
      const base = simplify(node.base);
      const exponent = simplify(node.exponent);

      // Special case: x^(-1) at top level becomes fraction
      if (isInverse(node)) {
        return {
          type: 'fraction',
          numerator: { type: 'number', value: '1' },
          denominator: base
        };
      }

      // Special case: x^(1/2) is sqrt
      if (exponent.type === 'fraction' &&
          exponent.numerator.type === 'number' && exponent.numerator.value === '1' &&
          exponent.denominator.type === 'number' && exponent.denominator.value === '2') {
        return { type: 'sqrt', child: base };
      }

      // Check for (1/2) as a divide result
      if (exponent.type === 'number' && exponent.value === '0.5') {
        return { type: 'sqrt', child: base };
      }

      return { type: 'power', base, exponent };
    }

    case 'function':
      return {
        type: 'function',
        name: node.name,
        argument: simplify(node.argument)
      };

    default:
      return node;
  }
}

/**
 * Debug helper: format simplified AST as readable string
 */
export function simplifiedToCompact(node) {
  if (!node) return 'null';

  switch (node.type) {
    case 'number':
      return node.value;
    case 'variable':
      return node.name;
    case 'negate':
      return `(-${simplifiedToCompact(node.child)})`;
    case 'add':
      return `(${simplifiedToCompact(node.left)} + ${simplifiedToCompact(node.right)})`;
    case 'subtract':
      return `(${simplifiedToCompact(node.left)} - ${simplifiedToCompact(node.right)})`;
    case 'product':
      return `(${node.factors.map(simplifiedToCompact).join(' × ')})`;
    case 'fraction':
      return `[${simplifiedToCompact(node.numerator)} / ${simplifiedToCompact(node.denominator)}]`;
    case 'power':
      return `(${simplifiedToCompact(node.base)} ^ ${simplifiedToCompact(node.exponent)})`;
    case 'sqrt':
      return `√(${simplifiedToCompact(node.child)})`;
    case 'function':
      return `${node.name}(${simplifiedToCompact(node.argument)})`;
    default:
      return `?${node.type}?`;
  }
}

export default { simplify, simplifiedToCompact };
