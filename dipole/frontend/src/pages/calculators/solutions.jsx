import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Tab from "react-bootstrap/Tab";
import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Accordion from "react-bootstrap/Accordion";

import { Calculator } from "../../calculators";
import { solutionsInfo } from "../../calculators/registry";

import {
  MolarityInfo,
  DilutionInfo,
  OsmoticPressureInfo,
  RaoultInfo,
  BoilingPointElevationInfo,
  FreezingPointDepressionInfo,
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

const SolutionIcon = (
  <FontAwesomeIcon
    icon="fa-duotone fa-flask"
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
          {SolutionIcon}
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
 * Solutions overview for info tab
 */
function SolutionsOverview() {
  return (
    <>
      <p className="text-start mb-2">
        <strong>Solution chemistry</strong> describes the behavior of homogeneous
        mixtures where one substance (the solute) is dissolved in another (the solvent).
        Understanding solutions is fundamental to laboratory work, biological systems,
        and industrial processes.
      </p>
      <p className="text-start mb-2">
        Key concepts include:
      </p>
      <ul className="text-start">
        <li><strong>Concentration</strong>: Molarity, molality, and mole fraction</li>
        <li><strong>Dilution</strong>: Reducing concentration by adding solvent</li>
        <li><strong>Colligative Properties</strong>: Properties that depend on particle count, not identity</li>
      </ul>
      <p className="text-center mt-3">
        {"$$\\text{Molarity} = \\frac{\\text{moles of solute}}{\\text{liters of solution}}$$"}
      </p>
    </>
  );
}

/**
 * Colligative properties overview
 */
function ColligativeOverview() {
  return (
    <>
      <p className="text-start mb-2">
        <strong>Colligative properties</strong> are solution properties that depend
        only on the number of solute particles present, not on their chemical identity.
        These properties arise from the dilution of the solvent by solute particles.
      </p>
      <p className="text-start mb-2">
        The four colligative properties are:
      </p>
      <ul className="text-start">
        <li><strong>Vapor Pressure Lowering</strong>: Raoult's Law</li>
        <li><strong>Boiling Point Elevation</strong>: {"\\(\\Delta T_b = K_b m i\\)"}</li>
        <li><strong>Freezing Point Depression</strong>: {"\\(\\Delta T_f = K_f m i\\)"}</li>
        <li><strong>Osmotic Pressure</strong>: {"\\(\\Pi = MRT\\)"}</li>
      </ul>
      <p className="text-start mt-3">
        The van't Hoff factor {"\\(i\\)"} accounts for dissociation of electrolytes.
      </p>
    </>
  );
}

// Valid tab keys for this page
const VALID_TABS = ['info', 'molarity', 'dilution', 'osmoticPressure', 'raoult', 'boilingPointElevation', 'freezingPointDepression'];

/**
 * Solutions Calculator Page
 *
 * Uses the new client-side calculator system with Nerdamer.js
 * URL structure: /calculators/solutions/:tab?
 */
const SolutionsPage = () => {
  const { tab } = useParams();
  const navigate = useNavigate();

  // Determine active tab from URL param, default to 'info'
  const activeTab = VALID_TABS.includes(tab) ? tab : 'info';

  // Handle tab selection - update URL
  const handleTabSelect = (selectedTab) => {
    if (selectedTab === 'info') {
      navigate('/calculators/solutions');
    } else {
      navigate(`/calculators/solutions/${selectedTab}`);
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
            id="solutions-tabs"
            className="mb-3 mt-1 calc-tabs"
          >
            <Tab eventKey="info" className="calc-tab" title="Info">
              <InfoAccordion
                Info1={SolutionsOverview}
                Info2={ColligativeOverview}
                title1="Solutions"
                title2="Colligative Properties"
              />
            </Tab>

            <Tab eventKey="molarity" className="calc-tab" title="Molarity">
              <CalculatorAccordion
                InfoComponent={MolarityInfo}
                calculatorId="molarity"
              />
            </Tab>

            <Tab eventKey="dilution" className="calc-tab" title="Dilution">
              <CalculatorAccordion
                InfoComponent={DilutionInfo}
                calculatorId="dilution"
              />
            </Tab>

            <Tab eventKey="osmoticPressure" className="calc-tab" title="Osmotic Pressure">
              <CalculatorAccordion
                InfoComponent={OsmoticPressureInfo}
                calculatorId="osmoticPressure"
              />
            </Tab>

            <Tab eventKey="raoult" className="calc-tab" title="Raoult's Law">
              <CalculatorAccordion
                InfoComponent={RaoultInfo}
                calculatorId="raoult"
              />
            </Tab>

            <Tab eventKey="boilingPointElevation" className="calc-tab" title="Boiling Point">
              <CalculatorAccordion
                InfoComponent={BoilingPointElevationInfo}
                calculatorId="boilingPointElevation"
              />
            </Tab>

            <Tab eventKey="freezingPointDepression" className="calc-tab" title="Freezing Point">
              <CalculatorAccordion
                InfoComponent={FreezingPointDepressionInfo}
                calculatorId="freezingPointDepression"
              />
            </Tab>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default SolutionsPage;
