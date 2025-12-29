# Calculator Roadmap

Tracking calculators across all pages.

---

## Gas Laws Page

### Implemented
- [x] Avogadro's Law
- [x] Amonton's Law (Gay-Lussac's)
- [x] Boyle's Law
- [x] Charles' Law
- [x] Combined Gas Law
- [x] Ideal Gas Law
- [x] Gas Density - `d = PM/RT`
- [x] Graham's Law of Effusion - `r₁/r₂ = √(M₂/M₁)`
- [x] Dalton's Law of Partial Pressures - `P_total = P₁ + P₂`
- [x] Van der Waals Equation - `(P + a(n/V)²)(V - nb) = nRT`

---

## Thermodynamics Page

### Implemented
- [x] Heat Transfer - `q = mcΔT`
- [x] Gibbs Free Energy - `ΔG = ΔH - TΔS`
- [x] Enthalpy - `H = U + PV`
- [x] Entropy Change - `ΔS = q_rev / T`
- [x] Work (PV) - `w = -PΔV`
- [x] First Law of Thermodynamics - `ΔU = q + w`
- [x] Molar Heat Capacity - `q = nCₚΔT`
- [x] Clausius-Clapeyron - `ln(P₂/P₁) = -ΔH_vap/R × (1/T₂ - 1/T₁)` *(logarithmic)*
- [x] Isothermal Work - `w = -nRT·ln(V₂/V₁)` *(logarithmic)*

---

## Kinetics Page

### Implemented
- [x] Arrhenius Equation (Two-Point) - `ln(k₂/k₁) = -Ea/R × (1/T₂ - 1/T₁)` *(logarithmic)*
- [x] Half-Life (First Order) - `t₁/₂ = ln(2)/k`
- [x] Second Order Rate Law - `1/[A] = 1/[A]₀ + kt`
- [x] First Order Rate Law - `ln[A] = ln[A]₀ - kt` *(logarithmic)*

---

## Solutions Page

### Implemented
- [x] Molarity - `M = n/V`
- [x] Dilution - `M₁V₁ = M₂V₂`
- [x] Osmotic Pressure - `Π = MRT`
- [x] Raoult's Law - `P = χ·P°`
- [x] Boiling Point Elevation - `ΔTb = Kb·m·i`
- [x] Freezing Point Depression - `ΔTf = Kf·m·i`

---

## Electrochemistry Page

### Implemented
- [x] Faraday's Law - `m = (M·I·t)/(n·F)`
- [x] Nernst Equation - `E = E° - (RT/nF)·ln(Q)` *(logarithmic)*

---

## Nerdamer Compatibility Notes

### Works Cleanly
- Simple products: `a*b*c`
- Simple fractions: `a/b`, `(a*b)/(c*d)`
- Quadratic equations (returns multiple solutions)
- Square roots (via squaring: `r1^2*M1 - r2^2*M2`)

### Needs Logarithmic Solver
Equations with `ln(ratio)` use the `solveLogarithmic()` function:
1. Define equation with `lnRatio` as intermediate variable
2. Add `logarithmic: { numerator: 'var1', denominator: 'var2' }` to calculator config
3. Solver handles the substitution and exponentiation automatically

### Complex Expressions
- Cubic equations: Nerdamer solves but returns verbose expressions
- May need numerical evaluation for practical use

---

## Calculator Count Summary

| Page | Implemented |
|------|-------------|
| Gas Laws | 10 |
| Thermodynamics | 9 |
| Kinetics | 4 |
| Solutions | 6 |
| Electrochemistry | 2 |
| **Total** | **31** |
