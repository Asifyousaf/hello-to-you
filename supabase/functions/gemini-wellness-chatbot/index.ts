
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get environment variables
const geminiApiKey = Deno.env.get("Gemini_1");
const exerciseDBApiKey = Deno.env.get('EXERCISEDB_API_KEY');
const spoonacularApiKey = Deno.env.get('SPOONACULAR_API_KEY');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// System prompt for the Gemini AI
const systemPrompt = `
You are a certified personal trainer and nutritionist who helps users with workout plans, meal suggestions, and wellness tips.

IMPORTANT FORMATTING RULES:
1. Use plain text only. No markdown formatting.
2. Keep your responses conversational, clear, and concise.

WORKOUT INSTRUCTIONS:
When users ask about workouts, structure your response like this:
- Keep exercise explanations simple and direct
- Include clear title, type, duration, and estimated calories
- ALWAYS provide exercises with name, sets, reps, duration (in seconds), rest time, and detailed instructions
- Format ALL workouts as structured JSON with these exact fields:
{
  "title": "Name of the workout",
  "type": "STRENGTH/CARDIO/HIIT/etc",
  "duration": 30, // in minutes
  "exercises": [
    {
      "name": "Exercise name",
      "sets": 3,
      "reps": 12,
      "duration": 60, // in seconds
      "restTime": 30, // in seconds
      "instructions": [
        "Step 1: Detailed instruction",
        "Step 2: Form guidance",
        "Step 3: Tips for proper execution"
      ]
    }
  ]
}

RECIPE INSTRUCTIONS:
When users ask about recipes or meal plans, structure your response like this:
- Begin with "Here's a recipe you might enjoy. You can save it to your collection."
- Include title, ingredients list, step-by-step instructions
- Always include nutrition information (calories, protein, carbs, fat)
- For recipes, use this format:
{
  "title": "Recipe Name",
  "ingredients": [
    "1 cup ingredient 1",
    "2 tbsp ingredient 2"
  ],
  "instructions": [
    "Step 1: Mix ingredients",
    "Step 2: Cook for 10 minutes"
  ],
  "calories": 350,
  "protein": 25,
  "carbs": 30,
  "fat": 15,
  "tags": ["vegetarian", "high-protein"]
}

Remember to be encouraging and supportive in your responses. Start workout responses with "Here's a workout plan for you. You can add it to your workout page." and recipe responses with "Here's a recipe you might enjoy. You can save it to your collection."
`;

// Function to detect if user is asking for workout information
function isWorkoutQuery(query: string): boolean {
  const workoutKeywords = ['workout', 'exercise', 'training', 'lift', 'cardio', 'strength', 'routine', 'fitness', 'muscle', 'gym'];
  return workoutKeywords.some(keyword => query.toLowerCase().includes(keyword));
}

// Function to detect if user is asking for nutrition information
function isNutritionQuery(query: string): boolean {
  const nutritionKeywords = ['food', 'meal', 'recipe', 'diet', 'nutrition', 'eat', 'calorie', 'protein', 'carb', 'vegan', 'vegetarian', 'gluten', 'breakfast', 'lunch', 'dinner', 'snack', 'cook', 'ingredient'];
  return nutritionKeywords.some(keyword => query.toLowerCase().includes(keyword));
}

// Function to fetch workout data from ExerciseDB
async function fetchWorkoutData(query: string) {
  try {
    // Extract potential target muscles or body parts from the query
    const bodyParts = ['back', 'cardio', 'chest', 'lower arms', 'lower legs', 'neck', 'shoulders', 'upper arms', 'upper legs', 'waist'];
    const targetMuscles = ['abductors', 'abs', 'adductors', 'biceps', 'calves', 'delts', 'forearms', 'glutes', 'hamstrings', 'lats', 'pectorals', 'quads', 'traps', 'triceps'];
    
    let endpoint = 'https://exercisedb.p.rapidapi.com/exercises';
    let bodyPart = bodyParts.find(part => query.toLowerCase().includes(part));
    let targetMuscle = targetMuscles.find(muscle => query.toLowerCase().includes(muscle));
    
    if (bodyPart) {
      endpoint = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`;
    } else if (targetMuscle) {
      endpoint = `https://exercisedb.p.rapidapi.com/exercises/target/${targetMuscle}`;
    }
    
    console.log(`Fetching workout data from: ${endpoint}`);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': exerciseDBApiKey!,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    });
    
    if (!response.ok) {
      throw new Error(`ExerciseDB API error: ${response.status} ${await response.text()}`);
    }
    
    let data = await response.json();
    
    // Limit to 5 exercises to avoid overwhelming the user
    if (Array.isArray(data)) {
      data = data.slice(0, 5);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching workout data:', error);
    return null;
  }
}

// Function to fetch recipe data from Spoonacular
async function fetchRecipeData(query: string) {
  try {
    // Extract dietary preferences or calories from the query
    const dietTypes = ['vegetarian', 'vegan', 'gluten free', 'keto', 'paleo'];
    let dietType = dietTypes.find(diet => query.toLowerCase().includes(diet.toLowerCase()));
    
    // Extract calorie information
    let maxCalories = null;
    const calorieMatch = query.match(/(\d+)\s*calories/);
    if (calorieMatch) {
      maxCalories = parseInt(calorieMatch[1]);
    }
    
    // Check for specific food types or dishes
    const cuisineTypes = ['italian', 'mexican', 'asian', 'indian', 'greek', 'mediterranean'];
    let cuisineType = cuisineTypes.find(cuisine => query.toLowerCase().includes(cuisine.toLowerCase()));
    
    // Check for meal types
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert'];
    let mealType = mealTypes.find(meal => query.toLowerCase().includes(meal.toLowerCase()));
    
    // Build query parameters
    let params = new URLSearchParams({
      apiKey: spoonacularApiKey!,
      number: '3', // Limit to 3 recipes
      addRecipeInformation: 'true',
      addRecipeNutrition: 'true',
      query: query.replace(/recipe|meal|food|eat/gi, '').trim() // Clean up the query a bit
    });
    
    if (dietType) {
      params.append('diet', dietType);
    }
    
    if (maxCalories) {
      params.append('maxCalories', maxCalories.toString());
    }
    
    if (cuisineType) {
      params.append('cuisine', cuisineType);
    }
    
    if (mealType) {
      params.append('type', mealType);
    }
    
    console.log(`Fetching recipe data with params: ${params.toString()}`);
    
    const endpoint = `https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`;
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status} ${await response.text()}`);
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching recipe data:', error);
    return null;
  }
}

// Extract structured recipe data from text
function extractRecipeFromText(text: string) {
  // Try to find structured recipe data
  let recipe = {
    title: "",
    ingredients: [] as string[],
    instructions: [] as string[],
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    tags: [] as string[]
  };
  
  // Extract title
  const titleMatch = text.match(/Recipe:\s*([^\n]+)/);
  if (titleMatch) {
    recipe.title = titleMatch[1].trim();
  } else {
    const titleAltMatch = text.match(/^(.*?)(?:Recipe|Ingredients)/i);
    if (titleAltMatch) {
      recipe.title = titleAltMatch[1].trim();
    }
  }
  
  // Extract ingredients
  const ingredientsMatch = text.match(/Ingredients:([\s\S]*?)(?:Instructions|Directions|Method|Steps|Preparation|$)/i);
  if (ingredientsMatch) {
    const ingredientsText = ingredientsMatch[1].trim();
    recipe.ingredients = ingredientsText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.match(/^[-•*]?\s*\d*\.?\s*\w+/));
  }
  
  // Extract instructions
  const instructionsMatch = text.match(/(?:Instructions|Directions|Method|Steps|Preparation):([\s\S]*?)(?:Preparation time|Cooking time|Total time|Nutritional|Nutrition|Dietary|Serving|$)/i);
  if (instructionsMatch) {
    const instructionsText = instructionsMatch[1].trim();
    recipe.instructions = instructionsText
      .split('\n')
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(line => line.length > 10); // Filter out short lines
  }
  
  // Extract nutrition info
  const caloriesMatch = text.match(/Calories:\s*(\d+)/i);
  if (caloriesMatch) {
    recipe.calories = parseInt(caloriesMatch[1]);
  }
  
  const proteinMatch = text.match(/Protein:\s*(\d+)g/i);
  if (proteinMatch) {
    recipe.protein = parseInt(proteinMatch[1]);
  }
  
  const carbsMatch = text.match(/Carbs:\s*(\d+)g/i);
  if (carbsMatch) {
    recipe.carbs = parseInt(carbsMatch[1]);
  }
  
  const fatMatch = text.match(/Fat:\s*(\d+)g/i);
  if (fatMatch) {
    recipe.fat = parseInt(fatMatch[1]);
  }
  
  // Extract tags/diet info
  const tagsMatch = text.match(/(?:Dietary tags|Tags):\s*([^\n]+)/i);
  if (tagsMatch) {
    recipe.tags = tagsMatch[1].split(',').map(tag => tag.trim());
  }
  
  // Check if we have a valid recipe
  if (recipe.title && 
      (recipe.ingredients.length > 0 || recipe.instructions.length > 0) && 
      (recipe.calories > 0 || recipe.protein > 0)) {
    
    // Make sure we have some reasonable defaults
    if (recipe.calories === 0) recipe.calories = 300;
    if (recipe.protein === 0) recipe.protein = 20;
    if (recipe.carbs === 0) recipe.carbs = 30;
    if (recipe.fat === 0) recipe.fat = 15;
    
    return [recipe];
  }
  
  return null;
}

async function generateGeminiResponse(prompt: string) {
  try {
    if (!geminiApiKey) {
      throw new Error("Gemini API key is missing");
    }

    // Use the updated API endpoint for Gemini
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    // Extract the text from the Gemini response
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Unexpected response format from Gemini API");
    }
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { message, history = [] } = await req.json();
    console.log('Request received:', { message, historyLength: history?.length });
    
    // Check if API keys are available
    if (!geminiApiKey) {
      throw new Error("Gemini API key is missing. Please add it to your environment variables.");
    }
    
    let additionalData = null;
    let dataType = null;
    
    // Check if we should fetch additional data
    if (isWorkoutQuery(message)) {
      console.log("Workout query detected, fetching exercise data...");
      additionalData = await fetchWorkoutData(message);
      dataType = 'exercise';
    } else if (isNutritionQuery(message)) {
      console.log("Nutrition query detected, fetching recipe data...");
      additionalData = await fetchRecipeData(message);
      dataType = 'recipe';
    }

    // Build prompt with additional data if available
    let chatPrompt = message;
    
    if (additionalData && dataType === 'exercise' && Array.isArray(additionalData)) {
      const exerciseSummary = additionalData.map(ex => 
        `Name: ${ex.name}, Target: ${ex.target}, Equipment: ${ex.equipment}`
      ).join('\n');
      
      // Modify the system prompt to encourage structured JSON output
      chatPrompt = `${systemPrompt}\n\nUser query: ${message}\n\nI found these exercises that might be relevant to the user's query. Use this data to provide specific exercise recommendations:\n\n${exerciseSummary}\n\nMake sure to format your response with a clear JSON structure that includes title, duration, calories, and exercises (with names, sets, and reps). This helps the app save the workout correctly. Begin with "Here's a workout plan for you. You can add it to your workout page." Use simple, clean text format without markdown.`;
    } else if (additionalData && dataType === 'recipe' && Array.isArray(additionalData)) {
      const recipeSummary = additionalData.map(recipe => 
        `Title: ${recipe.title}, Diet: ${recipe.diets?.join(', ') || 'N/A'}`
      ).join('\n');
      
      chatPrompt = `${systemPrompt}\n\nUser query: ${message}\n\nI found these recipes that might be relevant to the user's query. Use this data to provide specific meal recommendations:\n\n${recipeSummary}\n\nPlease use this recipe data in your response and begin with "Here's a recipe you might enjoy. You can save it to your recipe collection." Use simple, clean text format without markdown. Include structured recipe data with title, ingredients, instructions, and nutrition info.`;
    } else {
      chatPrompt = `${systemPrompt}\n\nUser query: ${message}\n\nPlease respond in simple, clean text format without markdown or special formatting. If the user is asking about recipes or meals, start with "Here's a recipe you might enjoy" and include structured recipe data. If the user is asking about workouts, start with "Here's a workout plan for you" and include structured workout data.`;
    }

    console.log('Sending prompt to Gemini:', chatPrompt.substring(0, 100) + '...');
    
    // Send message to Gemini
    const text = await generateGeminiResponse(chatPrompt);
    
    console.log('Gemini response received:', text.substring(0, 100) + '...');
    
    // Process the text to remove any special characters
    let cleanedText = text
      .replace(/\*\*/g, '')  // Remove bold markdown
      .replace(/\*/g, '')     // Remove italic markdown
      .replace(/==/g, '')     // Remove highlight markdown
      .replace(/--/g, '')     // Remove strikethrough
      .replace(/```.*?```/gs, '') // Remove code blocks
      .replace(/#/g, '');     // Remove heading markdown
    
    // Try to extract recipe data if nutrition query and no API data
    let extractedRecipeData = null;
    if (dataType === 'recipe' && (!additionalData || additionalData.length === 0)) {
      extractedRecipeData = extractRecipeFromText(cleanedText);
      if (extractedRecipeData) {
        console.log('Extracted recipe data from text response');
        dataType = 'recipe';
        additionalData = extractedRecipeData;
      }
    }
      
    // Return the chatbot response
    return new Response(
      JSON.stringify({
        reply: cleanedText,
        workoutData: dataType === 'exercise' ? additionalData : null,
        recipeData: dataType === 'recipe' ? additionalData : null,
        dataType: dataType
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
    
  } catch (error) {
    console.error('Error in gemini-wellness-chatbot function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred processing your request' 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
