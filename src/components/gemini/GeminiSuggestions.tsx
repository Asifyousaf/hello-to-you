
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GeminiSuggestionsProps {
  onSelectSuggestion: (suggestion: string) => void;
}

const GeminiSuggestions: React.FC<GeminiSuggestionsProps> = ({ onSelectSuggestion }) => {
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
              "What exercises target lower back pain?",
              "Create a 20-minute home workout with no equipment",
              "How do I build muscle in my arms?",
              "What's a good cardio routine for beginners?",
              "How many times per week should I work out?"
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
              "What's a healthy high protein breakfast?",
              "Suggest a 500 calorie meal",
              "What should I eat before a workout?",
              "Give me a week of meal prep ideas",
              "What are good vegan protein sources?"
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
              "How can I improve my sleep quality?",
              "Give me a simple 5-minute meditation",
              "Tips for managing workout stress",
              "How to balance fitness and work life?",
              "What's a good morning routine for wellness?"
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

export default GeminiSuggestions;
