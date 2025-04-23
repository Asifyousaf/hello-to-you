
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    workoutPlan?: any;
    mealPlan?: any;
    additionalData?: any[];
    dataSource?: 'exercise' | 'recipe' | null;
  };
  onAddWorkout: (workoutPlan: any) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onAddWorkout }) => {
  const renderExerciseData = (data: any[]) => {
    if (!data || data.length === 0) return null;
    
    return (
      <div className="mt-3 bg-purple-50 p-3 rounded-md">
        <h4 className="text-xs font-semibold text-purple-800 mb-2">Suggested Exercises:</h4>
        <div className="space-y-2 max-h-60 overflow-auto">
          {data.slice(0, 3).map((exercise, idx) => (
            <div key={idx} className="bg-white p-2 rounded shadow-sm">
              <div className="flex space-x-2">
                {exercise.gifUrl && (
                  <div className="w-16 h-16 flex-shrink-0">
                    <img 
                      src={exercise.gifUrl} 
                      alt={exercise.name}
                      className="w-full h-full object-cover rounded" 
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-xs font-medium">{exercise.name}</p>
                  <p className="text-xs text-gray-500">Target: {exercise.target}</p>
                  <p className="text-xs text-gray-500">Equipment: {exercise.equipment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRecipeData = (data: any[]) => {
    if (!data || data.length === 0) return null;
    
    return (
      <div className="mt-3 bg-green-50 p-3 rounded-md">
        <h4 className="text-xs font-semibold text-green-800 mb-2">Recommended Recipes:</h4>
        <div className="space-y-2 max-h-60 overflow-auto">
          {data.slice(0, 3).map((recipe, idx) => (
            <div key={idx} className="bg-white p-2 rounded shadow-sm">
              <div className="flex space-x-2">
                {recipe.image && (
                  <div className="w-16 h-16 flex-shrink-0">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="w-full h-full object-cover rounded" 
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-xs font-medium">{recipe.title}</p>
                  {recipe.nutrition && (
                    <p className="text-xs text-gray-500">Calories: {recipe.nutrition.calories}</p>
                  )}
                  {recipe.diets && recipe.diets.length > 0 && (
                    <p className="text-xs text-gray-500">Diet: {recipe.diets.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          message.sender === 'user' 
            ? 'bg-purple-600 text-white rounded-br-none' 
            : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        
        {/* Workout Plan Recommendation */}
        {message.workoutPlan && (
          <div className="mt-2 p-3 bg-purple-50 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-purple-700">{message.workoutPlan.title}</p>
                <p className="text-xs text-purple-600 mt-1">{message.workoutPlan.description}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 rounded-full p-0 text-purple-700"
                onClick={() => onAddWorkout(message.workoutPlan)}
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 text-xs w-full bg-white"
              onClick={() => onAddWorkout(message.workoutPlan)}
            >
              Add to My Workouts
            </Button>
          </div>
        )}
        
        {/* Meal Plan Recommendation */}
        {message.mealPlan && (
          <div className="mt-2 p-3 bg-green-50 rounded-md">
            <p className="text-xs font-medium text-green-700">{message.mealPlan.title}</p>
            <p className="text-xs text-green-600 mt-1">{message.mealPlan.description}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-green-100 text-green-800 py-0.5 px-2 rounded-full">
                {message.mealPlan.diet}
              </span>
              <span className="text-xs bg-green-100 text-green-800 py-0.5 px-2 rounded-full">
                {message.mealPlan.calories} calories
              </span>
            </div>
          </div>
        )}
        
        {/* Display Exercise Data */}
        {message.dataSource === 'exercise' && renderExerciseData(message.additionalData)}
        
        {/* Display Recipe Data */}
        {message.dataSource === 'recipe' && renderRecipeData(message.additionalData)}
        
        <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-purple-200' : 'text-gray-400'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
