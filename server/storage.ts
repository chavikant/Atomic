import { 
  users, type User, type InsertUser, 
  habits, type Habit, type InsertHabit,
  habitLogs, type HabitLog, type InsertHabitLog,
  achievements, type Achievement, type InsertAchievement,
  userAchievements, type UserAchievement, type InsertUserAchievement
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStreak(userId: number, streak: number): Promise<User>;
  updateUserPoints(userId: number, points: number): Promise<User>;
  
  // Habit methods
  createHabit(habit: InsertHabit): Promise<Habit>;
  getHabit(id: number): Promise<Habit | undefined>;
  getHabits(userId: number): Promise<Habit[]>;
  updateHabit(id: number, habit: Partial<Habit>): Promise<Habit>;
  deleteHabit(id: number): Promise<boolean>;
  getHabitsByDate(userId: number, date: Date): Promise<Habit[]>;
  
  // HabitLog methods
  createHabitLog(log: InsertHabitLog): Promise<HabitLog>;
  getHabitLog(habitId: number, date: Date): Promise<HabitLog | undefined>;
  getHabitLogs(habitId: number, startDate: Date, endDate: Date): Promise<HabitLog[]>;
  updateHabitLog(id: number, log: Partial<HabitLog>): Promise<HabitLog>;
  completeHabit(habitId: number, userId: number, date: Date, progress: number): Promise<HabitLog>;
  
  // Achievement methods
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: number): Promise<(Achievement & { unlocked: boolean })[]>;
  unlockAchievement(userId: number, achievementId: number): Promise<UserAchievement>;
  checkAndUnlockAchievements(userId: number): Promise<UserAchievement[]>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private habits: Map<number, Habit>;
  private habitLogs: Map<string, HabitLog>;
  private achievements: Map<number, Achievement>;
  private userAchievements: Map<string, UserAchievement>;
  private currentId: { [key: string]: number };
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.habits = new Map();
    this.habitLogs = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();
    this.currentId = {
      users: 1,
      habits: 1,
      habitLogs: 1,
      achievements: 1,
      userAchievements: 1
    };
    
    // Initialize session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });

    // Seed default achievements
    this.seedAchievements();
  }

  private seedAchievements() {
    const defaultAchievements: InsertAchievement[] = [
      {
        name: "7-Day Streak",
        description: "Complete a habit for 7 consecutive days",
        icon: "star",
        requiredStreak: 7,
        requiredHabits: null,
        requiredPoints: null
      },
      {
        name: "Habit Master",
        description: "Complete 3 different habits in a single day",
        icon: "check-circle",
        requiredStreak: null,
        requiredHabits: 3,
        requiredPoints: null
      },
      {
        name: "Consistency King",
        description: "Achieve a 30-day streak on any habit",
        icon: "zap",
        requiredStreak: 30,
        requiredHabits: null,
        requiredPoints: null
      },
      {
        name: "Early Bird",
        description: "Complete a habit before 8AM for 5 consecutive days",
        icon: "sun",
        requiredStreak: 5,
        requiredHabits: null,
        requiredPoints: null
      },
      {
        name: "Social Butterfly",
        description: "Share your progress with friends",
        icon: "users",
        requiredStreak: null,
        requiredHabits: null,
        requiredPoints: 100
      },
      {
        name: "30-Day Streak",
        description: "Complete a habit for 30 consecutive days",
        icon: "clock",
        requiredStreak: 30,
        requiredHabits: null,
        requiredPoints: null
      }
    ];

    defaultAchievements.forEach(achievement => {
      this.createAchievement(achievement);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { 
      ...insertUser, 
      id, 
      currentStreak: 0,
      points: 0
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStreak(userId: number, streak: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error(`User with id ${userId} not found`);
    
    const updatedUser = { ...user, currentStreak: streak };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserPoints(userId: number, points: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error(`User with id ${userId} not found`);
    
    const updatedUser = { ...user, points: user.points + points };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Habit methods
  async createHabit(habit: InsertHabit): Promise<Habit> {
    const id = this.currentId.habits++;
    const newHabit: Habit = {
      ...habit,
      id,
      currentStreak: 0,
      longestStreak: 0,
      createdAt: new Date(),
      isActive: true
    };
    this.habits.set(id, newHabit);
    return newHabit;
  }

  async getHabit(id: number): Promise<Habit | undefined> {
    return this.habits.get(id);
  }

  async getHabits(userId: number): Promise<Habit[]> {
    return Array.from(this.habits.values()).filter(
      (habit) => habit.userId === userId
    );
  }

  async updateHabit(id: number, habitUpdate: Partial<Habit>): Promise<Habit> {
    const habit = await this.getHabit(id);
    if (!habit) throw new Error(`Habit with id ${id} not found`);
    
    const updatedHabit = { ...habit, ...habitUpdate };
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }

  async deleteHabit(id: number): Promise<boolean> {
    return this.habits.delete(id);
  }

  async getHabitsByDate(userId: number, date: Date): Promise<Habit[]> {
    const habits = await this.getHabits(userId);
    const dateString = date.toISOString().slice(0, 10);
    
    // Filter habits based on frequency
    // In a real DB, we'd have a more sophisticated query
    return habits.filter(habit => {
      if (!habit.isActive) return false;
      
      // For simplicity, all habits are daily in this implementation
      return true;
    });
  }

  // HabitLog methods
  async createHabitLog(log: InsertHabitLog): Promise<HabitLog> {
    const id = this.currentId.habitLogs++;
    const habitLog: HabitLog = { ...log, id };
    const key = `${log.habitId}-${log.date.toISOString().slice(0, 10)}`;
    this.habitLogs.set(key, habitLog);
    return habitLog;
  }

  async getHabitLog(habitId: number, date: Date): Promise<HabitLog | undefined> {
    const key = `${habitId}-${date.toISOString().slice(0, 10)}`;
    return this.habitLogs.get(key);
  }

  async getHabitLogs(habitId: number, startDate: Date, endDate: Date): Promise<HabitLog[]> {
    const start = startDate.getTime();
    const end = endDate.getTime();
    
    return Array.from(this.habitLogs.values()).filter(log => {
      if (log.habitId !== habitId) return false;
      
      const logDate = new Date(log.date).getTime();
      return logDate >= start && logDate <= end;
    });
  }

  async updateHabitLog(id: number, logUpdate: Partial<HabitLog>): Promise<HabitLog> {
    const logs = Array.from(this.habitLogs.values());
    const logToUpdate = logs.find(log => log.id === id);
    
    if (!logToUpdate) throw new Error(`HabitLog with id ${id} not found`);
    
    const updatedLog = { ...logToUpdate, ...logUpdate };
    const key = `${updatedLog.habitId}-${updatedLog.date.toISOString().slice(0, 10)}`;
    this.habitLogs.set(key, updatedLog);
    
    return updatedLog;
  }

  async completeHabit(habitId: number, userId: number, date: Date, progress: number): Promise<HabitLog> {
    const dateStr = date.toISOString().slice(0, 10);
    const key = `${habitId}-${dateStr}`;
    
    // Get habit to check target
    const habit = await this.getHabit(habitId);
    if (!habit) throw new Error(`Habit with id ${habitId} not found`);
    
    // Check if existing log
    let log = this.habitLogs.get(key);
    
    // Determine completion status
    const completed = progress >= habit.target;
    
    if (!log) {
      // Create new log
      log = await this.createHabitLog({
        habitId,
        userId,
        date: new Date(dateStr),
        completed,
        progress
      });
    } else {
      // Update existing log
      log = {
        ...log,
        progress,
        completed
      };
      this.habitLogs.set(key, log);
    }
    
    // Update streak if completed
    if (completed) {
      const yesterday = new Date(date);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayLog = await this.getHabitLog(habitId, yesterday);
      
      let newStreak = 1; // Start with 1 for today
      
      if (yesterdayLog?.completed) {
        // Continuing streak
        newStreak = habit.currentStreak + 1;
      }
      
      // Update streak on habit
      const newLongestStreak = Math.max(habit.longestStreak, newStreak);
      await this.updateHabit(habitId, { 
        currentStreak: newStreak,
        longestStreak: newLongestStreak
      });
      
      // Add points to user
      await this.updateUserPoints(userId, 10);
      
      // Check for achievements
      await this.checkAndUnlockAchievements(userId);
    }
    
    return log;
  }

  // Achievement methods
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentId.achievements++;
    const newAchievement: Achievement = { ...achievement, id };
    this.achievements.set(id, newAchievement);
    return newAchievement;
  }

  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getUserAchievements(userId: number): Promise<(Achievement & { unlocked: boolean })[]> {
    const achievements = await this.getAchievements();
    const userAchievements = Array.from(this.userAchievements.values())
      .filter(ua => ua.userId === userId)
      .map(ua => ua.achievementId);
    
    return achievements.map(achievement => ({
      ...achievement,
      unlocked: userAchievements.includes(achievement.id)
    }));
  }

  async unlockAchievement(userId: number, achievementId: number): Promise<UserAchievement> {
    const key = `${userId}-${achievementId}`;
    
    // Check if already unlocked
    if (this.userAchievements.has(key)) {
      return this.userAchievements.get(key)!;
    }
    
    const id = this.currentId.userAchievements++;
    const userAchievement: UserAchievement = {
      id,
      userId,
      achievementId,
      unlockedAt: new Date()
    };
    
    this.userAchievements.set(key, userAchievement);
    
    // Award points
    await this.updateUserPoints(userId, 50);
    
    return userAchievement;
  }

  async checkAndUnlockAchievements(userId: number): Promise<UserAchievement[]> {
    const user = await this.getUser(userId);
    if (!user) throw new Error(`User with id ${userId} not found`);
    
    const habits = await this.getHabits(userId);
    const achievements = await this.getAchievements();
    const unlockedAchievements: UserAchievement[] = [];
    
    // Get current date for today's habits
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    
    // Find completed habits today
    const completedHabitsToday = Array.from(this.habitLogs.values())
      .filter(log => 
        log.userId === userId && 
        log.completed && 
        log.date.toISOString().slice(0, 10) === todayStr
      );
    
    for (const achievement of achievements) {
      // Check based on achievement criteria
      let shouldUnlock = false;
      
      if (achievement.requiredStreak && habits.some(h => h.currentStreak >= achievement.requiredStreak!)) {
        shouldUnlock = true;
      }
      
      if (achievement.requiredHabits && completedHabitsToday.length >= achievement.requiredHabits) {
        shouldUnlock = true;
      }
      
      if (achievement.requiredPoints && user.points >= achievement.requiredPoints) {
        shouldUnlock = true;
      }
      
      if (shouldUnlock) {
        const key = `${userId}-${achievement.id}`;
        if (!this.userAchievements.has(key)) {
          const unlockedAchievement = await this.unlockAchievement(userId, achievement.id);
          unlockedAchievements.push(unlockedAchievement);
        }
      }
    }
    
    return unlockedAchievements;
  }
}

export const storage = new MemStorage();
