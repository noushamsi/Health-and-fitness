
export interface Workout {
  id: string;
  name: string;
  date: string;
  exercises: Exercise[];
  completed?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
  completed?: boolean;
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance';
}

export type Tab = 'dashboard' | 'workouts' | 'diet' | 'coach';
