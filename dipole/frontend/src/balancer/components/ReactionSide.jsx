/**
 * ReactionSide - Container for reactants or products
 *
 * Displays compounds separated by plus signs.
 * Supports adding/removing compounds when editable.
 */

import React from 'react';
import { CompoundDisplay } from './CompoundDisplay.jsx';

export function ReactionSide({
  compounds = [],
  side = 'reactant', // 'reactant' | 'product'
  editable = false,
  onCoefficientChange,
  onRemoveCompound,
  onAddCompound,
  className = '',
}) {
  const sideLabel = side === 'reactant' ? 'Reactants' : 'Products';

  return (
    <div className={`reaction-side flex flex-wrap items-center gap-2 ${className}`}>
      {compounds.map((compound, idx) => (
        <React.Fragment key={compound.id}>
          {/* Plus sign separator */}
          {idx > 0 && (
            <span className="plus-sign text-xl text-gray-400 mx-1">+</span>
          )}

          {/* Compound */}
          <CompoundDisplay
            compound={compound}
            editable={editable}
            onCoefficientChange={onCoefficientChange}
            onRemove={onRemoveCompound}
          />
        </React.Fragment>
      ))}

      {/* Add compound button */}
      {editable && onAddCompound && (
        <button
          onClick={() => onAddCompound(side)}
          className="add-compound ml-2 px-2 py-1 text-sm text-teal-400
                     border border-dashed border-teal-400 rounded
                     hover:bg-teal-400/10 transition-colors"
          title={`Add ${side}`}
        >
          + Add
        </button>
      )}

      {/* Empty state */}
      {compounds.length === 0 && !editable && (
        <span className="text-gray-500 italic">No {sideLabel.toLowerCase()}</span>
      )}
    </div>
  );
}

export default ReactionSide;
