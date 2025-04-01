import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { BarChart, BookOpen, PlusCircle, User, Home } from "lucide-react";

interface MobileNavbarProps {
  onCreateHabit: () => void;
}

export function MobileNavbar({ onCreateHabit }: MobileNavbarProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/habits", label: "My Habits", icon: BookOpen },
    { href: "/analytics", label: "Analytics", icon: BarChart },
    { href: "/settings", label: "Profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around">
        {navItems.map((item, index) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          // If it's the middle position, insert the add button
          if (index === Math.floor(navItems.length / 2)) {
            return (
              <>
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center py-3 px-2",
                    isActive ? "text-primary" : "text-gray-500"
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
                <button
                  key="add-habit"
                  onClick={onCreateHabit}
                  className="flex flex-col items-center py-3 px-2 bg-primary text-white rounded-full -mt-6 shadow-lg"
                >
                  <PlusCircle className="h-6 w-6" />
                  <span className="text-xs mt-1">Add</span>
                </button>
              </>
            );
          }
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center py-3 px-2",
                isActive ? "text-primary" : "text-gray-500"
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
