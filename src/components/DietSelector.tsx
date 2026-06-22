import { DIETS, DietDetails } from '../data';
import { DietType } from '../types';
import { Dumbbell, Flame, Wheat, Activity, Leaf, Utensils, Salad, Fish } from 'lucide-react';

interface DietSelectorProps {
  selectedDiet: DietType;
  onSelectDiet: (diet: DietType) => void;
}

export default function DietSelector({ selectedDiet, onSelectDiet }: DietSelectorProps) {
  const getDietIcon = (type: DietType) => {
    switch (type) {
      case 'Protein':
        return <Dumbbell className="w-5 h-5 text-indigo-500" />;
      case 'Keto':
        return <Flame className="w-5 h-5 text-amber-500" />;
      case 'Mediterranean':
        return <Fish className="w-5 h-5 text-emerald-500" />;
      case 'Diabetic':
        return <Activity className="w-5 h-5 text-rose-500" />;
      case 'Vegetarian':
        return <Salad className="w-5 h-5 text-teal-500" />;
      case 'Vegan':
        return <Leaf className="w-5 h-5 text-green-500" />;
      case 'Pescatarian':
        return <Fish className="w-5 h-5 text-sky-500" />;
      default:
        return <Utensils className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div id="diet-selector-container" className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h2 id="diet-selector-title" className="text-xl font-bold tracking-tight text-slate-800">Choose Diet Type</h2>
          <p className="text-xs text-slate-500">Pick a nutrition framework to target your weekly calorie and macro goals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DIETS.map((diet) => {
          const isSelected = selectedDiet === diet.type;
          return (
            <button
              key={diet.type}
              id={`diet-btn-${diet.type.toLowerCase()}`}
              onClick={() => onSelectDiet(diet.type)}
              className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer relative overflow-hidden ${
                isSelected
                  ? `border-2 bg-white ring-2 ring-offset-2 ${diet.borderColor} shadow-sm`
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {isSelected && (
                <div className={`absolute top-0 right-0 w-8 h-8 rounded-bl-xl flex items-center justify-center ${diet.bgColor}`}>
                  <span className={`text-[10px] font-bold ${diet.textColor}`}>✓</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${isSelected ? diet.bgColor : 'bg-slate-50'}`}>
                  {getDietIcon(diet.type)}
                </div>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${diet.badgeColor}`}>
                  {diet.type}
                </span>
              </div>

              <h3 className="font-semibold text-slate-800 text-sm leading-tight mb-1">{diet.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-3 flex-grow mb-3">{diet.description}</p>
              
              <div className="border-t border-dashed border-slate-100 pt-2 w-full mt-auto">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-mono">P: {diet.targetProteinPercent}%</span>
                  <span className="font-mono">C: {diet.targetCarbsPercent}%</span>
                  <span className="font-mono">F: {diet.targetFatPercent}%</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
