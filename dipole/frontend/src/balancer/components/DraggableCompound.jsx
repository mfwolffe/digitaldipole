/**
 * DraggableCompound - Drag-and-drop wrapper for compounds
 *
 * Uses HTML5 drag-and-drop API for:
 * - Reordering compounds within a side
 * - Moving compounds between reactants and products
 */

import React, { useState, useRef } from 'react';
import { CompoundDisplay } from './CompoundDisplay.jsx';

/**
 * Draggable compound wrapper
 */
export function DraggableCompound({
  compound,
  index,
  side,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
  isDropTarget,
  editable = true,
  onCoefficientChange,
  onRemove,
}) {
  const dragRef = useRef(null);

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({
      compoundId: compound.id,
      fromSide: side,
      fromIndex: index,
    }));

    // Add drag image
    if (dragRef.current) {
      const rect = dragRef.current.getBoundingClientRect();
      e.dataTransfer.setDragImage(dragRef.current, rect.width / 2, rect.height / 2);
    }

    onDragStart?.(compound.id, side, index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver?.(compound.id, side, index);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      onDrop?.(data, { compoundId: compound.id, toSide: side, toIndex: index });
    } catch (err) {
      console.error('Drop failed:', err);
    }
  };

  const handleDragEnd = () => {
    onDragEnd?.();
  };

  return (
    <div
      ref={dragRef}
      draggable={editable}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      className={`
        draggable-compound inline-flex items-center
        transition-all duration-150
        ${editable ? 'cursor-grab active:cursor-grabbing' : ''}
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${isDropTarget ? 'ring-2 ring-teal-400 ring-offset-2 ring-offset-slate-800 rounded-lg' : ''}
      `}
    >
      <CompoundDisplay
        compound={compound}
        editable={editable}
        onCoefficientChange={onCoefficientChange}
        onRemove={onRemove}
      />
      {editable && (
        <span className="ml-1 text-gray-600 text-xs" title="Drag to reorder">
          ⋮⋮
        </span>
      )}
    </div>
  );
}

/**
 * Drop zone for moving compounds between sides
 */
export function DropZone({
  side,
  onDrop,
  isActive,
  isEmpty,
  children,
}) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      onDrop?.(data, { toSide: side, toIndex: -1 }); // -1 means append
    } catch (err) {
      console.error('Drop failed:', err);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        drop-zone min-h-[3rem] p-2 rounded-lg transition-all
        ${isOver ? 'bg-teal-500/20 border-2 border-dashed border-teal-400' : 'border-2 border-transparent'}
        ${isEmpty ? 'border-dashed border-slate-600' : ''}
      `}
    >
      {children}
      {isEmpty && (
        <span className="text-gray-500 text-sm italic">
          Drop compounds here or click + to add
        </span>
      )}
    </div>
  );
}

export default DraggableCompound;
