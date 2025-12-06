import React, { Fragment } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';

/**
 * Dropdown - menu triggered by a button
 */
export function Dropdown({ className = '', children }) {
  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      {children}
    </Menu>
  );
}

/**
 * DropdownTrigger - the button that opens the menu
 */
export function DropdownTrigger({ className = '', children, ...props }) {
  return (
    <MenuButton
      className={`inline-flex items-center justify-center ${className}`}
      {...props}
    >
      {children}
    </MenuButton>
  );
}

/**
 * DropdownMenu - the menu container
 */
export function DropdownMenu({
  align = 'end',
  className = '',
  children,
}) {
  const alignmentClasses = align === 'start' ? 'left-0' : 'right-0';

  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <MenuItems
        className={`
          absolute z-10 mt-2 w-56 origin-top-right
          rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5
          focus:outline-none
          ${alignmentClasses} ${className}
        `}
      >
        <div className="py-1">
          {children}
        </div>
      </MenuItems>
    </Transition>
  );
}

/**
 * DropdownItem - individual menu item
 */
export function DropdownItem({
  as: Component = 'button',
  disabled = false,
  className = '',
  children,
  ...props
}) {
  return (
    <MenuItem disabled={disabled}>
      {({ active, disabled: isDisabled }) => (
        <Component
          className={`
            flex w-full items-center gap-2 px-4 py-2 text-sm
            ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}
            ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}
          `}
          disabled={isDisabled}
          {...props}
        >
          {children}
        </Component>
      )}
    </MenuItem>
  );
}

/**
 * DropdownHeader - non-interactive header text
 */
export function DropdownHeader({ className = '', children }) {
  return (
    <div className={`px-4 py-2 text-xs font-semibold text-gray-500 uppercase ${className}`}>
      {children}
    </div>
  );
}

/**
 * DropdownDivider - separator line
 */
export function DropdownDivider() {
  return <div className="my-1 border-t border-gray-100" />;
}

export default Dropdown;
