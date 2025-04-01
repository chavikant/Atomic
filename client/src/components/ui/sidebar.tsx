import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { BarChart, BookOpen, Users, Settings, Home } from "lucide-react";

interface SidebarProps {
  user: { name: string; email: string };
}

export function Sidebar({ user }: SidebarProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/habits", label: "My Habits", icon: BookOpen },
    { href: "/analytics", label: "Analytics", icon: BarChart },
    { href: "/community", label: "Community", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary">Atomic Habits</h1>
        <p className="text-xs text-gray-500">Build better habits, 1% at a time</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 rounded-lg font-medium",
                isActive 
                  ? "text-primary bg-indigo-50" 
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center text-xl font-semibold text-gray-600">
            {user.name.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
