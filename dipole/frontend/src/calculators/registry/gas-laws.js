/**
 * Gas Law Calculator Definitions
 */
import {
  AvoInfo,
  AmontonInfo,
  BoyleInfo,
  CharlesInfo,
  IdealInfo,
  CombinedInfo,
  GenInfo1,
  GenInfo2,
  GasDensityInfo,
  GrahamInfo,
  DaltonInfo,
  VanDerWaalsInfo
} from '../../components/CalcInfo';

export const gasLawCalculators = [
  {
    id: 'avogadro',
    name: "Avogadro's Law",
    category: 'GSLW',
    // V1/n1 = V2/n2  =>  V1*n2 - V2*n1 = 0
    equation: 'V1*n2 - V2*n1',
    latexEquation: '\\frac{V_1}{n_1} = \\frac{V_2}{n_2}',
    variables: [
      {
        id: 'V1',
        name: 'Initial Volume',
        symbol: 'V_1',
        htmlSymbol: 'V<sub>1</sub>',
        unit: 'L',
        description: 'Volume at initial state'
      },
      {
        id: 'n1',
        name: 'Initial Moles',
        symbol: 'n_1',
        htmlSymbol: 'n<sub>1</sub>',
        unit: 'mol',
        description: 'Amount of gas at initial state'
      },
      {
        id: 'V2',
        name: 'Final Volume',
        symbol: 'V_2',
        htmlSymbol: 'V<sub>2</sub>',
        unit: 'L',
        description: 'Volume at final state'
      },
      {
        id: 'n2',
        name: 'Final Moles',
        symbol: 'n_2',
        htmlSymbol: 'n<sub>2</sub>',
        unit: 'mol',
        description: 'Amount of gas at final state'
      }
    ],
    InfoComponent: AvoInfo
  },

  {
    id: 'amonton',
    name: "Amonton's Law",
    category: 'GSLW',
    // P1/T1 = P2/T2  =>  P1*T2 - P2*T1 = 0
    equation: 'P1*T2 - P2*T1',
    latexEquation: '\\frac{P_1}{T_1} = \\frac{P_2}{T_2}',
    variables: [
      {
        id: 'P1',
        name: 'Initial Pressure',
        symbol: 'P_1',
        htmlSymbol: 'P<sub>1</sub>',
        unit: 'atm',
        description: 'Pressure at initial state'
      },
      {
        id: 'T1',
        name: 'Initial Temperature',
        symbol: 'T_1',
        htmlSymbol: 'T<sub>1</sub>',
        unit: 'K',
        description: 'Temperature at initial state (Kelvin)'
      },
      {
        id: 'P2',
        name: 'Final Pressure',
        symbol: 'P_2',
        htmlSymbol: 'P<sub>2</sub>',
        unit: 'atm',
        description: 'Pressure at final state'
      },
      {
        id: 'T2',
        name: 'Final Temperature',
        symbol: 'T_2',
        htmlSymbol: 'T<sub>2</sub>',
        unit: 'K',
        description: 'Temperature at final state (Kelvin)'
      }
    ],
    InfoComponent: AmontonInfo
  },

  {
    id: 'boyle',
    name: "Boyle's Law",
    category: 'GSLW',
    // P1*V1 = P2*V2  =>  P1*V1 - P2*V2 = 0
    equation: 'P1*V1 - P2*V2',
    latexEquation: 'P_1 V_1 = P_2 V_2',
    variables: [
      {
        id: 'P1',
        name: 'Initial Pressure',
        symbol: 'P_1',
        htmlSymbol: 'P<sub>1</sub>',
        unit: 'atm',
        description: 'Pressure at initial state'
      },
      {
        id: 'V1',
        name: 'Initial Volume',
        symbol: 'V_1',
        htmlSymbol: 'V<sub>1</sub>',
        unit: 'L',
        description: 'Volume at initial state'
      },
      {
        id: 'P2',
        name: 'Final Pressure',
        symbol: 'P_2',
        htmlSymbol: 'P<sub>2</sub>',
        unit: 'atm',
        description: 'Pressure at final state'
      },
      {
        id: 'V2',
        name: 'Final Volume',
        symbol: 'V_2',
        htmlSymbol: 'V<sub>2</sub>',
        unit: 'L',
        description: 'Volume at final state'
      }
    ],
    InfoComponent: BoyleInfo
  },

  {
    id: 'charles',
    name: "Charles' Law",
    category: 'GSLW',
    // V1/T1 = V2/T2  =>  V1*T2 - V2*T1 = 0
    equation: 'V1*T2 - V2*T1',
    latexEquation: '\\frac{V_1}{T_1} = \\frac{V_2}{T_2}',
    variables: [
      {
        id: 'V1',
        name: 'Initial Volume',
        symbol: 'V_1',
        htmlSymbol: 'V<sub>1</sub>',
        unit: 'L',
        description: 'Volume at initial state'
      },
      {
        id: 'T1',
        name: 'Initial Temperature',
        symbol: 'T_1',
        htmlSymbol: 'T<sub>1</sub>',
        unit: 'K',
        description: 'Temperature at initial state (Kelvin)'
      },
      {
        id: 'V2',
        name: 'Final Volume',
        symbol: 'V_2',
        htmlSymbol: 'V<sub>2</sub>',
        unit: 'L',
        description: 'Volume at final state'
      },
      {
        id: 'T2',
        name: 'Final Temperature',
        symbol: 'T_2',
        htmlSymbol: 'T<sub>2</sub>',
        unit: 'K',
        description: 'Temperature at final state (Kelvin)'
      }
    ],
    InfoComponent: CharlesInfo
  },

  {
    id: 'combined',
    name: 'Combined Gas Law',
    category: 'GSLW',
    // P1*V1/T1 = P2*V2/T2  =>  P1*V1*T2 - P2*V2*T1 = 0
    equation: 'P1*V1*T2 - P2*V2*T1',
    latexEquation: '\\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}',
    variables: [
      {
        id: 'P1',
        name: 'Initial Pressure',
        symbol: 'P_1',
        htmlSymbol: 'P<sub>1</sub>',
        unit: 'atm',
        description: 'Pressure at initial state'
      },
      {
        id: 'V1',
        name: 'Initial Volume',
        symbol: 'V_1',
        htmlSymbol: 'V<sub>1</sub>',
        unit: 'L',
        description: 'Volume at initial state'
      },
      {
        id: 'T1',
        name: 'Initial Temperature',
        symbol: 'T_1',
        htmlSymbol: 'T<sub>1</sub>',
        unit: 'K',
        description: 'Temperature at initial state (Kelvin)'
      },
      {
        id: 'P2',
        name: 'Final Pressure',
        symbol: 'P_2',
        htmlSymbol: 'P<sub>2</sub>',
        unit: 'atm',
        description: 'Pressure at final state'
      },
      {
        id: 'V2',
        name: 'Final Volume',
        symbol: 'V_2',
        htmlSymbol: 'V<sub>2</sub>',
        unit: 'L',
        description: 'Volume at final state'
      },
      {
        id: 'T2',
        name: 'Final Temperature',
        symbol: 'T_2',
        htmlSymbol: 'T<sub>2</sub>',
        unit: 'K',
        description: 'Temperature at final state (Kelvin)'
      }
    ],
    InfoComponent: CombinedInfo
  },

  {
    id: 'ideal',
    name: 'Ideal Gas Law',
    category: 'GSLW',
    // PV = nRT  =>  P*V - n*R*T = 0
    equation: 'P*V - n*R*T',
    latexEquation: 'PV = nRT',
    variables: [
      {
        id: 'P',
        name: 'Pressure',
        symbol: 'P',
        htmlSymbol: 'P',
        unit: 'atm',
        description: 'Pressure of the gas'
      },
      {
        id: 'V',
        name: 'Volume',
        symbol: 'V',
        htmlSymbol: 'V',
        unit: 'L',
        description: 'Volume of the gas'
      },
      {
        id: 'n',
        name: 'Amount (moles)',
        symbol: 'n',
        htmlSymbol: 'n',
        unit: 'mol',
        description: 'Amount of gas in moles'
      },
      {
        id: 'R',
        name: 'Gas Constant',
        symbol: 'R',
        htmlSymbol: 'R',
        unit: 'L·atm/(mol·K)',
        defaultValue: 0.0821,
        isConstant: true,
        description: 'Ideal gas constant (0.0821 L·atm/(mol·K))'
      },
      {
        id: 'T',
        name: 'Temperature',
        symbol: 'T',
        htmlSymbol: 'T',
        unit: 'K',
        description: 'Temperature (Kelvin)'
      }
    ],
    InfoComponent: IdealInfo
  },

  {
    id: 'density',
    name: 'Gas Density',
    category: 'GSLW',
    // d = PM/RT  =>  d*R*T - P*M = 0
    equation: 'd*R*T - P*M',
    latexEquation: 'd = \\frac{PM}{RT}',
    variables: [
      {
        id: 'd',
        name: 'Density',
        symbol: 'd',
        htmlSymbol: 'd',
        unit: 'g/L',
        description: 'Density of the gas'
      },
      {
        id: 'P',
        name: 'Pressure',
        symbol: 'P',
        htmlSymbol: 'P',
        unit: 'atm',
        description: 'Pressure of the gas'
      },
      {
        id: 'M',
        name: 'Molar Mass',
        symbol: 'M',
        htmlSymbol: 'M',
        unit: 'g/mol',
        description: 'Molar mass of the gas'
      },
      {
        id: 'R',
        name: 'Gas Constant',
        symbol: 'R',
        htmlSymbol: 'R',
        unit: 'L·atm/(mol·K)',
        defaultValue: 0.0821,
        isConstant: true,
        description: 'Ideal gas constant (0.0821 L·atm/(mol·K))'
      },
      {
        id: 'T',
        name: 'Temperature',
        symbol: 'T',
        htmlSymbol: 'T',
        unit: 'K',
        description: 'Temperature (Kelvin)'
      }
    ],
    InfoComponent: GasDensityInfo
  },

  {
    id: 'graham',
    name: "Graham's Law",
    category: 'GSLW',
    // r1/r2 = sqrt(M2/M1)  =>  r1^2 * M1 - r2^2 * M2 = 0
    // Squaring both sides to avoid sqrt in nerdamer solve
    equation: 'r1*r1*M1 - r2*r2*M2',
    latexEquation: '\\frac{r_1}{r_2} = \\sqrt{\\frac{M_2}{M_1}}',
    variables: [
      {
        id: 'r1',
        name: 'Rate of Gas 1',
        symbol: 'r_1',
        htmlSymbol: 'r<sub>1</sub>',
        unit: 'mol/s',
        description: 'Effusion rate of gas 1'
      },
      {
        id: 'r2',
        name: 'Rate of Gas 2',
        symbol: 'r_2',
        htmlSymbol: 'r<sub>2</sub>',
        unit: 'mol/s',
        description: 'Effusion rate of gas 2'
      },
      {
        id: 'M1',
        name: 'Molar Mass of Gas 1',
        symbol: 'M_1',
        htmlSymbol: 'M<sub>1</sub>',
        unit: 'g/mol',
        description: 'Molar mass of gas 1'
      },
      {
        id: 'M2',
        name: 'Molar Mass of Gas 2',
        symbol: 'M_2',
        htmlSymbol: 'M<sub>2</sub>',
        unit: 'g/mol',
        description: 'Molar mass of gas 2'
      }
    ],
    InfoComponent: GrahamInfo
  },

  {
    id: 'dalton',
    name: "Dalton's Law",
    category: 'GSLW',
    // Ptotal = P1 + P2
    equation: 'Ptotal - P1 - P2',
    latexEquation: 'P_{total} = P_1 + P_2',
    variables: [
      {
        id: 'Ptotal',
        name: 'Total Pressure',
        symbol: 'P_{total}',
        htmlSymbol: 'P<sub>total</sub>',
        unit: 'atm',
        description: 'Total pressure of the gas mixture'
      },
      {
        id: 'P1',
        name: 'Partial Pressure 1',
        symbol: 'P_1',
        htmlSymbol: 'P<sub>1</sub>',
        unit: 'atm',
        description: 'Partial pressure of gas 1'
      },
      {
        id: 'P2',
        name: 'Partial Pressure 2',
        symbol: 'P_2',
        htmlSymbol: 'P<sub>2</sub>',
        unit: 'atm',
        description: 'Partial pressure of gas 2'
      }
    ],
    InfoComponent: DaltonInfo
  },

  {
    id: 'vanDerWaals',
    name: 'Van der Waals Equation',
    category: 'GSLW',
    // (P + a(n/V)^2)(V - nb) = nRT
    // Expanded: P*V - P*n*b + a*n^2/V - a*n^3*b/V^2 = nRT
    // Rearranged to polynomial form for solving
    equation: '(P + a*(n/V)^2)*(V - n*b) - n*R*T',
    latexEquation: '\\left(P + \\frac{an^2}{V^2}\\right)(V - nb) = nRT',
    variables: [
      {
        id: 'P',
        name: 'Pressure',
        symbol: 'P',
        htmlSymbol: 'P',
        unit: 'atm',
        description: 'Pressure of the gas'
      },
      {
        id: 'V',
        name: 'Volume',
        symbol: 'V',
        htmlSymbol: 'V',
        unit: 'L',
        description: 'Volume of the gas'
      },
      {
        id: 'n',
        name: 'Amount (moles)',
        symbol: 'n',
        htmlSymbol: 'n',
        unit: 'mol',
        description: 'Amount of gas in moles'
      },
      {
        id: 'R',
        name: 'Gas Constant',
        symbol: 'R',
        htmlSymbol: 'R',
        unit: 'L·atm/(mol·K)',
        defaultValue: 0.0821,
        isConstant: true,
        description: 'Ideal gas constant (0.0821 L·atm/(mol·K))'
      },
      {
        id: 'T',
        name: 'Temperature',
        symbol: 'T',
        htmlSymbol: 'T',
        unit: 'K',
        description: 'Temperature (Kelvin)'
      },
      {
        id: 'a',
        name: 'Attraction Constant',
        symbol: 'a',
        htmlSymbol: 'a',
        unit: 'L²·atm/mol²',
        description: 'Van der Waals constant for intermolecular attraction'
      },
      {
        id: 'b',
        name: 'Volume Constant',
        symbol: 'b',
        htmlSymbol: 'b',
        unit: 'L/mol',
        description: 'Van der Waals constant for molecular volume'
      }
    ],
    InfoComponent: VanDerWaalsInfo
  }
];

// General info components for the info tab
export const gasLawsInfo = {
  GenInfo1,
  GenInfo2
};

export default gasLawCalculators;
