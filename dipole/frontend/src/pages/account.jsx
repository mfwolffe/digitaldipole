import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardBody, Button } from "../components/ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import '../App.css';

const Account = () => {
  const { isAuthenticated, username, logout, openLoginModal } = useAuth();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      openLoginModal('Please sign in to view your account.');
      navigate('/');
      return;
    }

    // Fetch user details from API
    async function fetchUserDetails() {
      try {
        const response = await fetch('/api/user/me');
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        if (data.authenticated) {
          setUserDetails(data);
        } else {
          openLoginModal('Please sign in to view your account.');
          navigate('/');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserDetails();
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

  if (error) {
    return (
      <div className="landing-container mt-6 px-4">
        <div className="landing mt-0">
          <Card className="mt-8 mx-auto max-w-2xl">
            <CardBody className="text-center py-8">
              <FontAwesomeIcon
                icon="fa-duotone fa-triangle-exclamation"
                className="text-red-500 mb-4"
                size="3x"
              />
              <p className="text-lg text-gray-600">Error: {error}</p>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  if (!userDetails) {
    return null;
  }

  const formatDate = (isoString) => {
    if (!isoString) return 'Never';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="landing-container mt-6 px-4">
      <div className="landing mt-0">
        <Card className="mt-8 mx-auto max-w-2xl">
          <CardBody>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                <FontAwesomeIcon
                  icon="fa-duotone fa-user-astronaut"
                  className="text-primary-600"
                  size="2x"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {userDetails.name || userDetails.username}
                </h1>
                <p className="text-gray-500">@{userDetails.username}</p>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FontAwesomeIcon
                  icon="fa-duotone fa-circle-info"
                  className="text-primary-500"
                />
                Account Information
              </h2>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium text-gray-900">
                    {userDetails.email || 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(userDetails.date_joined)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Login</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(userDetails.last_login)}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="mt-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FontAwesomeIcon
                  icon="fa-duotone fa-gear"
                  className="text-primary-500"
                />
                Account Settings
              </h2>

              <div className="space-y-2">
                <a
                  href="/accounts/password/change/"
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon="fa-duotone fa-key"
                      className="text-gray-400 group-hover:text-primary-500"
                    />
                    <span className="text-gray-700">Change Password</span>
                  </div>
                  <FontAwesomeIcon
                    icon="fa-solid fa-chevron-right"
                    className="text-gray-400"
                  />
                </a>

                <a
                  href="/accounts/email/"
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon="fa-duotone fa-envelope"
                      className="text-gray-400 group-hover:text-primary-500"
                    />
                    <span className="text-gray-700">Manage Email Addresses</span>
                  </div>
                  <FontAwesomeIcon
                    icon="fa-solid fa-chevron-right"
                    className="text-gray-400"
                  />
                </a>

                <a
                  href="/accounts/social/connections/"
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon="fa-duotone fa-link"
                      className="text-gray-400 group-hover:text-primary-500"
                    />
                    <span className="text-gray-700">Connected Accounts</span>
                  </div>
                  <FontAwesomeIcon
                    icon="fa-solid fa-chevron-right"
                    className="text-gray-400"
                  />
                </a>
              </div>
            </div>

            {/* Sign Out Button */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              <Button
                onClick={logout}
                variant="outline-secondary"
                className="w-full justify-center"
              >
                <FontAwesomeIcon icon="fa-duotone fa-right-from-bracket" className="mr-2" />
                Sign Out
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Account;
