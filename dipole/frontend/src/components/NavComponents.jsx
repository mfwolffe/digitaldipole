import React, { useState } from "react";
import { NavLink as Link } from "react-router-dom";

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

import { all } from '@awesome.me/kit-a655910996/icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// the FA ico's with additional customization don't play well with SVG so png instead
import userIcon from '../assets/png/user-astronaut-light.png';
import userGear from '../assets/png/light-user-astronaut-gear.png';
import userLock from '../assets/png/light-user-astronaut-lock.png';
import userShield from '../assets/png/light-user-astronaut-shield.png';

import '../App.css'
import '../styles/hover.css'

library.add(...all)

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

export function SearchBar() {
  return (
    <Popover>
      <div className="relative w-64 sm:w-80 md:w-96">
        <PopoverTrigger className="w-full">
          <Input
            type="text"
            placeholder="Search"
            className="w-full pr-10"
            id="hdr-search"
          />
        </PopoverTrigger>
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity hvr-grow-rotate"
          style={{ background: 'transparent', border: 'none' }}
        >
          <FontAwesomeIcon icon="fa-duotone fa-magnifying-glass" style={icoStyle} />
        </button>
      </div>
      <PopoverContent position="bottom" align="center" className="w-80">
        <PopoverHeader className="flex items-center gap-2">
          <FontAwesomeIcon
            icon="fa-duotone fa-circle-info"
            size="lg"
            style={{
              "--fa-primary-color": "#78c9f2",
              "--fa-secondary-color": "#6d1aea",
            }}
          />
          Not sure what to search?
        </PopoverHeader>
        <PopoverBody>
          <ul className="space-y-2 text-sm">
            <li>
              Try the name of an element or molecule, like{' '}
              <strong><em>antimony</em></strong> or <strong><em>ammonia</em></strong>.
            </li>
            <li>
              or a class of calculators or references, like{' '}
              <strong><em>entropy calculator</em></strong> or{' '}
              <strong><em>acid/base ionization constant table</em></strong>.
            </li>
          </ul>
        </PopoverBody>
      </PopoverContent>
    </Popover>
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
