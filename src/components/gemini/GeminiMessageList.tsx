
import React from 'react';
import { Message } from './GeminiChat';
import GeminiMessageItem from './GeminiMessageItem';
import WorkoutPreview from './WorkoutPreview';
import RecipePreview from '../gemini/RecipePreview';
import RecipePackPreview from './RecipePackPreview';

interface GeminiMessageListProps {
  messages: Message[];
  isLoading: boolean;
  onAddWorkout?: (workout: any) => void;
  onSaveRecipe?: (recipe: any) => void;
}

const GeminiMessageList: React.FC<GeminiMessageListProps> = ({ 
  messages, 
  isLoading, 
  onAddWorkout,
  onSaveRecipe 
}) => {
  const handleAddWorkoutPack = (workouts: any[]) => {
    if (!onAddWorkout || !workouts.length) return;

    const formattedWorkouts = workouts.map(workout => ({
      title: workout.title || workout.name || "Untitled Exercise",
      type: workout.type || "CUSTOM",
      sets: workout.sets || 3,
      reps: workout.reps || 12,
      duration: workout.duration || 60,
      restTime: workout.restTime || 30,
      calories_burned: workout.calories_burned || 300,
      instructions: Array.isArray(workout.instructions) ? workout.instructions : 
        ["Perform the exercise with proper form", "Maintain controlled movements", "Focus on your breathing"],
      name: workout.name || workout.title || "Exercise"
    }));

    const workoutPack = {
      title: `AI Generated Pack (${workouts.length} workouts)`,
      type: "AI_PACK",
      description: "Custom workout pack created by AI assistant",
      level: "custom",
      duration: formattedWorkouts.reduce((total, w) => total + (w.duration || 30), 0),
      calories_burned: formattedWorkouts.reduce((total, w) => total + (w.calories_burned || 300), 0),
      caloriesBurn: formattedWorkouts.reduce((total, w) => total + (w.calories_burned || 300), 0),
      exercises: {
        isWorkoutPack: true,
        originalWorkouts: workouts,
        list: formattedWorkouts
      }
    };

    onAddWorkout(workoutPack);
  };

  const handleAddRecipePack = (recipes: any[]) => {
    if (!onSaveRecipe || !recipes.length) return;
    
    // Format the first recipe for saving
    const recipe = recipes[0];
    const formattedRecipe = {
      title: recipe.title || "AI Generated Recipe",
      calories: recipe.nutrition?.calories || recipe.calories || 300,
      protein: recipe.nutrition?.protein || recipe.protein || 25,
      carbs: recipe.nutrition?.carbs || recipe.carbs || 40,
      fat: recipe.nutrition?.fat || recipe.fat || 15,
      image: recipe.image || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      servings: recipe.servings || 2,
      summary: recipe.summary || "AI-generated recipe",
      ingredients: recipe.extendedIngredients?.map((ing: any) => ing.original) || recipe.ingredients || [],
      instructions: recipe.analyzedInstructions?.[0]?.steps?.map((step: any) => step.step) || recipe.instructions || [],
      tags: recipe.diets || recipe.tags || ["AI Generated"]
    };
    
    onSaveRecipe(formattedRecipe);
  };

  // Function to determine if message is primarily about recipes/nutrition
  const isNutritionFocused = (message: Message) => {
    if (message.dataType === 'recipe') return true;
    if (message.recipeData && message.recipeData.length > 0) return true;
    
    const nutritionKeywords = [
      'recipe', 'food', 'meal', 'eat', 'nutrition', 'diet', 'calories',
      'protein', 'carbs', 'fat', 'breakfast', 'lunch', 'dinner', 'snack', 'cook'
    ];
    
    const content = message.content.toLowerCase();
    
    // If message is asking about pre/post workout meals, it's nutrition focused
    if ((content.includes('eat') || content.includes('food') || content.includes('meal')) && 
        (content.includes('before workout') || content.includes('after workout') || 
        content.includes('pre workout') || content.includes('post workout'))) {
      return true;
    }
    
    return nutritionKeywords.some(keyword => content.includes(keyword));
  };
  
  // Function to determine if message is primarily about workouts/exercises
  const isWorkoutFocused = (message: Message) => {
    if (message.dataType === 'exercise') return true;
    if (message.workoutData && message.workoutData.length > 0) return true;
    
    const workoutKeywords = [
      'workout', 'exercise', 'training', 'gym', 'fitness', 'strength',
      'cardio', 'sets', 'reps', 'routine'
    ];
    
    const content = message.content.toLowerCase();
    
    // Make sure messages about eating before workouts are not classified as workout focused
    if ((content.includes('eat') || content.includes('food') || content.includes('meal')) && 
        (content.includes('before workout') || content.includes('after workout') || 
        content.includes('pre workout') || content.includes('post workout'))) {
      return false;
    }
    
    return workoutKeywords.some(keyword => content.includes(keyword));
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id}>
          <GeminiMessageItem message={message} />

          {/* Show workout preview only if it has workout data AND is workout focused */}
          {message.workoutData && Array.isArray(message.workoutData) && message.workoutData.length > 0 && 
           isWorkoutFocused(message) && (
            <div className="mt-2">
              <WorkoutPreview 
                workoutData={message.workoutData} 
                onAddWorkout={onAddWorkout}
                onAddWorkoutPack={message.workoutData.length > 1 ? handleAddWorkoutPack : undefined}
              />
            </div>
          )}

          {/* Show recipe preview if it has recipe data */}
          {message.recipeData && Array.isArray(message.recipeData) && message.recipeData.length > 0 && (
            <div className="mt-2">
              <RecipePreview
                recipeData={message.recipeData}
                onSaveRecipe={onSaveRecipe}
              />
            </div>
          )}
          
          {/* Always show recipe button for AI messages that mention food/recipes but don't have recipe data */}
          {!message.recipeData && 
           message.sender === 'ai' && 
           isNutritionFocused(message) && (
            <div className="mt-2">
              <RecipePackPreview
                recipes={[{
                  title: "AI Generated Recipe",
                  summary: message.content,
                  calories: 300,
                  protein: 25,
                  carbs: 40,
                  fat: 15,
                  servings: 2,
                  ingredients: [],
                  instructions: [],
                  tags: ["AI Generated"]
                }]}
                onAddRecipe={() => onSaveRecipe?.({
                  title: "AI Generated Recipe",
                  calories: 300,
                  protein: 25,
                  carbs: 40,
                  fat: 15,
                  servings: 2,
                  summary: message.content,
                  ingredients: [],
                  instructions: [],
                  tags: ["AI Generated"]
                })}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GeminiMessageList;
