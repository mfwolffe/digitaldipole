/**
 * ElementBlock - Displays a single element with optional subscript
 *
 * Examples:
 *   <ElementBlock symbol="H" count={2} />  -> H₂
 *   <ElementBlock symbol="O" />            -> O
 *   <ElementBlock symbol="Fe" count={3} /> -> Fe₃
 */

import React from 'react';

// Unicode subscript digits
const SUBSCRIPT_DIGITS = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];

/**
 * Convert number to subscript string
 */
function toSubscript(num) {
  if (num <= 1) return '';
  return String(num)
    .split('')
    .map(d => SUBSCRIPT_DIGITS[parseInt(d, 10)])
    .join('');
}

export function ElementBlock({
  symbol,
  count = 1,
  className = '',
  onClick,
  editable = false,
  onCountChange,
}) {
  const subscript = toSubscript(count);

  const handleClick = () => {
    if (onClick) onClick();
  };

  const handleCountClick = (e) => {
    if (editable && onCountChange) {
      e.stopPropagation();
      const newCount = prompt('Enter subscript:', count);
      if (newCount !== null) {
        const parsed = parseInt(newCount, 10);
        if (!isNaN(parsed) && parsed >= 1) {
          onCountChange(parsed);
        }
      }
    }
  };

  return (
    <span
      className={`element-block inline-flex items-baseline ${className} ${onClick ? 'cursor-pointer hover:text-teal-400' : ''}`}
      onClick={handleClick}
    >
      <span className="element-symbol font-medium">{symbol}</span>
      {subscript && (
        <span
          className={`element-subscript text-sm ${editable ? 'cursor-pointer hover:text-amber-400' : ''}`}
          onClick={handleCountClick}
        >
          {subscript}
        </span>
      )}
    </span>
  );
}

export { toSubscript };
export default ElementBlock;
