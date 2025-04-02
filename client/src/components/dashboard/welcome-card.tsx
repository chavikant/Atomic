import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";

interface WelcomeCardProps {
  name: string;
  streak: number;
}

export function WelcomeCard({ name, streak }: WelcomeCardProps) {
  const [greeting, setGreeting] = useState("Good day");
  const [currentDate, setCurrentDate] = useState("");

  const { data: quote = { quote: "", author: "" } } = useQuery<{
    quote: string;
    author: string;
  }>({
    queryKey: ['/api/quotes'],
    staleTime: 24 * 60 * 60 * 1000 // 24 hours
  });
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
    
    setCurrentDate(formatDate(new Date()));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="flex flex-col md:flex-row">
        <div className="p-6 md:p-8 flex-1">
          <h3 className="text-2xl font-bold mb-2">{greeting}, {name}!</h3>
          <div className="flex items-center mb-4">
            <div className="text-lg font-medium">Current Streak:</div>
            <div className="ml-2 bg-secondary text-white rounded-full px-3 py-1 text-sm font-semibold">
              {streak} {streak === 1 ? 'Day' : 'Days'}
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            {streak > 0 
              ? "Keep up the great work! Consistency is key to building lasting habits." 
              : "Start your habit journey today and build consistency one day at a time."}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{currentDate}</span>
          </div>
        </div>
        <div className="bg-indigo-50 w-full md:w-80 p-6 flex flex-col justify-center">
          <h4 className="font-medium text-primary mb-2">Daily Quote</h4>
          <blockquote className="text-gray-700 italic">
            "{quote?.quote || "You do not rise to the level of your goals. You fall to the level of your systems."}"
          </blockquote>
          <p className="text-sm text-gray-500 mt-2">
            - {quote?.author || "James Clear, Atomic Habits"}
          </p>
        </div>
      </div>
    </div>
  );
}
