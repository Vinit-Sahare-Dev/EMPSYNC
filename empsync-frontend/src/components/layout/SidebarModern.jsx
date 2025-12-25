// src/components/layout/SidebarModern.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const SidebarModern = ({ isOpen, onClose, userRole, userName }) => {
  const navigation = [
    {
      name: 'Dashboard',
      href: userRole === 'EMPLOYEE' ? '/employee-dashboard' : '/dashboard',
      icon: HomeIcon,
      current: false,
      roles: ['ADMIN', 'EMPLOYEE'],
    },
    {
      name: 'Employees',
      href: '/employees',
      icon: UserGroupIcon,
      current: false,
      roles: ['ADMIN'],
    },
    {
      name: 'Departments',
      href: '/departments',
      icon: BuildingOfficeIcon,
      current: false,
      roles: ['ADMIN', 'EMPLOYEE'],
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: ChartBarIcon,
      current: false,
      roles: ['ADMIN'],
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Cog6ToothIcon,
      current: false,
      roles: ['ADMIN'],
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: UserIcon,
      current: false,
      roles: ['ADMIN', 'EMPLOYEE'],
    },
  ];

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        sidebar fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-large border-r border-gray-100 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'sidebar-open' : 'sidebar-closed'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        
        {/* Close button - Mobile only */}
        <div className="absolute top-4 right-4 lg:hidden">
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Logo section - Desktop only */}
        <div className="hidden lg:flex h-16 items-center px-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-bold text-gray-900">
                <span className="text-primary-600">Emp</span>Sync
              </h1>
            </div>
          </div>
        </div>

        {/* User info section */}
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{userRole}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {filteredNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => onClose()}
              className={({ isActive }) => `
                group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <item.icon
                className={`
                  mr-3 h-5 w-5 flex-shrink-0
                  ${item.current ? 'text-primary-700' : 'text-gray-400 group-hover:text-gray-500'}
                `}
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4">
          <div className="text-xs text-gray-500 text-center">
            <p>© 2024 EmpSync</p>
            <p className="mt-1">Employee Management System</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarModern;
