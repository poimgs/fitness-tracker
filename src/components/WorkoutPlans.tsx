import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { format } from 'date-fns';
import { PlusCircle, Edit, Trash2, ChevronDown, ChevronUp, Copy, Calendar, CheckSquare, Check, Square } from 'lucide-react';
import WorkoutForm from './WorkoutForm';
import WorkoutTracker from './WorkoutTracker';

const WorkoutPlans: React.FC = () => {
  const { workouts, deleteWorkout, addWorkout, toggleWorkoutCompletion } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<string | null>(null);
  const [expandedWorkouts, setExpandedWorkouts] = useState<string[]>([]);
  const [showUpcoming, setShowUpcoming] = useState(true);
  
  // Filter workouts based only on completion status
  const filteredWorkouts = workouts.filter(workout => {
    return showUpcoming 
      ? !workout.completed  // Show only non-completed workouts in "Upcoming" tab
      : workout.completed;  // Show only completed workouts in "Completed" tab
  });

  // Sort workouts by date (newest first for completed, soonest first for upcoming)
  const sortedWorkouts = [...filteredWorkouts].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return showUpcoming ? dateA - dateB : dateB - dateA;
  });

  const handleEdit = (id: string) => {
    setEditingWorkout(id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      deleteWorkout(id);
    }
  };

  const handleClone = (workoutToClone: any) => {
    const clonedWorkout = {
      ...workoutToClone,
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0], // Set date to today for the clone
      completed: false, // Reset completion status for the clone
      exercises: workoutToClone.exercises.map((ex: any) => ({
        ...ex,
        id: crypto.randomUUID()
      }))
    };
    
    addWorkout(clonedWorkout);
    setEditingWorkout(clonedWorkout.id);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingWorkout(null);
  };

  const toggleWorkoutExpand = (id: string) => {
    if (expandedWorkouts.includes(id)) {
      setExpandedWorkouts(expandedWorkouts.filter(workoutId => workoutId !== id));
    } else {
      setExpandedWorkouts([...expandedWorkouts, id]);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Workout Plans</h1>
        <button
          onClick={() => {
            setEditingWorkout(null);
            setIsFormOpen(true);
          }}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          <PlusCircle className="h-5 w-5 mr-1" />
          Add Workout
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <WorkoutForm 
              onClose={closeForm} 
              workoutId={editingWorkout}
            />
          </div>
        </div>
      )}

      {/* Progress Tracker Section */}
      <div className="mb-8">
        <WorkoutTracker />
      </div>

      {/* Workout Plans Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Workouts</h2>
          <div className="bg-gray-200 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setShowUpcoming(true)}
              className={`flex items-center px-3 py-1.5 rounded ${
                showUpcoming ? 'bg-blue-500 text-white' : 'text-gray-700'
              }`}
            >
              <Calendar className="h-4 w-4 mr-1" />
              <span className="text-sm">Upcoming</span>
            </button>
            <button
              onClick={() => setShowUpcoming(false)}
              className={`flex items-center px-3 py-1.5 rounded ${
                !showUpcoming ? 'bg-blue-500 text-white' : 'text-gray-700'
              }`}
            >
              <CheckSquare className="h-4 w-4 mr-1" />
              <span className="text-sm">Completed</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {sortedWorkouts.length > 0 ? (
            sortedWorkouts.map((workout) => (
              <div key={workout.id} className={`bg-white rounded-lg shadow p-4 ${workout.completed ? 'border-l-4 border-green-500' : ''}`}>
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <button 
                      onClick={() => toggleWorkoutCompletion(workout.id)}
                      className={`mr-2 p-1 rounded hover:bg-gray-100 ${workout.completed ? 'text-green-500' : 'text-gray-400'}`}
                      title={workout.completed ? "Mark as incomplete" : "Mark as complete"}
                    >
                      {workout.completed ? 
                        <CheckSquare className="h-5 w-5" /> : 
                        <Square className="h-5 w-5" />
                      }
                    </button>
                    <div>
                      <h2 className="text-xl font-semibold">{format(new Date(workout.date), 'EEEE, MMMM d, yyyy')}</h2>
                      <p className="text-gray-600 mb-2">Focus: {workout.focus}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleClone(workout)}
                      className="p-1 text-green-500 hover:text-green-700"
                      title="Clone workout"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(workout.id)}
                      className="p-1 text-blue-500 hover:text-blue-700"
                      title="Edit workout"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(workout.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Delete workout"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {workout.notes && (
                  <div className="mt-2 mb-3 bg-blue-50 p-3 rounded">
                    <p className="text-sm text-gray-700">{workout.notes}</p>
                  </div>
                )}

                <div className="mt-2">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleWorkoutExpand(workout.id)}
                  >
                    <h3 className="font-medium text-gray-700">Exercises: {workout.exercises.length}</h3>
                    {expandedWorkouts.includes(workout.id) ? 
                      <ChevronUp className="h-5 w-5 text-gray-500" /> :
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    }
                  </div>
                  
                  {expandedWorkouts.includes(workout.id) && (
                    <div className="bg-gray-50 rounded p-3 divide-y mt-2">
                      {workout.exercises.map((exercise, index) => (
                        <div key={exercise.id} className="py-2 first:pt-0 last:pb-0">
                          <div className="flex justify-between">
                            <span className="font-medium">{exercise.name}</span>
                            <span className="text-gray-600">
                              {exercise.sets} × {exercise.reps} {exercise.weight ? `@ ${exercise.weight} ${exercise.unit || 'kg'}` : ''}
                            </span>
                          </div>
                          {exercise.notes && (
                            <p className="text-xs text-gray-500 mt-1 italic">{exercise.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">No {showUpcoming ? 'upcoming' : 'completed'} workouts found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlans;