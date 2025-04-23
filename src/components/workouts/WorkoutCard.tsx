
import React from 'react';
import { Clock, Layers, Dumbbell } from 'lucide-react';
import { WorkoutData } from '@/types/workout';

interface WorkoutCardProps {
  workout: WorkoutData;
  onStart: (workout: WorkoutData) => void;
  onDelete?: (workoutId: string) => void;
  userId?: string;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onStart, onDelete, userId }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-300">
        <img 
          src={workout.image} 
          alt={workout.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white rounded-full px-3 py-1 text-xs flex items-center">
          <Clock size={12} className="mr-1" />
          {workout.duration} min
        </div>
        {workout.isPack && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full px-3 py-1 text-xs flex items-center">
            <Layers size={12} className="mr-1" />
            Workout Pack
          </div>
        )}
        {workout.level === 'custom' && !workout.isPack && (
          <div className="absolute top-3 left-3 bg-purple-600 text-white rounded-full px-3 py-1 text-xs">
            AI Generated
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white px-3 py-2">
          <h3 className="font-bold text-lg truncate">{workout.title}</h3>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center text-xs text-purple-600 font-semibold mb-1">
          <Dumbbell size={14} className="mr-1" />
          {workout.type}
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">{workout.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className={`
              ${workout.level === 'beginner' ? 'bg-green-100 text-green-800' : 
                workout.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 
                workout.type === 'AI_PACK' ? 'bg-purple-100 text-purple-800' :
                'bg-green-100 text-green-800'} 
              text-xs px-2 py-1 rounded-full`}
            >
              {workout.level === 'all' ? 'All Levels' : 
                workout.type === 'AI_PACK' ? 'AI Generated' :
                workout.level.charAt(0).toUpperCase() + workout.level.slice(1)}
            </div>
          </div>
          <div className="flex gap-2">
            {workout.user_id === userId && onDelete && (
              <button 
                onClick={() => onDelete(workout.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            )}
            <button 
              onClick={() => onStart(workout)}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            >
              Start →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCard;
