import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Tabs,
  TabList,
  TabButton,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  Card,
} from "../../components/ui";

import { Calculator } from "../../calculators";
import { gasLawsInfo } from "../../calculators/registry";
import { typesetMath } from '../../utils/mathjax-loader';

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
  VanDerWaalsInfo,
  GenInfo1,
  GenInfo2,
} from "../../components/CalcInfo";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "../../App.css";
import "../../styles/refs.css";

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
    <Accordion defaultActiveKey="0" className="mb-4">
      <AccordionItem eventKey="0">
        <AccordionHeader>
          {InfoIcon}
          Info
        </AccordionHeader>
        <AccordionBody>
          <InfoComponent />
        </AccordionBody>
      </AccordionItem>
      <AccordionItem eventKey="1">
        <AccordionHeader>
          {RootIco}
          Calculator
        </AccordionHeader>
        <AccordionBody>
          <Calculator calculatorId={calculatorId} />
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
}

/**
 * Info-only accordion (for the main info tab)
 */
function InfoAccordion({ Info1, Info2, title1, title2 }) {
  return (
    <Accordion defaultActiveKey="0" className="mb-4">
      <AccordionItem eventKey="0">
        <AccordionHeader>
          {InfoIcon}
          {title1}
        </AccordionHeader>
        <AccordionBody>
          <Info1 />
        </AccordionBody>
      </AccordionItem>
      <AccordionItem eventKey="1">
        <AccordionHeader>
          {IdealGas}
          {title2}
        </AccordionHeader>
        <AccordionBody>
          <Info2 />
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
}

// Valid tab keys for this page
const VALID_TABS = ['info', 'avogadro', 'amonton', 'boyle', 'charles', 'combined', 'ideal', 'vanDerWaals', 'density', 'graham', 'dalton'];

// Tab configuration for cleaner JSX
const TAB_CONFIG = [
  { key: 'info', title: 'Info' },
  { key: 'avogadro', title: "Avogadro's Law" },
  { key: 'amonton', title: "Amonton's Law" },
  { key: 'boyle', title: "Boyle's Law" },
  { key: 'charles', title: "Charles' Law" },
  { key: 'combined', title: 'Combined Gas Law' },
  { key: 'ideal', title: 'Ideal Gas Law' },
  { key: 'density', title: 'Gas Density' },
  { key: 'graham', title: "Graham's Law" },
  { key: 'dalton', title: "Dalton's Law" },
  { key: 'vanDerWaals', title: 'Van der Waals' },
];

const CALCULATOR_MAP = {
  avogadro: { Info: AvoInfo, id: 'avogadro' },
  amonton: { Info: AmontonInfo, id: 'amonton' },
  boyle: { Info: BoyleInfo, id: 'boyle' },
  charles: { Info: CharlesInfo, id: 'charles' },
  combined: { Info: CombinedInfo, id: 'combined' },
  ideal: { Info: IdealInfo, id: 'ideal' },
  density: { Info: GasDensityInfo, id: 'density' },
  graham: { Info: GrahamInfo, id: 'graham' },
  dalton: { Info: DaltonInfo, id: 'dalton' },
  vanDerWaals: { Info: VanDerWaalsInfo, id: 'vanDerWaals' },
};

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

  // Re-render MathJax when tab changes (lazy-loaded)
  useEffect(() => {
    typesetMath();
  }, [activeTab]);

  return (
    <div className="landing-container mt-6 px-4">
      <div className="landing mt-0">
        <Card className="mt-8 mx-auto max-w-5xl" id="ref-default">
          <Tabs
            activeKey={activeTab}
            onSelect={handleTabSelect}
            className="calc-tabs"
          >
            {/* Tab buttons with horizontal scroll for many tabs */}
            <TabList className="flex overflow-x-auto border-b border-gray-200 px-2 pt-2 gap-1 scrollbar-thin">
              {TAB_CONFIG.map(({ key, title }) => (
                <TabButton
                  key={key}
                  eventKey={key}
                  className="shrink-0"
                >
                  {title}
                </TabButton>
              ))}
            </TabList>

            {/* Info tab panel */}
            <TabPanel eventKey="info" className="p-4">
              <InfoAccordion
                Info1={GenInfo1}
                Info2={GenInfo2}
                title1="Gas Laws"
                title2="Ideal Gases"
              />
            </TabPanel>

            {/* Calculator tab panels */}
            {Object.entries(CALCULATOR_MAP).map(([key, { Info, id }]) => (
              <TabPanel key={key} eventKey={key} className="p-4">
                <CalculatorAccordion
                  InfoComponent={Info}
                  calculatorId={id}
                />
              </TabPanel>
            ))}
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default GasLawsPage;
