/**
 * Thermodynamics Calculator Definitions
 */
import {
  ThermInfo1,
  ThermInfo2,
  StateHeat,
  EntropyInfo,
  GibbsInfo
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
  }
];

// General info components for the info tab
export const thermodynamicsInfo = {
  ThermInfo1,
  ThermInfo2,
  EntropyInfo
};

export default thermodynamicsCalculators;
