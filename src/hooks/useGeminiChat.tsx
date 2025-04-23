
import { useState, useEffect } from 'react';
import { Message } from '@/components/gemini/GeminiChat';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import useSounds from '@/hooks/useSounds';

const CHAT_HISTORY_KEY = 'gemini_chat_history';

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
      
      const isRecipeQuery = userMessage.toLowerCase().includes('recipe') || 
                           userMessage.toLowerCase().includes('meal') || 
                           userMessage.toLowerCase().includes('food') || 
                           userMessage.toLowerCase().includes('eat') ||
                           userMessage.toLowerCase().includes('cook');
      
      let recipeData = data.recipeData || [];
      
      if (isRecipeQuery && recipeData.length === 0) {
        const aiResponse = data.reply || "";
        
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
      
      if (isSoundEnabled && isLoaded.failure) {
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
