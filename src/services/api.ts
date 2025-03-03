import { createClient } from '@supabase/supabase-js';
import { WorkoutPlan, BodyStats } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

// Workout API calls
export const fetchWorkouts = async (): Promise<WorkoutPlan[]> => {
  try {
    const { data, error } = await supabase
      .from('workout_plans')
      .select('*')
      .order('date');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }
};

export const fetchWorkoutById = async (id: string): Promise<WorkoutPlan> => {
  try {
    const { data, error } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching workout:', error);
    throw error;
  }
};

export const createWorkout = async (workout: WorkoutPlan): Promise<WorkoutPlan> => {
  try {
    const { data, error } = await supabase
      .from('workout_plans')
      .insert(workout)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating workout:', error);
    throw error;
  }
};

export const updateWorkout = async (workout: WorkoutPlan): Promise<WorkoutPlan> => {
  try {
    const { data, error } = await supabase
      .from('workout_plans')
      .update(workout)
      .eq('id', workout.id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating workout:', error);
    throw error;
  }
};

export const deleteWorkout = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('workout_plans')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
};

export const toggleWorkoutCompletion = async (id: string): Promise<WorkoutPlan> => {
  try {
    // First get the current workout
    const { data: workout, error: fetchError } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) throw fetchError;
    
    // Then toggle the completion status
    const { data, error } = await supabase
      .from('workout_plans')
      .update({ completed: !workout.completed })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error toggling workout completion:', error);
    throw error;
  }
};

// Body Stats API calls
export const fetchBodyStats = async (): Promise<BodyStats[]> => {
  try {
    const { data, error } = await supabase
      .from('body_stats')
      .select('*')
      .order('date');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching body stats:', error);
    throw error;
  }
};

export const fetchBodyStatsById = async (id: string): Promise<BodyStats> => {
  try {
    const { data, error } = await supabase
      .from('body_stats')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching body stats:', error);
    throw error;
  }
};

export const createBodyStats = async (bodyStats: BodyStats): Promise<BodyStats> => {
  try {
    const formattedBodyStats = {
      id: bodyStats.id,
      date: bodyStats.date,
      weight: bodyStats.weight,
      body_fat_percentage: bodyStats.bodyFatPercentage,
      muscle_percentage: bodyStats.musclePercentage,
      bone_weight: bodyStats.boneWeight,
      water_percentage: bodyStats.waterPercentage,
      bmi: bodyStats.bmi,
      metabolism_rate: bodyStats.metabolismRate,
      user_id: bodyStats.user_id
    };
    
    const { data, error } = await supabase
      .from('body_stats')
      .insert(formattedBodyStats)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating body stats:', error);
    throw error;
  }
};

export const updateBodyStats = async (bodyStats: BodyStats): Promise<BodyStats> => {
  try {
    const formattedBodyStats = {
      id: bodyStats.id,
      date: bodyStats.date,
      weight: bodyStats.weight,
      body_fat_percentage: bodyStats.bodyFatPercentage,
      muscle_percentage: bodyStats.musclePercentage,
      bone_weight: bodyStats.boneWeight,
      water_percentage: bodyStats.waterPercentage,
      bmi: bodyStats.bmi,
      metabolism_rate: bodyStats.metabolismRate,
      user_id: bodyStats.user_id
    };
    
    const { data, error } = await supabase
      .from('body_stats')
      .update(formattedBodyStats)
      .eq('id', bodyStats.id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating body stats:', error);
    throw error;
  }
};

export const deleteBodyStats = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('body_stats')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting body stats:', error);
    throw error;
  }
};
