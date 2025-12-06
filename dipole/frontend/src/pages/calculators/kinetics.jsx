import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
import { CalculatorAccordion, InfoIcon } from "./CalculatorPage";

import {
  ArrheniusInfo,
  HalfLifeInfo,
  SecondOrderInfo,
  FirstOrderInfo,
} from "../../components/CalcInfo";

import "../../App.css";
import "../../styles/refs.css";

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

/**
 * Kinetics overview for info tab
 */
function KineticsOverview() {
  return (
    <>
      <p className="text-left mb-3">
        <strong>Chemical kinetics</strong> is the study of reaction rates — how fast reactants
        are consumed and products are formed. Understanding kinetics helps predict reaction
        timescales and design efficient processes.
      </p>
      <p className="text-left mb-3">
        Key concepts include:
      </p>
      <ul className="text-left space-y-1 mb-4">
        <li><strong>Rate Laws</strong>: Mathematical expressions relating rate to concentrations</li>
        <li><strong>Rate Constants</strong>: Temperature-dependent proportionality factors</li>
        <li><strong>Activation Energy</strong>: Energy barrier that must be overcome for reaction</li>
        <li><strong>Half-Life</strong>: Time for concentration to decrease by half</li>
      </ul>
      <p className="text-center mt-4">
        {"$$\\text{rate} = k[A]^m[B]^n$$"}
      </p>
      <p className="text-center text-gray-500 text-sm">
        where {"\\(k\\)"} is the rate constant and {"\\(m, n\\)"} are reaction orders.
      </p>
    </>
  );
}

// Valid tab keys for this page
const VALID_TABS = ['info', 'arrhenius', 'halfLife', 'firstOrder', 'secondOrder'];

// Tab configuration
const TABS = [
  { key: 'info', title: 'Info' },
  { key: 'arrhenius', title: 'Arrhenius Equation' },
  { key: 'halfLife', title: 'Half-Life' },
  { key: 'firstOrder', title: 'First Order' },
  { key: 'secondOrder', title: 'Second Order' },
];

// Calculator configurations
const CALCULATORS = {
  arrhenius: { Info: ArrheniusInfo, id: 'arrhenius' },
  halfLife: { Info: HalfLifeInfo, id: 'halfLife' },
  firstOrder: { Info: FirstOrderInfo, id: 'firstOrder' },
  secondOrder: { Info: SecondOrderInfo, id: 'secondOrder' },
};

/**
 * Kinetics Calculator Page
 */
const KineticsPage = () => {
  const { tab } = useParams();
  const navigate = useNavigate();

  const activeTab = VALID_TABS.includes(tab) ? tab : 'info';

  const handleTabSelect = (selectedTab) => {
    if (selectedTab === 'info') {
      navigate('/calculators/kinetics');
    } else {
      navigate(`/calculators/kinetics/${selectedTab}`);
    }
  };

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
          <Tabs activeKey={activeTab} onSelect={handleTabSelect} className="calc-tabs">
            <TabList className="flex overflow-x-auto border-b border-gray-200 px-2 pt-2 gap-1 scrollbar-thin">
              {TABS.map(({ key, title }) => (
                <TabButton key={key} eventKey={key} className="shrink-0">
                  {title}
                </TabButton>
              ))}
            </TabList>

            {/* Info tab - single accordion for kinetics */}
            <TabPanel eventKey="info" className="p-4">
              <Accordion defaultActiveKey="0" className="mb-4">
                <AccordionItem eventKey="0">
                  <AccordionHeader>
                    {KineticsIcon}
                    Chemical Kinetics
                  </AccordionHeader>
                  <AccordionBody>
                    <KineticsOverview />
                  </AccordionBody>
                </AccordionItem>
              </Accordion>
            </TabPanel>

            {/* Calculator tab panels */}
            {Object.entries(CALCULATORS).map(([key, { Info, id }]) => (
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

export default KineticsPage;
