/**
 * Kinetics Calculator Definitions
 */
import {
  ArrheniusInfo,
  HalfLifeInfo,
  SecondOrderInfo,
  FirstOrderInfo
} from '../../components/CalcInfo';

export const kineticsCalculators = [
  {
    id: 'arrhenius',
    name: 'Arrhenius Equation (Two-Point)',
    category: 'KNTC',
    // ln(k2/k1) = -Ea/R × (1/T2 - 1/T1)
    // Using substitution: lnRatio + Ea/R * (1/T2 - 1/T1) = 0
    equation: 'lnRatio + Ea/R*(1/T2 - 1/T1)',
    latexEquation: '\\ln\\left(\\frac{k_2}{k_1}\\right) = -\\frac{E_a}{R}\\left(\\frac{1}{T_2} - \\frac{1}{T_1}\\right)',
    logarithmic: {
      numerator: 'k2',
      denominator: 'k1'
    },
    variables: [
      {
        id: 'k2',
        name: 'Rate Constant at T₂',
        symbol: 'k_2',
        htmlSymbol: 'k<sub>2</sub>',
        unit: 's⁻¹',
        description: 'Rate constant at temperature T₂'
      },
      {
        id: 'k1',
        name: 'Rate Constant at T₁',
        symbol: 'k_1',
        htmlSymbol: 'k<sub>1</sub>',
        unit: 's⁻¹',
        description: 'Rate constant at temperature T₁'
      },
      {
        id: 'Ea',
        name: 'Activation Energy',
        symbol: 'E_a',
        htmlSymbol: 'E<sub>a</sub>',
        unit: 'J/mol',
        description: 'Activation energy'
      },
      {
        id: 'R',
        name: 'Gas Constant',
        symbol: 'R',
        htmlSymbol: 'R',
        unit: 'J/(mol·K)',
        defaultValue: 8.314,
        isConstant: true,
        description: 'Ideal gas constant (8.314 J/(mol·K))'
      },
      {
        id: 'T1',
        name: 'Initial Temperature',
        symbol: 'T_1',
        htmlSymbol: 'T<sub>1</sub>',
        unit: 'K',
        description: 'Initial temperature (Kelvin)'
      },
      {
        id: 'T2',
        name: 'Final Temperature',
        symbol: 'T_2',
        htmlSymbol: 'T<sub>2</sub>',
        unit: 'K',
        description: 'Final temperature (Kelvin)'
      }
    ],
    InfoComponent: ArrheniusInfo
  },

  {
    id: 'halfLife',
    name: 'Half-Life (First Order)',
    category: 'KNTC',
    // t½ = ln(2)/k
    equation: 'tHalf - 0.693147/k',
    latexEquation: 't_{1/2} = \\frac{\\ln(2)}{k}',
    variables: [
      {
        id: 'tHalf',
        name: 'Half-Life',
        symbol: 't_{1/2}',
        htmlSymbol: 't<sub>½</sub>',
        unit: 's',
        description: 'Half-life of the reaction'
      },
      {
        id: 'k',
        name: 'Rate Constant',
        symbol: 'k',
        htmlSymbol: 'k',
        unit: 's⁻¹',
        description: 'First-order rate constant'
      }
    ],
    InfoComponent: HalfLifeInfo
  },

  {
    id: 'secondOrder',
    name: 'Second Order Rate Law',
    category: 'KNTC',
    // 1/[A] = 1/[A]₀ + kt
    // => 1/A - 1/A0 - k*t = 0
    equation: '1/A - 1/A0 - k*t',
    latexEquation: '\\frac{1}{[A]} = \\frac{1}{[A]_0} + kt',
    variables: [
      {
        id: 'A',
        name: 'Final Concentration',
        symbol: '[A]',
        htmlSymbol: '[A]',
        unit: 'M',
        description: 'Concentration at time t'
      },
      {
        id: 'A0',
        name: 'Initial Concentration',
        symbol: '[A]_0',
        htmlSymbol: '[A]<sub>0</sub>',
        unit: 'M',
        description: 'Initial concentration'
      },
      {
        id: 'k',
        name: 'Rate Constant',
        symbol: 'k',
        htmlSymbol: 'k',
        unit: 'M⁻¹s⁻¹',
        description: 'Second-order rate constant'
      },
      {
        id: 't',
        name: 'Time',
        symbol: 't',
        htmlSymbol: 't',
        unit: 's',
        description: 'Elapsed time'
      }
    ],
    InfoComponent: SecondOrderInfo
  },

  {
    id: 'firstOrder',
    name: 'First Order Rate Law',
    category: 'KNTC',
    // ln[A] = ln[A]₀ - kt
    // Rearranged: lnRatio + k*t = 0, where lnRatio = ln(A/A0)
    equation: 'lnRatio + k*t',
    latexEquation: '\\ln[A] = \\ln[A]_0 - kt',
    logarithmic: {
      numerator: 'A',
      denominator: 'A0'
    },
    variables: [
      {
        id: 'A',
        name: 'Final Concentration',
        symbol: '[A]',
        htmlSymbol: '[A]',
        unit: 'M',
        description: 'Concentration at time t'
      },
      {
        id: 'A0',
        name: 'Initial Concentration',
        symbol: '[A]_0',
        htmlSymbol: '[A]<sub>0</sub>',
        unit: 'M',
        description: 'Initial concentration'
      },
      {
        id: 'k',
        name: 'Rate Constant',
        symbol: 'k',
        htmlSymbol: 'k',
        unit: 's⁻¹',
        description: 'First-order rate constant'
      },
      {
        id: 't',
        name: 'Time',
        symbol: 't',
        htmlSymbol: 't',
        unit: 's',
        description: 'Elapsed time'
      }
    ],
    InfoComponent: FirstOrderInfo
  }
];

// General info for kinetics page
export const kineticsInfo = {
  ArrheniusInfo
};

export default kineticsCalculators;
