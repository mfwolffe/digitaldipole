/**
 * Test script for tokenizer, AST parser, and simplifier
 * Run with: node test-parser.mjs
 */
import { tokenize, tokensToString } from './tokenizer.js';
import { parse, astToString, astToCompact } from './astParser.js';
import { simplify, simplifiedToCompact } from './astSimplify.js';

const tests = [
  // Simple fraction cases
  { expr: 'P1*V1*P2^(-1)', desc: 'Boyle: V2 = P1*V1/P2' },
  { expr: 'P1^(-1)*P2*V2', desc: 'Boyle: V1 = P2*V2/P1' },
  { expr: '0.693147*tHalf^(-1)', desc: 'Half-life: k = ln(2)/tHalf' },

  // Complex cases
  { expr: '(-T1+T2)^(-1)*R*T1*T2*lnRatio', desc: 'Arrhenius: Ea' },
  { expr: '-(-Ea-R*T2*lnRatio)^(-1)*Ea*T2', desc: 'Arrhenius: T1' },

  // Special cases
  { expr: '(M1^(-1)*M2)^(1/2)*r2', desc: 'Graham: r1 = sqrt(M2/M1)*r2' },
  { expr: 'k1*exp(-Ea/(R*T))', desc: 'Arrhenius single-point' },

  // Pure products
  { expr: 'P1*V1', desc: 'Simple product' },
  { expr: 'n*R*T', desc: 'Ideal gas numerator' }
];

console.log('=== Equation Renderer Pipeline Tests ===\n');

tests.forEach(({ expr, desc }) => {
  console.log(`--- ${desc} ---`);
  console.log('Input:', expr);

  const tokens = tokenize(expr);

  try {
    const ast = parse(tokens);
    console.log('Parsed:', astToCompact(ast));

    const simplified = simplify(ast);
    console.log('Simplified:', simplifiedToCompact(simplified));
  } catch (e) {
    console.log('ERROR:', e.message);
  }
  console.log('');
});
