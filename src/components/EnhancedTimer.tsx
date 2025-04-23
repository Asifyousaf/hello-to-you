
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import useSounds from '../hooks/useSounds';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface EnhancedTimerProps {
  duration: number;
  timeLeft: number;
  isPaused: boolean;
  isResting: boolean;
  onPlayPause: () => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const EnhancedTimer: React.FC<EnhancedTimerProps> = ({ 
  duration, 
  timeLeft, 
  isPaused, 
  isResting,
  onPlayPause 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  
  const { play, pause, isLoaded } = useSounds();
  
  // Show animation when time is running low (less than 5 seconds)
  useEffect(() => {
    if (timeLeft <= 5 && !isPaused) {
      setIsAnimating(true);
      
      // Play ticking sound for countdown
      if (isLoaded.chimes && !isMuted) {
        play('chimes', { volume: volume / 100 * 0.3 });
      }
    } else {
      setIsAnimating(false);
    }
  }, [timeLeft, isPaused]);
  
  // Play sound on transition between resting and exercising
  useEffect(() => {
    if (!isPaused && isLoaded.chimes && !isMuted && timeLeft === duration) {
      play('chimes', { volume: volume / 100 });
    }
  }, [isResting]);
  
  // Calculate progress percentage
  const progress = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0;
  
  // Color schemes
  const colorScheme = isResting ? {
    path: '#3b82f6',
    trail: '#dbeafe',
    text: '#1d4ed8',
    background: '#eff6ff'
  } : {
    path: '#8b5cf6',
    trail: '#ede9fe', 
    text: '#6d28d9',
    background: '#f5f3ff'
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
    if (isMuted) setIsMuted(false);
  };
  
  return (
    <div className="relative w-full max-w-xs mx-auto">
      <div className={`p-8 rounded-xl ${isResting ? 'bg-blue-50' : 'bg-purple-50'}`}>
        <motion.div
          animate={isAnimating ? { scale: [1, 1.03, 1] } : { scale: 1 }}
          transition={{ repeat: isAnimating ? Infinity : 0, duration: 1 }}
        >
          <CircularProgressbarWithChildren
            value={progress}
            strokeWidth={6}
            styles={buildStyles({
              rotation: 0,
              strokeLinecap: 'round',
              pathTransition: 'stroke-dashoffset 0.5s ease 0s',
              pathColor: colorScheme.path,
              trailColor: colorScheme.trail,
              backgroundColor: colorScheme.background,
            })}
          >
            <div className="text-center">
              <p className="text-sm mb-1 font-medium text-gray-500">
                {isResting ? "Rest Time" : "Exercise Time"}
              </p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={timeLeft}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className={`text-4xl font-bold ${isAnimating ? 'text-red-500' : `text-${isResting ? 'blue' : 'purple'}-800`}`}>
                    {formatTime(timeLeft)}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </CircularProgressbarWithChildren>
        </motion.div>
        
        <div className="flex items-center justify-between mt-4">
          <button 
            onClick={onPlayPause}
            className={`flex-1 py-2 rounded-full flex items-center justify-center transition-colors ${
              isResting 
                ? 'bg-blue-100 hover:bg-blue-200 text-blue-800' 
                : 'bg-purple-100 hover:bg-purple-200 text-purple-800'
            }`}
          >
            {isPaused ? (
              <><Play className="h-5 w-5 mr-2" /> Resume</>
            ) : (
              <><Pause className="h-5 w-5 mr-2" /> Pause</>
            )}
          </button>
          
          <button
            onClick={() => setShowVolumeControl(!showVolumeControl)}
            className="ml-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
        </div>
        
        <AnimatePresence>
          {showVolumeControl && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2"
            >
              <div className="flex items-center p-2 bg-white rounded-lg">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-1 h-6 w-6 mr-2"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Slider
                  value={[volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className={isMuted ? "opacity-50 flex-1" : "flex-1"}
                  disabled={isMuted}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnhancedTimer;
