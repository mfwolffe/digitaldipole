import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  Tabs,
  TabList,
  TabButton,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
} from "../components/ui";
import { Calculator, getCalculator } from "../calculators";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { typesetMath } from '../utils/mathjax-loader';

import '../App.css';

const RootIco = (
  <FontAwesomeIcon
    icon="fa-duotone fa-square-root-variable"
    size="lg"
    style={{
      "--fa-primary-color": "#ffffff",
      "--fa-secondary-color": "#fc6601",
      "--fa-secondary-opacity": "1",
    }}
    className="pr-2"
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
    className="pr-2"
  />
);

/**
 * Accordion wrapper for info + calculator (same as other calculator pages)
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

const Favorites = () => {
  const { isAuthenticated, openLoginModal } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("favorites");

  useEffect(() => {
    if (!isAuthenticated) {
      openLoginModal('Please sign in to view your favorites.');
      navigate('/');
      return;
    }

    async function fetchFavorites() {
      try {
        const response = await fetch('/api/favorites/');
        if (response.ok) {
          const data = await response.json();
          setFavorites(data.favorites || []);
        }
      } catch (err) {
        console.error('Failed to fetch favorites:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [isAuthenticated, navigate, openLoginModal]);

  // Re-render MathJax when tab changes (lazy-loaded)
  useEffect(() => {
    typesetMath();
  }, [activeTab]);

  if (loading) {
    return (
      <div className="landing-container mt-6 px-4">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  const hasFavorites = favorites.length > 0;

  return (
    <div className="landing-container mt-6 px-4">
      <div className="landing mt-0">
        <Card className="mt-8 mx-auto max-w-5xl" id="ref-default">
          <Tabs
            activeKey={activeTab}
            onSelect={setActiveTab}
            className="calc-tabs"
          >
            {/* Horizontally scrolling tab bar */}
            <TabList className="flex overflow-x-auto border-b border-gray-200 px-2 pt-2 gap-1 scrollbar-thin">
              <TabButton eventKey="favorites" className="shrink-0">
                Favorites
              </TabButton>
              {favorites.map((fav) => (
                <TabButton
                  key={fav.equation_id}
                  eventKey={fav.equation_id}
                  className="shrink-0"
                >
                  {fav.name}
                </TabButton>
              ))}
            </TabList>

            {/* Favorites intro tab */}
            <TabPanel eventKey="favorites" className="p-4">
              <div className="text-center py-8">
                <FontAwesomeIcon
                  icon="fa-duotone fa-heart"
                  style={{
                    "--fa-primary-color": "#ef4444",
                    "--fa-secondary-color": "#ef4444",
                    "--fa-secondary-opacity": "0.4",
                  }}
                  size="3x"
                  className="mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Your Favorites
                </h3>
                {hasFavorites ? (
                  <p className="text-gray-500 max-w-md mx-auto">
                    Calculators you've favorited are collected here. Click on any tab above
                    to use that calculator directly.
                  </p>
                ) : (
                  <>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      Calculators you favorite will appear here as tabs, ready to use.
                      Click the heart icon on any calculator to add it to your favorites.
                    </p>
                    <Link
                      to="/calculators/gas-laws"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <FontAwesomeIcon icon="fa-duotone fa-calculator" />
                      Browse Calculators
                    </Link>
                  </>
                )}
              </div>
            </TabPanel>

            {/* Calculator tabs - each loads the full accordion with info + calculator */}
            {favorites.map((fav) => {
              const calcDef = getCalculator(fav.equation_id);
              const InfoComponent = calcDef?.InfoComponent;

              return (
                <TabPanel
                  key={fav.equation_id}
                  eventKey={fav.equation_id}
                  className="p-4"
                >
                  {calcDef && InfoComponent ? (
                    <CalculatorAccordion
                      InfoComponent={InfoComponent}
                      calculatorId={fav.equation_id}
                    />
                  ) : (
                    <Calculator calculatorId={fav.equation_id} />
                  )}
                </TabPanel>
              );
            })}
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Favorites;
