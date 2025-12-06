/**
 * Equation Renderer Tests
 *
 * Unit tests for the tokenizer, parser, and simplifier.
 * Run with: node equation-renderer.test.js
 *
 * Uses a minimal test framework - no external dependencies.
 */
import { tokenize, TokenType } from './tokenizer.js';
import { parse, astToCompact } from './astParser.js';
import { simplify, simplifiedToCompact } from './astSimplify.js';

// Simple test framework
let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    failures.push({ name, error: e.message });
    console.log(`  ✗ ${name}`);
    console.log(`    ${e.message}`);
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected "${expected}" but got "${actual}"`);
      }
    },
    toEqual(expected) {
      const actualStr = JSON.stringify(actual);
      const expectedStr = JSON.stringify(expected);
      if (actualStr !== expectedStr) {
        throw new Error(`Expected ${expectedStr} but got ${actualStr}`);
      }
    },
    toContain(expected) {
      if (!actual.includes(expected)) {
        throw new Error(`Expected "${actual}" to contain "${expected}"`);
      }
    },
    toHaveLength(expected) {
      if (actual.length !== expected) {
        throw new Error(`Expected length ${expected} but got ${actual.length}`);
      }
    }
  };
}

function describe(name, fn) {
  console.log(`\n${name}`);
  fn();
}

// ============================================================
// TOKENIZER TESTS
// ============================================================

describe('Tokenizer', () => {
  test('tokenizes simple variable', () => {
    const tokens = tokenize('P1');
    expect(tokens).toHaveLength(1);
    expect(tokens[0].type).toBe(TokenType.VARIABLE);
    expect(tokens[0].value).toBe('P1');
  });

  test('tokenizes multiplication', () => {
    const tokens = tokenize('P1*V1');
    expect(tokens).toHaveLength(3);
    expect(tokens[1].type).toBe(TokenType.OPERATOR);
    expect(tokens[1].value).toBe('*');
  });

  test('tokenizes power with negative exponent', () => {
    const tokens = tokenize('P2^(-1)');
    expect(tokens).toHaveLength(5);
    expect(tokens[1].value).toBe('^');
    expect(tokens[3].value).toBe('-1');
  });

  test('tokenizes decimal numbers', () => {
    const tokens = tokenize('0.693147*x');
    expect(tokens[0].type).toBe(TokenType.NUMBER);
    expect(tokens[0].value).toBe('0.693147');
  });

  test('tokenizes function calls', () => {
    const tokens = tokenize('exp(x)');
    expect(tokens[0].type).toBe(TokenType.FUNCTION);
    expect(tokens[0].value).toBe('exp');
  });

  test('tokenizes complex expression', () => {
    const tokens = tokenize('(-T1+T2)^(-1)*R');
    expect(tokens.length).toBe(12);
  });

  test('handles negative sign as operator', () => {
    const tokens = tokenize('a-b');
    expect(tokens).toHaveLength(3);
    expect(tokens[1].type).toBe(TokenType.OPERATOR);
    expect(tokens[1].value).toBe('-');
  });
});

// ============================================================
// PARSER TESTS
// ============================================================

describe('AST Parser', () => {
  test('parses simple product', () => {
    const ast = parse(tokenize('P1*V1'));
    expect(ast.type).toBe('multiply');
    expect(ast.left.name).toBe('P1');
    expect(ast.right.name).toBe('V1');
  });

  test('parses power expression', () => {
    const ast = parse(tokenize('P2^(-1)'));
    expect(ast.type).toBe('power');
    expect(ast.base.name).toBe('P2');
    expect(ast.exponent.value).toBe('-1');
  });

  test('parses addition', () => {
    const ast = parse(tokenize('a+b'));
    expect(ast.type).toBe('add');
  });

  test('parses subtraction', () => {
    const ast = parse(tokenize('a-b'));
    expect(ast.type).toBe('subtract');
  });

  test('respects operator precedence: multiply before add', () => {
    const ast = parse(tokenize('a+b*c'));
    expect(ast.type).toBe('add');
    expect(ast.right.type).toBe('multiply');
  });

  test('respects operator precedence: power before multiply', () => {
    const ast = parse(tokenize('a*b^c'));
    expect(ast.type).toBe('multiply');
    expect(ast.right.type).toBe('power');
  });

  test('parses parenthesized expressions', () => {
    const ast = parse(tokenize('(a+b)*c'));
    expect(ast.type).toBe('multiply');
    expect(ast.left.type).toBe('add');
  });

  test('parses function calls', () => {
    const ast = parse(tokenize('exp(x)'));
    expect(ast.type).toBe('function');
    expect(ast.name).toBe('exp');
    expect(ast.argument.name).toBe('x');
  });

  test('parses negation', () => {
    const ast = parse(tokenize('-x'));
    expect(ast.type).toBe('negate');
    expect(ast.child.name).toBe('x');
  });

  test('parses Boyle\'s Law expression', () => {
    const ast = parse(tokenize('P1*V1*P2^(-1)'));
    const compact = astToCompact(ast);
    expect(compact).toBe('((P1 * V1) * (P2 ^ -1))');
  });
});

// ============================================================
// SIMPLIFIER TESTS
// ============================================================

describe('AST Simplifier', () => {
  test('converts x^(-1) to fraction', () => {
    const ast = parse(tokenize('P2^(-1)'));
    const simplified = simplify(ast);
    expect(simplified.type).toBe('fraction');
    expect(simplified.numerator.value).toBe('1');
    expect(simplified.denominator.name).toBe('P2');
  });

  test('groups multiplied terms with inverse into fraction', () => {
    const ast = parse(tokenize('P1*V1*P2^(-1)'));
    const simplified = simplify(ast);
    expect(simplified.type).toBe('fraction');
    expect(simplified.numerator.type).toBe('product');
    expect(simplified.denominator.name).toBe('P2');
  });

  test('produces correct compact form for Boyle\'s Law', () => {
    const ast = parse(tokenize('P1*V1*P2^(-1)'));
    const simplified = simplify(ast);
    const compact = simplifiedToCompact(simplified);
    expect(compact).toBe('[(P1 × V1) / P2]');
  });

  test('handles multiple denominators', () => {
    const ast = parse(tokenize('a*b^(-1)*c^(-1)'));
    const simplified = simplify(ast);
    expect(simplified.type).toBe('fraction');
    expect(simplified.denominator.type).toBe('product');
  });

  test('simplifies Arrhenius Ea expression', () => {
    const ast = parse(tokenize('(-T1+T2)^(-1)*R*T1*T2*lnRatio'));
    const simplified = simplify(ast);
    const compact = simplifiedToCompact(simplified);
    expect(compact).toContain('/');
    expect(compact).toContain('R');
    expect(compact).toContain('lnRatio');
  });

  test('detects square root from ^(1/2)', () => {
    const ast = parse(tokenize('(M2/M1)^(1/2)'));
    const simplified = simplify(ast);
    // After division becomes fraction and power becomes sqrt
    expect(simplified.type).toBe('sqrt');
  });

  test('preserves simple products without fractions', () => {
    const ast = parse(tokenize('P1*V1'));
    const simplified = simplify(ast);
    expect(simplified.type).toBe('product');
    expect(simplified.factors).toHaveLength(2);
  });

  test('handles exp() function', () => {
    const ast = parse(tokenize('k1*exp(-Ea/(R*T))'));
    const simplified = simplify(ast);
    const compact = simplifiedToCompact(simplified);
    expect(compact).toContain('exp');
  });
});

// ============================================================
// INTEGRATION TESTS - Full Pipeline
// ============================================================

describe('Full Pipeline', () => {
  const testCases = [
    {
      name: 'Boyle\'s Law (V2)',
      input: 'P1*V1*P2^(-1)',
      expected: '[(P1 × V1) / P2]'
    },
    {
      name: 'Half-life (k)',
      input: '0.693147*tHalf^(-1)',
      expected: '[0.693147 / tHalf]'
    },
    {
      name: 'Simple product',
      input: 'n*R*T',
      expected: '(n × R × T)'
    },
    {
      name: 'Graham\'s Law with sqrt',
      input: '(M1^(-1)*M2)^(1/2)*r2',
      expectedContains: '√'
    }
  ];

  testCases.forEach(({ name, input, expected, expectedContains }) => {
    test(name, () => {
      const tokens = tokenize(input);
      const ast = parse(tokens);
      const simplified = simplify(ast);
      const result = simplifiedToCompact(simplified);

      if (expected) {
        expect(result).toBe(expected);
      }
      if (expectedContains) {
        expect(result).toContain(expectedContains);
      }
    });
  });
});

// ============================================================
// SUMMARY
// ============================================================

console.log('\n' + '='.repeat(50));
console.log(`Tests: ${passed + failed} total, ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.log('\nFailed tests:');
  failures.forEach(({ name, error }) => {
    console.log(`  - ${name}: ${error}`);
  });
  process.exit(1);
} else {
  console.log('\nAll tests passed!');
  process.exit(0);
}
