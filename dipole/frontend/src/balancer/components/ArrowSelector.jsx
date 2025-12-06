/**
 * ArrowSelector - Reaction arrow display and selection
 *
 * Arrow types:
 *   ->  : Forward reaction (default)
 *   <-> : Reversible reaction
 *   =   : Equilibrium (simplified)
 */

import React from 'react';

const ARROW_TYPES = [
  { value: '->', display: '→', label: 'Forward' },
  { value: '<->', display: '⇌', label: 'Reversible' },
  { value: '=', display: '⇌', label: 'Equilibrium' },
];

export function ArrowSelector({
  value = '->',
  onChange,
  editable = false,
  className = '',
  size = 'md',
}) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const currentArrow = ARROW_TYPES.find(a => a.value === value) || ARROW_TYPES[0];

  const handleClick = () => {
    if (editable && onChange) {
      // Cycle through arrow types
      const currentIdx = ARROW_TYPES.findIndex(a => a.value === value);
      const nextIdx = (currentIdx + 1) % ARROW_TYPES.length;
      onChange(ARROW_TYPES[nextIdx].value);
    }
  };

  return (
    <span
      className={`arrow-selector ${sizeClasses[size]} text-gray-300 mx-3
                 ${editable ? 'cursor-pointer hover:text-teal-400' : ''}
                 ${className}`}
      onClick={handleClick}
      title={editable ? `${currentArrow.label} (click to change)` : currentArrow.label}
      role={editable ? 'button' : undefined}
      aria-label={`Reaction arrow: ${currentArrow.label}`}
    >
      {currentArrow.display}
    </span>
  );
}

/**
 * Simple arrow display (non-interactive)
 */
export function ReactionArrow({ type = '->', className = '' }) {
  const arrow = ARROW_TYPES.find(a => a.value === type) || ARROW_TYPES[0];

  return (
    <span className={`reaction-arrow text-2xl text-gray-300 mx-3 ${className}`}>
      {arrow.display}
    </span>
  );
}

export { ARROW_TYPES };
export default ArrowSelector;
