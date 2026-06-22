import { useState, useEffect } from 'react';
import { DietType, DailyPlan, ShoppingItem, WeeklyHistoryRecord, Meal } from './types';
import { DIETS, INITIAL_MEALS_BY_DIET, SAMPLE_HISTORY } from './data';
import DietSelector from './components/DietSelector';
import DinnerPlanList from './components/DinnerPlanList';
import ShoppingList from './components/ShoppingList';
import NutritionDashboard from './components/NutritionDashboard';
import QRCodeInstructions from './components/QRCodeInstructions';
import {
  Calendar,
  ShoppingBasket,
  BarChart3,
  QrCode,
  Sparkles,
  ChefHat,
  Dumbbell,
  Flame,
  Check,
  AlertTriangle,
  Loader2,
  Settings,
  HelpCircle,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'plan' | 'shop' | 'insights' | 'deploy'>('plan');
  const [selectedDiet, setSelectedDiet] = useState<DietType>('Protein');
  const [planDays, setPlanDays] = useState<DailyPlan[]>([]);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [history, setHistory] = useState<WeeklyHistoryRecord[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiConfig, setApiConfig] = useState<{ configured: boolean; appUrl: string }>({
    configured: false,
    appUrl: 'https://ais-pre-yh7zuv7vhkfn7ll3qg765f-793897018743.us-east1.run.app',
  });
  const [configLoaded, setConfigLoaded] = useState(false);

  // Targets based on active diet configuration
  const activeDietDetails = DIETS.find((d) => d.type === selectedDiet) || DIETS[0];
  const [targetCalories, setTargetCalories] = useState(activeDietDetails.defaultCaloriesTarget);
  const [targetProtein, setTargetProtein] = useState(activeDietDetails.defaultProteinTarget);

  // Fetch API configuration
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const data = await res.json();
          setApiConfig({
            configured: data.configured,
            appUrl: data.appUrl || apiConfig.appUrl,
          });
        }
      } catch (err) {
        console.warn('Config fetch errored (using fallback values):', err);
      } finally {
        setConfigLoaded(true);
      }
    };
    fetchConfig();
  }, []);

  // Update calories and protein targets when diet changes
  useEffect(() => {
    setTargetCalories(activeDietDetails.defaultCaloriesTarget);
    setTargetProtein(activeDietDetails.defaultProteinTarget);
  }, [selectedDiet]);

  // Load state from local storage or set defaults on initial mount
  useEffect(() => {
    const savedDiet = localStorage.getItem('dinner_planner_diet') as DietType;
    if (savedDiet && DIETS.some((d) => d.type === savedDiet)) {
      setSelectedDiet(savedDiet);
    }

    const savedPlan = localStorage.getItem('dinner_planner_planDays');
    if (savedPlan) {
      setPlanDays(JSON.parse(savedPlan));
    } else {
      // Load standard pre-populated plan according to default selected diet
      const initialDiet = savedDiet || 'Protein';
      const defaultMeals = INITIAL_MEALS_BY_DIET[initialDiet];
      const initialPlan = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
        (day, index) => ({
          day,
          dinner: defaultMeals[index] || null,
          eaten: false,
        })
      );
      setPlanDays(initialPlan);
    }

    const savedShopping = localStorage.getItem('dinner_planner_shopping');
    if (savedShopping) {
      setShoppingItems(JSON.parse(savedShopping));
    } else {
      // Pre-populate shopping list from initial meals
      const initialDiet = savedDiet || 'Protein';
      const defaultMeals = INITIAL_MEALS_BY_DIET[initialDiet];
      const initialPlan = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
        (day, index) => ({
          day,
          dinner: defaultMeals[index] || null,
          eaten: false,
        })
      );
      const initialShopping = generateShoppingListFromPlan(initialPlan);
      setShoppingItems(initialShopping);
    }

    const savedHistory = localStorage.getItem('dinner_planner_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    } else {
      setHistory(SAMPLE_HISTORY);
    }
  }, []);

  // Save changes to local storage whenever state updates
  useEffect(() => {
    if (planDays.length > 0) {
      localStorage.setItem('dinner_planner_planDays', JSON.stringify(planDays));
    }
  }, [planDays]);

  useEffect(() => {
    if (shoppingItems.length > 0) {
      localStorage.setItem('dinner_planner_shopping', JSON.stringify(shoppingItems));
    } else if (shoppingItems.length === 0 && localStorage.getItem('dinner_planner_shopping')) {
      localStorage.setItem('dinner_planner_shopping', JSON.stringify([]));
    }
  }, [shoppingItems]);

  useEffect(() => {
    localStorage.setItem('dinner_planner_diet', selectedDiet);
  }, [selectedDiet]);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('dinner_planner_history', JSON.stringify(history));
    }
  }, [history]);

  // Helper: Aggregate Shopping Items from active meals
  const generateShoppingListFromPlan = (days: DailyPlan[]): ShoppingItem[] => {
    const list: ShoppingItem[] = [];
    let index = 0;
    days.forEach((dayPlan) => {
      if (dayPlan.dinner) {
        const meal = dayPlan.dinner;
        meal.ingredients.forEach((ing) => {
          let quantity = '1 unit';
          let name = ing;

          // Advanced extraction e.g. "200g Lean Chicken Breast" -> quantity: "200g", name: "Lean Chicken Breast"
          const match = ing.match(/^([\d\.]+(?:g|kg|ml|l|tbsp|tsp|cups|cup|slices|slice|cloves|clove|stalk|stalks|g)?(?:\s+of)?(?:\s+fresh)?)\s+(.*)$/i);
          if (match) {
            quantity = match[1];
            name = match[2];
          } else {
            const numMatch = ing.match(/^(\d+(?:\/\d+)?(?:\s*-\s*\d+)?)\s+(.*)$/);
            if (numMatch) {
              quantity = numMatch[1];
              name = numMatch[2];
            }
          }

          index++;
          list.push({
            id: `item-${index}-${Date.now()}`,
            name: name.trim(),
            quantity: quantity.trim(),
            category: 'Other',
            checked: false,
            mealName: `${dayPlan.day}'s ${meal.name.slice(0, 18)}...`,
          });
        });
      }
    });
    return list;
  };

  const handleToggleEaten = (dayName: string) => {
    setPlanDays((prev) =>
      prev.map((day) => (day.day === dayName ? { ...day, eaten: !day.eaten } : day))
    );
  };

  const handleUpdateMeal = (dayName: string, meal: Meal) => {
    setPlanDays((prev) =>
      prev.map((day) => {
        if (day.day === dayName) {
          return { ...day, dinner: meal, eaten: false };
        }
        return day;
      })
    );

    // Dynamic ingredient insertion to advance shopping list.
    // Insert new meal ingredients and keep unchecked custom ingredients.
    setShoppingItems((prevItems) => {
      const parsedNewIngredients = meal.ingredients.map((ing, i) => {
        let quantity = '1 unit';
        let name = ing;

        const match = ing.match(/^([\d\.]+(?:g|kg|ml|l|tbsp|tsp|cups|cup|slices|slice|cloves|clove|stalk|stalks|g)?(?:\s+of)?(?:\s+fresh)?)\s+(.*)$/i);
        if (match) {
          quantity = match[1];
          name = match[2];
        } else {
          const numMatch = ing.match(/^(\d+(?:\/\d+)?(?:\s*-\s*\d+)?)\s+(.*)$/);
          if (numMatch) {
            quantity = numMatch[1];
            name = numMatch[2];
          }
        }

        return {
          id: `item-dyn-${i}-${Date.now()}`,
          name: name.trim(),
          quantity: quantity.trim(),
          category: 'Other',
          checked: false,
          mealName: `${dayName}'s ${meal.name.slice(0, 18)}...`,
        };
      });

      // Filter out older ingredients belonging to this specific day's dinner
      const filteredPrev = prevItems.filter((item) => !item.mealName?.startsWith(`${dayName}'s`));
      return [...filteredPrev, ...parsedNewIngredients];
    });
  };

  const handleSelectDiet = (diet: DietType) => {
    setSelectedDiet(diet);
    // Reload defaults for the new diet
    const defaultMeals = INITIAL_MEALS_BY_DIET[diet];
    const newPlan = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
      (day, index) => ({
        day,
        dinner: defaultMeals[index] || null,
        eaten: false,
      })
    );
    setPlanDays(newPlan);

    const generatedShopping = generateShoppingListFromPlan(newPlan);
    setShoppingItems(generatedShopping);
  };

  const handleGenerateWeeklyPlan = async (customPrefs: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dietType: selectedDiet, customPreferences: customPrefs }),
      });

      if (!response.ok) {
        throw new Error('A network error occurred while communicating with Gemini API.');
      }

      const rawPlan = await response.json();
      if (!rawPlan.days || !Array.isArray(rawPlan.days)) {
        throw new Error('Invalid plan format returned from Gemini.');
      }

      // Format physical days
      const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const formattedCalendar: DailyPlan[] = daysOrder.map((dayName) => {
        const found = rawPlan.days.find((d: any) => d.day.toLowerCase() === dayName.toLowerCase());
        const mealDeets = found || rawPlan.days[daysOrder.indexOf(dayName)];
        
        return {
          day: dayName,
          dinner: mealDeets
            ? {
                name: mealDeets.name,
                calories: mealDeets.calories,
                protein: mealDeets.protein,
                carbs: mealDeets.carbs,
                fat: mealDeets.fat,
                ingredients: mealDeets.ingredients || [],
                instructions: mealDeets.instructions || '',
                source: 'ai',
              }
            : null,
          eaten: false,
        };
      });

      setPlanDays(formattedCalendar);

      // Re-populate shopping list from new plan ingredients
      const generatedShopping = generateShoppingListFromPlan(formattedCalendar);
      setShoppingItems(generatedShopping);
    } catch (err: any) {
      alert(err.message || 'Could not communicate with the backend AI module. Verify your API key configuration.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Archive week eating achievement
  const handleArchiveWeek = () => {
    const activeEatenDays = planDays.filter((d) => d.eaten);
    if (activeEatenDays.length === 0) return;

    // Construct a gorgeous calendar range label based on physical time
    const today = new Date();
    const endingLabel = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
    const startingLabel = sixDaysAgo.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const rangeString = `${startingLabel} - ${endingLabel}`;

    const formattedHistoryDays = planDays.map((d) => ({
      day: d.day,
      mealName: d.dinner?.name || 'No Meal Scheduled',
      calories: d.dinner?.calories || 0,
      protein: d.dinner?.protein || 0,
      carbs: d.dinner?.carbs || 0,
      fat: d.dinner?.fat || 0,
      eaten: d.eaten,
    }));

    const record: WeeklyHistoryRecord = {
      id: `hist-${Date.now()}`,
      weekRange: rangeString,
      dietType: selectedDiet,
      isCompleted: true,
      days: formattedHistoryDays,
    };

    setHistory((prev) => [record, ...prev]);

    // Reset current eaten track
    setPlanDays((prev) => prev.map((d) => ({ ...d, eaten: false })));

    alert('Current week sealed successfully! Statistics archived below on your progress tracker.');
  };

  // Shopping handlers
  const handleToggleShoppingItem = (id: string) => {
    setShoppingItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleAddShoppingItem = (name: string, quantity: string, category: string) => {
    const newItem: ShoppingItem = {
      id: `custom-item-${Date.now()}-${Math.random()}`,
      name,
      quantity,
      category,
      checked: false,
    };
    setShoppingItems((prev) => [newItem, ...prev]);
  };

  const handleRemoveShoppingItem = (id: string) => {
    setShoppingItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCheckedShoppingItems = () => {
    setShoppingItems((prev) => prev.filter((item) => !item.checked));
  };

  const handleRegenerateShoppingFromPlan = () => {
    const regenerated = generateShoppingListFromPlan(planDays);
    setShoppingItems(regenerated);
    alert('Shopping ingredients list synchronization succeeded!');
  };

  const eatenDinnersCount = planDays.filter((d) => d.eaten).length;

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Banner Warning for missing keys */}
      {configLoaded && !apiConfig.configured && (
        <div className="bg-amber-500 text-white px-4 py-2.5 text-center text-xs font-bold flex items-center justify-center gap-2 shadow-inner">
          <AlertTriangle className="w-4 h-4 shrink-0 fill-amber-100 text-amber-600 animate-bounce" />
          <span>
            API Key Missing: Setup your <strong>`GEMINI_API_KEY`</strong> in <strong>Settings &gt; Secrets</strong> to enable live customized AI dynamic plan generation. Falling back to preloaded diet guidelines for previews.
          </span>
        </div>
      )}

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-md">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
                AI Dinner Planner
                <span className="text-xs font-medium text-slate-400 font-mono hidden sm:inline">v1.2</span>
              </h1>
              <p className="text-xs text-slate-500">
                Caloric, protein & macronutrient proportion manager.
              </p>
            </div>
          </div>

          {/* Quick Stats Header Summary */}
          <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200/60 flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              <div>
                <span className="text-slate-400 block text-[9px] leading-tight uppercase font-bold">Target</span>
                <span className="text-slate-800 font-bold font-mono">{targetCalories} kcal</span>
              </div>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4 text-indigo-500" />
              <div>
                <span className="text-slate-400 block text-[9px] leading-tight uppercase font-bold">Protein Target</span>
                <span className="text-slate-800 font-bold font-mono">{targetProtein}g</span>
              </div>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              <div>
                <span className="text-slate-400 block text-[9px] leading-tight uppercase font-bold">Eaten Track</span>
                <span className="text-slate-800 font-bold font-mono">{eatenDinnersCount} / 7 days</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Core Body Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Diet Selection Carousel Spacer */}
        <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <DietSelector selectedDiet={selectedDiet} onSelectDiet={handleSelectDiet} />
        </section>

        {/* Tabs Control Row */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('plan')}
            id="tab-plan-btn"
            className={`py-3 px-4 font-bold text-xs flex items-center gap-1.5 border-b-2 tracking-tight transition cursor-pointer ${
              activeTab === 'plan'
                ? 'border-indigo-600 text-indigo-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Weekly Dinner Plan
          </button>
          
          <button
            onClick={() => setActiveTab('shop')}
            id="tab-shop-btn"
            className={`py-3 px-4 font-bold text-xs flex items-center gap-1.5 border-b-2 tracking-tight transition cursor-pointer ${
              activeTab === 'shop'
                ? 'border-indigo-600 text-indigo-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <ShoppingBasket className="w-4 h-4" />
            Advance Shopping List
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            id="tab-insights-btn"
            className={`py-3 px-4 font-bold text-xs flex items-center gap-1.5 border-b-2 tracking-tight transition cursor-pointer ${
              activeTab === 'insights'
                ? 'border-indigo-600 text-indigo-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            History & Calorie Tracker
          </button>

          <button
            onClick={() => setActiveTab('deploy')}
            id="tab-deploy-btn"
            className={`py-3 px-4 font-bold text-xs flex items-center gap-1.5 border-b-2 tracking-tight transition cursor-pointer ${
              activeTab === 'deploy'
                ? 'border-indigo-600 text-indigo-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <QrCode className="w-4 h-4" />
            Vercel Access & QR Code
          </button>
        </div>

        {/* Active View Switching */}
        <section className="space-y-4">
          {activeTab === 'plan' && (
            <DinnerPlanList
              days={planDays}
              dietType={selectedDiet}
              onToggleEaten={handleToggleEaten}
              onUpdateMeal={handleUpdateMeal}
              onGeneratePlan={handleGenerateWeeklyPlan}
              isGenerating={isGenerating}
            />
          )}

          {activeTab === 'shop' && (
            <ShoppingList
              items={shoppingItems}
              onToggleItem={handleToggleShoppingItem}
              onAddItem={handleAddShoppingItem}
              onRemoveItem={handleRemoveShoppingItem}
              onClearChecked={handleClearCheckedShoppingItems}
              onRegenerateFromPlan={handleRegenerateShoppingFromPlan}
            />
          )}

          {activeTab === 'insights' && (
            <NutritionDashboard
              days={planDays}
              dietType={selectedDiet}
              history={history}
              targetCalories={targetCalories}
              targetProtein={targetProtein}
              onArchiveWeek={handleArchiveWeek}
              isArchiveDisabled={eatenDinnersCount === 0}
            />
          )}

          {activeTab === 'deploy' && (
            <QRCodeInstructions sharedUrl={apiConfig.appUrl} />
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:flex sm:justify-between sm:items-center space-y-2 sm:space-y-0 text-xs text-slate-400">
          <p>© 2026 AI Dinner Planner & Nutrient Tracker. All Rights Reserved.</p>
          <p className="font-mono">Created with Gemini 3.5-flash & Antigravity</p>
        </div>
      </footer>

    </div>
  );
}
