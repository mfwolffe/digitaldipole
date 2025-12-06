import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Tabs Context for sharing state between Tab components
 */
const TabsContext = createContext(null);

/**
 * Tabs Container - manages tab state and provides URL sync capability
 *
 * @param {Object} props
 * @param {string} props.activeKey - Currently active tab key
 * @param {function} props.onSelect - Callback when tab is selected (receives tab key)
 * @param {string} props.className - Additional container classes
 * @param {React.ReactNode} props.children
 */
export function Tabs({ activeKey, onSelect, className = '', children }) {
  const [internalActiveKey, setInternalActiveKey] = useState(activeKey);

  // Use controlled or uncontrolled mode
  const currentKey = activeKey !== undefined ? activeKey : internalActiveKey;

  const handleSelect = useCallback((key) => {
    if (onSelect) {
      onSelect(key);
    } else {
      setInternalActiveKey(key);
    }
  }, [onSelect]);

  return (
    <TabsContext.Provider value={{ activeKey: currentKey, onSelect: handleSelect }}>
      <div className={`tabs-container ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

/**
 * TabList - container for Tab buttons, handles horizontal scrolling for many tabs
 */
export function TabList({ className = '', children }) {
  return (
    <div
      className={`flex border-b border-gray-200 overflow-x-auto scrollbar-thin ${className}`}
      role="tablist"
    >
      {children}
    </div>
  );
}

/**
 * Tab - individual tab button
 *
 * @param {Object} props
 * @param {string} props.eventKey - Unique key for this tab
 * @param {string} props.title - Tab button text/content
 * @param {boolean} props.disabled
 * @param {string} props.className
 */
export function Tab({ eventKey, title, disabled = false, className = '', children }) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('Tab must be used within a Tabs component');
  }

  const { activeKey, onSelect } = context;
  const isActive = activeKey === eventKey;

  const handleClick = () => {
    if (!disabled) {
      onSelect(eventKey);
    }
  };

  return (
    <>
      {/* Tab button - rendered in TabList */}
      {/* Tab content - rendered separately */}
    </>
  );
}

/**
 * TabButton - the clickable tab header
 */
export function TabButton({ eventKey, disabled = false, className = '', children }) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('TabButton must be used within a Tabs component');
  }

  const { activeKey, onSelect } = context;
  const isActive = activeKey === eventKey;

  const handleClick = () => {
    if (!disabled) {
      onSelect(eventKey);
    }
  };

  const baseClasses = 'px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500';

  const stateClasses = isActive
    ? 'bg-gray-200 text-gray-900 border border-gray-400 shadow-sm'
    : 'bg-gray-600 text-gray-200 hover:bg-gray-500 hover:text-white border border-transparent';

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      onClick={handleClick}
      className={`${baseClasses} ${stateClasses} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
}

/**
 * TabPanel - content container for a tab
 */
export function TabPanel({ eventKey, className = '', children }) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('TabPanel must be used within a Tabs component');
  }

  const { activeKey } = context;
  const isActive = activeKey === eventKey;

  if (!isActive) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      className={`animate-fade-in py-4 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Convenience component that combines TabList with TabButtons and TabPanels
 * Similar to react-bootstrap's Tabs API
 *
 * Usage:
 * <SimpleTabs
 *   activeKey={activeTab}
 *   onSelect={handleTabSelect}
 *   tabs={[
 *     { key: 'info', title: 'Info', content: <InfoComponent /> },
 *     { key: 'calc', title: 'Calculator', content: <CalcComponent /> },
 *   ]}
 * />
 */
export function SimpleTabs({ activeKey, onSelect, tabs, className = '', tabListClassName = '' }) {
  return (
    <Tabs activeKey={activeKey} onSelect={onSelect} className={className}>
      <TabList className={tabListClassName}>
        {tabs.map(({ key, title, disabled }) => (
          <TabButton key={key} eventKey={key} disabled={disabled}>
            {title}
          </TabButton>
        ))}
      </TabList>
      {tabs.map(({ key, content }) => (
        <TabPanel key={key} eventKey={key}>
          {content}
        </TabPanel>
      ))}
    </Tabs>
  );
}

export default Tabs;
