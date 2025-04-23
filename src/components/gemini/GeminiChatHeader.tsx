
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Info, RefreshCcw, Volume2, VolumeX, X } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import useSounds from '@/hooks/useSounds';

interface GeminiChatHeaderProps {
  onClose: () => void;
  onReset: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  volume: number;
}

const GeminiChatHeader: React.FC<GeminiChatHeaderProps> = ({
  onClose,
  onReset,
  isSoundEnabled,
  onToggleSound,
  volume
}) => {
  const { toast } = useToast();
  const { play, isLoaded } = useSounds();

  const handleReset = () => {
    onReset();
    if (isSoundEnabled) {
      play('notification', { volume: volume / 100 });
    }
    toast({
      title: "Chat Reset",
      description: "Your conversation has been reset."
    });
  };

  return (
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
          onClick={handleReset}
          className="text-white hover:bg-purple-700 mr-1"
          title="Reset conversation"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost" 
          size="icon"
          onClick={onToggleSound}
          className="text-white hover:bg-purple-700 mr-1"
          title={isSoundEnabled ? "Mute sounds" : "Enable sounds"}
        >
          {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="text-white hover:bg-purple-700"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default GeminiChatHeader;
