import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Utensils, Dumbbell, Activity, MessageSquare, Trophy, Users, Heart } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import AISearchBox from '../components/AISearchBox';
import GeminiChat from '../components/gemini/GeminiChat';
import useSounds from '../hooks/useSounds';

const Index = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    steps: 0,
    caloriesBurned: 0,
    mindfulMinutes: 0,
    stepsTarget: 10000,
    caloriesTarget: 600,
    mindfulTarget: 60
  });
  const navigate = useNavigate();
  
  // Check for user session
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
      
      if (session) {
        fetchUserDashboardData(session.user.id);
      }
    };
    
    getSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserDashboardData(session.user.id);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  // Fetch user dashboard data
  const fetchUserDashboardData = async (userId: string) => {
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch workout data for today
      const { data: workouts, error: workoutsError } = await supabase
        .from('workouts')
        .select('calories_burned, duration')
        .eq('user_id', userId)
        .eq('date', today);
      
      if (workoutsError) throw workoutsError;
      
      // Calculate total calories burned from workouts
      const totalCaloriesBurned = workouts?.reduce((sum, workout) => sum + (workout.calories_burned || 0), 0) || 0;
      
      // For steps, we'll simulate based on calories (in a real app, you might have a steps table)
      const estimatedSteps = Math.round(totalCaloriesBurned * 15); // rough estimate: 15 steps per calorie
      
      // For mindfulness, we'll assume we have no real data yet
      const mindfulMinutes = 0;
      
      setDashboardData({
        steps: estimatedSteps,
        caloriesBurned: totalCaloriesBurned,
        mindfulMinutes: mindfulMinutes,
        stepsTarget: 10000,
        caloriesTarget: 600,
        mindfulTarget: 60
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };
  
  const handleStartJourney = () => {
    if (session) {
      navigate('/workouts');
    } else {
      toast({
        title: "Sign in required",
        description: "Please sign in to start your wellness journey",
        variant: "default",
      });
      navigate('/auth');
    }
  };
  const { play, isLoaded } = useSounds();
  const [chatVisible, setChatVisible] = useState(false);

  const handleAISearchSubmit = async (query: string) => {
    // Play sound effect when search is submitted
    if (isLoaded.beep) {
      play('beep', { volume: 0.5 });
    }
    
    // Show the chat
    setChatVisible(true);
    
    // Find the chat component and pass the message
    if (window && (window as any).geminiChatRef) {
      (window as any).geminiChatRef.handleIncomingMessage(query);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Transform Your Life</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Your personalized journey to wellness starts here. AI-powered health coaching, customized meal plans, and mindful living.
          </p>
          <Button 
            onClick={handleStartJourney}
            className="bg-white text-purple-600 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors flex items-center mx-auto"
          >
            <Play size={18} className="mr-2" />
            Start Your Journey
          </Button>
          
          {/* AI Search Box */}
          <div className="mt-10 max-w-xl mx-auto">
            <AISearchBox onSubmit={handleAISearchSubmit} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <div className="bg-emerald-400 rounded-lg p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
              <div className="mb-4">
                <Utensils className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Meal Plans</h3>
              <p className="mb-4">AI-powered nutrition plans tailored to your goals</p>
              <Link to="/nutrition" className="bg-white text-emerald-500 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors inline-block">
                Learn More
              </Link>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-blue-400 rounded-lg p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
              <div className="mb-4">
                <Dumbbell className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Workouts</h3>
              <p className="mb-4">Personalized fitness routines that adapt to you</p>
              <Link to="/workouts" className="bg-white text-blue-500 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors inline-block">
                Learn More
              </Link>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-purple-400 rounded-lg p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
              <div className="mb-4">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Mindfulness</h3>
              <p className="mb-4">Guided meditation and stress relief practices</p>
              <Link to="/mindfulness" className="bg-white text-purple-500 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors inline-block">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Your Wellness Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dashboard Widget 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-2">
                <Activity className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="text-sm text-gray-600">Steps Today</h3>
              </div>
              <p className="text-2xl font-bold">{dashboardData.steps.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Target: {dashboardData.stepsTarget.toLocaleString()}</p>
              <div className="mt-3 bg-gray-200 h-2 rounded-full">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${Math.min(100, (dashboardData.steps / dashboardData.stepsTarget) * 100)}%` }}
                ></div>
              </div>
              {session ? (
                <div className="mt-2 text-xs text-right text-gray-500">
                  {Math.round((dashboardData.steps / dashboardData.stepsTarget) * 100)}% of daily goal
                </div>
              ) : (
                <div className="mt-2 text-xs text-center text-purple-600">
                  <Link to="/auth">Sign in to track your progress</Link>
                </div>
              )}
            </div>

            {/* Dashboard Widget 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-2">
                <Activity className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="text-sm text-gray-600">Calories Burned</h3>
              </div>
              <p className="text-2xl font-bold">{dashboardData.caloriesBurned}</p>
              <p className="text-sm text-gray-500">Target: {dashboardData.caloriesTarget}</p>
              <div className="mt-3 bg-gray-200 h-2 rounded-full">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${Math.min(100, (dashboardData.caloriesBurned / dashboardData.caloriesTarget) * 100)}%` }}
                ></div>
              </div>
              {session ? (
                <div className="mt-2 text-xs text-right text-gray-500">
                  {Math.round((dashboardData.caloriesBurned / dashboardData.caloriesTarget) * 100)}% of daily goal
                </div>
              ) : (
                <div className="mt-2 text-xs text-center text-purple-600">
                  <Link to="/auth">Sign in to track your progress</Link>
                </div>
              )}
            </div>

            {/* Dashboard Widget 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-2">
                <Heart className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="text-sm text-gray-600">Mindfulness</h3>
              </div>
              <p className="text-2xl font-bold">{dashboardData.mindfulMinutes}</p>
              <p className="text-sm text-gray-500">Target: {dashboardData.mindfulTarget} mins</p>
              <div className="mt-3 bg-gray-200 h-2 rounded-full">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${Math.min(100, (dashboardData.mindfulMinutes / dashboardData.mindfulTarget) * 100)}%` }}
                ></div>
              </div>
              {session ? (
                <div className="mt-2 text-xs text-right text-gray-500">
                  {Math.round((dashboardData.mindfulMinutes / dashboardData.mindfulTarget) * 100)}% of daily goal
                </div>
              ) : (
                <div className="mt-2 text-xs text-center text-purple-600">
                  <Link to="/auth">Sign in to track your progress</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Join Our Thriving Community</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Connect with like-minded individuals, share your progress, and get inspired by success stories.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">10,000+</p>
              <p className="text-gray-600">Active Members</p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">500+</p>
              <p className="text-gray-600">Daily Discussions</p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <Trophy className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">1,000+</p>
              <p className="text-gray-600">Success Stories</p>
            </div>
          </div>
          
          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-200 mr-3 overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah Johnson" className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="font-bold">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">Fitness Enthusiast</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                WellnessAI transformed my approach to fitness. The AI-powered recommendations are spot-on!
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-200 mr-3 overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Michael Chen" className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="font-bold">Michael Chen</p>
                  <p className="text-sm text-gray-600">Marathon Runner</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                The personalized workout plans have helped me achieve my fitness goals faster than ever.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-200 mr-3 overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Emma Davis" className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="font-bold">Emma Davis</p>
                  <p className="text-sm text-gray-600">Yoga Instructor</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                The mindfulness features have become an essential part of my daily wellness routine.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/community" className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors inline-block">
              Join Our Community
            </Link>
          </div>
        </div>
      </section>

      {/* Chat Component */}
      <GeminiChat visible={chatVisible} onClose={() => setChatVisible(false)} />
    </Layout>
  );
};

export default Index;
