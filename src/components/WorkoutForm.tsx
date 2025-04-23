
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Dumbbell, Clock, CalendarIcon, Flame } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const workoutTypes = [
  "Strength Training",
  "Cardio",
  "HIIT",
  "Yoga",
  "Pilates",
  "CrossFit",
  "Running",
  "Cycling",
  "Swimming",
  "Bodyweight",
  "Stretching",
  "Other"
];

interface WorkoutFormProps {
  userId: string;
  onSuccess?: () => void;
}

const WorkoutForm = ({ userId, onSuccess }: WorkoutFormProps) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !type || !duration || !caloriesBurned || !date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('workouts').insert({
        user_id: userId,
        title,
        type,
        duration: parseInt(duration),
        calories_burned: parseInt(caloriesBurned),
        date: format(date, 'yyyy-MM-dd')
      });

      if (error) throw error;
      
      toast({
        title: "Workout Logged",
        description: "Your workout has been successfully recorded.",
      });
      
      // Reset form
      setTitle('');
      setType('');
      setDuration('');
      setCaloriesBurned('');
      setDate(new Date());
      
      // Call onSuccess if provided
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log workout",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Dumbbell className="mr-2 h-5 w-5 text-purple-600" />
          Log Your Workout
        </CardTitle>
        <CardDescription>Record your fitness activity</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Workout Title</label>
            <Input
              id="title"
              placeholder="Chest Day, Morning Run, etc."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium">Workout Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select workout type" />
              </SelectTrigger>
              <SelectContent>
                {workoutTypes.map((workoutType) => (
                  <SelectItem key={workoutType} value={workoutType}>{workoutType}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  className="pl-10"
                  placeholder="Duration in minutes"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="calories" className="text-sm font-medium">Calories Burned</label>
              <div className="relative">
                <Flame className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="calories"
                  type="number"
                  min="0"
                  className="pl-10"
                  placeholder="Estimated calories"
                  value={caloriesBurned}
                  onChange={(e) => setCaloriesBurned(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging..." : "Log Workout"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkoutForm;
