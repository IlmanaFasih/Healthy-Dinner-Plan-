import { useState } from 'react';
import { DailyPlan, DietType, Meal, ShoppingItem } from '../types';
import { Sparkles, Check, Edit2, Play, ChevronDown, ChevronUp, Plus, Loader2, ArrowRight, Utensils, HelpCircle } from 'lucide-react';

interface DinnerPlanListProps {
  days: DailyPlan[];
  dietType: DietType;
  onToggleEaten: (day: string) => void;
  onUpdateMeal: (day: string, meal: Meal) => void;
  onGeneratePlan: (customPrefs: string) => Promise<void>;
  isGenerating: boolean;
}

export default function DinnerPlanList({
  days,
  dietType,
  onToggleEaten,
  onUpdateMeal,
  onGeneratePlan,
  isGenerating,
}: DinnerPlanListProps) {
  const [expandedDay, setExpandedDay] = useState<string | null>('Monday');
  const [customPreferences, setCustomPreferences] = useState('');
  const [customMealInput, setCustomMealInput] = useState<Record<string, string>>({});
  const [analyzingDay, setAnalyzingDay] = useState<string | null>(null);
  const [analyzingError, setAnalyzingError] = useState<string | null>(null);
  const [showPrefPanel, setShowPrefPanel] = useState(false);

  const calculateMacroPercentages = (meal: Meal) => {
    const pCal = meal.protein * 4;
    const cCal = meal.carbs * 4;
    const fCal = meal.fat * 9;
    const totalCal = pCal + cCal + fCal;
    if (totalCal === 0) return { proteinP: 0, carbsP: 0, fatP: 0 };
    return {
      proteinP: Math.round((pCal / totalCal) * 100),
      carbsP: Math.round((cCal / totalCal) * 100),
      fatP: Math.round((fCal / totalCal) * 100),
    };
  };

  const handleCustomMealSubmit = async (dayName: string) => {
    const userInput = customMealInput[dayName]?.trim();
    if (!userInput) return;

    setAnalyzingDay(dayName);
    setAnalyzingError(null);

    try {
      const response = await fetch('/api/analyze-custom-dinner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealName: userInput, dietType }),
      });

      if (!response.ok) {
        throw new Error('Could not analyze dinner nutrients. Please check your network.');
      }

      const analyzedMeal = await response.json();
      
      const newMeal: Meal = {
        name: analyzedMeal.name,
        calories: analyzedMeal.calories,
        protein: analyzedMeal.protein,
        carbs: analyzedMeal.carbs,
        fat: analyzedMeal.fat,
        ingredients: analyzedMeal.ingredients,
        instructions: analyzedMeal.instructions,
        source: 'user',
      };

      onUpdateMeal(dayName, newMeal);
      setCustomMealInput((prev) => ({ ...prev, [dayName]: '' }));
    } catch (err: any) {
      console.error(err);
      setAnalyzingError(err.message || 'Error communicating with AI services.');
    } finally {
      setAnalyzingDay(null);
    }
  };

  const executeWeeklyGeneration = () => {
    onGeneratePlan(customPreferences);
  };

  return (
    <div id="dinner-plan-list-root" className="space-y-6">
      {/* AI Controls Header */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500 fill-indigo-100" />
              AI Meal Architect
            </h3>
            <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
              <span>Generate a personalized 7-day culinary track based on your {dietType} requirements.</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider">
                🚫 Pork-Free
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              id="toggle-pref-panel-btn"
              onClick={() => setShowPrefPanel(!showPrefPanel)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
            >
              {showPrefPanel ? 'Hide Settings' : 'Customize Ingredients / Prompt'}
            </button>
            <button
              id="generate-ai-plan-btn"
              disabled={isGenerating}
              onClick={executeWeeklyGeneration}
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Formulating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Build Weekly Plan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Custom Preferences input */}
        {showPrefPanel && (
          <div className="mt-4 pt-4 border-t border-slate-200/60 space-y-3">
            <label className="block text-xs font-bold text-slate-700">Custom Preferences (Allergies, Likes, Exclusions)</label>
            <textarea
              id="custom-preferences-input"
              value={customPreferences}
              onChange={(e) => setCustomPreferences(e.target.value)}
              placeholder="e.g., 'Make it budget friendly', 'no mushrooms', 'include lots of garlic and citrus', 'high protein seafood'"
              className="w-full h-16 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
            />
            <p className="text-[10px] text-slate-400">
              * Note: The AI will strictly keep meals compatible with your selected {dietType} requirements. <strong>Pork is globally excluded by default.</strong>
            </p>
          </div>
        )}
      </div>

      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-12 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <h4 className="font-semibold text-slate-700 text-sm">Drafting customized recipes...</h4>
          <p className="text-xs text-slate-400 text-center max-w-sm px-6">
            Gemini is compiling 7 complete dinner recipes with calories, ingredients and nutrition stats. This may take up to 20 seconds.
          </p>
        </div>
      )}

      {!isGenerating && (
        <div className="space-y-3">
          {days.map((dayPlan) => {
            const isExpanded = expandedDay === dayPlan.day;
            const hasDinner = !!dayPlan.dinner;
            const meal = dayPlan.dinner;
            const macros = meal ? calculateMacroPercentages(meal) : null;

            return (
              <div
                key={dayPlan.day}
                id={`day-card-${dayPlan.day.toLowerCase()}`}
                className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                  dayPlan.eaten ? 'border-emerald-200 shadow-none' : 'border-slate-200 shadow-sm'
                }`}
              >
                {/* Header Row */}
                <div
                  className={`flex items-center justify-between p-4 cursor-pointer gap-3 select-none ${
                    dayPlan.eaten ? 'bg-emerald-50/45' : 'hover:bg-slate-50/50'
                  }`}
                  onClick={() => setExpandedDay(isExpanded ? null : dayPlan.day)}
                >
                  <div className="flex items-center gap-3">
                    <button
                      id={`eaten-toggle-${dayPlan.day}`}
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid expanding card
                        onToggleEaten(dayPlan.day);
                      }}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                        dayPlan.eaten
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 hover:border-slate-400 bg-white'
                      }`}
                    >
                      {dayPlan.eaten && <Check className="w-4 h-4 stroke-[3px]" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800">{dayPlan.day}</span>
                        {dayPlan.eaten && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                            EATEN
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs text-slate-500 line-clamp-1 max-w-[200px] sm:max-w-md">
                        {hasDinner ? meal!.name : 'No dinner scheduled'}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {hasDinner && (
                      <div className="hidden sm:flex items-center gap-3 text-right">
                        <div>
                          <span className="text-xs font-bold text-slate-800 font-mono">{meal!.calories}</span>
                          <span className="text-[10px] text-slate-400 ml-0.5">kcal</span>
                        </div>
                        <div className="h-6 w-px bg-slate-200" />
                        <div>
                          <span className="text-xs font-bold text-indigo-600 font-mono">{meal!.protein}g</span>
                          <span className="text-[10px] text-slate-400 ml-0.5">P</span>
                        </div>
                      </div>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/40 p-4 space-y-4">
                    {/* Nutritional values & proportions header */}
                    {hasDinner && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div className="bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm text-center">
                            <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Calories</span>
                            <span className="font-mono text-base font-bold text-slate-800">{meal!.calories} kcal</span>
                          </div>
                          <div className="bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm text-center">
                            <span className="block text-[10px] text-indigo-400 uppercase font-bold tracking-wider">Protein</span>
                            <span className="font-mono text-base font-bold text-indigo-600">{meal!.protein}g</span>
                            <span className="text-[9px] block text-slate-400 leading-none">({macros?.proteinP}%)</span>
                          </div>
                          <div className="bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm text-center">
                            <span className="block text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Carbs</span>
                            <span className="font-mono text-base font-bold text-emerald-600">{meal!.carbs}g</span>
                            <span className="text-[9px] block text-slate-400 leading-none">({macros?.carbsP}%)</span>
                          </div>
                          <div className="bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm text-center">
                            <span className="block text-[10px] text-amber-400 uppercase font-bold tracking-wider">Fats</span>
                            <span className="font-mono text-base font-bold text-amber-600">{meal!.fat}g</span>
                            <span className="text-[9px] block text-slate-400 leading-none">({macros?.fatP}%)</span>
                          </div>
                        </div>

                        {/* Custom visual proportion ribbon */}
                        {macros && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] text-slate-400 font-semibold px-0.5">
                              <span>Energy Balance</span>
                              <span>P: {macros.proteinP}% / C: {macros.carbsP}% / F: {macros.fatP}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden flex">
                              <div
                                className="bg-indigo-500 h-full transition-all"
                                style={{ width: `${macros.proteinP}%` }}
                                title={`Protein: ${macros.proteinP}%`}
                              />
                              <div
                                className="bg-emerald-500 h-full transition-all"
                                style={{ width: `${macros.carbsP}%` }}
                                title={`Carbs: ${macros.carbsP}%`}
                              />
                              <div
                                className="bg-amber-500 h-full transition-all"
                                style={{ width: `${macros.fatP}%` }}
                                title={`Fats: ${macros.fatP}%`}
                              />
                            </div>
                          </div>
                        )}

                        {/* Ingredients */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-2">
                            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ingredients (1 serving)</h5>
                            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                              {meal!.ingredients.map((ingredient, i) => (
                                <li key={i}>{ingredient}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Instructions */}
                          <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-2">
                            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Preparation Details</h5>
                            <p className="text-xs text-slate-600 leading-relaxed italic">
                              {meal!.instructions || 'Simply assemble the fresh ingredients described.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Meal custom editor input */}
                    <div className="bg-white/70 rounded-xl border border-slate-200/60 p-4 space-y-3">
                      <div>
                        <h5 className="text-xs font-bold text-slate-700">Enter Dinner of Your Choice</h5>
                        <p className="text-[10px] text-slate-400">Enter what you prefer to eat; Gemini AI will analyze and populate details.</p>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          id={`custom-input-${dayPlan.day}`}
                          value={customMealInput[dayPlan.day] || ''}
                          onChange={(e) =>
                            setCustomMealInput((prev) => ({ ...prev, [dayPlan.day]: e.target.value }))
                          }
                          disabled={analyzingDay === dayPlan.day}
                          placeholder="e.g. Grilled seabass with avocado salad, lemon wedges, and roast potatoes"
                          className="flex-grow px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                        />
                        <button
                          id={`submit-custom-${dayPlan.day}`}
                          disabled={analyzingDay === dayPlan.day || !customMealInput[dayPlan.day]?.trim()}
                          onClick={() => handleCustomMealSubmit(dayPlan.day)}
                          className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                        >
                          {analyzingDay === dayPlan.day ? (
                            <>
                              <Loader2 className="w-3 animate-spin" />
                              AI Parsing...
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              Submit Choice
                            </>
                          )}
                        </button>
                      </div>

                      {analyzingError && analyzingDay === dayPlan.day && (
                        <p className="text-[10px] text-rose-500 font-semibold">{analyzingError}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
