export interface Exercise {
  id: string;
  name: string;
  reps: number;
  sets: number;
  weight?: number;
  notes?: string;
  unit?: 'kg' | 'lbs';
}

export interface WorkoutPlan {
  id: string;
  date: string;
  focus: string;
  exercises: Exercise[];
  notes?: string;
  completed?: boolean;
}

export interface BodyStats {
  id: string;
  date: string;
  weight: number;
  bodyFatPercentage: number;
  musclePercentage: number;
  boneWeight: number;
  waterPercentage: number;
  bmi: number;
  metabolismRate: number;
  unit: 'kg';
  user_id?: string;
}