
import React from 'react';
import { Workout, Meal, UserProfile } from '../types';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';

interface DashboardProps {
  workouts: Workout[];
  meals: Meal[];
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ workouts, meals, profile }) => {
  const last7DaysMeals = meals.slice(-7).map(m => ({
    name: m.time.split('T')[0],
    calories: m.calories
  }));

  const totalCaloriesToday = meals
    .filter(m => m.time.startsWith(new Date().toISOString().split('T')[0]) && m.completed)
    .reduce((sum, m) => sum + m.calories, 0);

  const calorieGoal = profile.goal === 'weight_loss' ? 2000 : profile.goal === 'muscle_gain' ? 2800 : 2400;
  const caloriePercent = Math.min(Math.round((totalCaloriesToday / calorieGoal) * 100), 100);

  return (
    <div className="space-y-6 text-black">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-black uppercase tracking-wider mb-4">Your Profile</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl vertex-gradient p-1">
                 <img src="https://picsum.photos/seed/vertex/100" className="w-full h-full object-cover rounded-xl" alt="profile" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black">{profile.name}</h3>
                <p className="text-sm text-black opacity-70">{profile.goal.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-2xl">
              <p className="text-[10px] font-bold text-black uppercase">Weight</p>
              <p className="text-lg font-bold text-indigo-600">{profile.weight} kg</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl">
              <p className="text-[10px] font-bold text-black uppercase">Height</p>
              <p className="text-lg font-bold text-indigo-600">{profile.height} cm</p>
            </div>
          </div>
        </div>

        {/* Daily Progress */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm md:col-span-2">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider mb-4">Daily Calorie Intake (Completed)</h2>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-black text-black">{totalCaloriesToday} / {calorieGoal}</p>
              <p className="text-sm text-black opacity-70">kcal consumed today</p>
            </div>
            <div className="relative w-20 h-20">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="stroke-slate-100"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="stroke-emerald-500 transition-all duration-1000"
                  strokeWidth="3"
                  strokeDasharray={`${caloriePercent}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-emerald-600">
                {caloriePercent}%
              </div>
            </div>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7DaysMeals.length ? last7DaysMeals : [{name: 'Today', calories: 0}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" hide />
                <Tooltip />
                <Bar dataKey="calories" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workout Activity */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">Recent Workouts</h2>
            <span className="text-xs font-bold text-indigo-600 cursor-pointer">View All</span>
          </div>
          <div className="space-y-4">
            {workouts.length === 0 ? (
              <p className="text-black opacity-50 text-sm italic">No workouts logged yet.</p>
            ) : (
              workouts.slice(-3).reverse().map(w => (
                <div key={w.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${w.completed ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${w.completed ? 'bg-emerald-500 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                    {w.completed ? <i className="fa-solid fa-check text-xl"></i> : <i className="fa-solid fa-dumbbell text-xl"></i>}
                  </div>
                  <div>
                    <h4 className={`font-bold ${w.completed ? 'text-emerald-800' : 'text-black'}`}>{w.name}</h4>
                    <p className="text-xs text-black opacity-60">{new Date(w.date).toLocaleDateString()}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className={`text-xs font-bold ${w.completed ? 'text-emerald-600' : 'text-indigo-600'}`}>{w.exercises.length} Exercises</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Weight Trend */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider mb-6">Weight Progression</h2>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{day: 'Mon', weight: 74}, {day: 'Wed', weight: 74.5}, {day: 'Fri', weight: 74.2}, {day: 'Sun', weight: profile.weight}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;