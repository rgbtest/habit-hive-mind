
import { useState, useEffect } from 'react';
import { Habit, HabitStatus } from './types';
import { toast } from 'sonner';

// Helper functions
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const isToday = (dateString: string): boolean => {
  const today = formatDate(new Date());
  return dateString === today;
};

// Local Storage Functions
const LOCAL_STORAGE_KEY = 'habit-tracker-habits';

const saveHabits = (habits: Habit[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(habits));
};

const loadHabits = (): Habit[] => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Failed to parse habits from localStorage', error);
      return [];
    }
  }
  return [];
};

// Custom hook to manage habits
export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load habits from localStorage on component mount
  useEffect(() => {
    setHabits(loadHabits());
    setIsLoading(false);
  }, []);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      saveHabits(habits);
    }
  }, [habits, isLoading]);

  // Create a new habit
  const createHabit = (habit: Omit<Habit, 'id' | 'completedDates' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      completedDates: [],
      createdAt: new Date().toISOString(),
    };

    setHabits((prevHabits) => [...prevHabits, newHabit]);
    toast.success('Habit created!');
    return newHabit;
  };

  // Update an existing habit
  const updateHabit = (updatedHabit: Habit) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => (habit.id === updatedHabit.id ? updatedHabit : habit))
    );
    toast.success('Habit updated!');
  };

  // Delete a habit
  const deleteHabit = (habitId: string) => {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== habitId));
    toast.success('Habit deleted!');
  };

  // Toggle habit completion for today
  const toggleHabitCompletion = (habitId: string) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id !== habitId) return habit;

        const today = formatDate(new Date());
        const completedToday = habit.completedDates.includes(today);

        return {
          ...habit,
          completedDates: completedToday
            ? habit.completedDates.filter((date) => date !== today)
            : [...habit.completedDates, today],
        };
      })
    );
  };

  // Get the status of a habit for a specific date
  const getHabitStatus = (habitId: string, date: Date = new Date()): HabitStatus => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return 'pending';

    const dateStr = formatDate(date);
    return habit.completedDates.includes(dateStr) ? 'complete' : 'pending';
  };

  // Calculate current streak for a habit
  const calculateStreak = (habitId: string): number => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return 0;

    const sortedDates = [...habit.completedDates].sort();
    if (sortedDates.length === 0) return 0;

    let currentStreak = 0;
    const today = formatDate(new Date());
    const yesterday = formatDate(new Date(Date.now() - 86400000)); // 24 hours in milliseconds

    // Check if completed today or yesterday to continue streak
    const hasCompletedRecently = sortedDates.includes(today) || sortedDates.includes(yesterday);
    if (!hasCompletedRecently) return 0;

    // Calculate streak
    for (let i = 0; i < 366; i++) { // Max 1 year streak
      const checkDate = formatDate(new Date(Date.now() - i * 86400000));
      if (sortedDates.includes(checkDate)) {
        currentStreak++;
      } else if (i > 0) { // Allow for today not being completed yet
        break;
      }
    }

    return currentStreak;
  };

  const getTotalCompletions = (): number => {
    return habits.reduce((total, habit) => total + habit.completedDates.length, 0);
  };

  return {
    habits,
    isLoading,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    getHabitStatus,
    calculateStreak,
    getTotalCompletions,
  };
};
