// src/components/layout/NavbarModern.jsx
import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const NavbarModern = ({ onMenuToggle, user, onLogout, sidebarOpen }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  return (
    <nav className="navbar bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Menu toggle and Logo */}
          <div className="flex items-center">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors duration-200 lg:hidden"
            >
              {sidebarOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>

            <div className="flex items-center ml-4 lg:ml-0">
              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">E</span>
                  </div>
                  <div className="ml-3">
                    <h1 className="text-xl font-bold text-gray-900">
                      <span className="text-primary-600">Emp</span>Sync
                    </h1>
                    <p className="text-xs text-gray-500 hidden sm:block">Employee Management</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - User info and actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* User Role Badge - Hidden on mobile */}
                <div className="hidden sm:block">
                  <span className="badge badge-primary">
                    {user.role}
                  </span>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">{user.name || user.username}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-large border border-gray-100 py-1 animate-scale-in">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name || user.username}</p>
                        <p className="text-xs text-gray-500">{user.email || 'No email'}</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          window.location.href = '/profile';
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <UserIcon className="h-4 w-4" />
                        <span>Profile</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          onLogout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 flex items-center space-x-2"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Logout Button */}
                <button
                  onClick={onLogout}
                  className="md:hidden p-2 rounded-lg text-danger-600 hover:bg-danger-50 transition-colors duration-200"
                  title="Logout"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => window.location.href = '/login'}
                className="btn btn-primary"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {profileDropdownOpen && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setProfileDropdownOpen(false)}
        />
      )}
    </nav>
  );
};

export default NavbarModern;
