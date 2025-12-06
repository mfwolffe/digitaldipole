/**
 * CalculatorPage - Shared calculator page layout
 *
 * This component provides a consistent structure for all calculator category pages.
 * It handles URL-based tab navigation and MathJax re-rendering.
 */
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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "../../App.css";
import "../../styles/refs.css";

// Shared icons
export const RootIco = (
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

export const InfoIcon = (
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
export function CalculatorAccordion({ InfoComponent, calculatorId }) {
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
export function InfoAccordion({ Info1, Info2, title1, title2, icon2 }) {
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
          {icon2 || InfoIcon}
          {title2}
        </AccordionHeader>
        <AccordionBody>
          <Info2 />
        </AccordionBody>
      </AccordionItem>
    </Accordion>
  );
}

/**
 * CalculatorPage - main component
 *
 * @param {Object} props
 * @param {string} props.basePath - Base URL path (e.g., '/calculators/gas-laws')
 * @param {Array} props.tabs - Array of tab configurations
 * @param {Object} props.infoTab - Configuration for the info tab
 * @param {Object} props.calculators - Map of calculator configurations
 */
export function CalculatorPage({
  basePath,
  tabs,
  infoTab,
  calculators,
}) {
  const { tab } = useParams();
  const navigate = useNavigate();

  // Get valid tab keys from configuration
  const validTabs = tabs.map(t => t.key);

  // Determine active tab from URL param, default to 'info'
  const activeTab = validTabs.includes(tab) ? tab : 'info';

  // Handle tab selection - update URL
  const handleTabSelect = (selectedTab) => {
    if (selectedTab === 'info') {
      navigate(basePath);
    } else {
      navigate(`${basePath}/${selectedTab}`);
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
    <div className="landing-container mt-6 px-4">
      <div className="landing mt-0">
        <Card className="mt-8 mx-auto max-w-5xl">
          <Tabs
            activeKey={activeTab}
            onSelect={handleTabSelect}
            className="calc-tabs"
          >
            {/* Tab buttons with horizontal scroll for many tabs */}
            <TabList className="flex overflow-x-auto border-b border-gray-200 px-2 pt-2 gap-1 scrollbar-thin">
              {tabs.map(({ key, title }) => (
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
            {infoTab && (
              <TabPanel eventKey="info" className="p-4">
                <InfoAccordion
                  Info1={infoTab.Info1}
                  Info2={infoTab.Info2}
                  title1={infoTab.title1}
                  title2={infoTab.title2}
                  icon2={infoTab.icon2}
                />
              </TabPanel>
            )}

            {/* Calculator tab panels */}
            {Object.entries(calculators).map(([key, { Info, id }]) => (
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
}

export default CalculatorPage;
