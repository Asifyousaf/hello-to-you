
import React from 'react';
import { Clock, Flame } from 'lucide-react';
import { formatTime } from '@/utils/timeUtils';

interface WorkoutStatsProps {
  totalTimeElapsed: number;
  caloriesBurn: number;
  duration: number;
}

const WorkoutStats: React.FC<WorkoutStatsProps> = ({
  totalTimeElapsed,
  caloriesBurn,
  duration
}) => {
  // Default values if missing
  const safeCalories = caloriesBurn || 300;
  const safeDuration = duration || 30;
  const safeTimeElapsed = Math.max(0, totalTimeElapsed);
  
  // Calculate estimated calories based on time elapsed and total duration
  // Cap calories at the max defined by caloriesBurn
  const estimatedCalories = Math.min(
    Math.round((safeCalories * (safeTimeElapsed / 60) / safeDuration) || 0),
    safeCalories
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 bg-purple-50 p-4 rounded-lg">
      <div className="flex items-center">
        <Clock className="h-5 w-5 mr-2 text-purple-600" />
        <span className="text-gray-700 font-medium">Total time: {formatTime(safeTimeElapsed)}</span>
      </div>
      <div className="flex items-center">
        <Flame className="h-5 w-5 mr-2 text-orange-500" />
        <span className="text-gray-700 font-medium">
          Est. calories: ~{estimatedCalories}
        </span>
      </div>
    </div>
  );
};

export default WorkoutStats;
