
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from 'lucide-react';
import { motion } from "framer-motion";

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelectAvatar: (avatar: string) => void;
}

const AVATAR_OPTIONS = [
  { id: 'avatar-1', url: 'https://img.freepik.com/premium-vector/fitness-trainer-avatar-fitness-trainer-icon-vector-illustration_564659-259.jpg' },
  { id: 'avatar-2', url: 'https://img.freepik.com/premium-vector/cute-girl-doing-exercise-cartoon-vector-icon-illustration-people-sport-icon-concept-isolated_138676-5252.jpg' },
  { id: 'avatar-3', url: 'https://img.freepik.com/premium-vector/fitness-trainer-with-whistle-cartoon-character_180264-656.jpg' },
  { id: 'avatar-4', url: 'https://img.freepik.com/premium-vector/fitness-trainer-muscular-cartoon-character-vector-illustration_593228-175.jpg' },
  { id: 'avatar-5', url: 'https://img.freepik.com/free-vector/happy-fitness-coach-guy-portrait-fitness-trainer-coach-sport-club-sportsman-healthy-lifestyle-cartoon-character-illustration_109722-1785.jpg' },
  { id: 'avatar-6', url: 'https://img.freepik.com/premium-vector/cartoon-coach-woman-fitness-trainer-cute-girl-sportswear-show-muscle-biceps_501813-319.jpg' },
];

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ selectedAvatar, onSelectAvatar }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Trainer Avatar</h3>
      
      <RadioGroup 
        value={selectedAvatar} 
        onValueChange={onSelectAvatar}
        className="grid grid-cols-3 gap-4"
      >
        {AVATAR_OPTIONS.map((avatar) => (
          <motion.div 
            key={avatar.id} 
            className="flex flex-col items-center space-y-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <Label 
                htmlFor={avatar.id} 
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <div className="relative">
                  <Avatar className={`h-20 w-20 transition-all transform ${selectedAvatar === avatar.url ? 'ring-4 ring-purple-600 ring-offset-2' : 'border-2 border-gray-200 hover:border-purple-300'}`}>
                    <AvatarImage src={avatar.url} alt="Avatar option" />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                  {selectedAvatar === avatar.url && (
                    <motion.div 
                      className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full p-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      <Check className="h-4 w-4" />
                    </motion.div>
                  )}
                </div>
                <RadioGroupItem 
                  value={avatar.url} 
                  id={avatar.id} 
                  className="sr-only" 
                />
              </Label>
            </div>
          </motion.div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default AvatarSelector;
