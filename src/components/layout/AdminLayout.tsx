import React, { useState } from 'react';
import {
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings
} from 'lucide-react';

// Theme colors
const theme = {
  primary: "#92875E",
  primaryDark: "#5C5E3D",
  secondary: "#eab308",
  background: "#1B3C46",
  text: "#B0B0B0",
  textActive: "#FFFFFF",
  semiTransparent: "rgba(255, 255, 255, 0.1)"
} as const;

import Sidebar from './Sidebar';
import { signOut } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

// User data from localhost
const userData = {
  username: "Jafaria Superadmin",
  email: "superadmin@yopmail.com",
  role: "superadmin"
};

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [activeMenuItem, setActiveMenuItem] = useState<string>('dashboard');
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  const handleMenuClick = (itemId: string): void => {
    setActiveMenuItem(itemId);
    navigate(`/${itemId}`);
  };

  const handleLogout = (): void => {
    signOut();
  };

  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    console.log('Search for:', searchQuery);
    setShowSearch(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar
        onMenuClick={handleMenuClick}
        onLogout={handleLogout}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}>

        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">

              {/* Left side - Mobile menu & Search */}
              <div className="flex items-center space-x-4">
                {/* Mobile menu button */}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </button>

                {/* Search */}
                <div className="hidden md:block relative">
                  {showSearch ? (
                    <div onSubmit={handleSearch} className="flex items-center">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                          placeholder="Search..."
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 w-64"
                          autoFocus
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowSearch(false)}
                        className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowSearch(true)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Center - Page Title (could be dynamic based on route) */}
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-800 capitalize">
                  {activeMenuItem.replace('-', ' ')}
                </h1>
              </div>

              {/* Right side - User menu only */}
              <div className="flex items-center">
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: theme.primary }}
                    >
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-800">{userData.username}</p>
                      <p className="text-xs text-gray-500 capitalize">{userData.role}</p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''
                      }`} />
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                      <div className="p-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-800">{userData.username}</p>
                        <p className="text-xs text-gray-500">{userData.email}</p>
                      </div>

                      <div className="py-2">
                        <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          <User className="h-4 w-4 mr-3" />
                          Profile
                        </button>
                        <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          <Settings className="h-4 w-4 mr-3" />
                          Settings
                        </button>
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - This is where your Outlet/Router content goes */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Search Overlay */}
      {showSearch && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="bg-white p-4">
            <div onSubmit={handleSearch} className="flex items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="ml-3 p-3 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside handler */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;