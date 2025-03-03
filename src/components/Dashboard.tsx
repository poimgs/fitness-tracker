import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Activity, Weight, BarChart } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { workouts, bodyStats } = useAppContext();

  // Sort workouts by date (newest first)
  const sortedWorkouts = [...workouts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get the latest workout
  const latestWorkout = sortedWorkouts[0];

  // Sort body stats by date (newest first)
  const sortedBodyStats = [...bodyStats].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get the latest stats
  const latestStats = sortedBodyStats[0];

  // Calculate weight change if we have at least 2 measurements
  const weightChange = sortedBodyStats.length >= 2 
    ? latestStats?.weight - sortedBodyStats[1].weight
    : 0;

  const workoutCount = workouts.length;
  
  // Calculate workout frequency (last 30 days)
  const workoutsLast30Days = workouts.filter(workout => {
    const workoutDate = parseISO(workout.date);
    const today = new Date();
    return differenceInDays(today, workoutDate) <= 30;
  }).length;


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Workout summary card */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <Activity className="h-5 w-5 mr-2 text-blue-500" />
            <h2 className="text-lg font-semibold">Workout Summary</h2>
          </div>
          <p className="text-gray-600">Total workouts: {workoutCount}</p>
          <p className="text-gray-600">Last 30 days: {workoutsLast30Days}</p>
        </div>

        {/* Latest workout card */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <Weight className="h-5 w-5 mr-2 text-green-500" />
            <h2 className="text-lg font-semibold">Latest Workout</h2>
          </div>
          {latestWorkout ? (
            <>
              <p className="font-medium">{format(new Date(latestWorkout.date), 'MMM d, yyyy')}</p>
              <p className="text-gray-600">Focus: {latestWorkout.focus}</p>
              <p className="text-gray-600">Exercises: {latestWorkout.exercises.length}</p>
            </>
          ) : (
            <p className="text-gray-500 italic">No workouts recorded yet</p>
          )}
        </div>

        {/* Body stats card */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <BarChart className="h-5 w-5 mr-2 text-purple-500" />
            <h2 className="text-lg font-semibold">Body Stats</h2>
          </div>
          {latestStats ? (
            <>
              <p className="font-medium">{format(new Date(latestStats.date), 'MMM d, yyyy')}</p>
              <p className="text-gray-600">
                Weight: {latestStats.weight} {latestStats.unit}
                {weightChange !== 0 && (
                  <span className={`ml-2 ${weightChange < 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} {latestStats.unit}
                  </span>
                )}
              </p>
              <p className="text-gray-600">BMI: {latestStats.bmi.toFixed(1)}</p>
              <p className="text-gray-600">Body Fat: {latestStats.bodyFatPercentage}%</p>
            </>
          ) : (
            <p className="text-gray-500 italic">No body stats recorded yet</p>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Recent Workouts</h2>
          {sortedWorkouts.length > 0 ? (
            <div className="divide-y">
              {sortedWorkouts.slice(0, 5).map(workout => (
                <div key={workout.id} className="py-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{format(new Date(workout.date), 'MMM d, yyyy')}</span>
                    <span className="text-gray-600">{workout.focus}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No workouts recorded yet</p>
          )}
        </div>

        <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Recent Body Stats</h2>
          {sortedBodyStats.length > 0 ? (
            <div className="divide-y">
              {sortedBodyStats.slice(0, 5).map(stat => (
                <div key={stat.id} className="py-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{format(new Date(stat.date), 'MMM d, yyyy')}</span>
                    <span className="text-gray-600">
                      {stat.weight} {stat.unit}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 mt-1">
                    <p className="text-xs text-gray-500">BF: {stat.bodyFatPercentage}%</p>
                    <p className="text-xs text-gray-500">Muscle: {stat.musclePercentage}%</p>
                    <p className="text-xs text-gray-500">BMI: {stat.bmi.toFixed(1)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No body stats recorded yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;