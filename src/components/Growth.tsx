import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { format, parseISO, differenceInDays } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Filter, Check } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Growth: React.FC = () => {
  const { workouts, bodyStats } = useAppContext();
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '6m' | '1y' | 'all'>('3m');
  const [selectedExercise, setSelectedExercise] = useState<string | 'all'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  // State for tracking which stats to display
  const [selectedStats, setSelectedStats] = useState({
    weight: true,
    bodyFat: true,
    muscle: true,
    bone: false,
    water: false,
    bmi: true,
    metabolism: false
  });

  // Get filtered stats based on time range
  const getFilteredStats = () => {
    const sortedStats = [...bodyStats].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (timeRange === 'all' || sortedStats.length === 0) {
      return sortedStats;
    }

    const now = new Date();
    const days = timeRange === '1m' ? 30 : timeRange === '3m' ? 90 : timeRange === '6m' ? 180 : 365;
    
    return sortedStats.filter(stat => {
      const statDate = parseISO(stat.date);
      return differenceInDays(now, statDate) <= days;
    });
  };

  const filteredStats = getFilteredStats();
  
  // Get filtered workouts based on time range
  const getFilteredWorkouts = () => {
    const sortedWorkouts = [...workouts].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (timeRange === 'all' || sortedWorkouts.length === 0) {
      return sortedWorkouts;
    }

    const now = new Date();
    const days = timeRange === '1m' ? 30 : timeRange === '3m' ? 90 : timeRange === '6m' ? 180 : 365;
    
    return sortedWorkouts.filter(workout => {
      const workoutDate = parseISO(workout.date);
      return differenceInDays(now, workoutDate) <= days;
    });
  };

  const filteredWorkouts = getFilteredWorkouts();

  // Prepare weight data for chart
  const weightData = {
    labels: filteredStats.map(stat => format(new Date(stat.date), 'MMM d')),
    datasets: [
      {
        label: 'Weight (kg)',
        data: filteredStats.map(stat => stat.weight),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.2,
        fill: true,
        hidden: !selectedStats.weight,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Prepare body composition data for chart
  const bodyCompositionData = {
    labels: filteredStats.map(stat => format(new Date(stat.date), 'MMM d')),
    datasets: [
      {
        label: 'Body Fat %',
        data: filteredStats.map(stat => stat.bodyFatPercentage),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.2,
        hidden: !selectedStats.bodyFat,
        borderWidth: 2,
      },
      {
        label: 'Muscle %',
        data: filteredStats.map(stat => stat.musclePercentage),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.2,
        hidden: !selectedStats.muscle,
        borderWidth: 2,
      },
      {
        label: 'Bone Weight (kg)',
        data: filteredStats.map(stat => stat.boneWeight),
        borderColor: 'rgb(75, 192, 75)',
        backgroundColor: 'rgba(75, 192, 75, 0.2)',
        tension: 0.2,
        hidden: !selectedStats.bone,
        borderWidth: 2,
      },
      {
        label: 'Water %',
        data: filteredStats.map(stat => stat.waterPercentage),
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.2,
        hidden: !selectedStats.water,
        borderWidth: 2,
      },
    ],
  };

  // Calculate BMI trend
  const bmiData = {
    labels: filteredStats.map(stat => format(new Date(stat.date), 'MMM d')),
    datasets: [
      {
        label: 'BMI',
        data: filteredStats.map(stat => stat.bmi),
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        tension: 0.2,
        fill: true,
        hidden: !selectedStats.bmi,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Prepare metabolism rate data for chart
  const metabolismData = {
    labels: filteredStats.map(stat => format(new Date(stat.date), 'MMM d')),
    datasets: [
      {
        label: 'Metabolism Rate (kcal)',
        data: filteredStats.map(stat => stat.metabolismRate),
        borderColor: 'rgb(75, 192, 75)',
        backgroundColor: 'rgba(75, 192, 75, 0.2)',
        tension: 0.2,
        fill: true,
        hidden: !selectedStats.metabolism,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Combine all body stats datasets for the All Stats chart
  const allStatsData = {
    labels: filteredStats.map(stat => format(new Date(stat.date), 'MMM d')),
    datasets: [
      {
        label: 'Weight (kg)',
        data: filteredStats.map(stat => stat.weight),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.2,
        yAxisID: 'y',
        hidden: !selectedStats.weight,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Body Fat %',
        data: filteredStats.map(stat => stat.bodyFatPercentage),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.2,
        yAxisID: 'y1',
        hidden: !selectedStats.bodyFat,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Muscle %',
        data: filteredStats.map(stat => stat.musclePercentage),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.2,
        yAxisID: 'y1',
        hidden: !selectedStats.muscle,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Bone Weight (kg)',
        data: filteredStats.map(stat => stat.boneWeight),
        borderColor: 'rgb(75, 192, 75)',
        backgroundColor: 'rgba(75, 192, 75, 0.2)',
        tension: 0.2,
        yAxisID: 'y',
        hidden: !selectedStats.bone,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Water %',
        data: filteredStats.map(stat => stat.waterPercentage),
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.2,
        yAxisID: 'y1',
        hidden: !selectedStats.water,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'BMI',
        data: filteredStats.map(stat => stat.bmi),
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        tension: 0.2,
        yAxisID: 'y2',
        hidden: !selectedStats.bmi,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Metabolism (kcal)',
        data: filteredStats.map(stat => stat.metabolismRate),
        borderColor: 'rgb(255, 205, 86)',
        backgroundColor: 'rgba(255, 205, 86, 0.2)',
        tension: 0.2,
        yAxisID: 'y3',
        hidden: !selectedStats.metabolism,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Get all unique exercises with weights
  const getAllExercises = () => {
    const exerciseSet = new Set<string>();
    
    filteredWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (exercise.weight) {
          exerciseSet.add(exercise.name);
        }
      });
    });
    
    return Array.from(exerciseSet).sort();
  };

  const uniqueExercises = getAllExercises();

  // Calculate exercise progress for one or all exercises
  const calculateExerciseProgress = () => {
    if (selectedExercise === 'all') {
      // Get the top 5 exercises with most records
      const exerciseCounts: Record<string, number> = {};
      filteredWorkouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
          if (exercise.weight) {
            exerciseCounts[exercise.name] = (exerciseCounts[exercise.name] || 0) + 1;
          }
        });
      });

      const topExercises = Object.entries(exerciseCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(entry => entry[0]);

      // Prepare datasets for each top exercise
      const datasets = topExercises.map((exerciseName, index) => {
        const exerciseData: { date: string; weight: number; unit: string }[] = [];
        
        filteredWorkouts.forEach(workout => {
          const exercise = workout.exercises.find(e => e.name === exerciseName && e.weight);
          if (exercise) {
            exerciseData.push({
              date: workout.date,
              weight: exercise.weight || 0,
              unit: exercise.unit || 'kg'
            });
          }
        });

        // Sort by date
        exerciseData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const colors = [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 206, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
        ];

        return {
          label: exerciseName,
          data: exerciseData.map(d => d.weight),
          dates: exerciseData.map(d => format(new Date(d.date), 'MMM d')),
          unit: exerciseData.map(d => d.unit),
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length] + '20',
          tension: 0.2,
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        };
      });

      return datasets;
    } else {
      // For a specific exercise
      const exerciseData: { date: string; weight: number; unit: string }[] = [];
      
      filteredWorkouts.forEach(workout => {
        const exercise = workout.exercises.find(e => e.name === selectedExercise && e.weight);
        if (exercise) {
          exerciseData.push({
            date: workout.date,
            weight: exercise.weight || 0,
            unit: exercise.unit || 'kg'
          });
        }
      });

      // Sort by date
      exerciseData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      if (exerciseData.length === 0) {
        return [];
      }

      return [{
        label: selectedExercise,
        data: exerciseData.map(d => d.weight),
        dates: exerciseData.map(d => format(new Date(d.date), 'MMM d')),
        unit: exerciseData.map(d => d.unit),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.2,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }];
    }
  };

  const exerciseProgress = calculateExerciseProgress();

  const exerciseProgressData = {
    labels: exerciseProgress.length > 0 ? exerciseProgress[0].dates : [],
    datasets: exerciseProgress.map((exercise, index) => ({
      label: `${exercise.label} (${exercise.unit[0] || 'kg'})`,
      data: exercise.data,
      borderColor: exercise.borderColor,
      backgroundColor: exercise.backgroundColor,
      tension: 0.2,
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    })),
  };

  // Toggle stat visibility
  const toggleStatVisibility = (stat: keyof typeof selectedStats) => {
    setSelectedStats(prev => ({
      ...prev,
      [stat]: !prev[stat]
    }));
  };

  // Count active stats
  const activeStatsCount = Object.values(selectedStats).filter(Boolean).length;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Growth & Statistics</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('1m')}
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === '1m' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            1M
          </button>
          <button
            onClick={() => setTimeRange('3m')}
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === '3m' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            3M
          </button>
          <button
            onClick={() => setTimeRange('6m')}
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === '6m' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            6M
          </button>
          <button
            onClick={() => setTimeRange('1y')}
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === '1y' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            1Y
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {bodyStats.length === 0 && workouts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No data available yet. Start tracking your workouts and body stats!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Body Stats Section */}
          {bodyStats.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Body Stats Trends</h2>
                <div className="relative">
                  <button 
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="flex items-center bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-gray-700 text-sm"
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    <span>Filter Stats</span>
                    {activeStatsCount !== Object.keys(selectedStats).length && (
                      <span className="ml-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {activeStatsCount}
                      </span>
                    )}
                  </button>
                  
                  {showFilterMenu && (
                    <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg z-10 border">
                      <div className="p-2">
                        <div className="text-sm font-medium text-gray-700 mb-2 border-b pb-1">Select Stats to Display</div>
                        <div className="space-y-1">
                          <label className="flex items-center p-1 hover:bg-gray-50 rounded cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={selectedStats.weight} 
                              onChange={() => toggleStatVisibility('weight')}
                              className="mr-2"
                            />
                            <span className="text-sm">Weight</span>
                          </label>
                          <label className="flex items-center p-1 hover:bg-gray-50 rounded cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={selectedStats.bodyFat} 
                              onChange={() => toggleStatVisibility('bodyFat')}
                              className="mr-2"
                            />
                            <span className="text-sm">Body Fat %</span>
                          </label>
                          <label className="flex items-center p-1 hover:bg-gray-50 rounded cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={selectedStats.muscle} 
                              onChange={() => toggleStatVisibility('muscle')}
                              className="mr-2"
                            />
                            <span className="text-sm">Muscle %</span>
                          </label>
                          <label className="flex items-center p-1 hover:bg-gray-50 rounded cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={selectedStats.bone} 
                              onChange={() => toggleStatVisibility('bone')}
                              className="mr-2"
                            />
                            <span className="text-sm">Bone Weight (kg)</span>
                          </label>
                          <label className="flex items-center p-1 hover:bg-gray-50 rounded cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={selectedStats.water} 
                              onChange={() => toggleStatVisibility('water')}
                              className="mr-2"
                            />
                            <span className="text-sm">Water %</span>
                          </label>
                          <label className="flex items-center p-1 hover:bg-gray-50 rounded cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={selectedStats.bmi} 
                              onChange={() => toggleStatVisibility('bmi')}
                              className="mr-2"
                            />
                            <span className="text-sm">BMI</span>
                          </label>
                          <label className="flex items-center p-1 hover:bg-gray-50 rounded cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={selectedStats.metabolism} 
                              onChange={() => toggleStatVisibility('metabolism')}
                              className="mr-2"
                            />
                            <span className="text-sm">Metabolism Rate</span>
                          </label>
                        </div>
                        <div className="flex justify-between mt-2 pt-2 border-t">
                          <button 
                            onClick={() => setSelectedStats({weight: true, bodyFat: true, muscle: true, bone: true, water: true, bmi: true, metabolism: true})}
                            className="text-xs text-blue-500 hover:text-blue-700"
                          >
                            Select All
                          </button>
                          <button 
                            onClick={() => setShowFilterMenu(false)}
                            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* All Stats Combined Chart */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">All Stats Overview</h3>
                <div className="h-80 p-2 bg-gray-50 rounded-lg border border-gray-100">
                  <Line
                    data={allStatsData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      interaction: {
                        mode: 'index',
                        intersect: false,
                      },
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: {
                            usePointStyle: true,
                            boxWidth: 10,
                            padding: 15,
                            font: {
                              size: 11
                            }
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          titleFont: {
                            size: 13
                          },
                          bodyFont: {
                            size: 12
                          },
                          padding: 10,
                          cornerRadius: 6,
                          displayColors: true,
                          boxWidth: 8,
                          boxHeight: 8,
                          boxPadding: 3,
                          usePointStyle: true
                        }
                      },
                      scales: {
                        y: {
                          type: 'linear',
                          display: selectedStats.weight || selectedStats.bone,
                          position: 'left',
                          title: {
                            display: true,
                            text: 'Weight (kg)'
                          },
                          grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                          },
                          ticks: {
                            font: {
                              size: 10
                            }
                          }
                        },
                        y1: {
                          type: 'linear',
                          display: selectedStats.bodyFat || selectedStats.muscle || selectedStats.water,
                          position: 'left',
                          grid: {
                            drawOnChartArea: false,
                            color: 'rgba(0, 0, 0, 0.05)'
                          },
                          min: 0,
                          max: 100,
                          title: {
                            display: true,
                            text: 'Percentage (%)'
                          },
                          ticks: {
                            font: {
                              size: 10
                            }
                          }
                        },
                        y2: {
                          type: 'linear',
                          display: selectedStats.bmi,
                          position: 'right',
                          grid: {
                            drawOnChartArea: false,
                            color: 'rgba(0, 0, 0, 0.05)'
                          },
                          title: {
                            display: true,
                            text: 'BMI'
                          },
                          ticks: {
                            font: {
                              size: 10
                            }
                          }
                        },
                        y3: {
                          type: 'linear',
                          display: selectedStats.metabolism,
                          position: 'right',
                          grid: {
                            drawOnChartArea: false,
                            color: 'rgba(0, 0, 0, 0.05)'
                          },
                          title: {
                            display: true,
                            text: 'Metabolism (kcal)'
                          },
                          ticks: {
                            font: {
                              size: 10
                            }
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          },
                          ticks: {
                            font: {
                              size: 10
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Stats Summary */}
              {filteredStats.length >= 2 && (
                <div className="mt-6">
                  <h3 className="text-md font-medium mb-3">Body Stats Changes</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="text-gray-600 text-sm">Weight Change</span>
                      <p className="text-lg font-semibold">
                        {filteredStats.length >= 2
                          ? `${(filteredStats[filteredStats.length - 1].weight - filteredStats[0].weight).toFixed(1)} kg`
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="text-gray-600 text-sm">Body Fat Change</span>
                      <p className="text-lg font-semibold">
                        {filteredStats.length >= 2
                          ? `${(filteredStats[filteredStats.length - 1].bodyFatPercentage - filteredStats[0].bodyFatPercentage).toFixed(1)}%`
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="text-gray-600 text-sm">Muscle Change</span>
                      <p className="text-lg font-semibold">
                        {filteredStats.length >= 2
                          ? `${(filteredStats[filteredStats.length - 1].musclePercentage - filteredStats[0].musclePercentage).toFixed(1)}%`
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="text-gray-600 text-sm">BMI Change</span>
                      <p className="text-lg font-semibold">
                        {filteredStats.length >= 2
                          ? `${(filteredStats[filteredStats.length - 1].bmi - filteredStats[0].bmi).toFixed(1)}`
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Strength Progress Chart */}
          {workouts.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Strength Progress</h2>
                <div className="flex items-center">
                  <label htmlFor="exercise-select" className="mr-2 text-sm text-gray-600">
                    Exercise:
                  </label>
                  <select
                    id="exercise-select"
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedExercise}
                    onChange={(e) => setSelectedExercise(e.target.value)}
                  >
                    <option value="all">All Exercises</option>
                    {uniqueExercises.map((exercise) => (
                      <option key={exercise} value={exercise}>
                        {exercise}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {exerciseProgress.length > 0 ? (
                <div className="h-64 p-2 bg-gray-50 rounded-lg border border-gray-100">
                  <Line
                    data={exerciseProgressData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: {
                            usePointStyle: true,
                            boxWidth: 10,
                            padding: 15,
                            font: {
                              size: 11
                            }
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          titleFont: {
                            size: 13
                          },
                          bodyFont: {
                            size: 12
                          },
                          padding: 10,
                          cornerRadius: 6,
                          displayColors: true,
                          boxWidth: 8,
                          boxHeight: 8,
                          boxPadding: 3,
                          usePointStyle: true
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: false,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                          },
                          ticks: {
                            font: {
                              size: 10
                            }
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          },
                          ticks: {
                            font: {
                              size: 10
                            }
                          }
                        }
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="text-center p-6 text-gray-500">
                  {selectedExercise === 'all' ? 
                    'No exercises with weight data found for this time period.' : 
                    `No data for "${selectedExercise}" found for this time period.`}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Growth;