
import React from 'react';
import { Check, CalendarDays } from 'lucide-react';
import { Habit, HabitStatus } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  status: HabitStatus;
  streak: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ 
  habit, 
  status, 
  streak,
  onToggle,
  onDelete
}) => {
  const statusStyles = {
    complete: "bg-habit-complete text-white border-habit-complete",
    missed: "bg-habit-missed text-white border-habit-missed",
    pending: "bg-white dark:bg-gray-800 border-habit-neutral"
  };

  return (
    <Card className="w-full overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold leading-tight">{habit.name}</h3>
          <button 
            onClick={() => onDelete(habit.id)}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            &times;
          </button>
        </div>
        {habit.description && (
          <p className="text-sm text-muted-foreground">{habit.description}</p>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium flex items-center">
              <CalendarDays className="h-4 w-4 mr-1" /> 
              {habit.frequency}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium">
              Streak: {streak}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-0">
        <button
          onClick={() => onToggle(habit.id)}
          className={cn(
            "w-full p-3 rounded-b-lg border-t transition-all duration-200 focus:outline-none",
            statusStyles[status],
            status === 'complete' && "bg-habit-complete"
          )}
        >
          {status === 'complete' ? (
            <span className="flex items-center justify-center">
              <Check className="h-5 w-5 mr-2 animate-check-mark" />
              Completed
            </span>
          ) : (
            <span>Mark Complete</span>
          )}
        </button>
      </CardFooter>
    </Card>
  );
};

export default HabitCard;
