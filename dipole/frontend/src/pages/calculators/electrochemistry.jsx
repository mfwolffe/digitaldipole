import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { all } from '@awesome.me/kit-a655910996/icons';

import { CalculatorPage, InfoIcon } from "./CalculatorPage";

import {
  FaradayInfo,
  NernstInfo,
} from "../../components/CalcInfo";

library.add(...all);

const ElectrochemIcon = (
  <FontAwesomeIcon
    icon="fa-duotone fa-bolt"
    size="lg"
    style={{
      "--fa-secondary-color": "#fc6601",
      "--fa-primary-color": "#ffffff",
      "--fa-secondary-opacity": "1",
    }}
    className="pr-2 hvr-pulse-grow"
  />
);

/**
 * Electrochemistry overview for info tab
 */
function ElectrochemistryOverview() {
  return (
    <>
      <p className="text-left mb-3">
        <strong>Electrochemistry</strong> studies the relationship between electrical
        energy and chemical change. It encompasses both the generation of electricity
        from chemical reactions (galvanic cells) and the use of electricity to drive
        non-spontaneous reactions (electrolysis).
      </p>
      <p className="text-left mb-3">
        Key concepts include:
      </p>
      <ul className="text-left space-y-1 mb-4">
        <li><strong>Cell Potential</strong>: The driving force for electron flow</li>
        <li><strong>Standard Potentials</strong>: Reference values under standard conditions</li>
        <li><strong>Electrolysis</strong>: Using electricity to drive reactions</li>
      </ul>
      <p className="text-center mt-4">
        {"$$E^\\circ_{cell} = E^\\circ_{cathode} - E^\\circ_{anode}$$"}
      </p>
    </>
  );
}

/**
 * Electrochemical cells overview
 */
function CellsOverview() {
  return (
    <>
      <p className="text-left mb-3">
        Electrochemical cells convert between chemical and electrical energy through
        redox reactions occurring at separate electrodes connected by an external circuit.
      </p>
      <p className="text-left mb-3">
        The two main types are:
      </p>
      <ul className="text-left space-y-1 mb-4">
        <li><strong>Galvanic (Voltaic) Cells</strong>: Spontaneous reactions generate electricity</li>
        <li><strong>Electrolytic Cells</strong>: External electricity drives non-spontaneous reactions</li>
      </ul>
      <p className="text-left mt-4 text-sm text-gray-600">
        The Nernst equation relates cell potential to concentration, while Faraday's
        laws quantify the relationship between charge passed and mass deposited.
      </p>
    </>
  );
}

// Tab configuration
const TABS = [
  { key: 'info', title: 'Info' },
  { key: 'faraday', title: "Faraday's Law" },
  { key: 'nernst', title: 'Nernst Equation' },
];

// Calculator configurations
const CALCULATORS = {
  faraday: { Info: FaradayInfo, id: 'faraday' },
  nernst: { Info: NernstInfo, id: 'nernst' },
};

// Info tab configuration
const INFO_TAB = {
  Info1: ElectrochemistryOverview,
  Info2: CellsOverview,
  title1: 'Electrochemistry',
  title2: 'Electrochemical Cells',
  icon2: ElectrochemIcon,
};

/**
 * Electrochemistry Calculator Page
 */
const ElectrochemistryPage = () => {
  return (
    <CalculatorPage
      basePath="/calculators/electrochemistry"
      tabs={TABS}
      infoTab={INFO_TAB}
      calculators={CALCULATORS}
    />
  );
};

export default ElectrochemistryPage;
