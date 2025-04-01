import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileNavbar } from "@/components/ui/mobile-navbar";
import { HabitForm } from "@/components/habits/habit-form";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [habitFormOpen, setHabitFormOpen] = useState(false);
  
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/users/me'],
  });

  // Default user data if not loading but no data
  const userData = user || { 
    name: "Alex Johnson", 
    email: "alex@example.com", 
    currentStreak: 0, 
    points: 0
  };

  const handleCreateHabit = () => {
    setHabitFormOpen(true);
  };

  // Add some padding to the bottom for mobile navigation
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar user={userData} />
      
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>
      
      <MobileNavbar onCreateHabit={handleCreateHabit} />
      
      <HabitForm 
        open={habitFormOpen} 
        onClose={() => setHabitFormOpen(false)} 
      />
    </div>
  );
}
