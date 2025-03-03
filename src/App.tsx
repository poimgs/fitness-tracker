import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import WorkoutPlans from './components/WorkoutPlans';
import BodyStats from './components/BodyStats';
import Growth from './components/Growth';
import Login from './pages/Login';

// Main application component that requires authentication
const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { user, loading, signOut } = useAuth();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'workouts':
        return <WorkoutPlans />;
      case 'bodyStats':
        return <BodyStats />;
      case 'growth':
        return <Growth />;
      default:
        return <Dashboard />;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If not authenticated, show login page
  if (!user) {
    return <Login />;
  }

  // Authenticated UI
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          onSignOut={signOut}
          userName={user.email || 'User'}
        />
        <main className="flex-1 max-w-7xl w-full mx-auto">
          {renderPage()}
        </main>
      </div>
    </AppProvider>
  );
};

// Root component that provides authentication context
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;