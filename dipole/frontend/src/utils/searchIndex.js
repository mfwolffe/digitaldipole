/**
 * Search Index
 *
 * Builds a unified search index from calculators and elements data
 */
import { allCalculators } from '../calculators/registry';
import elementsData from '../data/PubChemElements_all.json';

// Category metadata for routing and display
const CALCULATOR_CATEGORIES = {
  GSLW: { name: 'Gas Laws', path: '/calculators/gas-laws' },
  THRM: { name: 'Thermodynamics', path: '/calculators/thermo' },
  KNTC: { name: 'Kinetics', path: '/calculators/kinetics' },
  SOLN: { name: 'Solutions', path: '/calculators/solutions' },
  ELEC: { name: 'Electrochemistry', path: '/calculators/electrochemistry' },
};

/**
 * Build calculator search items
 */
function buildCalculatorIndex() {
  return allCalculators.map(calc => ({
    type: 'calculator',
    id: calc.id,
    name: calc.name,
    category: CALCULATOR_CATEGORIES[calc.category]?.name || calc.category,
    categoryCode: calc.category,
    path: `${CALCULATOR_CATEGORIES[calc.category]?.path || '/calculators'}/${calc.id}`,
    // Additional searchable text
    keywords: [
      calc.name,
      CALCULATOR_CATEGORIES[calc.category]?.name,
      ...calc.variables.map(v => v.name),
    ].filter(Boolean),
    // For display
    subtitle: CALCULATOR_CATEGORIES[calc.category]?.name,
    icon: 'calculator',
  }));
}

/**
 * Build elements search items from PubChem data
 */
function buildElementsIndex() {
  const columns = elementsData.Table.Columns.Column;
  const rows = elementsData.Table.Row;

  // Find column indices
  const nameIdx = columns.indexOf('Name');
  const symbolIdx = columns.indexOf('Symbol');
  const atomicNumIdx = columns.indexOf('AtomicNumber');
  const groupBlockIdx = columns.indexOf('GroupBlock');

  return rows.map(row => {
    const cells = row.Cell;
    const name = cells[nameIdx];
    const symbol = cells[symbolIdx];
    const atomicNumber = cells[atomicNumIdx];
    const groupBlock = cells[groupBlockIdx];

    return {
      type: 'element',
      id: `element-${atomicNumber}`,
      name: name,
      symbol: symbol,
      atomicNumber: parseInt(atomicNumber, 10),
      category: 'Elements',
      path: `/tabulated?element=${atomicNumber}`,
      keywords: [name, symbol, groupBlock],
      subtitle: `${symbol} · ${groupBlock}`,
      icon: 'atom',
    };
  });
}

/**
 * Build reference pages index
 */
function buildReferenceIndex() {
  return [
    {
      type: 'page',
      id: 'tabulated',
      name: 'Periodic Table Data',
      category: 'References',
      path: '/tabulated',
      keywords: ['periodic table', 'elements', 'tabulated', 'data', 'atomic'],
      subtitle: 'Element properties and data',
      icon: 'table',
    },
    {
      type: 'page',
      id: 'gas-laws',
      name: 'Gas Laws Calculators',
      category: 'Calculator Pages',
      path: '/calculators/gas-laws',
      keywords: ['gas', 'ideal', 'pressure', 'volume', 'temperature'],
      subtitle: 'Boyle, Charles, Ideal Gas Law...',
      icon: 'page',
    },
    {
      type: 'page',
      id: 'thermo',
      name: 'Thermodynamics Calculators',
      category: 'Calculator Pages',
      path: '/calculators/thermo',
      keywords: ['thermodynamics', 'heat', 'entropy', 'enthalpy', 'gibbs'],
      subtitle: 'Heat, Entropy, Gibbs Energy...',
      icon: 'page',
    },
    {
      type: 'page',
      id: 'kinetics',
      name: 'Kinetics Calculators',
      category: 'Calculator Pages',
      path: '/calculators/kinetics',
      keywords: ['kinetics', 'rate', 'reaction', 'arrhenius', 'order'],
      subtitle: 'Arrhenius, Half-life, Rate Laws...',
      icon: 'page',
    },
    {
      type: 'page',
      id: 'solutions',
      name: 'Solutions Calculators',
      category: 'Calculator Pages',
      path: '/calculators/solutions',
      keywords: ['solutions', 'molarity', 'dilution', 'concentration'],
      subtitle: 'Molarity, Dilution, Colligative...',
      icon: 'page',
    },
    {
      type: 'page',
      id: 'electrochemistry',
      name: 'Electrochemistry Calculators',
      category: 'Calculator Pages',
      path: '/calculators/electrochemistry',
      keywords: ['electrochemistry', 'faraday', 'nernst', 'cell', 'potential'],
      subtitle: 'Faraday, Nernst Equation...',
      icon: 'page',
    },
  ];
}

// Build and export the complete search index
let searchIndex = null;

export function getSearchIndex() {
  if (!searchIndex) {
    searchIndex = [
      ...buildCalculatorIndex(),
      ...buildElementsIndex(),
      ...buildReferenceIndex(),
    ];
  }
  return searchIndex;
}

/**
 * Get searchable keys for each item type
 */
export function getSearchKeys(type) {
  switch (type) {
    case 'calculator':
      return ['name', 'category', 'keywords'];
    case 'element':
      return ['name', 'symbol', 'keywords'];
    case 'page':
      return ['name', 'keywords'];
    default:
      return ['name'];
  }
}

export default { getSearchIndex, getSearchKeys };
