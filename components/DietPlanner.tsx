
import React, { useState } from 'react';
import { Meal, UserProfile } from '../types';
import { generateMealPlan } from '../services/geminiService';

interface DietPlannerProps {
  meals: Meal[];
  setMeals: React.Dispatch<React.SetStateAction<Meal[]>>;
  profile: UserProfile;
}

const DietPlanner: React.FC<DietPlannerProps> = ({ meals, setMeals, profile }) => {
  const [loading, setLoading] = useState(false);
  const [aiMeals, setAiMeals] = useState<any[]>([]);
  
  // Manual Entry State
  const [manualName, setManualName] = useState('');
  const [manualCals, setManualCals] = useState('');
  const [manualProtein, setManualProtein] = useState('');

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const plan = await generateMealPlan(profile);
      setAiMeals(plan.meals || []);
    } catch (err) {
      console.error("Failed to generate plan", err);
    } finally {
      setLoading(false);
    }
  };

  const addManualMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualCals) return;

    const newMeal: Meal = {
      id: Math.random().toString(),
      name: manualName,
      calories: parseInt(manualCals),
      protein: parseInt(manualProtein) || 0,
      carbs: 0,
      fats: 0,
      time: new Date().toISOString(),
      completed: false
    };

    setMeals([...meals, newMeal]);
    setManualName('');
    setManualCals('');
    setManualProtein('');
  };

  const addMealFromAI = (m: any) => {
    const newMeal: Meal = {
      id: Math.random().toString(),
      name: m.name,
      calories: m.calories,
      protein: m.protein,
      carbs: m.carbs || 0,
      fats: m.fats || 0,
      time: new Date().toISOString(),
      completed: false
    };
    setMeals([...meals, newMeal]);
  };

  const toggleMealCompletion = (id: string) => {
    setMeals(prev => prev.map(m => 
      m.id === id ? { ...m, completed: !m.completed } : m
    ));
  };

  const removeMeal = (id: string) => {
    setMeals(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-black">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-black">Nutrition Hub</h2>
          <p className="text-sm text-black opacity-60">Track your intake and get AI-powered meal plans.</p>
        </div>
        <button 
          onClick={handleGeneratePlan}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all"
        >
          {loading ? (
            <i className="fa-solid fa-circle-notch animate-spin"></i>
          ) : (
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          )}
          Generate AI Daily Plan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Manual Entry & History */}
        <div className="lg:col-span-7 space-y-6">
          {/* Manual Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2">
              <i className="fa-solid fa-plus-circle text-indigo-500"></i>
              Log a Meal
            </h3>
            <form onSubmit={addManualMeal} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input 
                type="text" 
                placeholder="Food name..."
                className="sm:col-span-2 bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-black"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
              />
              <input 
                type="number" 
                placeholder="Cals"
                className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-black"
                value={manualCals}
                onChange={(e) => setManualCals(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-slate-900 text-white p-3 rounded-xl text-xs font-bold hover:bg-black transition-colors"
              >
                Add Meal
              </button>
            </form>
          </div>

          {/* Log History */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-black opacity-50 uppercase tracking-widest px-1">Today's Log</h3>
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              {meals.length === 0 ? (
                <div className="p-16 text-center text-black opacity-40 italic">
                   <i className="fa-solid fa-utensils text-4xl mb-4 opacity-20"></i>
                   <p>No meals logged today yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {meals.slice().reverse().map(m => (
                    <div key={m.id} className={`flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors group ${m.completed ? 'bg-emerald-50/30' : ''}`}>
                      <button 
                        onClick={() => toggleMealCompletion(m.id)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          m.completed 
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100' 
                          : 'bg-white border-slate-200 text-transparent hover:border-indigo-400'
                        }`}
                        title={m.completed ? "Mark as not completed" : "Mark as completed"}
                      >
                        <i className="fa-solid fa-check text-xs"></i>
                      </button>
                      
                      <div className="flex-1">
                        <p className={`font-bold transition-all ${m.completed ? 'line-through text-black opacity-40' : 'text-black'}`}>
                          {m.name}
                        </p>
                        <p className="text-[10px] text-black opacity-60 font-medium">
                          {new Date(m.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                          {m.protein ? ` • ${m.protein}g Protein` : ''}
                        </p>
                      </div>

                      <div className="text-right flex items-center gap-4">
                        <div className={`px-3 py-1 rounded-lg text-xs font-black ${m.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-50 text-indigo-700'}`}>
                          {m.calories} kcal
                        </div>
                        <button 
                          onClick={() => removeMeal(m.id)}
                          className="w-8 h-8 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: AI Recommendations */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-black opacity-50 uppercase tracking-widest">AI Suggestions</h3>
            {aiMeals.length > 0 && (
              <button onClick={() => setAiMeals([])} className="text-[10px] font-bold text-indigo-600 hover:underline">Clear</button>
            )}
          </div>
          
          {aiMeals.length > 0 ? (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
              {aiMeals.map((m, i) => (
                <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-3 group border-l-4 border-l-indigo-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-black">{m.name}</h4>
                      <p className="text-xs text-black opacity-60 mt-1 leading-snug">{m.description}</p>
                    </div>
                    <button 
                      onClick={() => addMealFromAI(m)}
                      className="w-10 h-10 rounded-xl bg-slate-900 text-white hover:bg-indigo-600 transition-all flex items-center justify-center shadow-md"
                      title="Add to log"
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-lg">{m.calories} kcal</span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-lg">{m.protein}g P</span>
                    <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-2.5 py-1 rounded-lg">{m.carbs}g C</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center bg-white rounded-3xl border border-dashed border-slate-200">
               <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                 <i className="fa-solid fa-sparkles"></i>
               </div>
               <p className="text-black opacity-50 text-xs font-medium px-4">Click "Generate AI Daily Plan" to see personalized meals based on your {profile.goal.replace('_', ' ')} goal.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DietPlanner;