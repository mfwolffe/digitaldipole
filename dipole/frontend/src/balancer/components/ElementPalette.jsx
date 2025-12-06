/**
 * ElementPalette - Interactive periodic table for building compounds
 *
 * Features:
 * - Compact periodic table layout
 * - Click elements to add to compound builder
 * - Common elements quick-access bar
 * - Polyatomic ion shortcuts
 */

import React, { useState, useMemo } from 'react';
import data from '../../data/PubChemElements_all.json';
import { POLYATOMIC_IONS } from '../utils/polyatomicIons.js';

// Color scheme by element group
const GROUP_COLORS = {
  "Nonmetal": { bg: '#3b5998', text: '#fff' },
  "Noble gas": { bg: '#9932CC', text: '#fff' },
  "Alkali metal": { bg: '#B22222', text: '#fff' },
  "Alkaline earth metal": { bg: '#FF8C00', text: '#fff' },
  "Metalloid": { bg: '#228B22', text: '#fff' },
  "Halogen": { bg: '#20B2AA', text: '#fff' },
  "Transition metal": { bg: '#4682B4', text: '#fff' },
  "Post-transition metal": { bg: '#708090', text: '#fff' },
  "Lanthanide": { bg: '#8B4513', text: '#fff' },
  "Actinide": { bg: '#800080', text: '#fff' },
};

// Periodic table layout - row/col positions for each atomic number
const PERIODIC_TABLE_LAYOUT = {
  // Period 1
  1: [1, 1], 2: [1, 18],
  // Period 2
  3: [2, 1], 4: [2, 2], 5: [2, 13], 6: [2, 14], 7: [2, 15], 8: [2, 16], 9: [2, 17], 10: [2, 18],
  // Period 3
  11: [3, 1], 12: [3, 2], 13: [3, 13], 14: [3, 14], 15: [3, 15], 16: [3, 16], 17: [3, 17], 18: [3, 18],
  // Period 4
  19: [4, 1], 20: [4, 2], 21: [4, 3], 22: [4, 4], 23: [4, 5], 24: [4, 6], 25: [4, 7], 26: [4, 8],
  27: [4, 9], 28: [4, 10], 29: [4, 11], 30: [4, 12], 31: [4, 13], 32: [4, 14], 33: [4, 15],
  34: [4, 16], 35: [4, 17], 36: [4, 18],
  // Period 5
  37: [5, 1], 38: [5, 2], 39: [5, 3], 40: [5, 4], 41: [5, 5], 42: [5, 6], 43: [5, 7], 44: [5, 8],
  45: [5, 9], 46: [5, 10], 47: [5, 11], 48: [5, 12], 49: [5, 13], 50: [5, 14], 51: [5, 15],
  52: [5, 16], 53: [5, 17], 54: [5, 18],
  // Period 6
  55: [6, 1], 56: [6, 2],
  72: [6, 4], 73: [6, 5], 74: [6, 6], 75: [6, 7], 76: [6, 8], 77: [6, 9], 78: [6, 10],
  79: [6, 11], 80: [6, 12], 81: [6, 13], 82: [6, 14], 83: [6, 15], 84: [6, 16], 85: [6, 17], 86: [6, 18],
  // Period 7
  87: [7, 1], 88: [7, 2],
  104: [7, 4], 105: [7, 5], 106: [7, 6], 107: [7, 7], 108: [7, 8], 109: [7, 9], 110: [7, 10],
  111: [7, 11], 112: [7, 12], 113: [7, 13], 114: [7, 14], 115: [7, 15], 116: [7, 16], 117: [7, 17], 118: [7, 18],
  // Lanthanides (row 9)
  57: [9, 4], 58: [9, 5], 59: [9, 6], 60: [9, 7], 61: [9, 8], 62: [9, 9], 63: [9, 10],
  64: [9, 11], 65: [9, 12], 66: [9, 13], 67: [9, 14], 68: [9, 15], 69: [9, 16], 70: [9, 17], 71: [9, 18],
  // Actinides (row 10)
  89: [10, 4], 90: [10, 5], 91: [10, 6], 92: [10, 7], 93: [10, 8], 94: [10, 9], 95: [10, 10],
  96: [10, 11], 97: [10, 12], 98: [10, 13], 99: [10, 14], 100: [10, 15], 101: [10, 16], 102: [10, 17], 103: [10, 18],
};

// Common elements for quick access
const COMMON_ELEMENTS = ['H', 'C', 'N', 'O', 'S', 'P', 'Na', 'K', 'Ca', 'Mg', 'Fe', 'Cu', 'Zn', 'Cl', 'Br', 'I'];

// Common polyatomic ions
const COMMON_IONS = POLYATOMIC_IONS.slice(0, 12);

/**
 * Build atoms array from JSON data
 */
function buildAtomData() {
  const columns = data.Table.Columns.Column;
  return data.Table.Row.map(row => {
    const atom = {};
    row.Cell.forEach((value, idx) => {
      atom[columns[idx]] = value;
    });
    return atom;
  });
}

/**
 * Single element cell in the periodic table
 */
function ElementCell({ atom, onClick, selected, size = 'sm' }) {
  const colors = GROUP_COLORS[atom.GroupBlock] || GROUP_COLORS['Transition metal'];

  const sizeClasses = {
    xs: 'w-6 h-6 text-[8px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
  };

  return (
    <button
      onClick={() => onClick(atom.Symbol)}
      className={`${sizeClasses[size]} flex items-center justify-center
                 font-bold rounded transition-all hover:scale-110 hover:z-10
                 ${selected ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-900' : ''}
                 hover:shadow-lg`}
      style={{ backgroundColor: colors.bg, color: colors.text }}
      title={`${atom.Name} (${atom.Symbol}) - Click to add`}
    >
      {atom.Symbol}
    </button>
  );
}

/**
 * Compact periodic table grid
 */
function PeriodicTableGrid({ atoms, onElementClick, selectedElements, size = 'sm' }) {
  // Build a lookup by atomic number
  const atomByNumber = useMemo(() => {
    const lookup = {};
    atoms.forEach(atom => {
      lookup[parseInt(atom.AtomicNumber)] = atom;
    });
    return lookup;
  }, [atoms]);

  // Create grid cells
  const gridCells = [];

  for (let row = 1; row <= 10; row++) {
    for (let col = 1; col <= 18; col++) {
      // Find element at this position
      const atomicNum = Object.entries(PERIODIC_TABLE_LAYOUT).find(
        ([num, pos]) => pos[0] === row && pos[1] === col
      )?.[0];

      const atom = atomicNum ? atomByNumber[parseInt(atomicNum)] : null;

      // Skip gap between main table and lanthanides/actinides
      if (row === 8) continue;

      // Lanthanide/Actinide placeholder cells
      if ((row === 6 && col === 3) || (row === 7 && col === 3)) {
        gridCells.push(
          <div
            key={`placeholder-${row}-${col}`}
            className="w-8 h-8 flex items-center justify-center text-[8px] text-gray-500"
            style={{ gridRow: row, gridColumn: col }}
          >
            {row === 6 ? '57-71' : '89-103'}
          </div>
        );
        continue;
      }

      if (atom) {
        gridCells.push(
          <div
            key={atom.AtomicNumber}
            style={{ gridRow: row, gridColumn: col }}
          >
            <ElementCell
              atom={atom}
              onClick={onElementClick}
              selected={selectedElements.includes(atom.Symbol)}
              size={size}
            />
          </div>
        );
      }
    }
  }

  return (
    <div
      className="grid gap-0.5"
      style={{
        gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
        gridTemplateRows: 'repeat(10, minmax(0, 1fr))',
      }}
    >
      {gridCells}
    </div>
  );
}

/**
 * Quick access bar for common elements
 */
function QuickAccessBar({ atoms, onElementClick, selectedElements }) {
  const commonAtoms = atoms.filter(a => COMMON_ELEMENTS.includes(a.Symbol));

  // Sort by COMMON_ELEMENTS order
  commonAtoms.sort((a, b) =>
    COMMON_ELEMENTS.indexOf(a.Symbol) - COMMON_ELEMENTS.indexOf(b.Symbol)
  );

  return (
    <div className="flex flex-wrap gap-1">
      {commonAtoms.map(atom => (
        <ElementCell
          key={atom.Symbol}
          atom={atom}
          onClick={onElementClick}
          selected={selectedElements.includes(atom.Symbol)}
          size="md"
        />
      ))}
    </div>
  );
}

/**
 * Polyatomic ion buttons
 */
function PolyatomicIonBar({ onIonClick }) {
  return (
    <div className="flex flex-wrap gap-1">
      {COMMON_IONS.map(ion => (
        <button
          key={ion.formula}
          onClick={() => onIonClick(ion)}
          className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600
                     text-gray-200 rounded transition-colors"
          title={`${ion.name} (${ion.charge > 0 ? '+' : ''}${ion.charge})`}
        >
          {ion.formula}
          <sup className="text-[9px]">
            {Math.abs(ion.charge) > 1 ? Math.abs(ion.charge) : ''}
            {ion.charge > 0 ? '+' : '−'}
          </sup>
        </button>
      ))}
    </div>
  );
}

/**
 * Main Element Palette component
 */
export function ElementPalette({
  onElementSelect,
  onIonSelect,
  onCompoundAdd,
  currentCompound = [],
  className = '',
  showFullTable = false,
}) {
  const [isExpanded, setIsExpanded] = useState(showFullTable);
  const atoms = useMemo(() => buildAtomData(), []);

  // Track selected elements in current compound being built
  const selectedSymbols = currentCompound.map(e => e.symbol);

  const handleElementClick = (symbol) => {
    if (onElementSelect) {
      onElementSelect(symbol);
    }
  };

  const handleIonClick = (ion) => {
    if (onIonSelect) {
      onIonSelect(ion);
    }
  };

  return (
    <div className={`element-palette bg-slate-800/50 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-300">Element Palette</h4>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-teal-400 hover:text-teal-300"
        >
          {isExpanded ? 'Show less' : 'Full table'}
        </button>
      </div>

      {/* Quick access or full table */}
      {isExpanded ? (
        <div className="mb-4 overflow-x-auto">
          <PeriodicTableGrid
            atoms={atoms}
            onElementClick={handleElementClick}
            selectedElements={selectedSymbols}
            size="sm"
          />
        </div>
      ) : (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-2">Common elements:</p>
          <QuickAccessBar
            atoms={atoms}
            onElementClick={handleElementClick}
            selectedElements={selectedSymbols}
          />
        </div>
      )}

      {/* Polyatomic ions */}
      <div className="border-t border-slate-700 pt-3">
        <p className="text-xs text-gray-500 mb-2">Polyatomic ions:</p>
        <PolyatomicIonBar onIonClick={handleIonClick} />
      </div>

      {/* Legend (only when expanded) */}
      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-slate-700">
          <p className="text-xs text-gray-500 mb-2">Legend:</p>
          <div className="flex flex-wrap gap-2 text-[10px]">
            {Object.entries(GROUP_COLORS).map(([group, colors]) => (
              <div key={group} className="flex items-center gap-1">
                <span
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: colors.bg }}
                />
                <span className="text-gray-400">{group}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ElementPalette;
