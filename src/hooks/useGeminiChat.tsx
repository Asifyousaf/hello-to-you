import { useState, useEffect } from 'react';
import { Message } from '@/components/gemini/GeminiChat';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import useSounds from '@/hooks/useSounds';

const CHAT_HISTORY_KEY = 'gemini_chat_history';

// Function to extract recipe data from text content
const extractRecipeDataFromText = (content: string): any[] | null => {
  // Check if this appears to be a recipe
  const isRecipe = 
    content.toLowerCase().includes('recipe') || 
    content.toLowerCase().includes('ingredients') ||
    (content.toLowerCase().includes('instructions') && content.toLowerCase().includes('minutes'));
    
  if (!isRecipe) return null;
  
  try {
    // Try to extract ingredients
    let ingredients: string[] = [];
    if (content.toLowerCase().includes('ingredients:')) {
      const ingredientsSection = content.split(/ingredients:|ingredients/i)[1]?.split(/instructions:|directions:|steps:|method:|preparation:|preparation|nutritional information:/i)[0];
      if (ingredientsSection) {
        ingredients = ingredientsSection
          .split('\n')
          .map(line => line.trim())
          .filter(line => line && line.length > 3)
          .map(line => line.replace(/^[-•*]\s*/, ''));
      }
    }
    
    // Try to extract instructions
    let instructions: string[] = [];
    if (content.toLowerCase().includes('instructions:') || content.toLowerCase().includes('directions:') || content.toLowerCase().includes('preparation:')) {
      const instructionsSection = content
        .split(/instructions:|directions:|preparation:/i)[1]
        ?.split(/nutrition information:|nutritional info:|notes:|nutrition:|enjoy!/i)[0];
      if (instructionsSection) {
        instructions = instructionsSection
          .split('\n')
          .map(line => line.trim())
          .filter(line => line && line.length > 5)
          .map(line => line.replace(/^\d+\.\s*/, ''));
      }
    }
    
    // Extract title (first line or after Recipe for: or similar)
    let title = "AI Generated Recipe";
    if (content.includes('Recipe for:')) {
      title = content.split('Recipe for:')[1]?.split('\n')[0].trim() || title;
    } else if (content.includes('Recipe:')) {
      title = content.split('Recipe:')[1]?.split('\n')[0].trim() || title;
    } else {
      title = content.split('\n')[0]?.trim() || title;
    }
    
    // Try to extract nutritional information
    let calories = 300;
    let protein = 25;
    let carbs = 40;
    let fat = 15;
    
    const caloriesMatch = content.match(/calories:?\s*(\d+)/i);
    if (caloriesMatch && caloriesMatch[1]) calories = parseInt(caloriesMatch[1]);
    
    const proteinMatch = content.match(/protein:?\s*(\d+)/i);
    if (proteinMatch && proteinMatch[1]) protein = parseInt(proteinMatch[1]);
    
    const carbsMatch = content.match(/carb[s]?:?\s*(\d+)/i);
    if (carbsMatch && carbsMatch[1]) carbs = parseInt(carbsMatch[1]);
    
    const fatMatch = content.match(/fat:?\s*(\d+)/i);
    if (fatMatch && fatMatch[1]) fat = parseInt(fatMatch[1]);
    
    return [{
      title,
      summary: content,
      calories,
      protein,
      carbs,
      fat,
      ingredients,
      instructions,
      servings: 2,
      tags: ['AI Generated'],
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }];
  } catch (error) {
    console.error("Error extracting recipe data:", error);
    return null;
  }
};

export const useGeminiChat = (isSoundEnabled: boolean, volume: number) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([
    {
      id: '0',
      content: "Hi there! I'm your wellness assistant. How can I help you with workouts, nutrition, or mindfulness today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const { toast } = useToast();
  const { play, isLoaded } = useSounds();

  useEffect(() => {
    const loadConversation = () => {
      try {
        const savedConversation = sessionStorage.getItem(CHAT_HISTORY_KEY);
        if (savedConversation) {
          const parsedConversation = JSON.parse(savedConversation).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setConversation(parsedConversation);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };

    loadConversation();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === CHAT_HISTORY_KEY && event.newValue) {
        try {
          const parsedConversation = JSON.parse(event.newValue).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setConversation(parsedConversation);
        } catch (error) {
          console.error('Error parsing chat history from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (conversation.length > 1) {
      try {
        sessionStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(conversation));
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    }
  }, [conversation]);

  const handleGeminiResponse = async (userMessage: string) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('gemini-wellness-chatbot', {
        body: { 
          message: userMessage,
          history: conversation.slice(-5).map(msg => ({ role: msg.sender === 'user' ? 'user' : 'model', parts: msg.content }))
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (isSoundEnabled && isLoaded.success) {
        play('success', { volume: volume / 100 });
      }
      
      // Determine if this is likely a nutrition/recipe query
      const isNutritionQuery = userMessage.toLowerCase().includes('recipe') || 
                           userMessage.toLowerCase().includes('meal') || 
                           userMessage.toLowerCase().includes('food') || 
                           userMessage.toLowerCase().includes('eat') ||
                           userMessage.toLowerCase().includes('cook') ||
                           userMessage.toLowerCase().includes('diet') ||
                           userMessage.toLowerCase().includes('nutrition');
      
      // Workout-related keywords
      const workoutKeywords = ['workout', 'exercise', 'training', 'gym', 'fitness', 'strength',
        'cardio', 'sets', 'reps', 'routine'];
      
      // Check if this is specifically about eating related to workouts
      const isPrePostWorkoutMealQuery = userMessage.toLowerCase().match(/(?:what|how|when).+(?:eat|food|meal).+(?:before|after|pre|post).+workout/i) ||
                                       userMessage.toLowerCase().match(/(?:before|after|pre|post).+workout.+(?:eat|food|meal)/i);
                                       
      // Get recipe data from API or extract from AI response
      let recipeData = data.recipeData || [];
      let dataType = data.dataType;
      
      // If this is a nutrition query but we didn't get structured recipe data,
      // try to extract it from the AI response text
      if (isNutritionQuery && (!recipeData || recipeData.length === 0)) {
        const aiResponse = data.reply || "";
        
        // Try to extract structured recipe data from the text
        const extractedRecipeData = extractRecipeDataFromText(aiResponse);
        
        if (extractedRecipeData && extractedRecipeData.length > 0) {
          recipeData = extractedRecipeData;
          dataType = 'recipe';
        } else if (isNutritionQuery) {
          // Fallback to a simple recipe template if we couldn't extract data
          recipeData = [{
            title: aiResponse.split('\n')[0] || "AI Generated Recipe",
            summary: aiResponse,
            calories: 300,
            protein: 25,
            carbs: 40, 
            fat: 15,
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            diets: ["Balanced"],
            readyInMinutes: 30,
            servings: 2,
            ingredients: [],
            instructions: []
          }];
          dataType = 'recipe';
        }
      }
      
      // Special handling for queries about eating around workouts
      if (isPrePostWorkoutMealQuery) {
        dataType = 'recipe';
        // Override any workout data assignment when it's clearly a meal query
        data.workoutData = [];
        
        // If we don't already have recipe data, create some
        if (!recipeData || recipeData.length === 0) {
          recipeData = [{
            title: "Pre/Post Workout Meal",
            summary: data.reply || "",
            calories: 300,
            protein: 25,
            carbs: 40,
            fat: 15,
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            diets: ["Sports Nutrition"],
            readyInMinutes: 15,
            servings: 1,
            ingredients: [],
            instructions: []
          }];
        }
      }
      
      console.log("Recipe data:", recipeData, "Data type:", dataType);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply,
        sender: 'ai',
        timestamp: new Date(),
        workoutData: data.workoutData || [],
        recipeData: recipeData,
        dataType: dataType || (isNutritionQuery ? 'recipe' : null)
      };
      
      setConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error fetching Gemini response:', error);
      
      if (isSoundEnabled && isLoaded.failure) {
        play('failure', { volume: volume / 100 });
      }
      
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting to Gemini. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = (userMessage: string) => {
    if (!userMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: userMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setConversation(prev => [...prev, newMessage]);
    setMessage('');
    
    if (isSoundEnabled && isLoaded.beep) {
      play('beep', { volume: volume / 100 });
    }
    
    handleGeminiResponse(userMessage);
  };

  const resetChat = () => {
    const initialMessage: Message = {
      id: '0',
      content: "Hi there! I'm your wellness assistant. How can I help you with workouts, nutrition, or mindfulness today?",
      sender: 'ai',
      timestamp: new Date()
    };
    
    setConversation([initialMessage]);
    sessionStorage.removeItem(CHAT_HISTORY_KEY);
  };

  return {
    message,
    setMessage,
    isLoading,
    conversation,
    sendMessage,
    resetChat
  };
};

export default useGeminiChat;
