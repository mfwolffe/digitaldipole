import React, { Fragment } from 'react';
import { Popover as HeadlessPopover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';

/**
 * Popover - floating content panel triggered by a button
 */
export function Popover({ className = '', children }) {
  return (
    <HeadlessPopover className={`relative ${className}`}>
      {children}
    </HeadlessPopover>
  );
}

/**
 * PopoverTrigger - the element that triggers the popover
 */
export function PopoverTrigger({ className = '', children, ...props }) {
  return (
    <PopoverButton className={className} {...props}>
      {children}
    </PopoverButton>
  );
}

/**
 * PopoverContent - the floating panel
 */
export function PopoverContent({
  position = 'bottom',
  align = 'center',
  className = '',
  children,
}) {
  // Position classes
  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  // Alignment classes
  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  };

  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-1"
    >
      <PopoverPanel
        className={`
          absolute z-10 w-72
          rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5
          ${positionClasses[position] || positionClasses.bottom}
          ${alignClasses[align] || alignClasses.center}
          ${className}
        `}
      >
        {children}
      </PopoverPanel>
    </Transition>
  );
}

/**
 * PopoverHeader - header section of the popover
 */
export function PopoverHeader({ className = '', children }) {
  return (
    <div className={`px-4 py-3 border-b border-gray-100 font-medium text-gray-900 ${className}`}>
      {children}
    </div>
  );
}

/**
 * PopoverBody - main content area
 */
export function PopoverBody({ className = '', children }) {
  return (
    <div className={`px-4 py-3 text-sm text-gray-600 ${className}`}>
      {children}
    </div>
  );
}

export default Popover;
