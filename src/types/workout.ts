
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  duration: number;
  restTime: number;
  instructions: string[];
}

export interface WorkoutExercisesData {
  isWorkoutPack?: boolean;
  originalWorkouts?: WorkoutData[];
  list?: Exercise[];
  [key: string]: any;
}

export interface WorkoutData {
  id: string;
  title: string;
  type: string;
  description?: string; // Updated to be optional
  level?: string; // Updated to be optional
  duration: number;
  calories_burned: number;
  caloriesBurn?: number;
  exercises: Exercise[] | WorkoutExercisesData;
  image?: string;
  user_id?: string;
  created_at?: string;
  date?: string;
  isPack?: boolean;
  packItems?: WorkoutData[];
  name?: string;
  sets?: number;
  reps?: number;
  restTime?: number;
  instructions?: string[];
}

export interface WorkoutPlan extends Omit<WorkoutData, 'caloriesBurn'> {
  caloriesBurn: number;
}
