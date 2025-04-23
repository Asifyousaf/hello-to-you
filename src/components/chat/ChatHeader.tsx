
import React from 'react';
import { Button } from "@/components/ui/button";
import { Info, Volume2, VolumeX, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface ChatHeaderProps {
  toggleChat: () => void;
  isSoundEnabled: boolean;
  toggleSound: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ toggleChat, isSoundEnabled, toggleSound }) => {
  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-t-xl">
      <div className="flex items-center">
        <Avatar className="h-8 w-8 mr-2 bg-white">
          <AvatarImage src="https://img.freepik.com/free-vector/cute-robot-cartoon-character_138676-2745.jpg?size=338&ext=jpg&uid=R106622016&ga=GA1.1.678848138.1713037223" />
          <AvatarFallback className="bg-purple-200 text-purple-800">AI</AvatarFallback>
        </Avatar>
        <div className="flex items-center">
          <h3 className="font-medium">WellnessAI Assistant</h3>
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
                <div className="pt-2 border-t mt-2">
                  <p className="text-xs text-gray-500">Powered by OpenAI GPT-4, ExerciseDB, and Spoonacular APIs</p>
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
  );
};

export default ChatHeader;
