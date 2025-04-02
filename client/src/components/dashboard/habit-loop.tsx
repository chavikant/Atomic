import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Book, Zap } from 'lucide-react';

export function HabitLoop() {
  const { data: habits = [] } = useQuery<any[]>({
    queryKey: ['/api/habits'],
  });

  // Filter habits that have complete habit loops
  const habitsWithLoop = habits.filter(
    (habit: any) => habit.cue && habit.craving && habit.response && habit.reward
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <h3 className="text-lg font-semibold mb-4">Habit Loop Components</h3>
      <p className="text-sm text-gray-500 mb-4">
        Break down your habits into the four components of the habit loop
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-indigo-50 rounded-lg p-3">
          <h4 className="text-primary font-medium mb-1">Cue</h4>
          <p className="text-sm text-gray-700">
            Visual reminders and time-based triggers for your habits
          </p>
        </div>
        <div className="bg-amber-50 rounded-lg p-3">
          <h4 className="text-amber-600 font-medium mb-1">Craving</h4>
          <p className="text-sm text-gray-700">
            Motivation and desire behind your habit formation
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <h4 className="text-green-600 font-medium mb-1">Response</h4>
          <p className="text-sm text-gray-700">
            The actual habit or action you perform
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <h4 className="text-blue-600 font-medium mb-1">Reward</h4>
          <p className="text-sm text-gray-700">
            The benefit or satisfaction from completing the habit
          </p>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-200">
        <h4 className="font-medium mb-2">Active Habit Loops</h4>
        {habitsWithLoop.length > 0 ? (
          <div className="space-y-3">
            {habitsWithLoop.slice(0, 2).map((habit: any) => (
              <div 
                key={habit.id}
                className="flex items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
              >
                <div 
                  className="text-white rounded-full w-7 h-7 flex items-center justify-center mr-3"
                  style={{ backgroundColor: habit.color || '#4F46E5' }}
                >
                  {habit.name.includes('Read') ? (
                    <Book className="h-4 w-4" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <h5 className="font-medium text-sm">{habit.name} Loop</h5>
                  <p className="text-xs text-gray-500">Fully configured loop</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 text-center py-3">
            No habit loops configured yet. Edit a habit to set up its loop components.
          </div>
        )}
      </div>

      <Button
        variant="outline"
        className="w-full mt-4 text-primary border-primary hover:bg-indigo-50"
      >
        View All Habit Loops
      </Button>
    </div>
  );
}
