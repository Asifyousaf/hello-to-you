
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, Clock, Heart, Beef, Apple, Egg } from 'lucide-react';

interface RecipePreviewProps {
  recipeData: any[];
  onSaveRecipe?: (recipe: any) => void;
}

const RecipePreview: React.FC<RecipePreviewProps> = ({ recipeData, onSaveRecipe }) => {
  if (!recipeData || recipeData.length === 0) return null;
  
  const handleSaveRecipe = (recipe: any) => {
    if (onSaveRecipe) {
      onSaveRecipe(recipe);
    }
  };
  
  // Select the first recipe to display
  const recipe = recipeData[0];
  
  return (
    <div className="mt-4">
      <Card className="border border-green-200">
        <CardHeader className="bg-green-50 pb-2">
          <CardTitle className="text-sm font-medium text-green-800 flex items-center">
            <Utensils className="w-4 h-4 mr-2" /> 
            Recipe Suggestion
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 pb-2">
          <div className="flex gap-3">
            {recipe.image && (
              <div className="w-20 h-20 flex-shrink-0">
                <img 
                  src={recipe.image} 
                  alt={recipe.title}
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
                  }}
                />
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-medium text-sm">{recipe.title}</h4>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {recipe.readyInMinutes && (
                  <div className="flex items-center text-xs text-gray-600">
                    <Clock className="w-3 h-3 mr-1" /> {recipe.readyInMinutes} min
                  </div>
                )}
                
                {recipe.healthScore && (
                  <div className="flex items-center text-xs text-gray-600">
                    <Heart className="w-3 h-3 mr-1" /> Health Score: {recipe.healthScore}
                  </div>
                )}
              </div>
              
              {/* Display nutrition info if available */}
              {(recipe.nutrition || recipe.nutrients) && (
                <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
                  {(recipe.nutrition?.protein || recipe.nutrients?.find((n: any) => n.name === "Protein")?.amount) && (
                    <div className="flex items-center">
                      <Beef className="w-3 h-3 mr-1 text-red-500" /> 
                      {recipe.nutrition?.protein || recipe.nutrients?.find((n: any) => n.name === "Protein")?.amount}g
                    </div>
                  )}
                  {(recipe.nutrition?.carbs || recipe.nutrients?.find((n: any) => n.name === "Carbohydrates")?.amount) && (
                    <div className="flex items-center">
                      <Apple className="w-3 h-3 mr-1 text-green-500" /> 
                      {recipe.nutrition?.carbs || recipe.nutrients?.find((n: any) => n.name === "Carbohydrates")?.amount}g
                    </div>
                  )}
                  {(recipe.nutrition?.fat || recipe.nutrients?.find((n: any) => n.name === "Fat")?.amount) && (
                    <div className="flex items-center">
                      <Egg className="w-3 h-3 mr-1 text-yellow-500" /> 
                      {recipe.nutrition?.fat || recipe.nutrients?.find((n: any) => n.name === "Fat")?.amount}g
                    </div>
                  )}
                </div>
              )}
              
              {recipe.diets && recipe.diets.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {recipe.diets.slice(0, 2).map((diet: string, i: number) => (
                    <span key={i} className="bg-green-100 px-1.5 py-0.5 rounded-full text-xs">
                      {diet}
                    </span>
                  ))}
                  {recipe.diets.length > 2 && (
                    <span className="text-xs text-gray-500">+{recipe.diets.length - 2} more</span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {recipeData.length > 1 && (
            <p className="text-xs text-gray-500 text-center italic mt-3">
              +{recipeData.length - 1} more recipes available
            </p>
          )}
        </CardContent>
        <CardFooter className="bg-gray-50 pt-2">
          <Button 
            onClick={() => handleSaveRecipe(recipe)}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            Save Recipe
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecipePreview;
