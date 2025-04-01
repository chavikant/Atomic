import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Sidebar } from "@/components/ui/sidebar";
import { MobileNavbar } from "@/components/ui/mobile-navbar";
import { HabitForm } from "@/components/habits/habit-form";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [habitFormOpen, setHabitFormOpen] = useState(false);
  const { user, isLoading } = useAuth();
  
  // Default user data if not loading but no data
  const userData = { 
    name: user?.name || "Guest User", 
    email: user?.email || "guest@example.com",
    currentStreak: user?.currentStreak || 0,
    points: user?.points || 0
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
