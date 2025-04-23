
import React from 'react';
import { Play } from 'lucide-react';
import { WorkoutData } from '@/types/workout';

interface WorkoutHeaderProps {
  onStartFirstWorkout: (workout: WorkoutData) => void;
  firstWorkout: WorkoutData;
}

const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({ onStartFirstWorkout, firstWorkout }) => {
  return (
    <div className="pt-24 pb-16 bg-gradient-to-br from-blue-500 to-blue-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Personalized Workout Plans</h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8">
          AI-powered workouts tailored to your fitness level, goals, and preferences.
        </p>
        <button 
          onClick={() => onStartFirstWorkout(firstWorkout)}
          className="bg-white text-blue-600 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors flex items-center"
        >
          <Play size={18} className="mr-2" />
          Start Your First Workout
        </button>
      </div>
    </div>
  );
};

export default WorkoutHeader;
