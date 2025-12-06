import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardBody, Tabs, TabList, TabButton, TabPanel } from "../components/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import '../App.css';

const Favorites = () => {
  const { isAuthenticated, openLoginModal } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    if (!isAuthenticated) {
      openLoginModal('Please sign in to view your favorites.');
      navigate('/');
      return;
    }

    // TODO: Fetch favorites from API when implemented
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

  // Group favorites by category
  const groupedFavorites = favorites.reduce((acc, fav) => {
    const category = fav.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(fav);
    return acc;
  }, {});

  return (
    <div className="landing-container mt-6 px-4">
      <div className="landing mt-0">
        <Card className="mt-8 mx-auto max-w-4xl">
          <CardBody>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <FontAwesomeIcon
                icon="fa-duotone fa-heart"
                className="text-red-500"
                size="2x"
              />
              <h1 className="text-2xl font-bold text-gray-900">
                My Favorite Equations
              </h1>
            </div>

            {hasFavorites ? (
              <Tabs activeKey={activeTab} onSelect={setActiveTab} className="calc-tabs">
                <TabList className="flex overflow-x-auto border-b border-gray-200 px-2 pt-2 gap-1">
                  {Object.keys(groupedFavorites).map((category) => (
                    <TabButton key={category} eventKey={category}>
                      {category}
                    </TabButton>
                  ))}
                </TabList>

                {Object.entries(groupedFavorites).map(([category, categoryFavorites]) => (
                  <TabPanel key={category} eventKey={category} className="p-4">
                    <div className="space-y-3">
                      {categoryFavorites.map((fav) => (
                        <Link
                          key={fav.id}
                          to={fav.path}
                          className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-primary-300 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <FontAwesomeIcon
                              icon="fa-duotone fa-calculator"
                              className="text-primary-500"
                            />
                            <div>
                              <span className="font-medium text-gray-900 group-hover:text-primary-600">
                                {fav.name}
                              </span>
                              {fav.equation && (
                                <p className="text-sm text-gray-500 font-mono">
                                  {fav.equation}
                                </p>
                              )}
                            </div>
                          </div>
                          <FontAwesomeIcon
                            icon="fa-solid fa-heart"
                            className="text-red-500"
                          />
                        </Link>
                      ))}
                    </div>
                  </TabPanel>
                ))}
              </Tabs>
            ) : (
              /* Empty state with info tab */
              <Tabs activeKey={activeTab} onSelect={setActiveTab} className="calc-tabs">
                <TabList className="flex overflow-x-auto border-b border-gray-200 px-2 pt-2 gap-1">
                  <TabButton eventKey="info">Info</TabButton>
                </TabList>

                <TabPanel eventKey="info" className="p-4">
                  <div className="text-center py-12">
                    <FontAwesomeIcon
                      icon="fa-duotone fa-heart"
                      className="text-gray-300 mb-4"
                      size="4x"
                    />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No Favorites Yet
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      Equations you favorite will end up here. Click the heart icon
                      on any calculator equation to add it to your favorites for
                      quick access.
                    </p>
                    <Link
                      to="/calculators/gas-laws"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <FontAwesomeIcon icon="fa-duotone fa-calculator" />
                      Browse Calculators
                    </Link>
                  </div>
                </TabPanel>
              </Tabs>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Favorites;
