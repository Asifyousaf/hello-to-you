
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChatSuggestionsProps {
  onSelectSuggestion: (suggestion: string) => void;
}

const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({ onSelectSuggestion }) => {
  return (
    <div className="px-4 py-3 border-t border-gray-100 bg-white">
      <Tabs defaultValue="fitness" className="w-full">
        <TabsList className="w-full mb-2">
          <TabsTrigger value="fitness" className="text-xs flex-1">Fitness</TabsTrigger>
          <TabsTrigger value="nutrition" className="text-xs flex-1">Nutrition</TabsTrigger>
          <TabsTrigger value="wellness" className="text-xs flex-1">Wellness</TabsTrigger>
        </TabsList>
        
        <TabsContent value="fitness" className="mt-0">
          <div className="flex flex-wrap gap-2">
            {[
              "I want to get in shape, where should I start?",
              "Can you suggest exercises for back pain?",
              "I need a beginner workout routine",
              "What's a good home workout without equipment?",
              "Help me build muscle in my arms"
            ].map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs py-1 px-2 h-auto border-purple-200 text-purple-700 hover:bg-purple-50"
                onClick={() => onSelectSuggestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="nutrition" className="mt-0">
          <div className="flex flex-wrap gap-2">
            {[
              "I need a high protein meal idea",
              "What's a good vegan breakfast?",
              "Suggest a 500 calorie lunch",
              "What should I eat before a workout?",
              "Help me meal prep for the week"
            ].map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs py-1 px-2 h-auto border-green-200 text-green-700 hover:bg-green-50"
                onClick={() => onSelectSuggestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="wellness" className="mt-0">
          <div className="flex flex-wrap gap-2">
            {[
              "How can I improve my sleep?",
              "Give me a simple meditation technique",
              "I need help with workout motivation",
              "What fitness tracker do you recommend?",
              "How to reduce stress after work?"
            ].map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs py-1 px-2 h-auto border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => onSelectSuggestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatSuggestions;
