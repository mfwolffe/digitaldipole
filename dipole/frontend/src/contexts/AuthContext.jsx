import React, { createContext, useContext, useState, useCallback } from 'react';
import { Modal } from '../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Get initial auth state from Django template variables
const getInitialAuthState = () => ({
  isAuthenticated: typeof isAuthenticated !== 'undefined' ? isAuthenticated : false,
  username: typeof username !== 'undefined' ? username : '',
  userId: typeof userId !== 'undefined' ? userId : null,
});

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialAuthState);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  const openLoginModal = useCallback((message = '') => {
    setLoginMessage(message);
    setShowLoginModal(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setShowLoginModal(false);
    setLoginMessage('');
  }, []);

  // Redirect to Django's login page
  const redirectToLogin = useCallback(() => {
    // Store current URL to redirect back after login
    const currentPath = window.location.pathname;
    window.location.href = `/accounts/login/?next=${encodeURIComponent(currentPath)}`;
  }, []);

  // Redirect to Django's signup page
  const redirectToSignup = useCallback(() => {
    const currentPath = window.location.pathname;
    window.location.href = `/accounts/signup/?next=${encodeURIComponent(currentPath)}`;
  }, []);

  // Logout - redirect to Django's logout endpoint
  const logout = useCallback(() => {
    window.location.href = '/accounts/logout/';
  }, []);

  const value = {
    ...authState,
    openLoginModal,
    closeLoginModal,
    redirectToLogin,
    redirectToSignup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LoginModal
        show={showLoginModal}
        onClose={closeLoginModal}
        message={loginMessage}
        onLogin={redirectToLogin}
        onSignup={redirectToSignup}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Login Modal Component
function LoginModal({ show, onClose, message, onLogin, onSignup }) {
  return (
    <Modal show={show} onClose={onClose} size="sm">
      <Modal.Header onClose={onClose}>
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon="fa-duotone fa-user-astronaut"
            className="text-accent-500"
          />
          <span>Sign In Required</span>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center py-4">
          {message && (
            <p className="text-gray-600 mb-4">{message}</p>
          )}
          <p className="text-gray-500 mb-6">
            Please sign in to access this feature.
          </p>
          <div className="space-y-3">
            <button
              onClick={onLogin}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Sign In
            </button>
            <button
              onClick={onSignup}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Create Account
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AuthContext;
