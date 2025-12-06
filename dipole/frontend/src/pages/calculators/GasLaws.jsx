import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Tab from "react-bootstrap/Tab";
import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Accordion from "react-bootstrap/Accordion";

import { Calculator } from "../../calculators";
import { gasLawsInfo } from "../../calculators/registry";

import {
  AvoInfo,
  AmontonInfo,
  BoyleInfo,
  CharlesInfo,
  CombinedInfo,
  IdealInfo,
  GasDensityInfo,
  GrahamInfo,
  DaltonInfo,
  GenInfo1,
  GenInfo2,
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

const IdealGas = (
  <FontAwesomeIcon
    icon="fa-duotone fa-wind"
    size="lg"
    style={{
      "--fa-secondary-color": "#ffffff",
      "--fa-primary-color": "#fc6601",
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
          {IdealGas}
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
const VALID_TABS = ['info', 'avogadro', 'amonton', 'boyle', 'charles', 'combined', 'ideal', 'density', 'graham', 'dalton'];

/**
 * Gas Laws Calculator Page
 *
 * Uses the new client-side calculator system with Nerdamer.js
 * URL structure: /calculators/gas-laws/:tab?
 */
const GasLawsPage = () => {
  const { tab } = useParams();
  const navigate = useNavigate();

  // Determine active tab from URL param, default to 'info'
  const activeTab = VALID_TABS.includes(tab) ? tab : 'info';

  // Handle tab selection - update URL
  const handleTabSelect = (selectedTab) => {
    if (selectedTab === 'info') {
      navigate('/calculators/gas-laws');
    } else {
      navigate(`/calculators/gas-laws/${selectedTab}`);
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
            id="gas-laws-tabs"
            className="mb-3 mt-1 calc-tabs"
          >
            <Tab eventKey="info" className="calc-tab" title="Info">
              <InfoAccordion
                Info1={GenInfo1}
                Info2={GenInfo2}
                title1="Gas Laws"
                title2="Ideal Gases"
              />
            </Tab>

            <Tab eventKey="avogadro" className="calc-tab" title="Avogadro's Law">
              <CalculatorAccordion
                InfoComponent={AvoInfo}
                calculatorId="avogadro"
              />
            </Tab>

            <Tab eventKey="amonton" className="calc-tab" title="Amonton's Law">
              <CalculatorAccordion
                InfoComponent={AmontonInfo}
                calculatorId="amonton"
              />
            </Tab>

            <Tab eventKey="boyle" className="calc-tab" title="Boyle's Law">
              <CalculatorAccordion
                InfoComponent={BoyleInfo}
                calculatorId="boyle"
              />
            </Tab>

            <Tab eventKey="charles" className="calc-tab" title="Charles' Law">
              <CalculatorAccordion
                InfoComponent={CharlesInfo}
                calculatorId="charles"
              />
            </Tab>

            <Tab eventKey="combined" className="calc-tab" title="Combined Gas Law">
              <CalculatorAccordion
                InfoComponent={CombinedInfo}
                calculatorId="combined"
              />
            </Tab>

            <Tab eventKey="ideal" className="calc-tab" title="Ideal Gas Law">
              <CalculatorAccordion
                InfoComponent={IdealInfo}
                calculatorId="ideal"
              />
            </Tab>

            <Tab eventKey="density" className="calc-tab" title="Gas Density">
              <CalculatorAccordion
                InfoComponent={GasDensityInfo}
                calculatorId="density"
              />
            </Tab>

            <Tab eventKey="graham" className="calc-tab" title="Graham's Law">
              <CalculatorAccordion
                InfoComponent={GrahamInfo}
                calculatorId="graham"
              />
            </Tab>

            <Tab eventKey="dalton" className="calc-tab" title="Dalton's Law">
              <CalculatorAccordion
                InfoComponent={DaltonInfo}
                calculatorId="dalton"
              />
            </Tab>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default GasLawsPage;
