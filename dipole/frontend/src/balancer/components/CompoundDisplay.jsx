/**
 * CompoundDisplay - Visual representation of a chemical compound
 *
 * Displays coefficient, formula with subscripts, and charge.
 * Can be editable or read-only.
 *
 * Example: 2Ca(OH)₂²⁺
 */

import React from 'react';
import { ElementBlock, toSubscript } from './ElementBlock.jsx';
import { ChargeIndicator } from './ChargeIndicator.jsx';
import { CoefficientInput } from './CoefficientInput.jsx';

export function CompoundDisplay({
  compound,
  editable = false,
  showCoefficient = true,
  onCoefficientChange,
  onRemove,
  className = '',
  size = 'md',
}) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const handleCoefficientChange = (newCoeff) => {
    if (onCoefficientChange) {
      onCoefficientChange(compound.id, newCoeff);
    }
  };

  return (
    <span
      className={`compound-display inline-flex items-baseline gap-0.5
                 ${sizeClasses[size]} ${className}`}
    >
      {/* Coefficient */}
      {showCoefficient && (
        <CoefficientInput
          value={compound.coefficient || 1}
          onChange={handleCoefficientChange}
          editable={editable}
        />
      )}

      {/* Formula */}
      <span className="compound-formula">
        {renderFormula(compound.groups, compound.elements)}
      </span>

      {/* Charge */}
      {compound.charge !== 0 && (
        <ChargeIndicator
          charge={compound.charge}
          editable={editable}
        />
      )}

      {/* Remove button */}
      {editable && onRemove && (
        <button
          onClick={() => onRemove(compound.id)}
          className="ml-1 text-red-400 hover:text-red-300 text-sm"
          aria-label={`Remove ${compound.formula}`}
          title="Remove compound"
        >
          ×
        </button>
      )}
    </span>
  );
}

/**
 * Render formula from groups structure
 */
function renderFormula(groups, elements) {
  if (!groups || groups.length === 0) {
    // Fallback to flat element list
    return elements?.map((elem, i) => (
      <ElementBlock
        key={`${elem.symbol}-${i}`}
        symbol={elem.symbol}
        count={elem.count}
      />
    ));
  }

  return groups.map((group, groupIdx) => {
    if (group.multiplier > 1 || group.elements.length > 1) {
      // Render as parenthesized group
      return (
        <span key={groupIdx} className="compound-group inline-flex items-baseline">
          <span className="text-gray-400">(</span>
          {group.elements.map((elem, i) => (
            <ElementBlock
              key={`${elem.symbol}-${i}`}
              symbol={elem.symbol}
              count={elem.count}
            />
          ))}
          <span className="text-gray-400">)</span>
          {group.multiplier > 1 && (
            <span className="text-sm">{toSubscript(group.multiplier)}</span>
          )}
        </span>
      );
    } else {
      // Single element, no parens needed
      return group.elements.map((elem, i) => (
        <ElementBlock
          key={`${groupIdx}-${elem.symbol}-${i}`}
          symbol={elem.symbol}
          count={elem.count}
        />
      ));
    }
  });
}

/**
 * Simpler compound display for balanced results
 */
export function CompoundText({ compound, showCoefficient = true }) {
  const coeff = compound.coefficient || 1;

  return (
    <span className="compound-text">
      {showCoefficient && coeff > 1 && (
        <span className="text-amber-400 font-bold">{coeff}</span>
      )}
      <span>{compound.formula}</span>
      {compound.charge !== 0 && (
        <ChargeIndicator charge={compound.charge} />
      )}
    </span>
  );
}

export default CompoundDisplay;
