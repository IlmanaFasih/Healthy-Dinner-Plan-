export type DietType = 'Protein' | 'Keto' | 'Mediterranean' | 'Diabetic' | 'Vegetarian' | 'Vegan' | 'Pescatarian';

export interface Nutrients {
  calories: number;   // kcal
  protein: number;    // g
  carbs: number;      // g
  fat: number;        // g
}

export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions?: string;
  source: 'ai' | 'user';
}

export interface DailyPlan {
  day: string; // e.g., 'Monday', 'Tuesday', ...
  dinner: Meal | null;
  eaten: boolean;
  actualNutrients?: Nutrients; // Overridden nutrients if different, otherwise defaults to dinner
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
  mealName?: string; // which meal this ingredient is for
}

export interface WeeklyPlan {
  id: string; // e.g., week start date or random uuid
  dietType: DietType;
  startDate: string; // YYYY-MM-DD
  days: DailyPlan[];
  shoppingItems: ShoppingItem[];
  targetCalories: number; // Daily target
  targetProtein: number;  // Daily target
  isCompleted: boolean;
}

export interface WeeklyHistoryRecord {
  id: string;
  weekRange: string; // e.g. "Jun 22 - Jun 28"
  dietType: DietType;
  isCompleted: boolean;
  days: {
    day: string;
    mealName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    eaten: boolean;
  }[];
}
