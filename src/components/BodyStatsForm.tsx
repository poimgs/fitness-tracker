import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppContext } from '../contexts/AppContext';
import { BodyStats } from '../types';
import { X } from 'lucide-react';

interface BodyStatsFormProps {
  onClose: () => void;
  statsId: string | null;
}

interface FormData {
  date: string;
  weight: number;
  bodyFatPercentage: number;
  musclePercentage: number;
  boneWeight: number;
  waterPercentage: number;
  bmi: number;
  metabolismRate: number;
}

const BodyStatsForm: React.FC<BodyStatsFormProps> = ({ onClose, statsId }) => {
  const { bodyStats, addBodyStats, updateBodyStats } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get stats if we're editing
  const stats = statsId ? bodyStats.find((s) => s.id === statsId) : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormData>({
    defaultValues: stats
      ? {
          date: stats.date,
          weight: stats.weight,
          bodyFatPercentage: stats.bodyFatPercentage,
          musclePercentage: stats.musclePercentage,
          boneWeight: stats.boneWeight,
          waterPercentage: stats.waterPercentage,
          bmi: stats.bmi,
          metabolismRate: stats.metabolismRate
        }
      : {
          date: new Date().toISOString().split('T')[0],
          weight: undefined,
          bodyFatPercentage: undefined,
          musclePercentage: undefined,
          boneWeight: undefined,
          waterPercentage: undefined,
          bmi: undefined,
          metabolismRate: undefined
        }
  });

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    
    const formattedStats: BodyStats = {
      id: stats?.id || crypto.randomUUID(),
      ...data,
      unit: 'kg'
    };

    if (stats) {
      updateBodyStats(formattedStats);
    } else {
      addBodyStats(formattedStats);
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{stats ? 'Edit' : 'Add'} Body Stats</h2>
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="weight">
            Weight (kg)
          </label>
          <input
            id="weight"
            type="number"
            step="0.1"
            min="0"
            placeholder="Enter your weight"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('weight', { 
              required: 'Weight is required',
              min: { value: 0, message: 'Weight must be positive' },
              valueAsNumber: true
            })}
          />
          {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bodyFatPercentage">
              Body Fat %
            </label>
            <input
              id="bodyFatPercentage"
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="Enter body fat percentage"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register('bodyFatPercentage', { 
                required: 'Body fat % is required',
                min: { value: 0, message: 'Min 0%' },
                max: { value: 100, message: 'Max 100%' },
                valueAsNumber: true
              })}
            />
            {errors.bodyFatPercentage && <p className="text-red-500 text-xs mt-1">{errors.bodyFatPercentage.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="musclePercentage">
              Muscle %
            </label>
            <input
              id="musclePercentage"
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="Enter muscle percentage"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register('musclePercentage', { 
                required: 'Muscle % is required',
                min: { value: 0, message: 'Min 0%' },
                max: { value: 100, message: 'Max 100%' },
                valueAsNumber: true
              })}
            />
            {errors.musclePercentage && <p className="text-red-500 text-xs mt-1">{errors.musclePercentage.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="boneWeight">
              Bone Weight (kg)
            </label>
            <input
              id="boneWeight"
              type="number"
              step="0.1"
              min="0"
              placeholder="Enter bone weight"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register('boneWeight', { 
                required: 'Bone weight is required',
                min: { value: 0, message: 'Bone weight must be positive' },
                valueAsNumber: true
              })}
            />
            {errors.boneWeight && <p className="text-red-500 text-xs mt-1">{errors.boneWeight.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="waterPercentage">
              Water %
            </label>
            <input
              id="waterPercentage"
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="Enter water percentage"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register('waterPercentage', { 
                required: 'Water % is required',
                min: { value: 0, message: 'Min 0%' },
                max: { value: 100, message: 'Max 100%' },
                valueAsNumber: true
              })}
            />
            {errors.waterPercentage && <p className="text-red-500 text-xs mt-1">{errors.waterPercentage.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bmi">
              BMI
            </label>
            <input
              id="bmi"
              type="number"
              step="0.1"
              min="0"
              placeholder="Enter your BMI"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register('bmi', { 
                required: 'BMI is required',
                min: { value: 0, message: 'BMI must be positive' },
                valueAsNumber: true
              })}
            />
            {errors.bmi && <p className="text-red-500 text-xs mt-1">{errors.bmi.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="metabolismRate">
              Metabolism (kcal)
            </label>
            <input
              id="metabolismRate"
              type="number"
              step="1"
              min="0"
              placeholder="Enter metabolism rate"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register('metabolismRate', { 
                required: 'Metabolism rate is required',
                min: { value: 0, message: 'Metabolism must be positive' },
                valueAsNumber: true
              })}
            />
            {errors.metabolismRate && <p className="text-red-500 text-xs mt-1">{errors.metabolismRate.message}</p>}
          </div>
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
            disabled={isSubmitting}
            className={`bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Save Stats'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BodyStatsForm;