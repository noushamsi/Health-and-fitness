
import React, { useState } from 'react';
import { Workout, Exercise } from '../types';

interface WorkoutTrackerProps {
  workouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
}

const WorkoutTracker: React.FC<WorkoutTrackerProps> = ({ workouts, setWorkouts }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [exercises, setExercises] = useState<Partial<Exercise>[]>([]);

  const handleAddExercise = () => {
    setExercises([...exercises, { id: Math.random().toString(), name: '', sets: 0, reps: 0, weight: 0 }]);
  };

  const handleSaveWorkout = () => {
    if (!newWorkoutName) return;
    const newWorkout: Workout = {
      id: Math.random().toString(),
      name: newWorkoutName,
      date: new Date().toISOString(),
      exercises: exercises as Exercise[],
      completed: false
    };
    setWorkouts([...workouts, newWorkout]);
    setIsAdding(false);
    setNewWorkoutName('');
    setExercises([]);
  };

  const toggleWorkoutCompletion = (id: string) => {
    setWorkouts(prev => prev.map(w => 
      w.id === id ? { ...w, completed: !w.completed } : w
    ));
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-black">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-black">Training Lab</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="vertex-gradient text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <i className="fa-solid fa-plus"></i> New Session
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-3xl border-2 border-indigo-100 shadow-xl space-y-4 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-black">Record New Workout</h3>
            <button onClick={() => setIsAdding(false)} className="text-black opacity-40 hover:opacity-100">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
          
          <input 
            type="text" 
            placeholder="Session Name (e.g., Push Day)"
            value={newWorkoutName}
            onChange={(e) => setNewWorkoutName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-black"
          />

          <div className="space-y-3">
            {exercises.map((ex, idx) => (
              <div key={ex.id} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="col-span-6">
                  <input 
                    type="text" 
                    placeholder="Exercise"
                    value={ex.name}
                    onChange={(e) => {
                      const newExs = [...exercises];
                      newExs[idx].name = e.target.value;
                      setExercises(newExs);
                    }}
                    className="w-full bg-transparent outline-none text-sm font-semibold text-black"
                  />
                </div>
                <div className="col-span-2">
                  <input 
                    type="number" 
                    placeholder="Sets"
                    value={ex.sets || ''}
                    onChange={(e) => {
                      const newExs = [...exercises];
                      newExs[idx].sets = parseInt(e.target.value);
                      setExercises(newExs);
                    }}
                    className="w-full bg-transparent outline-none text-sm font-bold text-center text-black"
                  />
                </div>
                <div className="col-span-2">
                  <input 
                    type="number" 
                    placeholder="Reps"
                    value={ex.reps || ''}
                    onChange={(e) => {
                      const newExs = [...exercises];
                      newExs[idx].reps = parseInt(e.target.value);
                      setExercises(newExs);
                    }}
                    className="w-full bg-transparent outline-none text-sm font-bold text-center text-black"
                  />
                </div>
                <div className="col-span-2 text-right">
                   <button 
                    onClick={() => setExercises(exercises.filter((_, i) => i !== idx))}
                    className="text-red-400 hover:text-red-600"
                   >
                     <i className="fa-solid fa-trash-can"></i>
                   </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleAddExercise}
              className="flex-1 bg-slate-100 text-black p-3 rounded-2xl text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              + Add Exercise
            </button>
            <button 
              onClick={handleSaveWorkout}
              className="flex-1 vertex-gradient text-white p-3 rounded-2xl text-xs font-bold hover:opacity-90 transition-opacity"
            >
              Finish & Save
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {workouts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <i className="fa-solid fa-calendar-plus text-2xl"></i>
            </div>
            <p className="text-black opacity-50 font-medium">No sessions logged. Start your first workout today!</p>
          </div>
        ) : (
          workouts.slice().reverse().map(w => (
            <div 
              key={w.id} 
              className={`bg-white p-6 rounded-3xl border transition-all relative group overflow-hidden ${
                w.completed 
                ? 'border-emerald-200 bg-emerald-50/20 shadow-sm' 
                : 'border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Completed Badge */}
              {w.completed && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                  <i className="fa-solid fa-check mr-1"></i> Completed
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className={`text-lg font-black transition-colors ${w.completed ? 'text-emerald-800' : 'text-black'}`}>
                    {w.name}
                  </h4>
                  <p className="text-xs text-black opacity-60 font-bold">
                    {new Date(w.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleWorkoutCompletion(w.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      w.completed 
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100'
                    }`}
                  >
                    {w.completed ? (
                      <><i className="fa-solid fa-undo"></i> Reset</>
                    ) : (
                      <><i className="fa-solid fa-check-circle"></i> Complete</>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => deleteWorkout(w.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                {w.exercises.map(ex => (
                  <div key={ex.id} className={`p-3 rounded-2xl transition-colors ${w.completed ? 'bg-emerald-100/50' : 'bg-slate-50'}`}>
                    <p className={`text-[10px] font-bold uppercase truncate ${w.completed ? 'text-emerald-600' : 'text-black opacity-50'}`}>
                      {ex.name}
                    </p>
                    <p className={`text-sm font-bold ${w.completed ? 'text-emerald-800' : 'text-black'}`}>
                      {ex.sets} x {ex.reps} 
                      {ex.weight > 0 && <span className="text-indigo-500 ml-1">{ex.weight}kg</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkoutTracker;