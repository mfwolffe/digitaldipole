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
  MolarHeatCapacityInfo
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
        description: 'Heat transferred'
      },
      {
        id: 'm',
        name: 'Mass',
        symbol: 'm',
        htmlSymbol: 'm',
        unit: 'g',
        description: 'Mass of the substance'
      },
      {
        id: 'Csp',
        name: 'Specific Heat Capacity',
        symbol: 'C_{sp}',
        htmlSymbol: 'C<sub>sp</sub>',
        unit: 'J/(g·°C)',
        description: 'Specific heat capacity of the substance'
      },
      {
        id: 'deltaT',
        name: 'Temperature Change',
        symbol: '\\Delta T',
        htmlSymbol: 'ΔT',
        unit: '°C',
        description: 'Change in temperature'
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
        description: 'Change in Gibbs free energy'
      },
      {
        id: 'deltaH',
        name: 'Enthalpy Change',
        symbol: '\\Delta H',
        htmlSymbol: 'ΔH',
        unit: 'kJ/mol',
        description: 'Change in enthalpy'
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
        id: 'deltaS',
        name: 'Entropy Change',
        symbol: '\\Delta S',
        htmlSymbol: 'ΔS',
        unit: 'kJ/(mol·K)',
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
        description: 'Enthalpy of the system'
      },
      {
        id: 'U',
        name: 'Internal Energy',
        symbol: 'U',
        htmlSymbol: 'U',
        unit: 'J',
        description: 'Internal energy of the system'
      },
      {
        id: 'P',
        name: 'Pressure',
        symbol: 'P',
        htmlSymbol: 'P',
        unit: 'Pa',
        description: 'Pressure of the system'
      },
      {
        id: 'V',
        name: 'Volume',
        symbol: 'V',
        htmlSymbol: 'V',
        unit: 'm³',
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
        description: 'Change in entropy'
      },
      {
        id: 'qrev',
        name: 'Reversible Heat',
        symbol: 'q_{rev}',
        htmlSymbol: 'q<sub>rev</sub>',
        unit: 'J',
        description: 'Heat transferred reversibly'
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
        description: 'Work done by/on the system'
      },
      {
        id: 'P',
        name: 'Pressure',
        symbol: 'P',
        htmlSymbol: 'P',
        unit: 'Pa',
        description: 'Pressure of the system'
      },
      {
        id: 'deltaV',
        name: 'Volume Change',
        symbol: '\\Delta V',
        htmlSymbol: 'ΔV',
        unit: 'm³',
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
        description: 'Change in internal energy'
      },
      {
        id: 'q',
        name: 'Heat',
        symbol: 'q',
        htmlSymbol: 'q',
        unit: 'J',
        description: 'Heat transferred to the system'
      },
      {
        id: 'w',
        name: 'Work',
        symbol: 'w',
        htmlSymbol: 'w',
        unit: 'J',
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
        description: 'Heat transferred'
      },
      {
        id: 'n',
        name: 'Moles',
        symbol: 'n',
        htmlSymbol: 'n',
        unit: 'mol',
        description: 'Amount of substance in moles'
      },
      {
        id: 'Cp',
        name: 'Molar Heat Capacity',
        symbol: 'C_p',
        htmlSymbol: 'C<sub>p</sub>',
        unit: 'J/(mol·K)',
        description: 'Molar heat capacity at constant pressure'
      },
      {
        id: 'deltaT',
        name: 'Temperature Change',
        symbol: '\\Delta T',
        htmlSymbol: 'ΔT',
        unit: 'K',
        description: 'Change in temperature'
      }
    ],
    InfoComponent: MolarHeatCapacityInfo
  }
];

// General info components for the info tab
export const thermodynamicsInfo = {
  ThermInfo1,
  ThermInfo2,
  EntropyInfo
};

export default thermodynamicsCalculators;
