import React, { useState } from 'react';
import { Dumbbell, User, BarChart, LayoutDashboard, Menu, X, LogOut } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onSignOut: () => Promise<any>;
  userName: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage, onSignOut, userName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
    { name: 'Workouts', icon: Dumbbell, id: 'workouts' },
    { name: 'Body Stats', icon: User, id: 'bodyStats' },
    { name: 'Growth', icon: BarChart, id: 'growth' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await onSignOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Dumbbell className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-bold">FitTrack</span>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === item.id
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-1" />
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* sign out (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleSignOut}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsMenuOpen(false);
                }}
                className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === item.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </button>
            ))}
            
            {/* User info and sign out (mobile) */}
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5">
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{userName}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;