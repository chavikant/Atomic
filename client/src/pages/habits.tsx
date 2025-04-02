import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, Search, Filter, Calendar, Star } from "lucide-react";
import { HabitForm } from "@/components/habits/habit-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatTime } from "@/lib/utils";

export default function Habits() {
  const [habitFormOpen, setHabitFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: habits = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/habits'],
  });
  
  const filteredHabits = habits.filter((habit: any) => 
    habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (habit.description && habit.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenHabitForm = () => {
    setEditingHabit(null);
    setHabitFormOpen(true);
  };

  const handleEditHabit = (habit: any) => {
    setEditingHabit(habit);
    setHabitFormOpen(true);
  };

  return (
    <>
      <header className="bg-white p-4 border-b border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">My Habits</h2>
          <Button onClick={handleOpenHabitForm} className="flex items-center">
            <PlusCircle className="h-5 w-5 mr-1" />
            New Habit
          </Button>
        </div>
      </header>

      <div className="p-4 sm:p-6">
        {/* Search and filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search habits..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
            <Button variant="outline" className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Sort
            </Button>
          </div>
        </div>

        {/* Habits list */}
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredHabits && filteredHabits.length > 0 ? (
          <div className="grid gap-4">
            {filteredHabits.map((habit: any) => (
              <div
                key={habit.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: habit.color || '#4F46E5' }}
                      ></div>
                      <h3 className="text-lg font-semibold">{habit.name}</h3>
                    </div>
                    <p className="text-gray-500 mt-1">{habit.description}</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center bg-indigo-50 text-primary rounded-full px-3 py-1">
                      <Star className="h-4 w-4 mr-1 text-amber-500" />
                      <span className="text-sm font-medium">{habit.currentStreak} day streak</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-md p-2">
                    <span className="text-gray-500 block">Target</span>
                    <span className="font-medium">{habit.target} {habit.unit}</span>
                  </div>
                  <div className="bg-gray-50 rounded-md p-2">
                    <span className="text-gray-500 block">Frequency</span>
                    <span className="font-medium capitalize">{habit.frequency}</span>
                  </div>
                  <div className="bg-gray-50 rounded-md p-2">
                    <span className="text-gray-500 block">Time</span>
                    <span className="font-medium">{formatTime(habit.timeOfDay)}</span>
                  </div>
                </div>

                {(habit.cue || habit.craving || habit.response || habit.reward) && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <h4 className="text-sm font-medium mb-2">Habit Loop</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      {habit.cue && (
                        <div className="bg-indigo-50 rounded-md p-2">
                          <span className="text-primary font-medium block">Cue</span>
                          <span className="text-gray-700">{habit.cue}</span>
                        </div>
                      )}
                      {habit.craving && (
                        <div className="bg-amber-50 rounded-md p-2">
                          <span className="text-amber-600 font-medium block">Craving</span>
                          <span className="text-gray-700">{habit.craving}</span>
                        </div>
                      )}
                      {habit.response && (
                        <div className="bg-green-50 rounded-md p-2">
                          <span className="text-green-600 font-medium block">Response</span>
                          <span className="text-gray-700">{habit.response}</span>
                        </div>
                      )}
                      {habit.reward && (
                        <div className="bg-blue-50 rounded-md p-2">
                          <span className="text-blue-600 font-medium block">Reward</span>
                          <span className="text-gray-700">{habit.reward}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditHabit(habit)}
                  >
                    Edit Habit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h4 className="text-lg font-medium mb-2">No habits found</h4>
            {searchQuery ? (
              <p className="text-gray-500 mb-4">
                No habits match your search query "{searchQuery}".
              </p>
            ) : (
              <p className="text-gray-500 mb-4">
                You haven't created any habits yet. Start by adding your first habit.
              </p>
            )}
            {!searchQuery && (
              <Button onClick={handleOpenHabitForm}>
                <PlusCircle className="h-5 w-5 mr-1" />
                Add Your First Habit
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Habit form dialog */}
      <HabitForm 
        open={habitFormOpen} 
        onClose={() => setHabitFormOpen(false)} 
        editingHabit={editingHabit} 
      />
    </>
  );
}
