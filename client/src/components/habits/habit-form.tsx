import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertHabitSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Extend the schema with some additional validation
const habitFormSchema = insertHabitSchema.extend({
  name: z.string().min(3, { message: "Habit name must be at least 3 characters" }),
  target: z.coerce.number().min(1, { message: "Target must be at least 1" }),
});

type HabitFormValues = z.infer<typeof habitFormSchema>;

interface HabitFormProps {
  open: boolean;
  onClose: () => void;
  editingHabit?: any;
}

export function HabitForm({ open, onClose, editingHabit }: HabitFormProps) {
  const [activeTab, setActiveTab] = useState("details");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Create a helper function to process field values
  const processFieldValue = (value: any): string => {
    if (value === null || value === undefined) {
      return "";
    }
    return String(value);
  };

  // Get default values while ensuring no null/undefined
  const getDefaultValues = () => {
    if (editingHabit) {
      return {
        ...editingHabit,
        userId: 1, // For demo, always use user ID 1
        // Ensure string fields aren't null/undefined
        name: processFieldValue(editingHabit.name),
        description: processFieldValue(editingHabit.description),
        unit: processFieldValue(editingHabit.unit),
        frequency: processFieldValue(editingHabit.frequency),
        timeOfDay: processFieldValue(editingHabit.timeOfDay),
        color: processFieldValue(editingHabit.color || "#4F46E5"),
        cue: processFieldValue(editingHabit.cue),
        craving: processFieldValue(editingHabit.craving),
        response: processFieldValue(editingHabit.response),
        reward: processFieldValue(editingHabit.reward),
      };
    } else {
      return {
        name: "",
        description: "",
        target: 1,
        unit: "minutes",
        frequency: "daily",
        timeOfDay: "08:00",
        userId: 1, // For demo, always use user ID 1
        color: "#4F46E5",
        cue: "",
        craving: "",
        response: "",
        reward: "",
      };
    }
  };

  // Initialize form with default values or editing values
  const form = useForm<HabitFormValues>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: getDefaultValues()
  });

  const { mutate: saveHabit, isPending } = useMutation({
    mutationFn: async (values: HabitFormValues) => {
      if (editingHabit) {
        return apiRequest('PATCH', `/api/habits/${editingHabit.id}`, values);
      } else {
        return apiRequest('POST', '/api/habits', values);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] });
      queryClient.invalidateQueries({ queryKey: ['/api/habits/today'] });
      toast({
        title: editingHabit ? "Habit updated" : "Habit created",
        description: editingHabit 
          ? "Your habit has been updated successfully." 
          : "Your new habit has been created successfully.",
      });
      onClose();
      form.reset(); // Reset form after submission
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was a problem saving your habit. Please try again.",
        variant: "destructive",
      });
    }
  });

  function onSubmit(values: HabitFormValues) {
    saveHabit(values);
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingHabit ? "Edit Habit" : "Create New Habit"}
          </DialogTitle>
          <DialogDescription>
            {editingHabit 
              ? "Update your habit details to keep track of your progress." 
              : "Add a new habit to start building better routines."
            }
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="details">Habit Details</TabsTrigger>
            <TabsTrigger value="loop">Habit Loop</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <TabsContent value="details" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Habit Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Read 20 pages" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g. Daily reading habit" 
                          {...field}
                          value={field.value ?? ""} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="target"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pages">Pages</SelectItem>
                            <SelectItem value="minutes">Minutes</SelectItem>
                            <SelectItem value="times">Times</SelectItem>
                            <SelectItem value="steps">Steps</SelectItem>
                            <SelectItem value="glasses">Glasses</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekdays">Weekdays</SelectItem>
                            <SelectItem value="weekends">Weekends</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="timeOfDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Time</FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field}
                            value={field.value ?? ""} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="color" 
                          className="w-12 h-10 p-1" 
                          {...field}
                          value={field.value ?? "#4F46E5"} 
                        />
                        <span className="text-sm">{field.value}</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="loop" className="space-y-4 pt-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">
                    Breaking down your habit into the four components of the habit loop 
                    can help you understand and reinforce it better.
                  </p>
                </div>
                
                <FormField
                  control={form.control}
                  name="cue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cue (Trigger)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What triggers this habit? e.g. After brushing teeth" 
                          {...field}
                          value={field.value ?? ""} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="craving"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Craving (Motivation)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Why are you motivated to do this? e.g. Want to learn new things" 
                          {...field}
                          value={field.value ?? ""} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="response"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Response (Action)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="The specific action you'll take. e.g. Read 20 pages of a book" 
                          {...field}
                          value={field.value ?? ""} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reward"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reward (Satisfaction)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What reward will you get? e.g. Knowledge, relaxation" 
                          {...field}
                          value={field.value ?? ""} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                >
                  {isPending ? "Saving..." : (editingHabit ? "Update Habit" : "Create Habit")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
