import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, PlusCircle } from "lucide-react";

import { WelcomeCard } from "@/components/dashboard/welcome-card";
import { HabitCard } from "@/components/dashboard/habit-card";
import { ProgressChart } from "@/components/dashboard/progress-chart";
import { HabitLoop } from "@/components/dashboard/habit-loop";
import { Achievements } from "@/components/dashboard/achievements";
import { UpcomingHabits } from "@/components/dashboard/upcoming-habits";
import { HabitForm } from "@/components/habits/habit-form";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [habitFormOpen, setHabitFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<any>(null);
  
  const { data: user = {
    name: "User",
    currentStreak: 0,
  } } = useQuery<{
    name: string;
    currentStreak: number;
    [key: string]: any;
  }>({
    queryKey: ['/api/user'],
  });
  
  const { data: todayHabits = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/habits/today'],
  });

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
          <div className="md:hidden">
            <h1 className="text-xl font-bold text-primary">Atomic Habits</h1>
          </div>
          <div className="hidden md:block">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Bell className="h-6 w-6" />
            </Button>
            <div className="hidden md:block">
              <Button onClick={handleOpenHabitForm} className="flex items-center">
                <PlusCircle className="h-5 w-5 mr-1" />
                New Habit
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6">
        {/* Welcome card */}
        <WelcomeCard 
          name={user?.name || "User"} 
          streak={user?.currentStreak || 0} 
        />

        {/* Today's habits */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4">Today's Habits</h3>
          {isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : todayHabits && todayHabits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {todayHabits.map((habit: any) => (
                <HabitCard 
                  key={habit.id} 
                  habit={habit} 
                  onEdit={handleEditHabit} 
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <h4 className="text-lg font-medium mb-2">No habits for today</h4>
              <p className="text-gray-500 mb-4">
                Start your habit journey by adding your first habit.
              </p>
              <Button onClick={handleOpenHabitForm}>
                <PlusCircle className="h-5 w-5 mr-1" />
                Add Your First Habit
              </Button>
            </div>
          )}
        </section>

        {/* Charts and data visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProgressChart />
          <HabitLoop />
        </div>

        {/* Achievements and upcoming habits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Achievements />
          <UpcomingHabits onCreateHabit={handleOpenHabitForm} />
        </div>
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
