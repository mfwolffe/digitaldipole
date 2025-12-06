/**
 * Polyatomic Ions Database
 *
 * Common polyatomic ions for autocomplete, parsing, and display.
 * Includes formula, charge, name, and component elements.
 */

export const POLYATOMIC_IONS = [
  // Common anions (negative)
  { formula: 'OH', charge: -1, name: 'Hydroxide', elements: [{ symbol: 'O', count: 1 }, { symbol: 'H', count: 1 }] },
  { formula: 'NO3', charge: -1, name: 'Nitrate', elements: [{ symbol: 'N', count: 1 }, { symbol: 'O', count: 3 }] },
  { formula: 'NO2', charge: -1, name: 'Nitrite', elements: [{ symbol: 'N', count: 1 }, { symbol: 'O', count: 2 }] },
  { formula: 'ClO', charge: -1, name: 'Hypochlorite', elements: [{ symbol: 'Cl', count: 1 }, { symbol: 'O', count: 1 }] },
  { formula: 'ClO2', charge: -1, name: 'Chlorite', elements: [{ symbol: 'Cl', count: 1 }, { symbol: 'O', count: 2 }] },
  { formula: 'ClO3', charge: -1, name: 'Chlorate', elements: [{ symbol: 'Cl', count: 1 }, { symbol: 'O', count: 3 }] },
  { formula: 'ClO4', charge: -1, name: 'Perchlorate', elements: [{ symbol: 'Cl', count: 1 }, { symbol: 'O', count: 4 }] },
  { formula: 'BrO3', charge: -1, name: 'Bromate', elements: [{ symbol: 'Br', count: 1 }, { symbol: 'O', count: 3 }] },
  { formula: 'IO3', charge: -1, name: 'Iodate', elements: [{ symbol: 'I', count: 1 }, { symbol: 'O', count: 3 }] },
  { formula: 'CN', charge: -1, name: 'Cyanide', elements: [{ symbol: 'C', count: 1 }, { symbol: 'N', count: 1 }] },
  { formula: 'SCN', charge: -1, name: 'Thiocyanate', elements: [{ symbol: 'S', count: 1 }, { symbol: 'C', count: 1 }, { symbol: 'N', count: 1 }] },
  { formula: 'MnO4', charge: -1, name: 'Permanganate', elements: [{ symbol: 'Mn', count: 1 }, { symbol: 'O', count: 4 }] },
  { formula: 'HCO3', charge: -1, name: 'Bicarbonate', elements: [{ symbol: 'H', count: 1 }, { symbol: 'C', count: 1 }, { symbol: 'O', count: 3 }] },
  { formula: 'HSO4', charge: -1, name: 'Bisulfate', elements: [{ symbol: 'H', count: 1 }, { symbol: 'S', count: 1 }, { symbol: 'O', count: 4 }] },
  { formula: 'HSO3', charge: -1, name: 'Bisulfite', elements: [{ symbol: 'H', count: 1 }, { symbol: 'S', count: 1 }, { symbol: 'O', count: 3 }] },
  { formula: 'H2PO4', charge: -1, name: 'Dihydrogen phosphate', elements: [{ symbol: 'H', count: 2 }, { symbol: 'P', count: 1 }, { symbol: 'O', count: 4 }] },
  { formula: 'C2H3O2', charge: -1, name: 'Acetate', elements: [{ symbol: 'C', count: 2 }, { symbol: 'H', count: 3 }, { symbol: 'O', count: 2 }] },
  { formula: 'CH3COO', charge: -1, name: 'Acetate', elements: [{ symbol: 'C', count: 2 }, { symbol: 'H', count: 3 }, { symbol: 'O', count: 2 }] },

  // Divalent anions (-2)
  { formula: 'SO4', charge: -2, name: 'Sulfate', elements: [{ symbol: 'S', count: 1 }, { symbol: 'O', count: 4 }] },
  { formula: 'SO3', charge: -2, name: 'Sulfite', elements: [{ symbol: 'S', count: 1 }, { symbol: 'O', count: 3 }] },
  { formula: 'CO3', charge: -2, name: 'Carbonate', elements: [{ symbol: 'C', count: 1 }, { symbol: 'O', count: 3 }] },
  { formula: 'CrO4', charge: -2, name: 'Chromate', elements: [{ symbol: 'Cr', count: 1 }, { symbol: 'O', count: 4 }] },
  { formula: 'Cr2O7', charge: -2, name: 'Dichromate', elements: [{ symbol: 'Cr', count: 2 }, { symbol: 'O', count: 7 }] },
  { formula: 'SiO3', charge: -2, name: 'Silicate', elements: [{ symbol: 'Si', count: 1 }, { symbol: 'O', count: 3 }] },
  { formula: 'HPO4', charge: -2, name: 'Hydrogen phosphate', elements: [{ symbol: 'H', count: 1 }, { symbol: 'P', count: 1 }, { symbol: 'O', count: 4 }] },
  { formula: 'C2O4', charge: -2, name: 'Oxalate', elements: [{ symbol: 'C', count: 2 }, { symbol: 'O', count: 4 }] },
  { formula: 'S2O3', charge: -2, name: 'Thiosulfate', elements: [{ symbol: 'S', count: 2 }, { symbol: 'O', count: 3 }] },
  { formula: 'O2', charge: -2, name: 'Peroxide', elements: [{ symbol: 'O', count: 2 }] },

  // Trivalent anions (-3)
  { formula: 'PO4', charge: -3, name: 'Phosphate', elements: [{ symbol: 'P', count: 1 }, { symbol: 'O', count: 4 }] },
  { formula: 'PO3', charge: -3, name: 'Phosphite', elements: [{ symbol: 'P', count: 1 }, { symbol: 'O', count: 3 }] },
  { formula: 'AsO4', charge: -3, name: 'Arsenate', elements: [{ symbol: 'As', count: 1 }, { symbol: 'O', count: 4 }] },
  { formula: 'BO3', charge: -3, name: 'Borate', elements: [{ symbol: 'B', count: 1 }, { symbol: 'O', count: 3 }] },

  // Cations (positive)
  { formula: 'NH4', charge: +1, name: 'Ammonium', elements: [{ symbol: 'N', count: 1 }, { symbol: 'H', count: 4 }] },
  { formula: 'H3O', charge: +1, name: 'Hydronium', elements: [{ symbol: 'H', count: 3 }, { symbol: 'O', count: 1 }] },
  { formula: 'Hg2', charge: +2, name: 'Mercury(I)', elements: [{ symbol: 'Hg', count: 2 }] },
];

/**
 * Look up polyatomic ion by formula
 */
export function findPolyatomicIon(formula) {
  return POLYATOMIC_IONS.find(ion =>
    ion.formula.toLowerCase() === formula.toLowerCase()
  );
}

/**
 * Get all ion formulas for autocomplete
 */
export function getIonFormulas() {
  return POLYATOMIC_IONS.map(ion => ion.formula);
}

/**
 * Get ions grouped by charge
 */
export function getIonsByCharge() {
  const groups = {};

  for (const ion of POLYATOMIC_IONS) {
    const key = ion.charge > 0 ? 'cations' : `anions_${Math.abs(ion.charge)}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(ion);
  }

  return groups;
}

/**
 * Format charge for display (e.g., 2 -> "2+", -1 -> "-")
 */
export function formatCharge(charge) {
  if (charge === 0) return '';
  const absCharge = Math.abs(charge);
  const sign = charge > 0 ? '+' : '−';
  return absCharge === 1 ? sign : `${absCharge}${sign}`;
}

/**
 * Format charge as superscript HTML
 */
export function formatChargeSuperscript(charge) {
  if (charge === 0) return '';
  return `<sup>${formatCharge(charge)}</sup>`;
}

export default {
  POLYATOMIC_IONS,
  findPolyatomicIon,
  getIonFormulas,
  getIonsByCharge,
  formatCharge,
  formatChargeSuperscript,
};
