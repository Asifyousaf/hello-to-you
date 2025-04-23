
import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AISearchBoxProps {
  onSubmit: (query: string) => void;
}

const AISearchBox = ({ onSubmit }: AISearchBoxProps) => {
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      onSubmit(query);
      setQuery('');
      
      // Notify user that their question is being processed
      toast({
        title: "Message received",
        description: "Your wellness query is being processed...",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error submitting query:", error);
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask me anything about fitness & wellness..."
        className="w-full px-4 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
        disabled={isSubmitting}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className={`absolute right-2 top-1/2 -translate-y-1/2 ${
          isSubmitting ? 'bg-white/10' : 'bg-white/20 hover:bg-white/30'
        } text-white rounded-full p-2 transition-colors`}
      >
        <MessageSquare className="h-5 w-5" />
      </button>
    </form>
  );
};

export default AISearchBox;
