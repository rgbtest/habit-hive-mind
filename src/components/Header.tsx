
import React from 'react';
import { CalendarDays } from 'lucide-react';

const Header: React.FC = () => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <header className="w-full py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Habit Hive</h1>
            <p className="text-muted-foreground flex items-center mt-1">
              <CalendarDays className="h-4 w-4 mr-2" /> 
              {formattedDate}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
