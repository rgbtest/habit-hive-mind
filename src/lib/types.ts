
export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly';
  completedDates: string[]; // ISO date strings
  createdAt: string; // ISO date string
  color?: string;
}

export type HabitStatus = 'complete' | 'missed' | 'pending';
