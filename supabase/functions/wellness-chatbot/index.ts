import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const exerciseDBApiKey = Deno.env.get('EXERCISEDB_API_KEY');
const spoonacularApiKey = Deno.env.get('SPOONACULAR_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// System prompt for the AI
const systemPrompt = `
You are a certified personal trainer and nutritionist. You help users with beginner-friendly workout plans, meal suggestions, calorie advice, and basic meditation tips. Always ask users about their goals, fitness level, and dietary preferences before giving answers. Never give medical advice. If someone has a health condition or injury, tell them to consult a doctor. Be friendly, short, and motivating in tone. Avoid extreme diets or unsafe recommendations. All responses must be under 120 words unless the user asks for more detail.

When users ask about workout routines for specific body parts or goals, you should mention that you're checking the ExerciseDB for accurate information.

When users ask about meal plans, recipes, or nutrition advice, you should format your response with recipe information at the beginning of your response. Always include a recipe name, ingredients (if appropriate), and preparation instructions. This helps the system identify and save recipes properly.

If the user wants to add a workout to their routine, format the workout plan with a clear title, description, and list of exercises in a structured way. Start with: "WORKOUT_PLAN: {title}|{type}|{level}|{description}|{exercises}" so the system can parse it.

If the user wants meal suggestions, format them in a way that can be saved: "MEAL_PLAN: {title}|{diet}|{calories}|{description}". 
`;

// Function to detect if user is asking for workout information
function isWorkoutQuery(query: string): boolean {
  const workoutKeywords = ['workout', 'exercise', 'training', 'lift', 'cardio', 'strength', 'routine', 'fitness', 'muscle', 'gym'];
  return workoutKeywords.some(keyword => query.toLowerCase().includes(keyword));
}

// Function to detect if user is asking for nutrition information
function isNutritionQuery(query: string): boolean {
  const nutritionKeywords = ['food', 'meal', 'recipe', 'diet', 'nutrition', 'eat', 'calorie', 'protein', 'carb', 'vegan', 'vegetarian', 'gluten', 'cook', 'breakfast', 'lunch', 'dinner', 'snack', 'dessert'];
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

// Enhanced function to fetch recipe data from Spoonacular
async function fetchRecipeData(query: string) {
  try {
    // Extract dietary preferences or calories from the query
    const dietTypes = ['vegetarian', 'vegan', 'gluten free', 'keto', 'paleo', 'low carb', 'high protein'];
    let dietType = dietTypes.find(diet => query.toLowerCase().includes(diet.toLowerCase()));
    
    // Extract calorie information
    let maxCalories = null;
    const calorieMatch = query.match(/(\d+)\s*calories/);
    if (calorieMatch) {
      maxCalories = parseInt(calorieMatch[1]);
    }
    
    // Extract meal type if specified
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert'];
    let mealType = mealTypes.find(meal => query.toLowerCase().includes(meal.toLowerCase()));
    
    // Build query parameters
    let params = new URLSearchParams({
      apiKey: spoonacularApiKey!,
      number: '3', // Limit to 3 recipes
      addRecipeInformation: 'true',
      addRecipeNutrition: 'true',
      fillIngredients: 'true',
      query: query
    });
    
    if (dietType) {
      params.append('diet', dietType);
    }
    
    if (maxCalories) {
      params.append('maxCalories', maxCalories.toString());
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
    
    // Transform the recipe data to include nutrition information in a consistent format
    const enhancedRecipes = data.results.map((recipe: any) => {
      // Extract nutrition info if available
      const nutrition = recipe.nutrition ? {
        calories: recipe.nutrition?.nutrients?.find((n: any) => n.name === "Calories")?.amount || 0,
        protein: recipe.nutrition?.nutrients?.find((n: any) => n.name === "Protein")?.amount || 0,
        carbs: recipe.nutrition?.nutrients?.find((n: any) => n.name === "Carbohydrates")?.amount || 0,
        fat: recipe.nutrition?.nutrients?.find((n: any) => n.name === "Fat")?.amount || 0
      } : null;
      
      return {
        ...recipe,
        nutrition: nutrition
      };
    });
    
    return enhancedRecipes;
  } catch (error) {
    console.error('Error fetching recipe data:', error);
    return null;
  }
}

// Generate a basic recipe from AI content
function generateBasicRecipe(aiReply: string) {
  // Try to extract recipe title - usually the first line or first sentence
  let title = aiReply.split('\n')[0].trim();
  if (title.length > 60) {
    // If first line is too long, use first 60 chars
    title = title.substring(0, 60) + "...";
  }
  
  const recipeLines = aiReply.split('\n').filter(line => line.trim().length > 0);
  
  // Try to identify ingredients section
  let ingredients: string[] = [];
  let ingredientsStart = -1;
  let ingredientsEnd = -1;
  
  for (let i = 0; i < recipeLines.length; i++) {
    if (recipeLines[i].toLowerCase().includes('ingredient') && ingredientsStart === -1) {
      ingredientsStart = i + 1;
    } else if (ingredientsStart !== -1 && 
              (recipeLines[i].toLowerCase().includes('instruction') || 
               recipeLines[i].toLowerCase().includes('direction') || 
               recipeLines[i].toLowerCase().includes('preparation'))) {
      ingredientsEnd = i;
      break;
    }
  }
  
  if (ingredientsStart !== -1 && ingredientsEnd !== -1) {
    ingredients = recipeLines.slice(ingredientsStart, ingredientsEnd)
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\s*[-•*]\s*/, '').trim()); // Remove bullet points
  }
  
  // Try to identify instructions
  let instructions: string[] = [];
  let instructionsStart = -1;
  
  for (let i = 0; i < recipeLines.length; i++) {
    if ((recipeLines[i].toLowerCase().includes('instruction') || 
         recipeLines[i].toLowerCase().includes('direction') || 
         recipeLines[i].toLowerCase().includes('preparation')) && 
        instructionsStart === -1) {
      instructionsStart = i + 1;
      break;
    }
  }
  
  if (instructionsStart !== -1) {
    instructions = recipeLines.slice(instructionsStart)
      .filter(line => line.trim().length > 0)
      .map(line => {
        // Remove step numbers and bullet points
        let cleanedLine = line.replace(/^\s*\d+\.\s*/, '').replace(/^\s*[-•*]\s*/, '').trim();
        return cleanedLine;
      });
  }
  
  // Try to identify dietary information
  const dietTypes = ['vegetarian', 'vegan', 'gluten-free', 'keto', 'paleo', 'low-carb', 'high-protein'];
  const diets = dietTypes.filter(diet => aiReply.toLowerCase().includes(diet));
  
  return {
    title: title,
    summary: aiReply.substring(0, 250) + "...",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 30,
    servings: 2,
    diets: diets.length > 0 ? diets : ["Balanced"],
    ingredients: ingredients,
    instructions: instructions,
    nutrition: {
      calories: 300,
      protein: 25,
      carbs: 40,
      fat: 15
    }
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { message, history, userProfile } = await req.json();
    console.log('Request received:', { message, historyLength: history?.length, userProfile });
    
    // Check if API keys are available
    if (!openAIApiKey) {
      throw new Error("OpenAI API key is missing. Please add it to your environment variables.");
    }
    
    let openAIMessages = [
      { role: 'system', content: systemPrompt }
    ];
    
    // Add user profile information if available
    if (userProfile) {
      const profilePrompt = `
        User Profile Information:
        - Fitness Goal: ${userProfile.fitness_goal || 'Not specified'}
        - Fitness Level: ${userProfile.fitness_level || 'Not specified'}
        - Age: ${userProfile.age || 'Not specified'}
        - Weight: ${userProfile.weight ? `${userProfile.weight} kg` : 'Not specified'}
        - Height: ${userProfile.height ? `${userProfile.height} cm` : 'Not specified'}
      `;
      openAIMessages.push({ role: 'system', content: profilePrompt });
    }
    
    // Add chat history if available
    if (history && history.length > 0) {
      // Limit history to last 10 messages to avoid token limits
      const recentHistory = history.slice(-10);
      recentHistory.forEach(item => {
        openAIMessages.push({ 
          role: item.sender === 'user' ? 'user' : 'assistant',
          content: item.content 
        });
      });
    }
    
    // Add current user message
    openAIMessages.push({ role: 'user', content: message });
    
    // Check if we should fetch additional data
    let additionalData = null;
    let dataSource = null;
    
    if (isWorkoutQuery(message)) {
      additionalData = await fetchWorkoutData(message);
      dataSource = 'exercise';
      if (additionalData) {
        const exerciseSummary = additionalData.map(ex => 
          `Name: ${ex.name}, Target: ${ex.target}, Equipment: ${ex.equipment}`
        ).join('\n');
        
        openAIMessages.push({
          role: 'system',
          content: `I found these exercises that might be relevant to the user's query. Use this data to provide specific exercise recommendations:\n\n${exerciseSummary}\n\nRemember to format workout plans as described earlier if the user wants to save them.`
        });
      }
    } else if (isNutritionQuery(message)) {
      additionalData = await fetchRecipeData(message);
      dataSource = 'recipe';
      if (additionalData) {
        const recipeSummary = additionalData.map((recipe: any) => 
          `Title: ${recipe.title}, Calories: ${recipe.nutrition?.calories || 'N/A'}, Diet: ${recipe.diets?.join(', ') || 'N/A'}`
        ).join('\n');
        
        openAIMessages.push({
          role: 'system',
          content: `I found these recipes that might be relevant to the user's query. Use this data to provide specific meal recommendations:\n\n${recipeSummary}\n\nRemember to format meal plans as described earlier if the user wants to save them.`
        });
      } else if (!additionalData || additionalData.length === 0) {
        additionalData = [generateBasicRecipe(message)];
      }
    }
    
    console.log('Making request to OpenAI with messages:', JSON.stringify(openAIMessages, null, 2).substring(0, 500) + '...');
    
    // Make request to OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: openAIMessages,
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error response:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }
    
    const openAIData = await openAIResponse.json();
    const assistantReply = openAIData.choices[0].message.content;
    
    console.log('OpenAI response received:', assistantReply.substring(0, 200) + '...');
    
    // Check if the response contains a workout plan or meal plan
    const workoutPlanMatch = assistantReply.match(/WORKOUT_PLAN: (.*?)\|(.*?)\|(.*?)\|(.*?)\|(.*)/s);
    const mealPlanMatch = assistantReply.match(/MEAL_PLAN: (.*?)\|(.*?)\|(.*?)\|(.*)/s);
    
    let parsedPlan = null;
    
    if (workoutPlanMatch) {
      parsedPlan = {
        type: 'workout',
        title: workoutPlanMatch[1].trim(),
        workoutType: workoutPlanMatch[2].trim(),
        level: workoutPlanMatch[3].trim(),
        description: workoutPlanMatch[4].trim(),
        exercises: workoutPlanMatch[5].trim()
      };
    } else if (mealPlanMatch) {
      parsedPlan = {
        type: 'meal',
        title: mealPlanMatch[1].trim(),
        diet: mealPlanMatch[2].trim(),
        calories: mealPlanMatch[3].trim(),
        description: mealPlanMatch[4].trim()
      };
    }
    
    // Clean up the response to remove the special formatting if needed
    let cleanedReply = assistantReply;
    if (parsedPlan) {
      if (parsedPlan.type === 'workout') {
        cleanedReply = assistantReply.replace(/WORKOUT_PLAN: .*$/s, '').trim();
      } else if (parsedPlan.type === 'meal') {
        cleanedReply = assistantReply.replace(/MEAL_PLAN: .*$/s, '').trim();
      }
    }
    
    // Return the chatbot response
    return new Response(
      JSON.stringify({
        reply: cleanedReply,
        additionalData: additionalData,
        dataSource: dataSource,
        parsedPlan: parsedPlan
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
    
  } catch (error) {
    console.error('Error in wellness-chatbot function:', error);
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
