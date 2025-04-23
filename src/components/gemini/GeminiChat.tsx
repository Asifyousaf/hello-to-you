import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Loader2, X, Volume2, VolumeX, Info, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import useSounds from '@/hooks/useSounds';
import { SoundType } from '@/types/sound';
import GeminiMessageList from './GeminiMessageList';
import GeminiChatInput from './GeminiChatInput';
import GeminiSuggestions from './GeminiSuggestions';

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

// Key for storing chat history in sessionStorage
const CHAT_HISTORY_KEY = 'gemini_chat_history';

const GeminiChat: React.FC<GeminiChatProps> = ({ visible = false, onClose }) => {
  const [isOpen, setIsOpen] = useState(visible);
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
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(50);
  
  const { play, isLoaded } = useSounds();

  // Load conversation from sessionStorage when component mounts
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

    // Setup storage event listener to sync across tabs
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

  // Save conversation to sessionStorage whenever it changes
  useEffect(() => {
    if (conversation.length > 1) { // Only save if conversation has user messages
      try {
        sessionStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(conversation));
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    }
  }, [conversation]);

  useEffect(() => {
    setIsOpen(visible);
  }, [visible]);
  
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    getUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      
      // Clear chat history when user logs out
      if (!session?.user) {
        resetChat();
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [conversation, isOpen]);

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

  const resetChat = () => {
    const initialMessage = {
      id: '0',
      content: "Hi there! I'm your wellness assistant. How can I help you with workouts, nutrition, or mindfulness today?",
      sender: 'ai',
      timestamp: new Date()
    };
    
    setConversation([initialMessage]);
    sessionStorage.removeItem(CHAT_HISTORY_KEY);
    
    if (isSoundEnabled) {
      play('notification', { volume: volume / 100 });
    }
    
    toast({
      title: "Chat Reset",
      description: "Your conversation has been reset.",
    });
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  const handleIncomingMessage = (query: string) => {
    if (query.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: query,
        sender: 'user',
        timestamp: new Date()
      };
      setConversation(prev => [...prev, userMessage]);
      setIsOpen(true);
      handleGeminiResponse(query);
    }
  };

  const playSoundEffect = (type: SoundType) => {
    if (isLoaded[type] && isSoundEnabled) {
      play(type, { volume: volume / 100 });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    setConversation([...conversation, userMessage]);
    setMessage('');
    
    playSoundEffect('beep');
    
    handleGeminiResponse(message);
  };

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
      
      if (isSoundEnabled) {
        play('success', { volume: volume / 100 });
      }
      
      // Check if the message contains recipe-related terms to ensure the button shows up
      const isRecipeQuery = userMessage.toLowerCase().includes('recipe') || 
                           userMessage.toLowerCase().includes('meal') || 
                           userMessage.toLowerCase().includes('food') || 
                           userMessage.toLowerCase().includes('eat') ||
                           userMessage.toLowerCase().includes('cook');
      
      // Generate recipe data if it's a recipe query
      let recipeData = data.recipeData || [];
      
      // If it's a recipe query but no recipe data was returned, create a simple recipe object
      if (isRecipeQuery && recipeData.length === 0) {
        // Extract recipe information from the AI response
        const aiResponse = data.reply || "";
        
        // Create a basic recipe from the AI response
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
          servings: 2
        }];
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply,
        sender: 'ai',
        timestamp: new Date(),
        workoutData: data.workoutData || [],
        recipeData: recipeData,
        dataType: data.dataType || (isRecipeQuery ? 'recipe' : null)
      };
      
      setConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error fetching Gemini response:', error);
      
      if (isSoundEnabled) {
        play('failure', { volume: volume / 100 });
      }
      
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
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

  const handleAddWorkout = async (workout: any) => {
    try {
      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to save workout plans",
          variant: "default",
        });
        return;
      }

      console.log("Saving workout to Supabase:", workout);

      let workoutData: any = {
        user_id: user.id,
        title: workout.title || "Custom Workout",
        type: workout.type || "General",
        duration: workout.duration || 30,
        calories_burned: workout.calories_burned || 300,
        date: new Date().toISOString().split('T')[0]
      };

      // Handle workout pack
      if (workout.isWorkoutPack && workout.originalWorkouts) {
        workoutData.exercises = JSON.stringify(workout.exercises || []);
        workoutData.is_pack = true;
        workoutData.pack_items = JSON.stringify(workout.originalWorkouts);
      } else {
        // Regular workout
        workoutData.exercises = typeof workout.exercises === 'string' 
          ? workout.exercises 
          : JSON.stringify(workout.exercises || []);
      }

      const { data, error } = await supabase
        .from('workouts')
        .insert(workoutData);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      playSoundEffect('success');
      
      toast({
        title: workout.isWorkoutPack ? "Workout Pack Added" : "Workout Added",
        description: `The workout ${workout.isWorkoutPack ? 'pack' : ''} has been added to your workout plan`,
      });
      
      navigate('/workouts');
    } catch (error) {
      console.error('Error saving workout:', error);
      playSoundEffect('failure');
      
      toast({
        title: "Error",
        description: "Failed to add workout. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveRecipe = async (recipe: any) => {
    try {
      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to save recipes",
          variant: "default",
        });
        return;
      }

      console.log("Saving recipe to nutrition_logs:", recipe);

      // Prepare recipe data for saving to nutrition_logs
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
      };

      console.log("Formatted recipe data:", recipeData);

      const { error } = await supabase
        .from('nutrition_logs')
        .insert(recipeData);
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      playSoundEffect('success');
      
      toast({
        title: "Recipe Saved",
        description: "The recipe has been saved to your nutrition collection",
      });
      
      navigate('/nutrition');
    } catch (error) {
      console.error('Error saving recipe:', error);
      playSoundEffect('failure');
      
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setMessage(suggestion);
  };

  React.useEffect(() => {
    if (window) {
      (window as any).geminiChatRef = {
        handleIncomingMessage
      };
    }
    return () => {
      if (window) {
        delete (window as any).geminiChatRef;
      }
    };
  }, [conversation]);

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
            <div className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-t-xl">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2 bg-white">
                  <AvatarImage src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_256px.webp" />
                  <AvatarFallback className="bg-purple-200 text-purple-800">AI</AvatarFallback>
                </Avatar>
                <div className="flex items-center">
                  <h3 className="font-semibold text-lg">Gemini Wellness</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="ml-2 text-white hover:bg-purple-700">
                        <Info className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">How can I help you?</h4>
                        <p className="text-sm text-gray-500">Ask me about:</p>
                        <ul className="text-sm text-gray-500 list-disc list-inside">
                          <li>Personalized workout plans</li>
                          <li>Nutrition advice and recipes</li>
                          <li>Fitness equipment recommendations</li>
                          <li>Exercise modifications</li>
                          <li>Wellness tips</li>
                        </ul>
                        <p className="text-sm mt-2 font-medium">Try these prompts:</p>
                        <ul className="text-sm text-gray-500 list-disc list-inside">
                          <li>Create a HIIT workout for my legs</li>
                          <li>Give me a high-protein breakfast recipe</li>
                          <li>What should I eat after a workout?</li>
                        </ul>
                        <div className="pt-2 border-t mt-2">
                          <p className="text-xs text-gray-500">Powered by Google Gemini AI with ExerciseDB and Spoonacular APIs</p>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex items-center">
                <Button
                  variant="ghost" 
                  size="icon"
                  onClick={() => { 
                    setConversation([{
                      id: '0',
                      content: "Hi there! I'm your wellness assistant. How can I help you with workouts, nutrition, or mindfulness today?",
                      sender: 'ai',
                      timestamp: new Date()
                    }]);
                    sessionStorage.removeItem(CHAT_HISTORY_KEY);
                    if (isSoundEnabled) play('notification', { volume: volume / 100 });
                    toast({
                      title: "Chat Reset",
                      description: "Your conversation has been reset."
                    });
                  }}
                  className="text-white hover:bg-purple-700 mr-1"
                  title="Reset conversation"
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost" 
                  size="icon"
                  onClick={toggleSound}
                  className="text-white hover:bg-purple-700 mr-1"
                  title={isSoundEnabled ? "Mute sounds" : "Enable sounds"}
                >
                  {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleChat} 
                  className="text-white hover:bg-purple-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
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
                      onValueChange={(newVolume) => setVolume(newVolume[0])}
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
                  onAddWorkout={(workout) => {
                    if (!user) {
                      toast({
                        title: "Sign in required",
                        description: "Please sign in to save workout plans",
                        variant: "default",
                      });
                      return;
                    }
                  
                    try {
                      console.log("Saving workout to Supabase:", workout);
                  
                      let workoutData: any = {
                        user_id: user.id,
                        title: workout.title || "Custom Workout",
                        type: workout.type || "General",
                        duration: workout.duration || 30,
                        calories_burned: workout.calories_burned || 300,
                        date: new Date().toISOString().split('T')[0]
                      };
                  
                      // Handle workout pack
                      if (workout.isWorkoutPack && workout.originalWorkouts) {
                        workoutData.exercises = JSON.stringify(workout.exercises || []);
                        workoutData.is_pack = true;
                        workoutData.pack_items = JSON.stringify(workout.originalWorkouts);
                      } else {
                        // Regular workout
                        workoutData.exercises = typeof workout.exercises === 'string' 
                          ? workout.exercises 
                          : JSON.stringify(workout.exercises || []);
                      }
                  
                      supabase.from('workouts').insert(workoutData)
                        .then(({ error }) => {
                          if (error) {
                            console.error("Supabase error:", error);
                            throw error;
                          }
                          
                          if (isSoundEnabled) play('success', { volume: volume / 100 });
                          
                          toast({
                            title: workout.isWorkoutPack ? "Workout Pack Added" : "Workout Added",
                            description: `The workout ${workout.isWorkoutPack ? 'pack' : ''} has been added to your workout plan`,
                          });
                          
                          navigate('/workouts');
                        })
                        .catch((error) => {
                          console.error('Error saving workout:', error);
                          if (isSoundEnabled) play('failure', { volume: volume / 100 });
                          
                          toast({
                            title: "Error",
                            description: "Failed to add workout. Please try again.",
                            variant: "destructive"
                          });
                        });
                    } catch (error) {
                      console.error('Error saving workout:', error);
                      if (isSoundEnabled) play('failure', { volume: volume / 100 });
                      
                      toast({
                        title: "Error",
                        description: "Failed to add workout. Please try again.",
                        variant: "destructive"
                      });
                    }
                  }}
                  onSaveRecipe={(recipe) => {
                    if (!user) {
                      toast({
                        title: "Sign in required",
                        description: "Please sign in to save recipes",
                        variant: "default",
                      });
                      return;
                    }
                  
                    try {
                      console.log("Saving recipe to nutrition_logs:", recipe);
                  
                      // Prepare recipe data for saving to nutrition_logs
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
                      };
                  
                      console.log("Formatted recipe data:", recipeData);
                  
                      supabase.from('nutrition_logs').insert(recipeData)
                        .then(({ error }) => {
                          if (error) {
                            console.error("Supabase error:", error);
                            throw error;
                          }
                          
                          if (isSoundEnabled) play('success', { volume: volume / 100 });
                          
                          toast({
                            title: "Recipe Saved",
                            description: "The recipe has been saved to your nutrition collection",
                          });
                          
                          navigate('/nutrition');
                        })
                        .catch((error) => {
                          console.error('Error saving recipe:', error);
                          if (isSoundEnabled) play('failure', { volume: volume / 100 });
                          
                          toast({
                            title: "Error",
                            description: "Failed to save recipe. Please try again.",
                            variant: "destructive"
                          });
                        });
                    } catch (error) {
                      console.error('Error saving recipe:', error);
                      if (isSoundEnabled) play('failure', { volume: volume / 100 });
                      
                      toast({
                        title: "Error",
                        description: "Failed to save recipe. Please try again.",
                        variant: "destructive"
                      });
                    }
                  }} 
                />
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 rounded-lg rounded-bl-none max-w-[80%] px-4 py-2 shadow-sm">
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin text-purple-600 mr-2" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {conversation.length < 3 && (
              <GeminiSuggestions onSelectSuggestion={(suggestion) => setMessage(suggestion)} />
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
