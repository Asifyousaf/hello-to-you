import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Activity, Award, Heart, MessageSquare, Calendar, ChevronRight, Edit, Save, X, Ruler, Weight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Layout from '../components/Layout';
import { supabase } from "@/integrations/supabase/client";
import AvatarSelector from '../components/AvatarSelector';

// Define a proper interface for profile data
interface ProfileData {
  id: string;
  full_name: string | null;
  age: number | null;
  height: number | null;
  weight: number | null;
  fitness_level: string | null;
  fitness_goal: string | null;
  avatar_url: string | null;
  username: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<ProfileData>({
    id: '',
    full_name: '',
    age: null,
    height: null,
    weight: null,
    fitness_level: '',
    fitness_goal: '',
    avatar_url: 'https://img.freepik.com/premium-vector/fitness-trainer-avatar-fitness-trainer-icon-vector-illustration_564659-259.jpg', // Default avatar
    username: null,
    created_at: null,
    updated_at: null
  });
  
  const [editMode, setEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState<ProfileData>({
    id: '',
    full_name: '',
    age: null,
    height: null,
    weight: null,
    fitness_level: '',
    fitness_goal: '',
    avatar_url: 'https://img.freepik.com/premium-vector/fitness-trainer-avatar-fitness-trainer-icon-vector-illustration_564659-259.jpg', // Default avatar
    username: null,
    created_at: null,
    updated_at: null
  });
  
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (!session) {
        navigate('/auth');
        return;
      }
      
      await fetchProfile(session.user.id);
      setLoading(false);
    };
    
    getSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) {
          navigate('/auth');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const profileData = {
          id: data.id,
          full_name: data.full_name || '',
          age: data.age,
          height: data.height,
          weight: data.weight,
          fitness_level: data.fitness_level || '',
          fitness_goal: data.fitness_goal || '',
          avatar_url: data.avatar_url || 'https://img.freepik.com/premium-vector/fitness-trainer-avatar-fitness-trainer-icon-vector-illustration_564659-259.jpg',
          username: data.username,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        
        setProfile(profileData);
        setTempProfile(profileData);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch profile data",
        variant: "destructive"
      });
      console.error('Error fetching profile:', error);
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      // Cancel editing
      setTempProfile({...profile});
      setEditMode(false);
      setShowAvatarSelector(false);
    } else {
      // Start editing
      setEditMode(true);
      // Show avatar selector when entering edit mode
      setShowAvatarSelector(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setTempProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    setTempProfile(prev => ({
      ...prev,
      avatar_url: avatarUrl
    }));
  };

  const handleSaveProfile = async () => {
    if (!session?.user) return;

    setLoading(true);
    try {
      // Parse numeric values
      const updatedProfile = {
        ...tempProfile,
        age: tempProfile.age ? parseInt(String(tempProfile.age)) : null,
        height: tempProfile.height ? parseInt(String(tempProfile.height)) : null,
        weight: tempProfile.weight ? parseInt(String(tempProfile.weight)) : null
      };

      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', session.user.id);

      if (error) throw error;

      setProfile({...tempProfile});
      setEditMode(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-purple-600">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-24 bg-white">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
            <div className="w-32 h-32 rounded-full bg-purple-200 mb-4 md:mb-0 md:mr-6 overflow-hidden relative">
              <Avatar className="w-full h-full">
                <AvatarImage 
                  src={tempProfile.avatar_url || ''} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
                <AvatarFallback>{profile.full_name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              {editMode && (
                <button 
                  className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100"
                  onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                >
                  <Edit size={14} className="text-purple-600" />
                </button>
              )}
            </div>
            
            <div className="text-center md:text-left flex-1">
              {editMode ? (
                <Input
                  name="full_name"
                  value={tempProfile.full_name || ""}
                  onChange={handleInputChange}
                  className="text-2xl font-bold mb-1"
                  placeholder="Full Name"
                />
              ) : (
                <h1 className="text-2xl font-bold mb-1">{profile.full_name}</h1>
              )}
              
              <p className="text-gray-600 mb-4">Fitness enthusiast • Joined March 2023</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">
                  {profile.fitness_level ? profile.fitness_level.charAt(0).toUpperCase() + profile.fitness_level.slice(1) : 'No level set'}
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                  {profile.fitness_goal ? profile.fitness_goal.replace('_', ' ').charAt(0).toUpperCase() + profile.fitness_goal.replace('_', ' ').slice(1) : 'No goal set'}
                </span>
              </div>

              {showAvatarSelector && editMode && (
                <div className="mb-6 p-4 bg-white border rounded-lg shadow-sm">
                  <AvatarSelector 
                    selectedAvatar={tempProfile.avatar_url || ''}
                    onSelectAvatar={handleAvatarSelect}
                  />
                </div>
              )}
              
              {editMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Age</label>
                    <Input
                      name="age"
                      type="number"
                      value={tempProfile.age?.toString() || ""}
                      onChange={handleInputChange}
                      placeholder="Age"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Height (cm)</label>
                    <Input
                      name="height"
                      type="number"
                      value={tempProfile.height?.toString() || ""}
                      onChange={handleInputChange}
                      placeholder="Height"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Weight (kg)</label>
                    <Input
                      name="weight"
                      type="number"
                      value={tempProfile.weight?.toString() || ""}
                      onChange={handleInputChange}
                      placeholder="Weight"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Fitness Level</label>
                    <Select 
                      value={tempProfile.fitness_level || ""}
                      onValueChange={(value) => handleSelectChange('fitness_level', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Fitness Goal</label>
                    <Select 
                      value={tempProfile.fitness_goal || ""}
                      onValueChange={(value) => handleSelectChange('fitness_goal', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight_loss">Weight Loss</SelectItem>
                        <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                        <SelectItem value="endurance">Endurance</SelectItem>
                        <SelectItem value="flexibility">Flexibility</SelectItem>
                        <SelectItem value="general_fitness">General Fitness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                  {profile.age && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-purple-600" />
                      <span>{profile.age} years</span>
                    </div>
                  )}
                  
                  {profile.height && (
                    <div className="flex items-center">
                      <Ruler className="h-4 w-4 mr-1 text-purple-600" />
                      <span>{profile.height} cm</span>
                    </div>
                  )}
                  
                  {profile.weight && (
                    <div className="flex items-center">
                      <Weight className="h-4 w-4 mr-1 text-purple-600" />
                      <span>{profile.weight} kg</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-4 md:mt-0">
              {editMode ? (
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleSaveProfile} 
                    className="flex items-center text-sm"
                    disabled={loading}
                  >
                    <Save size={16} className="mr-1" />
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleEditToggle}
                    className="flex items-center text-sm"
                    disabled={loading}
                  >
                    <X size={16} className="mr-1" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={handleEditToggle}
                  className="flex items-center text-sm"
                >
                  <Settings size={16} className="mr-1" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-purple-600 mb-1">
                <Activity size={24} className="inline" />
              </div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-gray-500">Workouts Completed</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-purple-600 mb-1">
                <Award size={24} className="inline" />
              </div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-gray-500">Achievements</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-purple-600 mb-1">
                <Heart size={24} className="inline" />
              </div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-gray-500">Favorites</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-purple-600 mb-1">
                <MessageSquare size={24} className="inline" />
              </div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-gray-500">Community Posts</p>
            </div>
          </div>
          
          {/* Profile Tabs */}
          <Tabs defaultValue="activity" className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="plans">My Plans</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity" className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              
              <div className="space-y-4">
                {/* Empty state */}
                <div className="py-8 text-center bg-gray-50 rounded-lg border">
                  <Activity size={32} className="text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-600">No Activity Yet</h3>
                  <p className="text-gray-500 text-sm mt-1">Complete workouts to track your progress</p>
                </div>
                
                {/* View All Button */}
                <button className="w-full py-3 text-center text-purple-600 hover:text-purple-800 text-sm font-medium">
                  Start Your First Workout
                </button>
              </div>
            </TabsContent>
            
            <TabsContent value="progress" className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
              
              {/* Empty progress state */}
              <div className="bg-white rounded-lg border p-8 text-center mb-4">
                <div className="h-40 w-40 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity size={64} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Progress Data Yet</h3>
                <p className="text-gray-500 mb-4">Complete workouts to see your progress charts</p>
                <Button className="bg-purple-600">Start Tracking</Button>
              </div>
              
              {/* Progress Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border p-4">
                  <h3 className="font-medium mb-3">Fitness Goals</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Weekly Workouts</span>
                        <span className="font-medium">0/4 completed</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Step Goal</span>
                        <span className="font-medium">0/10,000 steps</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Mindfulness Minutes</span>
                        <span className="font-medium">0/60 minutes</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border p-4">
                  <h3 className="font-medium mb-3">Current Streaks</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                        <span>Workout Streak</span>
                      </div>
                      <span className="font-medium">0 days</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Heart className="h-5 w-5 text-purple-600 mr-2" />
                        <span>Meditation Streak</span>
                      </div>
                      <span className="font-medium">0 days</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Utensils className="h-5 w-5 text-purple-600 mr-2" />
                        <span>Meal Logging</span>
                      </div>
                      <span className="font-medium">0 days</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="plans" className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Your Wellness Plans</h2>
              
              <div className="space-y-4">
                {/* Empty state */}
                <div className="py-8 text-center bg-gray-50 rounded-lg border">
                  <Dumbbell size={32} className="text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-600">No Active Plans</h3>
                  <p className="text-gray-500 text-sm mt-1">Enroll in a plan to start your fitness journey</p>
                </div>
                
                <Button className="w-full bg-purple-600">
                  Browse Available Plans
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="achievements" className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Your Achievements</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {/* Locked Achievement 1 */}
                <div className="bg-white border rounded-lg p-4 text-center bg-gray-50">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-sm text-gray-400">Early Bird</h3>
                  <p className="text-xs text-gray-400 mt-1">Complete 10 workouts before 8 AM</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 h-1 rounded-full">
                      <div className="bg-purple-600 h-1 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">0% complete</p>
                  </div>
                </div>
                
                {/* Locked Achievement 2 */}
                <div className="bg-white border rounded-lg p-4 text-center bg-gray-50">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-sm text-gray-400">Zen Master</h3>
                  <p className="text-xs text-gray-400 mt-1">Complete 30 meditation sessions</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 h-1 rounded-full">
                      <div className="bg-purple-600 h-1 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">0% complete</p>
                  </div>
                </div>
                
                {/* Locked Achievement 3 */}
                <div className="bg-white border rounded-lg p-4 text-center bg-gray-50">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-sm text-gray-400">Marathon Ready</h3>
                  <p className="text-xs text-gray-400 mt-1">Run your first 26.2 miles</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 h-1 rounded-full">
                      <div className="bg-purple-600 h-1 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">0% complete</p>
                  </div>
                </div>
                
                {/* Locked Achievement 4 */}
                <div className="bg-white border rounded-lg p-4 text-center bg-gray-50">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-sm text-gray-400">Meal Prep Pro</h3>
                  <p className="text-xs text-gray-400 mt-1">Log 50 homemade meals</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 h-1 rounded-full">
                      <div className="bg-purple-600 h-1 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">0% complete</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Button className="border border-purple-600 text-purple-600 px-6 py-2 bg-white hover:bg-purple-50 transition-colors">
                  View All Achievements
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

// Import these icons at the top of the file
import { Dumbbell, Utensils } from 'lucide-react';

export default ProfilePage;
