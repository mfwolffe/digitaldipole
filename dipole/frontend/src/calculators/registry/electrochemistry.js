/**
 * Electrochemistry Calculator Definitions
 */
import {
  FaradayInfo,
  NernstInfo
} from '../../components/CalcInfo';

export const electrochemistryCalculators = [
  {
    id: 'faraday',
    name: "Faraday's Law",
    category: 'ELEC',
    // m = (M·I·t)/(n·F)
    equation: 'm - M*I*t/(n*F)',
    latexEquation: 'm = \\frac{M \\cdot I \\cdot t}{n \\cdot F}',
    variables: [
      {
        id: 'm',
        name: 'Mass Deposited',
        symbol: 'm',
        htmlSymbol: 'm',
        unit: 'g',
        description: 'Mass of substance deposited or dissolved'
      },
      {
        id: 'M',
        name: 'Molar Mass',
        symbol: 'M',
        htmlSymbol: 'M',
        unit: 'g/mol',
        description: 'Molar mass of the substance'
      },
      {
        id: 'I',
        name: 'Current',
        symbol: 'I',
        htmlSymbol: 'I',
        unit: 'A',
        description: 'Electric current in amperes'
      },
      {
        id: 't',
        name: 'Time',
        symbol: 't',
        htmlSymbol: 't',
        unit: 's',
        description: 'Time in seconds'
      },
      {
        id: 'n',
        name: 'Electrons Transferred',
        symbol: 'n',
        htmlSymbol: 'n',
        unit: '',
        description: 'Number of moles of electrons per mole of substance'
      },
      {
        id: 'F',
        name: "Faraday's Constant",
        symbol: 'F',
        htmlSymbol: 'F',
        unit: 'C/mol',
        defaultValue: 96485,
        isConstant: true,
        description: "Faraday's constant (96485 C/mol)"
      }
    ],
    InfoComponent: FaradayInfo
  },

  {
    id: 'nernst',
    name: 'Nernst Equation',
    category: 'ELEC',
    // E = E° - (RT/nF)·ln(Q)
    // Using substitution: E - E0 + (R*T)/(n*F)*lnRatio = 0
    // where lnRatio = ln(Q) and we treat Q as numerator with denominator = 1
    equation: 'E - E0 + R*T/(nElec*F)*lnRatio',
    latexEquation: 'E = E^\\circ - \\frac{RT}{nF}\\ln Q',
    logarithmic: {
      numerator: 'Q',
      denominator: 'Qref'  // Reference Q = 1
    },
    variables: [
      {
        id: 'E',
        name: 'Cell Potential',
        symbol: 'E',
        htmlSymbol: 'E',
        unit: 'V',
        description: 'Cell potential under non-standard conditions'
      },
      {
        id: 'E0',
        name: 'Standard Cell Potential',
        symbol: 'E^\\circ',
        htmlSymbol: 'E°',
        unit: 'V',
        description: 'Standard cell potential'
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
        description: 'Temperature (Kelvin)'
      },
      {
        id: 'nElec',
        name: 'Electrons Transferred',
        symbol: 'n',
        htmlSymbol: 'n',
        unit: '',
        description: 'Number of moles of electrons transferred'
      },
      {
        id: 'F',
        name: "Faraday's Constant",
        symbol: 'F',
        htmlSymbol: 'F',
        unit: 'C/mol',
        defaultValue: 96485,
        isConstant: true,
        description: "Faraday's constant (96485 C/mol)"
      },
      {
        id: 'Q',
        name: 'Reaction Quotient',
        symbol: 'Q',
        htmlSymbol: 'Q',
        unit: '',
        description: 'Reaction quotient ([products]/[reactants])'
      },
      {
        id: 'Qref',
        name: 'Reference Q',
        symbol: 'Q_{ref}',
        htmlSymbol: 'Q<sub>ref</sub>',
        unit: '',
        defaultValue: 1,
        isConstant: true,
        description: 'Reference reaction quotient (1 for standard state)'
      }
    ],
    InfoComponent: NernstInfo
  }
];

// General info for electrochemistry page
export const electrochemistryInfo = {
  FaradayInfo,
  NernstInfo
};

export default electrochemistryCalculators;
