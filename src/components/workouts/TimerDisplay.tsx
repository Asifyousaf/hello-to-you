
import React from 'react';
import { Play, Pause, SkipForward } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { formatTime } from '@/utils/timeUtils';

interface TimerDisplayProps {
  timeLeft: number;
  isPaused: boolean;
  isResting: boolean;
  animateTimer: boolean;
  onPlayPause: () => void;
  onSkip: () => void;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  isPaused,
  isResting,
  animateTimer,
  onPlayPause,
  onSkip
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-1">
          {isResting ? "Rest Time" : "Exercise Time"}
        </p>
        <div className={`text-4xl font-bold mb-4 transition-all ${animateTimer ? 'text-red-500 scale-110' : ''}`}>
          {formatTime(timeLeft)}
        </div>
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={onPlayPause} 
            variant="outline" 
            size="icon"
            className="h-14 w-14 rounded-full border-2 hover:bg-purple-50 transition-all duration-200"
          >
            {isPaused ? (
              <Play className="h-6 w-6 text-purple-700" />
            ) : (
              <Pause className="h-6 w-6 text-purple-700" />
            )}
          </Button>
          <Button 
            onClick={onSkip} 
            variant="outline" 
            size="icon"
            className="h-14 w-14 rounded-full border-2 hover:bg-purple-50 transition-all duration-200"
          >
            <SkipForward className="h-6 w-6 text-purple-700" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;
