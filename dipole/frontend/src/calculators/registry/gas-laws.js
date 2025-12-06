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
  GenInfo2
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
  }
];

// General info components for the info tab
export const gasLawsInfo = {
  GenInfo1,
  GenInfo2
};

export default gasLawCalculators;
