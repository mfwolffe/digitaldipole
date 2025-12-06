import React from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react';

/**
 * Collapse - simple collapsible content area
 * Controlled version that works with external state
 */
export function Collapse({ open, className = '', children }) {
  return (
    <div
      className={`
        overflow-hidden transition-all duration-300 ease-in-out
        ${open ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/**
 * CollapseToggle - button that toggles collapse state
 */
export function CollapseToggle({
  open,
  onToggle,
  className = '',
  children,
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className={`flex items-center gap-2 ${className}`}
    >
      {children}
      <svg
        className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

/**
 * UncontrolledCollapse - self-managing collapsible using Headless UI Disclosure
 */
export function UncontrolledCollapse({
  defaultOpen = false,
  buttonContent,
  buttonClassName = '',
  panelClassName = '',
  children,
}) {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <>
          <DisclosureButton
            className={`flex items-center gap-2 ${buttonClassName}`}
          >
            {buttonContent}
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </DisclosureButton>
          <Transition
            enter="transition duration-200 ease-out"
            enterFrom="transform opacity-0 -translate-y-2"
            enterTo="transform opacity-100 translate-y-0"
            leave="transition duration-150 ease-in"
            leaveFrom="transform opacity-100 translate-y-0"
            leaveTo="transform opacity-0 -translate-y-2"
          >
            <DisclosurePanel className={panelClassName}>
              {children}
            </DisclosurePanel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}

export default Collapse;
