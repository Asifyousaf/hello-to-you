
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Slider } from '@/components/ui/slider';
import useSounds, { SoundType } from '@/hooks/useSounds';

// Import refactored components
import ChatHeader from './chat/ChatHeader';
import ChatMessage from './chat/ChatMessage';
import ChatInput from './chat/ChatInput';
import ChatSuggestions from './chat/ChatSuggestions';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  workoutPlan?: any;
  mealPlan?: any;
  additionalData?: any[];
  dataSource?: 'exercise' | 'recipe' | null;
}

interface AISupportChatProps {
  visible?: boolean;
  onClose?: () => void;
}

const AISupportChat: React.FC<AISupportChatProps> = ({ visible = false, onClose }) => {
  const [isOpen, setIsOpen] = useState(visible);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([
    {
      id: '0',
      content: "Hi! I'm your wellness buddy. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(50);
  
  const { play, isLoaded } = useSounds();
  const inputRef = useRef<HTMLInputElement>(null);

  // Update isOpen when visible prop changes
  useEffect(() => {
    setIsOpen(visible);
  }, [visible]);
  
  // Get user session
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      if (session?.user) {
        // Fetch user profile for personalized recommendations
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        setUserProfile(profile);
      }
    };
    
    getUser();
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input when chat opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [conversation, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    // Play notification sound when opening chat
    if (newIsOpen && isLoaded.notification && isSoundEnabled) {
      play('notification', { volume: volume / 100 });
    }
    
    // Call onClose when closing chat if provided
    if (!newIsOpen && onClose) {
      onClose();
    }
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  // Handle incoming message from search box
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
      handleAIResponse(query);
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
    
    // Play sound when sending message
    playSoundEffect('beep');
    
    handleAIResponse(message);
  };

  const handleAIResponse = async (userMessage: string) => {
    setIsLoading(true);

    try {
      // Call our Edge Function
      const { data, error } = await supabase.functions.invoke('wellness-chatbot', {
        body: { 
          message: userMessage,
          history: conversation,
          userProfile: userProfile
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Play success sound on successful response
      playSoundEffect('success');
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply,
        sender: 'ai',
        timestamp: new Date(),
        additionalData: data.additionalData || [],
        dataSource: data.dataSource || null
      };
      
      // Add workout or meal plan if provided
      if (data.parsedPlan) {
        if (data.parsedPlan.type === 'workout') {
          aiMessage.workoutPlan = {
            title: data.parsedPlan.title,
            type: data.parsedPlan.workoutType,
            description: data.parsedPlan.description,
            level: data.parsedPlan.level,
            exercises: data.parsedPlan.exercises
          };
        } else if (data.parsedPlan.type === 'meal') {
          aiMessage.mealPlan = {
            title: data.parsedPlan.title,
            diet: data.parsedPlan.diet,
            calories: data.parsedPlan.calories,
            description: data.parsedPlan.description
          };
        }
      }

      setConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      // Play error sound on failure
      playSoundEffect('failure');
      
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting to my knowledge base. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      };
      
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWorkout = async (workoutPlan: any) => {
    try {
      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to save workout plans",
          variant: "default",
        });
        return;
      }

      // Extract workout details
      const workoutData = {
        user_id: user.id,
        title: workoutPlan.title,
        type: workoutPlan.type,
        duration: 30, // Default duration
        calories_burned: 300, // Default calories
        date: new Date().toISOString().split('T')[0]
      };

      // Save to Supabase
      const { error } = await supabase.from('workouts').insert(workoutData);

      if (error) throw error;
      
      // Play success sound
      playSoundEffect('success');
      
      toast({
        title: "Workout Added",
        description: "The workout plan has been added to your routines",
      });
    } catch (error) {
      // Play error sound
      playSoundEffect('failure');
      
      toast({
        title: "Error",
        description: "Failed to add workout plan",
        variant: "destructive"
      });
      console.error('Error saving workout:', error);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setMessage(suggestion);
  };

  // Expose the handleIncomingMessage method
  React.useEffect(() => {
    if (window) {
      (window as any).aiSupportChatRef = {
        handleIncomingMessage
      };
    }
    return () => {
      if (window) {
        delete (window as any).aiSupportChatRef;
      }
    };
  }, [conversation]);

  return (
    <>
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-full p-3 shadow-lg hover:bg-purple-700 transition-all hover:shadow-xl"
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
            {/* Chat Header */}
            <ChatHeader 
              toggleChat={toggleChat} 
              isSoundEnabled={isSoundEnabled} 
              toggleSound={toggleSound} 
            />
            
            {/* Sound settings panel */}
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
            
            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {conversation.map((msg) => (
                  <ChatMessage 
                    key={msg.id} 
                    message={msg} 
                    onAddWorkout={handleAddWorkout} 
                  />
                ))}
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
            
            {/* Suggested Questions */}
            {conversation.length < 3 && (
              <ChatSuggestions onSelectSuggestion={handleSelectSuggestion} />
            )}
            
            {/* Chat Input */}
            <ChatInput 
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

export default AISupportChat;
