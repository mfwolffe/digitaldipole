import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, Tabs, TabList, TabButton, TabPanel } from "../components/ui";
import { Calculator } from "../calculators";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import '../App.css';

const Favorites = () => {
  const { isAuthenticated, openLoginModal } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);

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
          const favList = data.favorites || [];
          setFavorites(favList);
          // Set first favorite as active tab
          if (favList.length > 0) {
            setActiveTab(favList[0].equation_id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch favorites:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [isAuthenticated, navigate, openLoginModal]);

  // Re-render MathJax when tab changes
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetClear();
      window.MathJax.typeset();
    }
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
          {hasFavorites ? (
            <Tabs
              activeKey={activeTab}
              onSelect={setActiveTab}
              className="calc-tabs"
            >
              {/* Horizontally scrolling tab bar with all favorites */}
              <TabList className="flex overflow-x-auto border-b border-gray-200 px-2 pt-2 gap-1 scrollbar-thin">
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

              {/* Tab panels - each loads the actual calculator */}
              {favorites.map((fav) => (
                <TabPanel
                  key={fav.equation_id}
                  eventKey={fav.equation_id}
                  className="p-4"
                >
                  <Calculator calculatorId={fav.equation_id} />
                </TabPanel>
              ))}
            </Tabs>
          ) : (
            /* Empty state */
            <div className="p-8 text-center">
              <FontAwesomeIcon
                icon="fa-duotone fa-heart"
                className="text-gray-300 mb-4"
                size="4x"
              />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Favorites Yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Equations you favorite will appear here as tabs, ready to use.
                Click the heart icon on any calculator to add it to your favorites.
              </p>
              <Link
                to="/calculators/gas-laws"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FontAwesomeIcon icon="fa-duotone fa-calculator" />
                Browse Calculators
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Favorites;
