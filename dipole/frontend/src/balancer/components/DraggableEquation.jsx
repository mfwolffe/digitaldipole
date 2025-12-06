/**
 * DraggableEquation - Visual equation with drag-and-drop support
 *
 * Allows users to:
 * - Reorder compounds within reactants or products
 * - Move compounds between reactants and products
 */

import React, { useState, useCallback } from 'react';
import { DraggableCompound, DropZone } from './DraggableCompound.jsx';
import { ArrowSelector, ReactionArrow } from './ArrowSelector.jsx';

export function DraggableEquation({
  equation,
  coefficients = {},
  editable = true,
  onReorder,
  onMove,
  onCoefficientChange,
  onRemoveCompound,
  onArrowChange,
  className = '',
}) {
  const [dragState, setDragState] = useState({
    isDragging: false,
    draggedId: null,
    dropTargetId: null,
  });

  if (!equation) {
    return (
      <div className={`draggable-equation text-gray-500 italic p-4 ${className}`}>
        No equation to display
      </div>
    );
  }

  // Apply coefficients
  const reactantsWithCoeffs = equation.reactants.map(c => ({
    ...c,
    coefficient: coefficients[c.id] ?? c.coefficient ?? 1,
  }));

  const productsWithCoeffs = equation.products.map(c => ({
    ...c,
    coefficient: coefficients[c.id] ?? c.coefficient ?? 1,
  }));

  const handleDragStart = (compoundId, side, index) => {
    setDragState({
      isDragging: true,
      draggedId: compoundId,
      dropTargetId: null,
    });
  };

  const handleDragOver = (compoundId, side, index) => {
    if (compoundId !== dragState.draggedId) {
      setDragState(prev => ({ ...prev, dropTargetId: compoundId }));
    }
  };

  const handleDrop = (fromData, toData) => {
    const { fromSide, fromIndex, compoundId } = fromData;
    const { toSide, toIndex } = toData;

    if (fromSide === toSide) {
      // Reorder within same side
      if (onReorder && fromIndex !== toIndex) {
        onReorder(fromSide, fromIndex, toIndex);
      }
    } else {
      // Move between sides
      if (onMove) {
        onMove(compoundId, fromSide, toSide, toIndex);
      }
    }

    setDragState({ isDragging: false, draggedId: null, dropTargetId: null });
  };

  const handleDragEnd = () => {
    setDragState({ isDragging: false, draggedId: null, dropTargetId: null });
  };

  return (
    <div className={`draggable-equation flex flex-wrap items-center justify-center gap-2 p-4 bg-slate-800 rounded-lg ${className}`}>
      {/* Reactants */}
      <DropZone
        side="reactant"
        onDrop={handleDrop}
        isEmpty={reactantsWithCoeffs.length === 0}
      >
        <div className="flex flex-wrap items-center gap-2">
          {reactantsWithCoeffs.map((compound, idx) => (
            <React.Fragment key={compound.id}>
              {idx > 0 && (
                <span className="plus-sign text-xl text-gray-400">+</span>
              )}
              <DraggableCompound
                compound={compound}
                index={idx}
                side="reactant"
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                isDragging={dragState.draggedId === compound.id}
                isDropTarget={dragState.dropTargetId === compound.id}
                editable={editable}
                onCoefficientChange={onCoefficientChange}
                onRemove={onRemoveCompound}
              />
            </React.Fragment>
          ))}
        </div>
      </DropZone>

      {/* Arrow */}
      {editable ? (
        <ArrowSelector
          value={equation.arrowType}
          onChange={onArrowChange}
          editable={editable}
        />
      ) : (
        <ReactionArrow type={equation.arrowType} />
      )}

      {/* Products */}
      <DropZone
        side="product"
        onDrop={handleDrop}
        isEmpty={productsWithCoeffs.length === 0}
      >
        <div className="flex flex-wrap items-center gap-2">
          {productsWithCoeffs.map((compound, idx) => (
            <React.Fragment key={compound.id}>
              {idx > 0 && (
                <span className="plus-sign text-xl text-gray-400">+</span>
              )}
              <DraggableCompound
                compound={compound}
                index={idx}
                side="product"
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                isDragging={dragState.draggedId === compound.id}
                isDropTarget={dragState.dropTargetId === compound.id}
                editable={editable}
                onCoefficientChange={onCoefficientChange}
                onRemove={onRemoveCompound}
              />
            </React.Fragment>
          ))}
        </div>
      </DropZone>
    </div>
  );
}

export default DraggableEquation;
