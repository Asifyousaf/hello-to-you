
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Clock, Users, Heart, Check, Flame, Apple, Beef, Egg } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface RecipeDetailsProps {
  recipe: any;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (recipe: any) => void;
  isAlreadySaved?: boolean;
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({ 
  recipe, 
  isOpen, 
  onClose,
  onSave,
  isAlreadySaved = false
}) => {
  if (!recipe) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{recipe.title}</DialogTitle>
          <DialogDescription className="text-base text-gray-500 mt-2">
            {recipe.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <div className="rounded-lg overflow-hidden h-64 md:h-80">
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
              }}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {recipe.tags && recipe.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-medium">{recipe.time}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-medium">{recipe.servings} {recipe.servings === 1 ? 'serving' : 'servings'}</span>
            </div>
            {recipe.calories && (
              <div className="flex items-center">
                <Flame className="h-5 w-5 text-orange-500 mr-2" />
                <span className="font-medium text-orange-500">{recipe.calories} calories per serving</span>
              </div>
            )}
          </div>
          
          {/* Nutrition information */}
          {(recipe.protein || recipe.carbs || recipe.fat) && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-green-800">Nutrition Facts (per serving)</h3>
              <div className="grid grid-cols-3 gap-4">
                {recipe.protein && (
                  <div className="flex flex-col items-center p-2 bg-white rounded-lg">
                    <Beef className="h-5 w-5 text-red-500 mb-1" />
                    <span className="font-bold text-lg">{recipe.protein}g</span>
                    <span className="text-xs text-gray-600">Protein</span>
                  </div>
                )}
                {recipe.carbs && (
                  <div className="flex flex-col items-center p-2 bg-white rounded-lg">
                    <Apple className="h-5 w-5 text-green-500 mb-1" />
                    <span className="font-bold text-lg">{recipe.carbs}g</span>
                    <span className="text-xs text-gray-600">Carbs</span>
                  </div>
                )}
                {recipe.fat && (
                  <div className="flex flex-col items-center p-2 bg-white rounded-lg">
                    <Egg className="h-5 w-5 text-yellow-500 mb-1" />
                    <span className="font-bold text-lg">{recipe.fat}g</span>
                    <span className="text-xs text-gray-600">Fat</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
            <ul className="list-disc list-inside space-y-2">
              {recipe.ingredients && recipe.ingredients.map((ingredient: string, index: number) => (
                <li key={index} className="text-gray-700">{ingredient}</li>
              ))}
            </ul>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Instructions</h3>
            <ol className="list-decimal list-inside space-y-4">
              {recipe.instructions && recipe.instructions.map((step: string, index: number) => (
                <li key={index} className="text-gray-700">
                  <span className="font-medium text-green-800">Step {index + 1}:</span> {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
        
        <DialogFooter className="pt-6">
          {onSave && (
            isAlreadySaved ? (
              <Button disabled className="gap-2 bg-green-100 text-green-800">
                <Check className="h-4 w-4" />
                Recipe Saved
              </Button>
            ) : (
              <Button onClick={() => onSave(recipe)} className="gap-2 bg-green-600 hover:bg-green-700">
                <Heart className="h-4 w-4" />
                Save Recipe
              </Button>
            )
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDetails;
