/**
 * Solutions Calculator Definitions
 */
import {
  MolarityInfo,
  DilutionInfo,
  OsmoticPressureInfo,
  RaoultInfo,
  BoilingPointElevationInfo,
  FreezingPointDepressionInfo
} from '../../components/CalcInfo';

export const solutionsCalculators = [
  {
    id: 'molarity',
    name: 'Molarity',
    category: 'SOLN',
    // M = n/V
    equation: 'M - n/V',
    latexEquation: 'M = \\frac{n}{V}',
    variables: [
      {
        id: 'M',
        name: 'Molarity',
        symbol: 'M',
        htmlSymbol: 'M',
        unit: 'mol/L',
        description: 'Concentration in moles per liter'
      },
      {
        id: 'n',
        name: 'Moles of Solute',
        symbol: 'n',
        htmlSymbol: 'n',
        unit: 'mol',
        description: 'Amount of solute in moles'
      },
      {
        id: 'V',
        name: 'Volume of Solution',
        symbol: 'V',
        htmlSymbol: 'V',
        unit: 'L',
        description: 'Total volume of solution'
      }
    ],
    InfoComponent: MolarityInfo
  },

  {
    id: 'dilution',
    name: 'Dilution',
    category: 'SOLN',
    // M1*V1 = M2*V2
    equation: 'M1*V1 - M2*V2',
    latexEquation: 'M_1 V_1 = M_2 V_2',
    variables: [
      {
        id: 'M1',
        name: 'Initial Molarity',
        symbol: 'M_1',
        htmlSymbol: 'M<sub>1</sub>',
        unit: 'mol/L',
        description: 'Concentration of stock solution'
      },
      {
        id: 'V1',
        name: 'Initial Volume',
        symbol: 'V_1',
        htmlSymbol: 'V<sub>1</sub>',
        unit: 'L',
        description: 'Volume of stock solution used'
      },
      {
        id: 'M2',
        name: 'Final Molarity',
        symbol: 'M_2',
        htmlSymbol: 'M<sub>2</sub>',
        unit: 'mol/L',
        description: 'Concentration of diluted solution'
      },
      {
        id: 'V2',
        name: 'Final Volume',
        symbol: 'V_2',
        htmlSymbol: 'V<sub>2</sub>',
        unit: 'L',
        description: 'Total volume after dilution'
      }
    ],
    InfoComponent: DilutionInfo
  },

  {
    id: 'osmoticPressure',
    name: 'Osmotic Pressure',
    category: 'SOLN',
    // Π = MRT
    equation: 'Pi - M*R*T',
    latexEquation: '\\Pi = MRT',
    variables: [
      {
        id: 'Pi',
        name: 'Osmotic Pressure',
        symbol: '\\Pi',
        htmlSymbol: 'Π',
        unit: 'atm',
        description: 'Osmotic pressure'
      },
      {
        id: 'M',
        name: 'Molarity',
        symbol: 'M',
        htmlSymbol: 'M',
        unit: 'mol/L',
        description: 'Molar concentration of solute'
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
    InfoComponent: OsmoticPressureInfo
  },

  {
    id: 'raoult',
    name: "Raoult's Law",
    category: 'SOLN',
    // P = χ·P°
    equation: 'P - chi*P0',
    latexEquation: 'P = \\chi \\cdot P^\\circ',
    variables: [
      {
        id: 'P',
        name: 'Vapor Pressure',
        symbol: 'P',
        htmlSymbol: 'P',
        unit: 'atm',
        description: 'Vapor pressure of solution'
      },
      {
        id: 'chi',
        name: 'Mole Fraction',
        symbol: '\\chi',
        htmlSymbol: 'χ',
        unit: '',
        description: 'Mole fraction of solvent'
      },
      {
        id: 'P0',
        name: 'Pure Solvent Vapor Pressure',
        symbol: 'P^\\circ',
        htmlSymbol: 'P°',
        unit: 'atm',
        description: 'Vapor pressure of pure solvent'
      }
    ],
    InfoComponent: RaoultInfo
  },

  {
    id: 'boilingPointElevation',
    name: 'Boiling Point Elevation',
    category: 'SOLN',
    // ΔTb = Kb·m·i
    equation: 'deltaTb - Kb*m*i',
    latexEquation: '\\Delta T_b = K_b \\cdot m \\cdot i',
    variables: [
      {
        id: 'deltaTb',
        name: 'Boiling Point Elevation',
        symbol: '\\Delta T_b',
        htmlSymbol: 'ΔT<sub>b</sub>',
        unit: '°C',
        description: 'Change in boiling point'
      },
      {
        id: 'Kb',
        name: 'Ebullioscopic Constant',
        symbol: 'K_b',
        htmlSymbol: 'K<sub>b</sub>',
        unit: '°C·kg/mol',
        description: 'Boiling point elevation constant (solvent-specific)'
      },
      {
        id: 'm',
        name: 'Molality',
        symbol: 'm',
        htmlSymbol: 'm',
        unit: 'mol/kg',
        description: 'Molality of solution'
      },
      {
        id: 'i',
        name: "van't Hoff Factor",
        symbol: 'i',
        htmlSymbol: 'i',
        unit: '',
        description: "van't Hoff factor (number of particles per formula unit)"
      }
    ],
    InfoComponent: BoilingPointElevationInfo
  },

  {
    id: 'freezingPointDepression',
    name: 'Freezing Point Depression',
    category: 'SOLN',
    // ΔTf = Kf·m·i
    equation: 'deltaTf - Kf*m*i',
    latexEquation: '\\Delta T_f = K_f \\cdot m \\cdot i',
    variables: [
      {
        id: 'deltaTf',
        name: 'Freezing Point Depression',
        symbol: '\\Delta T_f',
        htmlSymbol: 'ΔT<sub>f</sub>',
        unit: '°C',
        description: 'Change in freezing point'
      },
      {
        id: 'Kf',
        name: 'Cryoscopic Constant',
        symbol: 'K_f',
        htmlSymbol: 'K<sub>f</sub>',
        unit: '°C·kg/mol',
        description: 'Freezing point depression constant (solvent-specific)'
      },
      {
        id: 'm',
        name: 'Molality',
        symbol: 'm',
        htmlSymbol: 'm',
        unit: 'mol/kg',
        description: 'Molality of solution'
      },
      {
        id: 'i',
        name: "van't Hoff Factor",
        symbol: 'i',
        htmlSymbol: 'i',
        unit: '',
        description: "van't Hoff factor (number of particles per formula unit)"
      }
    ],
    InfoComponent: FreezingPointDepressionInfo
  }
];

// General info for solutions page
export const solutionsInfo = {
  MolarityInfo,
  DilutionInfo
};

export default solutionsCalculators;
