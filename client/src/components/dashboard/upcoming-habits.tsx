import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface UpcomingHabitsProps {
  onCreateHabit: () => void;
}

export function UpcomingHabits({ onCreateHabit }: UpcomingHabitsProps) {
  const { data: upcomingData, isLoading } = useQuery({
    queryKey: ['/api/habits/upcoming'],
  });

  // Format time from 24hr to 12hr format
  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'All day';
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Get day name (Mon, Tue, etc)
  const getDayName = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'EEE');
  };

  // Get day date (Jan 1, etc)
  const getDayDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'MMM d');
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Upcoming Habits</h3>
          <a href="#" className="text-primary hover:text-indigo-700 text-sm font-medium">
            View All
          </a>
        </div>
        <div className="h-48 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Upcoming Habits</h3>
        <a href="#" className="text-primary hover:text-indigo-700 text-sm font-medium">
          View All
        </a>
      </div>
      
      {upcomingData && upcomingData.length > 0 ? (
        <div className="space-y-3">
          {upcomingData.map((day: any, index: number) => (
            day.habits.slice(0, 1).map((habit: any) => (
              <div 
                key={`${day.date}-${habit.id}`}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-shrink-0 mr-3">
                  <span className="text-sm font-medium text-gray-900">
                    {getDayName(day.date)}
                  </span>
                  <div className="text-xs text-gray-500">
                    {getDayDate(day.date)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {habit.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {habit.description || 'No description'}
                  </p>
                </div>
                <div className="ml-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium rounded-full px-2.5 py-0.5">
                    {formatTime(habit.timeOfDay)}
                  </span>
                </div>
              </div>
            ))
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <p>No upcoming habits found</p>
          <p className="text-sm mt-1">Add new habits to see them here</p>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Button 
          className="w-full text-white bg-primary hover:bg-indigo-700 flex items-center justify-center"
          onClick={onCreateHabit}
        >
          <PlusCircle className="h-5 w-5 mr-1" />
          Add New Habit
        </Button>
      </div>
    </div>
  );
}
