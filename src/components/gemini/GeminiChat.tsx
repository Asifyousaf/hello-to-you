
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import useSounds from '@/hooks/useSounds';
import GeminiMessageList from './GeminiMessageList';
import GeminiChatInput from './GeminiChatInput';
import GeminiSuggestions from './GeminiSuggestions';
import GeminiChatHeader from './GeminiChatHeader';
import { useGeminiChat } from '@/hooks/useGeminiChat';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  workoutData?: any[];
  recipeData?: any[];
  dataType?: 'exercise' | 'recipe' | null;
}

interface GeminiChatProps {
  visible?: boolean;
  onClose?: () => void;
}

const GeminiChat: React.FC<GeminiChatProps> = ({ visible = false, onClose }) => {
  const [isOpen, setIsOpen] = useState(visible);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(50);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { play, isLoaded } = useSounds();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    message,
    setMessage,
    isLoading,
    conversation,
    sendMessage,
    resetChat
  } = useGeminiChat(isSoundEnabled, volume);

  useEffect(() => {
    setIsOpen(visible);
  }, [visible]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [conversation, isOpen]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    getUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session?.user) {
        resetChat();
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    if (newIsOpen && isLoaded.notification && isSoundEnabled) {
      play('notification', { volume: volume / 100 });
    }
    
    if (!newIsOpen && onClose) {
      onClose();
    }
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setMessage(suggestion);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(message);
  };

  const handleSaveRecipe = async (recipe: any) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save recipes",
        variant: "default",
      });
      return;
    }
  
    try {
      const recipeData = {
        user_id: user.id,
        food_name: recipe.title || "AI Generated Recipe",
        calories: recipe.nutrition?.calories || recipe.calories || 300,
        protein: recipe.nutrition?.protein || recipe.protein || 25,
        carbs: recipe.nutrition?.carbs || recipe.carbs || 40,
        fat: recipe.nutrition?.fat || recipe.fat || 15,
        meal_type: "recipe",
        date: new Date().toISOString().split('T')[0],
        recipe_details: JSON.stringify({
          image: recipe.image || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          time: recipe.readyInMinutes ? `${recipe.readyInMinutes} min` : "20 min",
          servings: recipe.servings || 2,
          description: recipe.summary || "AI-generated recipe",
          ingredients: recipe.extendedIngredients?.map((ing: any) => ing.original) || 
                      recipe.ingredients || [],
          instructions: recipe.analyzedInstructions?.[0]?.steps?.map((step: any) => step.step) || 
                      recipe.instructions || [],
          tags: recipe.diets || recipe.tags || ["AI Generated"],
          category: "ai"
        })
      });
  
      const { error } = await supabase
        .from('nutrition_logs')
        .insert(recipeData);
      
      if (error) throw error;
      
      if (isSoundEnabled) play('success', { volume: volume / 100 });
      
      toast({
        title: "Recipe Saved",
        description: "The recipe has been saved to your nutrition collection",
      });
      
      navigate('/nutrition');
    } catch (error) {
      console.error('Error saving recipe:', error);
      if (isSoundEnabled) play('failure', { volume: volume / 100 });
      
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddWorkout = async (workout: any) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save workout plans",
        variant: "default",
      });
      return;
    }

    try {
      let workoutData: any = {
        user_id: user.id,
        title: workout.title || "Custom Workout",
        type: workout.type || "General",
        duration: workout.duration || 30,
        calories_burned: workout.calories_burned || 300,
        date: new Date().toISOString().split('T')[0]
      };

      if (workout.isWorkoutPack && workout.originalWorkouts) {
        workoutData.exercises = JSON.stringify(workout.exercises || []);
        workoutData.is_pack = true;
        workoutData.pack_items = JSON.stringify(workout.originalWorkouts);
      } else {
        workoutData.exercises = typeof workout.exercises === 'string' 
          ? workout.exercises 
          : JSON.stringify(workout.exercises || []);
      }

      const { error } = await supabase
        .from('workouts')
        .insert(workoutData);

      if (error) throw error;
      
      if (isSoundEnabled) play('success', { volume: volume / 100 });
      
      toast({
        title: workout.isWorkoutPack ? "Workout Pack Added" : "Workout Added",
        description: `The workout ${workout.isWorkoutPack ? 'pack' : ''} has been added to your workout plan`,
      });
      
      navigate('/workouts');
    } catch (error) {
      console.error('Error saving workout:', error);
      if (isSoundEnabled) play('failure', { volume: volume / 100 });
      
      toast({
        title: "Error",
        description: "Failed to add workout. Please try again.",
        variant: "destructive"
      });
    }
  };

  React.useEffect(() => {
    if (window) {
      (window as any).geminiChatRef = {
        handleIncomingMessage: sendMessage
      };
    }
    return () => {
      if (window) {
        delete (window as any).geminiChatRef;
      }
    };
  }, []);

  return (
    <>
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-full p-3 shadow-lg hover:bg-purple-700 transition-all hover:shadow-xl z-50"
        aria-label="Open chat support"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 bg-white rounded-xl shadow-2xl w-[90vw] sm:w-[400px] max-h-[600px] flex flex-col z-50 overflow-hidden"
          >
            <GeminiChatHeader 
              onClose={toggleChat}
              onReset={resetChat}
              isSoundEnabled={isSoundEnabled}
              onToggleSound={toggleSound}
              volume={volume}
            />
            
            <AnimatePresence>
              {isSoundEnabled && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-50 border-b overflow-hidden"
                >
                  <div className="p-3 flex items-center">
                    <Slider
                      value={[volume]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-500 ml-2 w-8">{volume}%</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                <GeminiMessageList 
                  messages={conversation} 
                  isLoading={isLoading}
                  onAddWorkout={handleAddWorkout}
                  onSaveRecipe={handleSaveRecipe}
                />
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {conversation.length < 3 && (
              <GeminiSuggestions onSelectSuggestion={handleSelectSuggestion} />
            )}
            
            <GeminiChatInput 
              message={message}
              setMessage={setMessage}
              onSubmit={handleSendMessage}
              isLoading={isLoading}
              userSignedIn={!!user}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GeminiChat;
