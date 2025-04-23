
import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Send, PlusCircle } from 'lucide-react';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  userSignedIn: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  onSubmit,
  isLoading,
  userSignedIn
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isLoading) {
        onSubmit(e);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="border-t border-gray-100 p-4 bg-white">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything about fitness & wellness..."
            className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
            disabled={isLoading}
            ref={inputRef}
            aria-label="Chat message input"
          />
          {!message && (
            <PlusCircle className="absolute right-3 top-2.5 text-gray-400 h-5 w-5" />
          )}
        </div>
        <Button 
          type="submit" 
          disabled={!message.trim() || isLoading}
          aria-label="Send message"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-full p-2 h-10 w-10"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      
      {!userSignedIn && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          <a href="/auth" className="text-purple-600 hover:underline">Sign in</a> to save your conversation history
        </p>
      )}
    </form>
  );
};

export default ChatInput;
