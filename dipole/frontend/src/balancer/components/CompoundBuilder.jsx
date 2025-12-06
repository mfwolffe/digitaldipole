/**
 * CompoundBuilder - Interactive compound construction interface
 *
 * Allows users to build compounds by:
 * - Clicking elements from the palette
 * - Adjusting subscripts
 * - Adding charges
 * - Grouping with parentheses
 */

import React, { useState, useCallback, useEffect } from 'react';
import { ElementBlock, toSubscript } from './ElementBlock.jsx';
import { ChargeIndicator } from './ChargeIndicator.jsx';
import { Button } from '../../components/ui/Button.jsx';

/**
 * Main compound builder component
 */
export function CompoundBuilder({
  onCompoundComplete,
  onCancel,
  initialElements = [],
  side = 'reactant',
}) {
  const [elements, setElements] = useState(initialElements);
  const [charge, setCharge] = useState(0);
  const [groups, setGroups] = useState([]); // For parentheses grouping

  // Sync with external initialElements
  useEffect(() => {
    setElements(initialElements);
  }, [initialElements]);

  /**
   * Add an element to the compound
   */
  const addElement = useCallback((symbol) => {
    setElements(prev => {
      // Check if this element already exists
      const existing = prev.find(e => e.symbol === symbol);
      if (existing) {
        // Increment count
        return prev.map(e =>
          e.symbol === symbol ? { ...e, count: e.count + 1 } : e
        );
      } else {
        // Add new element
        return [...prev, { symbol, count: 1 }];
      }
    });
  }, []);

  /**
   * Update element count
   */
  const updateElementCount = useCallback((symbol, newCount) => {
    if (newCount < 1) {
      // Remove element
      setElements(prev => prev.filter(e => e.symbol !== symbol));
    } else {
      setElements(prev =>
        prev.map(e => e.symbol === symbol ? { ...e, count: newCount } : e)
      );
    }
  }, []);

  /**
   * Remove an element
   */
  const removeElement = useCallback((symbol) => {
    setElements(prev => prev.filter(e => e.symbol !== symbol));
  }, []);

  /**
   * Clear all elements
   */
  const clearAll = useCallback(() => {
    setElements([]);
    setCharge(0);
  }, []);

  /**
   * Build the compound and notify parent
   */
  const handleComplete = useCallback(() => {
    if (elements.length === 0) return;

    // Build formula string
    const formula = elements
      .map(e => e.symbol + (e.count > 1 ? e.count : ''))
      .join('');

    const compound = {
      id: `compound-${Date.now()}`,
      elements: elements.map(e => ({ ...e })),
      groups: elements.map(e => ({ elements: [e], multiplier: 1 })),
      charge,
      coefficient: 1,
      formula,
      side,
    };

    onCompoundComplete(compound);
  }, [elements, charge, side, onCompoundComplete]);

  /**
   * Handle polyatomic ion addition
   */
  const addPolyatomicIon = useCallback((ion) => {
    // Add all elements from the ion
    ion.elements.forEach(elem => {
      for (let i = 0; i < elem.count; i++) {
        addElement(elem.symbol);
      }
    });
    // Set the charge
    setCharge(ion.charge);
  }, [addElement]);

  return (
    <div className="compound-builder bg-slate-700 rounded-lg p-4">
      {/* Current compound display */}
      <div className="compound-display min-h-[3rem] bg-slate-800 rounded-lg p-3 mb-4
                      flex items-center justify-center flex-wrap gap-1">
        {elements.length === 0 ? (
          <span className="text-gray-500 italic">
            Click elements below to build compound
          </span>
        ) : (
          <>
            {elements.map((elem, idx) => (
              <ElementToken
                key={`${elem.symbol}-${idx}`}
                symbol={elem.symbol}
                count={elem.count}
                onCountChange={(count) => updateElementCount(elem.symbol, count)}
                onRemove={() => removeElement(elem.symbol)}
              />
            ))}
            {charge !== 0 && (
              <ChargeToken
                charge={charge}
                onChange={setCharge}
              />
            )}
          </>
        )}
      </div>

      {/* Charge controls */}
      <div className="charge-controls flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-400">Charge:</span>
        <button
          onClick={() => setCharge(c => c - 1)}
          className="w-8 h-8 bg-slate-600 hover:bg-slate-500 rounded text-lg"
        >
          −
        </button>
        <span className="w-12 text-center font-mono">
          {charge === 0 ? '0' : (charge > 0 ? `+${charge}` : charge)}
        </span>
        <button
          onClick={() => setCharge(c => c + 1)}
          className="w-8 h-8 bg-slate-600 hover:bg-slate-500 rounded text-lg"
        >
          +
        </button>
      </div>

      {/* Action buttons */}
      <div className="actions flex gap-2">
        <Button
          variant="primary"
          onClick={handleComplete}
          disabled={elements.length === 0}
          className="flex-1"
        >
          Add to {side === 'reactant' ? 'Reactants' : 'Products'}
        </Button>
        <Button
          variant="ghost"
          onClick={clearAll}
          disabled={elements.length === 0}
        >
          Clear
        </Button>
        {onCancel && (
          <Button variant="outline-secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * Individual element token with editable count
 */
function ElementToken({ symbol, count, onCountChange, onRemove }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleCountClick = (e) => {
    e.stopPropagation();
    const newCount = prompt(`Enter subscript for ${symbol}:`, count);
    if (newCount !== null) {
      const parsed = parseInt(newCount, 10);
      if (!isNaN(parsed)) {
        onCountChange(parsed);
      }
    }
  };

  return (
    <span className="element-token inline-flex items-baseline bg-slate-600 rounded px-2 py-1
                     group relative">
      <span className="font-medium text-lg">{symbol}</span>
      {count > 1 && (
        <span
          className="text-sm text-amber-400 cursor-pointer hover:text-amber-300"
          onClick={handleCountClick}
          title="Click to edit subscript"
        >
          {toSubscript(count)}
        </span>
      )}
      {count === 1 && (
        <span
          className="text-sm text-gray-500 cursor-pointer hover:text-amber-400 ml-0.5"
          onClick={handleCountClick}
          title="Click to add subscript"
        >
          ₁
        </span>
      )}
      <button
        onClick={onRemove}
        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full
                   text-[10px] text-white opacity-0 group-hover:opacity-100
                   transition-opacity flex items-center justify-center"
        title="Remove element"
      >
        ×
      </button>
    </span>
  );
}

/**
 * Charge token display
 */
function ChargeToken({ charge, onChange }) {
  const handleClick = () => {
    const input = prompt('Enter charge (e.g., 2, -1, +3):', charge);
    if (input !== null) {
      const parsed = parseInt(input, 10);
      if (!isNaN(parsed)) {
        onChange(parsed);
      }
    }
  };

  const display = charge > 0
    ? (charge === 1 ? '⁺' : `${toSuperscript(charge)}⁺`)
    : (charge === -1 ? '⁻' : `${toSuperscript(Math.abs(charge))}⁻`);

  return (
    <span
      className="charge-token text-cyan-400 cursor-pointer hover:text-cyan-300"
      onClick={handleClick}
      title="Click to edit charge"
    >
      {display}
    </span>
  );
}

// Superscript digits for charge display
const SUPERSCRIPT_DIGITS = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];

function toSuperscript(num) {
  return String(num)
    .split('')
    .map(d => SUPERSCRIPT_DIGITS[parseInt(d, 10)])
    .join('');
}

export default CompoundBuilder;
