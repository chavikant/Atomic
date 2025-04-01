import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertHabitSchema, 
  insertHabitLogSchema
} from "@shared/schema";
import { z } from "zod";
import { format } from "date-fns";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize default users if none exist
  const defaultUser = await storage.getUserByUsername("demo");
  if (!defaultUser) {
    // Create a few users to populate the leaderboard
    await storage.createUser({
      username: "demo",
      password: "demo123", // This will be hashed by the auth system when registered properly
      name: "Alex Johnson",
      email: "alex@example.com",
      points: 450,
      currentStreak: 7
    });
    
    await storage.createUser({
      username: "sarah",
      password: "sarah123",
      name: "Sarah Miller",
      email: "sarah@example.com",
      points: 680,
      currentStreak: 12
    });
    
    await storage.createUser({
      username: "mike",
      password: "mike123",
      name: "Mike Davis",
      email: "mike@example.com",
      points: 320,
      currentStreak: 5
    });
    
    await storage.createUser({
      username: "emma",
      password: "emma123",
      name: "Emma Wilson",
      email: "emma@example.com",
      points: 520,
      currentStreak: 9
    });
  }

  // Set up authentication
  const { isAuthenticated } = setupAuth(app);

  // User routes - support both /api/user and /api/users/me for backwards compatibility
  app.get('/api/user', isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = req.user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user data" });
    }
  });
  
  app.get('/api/users/me', isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = req.user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Habit routes
  app.post('/api/habits', isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.user.id;
      const habitData = { ...req.body, userId };
      const validatedData = insertHabitSchema.parse(habitData);
      const habit = await storage.createHabit(validatedData);
      res.status(201).json(habit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid habit data", errors: error.format() });
      }
      res.status(500).json({ message: "Failed to create habit" });
    }
  });

  app.get('/api/habits', isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.user.id;
      const habits = await storage.getHabits(userId);
      res.json(habits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch habits" });
    }
  });

  app.get('/api/habits/today', isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.user.id;
      const today = new Date();
      
      // Get habits for today
      const habits = await storage.getHabitsByDate(userId, today);
      
      // Get logs for these habits
      const today_str = format(today, 'yyyy-MM-dd');
      const habitsWithProgress = await Promise.all(
        habits.map(async (habit) => {
          const log = await storage.getHabitLog(habit.id, new Date(today_str));
          return {
            ...habit,
            completed: log?.completed || false,
            progress: log?.progress || 0
          };
        })
      );
      
      res.json(habitsWithProgress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch today's habits" });
    }
  });

  // Upcoming habits (for next few days) - needs to be before /:id to avoid parameter matching
  app.get('/api/habits/upcoming', isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.user.id;
      const habits = await storage.getHabits(userId);
      
      if (!habits || habits.length === 0) {
        return res.json([]); // Return empty array if no habits found
      }
      
      const upcomingDays = 5; // Next 5 days
      const upcoming = [];
      
      const today = new Date();
      for (let i = 1; i <= upcomingDays; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        
        // Get habits for this date (will be all habits in our simplified model)
        const dayHabits = habits.filter(habit => habit.isActive);
        
        if (dayHabits.length > 0) {
          upcoming.push({
            date: date.toISOString(), // Format as ISO string for frontend
            habits: dayHabits.map(habit => ({
              id: habit.id,
              name: habit.name,
              description: habit.description,
              timeOfDay: habit.timeOfDay
            }))
          });
        }
      }
      
      res.json(upcoming);
    } catch (error) {
      console.error('Error fetching upcoming habits:', error);
      res.status(500).json({ message: "Failed to fetch upcoming habits" });
    }
  });

  app.get('/api/habits/:id', isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.user.id;
      const habitId = parseInt(req.params.id);
      const habit = await storage.getHabit(habitId);
      
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      // Check if habit belongs to user
      if (habit.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(habit);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch habit" });
    }
  });

  app.patch('/api/habits/:id', isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.user.id;
      const habitId = parseInt(req.params.id);
      const habit = await storage.getHabit(habitId);
      
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      // Check if habit belongs to user
      if (habit.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updatedHabit = await storage.updateHabit(habitId, req.body);
      res.json(updatedHabit);
    } catch (error) {
      res.status(500).json({ message: "Failed to update habit" });
    }
  });

  app.delete('/api/habits/:id', isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.user.id;
      const habitId = parseInt(req.params.id);
      const habit = await storage.getHabit(habitId);
      
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      // Check if habit belongs to user
      if (habit.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const deleted = await storage.deleteHabit(habitId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete habit" });
    }
  });

  // Habit Logs
  app.post('/api/habits/:id/complete', isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.user.id;
      const habitId = parseInt(req.params.id);
      const { progress, date } = req.body;
      
      // Validate inputs
      if (progress === undefined) {
        return res.status(400).json({ message: "Progress is required" });
      }
      
      // Check if habit belongs to user
      const habit = await storage.getHabit(habitId);
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      if (habit.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Use provided date or default to today
      const logDate = date ? new Date(date) : new Date();
      
      const log = await storage.completeHabit(habitId, userId, logDate, progress);
      res.json(log);
    } catch (error) {
      res.status(500).json({ message: "Failed to complete habit" });
    }
  });

  app.get('/api/habits/:id/logs', isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.user.id;
      const habitId = parseInt(req.params.id);
      
      // Check if habit belongs to user
      const habit = await storage.getHabit(habitId);
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      if (habit.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date();
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
      
      // Default to last 7 days if no dates provided
      if (!req.query.startDate) {
        startDate.setDate(startDate.getDate() - 7);
      }
      
      const logs = await storage.getHabitLogs(habitId, startDate, endDate);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch habit logs" });
    }
  });

  // Achievement routes
  app.get('/api/achievements', isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.user.id;
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/weekly', isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.user.id;
      const today = new Date();
      const startDate = new Date();
      startDate.setDate(today.getDate() - 7);
      
      // Get all user habits
      const habits = await storage.getHabits(userId);
      
      // For each habit, get logs for the past week
      const habitsWithLogs = await Promise.all(
        habits.map(async (habit) => {
          const logs = await storage.getHabitLogs(habit.id, startDate, today);
          return {
            id: habit.id,
            name: habit.name,
            color: habit.color,
            unit: habit.unit,
            logs: logs.map(log => ({
              date: log.date,
              progress: log.progress,
              completed: log.completed
            }))
          };
        })
      );
      
      // Format for chart display
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const day = new Date();
        day.setDate(today.getDate() - i);
        days.push(format(day, 'EEE'));
      }
      
      const datasets = habitsWithLogs.map(habit => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
          const day = new Date();
          day.setDate(today.getDate() - i);
          const dayStr = format(day, 'yyyy-MM-dd');
          
          const log = habit.logs.find(log => 
            format(new Date(log.date), 'yyyy-MM-dd') === dayStr
          );
          
          data.push(log ? log.progress : 0);
        }
        
        return {
          label: habit.name,
          data,
          borderColor: habit.color,
          backgroundColor: `${habit.color}33`, // Add transparency
          unit: habit.unit
        };
      });
      
      res.json({
        labels: days,
        datasets
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });



  // Leaderboard route
  app.get('/api/leaderboard', isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const { type = 'points', timeFrame = 'week' } = req.query;
      
      // Get all users with their respective points and streaks
      const allUsers = await storage.getAllUsers();
      
      if (!allUsers || allUsers.length === 0) {
        return res.json([]);
      }
      
      // Map users to leaderboard format and sort based on the requested type
      const leaderboardData = allUsers.map(user => {
        const { password, ...userWithoutPassword } = user;
        return {
          id: user.id,
          name: user.name,
          username: user.username,
          points: user.points,
          streak: user.currentStreak,
          isCurrentUser: user.id === req.user?.id
        };
      }).sort((a, b) => {
        if (type === 'points') {
          return b.points - a.points;
        } else { // 'streak'
          return b.streak - a.streak;
        }
      });
      
      // Add rank based on sorted position
      leaderboardData.forEach((user, index) => {
        user.rank = index + 1;
      });
      
      res.json(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ message: "Failed to fetch leaderboard data" });
    }
  });

  // Default quotes
  app.get('/api/quotes', async (req: Request, res: Response) => {
    const quotes = [
      {
        quote: "You do not rise to the level of your goals. You fall to the level of your systems.",
        author: "James Clear, Atomic Habits"
      },
      {
        quote: "Every action you take is a vote for the type of person you wish to become.",
        author: "James Clear, Atomic Habits"
      },
      {
        quote: "Habits are the compound interest of self-improvement.",
        author: "James Clear, Atomic Habits"
      },
      {
        quote: "The most effective way to change your habits is to focus not on what you want to achieve, but on who you wish to become.",
        author: "James Clear, Atomic Habits"
      },
      {
        quote: "You should be far more concerned with your current trajectory than with your current results.",
        author: "James Clear, Atomic Habits"
      }
    ];
    
    // Return a random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json(randomQuote);
  });

  const httpServer = createServer(app);
  return httpServer;
}
