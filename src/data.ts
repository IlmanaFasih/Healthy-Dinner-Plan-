// Let's first make sure we can import types properly
import { DietType, Meal, WeeklyHistoryRecord } from './types';

export interface DietDetails {
  type: DietType;
  name: string;
  description: string;
  badgeColor: string;
  borderColor: string;
  textColor: string;
  bgColor: string;
  targetProteinPercent: number; // % of calories from protein
  targetCarbsPercent: number;
  targetFatPercent: number;
  defaultCaloriesTarget: number;
  defaultProteinTarget: number;
}

export const DIETS: DietDetails[] = [
  {
    type: 'Protein',
    name: 'High Protein Diet',
    description: 'Prioritizes lean proteins to support muscle growth, satiety, and active lifestyles.',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    borderColor: 'border-indigo-500',
    textColor: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    targetProteinPercent: 35,
    targetCarbsPercent: 35,
    targetFatPercent: 30,
    defaultCaloriesTarget: 2000,
    defaultProteinTarget: 175,
  },
  {
    type: 'Keto',
    name: 'Ketogenic Diet',
    description: 'High-fat, ultra-low-carbohydrate intake designed to induce ketosis for metabolic efficiency.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
    targetProteinPercent: 25,
    targetCarbsPercent: 5,
    targetFatPercent: 70,
    defaultCaloriesTarget: 1800,
    defaultProteinTarget: 110,
  },
  {
    type: 'Mediterranean',
    name: 'Mediterranean Diet',
    description: 'Rich in whole grains, fish, olive oil, and fresh vegetables for heart and brain health.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    targetProteinPercent: 20,
    targetCarbsPercent: 45,
    targetFatPercent: 35,
    defaultCaloriesTarget: 2000,
    defaultProteinTarget: 100,
  },
  {
    type: 'Diabetic',
    name: 'Diabetic Safe Diet',
    description: 'Controlled carbohydrates and low GI ingredients to promote stable, healthy blood sugar levels.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    borderColor: 'border-rose-500',
    textColor: 'text-rose-600',
    bgColor: 'bg-rose-50',
    targetProteinPercent: 25,
    targetCarbsPercent: 40,
    targetFatPercent: 35,
    defaultCaloriesTarget: 1800,
    defaultProteinTarget: 112,
  },
  {
    type: 'Vegetarian',
    name: 'Vegetarian',
    description: 'Plant-forward meals excluding meat and fish, incorporating wholesome dairy and grains.',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    borderColor: 'border-teal-500',
    textColor: 'text-teal-600',
    bgColor: 'bg-teal-50',
    targetProteinPercent: 20,
    targetCarbsPercent: 50,
    targetFatPercent: 30,
    defaultCaloriesTarget: 2000,
    defaultProteinTarget: 100,
  },
  {
    type: 'Vegan',
    name: 'Vegan (Plant-Based)',
    description: '100% plant-derived dinners. Clean, ethical nutrition completely free from animal inputs.',
    badgeColor: 'bg-green-100 text-green-800 border-green-200',
    borderColor: 'border-green-500',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    targetProteinPercent: 18,
    targetCarbsPercent: 55,
    targetFatPercent: 27,
    defaultCaloriesTarget: 1900,
    defaultProteinTarget: 85,
  },
  {
    type: 'Pescatarian',
    name: 'Pescatarian',
    description: 'Seafood and plant harmony. Rich in heart-healthy omega-3s and lean marine protein sources.',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    borderColor: 'border-sky-500',
    textColor: 'text-sky-600',
    bgColor: 'bg-sky-50',
    targetProteinPercent: 25,
    targetCarbsPercent: 45,
    targetFatPercent: 30,
    defaultCaloriesTarget: 2000,
    defaultProteinTarget: 125,
  }
];

export const INITIAL_MEALS_BY_DIET: Record<DietType, Meal[]> = {
  Protein: [
    {
      name: 'Lemon Herb Garlic Chicken Breast with Roasted Asparagus',
      calories: 420,
      protein: 48,
      carbs: 12,
      fat: 18,
      ingredients: ['200g Lean Chicken Breast', '150g Fresh Asparagus', '1 tbsp Extra Virgin Olive Oil', '2 cloves Garlic, minced', '1 tbsp Fresh Lemon Juice', '1 pinch Italian Seasoning'],
      instructions: 'Marinate chicken breast in garlic, lemon juice, oil, and herbs. Grill on medium-high for 6-8 mins per side. Roast asparagus alongside in the grill pan.',
      source: 'ai'
    },
    {
      name: 'Pan-Seared Salmon with Steamed Quinoa & Garlic Broccoli',
      calories: 550,
      protein: 41,
      carbs: 32,
      fat: 26,
      ingredients: ['180g Wild Salmon Fillet', '80g Quinoa cooked', '150g Broccoli florets', '1 tsp Avocado Oil', '1 clove Garlic', '1 lemon slice'],
      instructions: 'Sear salmon skinside down in avocado oil for 4 mins, turn over and cook for 3 more mins. Steam broccoli with minced garlic and serve alongside fluffy quinoa.',
      source: 'ai'
    },
    {
      name: 'Lean Beef Sirloin Stir Fry with Mixed Colored Peppers',
      calories: 480,
      protein: 44,
      carbs: 20,
      fat: 22,
      ingredients: ['180g Lean Beef Sirloin, sliced', '100g Bell Peppers, sliced', '50g Snap Peas', '1 tbsp Tamari, light soy sauce', '1 tsp Sesame Oil', '1 tsp Fresh Ginger'],
      instructions: 'In a wok, stir fry beef slices in sesame oil until brown. Toss in fresh bell peppers and snap peas with ginger and soy sauce for 3 minutes.',
      source: 'ai'
    },
    {
      name: 'Cajun Blackened Shrimp Bowl with Black Beans & Avocado',
      calories: 410,
      protein: 38,
      carbs: 28,
      fat: 14,
      ingredients: ['200g Raw Shrimp, peeled', '100g Cooked Black Beans', '50g Avocado slices', '1 Cajun seasoning blend', '50g Chopped Romaine Lettuce', '1 Lime wedge'],
      instructions: 'Toss shrimp in cajun seasoning and cook in a hot pan for 2 mins per side. Assemble in a bowl over romaine with warm black beans and creamed avocado.',
      source: 'ai'
    },
    {
      name: 'Baked Sesame Turkey Meatballs with Cauliflower Rice',
      calories: 430,
      protein: 40,
      carbs: 15,
      fat: 21,
      ingredients: ['200g Ground Lean Turkey', '200g Fresh Cauliflower Rice', '1 Egg white', '1 tsp Sesame seeds', '1 Green onion, chopped', '1 tbsp Light soy sauce'],
      instructions: 'Mix turkey, egg white, green onion, and bake as meatballs at 400°F (200°C) for 15 mins. Stir fry cauliflower rice with a splash of soy sauce, top with meatballs.',
      source: 'ai'
    },
    {
      name: 'Mediterranean Baked Sea Bass with Chickpea Spinach Salad',
      calories: 460,
      protein: 42,
      carbs: 24,
      fat: 19,
      ingredients: ['200g Fresh Sea Bass Fillet', '80g Canned Chickpeas, rinsed', '100g Baby Spinach', '5 Cherry Tomatoes', '1 tbsp Olive oil', '1 tsp dried Oregano'],
      instructions: 'Bake sea bass with herbs and a drizzle of olive oil at 375°F for 18 mins. Serve alongside chicken-pea spinach salad dressed in remaining olive oil.',
      source: 'ai'
    },
    {
      name: 'High-Protein Grilled Tofu Blocks with Quinoa & Mushrooms',
      calories: 440,
      protein: 35,
      carbs: 38,
      fat: 16,
      ingredients: ['250g Extra Firm Tofu, pressed', '80g Quinoa cooked', '100g cremini Mushrooms', '1 tbsp Soy sauce', '1 tsp Sesame oil', '1 clove Garlic'],
      instructions: 'Slice and olive-oil grill the tofu blocks until golden brown. Sauté mushrooms in garlic and sesame oil; combine with quinoa and serve.',
      source: 'ai'
    }
  ],
  Keto: [
    {
      name: 'Cheesy Avocado Butter Ribeye Steak',
      calories: 780,
      protein: 52,
      carbs: 3,
      fat: 62,
      ingredients: ['220g Prime Ribeye Steak', 'Half Fresh Avocado', '20g Herb Grass-fed Butter', '30g Cheddar Cheese', '1 tbsp Olive oil'],
      instructions: 'Sear well-salted steak in a smoking skillet with olive oil for 3 mins each side. Top with butter, avocado, and shredded melted cheddar cheese.',
      source: 'ai'
    },
    {
      name: 'Crispy Garlic Butter Salmon with Creamy Cheesy Spinach',
      calories: 680,
      protein: 42,
      carbs: 4,
      fat: 55,
      ingredients: ['180g Salmon fillet', '100g Heavy cream', '30g Parmesan cheese', '150g Fresh spinach leaves', '15g Butter', '2 cloves Garlic'],
      instructions: 'Crisp salmon skin in a skillet. Sauté spinach in garlic, butter, and cream, slowly melting parmesan cheese until thick. Serve salmon on top.',
      source: 'ai'
    },
    {
      name: 'Keto Turkey Bacon Cheeseburger Salad Bowl',
      calories: 620,
      protein: 46,
      carbs: 5,
      fat: 46,
      ingredients: ['180g Ground Beef (80/20)', '2 slices Smoked Turkey Bacon', '35g Cheddar Cheese', '80g Crisp Lettuce', '2 tbsp Creamy Ranch dressing', '2 slices Cucumber'],
      instructions: 'Fry turkey bacon till crisp, crumble it. Sauté ground beef crumbled, seasoning well. Assemble salad with lettuce, ground beef, melted cheddar, turkey bacon, cucumbers, and ranch.',
      source: 'ai'
    },
    {
      name: 'Sesame Chicken Stir Fry with Cauliflower Rice',
      calories: 590,
      protein: 42,
      carbs: 6,
      fat: 43,
      ingredients: ['200g Chicken thighs, skin-on', '180g Cauliflower rice', '2 tbsp Sesame oil', '1 stalk Green onion', '1 tbsp Soy sauce', '10g Butter'],
      instructions: 'Sauté chopped chicken thighs in sesame oil till crisp. Sauté cauliflower rice in butter and garlic, and stir in green onion and soy sauce.',
      source: 'ai'
    },
    {
      name: 'Baked Tuscan Garlic Chicken Thighs with Mushroom Sauce',
      calories: 640,
      protein: 44,
      carbs: 4,
      fat: 49,
      ingredients: ['220g Skin-on Chicken Thighs', '80g Mushrooms, sliced', '80g Heavy cream', '15g Butter', '10g Parmesan', '20g Sun-dried tomatoes'],
      instructions: 'Pan-sear chicken thighs in butter skin-side down until crispy, then bake at 370°F for 15 mins. Sauté mushrooms, sun-dried tomatoes, heavy cream, and parmesan to pour over chicken.',
      source: 'ai'
    },
    {
      name: 'Italian Chicken Sausage & Bell Pepper Skillets under Provolone',
      calories: 590,
      protein: 38,
      carbs: 7,
      fat: 42,
      ingredients: ['180g Sweet Italian Chicken Sausage link', '100g Sliced Bell Peppers', '30g Sliced White Onion', '2 slices Provolone Cheese', '1 tbsp Olive oil'],
      instructions: 'Sauté sliced chicken sausages with bell peppers and onions in olive oil until fully soft. Place cheeses on top, cover with a lid to melt fully.',
      source: 'ai'
    },
    {
      name: 'Lemon Dill Garlic Baked Trout with Asparagus Butter',
      calories: 580,
      protein: 38,
      carbs: 3,
      fat: 46,
      ingredients: ['200g Rainbow Trout Fillet', '120g Asparagus spears', '25g Grass-fed Butter', '1 Fresh Lemon', '1 clove Garlic minced', '1 sprig fresh Dill'],
      instructions: 'Drizzle fish with melted dill garlic butter and lemon juices. Roast in baking paper next to asparagus at 400°F for 12 minutes.',
      source: 'ai'
    }
  ],
  Mediterranean: [
    {
      name: 'Greek Lemon Garlic Grilled Chicken Souvlaki with Tzatziki',
      calories: 490,
      protein: 42,
      carbs: 22,
      fat: 24,
      ingredients: ['180g Chicken cubes', '1 Whole Wheat Pita bread', '80g Greek Yogurt plain', '50g Cucumbers grated', '1 tbsp Extra Virgin Olive Oil', '1 Lemon'],
      instructions: 'Skewer chicken cubes, season with garlic/oregano and grill. Mix yogurt, grated cucumber, garlic and olive oil to make Tzatziki. Serve with warm pocket pita.',
      source: 'ai'
    },
    {
      name: 'Garlic Basil Pan-Seared Cod over Tomato Chickpea Ragout',
      calories: 520,
      protein: 38,
      carbs: 42,
      fat: 18,
      ingredients: ['200g Fresh Cod fillet', '100g Chickpeas canned, drained', '120g Canned Crushed Tomatoes', '1 tbsp Olive oil', '5 Olives Kalamata', '1 clove Garlic'],
      instructions: 'Simmer tomatoes, chickpeas, garlic, and olives in olive oil for 10 mins. Pan-fry cod fillet in garlic oil, serve nestled on warm ragout.',
      source: 'ai'
    },
    {
      name: 'Mediterranean Quinoa Salad with Seared Tuna Steaks',
      calories: 580,
      protein: 45,
      carbs: 36,
      fat: 22,
      ingredients: ['150g Tuna Steak', '100g Cooked Quinoa', '50g Cucumber', '5 Cherry Tomatoes', '30g Feta Cheese crumbled', '1.5 tbsp Olive oil'],
      instructions: 'Quickly sear raw tuna 1-2 mins per side. Toss ready quinoa with diced cucumber, tomatoes, olives, crumbled feta cheese, and olive oil vinaigrette.',
      source: 'ai'
    },
    {
      name: 'Creamy Pesto Whole Wheat Penne with Shellfish',
      calories: 540,
      protein: 35,
      carbs: 58,
      fat: 16,
      ingredients: ['120g Jumbo Shrimp & Mussels', '70g Dry Whole Wheat Penne', '1.5 tbsp Basil Pesto', '6 Cherry tomatoes', '1 tsp Olive oil', '10g Pine nuts'],
      instructions: 'Boil penne pasta. Sauté shellfish in olive oil with cherry tomatoes. Toss hot pasta in pesto dressing, mix in seafood, top with toasted pine nuts.',
      source: 'ai'
    },
    {
      name: 'Stuffed Bell Peppers with Spiced Turkey & Brown Rice',
      calories: 460,
      protein: 36,
      carbs: 45,
      fat: 14,
      ingredients: ['2 Large Green Bell Peppers', '150g Lean Lean Ground Turkey', '100g Cooked Brown Rice', '1 tbsp Tomato paste', '1 tbsp Olive oil', '1 tsp Hummus'],
      instructions: 'Sauté turkey in olive oil with rice, tomato paste and simple spices. Stuff inside raw bell peppers and bake in water bath at 380°F for 30 mins.',
      source: 'ai'
    },
    {
      name: 'Baked Lemon Salmon with Garlic Parsley Quinoa tabbouleh',
      calories: 530,
      protein: 39,
      carbs: 33,
      fat: 24,
      ingredients: ['160g Salmon fillet', '80g Quinoa cooked', '1 cup Fresh Parsley finely chopped', '3 Cherry Tomatoes', '1 tbsp Lemon oil', '1 slice Cucumber'],
      instructions: 'Bake salmon dressed in fresh lemon slices. Toss quinoa with a massive volume of flat parsley, diced tomatoes, cucumbers, lemon and olive oil.',
      source: 'ai'
    },
    {
      name: 'Baked Herb Falafel Wraps with Cucumber Mint Yogurt',
      calories: 440,
      protein: 18,
      carbs: 54,
      fat: 15,
      ingredients: ['4 Baked Falafel balls', '1 Flat Whole Wheat Tortilla', '40g Hummus paste', '60g Greek Yogurt', '2 leaves fresh Mint', '50g Shredded Cabbage'],
      instructions: 'Toast tortilla. Spread base hummus. Place baked falafels, add fresh cabbage, and drizzle with low-fat greek yogurt hand mixed with chopped mint.',
      source: 'ai'
    }
  ],
  Diabetic: [
    {
      name: 'Lean Herbed Grilled Chicken with Quinoa & Steamed Zucchini',
      calories: 410,
      protein: 42,
      carbs: 28,
      fat: 12,
      ingredients: ['180g Lean Chicken breast', '60g Quinoa cooked', '150g Zucchini sliced', '1 tsp Olive oil', '1 Lemon slice', '1 branch Fresh Rosemary'],
      instructions: 'Grill chicken breast in light pan. Steam zucchini with garlic and salt. Serve alongside small controlled portion of quinoa dressed in lemon oil.',
      source: 'ai'
    },
    {
      name: 'Crusted Cod with Roasted Cauliflower & Green Beans',
      calories: 380,
      protein: 34,
      carbs: 18,
      fat: 14,
      ingredients: ['200g Cod fish', '150g Cauliflower florets', '100g Green Beans', '1.5 tbsp Almond flour to crust', '1 tbsp Avocdo Oil', '1 Lemon'],
      instructions: 'Pat fish in almond flour, pan sear in avocado oil. Bake cauliflower with herbs until toasted. Serve with steamed snap green beans.',
      source: 'ai'
    },
    {
      name: 'Baked Turkey Breast Burger in Lettuce Wraps',
      calories: 350,
      protein: 36,
      carbs: 10,
      fat: 16,
      ingredients: ['180g Ground Lean Turkey patty', '2 Heavy Iceberg Lettuce leaves', '1 slice Tomato', '1 slice Onion', '40g Avocado sliced', '1 tbsp Mustard'],
      instructions: 'Grill turkey burger patty. Wrap in large ice-cold lettuce leaves with tomato, onion, sweet-free mustard, and fresh fiber-healthy avocado.',
      source: 'ai'
    },
    {
      name: 'Sesame Ginger Beef Stir Fry over Broccoli Florets',
      calories: 440,
      protein: 38,
      carbs: 15,
      fat: 22,
      ingredients: ['150g Tender Beef Sirloin', '200g Fresh Broccoli', '50g Bell Peppers', '1 tbsp Soy sauce low sodium', '1 tsp Sesame Oil', '1 tsp ginger minced'],
      instructions: 'Stir fry ginger, garlic, beef strips, and sweet peppers. Sauté broccoli in small vegetable broth, mix and dress in a splash of sesame oil.',
      source: 'ai'
    },
    {
      name: 'Pan Salmon with Dill vinaigrette Salad & Chickpeas',
      calories: 490,
      protein: 36,
      carbs: 22,
      fat: 26,
      ingredients: ['150g Salmon fillet', '100g Spring salad mix', '50g Chickpeas canned', '1 tbsp Olive oil', '1 tbsp Apple Cider vinegar', '1 tsp Fresh Dill'],
      instructions: 'Cook salmon. Toss spring greens and boiled chickpeas in vinaigrette made of olive oil, apple cider vinegar, and fresh dill. Serve cold under fish.',
      source: 'ai'
    },
    {
      name: 'Mexican Lime Tilapia with Black Bean & Avocado Salsa',
      calories: 390,
      protein: 35,
      carbs: 20,
      fat: 15,
      ingredients: ['180g Tilapia fish fillet', '60g Canned Black Beans', '40g Avocado cubed', '30g diced Tomato', '1 Lime', '1 tbsp Cilantro chopped'],
      instructions: 'Bake tilapia with lime juice and cumin. Mix beans, avocado cubes, chopped tomato, lime zest and cilantro to create a fresh diabetic-friendly salsa.',
      source: 'ai'
    },
    {
      name: 'Greek Tofu Scramble with Spinach, Feta & Olives',
      calories: 370,
      protein: 26,
      carbs: 12,
      fat: 25,
      ingredients: ['250g Firm Tofu, crumbled', '100g Spinach leaves', '30g Feta Cheese', '5 Kalamata Olives sliced', '1 tbsp Olive oil', '1 clove Garlic'],
      instructions: 'Sauté garlic and spinach in olive oil. Add crumbled tofu, sea salt and turmeric, sauté for 5 mins, crumble in olives and feta elements.',
      source: 'ai'
    }
  ],
  Vegetarian: [
    {
      name: 'Mediterranean Garlic Feta & Roasted Veggie Chickpea Pasta',
      calories: 520,
      protein: 24,
      carbs: 58,
      fat: 18,
      ingredients: ['70g Dry Banza Chickpea Pasta', '40g Greek Feta Cheese', '100g Zucchini & Cherry tomatoes', '1 tbsp Extra Virgin Olive Oil', '5 Olives Kalamata', '1 clove Garlic'],
      instructions: 'Boil chickpea pasta for rich protein basis. Roast zucchini, garlic and cherry tomatoes in oil. Toss warm pasta with veggies and crumbled feta.',
      source: 'ai'
    },
    {
      name: 'Paneer Butter Masala with Cauliflower & Sweet Peas',
      calories: 590,
      protein: 28,
      carbs: 32,
      fat: 36,
      ingredients: ['150g Fresh Paneer cubes', '100g Cauliflower florets', '50g Green Peas', '80g Marinara Tomato sauce', '50g Light Coconut milk', '1 tbsp Ghee or Butter'],
      instructions: 'Lightly fry paneer. Cook cauliflower and peas in ghee, tomato purée, coconut milk and Indian mild spices. Toss paneer, simmer 5 mins.',
      source: 'ai'
    },
    {
      name: 'Grilled Portobello Mushroom Steaks with Basil Quinoa Salad',
      calories: 450,
      protein: 16,
      carbs: 48,
      fat: 19,
      ingredients: ['2 Large Portobello heads', '80g Quinoa cooked', '4 Cherry Tomatoes', '25g Goat Cheese crumbled', '1.5 tbsp Basil Pesto dressing', '1 cup Arugula'],
      instructions: 'Brush portobello caps in garlic oil, grill for 5 mins on each side. Toss quinoa with sliced cherry tomatoes, arugula, goat cheese, and pesto dressing.',
      source: 'ai'
    },
    {
      name: 'Mexican Loaded Avocado Fajitas Black Bean Bowl',
      calories: 480,
      protein: 18,
      carbs: 46,
      fat: 22,
      ingredients: ['Half Large Avocado', '100g Black Beans cooked', '80g Sweet Corn kernels', '50g Bell Peppers, grilled', '2 tbsp Sour Cream', '70g Brown Rice cooked'],
      instructions: 'Roast corn and bell pepper slices in a pan. In a bowl, layer brown rice, beans, fajita veggies, fresh avocado slices, and top with rich sour cream.',
      source: 'ai'
    },
    {
      name: 'Crispy Sauté Tofu with Garlic Broccoli & Egg Fried Rice',
      calories: 530,
      protein: 26,
      carbs: 52,
      fat: 22,
      ingredients: ['180g Hard Tofu pressed', '1 Whole Egg', '100g Jasmine cooked rice', '100g Broccoli florets', '1 tbsp Soy sauce', '1 tbsp Peanut Oil'],
      instructions: 'Cube and fry tofu in peanut oil till golden. Stir fry rice with egg, broccoli florets, white pepper and light soy sauce. Top with crisp tofu.',
      source: 'ai'
    },
    {
      name: 'Lentil Sweet Potato Shepherd Pie with Goat Cheese Mash',
      calories: 490,
      protein: 22,
      carbs: 62,
      fat: 14,
      ingredients: ['100g Brown Lentils cooked', '150g Sweet potatoes', '50g Carrots & Green peas', '1 tbsp Tomato paste', '20g goat cheese', '1 tsp Butter'],
      instructions: 'Simmer lentils, carrots, peas, and tomato paste. Mash boiled sweet potatoes with butter and goat cheese. Layer mash over lentils, bake in oven.',
      source: 'ai'
    },
    {
      name: 'Quinoa Stuffed Butternut Squash with Pumpkin Seeds',
      calories: 430,
      protein: 15,
      carbs: 55,
      fat: 14,
      ingredients: ['Half Butternut squash', '80g Quinoa cooked', '20g Dried Cranberries', '15g Pumpkin seeds toasted', '1 tbsp Olive oil', '1 tsp Maple syrup'],
      instructions: 'Scoop and roast butternut squash with olive oil. Mix cooked quinoa with cranberries, pumpkin seeds, maple syrup. Stuff into squash and serve.',
      source: 'ai'
    }
  ],
  Vegan: [
    {
      name: 'Tofu Cashew Coconut Curry with Cauliflower Rice',
      calories: 480,
      protein: 22,
      carbs: 24,
      fat: 32,
      ingredients: ['200g Extra Firm Tofu, cubed', '100g Cauliflower rice', '100ml Unsweetened Coconut Milk', '20g Raw Cashew Nuts', '1 tbsp Red curry paste', '1 tsp Coconut Oil'],
      instructions: 'Sauté tofu in coconut oil. Add vegetables, curry paste, and rich coconut milk. Simmer until creamy and serve over warm cauliflower rice, garnish with cashews.',
      source: 'ai'
    },
    {
      name: 'Smoky Crispy Tempeh Bowl with Garlic Broccoli & Tahini',
      calories: 510,
      protein: 28,
      carbs: 38,
      fat: 24,
      ingredients: ['150g Organic Tempeh', '120g Broccoli spears', '80g Cooked Quinoa', '1.5 tbsp Sesame Tahini paste', '1 tbsp Maple syrup', '1 tbsp Soy sauce'],
      instructions: 'Slice, coat tempeh in maple-soy marinade, and fry till crisp. Steam broccoli. Whisk tahini paste with hot water and lemon juice. Core stack bowl.',
      source: 'ai'
    },
    {
      name: 'Lentil Bolognese with Spiralized Zucchini Noodles',
      calories: 390,
      protein: 20,
      carbs: 45,
      fat: 11,
      ingredients: ['120g Brown Lentils cooked', '2 Large Zucchini spiralized', '150g Crushed Tomatoes canned', '2 cloves Garlic', '1 tbsp Olive oil', '1 tbsp Nutritional Yeast'],
      instructions: 'Sauté garlic, add lentils, crushed tomatoes, and simmer 15 mins. Quick sauté zucchini noodles in olive oil, ladle hot sauce on top, dust with nutritional yeast.',
      source: 'ai'
    },
    {
      name: 'Mexican Shredded Jackfruit & Black Bean Corn Bowls',
      calories: 450,
      protein: 16,
      carbs: 54,
      fat: 15,
      ingredients: ['120g Jackfruit canned, shredded', '100g Black Beans', '50g Sweet Corn', '40g Avocado slices', '100g Cooked Brown Rice', '1 Lime'],
      instructions: 'Season jackfruit in cumin, lime and bake till shredded-pulled texture. Serve in a bowl with hot brown rice, black beans, sweet corn, lime-spritz avocado.',
      source: 'ai'
    },
    {
      name: 'Protein-Rich Edamame Soba Noodles with Sesame Garlic Soy',
      calories: 470,
      protein: 24,
      carbs: 55,
      fat: 14,
      ingredients: ['80g Dry Soba Buckwheat noodles', '100g Shelled Edamame beans', '50g Shredded Carrots', '1 tbsp Sesame Oil', '1 tbsp Peanut butter', '1 tbsp Soy sauce'],
      instructions: 'Boil soba noodles and toss in fresh edamame and carrots. Melt peanut butter into sesame soy mixture and fold into scone noodle base.',
      source: 'ai'
    },
    {
      name: 'Mediterranean Chickpea & Spinach Stew with Roasted Almonds',
      calories: 430,
      protein: 15,
      carbs: 48,
      fat: 18,
      ingredients: ['150g Canned Chickpeas, rinsed', '150g Baby Spinach', '120g Diced Tomatoes canned', '1 tbsp Olive oil', '15g Toasted Almonds slivers', '1 slice Lemon'],
      instructions: 'Sauté garlic in olive oil, add tomatoes and chickpeas, simmering for 12 mins. Reduce baby spinach into base, serve with chopped toasted almonds.',
      source: 'ai'
    },
    {
      name: 'Spiced Chickpea Sweet Potato Boats with Maple Tahini',
      calories: 460,
      protein: 14,
      carbs: 58,
      fat: 16,
      ingredients: ['1 Medium Sweet Potato', '100g Crispy baked Chickpeas', '1 tbsp Tahini paste', '1 tsp Maple syrup', '1 tbsp Lemon juices', '1 pinch Smoked Paprika'],
      instructions: 'Bake sweet potato. Season chickpeas in paprika and bake till crunchy. Slit sweet potato open, stuff with chickpeas, drizzle with sweet lemon tahini.',
      source: 'ai'
    }
  ],
  Pescatarian: [
    {
      name: 'Garlic Crust Lemon Salmon with Roasted Asparagus & Quinoa',
      calories: 560,
      protein: 41,
      carbs: 28,
      fat: 26,
      ingredients: ['180g Salmon fillet', '120g Asparagus', '60g Quinoa cooked', '1.5 tbsp Olive oil', '2 Garlic cloves', '1 Lemon'],
      instructions: 'Grill salmon topped with minced garlic and lemon. Bake asparagus spears alongside under a drizzle of olive oil. Serve with warm, fluffy quinoa.',
      source: 'ai'
    },
    {
      name: 'Cajun Pan Sir Shrimp Sautéed with Cauliflower Rice',
      calories: 420,
      protein: 36,
      carbs: 15,
      fat: 21,
      ingredients: ['180g Clean Shrimp', '200g Cauliflower rice', '1 green bell pepper', '1 tbsp Butter', '1 tsp Cajun season mix', '1 Avocado slice'],
      instructions: 'Sauté shrimp in butter and cajun seasoning for 4 mins. Toss cauliflower rice and bell pepper in pan seasoning till perfectly hot. Serve with avocado.',
      source: 'ai'
    },
    {
      name: 'Mediterranean Cod Baked Tomato Kalamata Stew',
      calories: 490,
      protein: 38,
      carbs: 32,
      fat: 19,
      ingredients: ['200g Cod fillet', '120g Canned Tomatoes crushed', '80g Canned Chickpeas', '1 tbsp Olive oil', '5 kalamata olives', '1 clove Garlic'],
      instructions: 'Simmer tomatoes, chickpeas, garlic and chopped olives in olive oil. Bake cod fillet on top of stew in baking dish at 380°F for 15 mins.',
      source: 'ai'
    },
    {
      name: 'White Wine Garlic Lemon Mussels with Sourdough Toast',
      calories: 510,
      protein: 34,
      carbs: 45,
      fat: 17,
      ingredients: ['250g Fresh Mussels in shell', '1 slice Artisanal Sourdough', '50ml Dry White Wine', '1.5 tbsp Butter', '2 cloves Garlic, sliced', '1 Lemon'],
      instructions: 'Sauté sliced garlic in butter, add white wine, lemon juices and mussels. Cover skillet and steam 4-5 mins until shells open. Serve with crisp sourdough.',
      source: 'ai'
    },
    {
      name: 'Pan-Seared Yellowfin Tuna Bowl with Avocado & Cucumber',
      calories: 580,
      protein: 46,
      carbs: 35,
      fat: 22,
      ingredients: ['160g Tuna Steak', '60g Jasmine Rice cooked', '50g Avocado cubed', '50g Cucumber slices', '1 tbsp Sesame seeds', '1 tbsp Ponzu/Soy sauce'],
      instructions: 'Sear tuna steak in sesame oil for 1 min per side so the center remains medium-rare. Slice thin, arrange over rice with fresh avocado, cucumber, soy dressing.',
      source: 'ai'
    },
    {
      name: 'Baked Sea Bass with Olive Herb Tapenade & Green Beans',
      calories: 460,
      protein: 39,
      carbs: 16,
      fat: 24,
      ingredients: ['180g Sea Bass fillet', '100g Green Beans', '30g Black Olive Tapenade', '1 tbsp Olive oil', '1 Lemon', '1 tsp Capers'],
      instructions: 'Top fish with black olive tapenade and capers. Bake next to clean green beans on parchment paper at 370°F for 18 mins. Drizzle with lemon juice.',
      source: 'ai'
    },
    {
      name: 'Creamy Lemon Dill Pasta with Smoked Salmon Fillet',
      calories: 550,
      protein: 32,
      carbs: 52,
      fat: 21,
      ingredients: ['100g Smoked Salmon slices', '70g Whole Wheat Pasta', '60g Light Cream cheese', '1 tsp Fresh Dill', '1 tsp Olive oil', '3 Cherry Tomatoes'],
      instructions: 'Boil pasta. Sauté cherry tomatoes. In a warm bowl, whisk hot pasta with cream cheese, olive oil, and sliced smoked salmon. Sprinkle fresh dill on top.',
      source: 'ai'
    }
  ]
};

export const SAMPLE_HISTORY: WeeklyHistoryRecord[] = [
  {
    id: 'history-1',
    weekRange: 'Jun 08 - Jun 14',
    dietType: 'Protein',
    isCompleted: true,
    days: [
      { day: 'Monday', mealName: 'Chicken breast with Asparagus', calories: 420, protein: 48, carbs: 12, fat: 18, eaten: true },
      { day: 'Tuesday', mealName: 'Salmon with Quinoa', calories: 550, protein: 41, carbs: 32, fat: 26, eaten: true },
      { day: 'Wednesday', mealName: 'Beef stir fry', calories: 480, protein: 44, carbs: 20, fat: 22, eaten: true },
      { day: 'Thursday', mealName: 'Blackened Shrimp salad', calories: 410, protein: 38, carbs: 28, fat: 14, eaten: true },
      { day: 'Friday', mealName: 'Sesame Turkey balls', calories: 430, protein: 40, carbs: 15, fat: 21, eaten: true },
      { day: 'Saturday', mealName: 'Baked Sea Bass chickpea', calories: 460, protein: 42, carbs: 24, fat: 19, eaten: false },
      { day: 'Sunday', mealName: 'Grilled Tofu blocks', calories: 440, protein: 35, carbs: 38, fat: 16, eaten: true }
    ]
  },
  {
    id: 'history-2',
    weekRange: 'Jun 15 - Jun 21',
    dietType: 'Protein',
    isCompleted: true,
    days: [
      { day: 'Monday', mealName: 'Chicken breast with Asparagus', calories: 430, protein: 45, carbs: 15, fat: 17, eaten: true },
      { day: 'Tuesday', mealName: 'Salmon with Quinoa', calories: 540, protein: 40, carbs: 30, fat: 27, eaten: true },
      { day: 'Wednesday', mealName: 'Custom Pizza Dinner', calories: 650, protein: 28, carbs: 70, fat: 24, eaten: true },
      { day: 'Thursday', mealName: 'Shrimp cajun salad', calories: 400, protein: 36, carbs: 26, fat: 13, eaten: true },
      { day: 'Friday', mealName: 'Sesame Turkey balls', calories: 430, protein: 40, carbs: 15, fat: 21, eaten: true },
      { day: 'Saturday', mealName: 'Baked Sea Bass chickpea', calories: 450, protein: 40, carbs: 22, fat: 18, eaten: true },
      { day: 'Sunday', mealName: 'Barbecue Chicken with Rice', calories: 510, protein: 44, carbs: 42, fat: 15, eaten: true }
    ]
  }
];
