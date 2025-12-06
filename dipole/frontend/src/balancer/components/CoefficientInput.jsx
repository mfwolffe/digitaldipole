/**
 * CoefficientInput - Editable stoichiometric coefficient
 *
 * Displays as a number that can be edited inline.
 * Coefficients of 1 can be hidden or shown based on prop.
 */

import React, { useState, useRef, useEffect } from 'react';

export function CoefficientInput({
  value = 1,
  onChange,
  editable = true,
  showOne = false,
  min = 1,
  max = 99,
  className = '',
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(String(value));
  const inputRef = useRef(null);

  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (editable) {
      setIsEditing(true);
    }
  };

  const handleChange = (e) => {
    const raw = e.target.value;
    // Allow empty or numeric input
    if (raw === '' || /^\d+$/.test(raw)) {
      setLocalValue(raw);
    }
  };

  const handleBlur = () => {
    commitValue();
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      commitValue();
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setLocalValue(String(value));
      setIsEditing(false);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newVal = Math.min(max, value + 1);
      onChange(newVal);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newVal = Math.max(min, value - 1);
      onChange(newVal);
    }
  };

  const commitValue = () => {
    const num = parseInt(localValue, 10);
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num);
    } else {
      setLocalValue(String(value));
    }
  };

  // Don't render anything for coefficient of 1 unless showOne is true
  if (value === 1 && !showOne && !isEditing) {
    if (editable) {
      return (
        <span
          className={`coefficient-placeholder w-4 h-6 inline-block cursor-pointer hover:bg-slate-700 rounded ${className}`}
          onClick={handleClick}
          title="Click to add coefficient"
        />
      );
    }
    return null;
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`coefficient-input w-8 h-6 text-center text-lg font-bold
                   bg-slate-700 border-b-2 border-amber-400 text-amber-400
                   rounded-t focus:outline-none ${className}`}
        aria-label="Coefficient"
      />
    );
  }

  return (
    <span
      className={`coefficient text-lg font-bold text-amber-400
                 ${editable ? 'cursor-pointer hover:bg-slate-700 rounded px-1' : ''}
                 ${className}`}
      onClick={handleClick}
      title={editable ? 'Click to edit' : undefined}
    >
      {value}
    </span>
  );
}

export default CoefficientInput;
