import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Google GenAI client lazily to avoid startup crashes if key is missing
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required. Make sure it is set in Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Warmup endpoint to check AI configuration
app.get('/api/config', (req, res) => {
  const apiKeyExists = !!process.env.GEMINI_API_KEY;
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  res.json({
    configured: apiKeyExists,
    appUrl,
  });
});

// Endpoint: Generate Weekly Dinner Plan
app.post('/api/generate-plan', async (req, res) => {
  try {
    const { dietType, customPreferences } = req.body;
    
    if (!dietType) {
      res.status(400).json({ error: 'dietType is required' });
      return;
    }

    const ai = getAiClient();
    
    const prompt = `Generate a 7-day dinner plan from Monday to Sunday for a user following a "${dietType}" diet.
Please provide exactly 7 highly practical, delicious dinner recipes.
CRITICAL CONSTRAINT: Do NOT include any pork or pork-derived ingredients (pork chop, pork sausage, bacon, lard, ham, prosciutto, pork ribs, etc.). If bacon or sausage is needed, use turkey, chicken, or beef alternatives instead (e.g. turkey bacon, chicken sausage, beef bacon).
${customPreferences ? `The user has the following additional preferences: "${customPreferences}". Adapt the recipes to align with these preferences while strictly respecting the ${dietType} diet rules.` : ''}

For each day, provide the nutrient values (calories, protein, carbohydrates, fat), list of ingredients with quantities, and short summary explanation.

Diet Guidance:
- Keto: extremely low carb, high fat, moderate protein.
- Protein: high protein (main focus, e.g., chicken, beef, fish, tofu), balanced carbs and fats.
- Mediterranean: focusing on whole grains, healthy fats (olive oil, fish), vegetables, fruits.
- Diabetic: focuses on low glycemic, high fiber, protein, healthy fats, controlled portions. No refined sugars.
- Vegetarian: NO meat or fish, includes dairy/eggs.
- Vegan: NO animal products whatsoever (no meat, fish, dairy, eggs, honey).
- Pescatarian: Vegetarian diet but includes fish and seafood.`;

    // Define JSON schema for the output
    const mealProperties = {
      day: { type: Type.STRING, description: "Must be one of: 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'" },
      name: { type: Type.STRING, description: "Descriptive name of the dinner dish" },
      calories: { type: Type.INTEGER, description: "Estimated calories in kcal" },
      protein: { type: Type.INTEGER, description: "Protein in grams" },
      carbs: { type: Type.INTEGER, description: "Carbohydrates in grams" },
      fat: { type: Type.INTEGER, description: "Fat in grams" },
      ingredients: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Precise ingredients with estimated physical quantities needed for 1 serving, e.g., '150g salmon fillet', '1 tbsp olive oil'"
      },
      instructions: { type: Type.STRING, description: "Short 1-2 sentence overview of assembly or cooking." }
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: mealProperties,
                required: ['day', 'name', 'calories', 'protein', 'carbs', 'fat', 'ingredients', 'instructions']
              },
              description: "Exactly 7 everyday dinners for the week from Monday to Sunday"
            }
          },
          required: ['days']
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from AI");
    }

    const jsonData = JSON.parse(resultText);
    res.json(jsonData);
  } catch (error: any) {
    console.error('Error generating dinner plan:', error);
    res.status(500).json({ error: error.message || 'Failed to generate plan' });
  }
});

// Endpoint: Analyze Custom Dinner
app.post('/api/analyze-custom-dinner', async (req, res) => {
  try {
    const { mealName, dietType } = req.body;
    
    if (!mealName) {
      res.status(400).json({ error: 'mealName is required' });
      return;
    }

    const ai = getAiClient();

    const prompt = `Analyze this user enter custom dinner: "${mealName}".
The user has selected a "${dietType || 'balanced'}" diet.
CRITICAL CONSTRAINT: The user strictly excludes PORK. If they input any pork dish (such as "pork loin", " bacon", "pork sausage", "bbq pork ribs"), automatically substitute it with a healthy beef, chicken, turkey, or tofu equivalent (e.g., "Beef Ribs", "Turkey Bacon", "Chicken Sausage") and estimate the nutrient values and list ingredients accordingly.
Calculate and estimate reasonable nutrient values (calories, protein, carbohydrates, and fats) for a single dinner portion of this meal.
Also list the typical ingredients with physical quantities and supply a 1-sentence description/cooking guidance.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Capitalized and corrected name of the meal" },
            calories: { type: Type.INTEGER, description: "Estimated total calories in kcal (e.g. 450)" },
            protein: { type: Type.INTEGER, description: "Protein in grams" },
            carbs: { type: Type.INTEGER, description: "Carbohydrates in grams" },
            fat: { type: Type.INTEGER, description: "Fat in grams" },
            ingredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of typical ingredients with estimated portion sizes"
            },
            instructions: { type: Type.STRING, description: "Short description/cooking instruction" }
          },
          required: ['name', 'calories', 'protein', 'carbs', 'fat', 'ingredients', 'instructions']
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from AI");
    }

    const jsonData = JSON.parse(resultText);
    res.json(jsonData);
  } catch (error: any) {
    console.error('Error analyzing custom dinner:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze meal' });
  }
});

// Hook Vite Dev Server or Production Build
async function startServer() {
  // If we are on Vercel, we do not need to boot Vite or serve static files or listen on port 3000.
  // Vercel routes `/api/*` to the serverless function and handles static files dynamically at the edge.
  if (process.env.VERCEL) {
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();

export default app;

