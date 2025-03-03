import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAppContext } from '../contexts/AppContext';
import { WorkoutPlan, Exercise } from '../types';
import { Plus, Minus, X, ChevronDown, CheckSquare, Square } from 'lucide-react';

interface WorkoutFormProps {
  onClose: () => void;
  workoutId: string | null;
}

interface FormData {
  date: string;
  focus: string;
  notes?: string;
  completed?: boolean;
  exercises: {
    id: string;
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    notes?: string;
    unit: 'kg' | 'lbs';
  }[];
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onClose, workoutId }) => {
  const { workouts, addWorkout, updateWorkout } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exerciseOptions, setExerciseOptions] = useState<string[]>([]);
  const [showDropdowns, setShowDropdowns] = useState<{[key: number]: boolean}>({});
  const [inputFocused, setInputFocused] = useState<{[key: number]: boolean}>({});

  // Get workout if we're editing
  const workout = workoutId ? workouts.find((w) => w.id === workoutId) : null;

  // Extract unique exercise names from all workouts
  useEffect(() => {
    const uniqueExercises = new Set<string>();
    workouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (exercise.name) {
          uniqueExercises.add(exercise.name);
        }
      });
    });
    setExerciseOptions(Array.from(uniqueExercises).sort());
  }, [workouts]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues
  } = useForm<FormData>({
    defaultValues: workout
      ? {
          date: workout.date,
          focus: workout.focus,
          notes: workout.notes || '',
          completed: workout.completed || false,
          exercises: workout.exercises.map(ex => ({
            ...ex,
            unit: ex.unit || 'kg'
          }))
        }
      : {
          date: new Date().toISOString().split('T')[0],
          focus: '',
          notes: '',
          completed: false,
          exercises: [
            {
              id: crypto.randomUUID(),
              name: '',
              sets: 3,
              reps: 10,
              weight: undefined,
              notes: '',
              unit: 'kg'
            }
          ]
        }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exercises',
  });

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    
    const formattedWorkout: WorkoutPlan = {
      id: workout?.id || crypto.randomUUID(),
      date: data.date,
      focus: data.focus,
      notes: data.notes,
      completed: data.completed,
      exercises: data.exercises.map(exercise => ({
        ...exercise,
        id: exercise.id || crypto.randomUUID()
      }))
    };

    if (workout) {
      updateWorkout(formattedWorkout);
    } else {
      addWorkout(formattedWorkout);
    }

    setIsSubmitting(false);
    onClose();
  };

  const addExercise = () => {
    append({
      id: crypto.randomUUID(),
      name: '',
      sets: 3,
      reps: 10,
      weight: undefined,
      notes: '',
      unit: 'kg'
    });
  };

  const toggleDropdown = (index: number) => {
    setShowDropdowns(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const selectExercise = (index: number, exercise: string) => {
    setValue(`exercises.${index}.name`, exercise);
    setShowDropdowns(prev => ({
      ...prev,
      [index]: false
    }));

    // Try to find the most recent instance of this exercise to pre-fill values
    const previousExercise = workouts
      .flatMap(w => w.exercises)
      .filter(e => e.name === exercise)
      .sort((a, b) => {
        const workoutA = workouts.find(w => w.exercises.some(e => e.id === a.id));
        const workoutB = workouts.find(w => w.exercises.some(e => e.id === b.id));
        if (!workoutA || !workoutB) return 0;
        return new Date(workoutB.date).getTime() - new Date(workoutA.date).getTime();
      })[0];

    if (previousExercise) {
      setValue(`exercises.${index}.sets`, previousExercise.sets);
      setValue(`exercises.${index}.reps`, previousExercise.reps);
      if (previousExercise.weight) {
        setValue(`exercises.${index}.weight`, previousExercise.weight);
      }
      if (previousExercise.unit) {
        setValue(`exercises.${index}.unit`, previousExercise.unit);
      }
    }
  };

  // Watch all exercise names to filter dropdown
  const exerciseNames = watch('exercises').map(e => e.name);
  const isCompleted = watch('completed');

  // Handle input focus and blur
  const handleInputFocus = (index: number) => {
    setInputFocused(prev => ({
      ...prev,
      [index]: true
    }));
  };

  const handleInputBlur = (index: number) => {
    // Delay closing dropdown to allow for clicking on dropdown items
    setTimeout(() => {
      setInputFocused(prev => ({
        ...prev,
        [index]: false
      }));
    }, 200);
  };

  // Check if dropdown should be shown
  const shouldShowDropdown = (index: number) => {
    return (showDropdowns[index] || 
           (inputFocused[index] && exerciseNames[index] && exerciseNames[index].length > 0));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{workout ? 'Edit' : 'Add'} Workout</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            type="date"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('date', { required: 'Date is required' })}
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="focus">
            Focus
          </label>
          <input
            id="focus"
            type="text"
            placeholder="e.g., Chest, Back, Legs"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('focus', { required: 'Focus is required' })}
          />
          {errors.focus && <p className="text-red-500 text-xs mt-1">{errors.focus.message}</p>}
        </div>

        <div className="mb-4">
          <label className="flex items-center text-gray-700 text-sm font-bold mb-2">
            <input 
              type="checkbox" 
              className="mr-2 form-checkbox h-4 w-4 text-green-500"
              {...register('completed')} 
            />
            Mark as Completed
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
            Workout Notes (optional)
          </label>
          <textarea
            id="notes"
            placeholder="Any notes about this workout..."
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
            {...register('notes')}
          />
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-700 text-sm font-bold">Exercises</label>
            <button
              type="button"
              onClick={addExercise}
              className="flex items-center text-sm bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Exercise
            </button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="bg-gray-50 p-3 rounded mb-2">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Exercise {index + 1}</span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-2 relative">
                <label className="block text-gray-700 text-xs mb-1" htmlFor={`exercises.${index}.name`}>
                  Exercise Name
                </label>
                <div className="relative">
                  <input
                    id={`exercises.${index}.name`}
                    type="text"
                    placeholder="e.g., Bench Press, Squats"
                    className="shadow appearance-none border rounded w-full py-2 pl-3 pr-8 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                    {...register(`exercises.${index}.name` as const, { required: 'Exercise name is required' })}
                    onFocus={() => handleInputFocus(index)}
                    onBlur={() => handleInputBlur(index)}
                  />
                  <button 
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => toggleDropdown(index)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                
                {shouldShowDropdown(index) && exerciseOptions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-40 overflow-y-auto rounded border">
                    {exerciseOptions
                      .filter(option => !exerciseNames[index] || option.toLowerCase().startsWith(exerciseNames[index].toLowerCase()))
                      .map((option, optionIndex) => (
                        <div 
                          key={optionIndex} 
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          onClick={() => selectExercise(index, option)}
                        >
                          {option}
                        </div>
                      ))}
                    {exerciseOptions.filter(option => !exerciseNames[index] || option.toLowerCase().startsWith(exerciseNames[index].toLowerCase())).length === 0 && (
                      <div className="px-3 py-2 text-gray-500 text-sm">No matches found</div>
                    )}
                  </div>
                )}
                
                {errors.exercises?.[index]?.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.exercises[index]?.name?.message}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-gray-700 text-xs mb-1" htmlFor={`exercises.${index}.sets`}>
                    Sets
                  </label>
                  <input
                    id={`exercises.${index}.sets`}
                    type="number"
                    min="1"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                    {...register(`exercises.${index}.sets` as const, { 
                      required: 'Required',
                      min: { value: 1, message: 'Min 1' },
                      valueAsNumber: true
                    })}
                  />
                  {errors.exercises?.[index]?.sets && (
                    <p className="text-red-500 text-xs mt-1">{errors.exercises[index]?.sets?.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-xs mb-1" htmlFor={`exercises.${index}.reps`}>
                    Reps
                  </label>
                  <input
                    id={`exercises.${index}.reps`}
                    type="number"
                    min="1"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                    {...register(`exercises.${index}.reps` as const, { 
                      required: 'Required',
                      min: { value: 1, message: 'Min 1' },
                      valueAsNumber: true
                    })}
                  />
                  {errors.exercises?.[index]?.reps && (
                    <p className="text-red-500 text-xs mt-1">{errors.exercises[index]?.reps?.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-gray-700 text-xs" htmlFor={`exercises.${index}.weight`}>
                      Weight
                    </label>
                    <div className="flex items-center">
                      <label className="inline-flex items-center mr-2">
                        <input
                          type="radio"
                          value="kg"
                          className="form-radio h-3 w-3"
                          {...register(`exercises.${index}.unit` as const)}
                        />
                        <span className="ml-1 text-xs text-gray-700">kg</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="lbs"
                          className="form-radio h-3 w-3"
                          {...register(`exercises.${index}.unit` as const)}
                        />
                        <span className="ml-1 text-xs text-gray-700">lbs</span>
                      </label>
                    </div>
                  </div>
                  <input
                    id={`exercises.${index}.weight`}
                    type="number"
                    min="0"
                    step="0.5"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                    {...register(`exercises.${index}.weight` as const, { 
                      min: { value: 0, message: 'Min 0' },
                      valueAsNumber: true
                    })}
                  />
                  {errors.exercises?.[index]?.weight && (
                    <p className="text-red-500 text-xs mt-1">{errors.exercises[index]?.weight?.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-2">
                <label className="block text-gray-700 text-xs mb-1" htmlFor={`exercises.${index}.notes`}>
                  Notes (optional)
                </label>
                <textarea
                  id={`exercises.${index}.notes`}
                  placeholder="Any notes about this exercise..."
                  rows={2}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                  {...register(`exercises.${index}.notes` as const)}
                />
              </div>
            </div>
          ))}
          {fields.length === 0 && (
            <p className="text-gray-500 text-sm italic">No exercises added. Add at least one exercise.</p>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || fields.length === 0}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
              (isSubmitting || fields.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Save Workout'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;