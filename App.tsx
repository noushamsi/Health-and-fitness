
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import WorkoutTracker from './components/WorkoutTracker';
import DietPlanner from './components/DietPlanner';
import AICoach from './components/AICoach';
import { Tab, Workout, Meal, UserProfile } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem('vertex_workouts');
    return saved ? JSON.parse(saved) : [];
  });
  const [meals, setMeals] = useState<Meal[]>(() => {
    const saved = localStorage.getItem('vertex_meals');
    return saved ? JSON.parse(saved) : [];
  });
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('vertex_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Intern',
      age: 22,
      weight: 75,
      height: 175,
      goal: 'muscle_gain'
    };
  });

  useEffect(() => {
    localStorage.setItem('vertex_workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('vertex_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('vertex_profile', JSON.stringify(profile));
  }, [profile]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard workouts={workouts} meals={meals} profile={profile} />;
      case 'workouts':
        return <WorkoutTracker workouts={workouts} setWorkouts={setWorkouts} />;
      case 'diet':
        return <DietPlanner meals={meals} setMeals={setMeals} profile={profile} />;
      case 'coach':
        return <AICoach profile={profile} />;
      default:
        return <Dashboard workouts={workouts} meals={meals} profile={profile} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-0 md:pl-0">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
        <div className="animate-in fade-in duration-500">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 md:hidden z-50">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <i className="fa-solid fa-chart-line text-lg"></i>
          <span className="text-[10px] font-medium">Progress</span>
        </button>
        <button 
          onClick={() => setActiveTab('workouts')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'workouts' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <i className="fa-solid fa-dumbbell text-lg"></i>
          <span className="text-[10px] font-medium">Workouts</span>
        </button>
        <button 
          onClick={() => setActiveTab('diet')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'diet' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <i className="fa-solid fa-utensils text-lg"></i>
          <span className="text-[10px] font-medium">Diet</span>
        </button>
        <button 
          onClick={() => setActiveTab('coach')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'coach' ? 'text-indigo-600' : 'text-slate-400'}`}
        >
          <i className="fa-solid fa-robot text-lg"></i>
          <span className="text-[10px] font-medium">AI Coach</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
