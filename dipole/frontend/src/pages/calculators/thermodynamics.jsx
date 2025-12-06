import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Tab from "react-bootstrap/Tab";
import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Accordion from "react-bootstrap/Accordion";

import { Calculator } from "../../calculators";
import { thermodynamicsInfo } from "../../calculators/registry";

import {
  ThermInfo1,
  ThermInfo2,
  StateHeat,
  EntropyInfo,
  GibbsInfo,
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

const ThermCurv = (
  <FontAwesomeIcon
    icon="fa-duotone fa-fire-flame-curved"
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
          {ThermCurv}
          {title2}
        </Accordion.Header>
        <Accordion.Body>
          <Info2 />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

// Valid tab keys for this page
const VALID_TABS = ['info', 'enthalpy', 'heat', 'gibbs'];

/**
 * Thermodynamics Calculator Page
 *
 * Uses the new client-side calculator system with Nerdamer.js
 * URL structure: /calculators/thermo/:tab?
 */
const ThermodynamicsPage = () => {
  const { tab } = useParams();
  const navigate = useNavigate();

  // Determine active tab from URL param, default to 'info'
  const activeTab = VALID_TABS.includes(tab) ? tab : 'info';

  // Handle tab selection - update URL
  const handleTabSelect = (selectedTab) => {
    if (selectedTab === 'info') {
      navigate('/calculators/thermo');
    } else {
      navigate(`/calculators/thermo/${selectedTab}`);
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
            id="thermodynamics-tabs"
            className="mb-3 mt-1 calc-tabs"
          >
            <Tab eventKey="info" className="calc-tab" title="Info">
              <InfoAccordion
                Info1={ThermInfo1}
                Info2={ThermInfo2}
                title1="Thermodynamics"
                title2="Laws of Thermodynamics"
              />
            </Tab>

            <Tab eventKey="enthalpy" className="calc-tab" title="Enthalpy Calculator">
              <CalculatorAccordion
                InfoComponent={StateHeat}
                calculatorId="enthalpy"
              />
            </Tab>

            <Tab eventKey="heat" className="calc-tab" title="Heat Transfer">
              <CalculatorAccordion
                InfoComponent={StateHeat}
                calculatorId="heat"
              />
            </Tab>

            <Tab eventKey="gibbs" className="calc-tab" title="Gibbs Free Energy">
              <CalculatorAccordion
                InfoComponent={GibbsInfo}
                calculatorId="gibbs"
              />
            </Tab>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ThermodynamicsPage;
