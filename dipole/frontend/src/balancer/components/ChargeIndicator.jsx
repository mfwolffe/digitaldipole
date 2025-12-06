/**
 * ChargeIndicator - Displays ionic charge as superscript
 *
 * Examples:
 *   <ChargeIndicator charge={2} />   -> ²⁺
 *   <ChargeIndicator charge={-1} />  -> ⁻
 *   <ChargeIndicator charge={-3} />  -> ³⁻
 */

import React from 'react';

// Unicode superscript digits and signs
const SUPERSCRIPT_DIGITS = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
const SUPERSCRIPT_PLUS = '⁺';
const SUPERSCRIPT_MINUS = '⁻';

/**
 * Convert charge to superscript string
 */
function toSuperscript(charge) {
  if (charge === 0) return '';

  const absCharge = Math.abs(charge);
  const sign = charge > 0 ? SUPERSCRIPT_PLUS : SUPERSCRIPT_MINUS;

  if (absCharge === 1) {
    return sign;
  }

  const digits = String(absCharge)
    .split('')
    .map(d => SUPERSCRIPT_DIGITS[parseInt(d, 10)])
    .join('');

  return digits + sign;
}

/**
 * Format charge for display (non-superscript version)
 */
export function formatCharge(charge) {
  if (charge === 0) return '';
  const absCharge = Math.abs(charge);
  const sign = charge > 0 ? '+' : '−';
  return absCharge === 1 ? sign : `${absCharge}${sign}`;
}

export function ChargeIndicator({
  charge,
  className = '',
  editable = false,
  onChange,
}) {
  if (charge === 0) return null;

  const superscript = toSuperscript(charge);

  const handleClick = (e) => {
    if (editable && onChange) {
      e.stopPropagation();
      const input = prompt('Enter charge (e.g., 2+ or 3-):', formatCharge(charge));
      if (input !== null) {
        const parsed = parseChargeInput(input);
        if (parsed !== null) {
          onChange(parsed);
        }
      }
    }
  };

  return (
    <sup
      className={`charge-indicator text-xs ${className} ${editable ? 'cursor-pointer hover:text-amber-400' : ''}`}
      onClick={handleClick}
      title={`Charge: ${formatCharge(charge)}`}
    >
      {superscript}
    </sup>
  );
}

/**
 * Parse charge input string (e.g., "2+", "3-", "+", "-")
 */
function parseChargeInput(input) {
  if (!input) return null;

  const trimmed = input.trim();

  // Handle simple +/-
  if (trimmed === '+') return 1;
  if (trimmed === '-' || trimmed === '−') return -1;

  // Handle number+sign format (e.g., "2+", "3-")
  const match = trimmed.match(/^(\d+)([+\-−])$/);
  if (match) {
    const num = parseInt(match[1], 10);
    const sign = match[2] === '+' ? 1 : -1;
    return num * sign;
  }

  // Handle sign+number format (e.g., "+2", "-3")
  const match2 = trimmed.match(/^([+\-−])(\d+)$/);
  if (match2) {
    const sign = match2[1] === '+' ? 1 : -1;
    const num = parseInt(match2[2], 10);
    return num * sign;
  }

  return null;
}

export { toSuperscript, parseChargeInput };
export default ChargeIndicator;
