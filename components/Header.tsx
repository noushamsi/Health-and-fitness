
import React from 'react';
import { Tab } from '../types';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 vertex-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <i className="fa-solid fa-check-double text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">VERTEX</h1>
            <p className="text-[10px] font-semibold text-indigo-600 tracking-widest uppercase">Health & Fitness</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`font-semibold text-sm transition-colors ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-500'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('workouts')}
            className={`font-semibold text-sm transition-colors ${activeTab === 'workouts' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-500'}`}
          >
            Workouts
          </button>
          <button 
            onClick={() => setActiveTab('diet')}
            className={`font-semibold text-sm transition-colors ${activeTab === 'diet' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-500'}`}
          >
            Diet Plans
          </button>
          <button 
            onClick={() => setActiveTab('coach')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-bolt"></i>
            Ask AI Coach
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
            <i className="fa-solid fa-bell text-sm"></i>
          </button>
          <img 
            src="https://picsum.photos/seed/vertex/40" 
            alt="User" 
            className="w-8 h-8 rounded-full border border-indigo-200"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
