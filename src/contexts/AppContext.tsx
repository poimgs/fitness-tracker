import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WorkoutPlan, BodyStats } from '../types';
import * as api from '../services/api';
import { useAuth } from './AuthContext';

interface AppContextProps {
  workouts: WorkoutPlan[];
  bodyStats: BodyStats[];
  addWorkout: (workout: WorkoutPlan) => void;
  updateWorkout: (workout: WorkoutPlan) => void;
  deleteWorkout: (id: string) => void;
  toggleWorkoutCompletion: (id: string) => void;
  addBodyStats: (stats: BodyStats) => void;
  updateBodyStats: (stats: BodyStats) => void;
  deleteBodyStats: (id: string) => void;
  isLoading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [bodyStats, setBodyStats] = useState<BodyStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load data from API when user is authenticated
  useEffect(() => {
    if (!user) {
      setWorkouts([]);
      setBodyStats([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch workouts
        const workoutsData = await api.fetchWorkouts();
        setWorkouts(workoutsData);
        
        // Fetch body stats
        const bodyStatsData = await api.fetchBodyStats();
        setBodyStats(bodyStatsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        
        // Fallback to localStorage if API fails
        const storedWorkouts = localStorage.getItem('workouts');
        const storedBodyStats = localStorage.getItem('bodyStats');

        if (storedWorkouts) {
          setWorkouts(JSON.parse(storedWorkouts));
        }

        if (storedBodyStats) {
          setBodyStats(JSON.parse(storedBodyStats));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Save data to localStorage as backup
  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('bodyStats', JSON.stringify(bodyStats));
  }, [bodyStats]);

  const addWorkout = async (workout: WorkoutPlan) => {
    if (!user) return;
    
    try {
      // Add user_id to the workout
      const workoutWithUser = {
        ...workout,
        user_id: user.id
      };
      
      const newWorkout = await api.createWorkout(workoutWithUser);
      setWorkouts([...workouts, newWorkout]);
    } catch (err) {
      console.error('Error adding workout:', err);
      setError('Failed to add workout. Please try again.');
    }
  };

  const updateWorkout = async (workout: WorkoutPlan) => {
    if (!user) return;
    
    try {
      const updatedWorkout = await api.updateWorkout(workout);
      setWorkouts(workouts.map(w => (w.id === workout.id ? updatedWorkout : w)));
    } catch (err) {
      console.error('Error updating workout:', err);
      setError('Failed to update workout. Please try again.');
    }
  };

  const deleteWorkout = async (id: string) => {
    if (!user) return;
    
    try {
      await api.deleteWorkout(id);
      setWorkouts(workouts.filter(w => w.id !== id));
    } catch (err) {
      console.error('Error deleting workout:', err);
      setError('Failed to delete workout. Please try again.');
    }
  };

  const toggleWorkoutCompletion = async (id: string) => {
    if (!user) return;
    
    try {
      const updatedWorkout = await api.toggleWorkoutCompletion(id);
      setWorkouts(workouts.map(w => 
        w.id === id ? updatedWorkout : w
      ));
    } catch (err) {
      console.error('Error toggling workout completion:', err);
      setError('Failed to update workout status. Please try again.');
    }
  };

  const addBodyStats = async (stats: BodyStats) => {
    if (!user) return;
    
    try {
      // Add user_id to the body stats
      const statsWithUser = {
        ...stats,
        user_id: user.id
      };
      
      const newStats = await api.createBodyStats(statsWithUser);
      setBodyStats([...bodyStats, newStats]);
    } catch (err) {
      console.error('Error adding body stats:', err);
      setError('Failed to add body stats. Please try again.');
    }
  };

  const updateBodyStats = async (stats: BodyStats) => {
    if (!user) return;
    
    try {
      // Add user_id to the body stats
      const statsWithUser = {
        ...stats,
        user_id: user.id
      };
      
      const updatedStats = await api.updateBodyStats(statsWithUser);
      setBodyStats(bodyStats.map(s => (s.id === stats.id ? updatedStats : s)));
    } catch (err) {
      console.error('Error updating body stats:', err);
      setError('Failed to update body stats. Please try again.');
    }
  };

  const deleteBodyStats = async (id: string) => {
    if (!user) return;
    
    try {
      await api.deleteBodyStats(id);
      setBodyStats(bodyStats.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error deleting body stats:', err);
      setError('Failed to delete body stats. Please try again.');
    }
  };

  return (
    <AppContext.Provider
      value={{
        workouts,
        bodyStats,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        toggleWorkoutCompletion,
        addBodyStats,
        updateBodyStats,
        deleteBodyStats,
        isLoading,
        error
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};