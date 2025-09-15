'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Plus, 
  Search, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User,
  Building2
} from 'lucide-react';
import Button from './ui/Button';

const Navigation = () => {
  const { user, logout, hasRole, hasAnyRole } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      roles: ['request_initiator', 'procurement_manager', 'procurement_officer', 'general_user']
    },
    {
      name: 'Create Request',
      href: '/create-request',
      icon: Plus,
      roles: ['request_initiator']
    },
    {
      name: 'My Requests',
      href: '/my-requests',
      icon: FileText,
      roles: ['request_initiator', 'general_user']
    },
    {
      name: 'All Requests',
      href: '/all-requests',
      icon: Search,
      roles: ['procurement_manager', 'procurement_officer']
    },
    {
      name: 'Manage Officers',
      href: '/manage-officers',
      icon: Users,
      roles: ['procurement_manager']
    },
    {
      name: 'Track Request',
      href: '/track',
      icon: Search,
      roles: ['general_user'],
      public: true
    }
  ];

  const filteredItems = navigationItems.filter(item => 
    item.public || (user && hasAnyRole(item.roles))
  );

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">HESU Procurement</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <User className="h-4 w-4" />
              <span>{user.name}</span>
              <span className="text-gray-400">({user.role.replace('_', ' ')})</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700">
                <User className="h-4 w-4" />
                <span>{user.name}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="w-full justify-start"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
