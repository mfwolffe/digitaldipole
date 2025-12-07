/**
 * Unit Preferences Context
 *
 * Manages user's preferred units per dimension.
 * Loads preferences from the API and provides them to calculators.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

// Default chemistry units (used when not logged in or no preferences saved)
const DEFAULT_PREFERENCES = {
  pressure: 'atm',
  volume: 'L',
  temperature: 'K',
  mass: 'g',
  amount: 'mol',
  energy: 'kJ',
  concentration: 'M',
  time: 's',
  length: 'cm',
};

const UnitPreferencesContext = createContext(null);

export function UnitPreferencesProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState({
    system: 'SI',
    preferred_units: DEFAULT_PREFERENCES,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load preferences from API
  useEffect(() => {
    async function loadPreferences() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/user/unit-preferences');
        if (response.ok) {
          const data = await response.json();
          setPreferences({
            system: data.system || 'SI',
            preferred_units: { ...DEFAULT_PREFERENCES, ...data.preferred_units },
          });
        }
      } catch (err) {
        console.error('Failed to load unit preferences:', err);
        setError(err.message);
        // Keep default preferences on error
      } finally {
        setIsLoading(false);
      }
    }

    loadPreferences();
  }, [isAuthenticated]);

  // Get preferred unit for a dimension
  const getPreferredUnit = useCallback((dimension) => {
    return preferences.preferred_units[dimension] || null;
  }, [preferences.preferred_units]);

  // Set preferred unit for a dimension
  const setPreferredUnit = useCallback(async (dimension, unitId) => {
    // Optimistically update local state
    setPreferences(prev => ({
      ...prev,
      system: 'custom',
      preferred_units: {
        ...prev.preferred_units,
        [dimension]: unitId,
      },
    }));

    // Persist to API if authenticated
    if (isAuthenticated) {
      try {
        const response = await fetch(`/api/user/unit-preferences/${dimension}/${unitId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
          },
        });

        if (!response.ok) {
          throw new Error('Failed to save preference');
        }
      } catch (err) {
        console.error('Failed to save unit preference:', err);
        // Don't revert - local state is still valid
      }
    }
  }, [isAuthenticated]);

  // Set all preferences (e.g., when switching system presets)
  const setAllPreferences = useCallback(async (system, unitMap) => {
    // Optimistically update local state
    setPreferences({
      system,
      preferred_units: { ...DEFAULT_PREFERENCES, ...unitMap },
    });

    // Persist to API if authenticated
    if (isAuthenticated) {
      try {
        const response = await fetch('/api/user/unit-preferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
          },
          body: JSON.stringify({ system, preferred_units: unitMap }),
        });

        if (!response.ok) {
          throw new Error('Failed to save preferences');
        }
      } catch (err) {
        console.error('Failed to save unit preferences:', err);
      }
    }
  }, [isAuthenticated]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setAllPreferences('SI', DEFAULT_PREFERENCES);
  }, [setAllPreferences]);

  const value = {
    // Current preferences
    system: preferences.system,
    preferredUnits: preferences.preferred_units,

    // Status
    isLoading,
    error,

    // Actions
    getPreferredUnit,
    setPreferredUnit,
    setAllPreferences,
    resetToDefaults,
  };

  return (
    <UnitPreferencesContext.Provider value={value}>
      {children}
    </UnitPreferencesContext.Provider>
  );
}

export function useUnitPreferences() {
  const context = useContext(UnitPreferencesContext);
  if (!context) {
    throw new Error('useUnitPreferences must be used within a UnitPreferencesProvider');
  }
  return context;
}

// Helper to get CSRF token from cookie
function getCSRFToken() {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export default UnitPreferencesContext;
