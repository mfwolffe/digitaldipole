import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../contexts/AuthContext';

/**
 * FavoriteButton - Heart icon that toggles favorite status for an equation
 *
 * Props:
 * - equationName: string - The name of the equation to favorite
 * - size: string - FontAwesome size ('sm', 'lg', 'xl', '2x', etc.)
 * - className: string - Additional CSS classes
 */
export function FavoriteButton({ equationName, size = 'lg', className = '' }) {
  const { isAuthenticated, openLoginModal } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check initial favorite status
  useEffect(() => {
    if (!isAuthenticated || !equationName) return;

    async function checkFavoriteStatus() {
      try {
        const response = await fetch(`/api/favorites/check/${encodeURIComponent(equationName)}`);
        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.is_favorite);
        }
      } catch (err) {
        console.error('Failed to check favorite status:', err);
      }
    }

    checkFavoriteStatus();
  }, [isAuthenticated, equationName]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      openLoginModal('Sign in to save your favorite equations!');
      return;
    }

    if (isLoading || !equationName) return;

    setIsLoading(true);
    setIsAnimating(true);

    try {
      const response = await fetch(`/api/favorites/${encodeURIComponent(equationName)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsFavorite(data.is_favorite);
        }
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    } finally {
      setIsLoading(false);
      // Keep animation briefly for visual feedback
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`
        transition-all duration-200 ease-in-out
        hover:scale-110 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-1
        rounded-full p-1
        ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
        ${className}
      `}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <FontAwesomeIcon
        icon="fa-duotone fa-heart"
        size={size}
        style={isFavorite ? {
          '--fa-primary-color': '#ef4444',
          '--fa-secondary-color': '#ef4444',
          '--fa-secondary-opacity': '1',
        } : {
          '--fa-primary-color': '#475569',
          '--fa-secondary-color': '#475569',
          '--fa-secondary-opacity': '0.3',
        }}
        className={`
          transition-all duration-200
          ${isAnimating ? 'animate-pulse' : ''}
        `}
      />
    </button>
  );
}

/**
 * FavoriteButtonSmall - Smaller version for inline use
 */
export function FavoriteButtonSmall({ equationName, className = '' }) {
  return (
    <FavoriteButton
      equationName={equationName}
      size="sm"
      className={className}
    />
  );
}

export default FavoriteButton;
