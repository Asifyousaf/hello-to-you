
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Clock, Flame, Award, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface WorkoutListProps {
  onSelectWorkout: (workout: WorkoutPlan) => void;
}

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  duration: number; // in seconds
  restTime: number; // in seconds
  instructions: string[];
}

interface WorkoutPlan {
  id: string;
  title: string;
  type: string;
  description: string;
  level: string;
  duration: number; // in minutes
  caloriesBurn: number;
  exercises: Exercise[];
}

const WorkoutList: React.FC<WorkoutListProps> = ({ onSelectWorkout }) => {
  // Enhanced workout plans with more variety
  const workouts: WorkoutPlan[] = [
    {
      id: '1',
      title: 'Full Body HIIT',
      type: 'HIIT',
      description: 'High intensity interval training to burn calories and improve cardiovascular health.',
      level: 'intermediate',
      duration: 30,
      caloriesBurn: 320,
      exercises: [
        {
          name: 'Jumping Jacks',
          sets: 3,
          reps: 20,
          duration: 60,
          restTime: 30,
          instructions: [
            'Stand upright with your legs together and arms at your sides',
            'Jump up and spread your feet beyond shoulder width while bringing arms above head',
            'Return to starting position and repeat'
          ]
        },
        {
          name: 'Push-ups',
          sets: 3,
          reps: 10,
          duration: 60,
          restTime: 30,
          instructions: [
            'Start in a plank position with hands shoulder-width apart',
            'Lower your body until chest nearly touches the floor',
            'Push back up and repeat'
          ]
        },
        {
          name: 'Mountain Climbers',
          sets: 3,
          reps: 20,
          duration: 60,
          restTime: 30,
          instructions: [
            'Start in a plank position',
            'Drive one knee toward your chest, then quickly switch legs',
            'Continue alternating legs at a rapid pace'
          ]
        },
        {
          name: 'Bodyweight Squats',
          sets: 3,
          reps: 15,
          duration: 60,
          restTime: 30,
          instructions: [
            'Stand with feet shoulder-width apart',
            'Lower your body by bending knees and pushing hips back',
            'Return to standing position and repeat'
          ]
        }
      ]
    },
    {
      id: '2',
      title: 'Core Crusher',
      type: 'Strength Training',
      description: 'Focus on your core with this targeted ab workout.',
      level: 'beginner',
      duration: 20,
      caloriesBurn: 180,
      exercises: [
        {
          name: 'Plank',
          sets: 3,
          reps: 1,
          duration: 30,
          restTime: 20,
          instructions: [
            'Start in a forearm plank position, elbows under shoulders',
            'Engage your core and keep your body in a straight line',
            'Hold the position for the duration'
          ]
        },
        {
          name: 'Crunches',
          sets: 3,
          reps: 15,
          duration: 45,
          restTime: 30,
          instructions: [
            'Lie on your back with knees bent',
            'Place hands behind your head or across chest',
            'Lift shoulders off the ground and engage core',
            'Lower back down with control and repeat'
          ]
        },
        {
          name: 'Russian Twists',
          sets: 3,
          reps: 20,
          duration: 45,
          restTime: 30,
          instructions: [
            'Sit on the floor with knees bent',
            'Lean back slightly, keeping back straight',
            'Twist torso to right, then to left (counts as one rep)',
            'Keep feet slightly off the ground for added challenge'
          ]
        }
      ]
    },
    {
      id: '3',
      title: 'Upper Body Blast',
      type: 'Strength Training',
      description: 'Build strength in your chest, shoulders, and arms.',
      level: 'intermediate',
      duration: 35,
      caloriesBurn: 250,
      exercises: [
        {
          name: 'Push-ups',
          sets: 4,
          reps: 12,
          duration: 60,
          restTime: 45,
          instructions: [
            'Start in a plank position with hands shoulder-width apart',
            'Lower your body until chest nearly touches the floor',
            'Push back up and repeat'
          ]
        },
        {
          name: 'Dips',
          sets: 3,
          reps: 10,
          duration: 60,
          restTime: 45,
          instructions: [
            'Use a chair or bench behind you',
            'Place hands on edge with fingers facing forward',
            'Lower your body by bending elbows',
            'Push back up and repeat'
          ]
        },
        {
          name: 'Arm Circles',
          sets: 3,
          reps: 20,
          duration: 45,
          restTime: 30,
          instructions: [
            'Stand with feet shoulder-width apart',
            'Extend arms out to sides at shoulder height',
            'Make small circles forward, then backward'
          ]
        },
        {
          name: 'Plank to Push-up',
          sets: 3,
          reps: 8,
          duration: 60,
          restTime: 45,
          instructions: [
            'Start in a forearm plank position',
            'Push up to a hand plank, one arm at a time',
            'Lower back to forearm plank, one arm at a time',
            'Repeat, alternating which arm moves first'
          ]
        }
      ]
    },
    // New workout plans
    {
      id: '4',
      title: 'Yoga Flow',
      type: 'Yoga',
      description: 'A gentle flow to improve flexibility, balance, and mindfulness.',
      level: 'all',
      duration: 45,
      caloriesBurn: 200,
      exercises: [
        {
          name: 'Sun Salutation',
          sets: 3,
          reps: 1,
          duration: 120,
          restTime: 30,
          instructions: [
            'Start in mountain pose (Tadasana)',
            'Raise arms overhead on inhale',
            'Forward fold on exhale',
            'Step or jump back to plank pose',
            'Lower to chaturanga dandasana',
            'Upward facing dog, downward facing dog',
            'Step forward and return to mountain pose'
          ]
        },
        {
          name: 'Warrior Sequence',
          sets: 2,
          reps: 1,
          duration: 180,
          restTime: 45,
          instructions: [
            'From downward dog, step right foot forward',
            'Rise up into Warrior I pose',
            'Open hips and arms to Warrior II',
            'Reverse Warrior with back arm down, front arm up',
            'Return to center and repeat on other side'
          ]
        },
        {
          name: 'Balance Series',
          sets: 2,
          reps: 1,
          duration: 120,
          restTime: 30,
          instructions: [
            'Start with Tree Pose on right leg',
            'Transition to Eagle Pose if comfortable',
            'Return to center and repeat on left side',
            'Move slowly and use a wall for support if needed'
          ]
        }
      ]
    },
    {
      id: '5',
      title: 'Cardio Kickstart',
      type: 'Cardio',
      description: 'Heart-pumping cardio workout to boost endurance and burn calories.',
      level: 'beginner',
      duration: 25,
      caloriesBurn: 280,
      exercises: [
        {
          name: 'Jumping Jacks',
          sets: 3,
          reps: 30,
          duration: 60,
          restTime: 20,
          instructions: [
            'Start with feet together and arms at sides',
            'Jump to spread legs and bring arms overhead',
            'Jump back to starting position',
            'Maintain a steady rhythm'
          ]
        },
        {
          name: 'High Knees',
          sets: 3,
          reps: 40,
          duration: 45,
          restTime: 25,
          instructions: [
            'Stand with feet hip-width apart',
            'Run in place, bringing knees up toward chest',
            'Pump arms in opposition to legs',
            'Keep core engaged throughout'
          ]
        },
        {
          name: 'Burpees',
          sets: 3,
          reps: 10,
          duration: 60,
          restTime: 30,
          instructions: [
            'Begin in standing position',
            'Drop down into squat position, placing hands on floor',
            'Kick feet back into plank position',
            'Perform a push-up (optional)',
            'Return feet to squat position',
            'Jump up explosively with hands overhead'
          ]
        },
        {
          name: 'Lateral Jumps',
          sets: 3,
          reps: 20,
          duration: 45,
          restTime: 25,
          instructions: [
            'Stand with feet together',
            'Jump sideways 1-2 feet to the right',
            'Jump back to the left',
            'Keep knees soft to absorb impact'
          ]
        }
      ]
    },
    {
      id: '6',
      title: 'Lower Body Focus',
      type: 'Strength Training',
      description: 'Build strong, toned legs and glutes with this targeted workout.',
      level: 'intermediate',
      duration: 40,
      caloriesBurn: 300,
      exercises: [
        {
          name: 'Bodyweight Squats',
          sets: 4,
          reps: 15,
          duration: 60,
          restTime: 40,
          instructions: [
            'Stand with feet shoulder-width apart',
            'Lower your hips back and down as if sitting in a chair',
            'Keep chest up and knees aligned with toes',
            'Push through heels to return to standing'
          ]
        },
        {
          name: 'Lunges',
          sets: 3,
          reps: 12,
          duration: 60,
          restTime: 40,
          instructions: [
            'Stand with feet together',
            'Step forward with right foot into a lunge',
            'Lower until both knees form 90-degree angles',
            'Push through front heel to return to start',
            'Alternate legs with each rep'
          ]
        },
        {
          name: 'Glute Bridges',
          sets: 3,
          reps: 15,
          duration: 45,
          restTime: 30,
          instructions: [
            'Lie on your back with knees bent, feet flat on floor',
            'Pushing through heels, lift hips toward ceiling',
            'Squeeze glutes at the top',
            'Lower with control and repeat'
          ]
        },
        {
          name: 'Calf Raises',
          sets: 3,
          reps: 20,
          duration: 45,
          restTime: 30,
          instructions: [
            'Stand with feet hip-width apart',
            'Rise up onto balls of feet, lifting heels high',
            'Pause briefly at the top',
            'Lower with control and repeat',
            'Hold onto a wall for balance if needed'
          ]
        }
      ]
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 80
      } 
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center">
        <Dumbbell className="mr-2 h-5 w-5 text-purple-600" />
        Select a Workout
      </h2>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        {workouts.map((workout) => (
          <motion.div key={workout.id} variants={itemVariants}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full bg-white border border-gray-100">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${workout.level === 'beginner' ? 'bg-green-100 text-green-800' : 
                      workout.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 
                      workout.level === 'advanced' ? 'bg-red-100 text-red-800' : 
                      'bg-purple-100 text-purple-800'}
                  `}>
                    {workout.level === 'all' ? 'All Levels' : 
                     workout.level.charAt(0).toUpperCase() + workout.level.slice(1)}
                  </span>
                  <span className="flex items-center text-xs text-purple-800 bg-purple-100 px-2 py-1 rounded-full">
                    {workout.type}
                  </span>
                </div>
                <CardTitle className="text-xl">{workout.title}</CardTitle>
                <CardDescription className="line-clamp-2">{workout.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="flex justify-between text-sm mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-purple-600" />
                    <span>{workout.duration} min</span>
                  </div>
                  <div className="flex items-center">
                    <Flame className="h-4 w-4 mr-1 text-orange-500" />
                    <span>~{workout.caloriesBurn} cal</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1 text-yellow-500" />
                    <span>{workout.exercises.length} exercises</span>
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="flex -space-x-2 overflow-hidden">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="inline-block h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 ring-2 ring-white flex items-center justify-center text-xs text-white">
                        <User size={16} />
                      </div>
                    ))}
                    <div className="inline-block h-8 w-8 rounded-full bg-gray-200 ring-2 ring-white flex items-center justify-center text-xs text-gray-600">
                      +{Math.floor(Math.random() * 50) + 10}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">People completed this workout</p>
                </div>
              </CardContent>
              
              <CardFooter className="bg-gray-50 border-t">
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => onSelectWorkout(workout)}
                >
                  <Dumbbell className="mr-2 h-4 w-4" />
                  Start Workout
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default WorkoutList;
