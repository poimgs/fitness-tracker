import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { format } from 'date-fns';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import BodyStatsForm from './BodyStatsForm';

const BodyStats: React.FC = () => {
  const { bodyStats, deleteBodyStats } = useAppContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStats, setEditingStats] = useState<string | null>(null);

  // Sort stats by date (newest first)
  const sortedStats = [...bodyStats].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Get the latest stats entry
  const latestStats = sortedStats[0];

  const handleEdit = (id: string) => {
    setEditingStats(id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete these body stats?')) {
      deleteBodyStats(id);
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingStats(null);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Body Stats Tracker</h1>
        <button
          onClick={() => {
            setEditingStats(null);
            setIsFormOpen(true);
          }}
          className="flex items-center bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
        >
          <PlusCircle className="h-5 w-5 mr-1" />
          Add Stats
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <BodyStatsForm 
              onClose={closeForm} 
              statsId={editingStats}
            />
          </div>
        </div>
      )}

      {/* Current Body Stats Metrics */}
      {latestStats && (
        <div className="mb-6 bg-white p-5 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Current Body Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-purple-50 p-4 rounded">
              <span className="text-gray-600 text-sm">Weight</span>
              <p className="text-xl font-semibold">{latestStats.weight} {latestStats.unit}</p>
              <span className="text-xs text-gray-500">{format(new Date(latestStats.date), 'MMM d, yyyy')}</span>
            </div>
            
            <div className="bg-blue-50 p-4 rounded">
              <span className="text-gray-600 text-sm">Body Fat</span>
              <p className="text-xl font-semibold">{latestStats.bodyFatPercentage}%</p>
              <span className="text-xs text-gray-500">{format(new Date(latestStats.date), 'MMM d, yyyy')}</span>
            </div>
            
            <div className="bg-green-50 p-4 rounded">
              <span className="text-gray-600 text-sm">Muscle Mass</span>
              <p className="text-xl font-semibold">{latestStats.musclePercentage}%</p>
              <span className="text-xs text-gray-500">{format(new Date(latestStats.date), 'MMM d, yyyy')}</span>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded">
              <span className="text-gray-600 text-sm">BMI</span>
              <p className="text-xl font-semibold">{latestStats.bmi.toFixed(1)}</p>
              <span className="text-xs text-gray-500">{format(new Date(latestStats.date), 'MMM d, yyyy')}</span>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded">
              <span className="text-gray-600 text-sm">Bone Percentage</span>
              <p className="text-xl font-semibold">{latestStats.bonePercentage}%</p>
            </div>
            
            <div className="bg-cyan-50 p-4 rounded">
              <span className="text-gray-600 text-sm">Water Percentage</span>
              <p className="text-xl font-semibold">{latestStats.waterPercentage}%</p>
            </div>
            
            <div className="bg-red-50 p-4 rounded">
              <span className="text-gray-600 text-sm">Metabolism Rate</span>
              <p className="text-xl font-semibold">{latestStats.metabolismRate} kcal</p>
            </div>

            {sortedStats.length >= 2 && (
              <div className="bg-emerald-50 p-4 rounded">
                <span className="text-gray-600 text-sm">Weight Change</span>
                <p className="text-xl font-semibold">
                  <span className={latestStats.weight < sortedStats[1].weight ? 'text-green-500' : 'text-red-500'}>
                    {latestStats.weight < sortedStats[1].weight ? '↓' : '↑'} 
                    {Math.abs(latestStats.weight - sortedStats[1].weight).toFixed(1)} {latestStats.unit}
                  </span>
                </p>
                <span className="text-xs text-gray-500">Since {format(new Date(sortedStats[1].date), 'MMM d')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {sortedStats.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (kg)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Body Fat %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Muscle %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedStats.map((stats) => (
                <tr key={stats.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {format(new Date(stats.date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stats.weight}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stats.bodyFatPercentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stats.musclePercentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stats.bmi.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(stats.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(stats.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No body stats recorded yet. Start tracking your progress!</p>
        </div>
      )}
    </div>
  );
};

export default BodyStats;