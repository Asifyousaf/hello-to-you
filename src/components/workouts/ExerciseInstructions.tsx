
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface ExerciseInstructionsProps {
  instructions: string[];
}

const ExerciseInstructions: React.FC<ExerciseInstructionsProps> = ({ instructions }) => {
  return (
    <div className="space-y-3 bg-white p-4 rounded-lg shadow-sm">
      <h4 className="font-medium text-purple-800">Instructions:</h4>
      
      <Carousel className="w-full">
        <CarouselContent>
          {instructions.map((instruction, index) => (
            <CarouselItem key={index} className="pl-1 md:basis-1/1">
              <div className="p-4 border border-purple-100 rounded-lg bg-white">
                <div className="flex items-start">
                  <div className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{instruction}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1" />
        <CarouselNext className="right-1" />
      </Carousel>
    </div>
  );
};

export default ExerciseInstructions;
