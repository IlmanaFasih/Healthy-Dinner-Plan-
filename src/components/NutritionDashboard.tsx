import { useMemo } from 'react';
import { DailyPlan, DietType, WeeklyHistoryRecord } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
} from 'recharts';
import { Award, Flame, Dumbbell, Compass, RefreshCw, Archive, CheckCircle2, AlertCircle } from 'lucide-react';

interface NutritionDashboardProps {
  days: DailyPlan[];
  dietType: DietType;
  history: WeeklyHistoryRecord[];
  targetCalories: number;
  targetProtein: number;
  onArchiveWeek: () => void;
  isArchiveDisabled: boolean;
}

export default function NutritionDashboard({
  days,
  dietType,
  history,
  targetCalories,
  targetProtein,
  onArchiveWeek,
  isArchiveDisabled,
}: NutritionDashboardProps) {
  // Aggregate current week eating statistics
  const currentWeekStats = useMemo(() => {
    let totalPlannedCal = 0;
    let totalEatenCal = 0;
    let totalPlannedProtein = 0;
    let totalEatenProtein = 0;
    let daysEaten = 0;

    days.forEach((d) => {
      if (d.dinner) {
        totalPlannedCal += d.dinner.calories;
        totalPlannedProtein += d.dinner.protein;
        if (d.eaten) {
          totalEatenCal += d.dinner.calories;
          totalEatenProtein += d.dinner.protein;
          daysEaten++;
        }
      }
    });

    return {
      totalPlannedCal,
      totalEatenCal,
      totalPlannedProtein,
      totalEatenProtein,
      daysEaten,
      avgDailyEatenCal: daysEaten > 0 ? Math.round(totalEatenCal / daysEaten) : 0,
      avgDailyEatenProtein: daysEaten > 0 ? Math.round(totalEatenProtein / daysEaten) : 0,
    };
  }, [days]);

  // Format historical records for the Recharts graphs
  const chartData = useMemo(() => {
    return history.map((record) => {
      const activeDays = record.days.filter((d) => d.eaten);
      const avgCal = activeDays.length > 0 ? Math.round(activeDays.reduce((acc, curr) => acc + curr.calories, 0) / activeDays.length) : 0;
      const avgProt = activeDays.length > 0 ? Math.round(activeDays.reduce((acc, curr) => acc + curr.protein, 0) / activeDays.length) : 0;
      
      return {
        name: record.weekRange,
        'Avg Calories': avgCal,
        'Avg Protein': avgProt,
        'Target Calories': targetCalories,
        'Target Protein': targetProtein,
      };
    });
  }, [history, targetCalories, targetProtein]);

  const caloriesPercent = targetCalories > 0 ? Math.round((currentWeekStats.avgDailyEatenCal / targetCalories) * 100) : 0;
  const proteinPercent = targetProtein > 0 ? Math.round((currentWeekStats.avgDailyEatenProtein / targetProtein) * 100) : 0;

  return (
    <div id="nutrition-dashboard-root" className="space-y-6">
      
      {/* Current Week Achievement Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Calorie Progress */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Calorie Average</span>
            <Flame className="w-5 h-5 text-amber-500 fill-amber-100" />
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-slate-800 font-mono">
              {currentWeekStats.avgDailyEatenCal}
            </span>
            <span className="text-xs text-slate-400 ml-1">kcal / day eaten</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Goal: {targetCalories} kcal</span>
              <span className="font-semibold font-mono">{caloriesPercent}% Achieved</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all"
                style={{ width: `${Math.min(caloriesPercent, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Protein Progress */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">Active Protein Average</span>
            <Dumbbell className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-slate-800 font-mono">
              {currentWeekStats.avgDailyEatenProtein}
            </span>
            <span className="text-xs text-slate-400 ml-1">g / day eaten</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Goal: {targetProtein}g</span>
              <span className="font-semibold font-mono">{proteinPercent}% Achieved</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden flex">
              <div
                className="bg-indigo-500 h-full transition-all"
                style={{ width: `${Math.min(proteinPercent, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Tracker & Archiving */}
        <div className="bg-gradient-to-br from-indigo-50 to-slate-50 rounded-2xl border border-indigo-100 p-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <h4 className="font-bold text-slate-800 text-sm">Seal Current Week</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Once you finish eating your dinners, archive the week! This saves your calorie and protein averages to your visual historical tracking chart and preps you for next week.
            </p>
          </div>

          <button
            id="archive-week-btn"
            disabled={isArchiveDisabled}
            onClick={onArchiveWeek}
            className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Archive className="w-4 h-4" />
            Archive Week & Reset Tracker
          </button>
          
          {isArchiveDisabled && (
            <span className="block text-[10px] text-slate-400 text-center mt-1.5 flex items-center justify-center gap-0.5">
              <AlertCircle className="w-3 h-3 text-amber-500" /> Mark dinners as 'eaten' first to archive
            </span>
          )}
        </div>

      </div>

      {/* Historical Trackers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Historical Caloric Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Weekly Average Caloric Intake</h4>
            <p className="text-xs text-slate-400">Tracks daily average ingested energy vs target metrics.</p>
          </div>

          <div className="h-68 w-full" id="calories-history-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[0, 'auto']} />
                <Tooltip contentStyle={{ background: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Bar dataKey="Avg Calories" fill="#fbbf24" radius={[4, 4, 0, 0]} name="Eaten (kcal)" />
                <ReferenceLine y={targetCalories} stroke="#ea580c" strokeDasharray="4 4" label={{ value: 'Target', position: 'insideTopLeft', fill: '#ea580c', fontSize: '8px' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Historical Protein Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Weekly Average Protein Intake Progress</h4>
            <p className="text-xs text-slate-400">Tracks average protein block absorption against targets.</p>
          </div>

          <div className="h-68 w-full" id="protein-history-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[0, 'auto']} />
                <Tooltip contentStyle={{ background: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Avg Protein" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Eaten Protein (g)" />
                <ReferenceLine y={targetProtein} stroke="#4f46e5" strokeDasharray="4 4" label={{ value: 'Target', position: 'insideTopLeft', fill: '#4f46e5', fontSize: '8px' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
