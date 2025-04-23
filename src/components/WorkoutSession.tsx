import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Check, XCircle, ChevronRight, Clock, Dumbbell, Flame, Layers } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import TimerDisplay from './workouts/TimerDisplay';
import ExerciseInstructions from './workouts/ExerciseInstructions';
import WorkoutStats from './workouts/WorkoutStats';
import { Exercise, WorkoutData, WorkoutPlan } from '@/types/workout';

interface WorkoutSessionProps {
  workout: WorkoutData;
  onComplete: (data: any) => void;
  onCancel: () => void;
}

const exerciseImages = {
  "Jumping Jacks": "https://www.inspireusafoundation.org/wp-content/uploads/2022/11/jumping-jack-animation.gif",
  "Push-ups": "https://thumbs.gfycat.com/GlossySkinnyDuckbillcat-max-1mb.gif",
  "Air Squats": "https://thumbs.gfycat.com/UnlinedTerribleGermanshorthairedpointer-max-1mb.gif",
  "Plank": "https://flabfix.com/wp-content/uploads/2019/05/Plank.gif",
  "Russian Twists": "https://media1.tenor.com/m/8byDO_ANDxAAAAAC/exercise-russian-twist.gif",
  "Mountain Climbers": "https://thumbs.gfycat.com/PhonyFaithfulAstrangiacoral-max-1mb.gif",
  "Sun Salutation (Surya Namaskar)": "https://cdn.dribbble.com/users/2931468/screenshots/5720362/media/e87bb48393c8202ff31e10056bbb413c.gif",
  "Warrior II (Virabhadrasana II)": "https://cdn.dribbble.com/users/2106177/screenshots/6834350/warrior2_dr.gif",
  "Tree Pose (Vrksasana)": "https://www.yogadukaan.com/blog/wp-content/uploads/2023/04/Vrikshasana-basic-steps-benefits.gif",
  "3/4 sit-up": "https://www.inspireusafoundation.org/wp-content/uploads/2022/03/situp-exercise.gif",
  "45° side bend": "https://www.inspireusafoundation.org/wp-content/uploads/2022/02/standing-side-bend.gif",
  "air bike": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Bicycle-Crunch.gif",
  "alternate heel touchers": "https://media.tenor.com/CJmLCk8voUgAAAAC/heel-touch-crunches-heel-touchers.gif",
  "assisted hanging knee raise with throw down": "https://www.inspireusafoundation.org/wp-content/uploads/2022/10/hanging-knee-raise.gif",
  "default": "https://www.inspireusafoundation.org/wp-content/uploads/2022/03/jumping-jacks-benefits.gif"
};

const WorkoutSession = ({ workout, onComplete, onCancel }: WorkoutSessionProps) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
  const [completedExercises, setCompletedExercises] = useState(0);
  const [completedExerciseDetails, setCompletedExerciseDetails] = useState<{[key: string]: boolean}>({});
  const [animateTimer, setAnimateTimer] = useState(false);
  const [activePackItemIndex, setActivePackItemIndex] = useState(0);
  const [skippedExercises, setSkippedExercises] = useState<{[key: string]: boolean}>({});
  const timerRef = useRef<any>(null);

  const workoutWithCalories: WorkoutPlan = {
    ...workout,
    caloriesBurn: workout.caloriesBurn || workout.calories_burned || 300
  };

  const isWorkoutPack = workout?.isPack && Array.isArray(workout?.packItems) && workout?.packItems?.length > 0;
  
  const isAIGeneratedPack = !isWorkoutPack && 
    typeof workout?.exercises === 'object' && 
    (workout?.exercises as any)?.isWorkoutPack === true &&
    Array.isArray((workout?.exercises as any)?.list);
  
  let activeWorkout: WorkoutPlan = workoutWithCalories;
  let exercises: Exercise[] = [];
  
  if (isWorkoutPack && workout?.packItems) {
    const packItem = workout.packItems[activePackItemIndex] || workout;
    activeWorkout = {
      ...packItem,
      caloriesBurn: packItem.caloriesBurn || packItem.calories_burned || 300
    };
    exercises = Array.isArray(activeWorkout?.exercises) ? activeWorkout.exercises : [];
  } else if (isAIGeneratedPack) {
    const exercisesList = (workout?.exercises as any)?.list || [];
    exercises = exercisesList;
    
    if ((workout?.exercises as any)?.originalWorkouts) {
      workout.packItems = (workout?.exercises as any)?.originalWorkouts;
    }
    
    workout.isPack = true;
  } else {
    exercises = Array.isArray(workout?.exercises) ? workout.exercises : [];
  }
  
  const currentExercise = exercises[currentExerciseIndex] || null;
  const totalExercises = isWorkoutPack && workout?.packItems
    ? workout.packItems.reduce((sum, w) => 
        sum + (Array.isArray(w?.exercises) ? w.exercises.length : 0), 0)
    : exercises.length;
  const progress = Math.round((completedExercises / Math.max(totalExercises, 1)) * 100);

  const getExerciseImage = (exerciseName: string) => {
    if (exerciseImages[exerciseName]) {
      return exerciseImages[exerciseName];
    }
    
    const lowerExerciseName = exerciseName.toLowerCase();
    for (const [key, url] of Object.entries(exerciseImages)) {
      if (key.toLowerCase().includes(lowerExerciseName) || 
          lowerExerciseName.includes(key.toLowerCase())) {
        return url;
      }
    }
    
    return exerciseImages.default;
  };

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setAnimateTimer(true);
            setTimeout(() => setAnimateTimer(false), 1000);
            return 0;
          }
          return prev - 1;
        });
        
        setTotalTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isPaused]);

  useEffect(() => {
    if (timeLeft === 0 && !isPaused) {
      if (isResting) {
        setIsResting(false);
        
        if (currentExercise && currentSet < currentExercise.sets) {
          setCurrentSet(prev => prev + 1);
          setTimeLeft(currentExercise.duration);
        } else {
          handleNextExercise();
        }
      } else {
        if (currentExercise && currentSet < currentExercise.sets) {
          setIsResting(true);
          setTimeLeft(currentExercise.restTime);
        } else {
          handleNextExercise();
        }
      }
    }
  }, [timeLeft, isPaused]);

  useEffect(() => {
    resetExerciseTimer();
  }, [currentExerciseIndex, activePackItemIndex]);

  const resetExerciseTimer = () => {
    if (currentExerciseIndex < exercises.length && currentExercise) {
      setTimeLeft(isResting ? currentExercise.restTime : currentExercise.duration);
    }
  };

  const handlePlayPause = () => {
    setIsPaused(prev => !prev);
  };

  const handleNextExercise = () => {
    if (currentExercise && !completedExerciseDetails[currentExercise.name]) {
      setSkippedExercises(prev => ({
        ...prev,
        [currentExercise.name]: true
      }));
    }
    
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
      setIsPaused(true);
    } else if (isWorkoutPack && workout?.packItems && activePackItemIndex < workout.packItems.length - 1) {
      setActivePackItemIndex(prev => prev + 1);
      setCurrentExerciseIndex(0);
      setCurrentSet(1);
      setIsResting(false);
      setIsPaused(true);
      
      toast({
        title: "Moving to next workout",
        description: `Starting ${workout.packItems[activePackItemIndex + 1].title}`,
      });
    } else {
      handleComplete();
    }
  };

  const handleCompleteExercise = () => {
    if (currentExercise) {
      const exerciseName = currentExercise.name;
      
      if (!completedExerciseDetails[exerciseName]) {
        setCompletedExerciseDetails(prev => ({
          ...prev,
          [exerciseName]: true
        }));
        setCompletedExercises(prev => prev + 1);
        
        if (skippedExercises[exerciseName]) {
          const newSkipped = {...skippedExercises};
          delete newSkipped[exerciseName];
          setSkippedExercises(newSkipped);
        }
      }
    }
    
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
      setIsPaused(true);
    } else if (isWorkoutPack && workout?.packItems && activePackItemIndex < workout.packItems.length - 1) {
      setActivePackItemIndex(prev => prev + 1);
      setCurrentExerciseIndex(0);
      setCurrentSet(1);
      setIsResting(false);
      setIsPaused(true);
      
      toast({
        title: "Moving to next workout",
        description: `Starting ${workout.packItems[activePackItemIndex + 1].title}`,
      });
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    const minutesSpent = Math.max(Math.round(totalTimeElapsed / 60), 1);
    
    const completedExerciseCount = Object.keys(completedExerciseDetails).length;
    const totalExerciseCount = totalExercises;
    
    const adjustedCompletionPercentage = totalExerciseCount > 0 ? 
      completedExerciseCount / totalExerciseCount : 0;
    
    const minCaloriePercentage = 0.3;
    const caloriesBurn = workoutWithCalories.caloriesBurn || workoutWithCalories.calories_burned || 300; 
    const workoutDuration = workoutWithCalories.duration || 30;
    
    const estimatedCalories = Math.round(
      caloriesBurn * Math.max(
        adjustedCompletionPercentage,
        Math.min(minutesSpent / workoutDuration, 1) * adjustedCompletionPercentage,
        minCaloriePercentage * adjustedCompletionPercentage
      )
    );
    
    const workoutData = {
      title: workoutWithCalories.title,
      type: workoutWithCalories.type,
      duration: minutesSpent,
      calories_burned: estimatedCalories
    };
    
    toast({
      title: "Workout Complete!",
      description: `You burned approximately ${estimatedCalories} calories in ${minutesSpent} minutes.`,
    });
    
    onComplete(workoutData);
  };

  const renderWorkoutPackTabs = () => {
    if (!isWorkoutPack && !isAIGeneratedPack) return null;
    
    const tabItems = isWorkoutPack && workout.packItems ? 
      workout.packItems : 
      exercises.map((ex, i) => ({ title: ex.name, id: i }));
    
    return (
      <Tabs 
        defaultValue={activePackItemIndex.toString()} 
        onValueChange={(value) => setActivePackItemIndex(parseInt(value))}
        className="w-full mb-6"
      >
        <TabsList className="w-full flex overflow-x-auto">
          {tabItems.map((packItem, index) => (
            <TabsTrigger 
              key={index} 
              value={index.toString()}
              className="flex-1 min-w-20"
            >
              {packItem.title && packItem.title.length > 15 ? `${packItem.title.slice(0, 15)}...` : packItem.title || packItem.name || `Workout ${index + 1}`}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    );
  };

  if (!workout || !activeWorkout) {
    return (
      <Card className="w-full border-2 border-purple-100">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardTitle>Invalid Workout Data</CardTitle>
          <CardDescription>Unable to load workout information</CardDescription>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="mb-4">Sorry, there was an issue loading this workout.</p>
          <Button onClick={onCancel}>Return to Workouts</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-2 border-purple-100">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardTitle className="flex items-center justify-between">
          {isWorkoutPack || isAIGeneratedPack ? (
            <Layers className="mr-2 h-5 w-5 text-purple-600" />
          ) : (
            <Dumbbell className="mr-2 h-5 w-5 text-purple-600" />
          )}
          {workout.title}
          {(isWorkoutPack || isAIGeneratedPack) && (
            <Badge variant="outline" className="ml-2 bg-purple-50 text-purple-700">
              AI Pack
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {workout.description || 'AI-generated workout routine'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {renderWorkoutPackTabs && renderWorkoutPackTabs()}
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Workout Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-100" />
        </div>

        {currentExerciseIndex < exercises.length && currentExercise ? (
          <div className="space-y-6">
            {(isWorkoutPack || isAIGeneratedPack) && (
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-purple-800">
                  Currently on: {isAIGeneratedPack ? currentExercise.name : activeWorkout.title} ({activePackItemIndex + 1}/{isAIGeneratedPack ? exercises.length : (workout.packItems?.length || 0)})
                </div>
              </div>
            )}
            
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-purple-800">{currentExercise.name}</h3>
                <div className="text-sm font-medium bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                  Set {currentSet} of {currentExercise.sets}
                </div>
              </div>

              <div className="mb-6 rounded-lg overflow-hidden shadow-md">
                <img 
                  src={getExerciseImage(currentExercise.name)} 
                  alt={currentExercise.name} 
                  className="w-full object-cover h-64"
                  onError={(e) => {
                    e.currentTarget.src = exerciseImages.default;
                  }}
                />
              </div>

              <TimerDisplay
                timeLeft={timeLeft}
                isPaused={isPaused}
                isResting={isResting}
                animateTimer={animateTimer}
                onPlayPause={handlePlayPause}
                onSkip={() => {
                  if (isResting) {
                    setIsResting(false);
                    setTimeLeft(currentExercise.duration);
                  } else if (currentSet < currentExercise.sets) {
                    setIsResting(true);
                    setTimeLeft(currentExercise.restTime);
                    setCurrentSet(prev => prev + 1);
                  } else {
                    handleNextExercise();
                  }
                }}
              />

              <ExerciseInstructions instructions={currentExercise.instructions} />
              
              <div className="mt-6">
                <Button 
                  onClick={handleCompleteExercise}
                  className={`w-full ${completedExerciseDetails[currentExercise.name] 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-green-600 hover:bg-green-700 text-white'}`}
                >
                  <Check className="mr-2 h-5 w-5" />
                  {completedExerciseDetails[currentExercise.name] ? 'Exercise Completed!' : 'Mark Exercise Complete'}
                </Button>
              </div>
            </div>

            <WorkoutStats
              totalTimeElapsed={totalTimeElapsed}
              caloriesBurn={workoutWithCalories.caloriesBurn}
              duration={workoutWithCalories.duration}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-green-100 text-green-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Workout Complete!</h3>
            <p className="text-gray-600 mb-6">Great job on finishing your workout!</p>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-800">{Math.round(totalTimeElapsed / 60)}</div>
                <div className="text-sm text-gray-500">Minutes</div>
              </div>
              <div className="h-10 border-r border-gray-200"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">
                  ~{Math.round((workoutWithCalories.caloriesBurn || 300) * (totalTimeElapsed / 60) / (workoutWithCalories.duration || 30) * (Object.keys(completedExerciseDetails).length / Math.max(totalExercises, 1)))}
                </div>
                <div className="text-sm text-gray-500">Calories</div>
              </div>
              <div className="h-10 border-r border-gray-200"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{Object.keys(completedExerciseDetails).length}</div>
                <div className="text-sm text-gray-500">Exercises</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between bg-gray-50 rounded-b-lg">
        <Button variant="outline" onClick={onCancel} className="border-red-200 text-red-600 hover:bg-red-50">
          <XCircle className="mr-2 h-4 w-4" />
          Cancel Workout
        </Button>
        {currentExerciseIndex >= exercises.length ? (
          <Button onClick={handleComplete} className="bg-purple-600 hover:bg-purple-700">
            <Check className="mr-2 h-4 w-4" />
            Complete Workout
          </Button>
        ) : (
          <Button onClick={handleNextExercise} variant="default" className="bg-purple-600 hover:bg-purple-700">
            Skip Exercise
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default WorkoutSession;
