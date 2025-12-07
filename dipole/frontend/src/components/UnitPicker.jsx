/**
 * UnitPicker Component
 *
 * Inline popover for selecting units. Clicking on a unit displays a dropdown
 * of compatible units that the user can select from.
 */
import React, { Fragment } from 'react';
import { Popover as HeadlessPopover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { getUnit } from '../units/index.js';

/**
 * UnitPicker - clickable unit label with dropdown selection
 *
 * @param {string} currentUnit - The currently selected unit ID
 * @param {Array} compatibleUnits - Array of unit objects that can be selected
 * @param {Function} onChange - Callback when unit is changed: (unitId) => void
 * @param {string} className - Additional CSS classes for the trigger button
 * @param {boolean} disabled - Whether the picker is disabled
 */
export function UnitPicker({
  currentUnit,
  compatibleUnits = [],
  onChange,
  className = '',
  disabled = false,
}) {
  const unit = getUnit(currentUnit);

  // If no unit or no compatible units, just display the unit statically
  if (!unit || compatibleUnits.length <= 1 || disabled) {
    return (
      <span className={`font-mono text-sm ${className}`}>
        {unit?.symbol || currentUnit || '—'}
      </span>
    );
  }

  return (
    <HeadlessPopover className="relative inline-block">
      <PopoverButton
        className={`
          font-mono text-sm px-1.5 py-0.5 rounded
          hover:bg-indigo-100 hover:text-indigo-700
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1
          cursor-pointer transition-colors
          ${className}
        `}
        title="Click to change unit"
      >
        {unit.symbol}
        <span className="ml-0.5 text-xs opacity-60">▼</span>
      </PopoverButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <PopoverPanel
          className="
            absolute z-20 mt-1 w-56 origin-top-left
            rounded-lg bg-white shadow-lg ring-1 ring-black/10
            max-h-64 overflow-y-auto
          "
        >
          {({ close }) => (
            <div className="py-1">
              {compatibleUnits.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    onChange(u.id);
                    close();
                  }}
                  className={`
                    w-full text-left px-3 py-2 text-sm
                    hover:bg-indigo-50 transition-colors
                    flex items-center justify-between
                    ${u.id === currentUnit ? 'bg-indigo-100 text-indigo-900' : 'text-gray-700'}
                  `}
                >
                  <span>
                    <span className="font-mono font-medium">{u.symbol}</span>
                    <span className="ml-2 text-gray-500">{u.name}</span>
                  </span>
                  {u.id === currentUnit && (
                    <span className="text-indigo-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </PopoverPanel>
      </Transition>
    </HeadlessPopover>
  );
}

/**
 * UnitLabel - simple display of a unit (non-interactive)
 */
export function UnitLabel({ unitId, className = '' }) {
  const unit = getUnit(unitId);
  return (
    <span className={`font-mono text-sm ${className}`}>
      {unit?.symbol || unitId || '—'}
    </span>
  );
}

export default UnitPicker;
