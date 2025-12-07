/**
 * Thermodynamics Calculator Definitions
 */
import {
  ThermInfo1,
  ThermInfo2,
  StateHeat,
  EntropyInfo,
  GibbsInfo,
  EntropyChangeInfo,
  WorkPVInfo,
  FirstLawInfo,
  MolarHeatCapacityInfo,
  ClausiusClapeyronInfo,
  IsothermalWorkInfo
} from '../../components/CalcInfo';

export const thermodynamicsCalculators = [
  {
    id: 'heat',
    name: 'Heat Transfer',
    category: 'THRM',
    // q = m * Csp * deltaT
    equation: 'q - m*Csp*deltaT',
    latexEquation: 'q = m C_{sp} \\Delta T',
    variables: [
      {
        id: 'q',
        name: 'Heat',
        symbol: 'q',
        htmlSymbol: 'q',
        unit: 'J',
        dimension: 'energy',
        defaultUnit: 'J',
        description: 'Heat transferred'
      },
      {
        id: 'm',
        name: 'Mass',
        symbol: 'm',
        htmlSymbol: 'm',
        unit: 'g',
        dimension: 'mass',
        defaultUnit: 'g',
        description: 'Mass of the substance'
      },
      {
        id: 'Csp',
        name: 'Specific Heat Capacity',
        symbol: 'C_{sp}',
        htmlSymbol: 'C<sub>sp</sub>',
        unit: 'J/(g·°C)',
        dimension: 'heat_capacity',
        defaultUnit: 'J_per_g_C',
        description: 'Specific heat capacity of the substance'
      },
      {
        id: 'deltaT',
        name: 'Temperature Change',
        symbol: '\\Delta T',
        htmlSymbol: 'ΔT',
        unit: '°C',
        description: 'Change in temperature (use same scale for both)'
      }
    ],
    InfoComponent: StateHeat
  },

  {
    id: 'gibbs',
    name: 'Gibbs Free Energy',
    category: 'THRM',
    // ΔG = ΔH - TΔS
    equation: 'deltaG - deltaH + T*deltaS',
    latexEquation: '\\Delta G = \\Delta H - T \\Delta S',
    variables: [
      {
        id: 'deltaG',
        name: 'Gibbs Free Energy Change',
        symbol: '\\Delta G',
        htmlSymbol: 'ΔG',
        unit: 'kJ/mol',
        dimension: 'energy',
        defaultUnit: 'kJ',
        description: 'Change in Gibbs free energy'
      },
      {
        id: 'deltaH',
        name: 'Enthalpy Change',
        symbol: '\\Delta H',
        htmlSymbol: 'ΔH',
        unit: 'kJ/mol',
        dimension: 'energy',
        defaultUnit: 'kJ',
        description: 'Change in enthalpy'
      },
      {
        id: 'T',
        name: 'Temperature',
        symbol: 'T',
        htmlSymbol: 'T',
        unit: 'K',
        dimension: 'temperature',
        defaultUnit: 'K',
        description: 'Temperature (Kelvin)'
      },
      {
        id: 'deltaS',
        name: 'Entropy Change',
        symbol: '\\Delta S',
        htmlSymbol: 'ΔS',
        unit: 'kJ/(mol·K)',
        dimension: 'molar_entropy',
        defaultUnit: 'kJ_per_mol_K_entropy',
        description: 'Change in entropy'
      }
    ],
    InfoComponent: GibbsInfo
  },

  {
    id: 'enthalpy',
    name: 'Enthalpy',
    category: 'THRM',
    // H = U + PV
    equation: 'H - U - P*V',
    latexEquation: 'H = U + PV',
    variables: [
      {
        id: 'H',
        name: 'Enthalpy',
        symbol: 'H',
        htmlSymbol: 'H',
        unit: 'J',
        dimension: 'energy',
        defaultUnit: 'J',
        description: 'Enthalpy of the system'
      },
      {
        id: 'U',
        name: 'Internal Energy',
        symbol: 'U',
        htmlSymbol: 'U',
        unit: 'J',
        dimension: 'energy',
        defaultUnit: 'J',
        description: 'Internal energy of the system'
      },
      {
        id: 'P',
        name: 'Pressure',
        symbol: 'P',
        htmlSymbol: 'P',
        unit: 'Pa',
        dimension: 'pressure',
        defaultUnit: 'Pa',
        description: 'Pressure of the system'
      },
      {
        id: 'V',
        name: 'Volume',
        symbol: 'V',
        htmlSymbol: 'V',
        unit: 'm³',
        dimension: 'volume',
        defaultUnit: 'm³',
        description: 'Volume of the system'
      }
    ],
    InfoComponent: StateHeat
  },

  {
    id: 'entropyChange',
    name: 'Entropy Change',
    category: 'THRM',
    // ΔS = q_rev / T
    equation: 'deltaS - qrev/T',
    latexEquation: '\\Delta S = \\frac{q_{rev}}{T}',
    variables: [
      {
        id: 'deltaS',
        name: 'Entropy Change',
        symbol: '\\Delta S',
        htmlSymbol: 'ΔS',
        unit: 'J/K',
        dimension: 'entropy',
        defaultUnit: 'J_per_K',
        description: 'Change in entropy'
      },
      {
        id: 'qrev',
        name: 'Reversible Heat',
        symbol: 'q_{rev}',
        htmlSymbol: 'q<sub>rev</sub>',
        unit: 'J',
        dimension: 'energy',
        defaultUnit: 'J',
        description: 'Heat transferred reversibly'
      },
      {
        id: 'T',
        name: 'Temperature',
        symbol: 'T',
        htmlSymbol: 'T',
        unit: 'K',
        dimension: 'temperature',
        defaultUnit: 'K',
        description: 'Temperature (Kelvin)'
      }
    ],
    InfoComponent: EntropyChangeInfo
  },

  {
    id: 'work',
    name: 'Work (PV)',
    category: 'THRM',
    // w = -PΔV
    equation: 'w + P*deltaV',
    latexEquation: 'w = -P \\Delta V',
    variables: [
      {
        id: 'w',
        name: 'Work',
        symbol: 'w',
        htmlSymbol: 'w',
        unit: 'J',
        dimension: 'energy',
        defaultUnit: 'J',
        description: 'Work done by/on the system'
      },
      {
        id: 'P',
        name: 'Pressure',
        symbol: 'P',
        htmlSymbol: 'P',
        unit: 'Pa',
        dimension: 'pressure',
        defaultUnit: 'Pa',
        description: 'Pressure of the system'
      },
      {
        id: 'deltaV',
        name: 'Volume Change',
        symbol: '\\Delta V',
        htmlSymbol: 'ΔV',
        unit: 'm³',
        dimension: 'volume',
        defaultUnit: 'm³',
        description: 'Change in volume'
      }
    ],
    InfoComponent: WorkPVInfo
  },

  {
    id: 'firstLaw',
    name: 'First Law of Thermodynamics',
    category: 'THRM',
    // ΔU = q + w
    equation: 'deltaU - q - w',
    latexEquation: '\\Delta U = q + w',
    variables: [
      {
        id: 'deltaU',
        name: 'Internal Energy Change',
        symbol: '\\Delta U',
        htmlSymbol: 'ΔU',
        unit: 'J',
        dimension: 'energy',
        defaultUnit: 'J',
        description: 'Change in internal energy'
      },
      {
        id: 'q',
        name: 'Heat',
        symbol: 'q',
        htmlSymbol: 'q',
        unit: 'J',
        dimension: 'energy',
        defaultUnit: 'J',
        description: 'Heat transferred to the system'
      },
      {
        id: 'w',
        name: 'Work',
        symbol: 'w',
        htmlSymbol: 'w',
        unit: 'J',
        dimension: 'energy',
        defaultUnit: 'J',
        description: 'Work done on the system'
      }
    ],
    InfoComponent: FirstLawInfo
  },

  {
    id: 'molarHeat',
    name: 'Molar Heat Capacity',
    category: 'THRM',
    // q = nCpΔT
    equation: 'q - n*Cp*deltaT',
    latexEquation: 'q = n C_p \\Delta T',
    variables: [
      {
        id: 'q',
        name: 'Heat',
        symbol: 'q',
        htmlSymbol: 'q',
        unit: 'J',
        dimension: 'energy',
        defaultUnit: 'J',
        description: 'Heat transferred'
      },
      {
        id: 'n',
        name: 'Moles',
        symbol: 'n',
        htmlSymbol: 'n',
        unit: 'mol',
        dimension: 'amount',
        defaultUnit: 'mol',
        description: 'Amount of substance in moles'
      },
      {
        id: 'Cp',
        name: 'Molar Heat Capacity',
        symbol: 'C_p',
        htmlSymbol: 'C<sub>p</sub>',
        unit: 'J/(mol·K)',
        dimension: 'molar_heat_capacity',
        defaultUnit: 'J_per_mol_K',
        description: 'Molar heat capacity at constant pressure'
      },
      {
        id: 'deltaT',
        name: 'Temperature Change',
        symbol: '\\Delta T',
        htmlSymbol: 'ΔT',
        unit: 'K',
        dimension: 'temperature',
        defaultUnit: 'K',
        description: 'Change in temperature'
      }
    ],
    InfoComponent: MolarHeatCapacityInfo
  },

  {
    id: 'clausiusClapeyron',
    name: 'Clausius-Clapeyron',
    category: 'THRM',
    // ln(P2/P1) = -ΔHvap/R × (1/T2 - 1/T1)
    // Using substitution: lnRatio + deltaHvap/R * (1/T2 - 1/T1) = 0
    equation: 'lnRatio + deltaHvap/R*(1/T2 - 1/T1)',
    latexEquation: '\\ln\\left(\\frac{P_2}{P_1}\\right) = -\\frac{\\Delta H_{vap}}{R}\\left(\\frac{1}{T_2} - \\frac{1}{T_1}\\right)',
    logarithmic: {
      numerator: 'P2',
      denominator: 'P1'
    },
    variables: [
      {
        id: 'P2',
        name: 'Final Pressure',
        symbol: 'P_2',
        htmlSymbol: 'P<sub>2</sub>',
        unit: 'atm',
        dimension: 'pressure',
        defaultUnit: 'atm',
        description: 'Vapor pressure at temperature T₂'
      },
      {
        id: 'P1',
        name: 'Initial Pressure',
        symbol: 'P_1',
        htmlSymbol: 'P<sub>1</sub>',
        unit: 'atm',
        dimension: 'pressure',
        defaultUnit: 'atm',
        description: 'Vapor pressure at temperature T₁'
      },
      {
        id: 'deltaHvap',
        name: 'Enthalpy of Vaporization',
        symbol: '\\Delta H_{vap}',
        htmlSymbol: 'ΔH<sub>vap</sub>',
        unit: 'J/mol',
        dimension: 'energy',
        defaultUnit: 'J',
        description: 'Enthalpy of vaporization'
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
        dimension: 'temperature',
        defaultUnit: 'K',
        description: 'Initial temperature (Kelvin)'
      },
      {
        id: 'T2',
        name: 'Final Temperature',
        symbol: 'T_2',
        htmlSymbol: 'T<sub>2</sub>',
        unit: 'K',
        dimension: 'temperature',
        defaultUnit: 'K',
        description: 'Final temperature (Kelvin)'
      }
    ],
    InfoComponent: ClausiusClapeyronInfo
  },

  {
    id: 'isothermalWork',
    name: 'Isothermal Work',
    category: 'THRM',
    // w = -nRT*ln(V2/V1)
    // Using substitution: w + n*R*T*lnRatio = 0
    equation: 'w + n*R*T*lnRatio',
    latexEquation: 'w = -nRT\\ln\\left(\\frac{V_2}{V_1}\\right)',
    logarithmic: {
      numerator: 'V2',
      denominator: 'V1'
    },
    variables: [
      {
        id: 'w',
        name: 'Work',
        symbol: 'w',
        htmlSymbol: 'w',
        unit: 'J',
        dimension: 'energy',
        defaultUnit: 'J',
        description: 'Work done (negative for expansion)'
      },
      {
        id: 'n',
        name: 'Moles',
        symbol: 'n',
        htmlSymbol: 'n',
        unit: 'mol',
        dimension: 'amount',
        defaultUnit: 'mol',
        description: 'Amount of gas in moles'
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
        id: 'T',
        name: 'Temperature',
        symbol: 'T',
        htmlSymbol: 'T',
        unit: 'K',
        dimension: 'temperature',
        defaultUnit: 'K',
        description: 'Temperature (Kelvin)'
      },
      {
        id: 'V2',
        name: 'Final Volume',
        symbol: 'V_2',
        htmlSymbol: 'V<sub>2</sub>',
        unit: 'L',
        dimension: 'volume',
        defaultUnit: 'L',
        description: 'Final volume'
      },
      {
        id: 'V1',
        name: 'Initial Volume',
        symbol: 'V_1',
        htmlSymbol: 'V<sub>1</sub>',
        unit: 'L',
        dimension: 'volume',
        defaultUnit: 'L',
        description: 'Initial volume'
      }
    ],
    InfoComponent: IsothermalWorkInfo
  }
];

// General info components for the info tab
export const thermodynamicsInfo = {
  ThermInfo1,
  ThermInfo2,
  EntropyInfo
};

export default thermodynamicsCalculators;
