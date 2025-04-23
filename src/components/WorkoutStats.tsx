
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Activity, Calendar, Flame, Clock, Dumbbell } from 'lucide-react';
import { format, subDays, parseISO } from 'date-fns';
import { toast } from "@/components/ui/use-toast";

interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number;
  totalCalories: number;
  workoutsByType: { [key: string]: number };
  recentWorkouts: Array<{
    date: string;
    duration: number;
    calories: number;
  }>;
}

interface WorkoutStatsProps {
  userId: string;
}

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f97316', '#a855f7', '#ef4444'];

const WorkoutStats = ({ userId }: WorkoutStatsProps) => {
  const [stats, setStats] = useState<WorkoutStats>({
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
    workoutsByType: {},
    recentWorkouts: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Get all workouts for this user
        const { data, error } = await supabase
          .from('workouts')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });
          
        if (error) throw error;
        
        if (!data || data.length === 0) {
          setIsLoading(false);
          return;
        }
        
        // Calculate total stats
        const totalWorkouts = data.length;
        const totalDuration = data.reduce((sum, workout) => sum + workout.duration, 0);
        const totalCalories = data.reduce((sum, workout) => sum + workout.calories_burned, 0);
        
        // Count workouts by type
        const workoutsByType = data.reduce((acc, workout) => {
          acc[workout.type] = (acc[workout.type] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });
        
        // Get workouts in last 7 days for chart
        const today = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = subDays(today, 6 - i);
          return format(date, 'yyyy-MM-dd');
        });
        
        const recentWorkoutMap = last7Days.reduce((acc, date) => {
          acc[date] = { date, duration: 0, calories: 0 };
          return acc;
        }, {} as { [key: string]: { date: string; duration: number; calories: number } });
        
        // Aggregate workout data by date
        data.forEach(workout => {
          const workoutDate = workout.date;
          if (recentWorkoutMap[workoutDate]) {
            recentWorkoutMap[workoutDate].duration += workout.duration;
            recentWorkoutMap[workoutDate].calories += workout.calories_burned;
          }
        });
        
        const recentWorkouts = Object.values(recentWorkoutMap);
        
        setStats({
          totalWorkouts,
          totalDuration,
          totalCalories,
          workoutsByType,
          recentWorkouts
        });
        
      } catch (error: any) {
        console.error('Error fetching workout stats:', error);
        toast({
          title: "Error",
          description: "Failed to load workout statistics",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [userId]);

  const pieChartData = Object.entries(stats.workoutsByType).map(([name, value]) => ({
    name,
    value
  }));

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse text-purple-600">Loading stats...</div>
      </div>
    );
  }

  if (stats.totalWorkouts === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5 text-purple-600" />
            Workout Statistics
          </CardTitle>
          <CardDescription>No workout data available yet</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Dumbbell className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-lg font-medium mb-2">No workout history found</p>
          <p className="text-gray-500 mb-4">Log your first workout to see your statistics</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Dumbbell className="h-7 w-7 text-purple-600 mr-3" />
              <div className="text-3xl font-bold">{stats.totalWorkouts}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-7 w-7 text-purple-600 mr-3" />
              <div className="text-3xl font-bold">{stats.totalDuration} <span className="text-base font-normal text-gray-500">mins</span></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Flame className="h-7 w-7 text-purple-600 mr-3" />
              <div className="text-3xl font-bold">{stats.totalCalories}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Dumbbell className="mr-2 h-5 w-5 text-purple-600" />
              Workouts by Type
            </CardTitle>
            <CardDescription>Distribution of your workouts by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value, name) => [`${value} workouts`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-purple-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your workout activity over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stats.recentWorkouts}
                  margin={{ top: 5, right: 20, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(parseISO(date), 'MMM dd')}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    labelFormatter={(date) => format(parseISO(date), 'MMMM d, yyyy')}
                    formatter={(value, name) => {
                      if (name === 'duration') return [`${value} mins`, 'Duration'];
                      if (name === 'calories') return [`${value} cal`, 'Calories'];
                      return [value, name];
                    }}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="duration" 
                    stroke="#8b5cf6" 
                    name="duration" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#ec4899" 
                    name="calories" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkoutStats;
