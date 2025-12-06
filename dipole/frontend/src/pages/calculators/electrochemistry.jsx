import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Tab from "react-bootstrap/Tab";
import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Accordion from "react-bootstrap/Accordion";

import { Calculator } from "../../calculators";
import { electrochemistryInfo } from "../../calculators/registry";

import {
  FaradayInfo,
  NernstInfo,
} from "../../components/CalcInfo";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { all } from '@awesome.me/kit-a655910996/icons'

import "../../App.css";
import "../../styles/refs.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/bootstrap.min-dipole.css";

library.add(...all);

const RootIco = (
  <FontAwesomeIcon
    icon="fa-duotone fa-square-root-variable"
    size="lg"
    style={{
      "--fa-primary-color": "#ffffff",
      "--fa-secondary-color": "#fc6601",
      "--fa-secondary-opacity": "1",
    }}
    className="pr-2 hvr-bob"
  />
);

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

const InfoIcon = (
  <FontAwesomeIcon
    icon="fa-duotone fa-circle-info"
    size="lg"
    style={{
      "--fa-secondary-color": "#fc6601",
      "--fa-primary-color": "#ffffff",
      "--fa-secondary-opacity": "1",
    }}
    className="pr-2 hvr-buzz"
  />
);

/**
 * Accordion wrapper for info + calculator
 */
function CalculatorAccordion({ InfoComponent, calculatorId }) {
  return (
    <Accordion defaultActiveKey="0" className="ml-auto mr-auto mb-3 calc-acc">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          {InfoIcon}
          Info
        </Accordion.Header>
        <Accordion.Body>
          <InfoComponent />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>
          {RootIco}
          Calculator
        </Accordion.Header>
        <Accordion.Body>
          <Calculator calculatorId={calculatorId} />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

/**
 * Info-only accordion (for the main info tab)
 */
function InfoAccordion({ Info1, Info2, title1, title2 }) {
  return (
    <Accordion defaultActiveKey="0" className="ml-auto mr-auto mb-3 calc-acc">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          {InfoIcon}
          {title1}
        </Accordion.Header>
        <Accordion.Body>
          <Info1 />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>
          {ElectrochemIcon}
          {title2}
        </Accordion.Header>
        <Accordion.Body>
          <Info2 />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

/**
 * Electrochemistry overview for info tab
 */
function ElectrochemistryOverview() {
  return (
    <>
      <p className="text-start mb-2">
        <strong>Electrochemistry</strong> studies the relationship between electrical
        energy and chemical change. It encompasses both the generation of electricity
        from chemical reactions (galvanic cells) and the use of electricity to drive
        non-spontaneous reactions (electrolysis).
      </p>
      <p className="text-start mb-2">
        Key concepts include:
      </p>
      <ul className="text-start">
        <li><strong>Cell Potential</strong>: The driving force for electron flow</li>
        <li><strong>Standard Potentials</strong>: Reference values under standard conditions</li>
        <li><strong>Electrolysis</strong>: Using electricity to drive reactions</li>
      </ul>
      <p className="text-center mt-3">
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
      <p className="text-start mb-2">
        Electrochemical cells convert between chemical and electrical energy through
        redox reactions occurring at separate electrodes connected by an external circuit.
      </p>
      <p className="text-start mb-2">
        The two main types are:
      </p>
      <ul className="text-start">
        <li><strong>Galvanic (Voltaic) Cells</strong>: Spontaneous reactions generate electricity</li>
        <li><strong>Electrolytic Cells</strong>: External electricity drives non-spontaneous reactions</li>
      </ul>
      <p className="text-start mt-3">
        The Nernst equation relates cell potential to concentration, while Faraday's
        laws quantify the relationship between charge passed and mass deposited.
      </p>
    </>
  );
}

// Valid tab keys for this page
const VALID_TABS = ['info', 'faraday', 'nernst'];

/**
 * Electrochemistry Calculator Page
 *
 * Uses the new client-side calculator system with Nerdamer.js
 * URL structure: /calculators/electrochemistry/:tab?
 */
const ElectrochemistryPage = () => {
  const { tab } = useParams();
  const navigate = useNavigate();

  // Determine active tab from URL param, default to 'info'
  const activeTab = VALID_TABS.includes(tab) ? tab : 'info';

  // Handle tab selection - update URL
  const handleTabSelect = (selectedTab) => {
    if (selectedTab === 'info') {
      navigate('/calculators/electrochemistry');
    } else {
      navigate(`/calculators/electrochemistry/${selectedTab}`);
    }
  };

  // Re-render MathJax when tab changes
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetClear();
      window.MathJax.typeset();
    }
  }, [activeTab]);

  return (
    <div className="landing-container mt-3">
      <div className="landing mt-0">
        <Card className="mt-5 m-auto gl-calc" id="ref-default">
          <Tabs
            activeKey={activeTab}
            onSelect={handleTabSelect}
            id="electrochemistry-tabs"
            className="mb-3 mt-1 calc-tabs"
          >
            <Tab eventKey="info" className="calc-tab" title="Info">
              <InfoAccordion
                Info1={ElectrochemistryOverview}
                Info2={CellsOverview}
                title1="Electrochemistry"
                title2="Electrochemical Cells"
              />
            </Tab>

            <Tab eventKey="faraday" className="calc-tab" title="Faraday's Law">
              <CalculatorAccordion
                InfoComponent={FaradayInfo}
                calculatorId="faraday"
              />
            </Tab>

            <Tab eventKey="nernst" className="calc-tab" title="Nernst Equation">
              <CalculatorAccordion
                InfoComponent={NernstInfo}
                calculatorId="nernst"
              />
            </Tab>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ElectrochemistryPage;
