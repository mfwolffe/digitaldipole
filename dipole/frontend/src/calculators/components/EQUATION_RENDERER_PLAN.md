# Revolutionary Inline Equation Renderer

## Vision

Render symbolic equations as beautiful, interactive HTML with input fields embedded directly where variables appear. Users see the actual mathematical structure while entering values inline.

**Example - Arrhenius Equation solving for Ea:**
```
E_a = (R · [T₁ input] · [T₂ input] · ln([k₂ input]/[k₁ input])) / ([T₂ input] - [T₁ input])
```

---

## Implementation Targets

### Phase 1: Tokenizer
- [x] Create `tokenizer.js` - breaks Nerdamer output into tokens
- [x] Handle operators: `*`, `+`, `-`, `^`, `/`
- [x] Handle parentheses: `(`, `)`
- [x] Handle variables: `T1`, `T2`, `lnRatio`, etc.
- [x] Handle numbers: `0.693147`, `-1`, etc.
- [x] Handle function calls: `exp(...)`, `sqrt(...)`
- [x] **TEST**: Tokenize simple expression `P1*V1*P2^(-1)*V2^(-1)`
- [x] **TEST**: Tokenize complex expression `(-T1+T2)^(-1)*R*T1*T2*lnRatio`

### Phase 2: AST Parser
- [x] Create `astParser.js` - builds tree from tokens
- [x] Define AST node types:
  - `multiply`: { type, left, right }
  - `divide`: { type, left, right }
  - `add`: { type, left, right }
  - `subtract`: { type, left, right }
  - `power`: { type, base, exponent }
  - `negate`: { type, child }
  - `variable`: { type, name }
  - `number`: { type, value }
  - `function`: { type, name, argument }
- [x] Implement operator precedence (PEMDAS)
- [x] **TEST**: Parse `P1*V1*P2^(-1)` → `((P1 * V1) * (P2 ^ -1))`
- [x] **TEST**: Parse `(-T1+T2)^(-1)*R*T1*T2*lnRatio` → complex nested structure

### Phase 3: AST Simplification
- [x] Create `astSimplify.js` - restructures for better rendering
- [x] Collect `x^(-1)` terms into denominator
- [x] Group multiplied terms in numerator/denominator
- [x] Recognize patterns: `a^(-1)*b` → `b/a`
- [x] Handle nested fractions
- [x] Detect `x^(1/2)` as sqrt
- [x] **TEST**: `P1*V1*P2^(-1)` → `[(P1 × V1) / P2]`
- [x] **TEST**: `(-T1+T2)^(-1)*R*T1*T2*lnRatio` → `[(R × T1 × T2 × lnRatio) / ((-T1) + T2)]`

### Phase 4: React Renderer Components
- [x] Create `EquationRenderer.jsx` - main component
- [x] Create `Fraction.jsx` - renders numerator/denominator with bar
- [x] Create `Product.jsx` - renders multiplication with × symbol
- [x] Create `Power.jsx` - renders base with superscript exponent
- [x] Create `Sqrt.jsx` - renders square root
- [x] Create `VariableInput.jsx` - inline input for known variables
- [x] Create `VariableSymbol.jsx` - displays unknown/constant as symbol
- [x] Create `FunctionCall.jsx` - renders exp(), ln() with proper styling
- [x] Create `Parentheses.jsx` - auto-sizing parentheses
- [x] Create `renderAST.jsx` - AST to React conversion
- [x] Create CSS styles
- [x] Build passes without errors

### Phase 5: Integration
- [x] Create `renderAST.jsx` - converts AST to React components
- [x] Map variable IDs to input components
- [x] Wire up value changes to parent state
- [x] Integrate with InlineEquationInput
- [x] Pass logConfig for logarithmic equations
- [x] Build passes successfully
- [ ] **TEST**: Full pipeline with Boyle's Law
- [ ] **TEST**: Full pipeline with Arrhenius Equation

### Phase 6: Logarithm Handling
- [ ] Detect `lnRatio` in AST and expand to `ln(num/denom)`
- [ ] Create special `LogRatio.jsx` component
- [ ] Render fraction inside logarithm with both inputs
- [ ] **TEST**: Clausius-Clapeyron equation
- [ ] **TEST**: First Order Rate Law

### Phase 7: Polish & Edge Cases
- [ ] Add CSS for proper sizing/alignment
- [ ] Handle very long expressions (overflow)
- [ ] Add hover tooltips showing variable name/unit
- [ ] Keyboard navigation between inputs
- [ ] Error states for invalid input
- [ ] **TEST**: All 31 calculators render correctly

---

## File Structure

```
src/calculators/components/equation-renderer/
├── index.js                 # Main export
├── tokenizer.js             # Phase 1: Tokenization
├── astParser.js             # Phase 2: AST building
├── astSimplify.js           # Phase 3: AST restructuring
├── renderAST.js             # Phase 5: AST → React
├── components/
│   ├── EquationRenderer.jsx # Main wrapper
│   ├── Fraction.jsx
│   ├── Product.jsx
│   ├── Sum.jsx
│   ├── Power.jsx
│   ├── VariableInput.jsx
│   ├── VariableSymbol.jsx
│   ├── Logarithm.jsx
│   ├── LogRatio.jsx
│   └── Parentheses.jsx
└── styles/
    └── equation-renderer.css
```

---

## Nerdamer Output Examples

| Equation | Solving For | Nerdamer Output |
|----------|-------------|-----------------|
| Boyle's Law | V2 | `P1*V1*P2^(-1)` |
| Boyle's Law | P1 | `P2*V2*V1^(-1)` |
| Ideal Gas | T | `P*V*(R*n)^(-1)` |
| Arrhenius | Ea | `(-T1+T2)^(-1)*R*T1*T2*lnRatio` |
| Arrhenius | T1 | `-(-Ea-R*T2*lnRatio)^(-1)*Ea*T2` |
| Half-Life | k | `0.693147*tHalf^(-1)` |
| Graham's Law | r1 | `(M1^(-1)*M2)^(1/2)*r2` |

---

## Current Progress

**Started**: Phase 1 - Tokenizer
**Last Updated**: [date]
