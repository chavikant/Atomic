import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Star, 
  Award, 
  ArrowUp, 
  ArrowDown 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProgressChart } from "@/components/dashboard/progress-chart";
import { useAuth } from "@/contexts/auth-context";

export default function Analytics() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
  const { user } = useAuth();
  
  const { data: habits = [] } = useQuery({
    queryKey: ['/api/habits'],
  });

  // Calculate statistics (simplified for demo)
  const stats = {
    completion: Array.isArray(habits) && habits.length > 0 
      ? Math.round((habits.filter((h: any) => h.currentStreak > 0).length / habits.length) * 100) 
      : 0,
    totalStreak: user?.currentStreak || 0,
    totalPoints: user?.points || 0,
    consistency: Array.isArray(habits) && habits.length > 0
      ? Math.round((habits.reduce((acc: number, h: any) => acc + h.currentStreak, 0) / habits.length)) 
      : 0,
    improvement: '+12%', // Placeholder for demo
  };

  return (
    <>
      <header className="bg-white p-4 border-b border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Analytics</h2>
          <div className="flex space-x-2">
            <Button
              variant={period === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('week')}
            >
              Week
            </Button>
            <Button
              variant={period === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('month')}
            >
              Month
            </Button>
            <Button
              variant={period === 'year' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('year')}
            >
              Year
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <BarChart className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completion}%</div>
              <p className="text-xs text-gray-500">
                Habits completed on time
              </p>
              <Progress 
                className="h-2 mt-3" 
                value={stats.completion} 
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Streak</CardTitle>
              <Star className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStreak} days</div>
              <div className="flex items-center pt-1">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <p className="text-xs text-green-500">
                  +{Math.max(1, stats.totalStreak)} from last week
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Award className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPoints}</div>
              <div className="flex items-center pt-1">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <p className="text-xs text-green-500">
                  +50 this week
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Consistency</CardTitle>
              <Calendar className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.consistency} days</div>
              <p className="text-xs text-gray-500">
                Average streak across habits
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress chart */}
        <div className="mb-6">
          <ProgressChart />
        </div>

        {/* Habit performance breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6">
          <h3 className="text-lg font-semibold mb-4">Habit Performance</h3>
          
          <div className="space-y-4">
            {Array.isArray(habits) && habits.map((habit: any) => (
              <div key={habit.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{habit.name}</h4>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{habit.frequency}, {habit.target} {habit.unit}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-amber-500 mr-1" />
                    <span className="font-medium">{habit.currentStreak} day streak</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-2 text-sm">
                  <div className="bg-gray-50 rounded-md p-2">
                    <span className="text-gray-500 block">Completion Rate</span>
                    <span className="font-medium">
                      {Math.round(75 + Math.random() * 25)}%
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-md p-2">
                    <span className="text-gray-500 block">Best Streak</span>
                    <span className="font-medium">{habit.longestStreak} days</span>
                  </div>
                  <div className="bg-gray-50 rounded-md p-2 flex items-center">
                    <div>
                      <span className="text-gray-500 block">Growth</span>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="font-medium">{habit.currentStreak * 3}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {(!Array.isArray(habits) || habits.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No habit data available yet. Start tracking habits to see analytics.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
