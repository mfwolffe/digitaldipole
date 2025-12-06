import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { NavLink as Link, useNavigate } from "react-router-dom";

import {
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownHeader,
  Collapse,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
} from './ui';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fuzzySearch, highlightMatches } from '../utils/fuzzySearch';
import { getSearchIndex } from '../utils/searchIndex';

// the FA ico's with additional customization don't play well with SVG so png instead
import userIcon from '../assets/png/user-astronaut-light.png';
import userGear from '../assets/png/light-user-astronaut-gear.png';
import userLock from '../assets/png/light-user-astronaut-lock.png';
import userShield from '../assets/png/light-user-astronaut-shield.png';

import '../App.css'
import '../styles/hover.css'

const usrIcon = (
  <FontAwesomeIcon
    icon="fa-duotone fa-user-astronaut"
    size="2xl"
    className="usr-ico text-accent-500"
  />
);

const icoStyle = {
  fontSize: "1.7rem"
};

const refIcon = (
  <>
    <FontAwesomeIcon
      icon="fa-duotone fa-book-bookmark"
      size="xl"
      style={{
        "--fa-secondary-color": "#578be5",
        "--fa-primary-color": "#143671",
      }}
      className="w-6 shrink-0"
    />
    <span className="text-gray-900 font-medium">References</span>
  </>
);

const calcIcon = (
  <>
    <FontAwesomeIcon
      icon="fa-duotone fa-calculator"
      size="xl"
      style={{
        "--fa-secondary-color": "#578be5",
        "--fa-primary-color": "#143671",
      }}
      className="w-6 shrink-0"
    />
    <span className="text-gray-900 font-medium">Calculators</span>
  </>
);

// Icon component for search results
function SearchResultIcon({ type }) {
  const iconProps = {
    calculator: {
      icon: "fa-duotone fa-calculator",
      style: { "--fa-primary-color": "#143671", "--fa-secondary-color": "#578be5" }
    },
    element: {
      icon: "fa-duotone fa-atom",
      style: { "--fa-primary-color": "#059669", "--fa-secondary-color": "#34d399" }
    },
    page: {
      icon: "fa-duotone fa-file-lines",
      style: { "--fa-primary-color": "#7c3aed", "--fa-secondary-color": "#a78bfa" }
    },
  };

  const props = iconProps[type] || iconProps.page;

  return (
    <FontAwesomeIcon
      icon={props.icon}
      className="w-4 h-4 shrink-0"
      style={props.style}
    />
  );
}

// Highlighted text component
function HighlightedText({ query, text }) {
  const segments = highlightMatches(query, text);
  return (
    <>
      {segments.map((seg, i) =>
        seg.highlight ? (
          <mark key={i} className="bg-yellow-200 text-gray-900 rounded px-0.5">
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </>
  );
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Get search index once
  const searchIndex = useMemo(() => getSearchIndex(), []);

  // Perform fuzzy search
  const results = useMemo(() => {
    if (!query || query.length < 1) return [];
    return fuzzySearch(query, searchIndex, {
      keys: ['name', 'symbol', 'keywords', 'category'],
      threshold: 15,
      limit: 12,
    });
  }, [query, searchIndex]);

  // Group results by type
  const groupedResults = useMemo(() => {
    const groups = {
      calculator: [],
      element: [],
      page: [],
    };
    results.forEach(r => {
      if (groups[r.item.type]) {
        groups[r.item.type].push(r);
      }
    });
    return groups;
  }, [results]);

  // Flat list for keyboard navigation
  const flatResults = useMemo(() => results.map(r => r.item), [results]);

  // Handle navigation to result
  const navigateToResult = useCallback((item) => {
    navigate(item.path);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  }, [navigate]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen || flatResults.length === 0) {
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % flatResults.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + flatResults.length) % flatResults.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (flatResults[selectedIndex]) {
          navigateToResult(flatResults[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  }, [isOpen, flatResults, selectedIndex, navigateToResult]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const selected = dropdownRef.current.querySelector('[data-selected="true"]');
      if (selected) {
        selected.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, isOpen]);

  const hasResults = results.length > 0;
  const showDropdown = isOpen && query.length >= 1;

  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search calculators, elements..."
          id="hdr-search"
          className="w-72 sm:w-80 md:w-96 pr-8"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            if (!query) setShowHelp(true);
          }}
          onBlur={() => {
            // Delay to allow click on results
            setTimeout(() => setShowHelp(false), 200);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-controls="search-results"
        />
        {query && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
          >
            <FontAwesomeIcon icon="fa-solid fa-xmark" className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          id="search-results"
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 max-h-96 overflow-y-auto"
        >
          {hasResults ? (
            <div className="py-2">
              {/* Calculators Section */}
              {groupedResults.calculator.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                    Calculators
                  </div>
                  {groupedResults.calculator.map((result, idx) => {
                    const globalIdx = flatResults.indexOf(result.item);
                    return (
                      <button
                        key={result.item.id}
                        role="option"
                        aria-selected={selectedIndex === globalIdx}
                        data-selected={selectedIndex === globalIdx}
                        className={`w-full px-3 py-2 flex items-center gap-3 text-left transition-colors ${
                          selectedIndex === globalIdx
                            ? 'bg-gray-100 text-gray-900 font-semibold'
                            : 'hover:bg-gray-50 text-gray-900'
                        }`}
                        onClick={() => navigateToResult(result.item)}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                      >
                        <SearchResultIcon type="calculator" />
                        <div className="flex-1 min-w-0">
                          <div className="truncate">
                            <HighlightedText query={query} text={result.item.name} />
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {result.item.subtitle}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Elements Section */}
              {groupedResults.element.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                    Elements
                  </div>
                  {groupedResults.element.map((result) => {
                    const globalIdx = flatResults.indexOf(result.item);
                    return (
                      <button
                        key={result.item.id}
                        role="option"
                        aria-selected={selectedIndex === globalIdx}
                        data-selected={selectedIndex === globalIdx}
                        className={`w-full px-3 py-2 flex items-center gap-3 text-left transition-colors ${
                          selectedIndex === globalIdx
                            ? 'bg-gray-100 text-gray-900 font-semibold'
                            : 'hover:bg-gray-50 text-gray-900'
                        }`}
                        onClick={() => navigateToResult(result.item)}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                      >
                        <SearchResultIcon type="element" />
                        <div className="flex-1 min-w-0">
                          <div className="truncate">
                            <HighlightedText query={query} text={result.item.name} />
                            <span className="ml-2 text-sm text-gray-500">
                              ({result.item.symbol})
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            Atomic #{result.item.atomicNumber}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Pages Section */}
              {groupedResults.page.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                    Pages
                  </div>
                  {groupedResults.page.map((result) => {
                    const globalIdx = flatResults.indexOf(result.item);
                    return (
                      <button
                        key={result.item.id}
                        role="option"
                        aria-selected={selectedIndex === globalIdx}
                        data-selected={selectedIndex === globalIdx}
                        className={`w-full px-3 py-2 flex items-center gap-3 text-left transition-colors ${
                          selectedIndex === globalIdx
                            ? 'bg-gray-100 text-gray-900 font-semibold'
                            : 'hover:bg-gray-50 text-gray-900'
                        }`}
                        onClick={() => navigateToResult(result.item)}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                      >
                        <SearchResultIcon type="page" />
                        <div className="flex-1 min-w-0">
                          <div className="truncate">
                            <HighlightedText query={query} text={result.item.name} />
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {result.item.subtitle}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Keyboard hint */}
              <div className="px-3 py-2 text-xs text-gray-400 border-t border-gray-100 flex items-center gap-4">
                <span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">↑↓</kbd> navigate</span>
                <span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">↵</kbd> select</span>
                <span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">esc</kbd> close</span>
              </div>
            </div>
          ) : query.length >= 1 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <FontAwesomeIcon
                icon="fa-duotone fa-face-thinking"
                size="2x"
                className="mb-2 text-gray-300"
              />
              <p className="text-sm">No results for "<strong>{query}</strong>"</p>
              <p className="text-xs mt-1">Try searching for an element name or calculator type</p>
            </div>
          ) : null}
        </div>
      )}

      {/* Help popover when empty and focused */}
      {showHelp && !query && isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-4">
          <div className="flex items-center gap-2 font-medium text-gray-900 mb-2">
            <FontAwesomeIcon
              icon="fa-duotone fa-circle-info"
              style={{
                "--fa-primary-color": "#78c9f2",
                "--fa-secondary-color": "#6d1aea",
              }}
            />
            Quick Search Tips
          </div>
          <ul className="space-y-1.5 text-sm text-gray-600">
            <li>
              <strong>Elements:</strong> Try <em>hydrogen</em>, <em>Fe</em>, or <em>carbon</em>
            </li>
            <li>
              <strong>Calculators:</strong> Try <em>ideal gas</em>, <em>entropy</em>, or <em>molarity</em>
            </li>
            <li>
              <strong>Topics:</strong> Try <em>thermodynamics</em> or <em>kinetics</em>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export function UserDrop() {
  return (
    <Dropdown>
      <DropdownTrigger className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
        {usrIcon}
      </DropdownTrigger>
      <DropdownMenu align="end">
        <DropdownHeader>
          <div className="flex items-center gap-2">
            <img src={userIcon} width="24" alt="" />
            <strong>{typeof username !== 'undefined' ? username : 'Guest'}</strong>
          </div>
        </DropdownHeader>
        <DropdownItem className="hvr-underline-from-left">
          <img src={userGear} width="24" alt="" />
          Settings
        </DropdownItem>
        <DropdownItem className="hvr-underline-from-left">
          <img src={userShield} width="24" alt="" />
          Privacy
        </DropdownItem>
        <DropdownItem className="hvr-underline-from-left">
          <img src={userLock} width="24" alt="" />
          Sign out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export function OffCDropRef({ onNavigate }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (onNavigate) onNavigate();
  };

  return (
    <div className="py-1">
      <button
        onClick={() => setOpen(!open)}
        aria-controls="ref-dropdown"
        aria-expanded={open}
        className="flex items-center gap-3 w-full text-left py-3 px-2 rounded-lg text-gray-900 font-medium hover:bg-gray-100 transition-colors"
      >
        {refIcon}
        <svg
          className={`h-4 w-4 ml-auto transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <Collapse open={open}>
        <ul id="ref-dropdown" className="ml-6 mt-2 space-y-1 border-l-2 border-primary-400 pl-4 py-2 bg-gray-100 rounded-r-lg shadow-inner">
          <li>
            <Link
              to="/tabulated"
              onClick={handleClick}
              className="block py-2 px-2 font-medium hover:bg-white rounded transition-colors"
              style={{ color: '#111827' }}
            >
              Tabulated Data
            </Link>
          </li>
          <li>
            <span className="block py-2 px-2 font-medium hover:bg-white rounded transition-colors cursor-pointer" style={{ color: '#111827' }}>
              Periodic Tables
            </span>
          </li>
          <li>
            <span className="block py-2 px-2 font-medium hover:bg-white rounded transition-colors cursor-pointer" style={{ color: '#111827' }}>
              Conversion Factors
            </span>
          </li>
          <li>
            <span className="block py-2 px-2 font-medium hover:bg-white rounded transition-colors cursor-pointer" style={{ color: '#111827' }}>
              Fundamental Constants
            </span>
          </li>
          <li>
            <span className="block py-2 px-2 font-medium hover:bg-white rounded transition-colors cursor-pointer" style={{ color: '#111827' }}>
              Common Equations
            </span>
          </li>
        </ul>
      </Collapse>
    </div>
  );
}

export function OffCDropCalc({ onNavigate }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (onNavigate) onNavigate();
  };

  return (
    <div className="py-1">
      <button
        onClick={() => setOpen(!open)}
        aria-controls="calc-dropdown"
        aria-expanded={open}
        className="flex items-center gap-3 w-full text-left py-3 px-2 rounded-lg text-gray-900 font-medium hover:bg-gray-100 transition-colors"
      >
        {calcIcon}
        <svg
          className={`h-4 w-4 ml-auto transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <Collapse open={open}>
        <ul id="calc-dropdown" className="ml-6 mt-2 space-y-1 border-l-2 border-primary-400 pl-4 py-2 bg-gray-100 rounded-r-lg shadow-inner">
          <li>
            <Link
              to="/calculators/gas-laws"
              onClick={handleClick}
              className="block py-2 px-2 font-medium hover:bg-white rounded transition-colors"
              style={{ color: '#111827' }}
            >
              Gas Laws (Ideal)
            </Link>
          </li>
          <li>
            <Link
              to="/calculators/thermo"
              onClick={handleClick}
              className="block py-2 px-2 font-medium hover:bg-white rounded transition-colors"
              style={{ color: '#111827' }}
            >
              Thermodynamics
            </Link>
          </li>
          <li>
            <Link
              to="/calculators/kinetics"
              onClick={handleClick}
              className="block py-2 px-2 font-medium hover:bg-white rounded transition-colors"
              style={{ color: '#111827' }}
            >
              Kinetics
            </Link>
          </li>
          <li>
            <Link
              to="/calculators/solutions"
              onClick={handleClick}
              className="block py-2 px-2 font-medium hover:bg-white rounded transition-colors"
              style={{ color: '#111827' }}
            >
              Solutions
            </Link>
          </li>
          <li>
            <Link
              to="/calculators/electrochemistry"
              onClick={handleClick}
              className="block py-2 px-2 font-medium hover:bg-white rounded transition-colors"
              style={{ color: '#111827' }}
            >
              Electrochemistry
            </Link>
          </li>
        </ul>
      </Collapse>
    </div>
  );
}
