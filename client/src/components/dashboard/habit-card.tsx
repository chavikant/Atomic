import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Habit } from "@shared/schema";
import { Star, TrendingUp, Edit, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface HabitCardProps {
  habit: Habit & { progress: number; completed: boolean };
  onEdit: (habit: Habit) => void;
}

export function HabitCard({ habit, onEdit }: HabitCardProps) {
  const [progress, setProgress] = useState(habit.progress);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { mutate: completeHabit, isPending } = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/habits/${habit.id}/complete`, { progress });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits/today'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/achievements'] });
      toast({
        title: "Habit completed!",
        description: `You completed "${habit.name}" and earned 10 points!`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete habit. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Format time from 24hr to 12hr format if available
  const formatTime = (timeString: string | null) => {
    if (!timeString) return null;
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Calculate progress percentage
  const progressPercentage = habit.target > 0 
    ? Math.min(100, (progress / habit.target) * 100) 
    : 0;

  // Format growth percentage (just a placeholder for demo)
  const growthPercentage = habit.currentStreak > 0 ? `+${habit.currentStreak * 3}%` : "+0%";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-lg font-semibold">{habit.name}</h4>
          <p className="text-gray-500 text-sm">{habit.description}</p>
        </div>
        {habit.timeOfDay && (
          <div>
            <div className="bg-green-100 text-green-800 text-xs font-medium rounded-full px-2.5 py-0.5">
              {formatTime(habit.timeOfDay)}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Star className="h-5 w-5 text-amber-500 mr-1" />
          <span className="text-sm font-medium">
            {habit.currentStreak} day {habit.currentStreak === 1 ? 'streak' : 'streaks'}
          </span>
        </div>
        <div className="flex items-center">
          <TrendingUp className="h-5 w-5 text-secondary mr-1" />
          <span className="text-sm font-medium">{growthPercentage} growth</span>
        </div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <Progress value={progressPercentage} className="flex-1 mr-4" />
        <div className="text-sm font-medium">
          {habit.completed ? "Completed" : `${progress} / ${habit.target} ${habit.unit}`}
        </div>
      </div>
      
      {!habit.completed && (
        <div className="mt-2 mb-2">
          <input
            type="range"
            min="0"
            max={habit.target}
            value={progress}
            onChange={(e) => setProgress(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}
      
      <div className="mt-4 flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(habit)}
          className="flex items-center"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        
        {habit.completed ? (
          <Button 
            variant="secondary" 
            size="sm" 
            disabled 
            className="text-gray-400 bg-gray-200 cursor-not-allowed"
          >
            <Check className="h-5 w-5 mr-1" />
            Completed
          </Button>
        ) : (
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => completeHabit()}
            disabled={isPending} 
            className="flex items-center"
          >
            <Check className="h-5 w-5 mr-1" />
            {isPending ? "Saving..." : "Complete"}
          </Button>
        )}
      </div>
    </div>
  );
}
