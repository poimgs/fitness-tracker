import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { format } from 'date-fns';
import { Exercise, WorkoutPlan } from '../types';

interface ExerciseHistory {
  date: string;
  weight: number;
  reps: number;
  sets: number;
  unit: 'kg' | 'lbs';
  workoutId: string;
}

interface ExerciseData {
  name: string;
  history: ExerciseHistory[];
}

const WorkoutTracker: React.FC = () => {
  const { workouts } = useAppContext();
  const [exerciseData, setExerciseData] = useState<ExerciseData[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [latestWorkout, setLatestWorkout] = useState<WorkoutPlan | null>(null);

  // Process workout data to get exercise history from the latest completed workout
  useEffect(() => {
    // Filter only completed workouts
    const completedWorkouts = workouts.filter(workout => workout.completed);
    
    // Sort workouts by date (newest first)
    const sortedWorkouts = [...completedWorkouts].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Get the latest completed workout
    const latest = sortedWorkouts.length > 0 ? sortedWorkouts[0] : null;
    setLatestWorkout(latest);
    
    if (!latest) {
      setExerciseData([]);
      return;
    }
    
    const exerciseMap = new Map<string, ExerciseHistory[]>();
    
    // Extract exercise data from the latest workout only
    latest.exercises.forEach(exercise => {
      if (!exercise.name) return;
      
      const history: ExerciseHistory = {
        date: latest.date,
        weight: exercise.weight || 0,
        reps: exercise.reps,
        sets: exercise.sets,
        unit: exercise.unit || 'kg',
        workoutId: latest.id
      };
      
      if (exerciseMap.has(exercise.name)) {
        exerciseMap.get(exercise.name)?.push(history);
      } else {
        exerciseMap.set(exercise.name, [history]);
      }
    });
    
    // Convert map to array and sort by exercise name
    const exerciseDataArray: ExerciseData[] = Array.from(exerciseMap.entries())
      .map(([name, history]) => ({ name, history }))
      .sort((a, b) => a.name.localeCompare(b.name));
    
    setExerciseData(exerciseDataArray);
    
    // Set default selected exercise if available
    if (exerciseDataArray.length > 0 && !selectedExercise) {
      setSelectedExercise(exerciseDataArray[0].name);
    }
  }, [workouts, selectedExercise]);

  // Get the selected exercise data
  const selectedExerciseData = exerciseData.find(data => data.name === selectedExercise);
  
  // Get the latest record
  const latestRecord = selectedExerciseData?.history[0];

  // Find the same exercise in previous workouts for comparison
  const findPreviousRecord = () => {
    if (!selectedExercise) return null;
    
    // Filter only completed workouts
    const completedWorkouts = workouts.filter(workout => workout.completed);
    
    // Sort workouts by date (newest first)
    const sortedWorkouts = [...completedWorkouts].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Skip the latest workout (index 0) and look for the same exercise in previous workouts
    for (let i = 1; i < sortedWorkouts.length; i++) {
      const workout = sortedWorkouts[i];
      const exercise = workout.exercises.find(ex => ex.name === selectedExercise);
      
      if (exercise) {
        return {
          date: workout.date,
          weight: exercise.weight || 0,
          reps: exercise.reps,
          sets: exercise.sets,
          unit: exercise.unit || 'kg',
          workoutId: workout.id
        };
      }
    }
    
    return null;
  };

  const previousRecord = findPreviousRecord();

  if (!latestWorkout) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Latest Completed Workout</h2>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No completed workouts found. Complete a workout to see your progress.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Latest Completed Workout</h2>
      <p className="text-gray-600 mb-4">
        {format(new Date(latestWorkout.date), 'EEEE, MMMM d, yyyy')} - {latestWorkout.focus}
      </p>
      
      {exerciseData.length > 0 ? (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="exerciseFilter">
              Select Exercise
            </label>
            <select
              id="exerciseFilter"
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {exerciseData.map((data) => (
                <option key={data.name} value={data.name}>
                  {data.name}
                </option>
              ))}
            </select>
          </div>

          {selectedExerciseData && latestRecord && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Performance: {selectedExercise}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                  <span className="text-gray-600 text-sm">Weight</span>
                  <p className="text-xl font-semibold">
                    {latestRecord.weight > 0 ? `${latestRecord.weight} ${latestRecord.unit}` : 'Body weight'}
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded">
                  <span className="text-gray-600 text-sm">Reps</span>
                  <p className="text-xl font-semibold">{latestRecord.reps}</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded">
                  <span className="text-gray-600 text-sm">Sets</span>
                  <p className="text-xl font-semibold">{latestRecord.sets}</p>
                </div>

                {previousRecord && latestRecord.weight > 0 && previousRecord.weight > 0 && (
                  <div className="bg-emerald-50 p-4 rounded">
                    <span className="text-gray-600 text-sm">Weight Change</span>
                    <p className="text-xl font-semibold">
                      <span className={latestRecord.weight > previousRecord.weight ? 'text-green-500' : 'text-red-500'}>
                        {latestRecord.weight > previousRecord.weight ? '↑' : '↓'} 
                        {Math.abs(latestRecord.weight - previousRecord.weight).toFixed(1)} {latestRecord.unit}
                      </span>
                    </p>
                    <span className="text-xs text-gray-500">Since {format(new Date(previousRecord.date), 'MMM d')}</span>
                  </div>
                )}
                
                {previousRecord && (
                  <div className="bg-amber-50 p-4 rounded">
                    <span className="text-gray-600 text-sm">Reps Change</span>
                    <p className="text-xl font-semibold">
                      <span className={latestRecord.reps > previousRecord.reps ? 'text-green-500' : 'text-red-500'}>
                        {latestRecord.reps > previousRecord.reps ? '↑' : '↓'} 
                        {Math.abs(latestRecord.reps - previousRecord.reps)}
                      </span>
                    </p>
                    <span className="text-xs text-gray-500">Since {format(new Date(previousRecord.date), 'MMM d')}</span>
                  </div>
                )}
                
                {previousRecord && (
                  <div className="bg-indigo-50 p-4 rounded">
                    <span className="text-gray-600 text-sm">Sets Change</span>
                    <p className="text-xl font-semibold">
                      <span className={latestRecord.sets > previousRecord.sets ? 'text-green-500' : 'text-red-500'}>
                        {latestRecord.sets > previousRecord.sets ? '↑' : '↓'} 
                        {Math.abs(latestRecord.sets - previousRecord.sets)}
                      </span>
                    </p>
                    <span className="text-xs text-gray-500">Since {format(new Date(previousRecord.date), 'MMM d')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No exercises found in the latest completed workout.</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutTracker;
