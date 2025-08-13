import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Megaphone, 
  Building2, 
  Library, 
  Monitor,  
  Menu,
  X
} from 'lucide-react';
import { theme } from '../../utils/constants';

// Types
interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

interface SidebarProps {
  onMenuClick: (itemId: string) => void;
  onLogout: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  currentPath?: string; // This should be the current URL path
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onMenuClick,
  isCollapsed: externalCollapsed, 
  onToggleCollapse,
  currentPath 
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(false);
  const [urlPath, setUrlPath] = useState<string>(() => 
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  // Use external collapsed state if provided, otherwise use internal state
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  
  // Use external toggle function if provided, otherwise use internal function
  const toggleCollapsed = onToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/dashboard'
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: <Megaphone className="h-5 w-5" />,
      path: '/announcements',
    },
    {
      id: 'business',
      label: 'Business',
      icon: <Building2 className="h-5 w-5" />,
      path: '/business'
    },
    {
      id: 'library',
      label: 'Library',
      icon: <Library className="h-5 w-5" />,
      path: '/library'
    },
    {
      id: 'program',
      label: 'Program',
      icon: <Monitor className="h-5 w-5" />,
      path: '/program'
    }
  ];

  // Listen for URL changes
  useEffect(() => {
    const updatePath = () => {
      if (typeof window !== 'undefined') {
        setUrlPath(window.location.pathname);
      }
    };

    // Listen for popstate (back/forward buttons)
    window.addEventListener('popstate', updatePath);
    
    // Listen for pushstate/replacestate (programmatic navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      updatePath();
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      updatePath();
    };

    return () => {
      window.removeEventListener('popstate', updatePath);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  // Get current active item based on URL - using useMemo for performance
  const activeItem = useMemo(() => {
    // Use currentPath prop if provided, otherwise use internal urlPath state
    const path = currentPath || urlPath;
    
    // Handle root path
    if (path === '/' || path === '') {
      return 'dashboard';
    }
    
    // Find matching menu item by path
    const matchingItem = menuItems.find(item => {
      // Check if current path starts with the menu item path
      return path.startsWith(item.path);
    });
    
    return matchingItem ? matchingItem.id : 'dashboard';
  }, [currentPath, urlPath]);

  const handleMenuClick = (item: MenuItem): void => {
    onMenuClick(item.id);
  };

  const isActiveRoute = (itemId: string): boolean => {
    return activeItem === itemId;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleCollapsed}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full bg-white shadow-xl transition-all duration-300 z-30 ${
          isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'w-64'
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!isCollapsed && (
            <>
              <div className="flex items-center space-x-3">
                <div 
                  className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: theme.secondary }}
                >
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="font-semibold text-gray-800">Admin Panel</span>
              </div>
              <button
                onClick={toggleCollapsed}
                className="lg:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </>
          )}
          
          {isCollapsed && (
            <button
              onClick={toggleCollapsed}
              className="w-full flex justify-center p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActiveRoute(item.id)
                  ? 'text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
              style={{
                backgroundColor: isActiveRoute(item.id) ? theme.secondary : 'transparent'
              }}
            >
              <span className={`${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                {item.icon}
              </span>
              
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span 
                      className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white rounded-full"
                      style={{ backgroundColor: theme.primary }}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Collapse Toggle (Desktop) */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={toggleCollapsed}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleCollapsed}
        className="fixed top-4 left-4 z-40 lg:hidden p-2 bg-white rounded-lg shadow-lg"
        style={{ display: isCollapsed ? 'block' : 'none' }}
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </button>
    </>
  );
};

export default Sidebar;