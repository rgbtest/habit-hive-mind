
import React, { useState } from 'react';
import Header from '@/components/Header';
import HabitCard from '@/components/HabitCard';
import CreateHabitForm from '@/components/CreateHabitForm';
import { useHabits } from '@/lib/store';
import { Habit } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, ArrowUp, ArrowDown } from 'lucide-react';

const Index = () => {
  const {
    habits,
    isLoading,
    createHabit,
    toggleHabitCompletion,
    deleteHabit,
    getHabitStatus,
    calculateStreak,
    getTotalCompletions,
  } = useHabits();

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Sort habits by streak (descending by default)
  const sortedHabits = [...habits].sort((a, b) => {
    const streakA = calculateStreak(a.id);
    const streakB = calculateStreak(b.id);
    return sortOrder === 'desc' ? streakB - streakA : streakA - streakB;
  });

  // Filter habits by frequency
  const dailyHabits = sortedHabits.filter(habit => habit.frequency === 'daily');
  const weeklyHabits = sortedHabits.filter(habit => habit.frequency === 'weekly');

  // Calculate stats
  const totalHabits = habits.length;
  const totalCompletions = getTotalCompletions();
  const highestStreak = habits.length 
    ? Math.max(...habits.map(habit => calculateStreak(habit.id)))
    : 0;

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <span className="text-3xl font-bold">{totalHabits}</span>
              <span className="text-muted-foreground">Active Habits</span>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <span className="text-3xl font-bold">{totalCompletions}</span>
              <span className="text-muted-foreground">Total Completions</span>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <span className="text-3xl font-bold">{highestStreak}</span>
              <span className="text-muted-foreground">Highest Streak</span>
            </CardContent>
          </Card>
        </div>
        
        {/* Create Habit and Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <CreateHabitForm onCreateHabit={createHabit} />
          
          {habits.length > 0 && (
            <button 
              onClick={toggleSortOrder}
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Sort by streak {sortOrder === 'desc' ? <ArrowDown className="ml-1 h-4 w-4" /> : <ArrowUp className="ml-1 h-4 w-4" />}
            </button>
          )}
        </div>
        
        {habits.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No habits yet</h3>
            <p className="text-muted-foreground mb-6">Create your first habit to get started</p>
            <CreateHabitForm onCreateHabit={createHabit} />
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    status={getHabitStatus(habit.id)}
                    streak={calculateStreak(habit.id)}
                    onToggle={toggleHabitCompletion}
                    onDelete={deleteHabit}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="daily">
              {dailyHabits.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dailyHabits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      status={getHabitStatus(habit.id)}
                      streak={calculateStreak(habit.id)}
                      onToggle={toggleHabitCompletion}
                      onDelete={deleteHabit}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-6">No daily habits yet</p>
              )}
            </TabsContent>
            
            <TabsContent value="weekly">
              {weeklyHabits.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {weeklyHabits.map((habit) => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      status={getHabitStatus(habit.id)}
                      streak={calculateStreak(habit.id)}
                      onToggle={toggleHabitCompletion}
                      onDelete={deleteHabit}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-6">No weekly habits yet</p>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Habit Hive - Track your habits and build better routines
        </div>
      </footer>
    </div>
  );
};

export default Index;
