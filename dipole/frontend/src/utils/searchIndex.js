/**
 * Search Index
 *
 * Builds a unified search index from calculators and elements data
 */
import { allCalculators } from '../calculators/registry';
import elementsData from '../data/PubChemElements_all.json';

// Category metadata for routing and display
// Adding a new category here automatically:
//   1. Routes calculators in that category to the correct page
//   2. Adds a "Calculator Pages" search entry for the category page
const CALCULATOR_CATEGORIES = {
  GSLW: {
    name: 'Gas Laws',
    path: '/calculators/gas-laws',
    keywords: ['gas', 'ideal', 'pressure', 'volume', 'temperature'],
    subtitle: 'Boyle, Charles, Ideal Gas Law...',
  },
  THRM: {
    name: 'Thermodynamics',
    path: '/calculators/thermo',
    keywords: ['thermodynamics', 'heat', 'entropy', 'enthalpy', 'gibbs'],
    subtitle: 'Heat, Entropy, Gibbs Energy...',
  },
  KNTC: {
    name: 'Kinetics',
    path: '/calculators/kinetics',
    keywords: ['kinetics', 'rate', 'reaction', 'arrhenius', 'order'],
    subtitle: 'Arrhenius, Half-life, Rate Laws...',
  },
  SOLN: {
    name: 'Solutions',
    path: '/calculators/solutions',
    keywords: ['solutions', 'molarity', 'dilution', 'concentration'],
    subtitle: 'Molarity, Dilution, Colligative...',
  },
  ELEC: {
    name: 'Electrochemistry',
    path: '/calculators/electrochemistry',
    keywords: ['electrochemistry', 'faraday', 'nernst', 'cell', 'potential'],
    subtitle: 'Faraday, Nernst Equation...',
  },
};

// Static reference pages (non-calculator pages)
// Add new reference pages here
const STATIC_PAGES = [
  {
    id: 'tabulated',
    name: 'Periodic Table Data',
    category: 'References',
    path: '/tabulated',
    keywords: ['periodic table', 'elements', 'tabulated', 'data', 'atomic'],
    subtitle: 'Element properties and data',
  },
  // Add more static pages here as needed, e.g.:
  // {
  //   id: 'constants',
  //   name: 'Physical Constants',
  //   category: 'References',
  //   path: '/constants',
  //   keywords: ['constants', 'avogadro', 'planck', 'boltzmann'],
  //   subtitle: 'Fundamental physical constants',
  // },
];

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
 * Auto-generates calculator category pages from CALCULATOR_CATEGORIES
 * and includes static pages from STATIC_PAGES
 */
function buildReferenceIndex() {
  // Auto-generate calculator category pages
  const categoryPages = Object.entries(CALCULATOR_CATEGORIES).map(([code, cat]) => ({
    type: 'page',
    id: code.toLowerCase(),
    name: `${cat.name} Calculators`,
    category: 'Calculator Pages',
    path: cat.path,
    keywords: cat.keywords || [],
    subtitle: cat.subtitle || cat.name,
    icon: 'page',
  }));

  // Static reference pages
  const staticPages = STATIC_PAGES.map(page => ({
    type: 'page',
    icon: 'table',
    ...page,
  }));

  return [...staticPages, ...categoryPages];
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
