
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import Layout from '../components/Layout';
import WorkoutSession from '../components/WorkoutSession';
import SearchAndFilter from '../components/workouts/SearchAndFilter';
import WorkoutCard from '../components/workouts/WorkoutCard';
import WorkoutHeader from '../components/workouts/WorkoutHeader';
import { WorkoutData } from '@/types/workout';

interface WorkoutDataExtended extends WorkoutData {
  // All properties from WorkoutData are now inherited correctly
  // No need to redefine description as it's now optional in the base interface
  calories_burned: number;
  created_at?: string;
  date?: string;
  duration: number;
  exercises: any;
  id: string;
  title: string;
  type: string;
  user_id: string;
}

const WorkoutsPage = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [userWorkouts, setUserWorkouts] = useState<WorkoutData[]>([]);

  const workoutPlans: WorkoutData[] = [
    {
      id: "1",
      title: "Full Body HIIT Challenge",
      type: "HIIT",
      description: "High intensity interval training to build strength and endurance.",
      level: "beginner",
      duration: 30,
      calories_burned: 300,
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      exercises: [
        {
          name: "Jumping Jacks",
          sets: 3,
          reps: 20,
          duration: 60,
          restTime: 30,
          instructions: [
            "Start with your feet together and arms at your sides",
            "Jump up and spread your feet beyond shoulder-width while bringing your arms above your head",
            "Jump again to return to the starting position",
            "Repeat for the specified number of reps"
          ]
        },
        {
          name: "Push-ups",
          sets: 3,
          reps: 10,
          duration: 60,
          restTime: 30,
          instructions: [
            "Start in a plank position with your hands shoulder-width apart",
            "Lower your body until your chest nearly touches the floor",
            "Push yourself back up to the starting position",
            "Keep your body in a straight line throughout the movement"
          ]
        },
        {
          name: "Air Squats",
          sets: 3,
          reps: 15,
          duration: 60,
          restTime: 30,
          instructions: [
            "Stand with feet shoulder-width apart",
            "Push your hips back and bend your knees as if sitting in a chair",
            "Lower until your thighs are parallel to the ground",
            "Push through your heels to return to starting position"
          ]
        }
      ]
    },
    {
      id: "2",
      title: "Core Focus & Strength",
      type: "CORE",
      description: "Build a strong core with this targeted workout routine.",
      level: "intermediate",
      duration: 25,
      calories_burned: 200,
      image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      exercises: [
        {
          name: "Plank",
          sets: 3,
          reps: 1,
          duration: 45,
          restTime: 30,
          instructions: [
            "Start in a push-up position but with your weight on your forearms",
            "Keep your body in a straight line from head to heels",
            "Engage your core and hold the position",
            "Breathe normally and maintain good form"
          ]
        },
        {
          name: "Russian Twists",
          sets: 3,
          reps: 15,
          duration: 60,
          restTime: 30,
          instructions: [
            "Sit on the floor with knees bent and feet lifted slightly",
            "Lean back slightly to engage your core",
            "Twist your torso from side to side",
            "Touch the floor beside your hips with each twist"
          ]
        },
        {
          name: "Mountain Climbers",
          sets: 3,
          reps: 20,
          duration: 60,
          restTime: 30,
          instructions: [
            "Start in a plank position with arms straight",
            "Bring one knee toward your chest",
            "Return it to the starting position while bringing the other knee forward",
            "Continue alternating at a quick pace"
          ]
        }
      ]
    },
    {
      id: "3",
      title: "Energizing Yoga Flow",
      type: "YOGA",
      description: "Increase flexibility and mindfulness with this yoga routine.",
      level: "all",
      duration: 45,
      calories_burned: 150,
      image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      exercises: [
        {
          name: "Sun Salutation (Surya Namaskar)",
          sets: 3,
          reps: 1,
          duration: 120,
          restTime: 30,
          instructions: [
            "Start in mountain pose (Tadasana)",
            "Inhale, raise your arms overhead",
            "Exhale, fold forward",
            "Inhale, halfway lift",
            "Exhale, step or jump back to plank",
            "Lower to chaturanga",
            "Inhale to upward facing dog",
            "Exhale to downward facing dog",
            "Step forward and return to mountain pose"
          ]
        },
        {
          name: "Warrior II (Virabhadrasana II)",
          sets: 2,
          reps: 1,
          duration: 60,
          restTime: 20,
          instructions: [
            "Step your feet wide apart",
            "Turn your right foot out 90 degrees and left foot in slightly",
            "Extend your arms parallel to the floor",
            "Bend your right knee over your ankle",
            "Gaze over your right fingertips",
            "Hold and breathe deeply",
            "Repeat on the other side"
          ]
        },
        {
          name: "Tree Pose (Vrksasana)",
          sets: 2,
          reps: 1,
          duration: 60,
          restTime: 20,
          instructions: [
            "Start standing with feet together",
            "Shift your weight to one foot",
            "Place the sole of your other foot on your inner thigh",
            "Bring your hands to prayer position or extend overhead",
            "Focus your gaze on a fixed point",
            "Hold and breathe deeply",
            "Repeat on the other side"
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session) {
        await fetchUserWorkouts(session.user.id);
      }
      
      setLoading(false);
    };
    
    getSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session) {
          await fetchUserWorkouts(session.user.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserWorkouts = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      console.log('Fetched user workouts:', data);
      
      if (data) {
        const formattedWorkouts = data.map((workout: WorkoutDataExtended) => {
          let parsedExercises: any = [];
          let isPack = false;
          let packItems: any[] = [];
          
          try {
            if (typeof workout.exercises === 'string') {
              parsedExercises = JSON.parse(workout.exercises);
            } else {
              parsedExercises = workout.exercises || [];
            }
          } catch (e) {
            console.error('Error parsing exercises:', e);
          }
          
          const isWorkoutPack = 
            typeof parsedExercises === 'object' && 
            parsedExercises !== null &&
            'isWorkoutPack' in parsedExercises && 
            parsedExercises.isWorkoutPack === true;
          
          if (isWorkoutPack) {
            isPack = true;
            
            if ('originalWorkouts' in parsedExercises && Array.isArray(parsedExercises.originalWorkouts)) {
              packItems = parsedExercises.originalWorkouts.map((workout: any) => ({
                id: workout.id || crypto.randomUUID(),
                title: workout.name || "AI Workout Exercise",
                type: "AI_EXERCISE",
                description: Array.isArray(workout.instructions) ? workout.instructions[0] : "AI-generated exercise",
                level: "custom",
                duration: workout.duration || 60,
                calories_burned: workout.calories_burned || 100,
                exercises: [workout],
                image: workout.gifUrl || "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              }));
            } else if ('list' in parsedExercises && Array.isArray(parsedExercises.list)) {
              packItems = parsedExercises.list.map((exercise: any) => ({
                id: crypto.randomUUID(),
                title: exercise.name || "AI Exercise",
                type: "AI_EXERCISE",
                description: Array.isArray(exercise.instructions) ? exercise.instructions[0] : "AI-generated exercise",
                level: "custom",
                duration: exercise.duration || 60,
                calories_burned: exercise.calories_burned || 100,
                exercises: [exercise],
                image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              }));
            }
          }
          
          const calorieValue = workout.calories_burned || 300;
          
          return {
            ...workout,
            id: workout.id || crypto.randomUUID(),
            exercises: parsedExercises,
            calories_burned: calorieValue,
            caloriesBurn: calorieValue,
            level: workout.level || "custom",
            description: workout.description || (isPack 
              ? `AI-generated workout pack with ${packItems.length} focused exercises` 
              : "Custom workout generated by AI assistant"),
            image: workout.image || (isPack
              ? "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              : "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"),
            isPack,
            packItems,
            title: workout.title || "Untitled Workout",
            type: workout.type || "CUSTOM"
          } as WorkoutData;
        });
        
        setUserWorkouts(formattedWorkouts);
      }
    } catch (error) {
      console.error('Error fetching user workouts:', error);
      toast({
        title: "Error",
        description: "Failed to load your custom workouts",
        variant: "destructive"
      });
    }
  };

  const handleStartWorkout = (workout: WorkoutData) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to start a workout session",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    setActiveWorkout(workout);
  };

  const handleCompleteWorkout = async (workoutData: any) => {
    try {
      if (!session) return;
      
      const { error } = await supabase.from('workouts').insert({
        user_id: session.user.id,
        title: workoutData.title,
        type: workoutData.type,
        duration: workoutData.duration,
        calories_burned: workoutData.calories_burned,
        date: new Date().toISOString().split('T')[0]
      });

      if (error) throw error;
      
      toast({
        title: "Workout Completed",
        description: `Great job! Burned ${workoutData.calories_burned} calories in ${workoutData.duration} minutes.`,
      });
      
      setActiveWorkout(null);
      navigate('/workout-tracker');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log your workout",
        variant: "destructive"
      });
      console.error('Error saving workout:', error);
    }
  };

  const handleDeleteWorkout = async (workoutId: string) => {
    try {
      if (!session) return;
      
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId);

      if (error) throw error;
      
      setUserWorkouts(prev => prev.filter(w => w.id !== workoutId));
      
      toast({
        title: "Workout Deleted",
        description: "The workout has been removed from your collection",
      });
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast({
        title: "Error",
        description: "Failed to delete workout",
        variant: "destructive"
      });
    }
  };

  const allWorkouts = [...workoutPlans, ...userWorkouts];

  const filteredWorkouts = allWorkouts.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (workout.description && workout.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'all' || 
                          (filter === 'custom' && workout.level === 'custom') ||
                          (filter === 'pack' && workout.isPack) ||
                          (filter !== 'custom' && filter !== 'pack' && workout.level === filter);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-purple-600">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (activeWorkout) {
    return (
      <Layout>
        <div className="pt-24 pb-16 bg-white">
          <div className="container mx-auto px-4">
            <button 
              onClick={() => setActiveWorkout(null)} 
              className="flex items-center text-purple-600 mb-6 hover:text-purple-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Workouts
            </button>
            
            <WorkoutSession 
              workout={{
                ...activeWorkout,
                description: activeWorkout.description || '',
                level: activeWorkout.level || 'beginner',
                caloriesBurn: activeWorkout.calories_burned || activeWorkout.caloriesBurn || 300
              }}
              onComplete={handleCompleteWorkout}
              onCancel={() => setActiveWorkout(null)}
            />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <WorkoutHeader 
        onStartFirstWorkout={(workout) => handleStartWorkout({
          ...workout,
          description: workout.description || '',
          level: workout.level || 'beginner'
        })} 
        firstWorkout={{
          ...workoutPlans[0],
          description: workoutPlans[0].description || '',
          level: workoutPlans[0].level || 'beginner'
        }}
      />

      <div className="bg-white py-6 border-b">
        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filter={filter}
          setFilter={setFilter}
        />
      </div>

      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Recommended Workouts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onStart={(workout) => handleStartWorkout({
                  ...workout,
                  description: workout.description || '',
                  level: workout.level || 'beginner'
                })}
                onDelete={handleDeleteWorkout}
                userId={session?.user?.id}
              />
            ))}
          </div>

          {filteredWorkouts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No workouts found matching your search.</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <button className="border border-purple-600 text-purple-600 px-6 py-2 rounded-full hover:bg-purple-50 transition-colors">
              View All Workouts
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WorkoutsPage;
