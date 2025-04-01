import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Habit } from "@shared/schema";

export function useHabit() {
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [habitFormOpen, setHabitFormOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: completeHabit, isPending: isCompletingHabit } = useMutation({
    mutationFn: async ({ habitId, progress }: { habitId: number; progress: number }) => {
      return apiRequest('POST', `/api/habits/${habitId}/complete`, { progress });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits/today'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/achievements'] });
      toast({
        title: "Habit completed!",
        description: "You've made progress on your habit and earned points!",
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

  const { mutate: deleteHabit, isPending: isDeletingHabit } = useMutation({
    mutationFn: async (habitId: number) => {
      return apiRequest('DELETE', `/api/habits/${habitId}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] });
      queryClient.invalidateQueries({ queryKey: ['/api/habits/today'] });
      toast({
        title: "Habit deleted",
        description: "Your habit has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete habit. Please try again.",
        variant: "destructive",
      });
    }
  });

  const openHabitForm = (habit?: Habit) => {
    setEditingHabit(habit || null);
    setHabitFormOpen(true);
  };

  const closeHabitForm = () => {
    setHabitFormOpen(false);
    setEditingHabit(null);
  };

  return {
    editingHabit,
    habitFormOpen,
    isCompletingHabit,
    isDeletingHabit,
    completeHabit,
    deleteHabit,
    openHabitForm,
    closeHabitForm,
  };
}
