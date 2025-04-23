import React from "react";
import { Button } from "@/components/ui/button";
import { Utensils } from "lucide-react";

interface Recipe {
  title: string;
  diets?: string[];
  calories?: number;
  nutrition?: { calories?: number; protein?: number; carbs?: number; fat?: number; };
  image?: string;
  summary?: string;
  ingredients?: string[];
  instructions?: string[];
  tags?: string[];
  servings?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  [key: string]: any;
}

interface RecipePackPreviewProps {
  recipes: Recipe[];
  onAddRecipe?: (recipes: Recipe[]) => void;
}

const RecipePackPreview: React.FC<RecipePackPreviewProps> = ({ recipes, onAddRecipe }) => {
  if (!recipes?.length) return null;

  // Aggregate info for the top UI
  const totalCalories =
    recipes.reduce(
      (sum, recipe) => sum + (recipe.nutrition?.calories || recipe.calories || 0),
      0
    ) || 300;
    
  const preparationTime = recipes.reduce(
    (sum, recipe) => sum + (recipe.readyInMinutes || 15),
    0
  );

  const handleAddRecipe = () => {
    if (onAddRecipe) {
      // Ensure each recipe has proper structure before saving
      const formattedRecipes = recipes.map(recipe => ({
        ...recipe,
        title: recipe.title || "AI Generated Recipe",
        calories: recipe.nutrition?.calories || recipe.calories || 300,
        protein: recipe.nutrition?.protein || recipe.protein || 25,
        carbs: recipe.nutrition?.carbs || recipe.carbs || 40,
        fat: recipe.nutrition?.fat || recipe.fat || 15,
        servings: recipe.servings || 2,
        image: recipe.image || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        summary: recipe.summary || "AI-generated recipe",
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
        instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
        tags: recipe.tags || recipe.diets || ["AI Generated"]
      }));
      
      console.log("Formatted recipes to add:", formattedRecipes);
      onAddRecipe(formattedRecipes);
    }
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg mb-2 shadow-sm overflow-hidden">
      <div className="p-4 pb-2">
        <div className="font-semibold text-lg text-green-800 flex items-center gap-2">
          <Utensils className="w-5 h-5" /> 
          AI Recipe{recipes.length > 1 ? " Pack" : ""}
          {recipes.length > 1 && (
            <span className="bg-green-200 text-green-900 px-2 py-0.5 rounded text-xs ml-2">
              {recipes.length} recipes
            </span>
          )}
        </div>
        
        <div className="text-green-700 text-sm mb-2">
          {recipes[0]?.summary?.substring(0, 120) || "Personalized recipe by AI assistant"}
          {recipes[0]?.summary?.length > 120 ? "..." : ""}
        </div>
        
        <div className="flex items-center space-x-5 text-xs text-green-700 mb-2">
          <span>Approx. {preparationTime} mins</span>
          <span>~{totalCalories} calories</span>
        </div>
      </div>

      {/* Preview of the first recipe */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-3">
          {recipes[0]?.image && (
            <img
              src={recipes[0].image}
              alt={recipes[0].title}
              className="h-16 w-16 object-cover rounded"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
              }}
            />
          )}
          <div>
            <div className="font-medium text-sm">{recipes[0].title}</div>
            {recipes[0].diets && recipes[0].diets.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {recipes[0].diets.slice(0, 2).map((diet: string, i: number) => (
                  <span key={i} className="bg-green-100 px-1.5 py-0.5 rounded-full text-xs">
                    {diet}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="border-t border-green-200 bg-green-100 p-2">
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          onClick={handleAddRecipe}
        >
          Add to Nutrition
        </Button>
      </div>
    </div>
  );
};

export default RecipePackPreview;
