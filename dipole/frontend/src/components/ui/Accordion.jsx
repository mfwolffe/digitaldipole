import React, { createContext, useContext, useState, useCallback, useId } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react';

/**
 * Accordion Context for managing which items are open
 */
const AccordionContext = createContext(null);

/**
 * Accordion Container
 *
 * @param {Object} props
 * @param {string|string[]} props.defaultActiveKey - Initially open item(s)
 * @param {boolean} props.allowMultiple - Allow multiple items open at once
 * @param {string} props.className
 */
export function Accordion({
  defaultActiveKey,
  allowMultiple = false,
  className = '',
  children
}) {
  const [openKeys, setOpenKeys] = useState(() => {
    if (!defaultActiveKey) return new Set();
    if (Array.isArray(defaultActiveKey)) return new Set(defaultActiveKey);
    return new Set([defaultActiveKey]);
  });

  const toggleItem = useCallback((key) => {
    setOpenKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(key);
      }
      return next;
    });
  }, [allowMultiple]);

  const isOpen = useCallback((key) => openKeys.has(key), [openKeys]);

  return (
    <AccordionContext.Provider value={{ toggleItem, isOpen }}>
      <div className={`divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

/**
 * AccordionItem - individual collapsible section
 *
 * @param {Object} props
 * @param {string} props.eventKey - Unique key for this item
 * @param {string} props.className
 */
export function AccordionItem({ eventKey, className = '', children }) {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error('AccordionItem must be used within an Accordion');
  }

  const { toggleItem, isOpen } = context;
  const open = isOpen(eventKey);
  const headerId = useId();
  const panelId = useId();

  return (
    <div className={`accordion-item ${className}`}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            _eventKey: eventKey,
            _open: open,
            _toggle: () => toggleItem(eventKey),
            _headerId: headerId,
            _panelId: panelId,
          });
        }
        return child;
      })}
    </div>
  );
}

/**
 * AccordionHeader - clickable header that toggles the panel
 */
export function AccordionHeader({
  className = '',
  children,
  _eventKey,
  _open,
  _toggle,
  _headerId,
  _panelId,
}) {
  return (
    <h3 className="m-0">
      <button
        type="button"
        id={_headerId}
        aria-expanded={_open}
        aria-controls={_panelId}
        onClick={_toggle}
        className={`
          flex w-full items-center justify-between px-4 py-4
          text-left text-base font-medium text-gray-900
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500
          transition-colors duration-200
          ${className}
        `}
      >
        <span className="flex items-center gap-2">{children}</span>
        <ChevronIcon open={_open} />
      </button>
    </h3>
  );
}

/**
 * AccordionBody - collapsible content area
 */
export function AccordionBody({
  className = '',
  children,
  _open,
  _headerId,
  _panelId,
}) {
  return (
    <div
      id={_panelId}
      role="region"
      aria-labelledby={_headerId}
      className={`
        overflow-hidden transition-all duration-300 ease-in-out
        ${_open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
      `}
    >
      <div className={`px-4 py-4 text-gray-700 ${className}`}>
        {children}
      </div>
    </div>
  );
}

/**
 * Chevron icon that rotates when open
 */
function ChevronIcon({ open }) {
  return (
    <svg
      className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

/**
 * SimpleAccordion - convenience component for simpler use cases
 *
 * Usage:
 * <SimpleAccordion
 *   defaultActiveKey="0"
 *   items={[
 *     { key: '0', header: 'Info', icon: <InfoIcon />, content: <InfoContent /> },
 *     { key: '1', header: 'Calculator', icon: <CalcIcon />, content: <CalcContent /> },
 *   ]}
 * />
 */
export function SimpleAccordion({ defaultActiveKey, allowMultiple = false, items, className = '' }) {
  return (
    <Accordion defaultActiveKey={defaultActiveKey} allowMultiple={allowMultiple} className={className}>
      {items.map(({ key, header, icon, content }) => (
        <AccordionItem key={key} eventKey={key}>
          <AccordionHeader>
            {icon}
            {header}
          </AccordionHeader>
          <AccordionBody>
            {content}
          </AccordionBody>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default Accordion;
