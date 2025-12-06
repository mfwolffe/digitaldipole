import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Tab from "react-bootstrap/Tab";
import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Accordion from "react-bootstrap/Accordion";

import { Calculator } from "../../calculators";
import { kineticsInfo } from "../../calculators/registry";

import {
  ArrheniusInfo,
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

const KineticsIcon = (
  <FontAwesomeIcon
    icon="fa-duotone fa-chart-line"
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
function InfoAccordion({ Info1, title1 }) {
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
    </Accordion>
  );
}

/**
 * Kinetics overview for info tab
 */
function KineticsOverview() {
  return (
    <>
      <p className="text-left mb-2">
        <strong>Chemical kinetics</strong> is the study of reaction rates — how fast reactants
        are consumed and products are formed. Understanding kinetics helps predict reaction
        timescales and design efficient processes.
      </p>
      <p className="text-left mb-2">
        Key concepts include:
      </p>
      <ul className="text-left">
        <li><strong>Rate Laws</strong>: Mathematical expressions relating rate to concentrations</li>
        <li><strong>Rate Constants</strong>: Temperature-dependent proportionality factors</li>
        <li><strong>Activation Energy</strong>: Energy barrier that must be overcome for reaction</li>
        <li><strong>Half-Life</strong>: Time for concentration to decrease by half</li>
      </ul>
      <p className="text-center mt-3">
        {"$$\\text{rate} = k[A]^m[B]^n$$"}
      </p>
      <p className="text-center text-muted">
        where {"\\(k\\)"} is the rate constant and {"\\(m, n\\)"} are reaction orders.
      </p>
    </>
  );
}

// Valid tab keys for this page
const VALID_TABS = ['info', 'arrhenius', 'halfLife', 'secondOrder'];

/**
 * Kinetics Calculator Page
 *
 * Uses the new client-side calculator system with Nerdamer.js
 * URL structure: /calculators/kinetics/:tab?
 */
const KineticsPage = () => {
  const { tab } = useParams();
  const navigate = useNavigate();

  // Determine active tab from URL param, default to 'info'
  const activeTab = VALID_TABS.includes(tab) ? tab : 'info';

  // Handle tab selection - update URL
  const handleTabSelect = (selectedTab) => {
    if (selectedTab === 'info') {
      navigate('/calculators/kinetics');
    } else {
      navigate(`/calculators/kinetics/${selectedTab}`);
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
            id="kinetics-tabs"
            className="mb-3 mt-1 calc-tabs"
          >
            <Tab eventKey="info" className="calc-tab" title="Info">
              <InfoAccordion
                Info1={KineticsOverview}
                title1="Chemical Kinetics"
              />
            </Tab>

            <Tab eventKey="arrhenius" className="calc-tab" title="Arrhenius Equation">
              <CalculatorAccordion
                InfoComponent={ArrheniusInfo}
                calculatorId="arrhenius"
              />
            </Tab>

            <Tab eventKey="halfLife" className="calc-tab" title="Half-Life">
              <CalculatorAccordion
                InfoComponent={ArrheniusInfo}
                calculatorId="halfLife"
              />
            </Tab>

            <Tab eventKey="secondOrder" className="calc-tab" title="Second Order">
              <CalculatorAccordion
                InfoComponent={ArrheniusInfo}
                calculatorId="secondOrder"
              />
            </Tab>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default KineticsPage;
