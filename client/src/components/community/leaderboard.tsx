import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BarChart4,
  Medal,
  Crown,
  Award,
  TrendingUp,
  Flame,
  Star,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

interface LeaderboardUser {
  id: number;
  name: string;
  username: string;
  points: number;
  streak: number;
  rank: number;
  isCurrentUser: boolean;
}

export function Leaderboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [leaderboardType, setLeaderboardType] = useState<"points" | "streak">("points");
  const [timeFrame, setTimeFrame] = useState<"week" | "month" | "all">("week");

  // Real API call for leaderboard data
  const { data: leaderboardData, isLoading } = useQuery<LeaderboardUser[]>({
    queryKey: ["/api/leaderboard", leaderboardType, timeFrame],
    queryFn: async ({ queryKey }) => {
      const [_, type, timeFrame] = queryKey as [string, string, string];
      const response = await fetch(`/api/leaderboard?type=${type}&timeFrame=${timeFrame}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }
      
      return response.json();
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    // If data isn't available yet, return an empty array to prevent errors
    placeholderData: [],
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to load leaderboard data. Please try again later.",
        variant: "destructive"
      });
      console.error('Leaderboard error:', error);
    }
  });

  function getRankIcon(rank: number) {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="text-gray-500">{rank}</span>;
    }
  }

  function getAvatarFallback(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  const currentUserRank = leaderboardData?.find(u => u.isCurrentUser)?.rank || 0;

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <BarChart4 className="h-5 w-5" />
              Leaderboard
            </CardTitle>
            <CardDescription>
              See how you compare with the community
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-100 rounded-lg p-1">
              <Button
                variant={leaderboardType === "points" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLeaderboardType("points")}
                className="px-3"
              >
                <Star className="h-4 w-4 mr-1" />
                Points
              </Button>
              <Button
                variant={leaderboardType === "streak" ? "default" : "ghost"}
                size="sm"
                onClick={() => setLeaderboardType("streak")}
                className="px-3"
              >
                <Flame className="h-4 w-4 mr-1" />
                Streaks
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={timeFrame === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeFrame("week")}
              className="text-xs px-2"
            >
              Week
            </Button>
            <Button
              variant={timeFrame === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeFrame("month")}
              className="text-xs px-2"
            >
              Month
            </Button>
            <Button
              variant={timeFrame === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeFrame("all")}
              className="text-xs px-2"
            >
              All Time
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                  {typeof currentUserRank === 'number' && currentUserRank <= 3 ? 
                    getRankIcon(currentUserRank) : 
                    <UserIcon className="h-5 w-5" />
                  }
                </div>
                <div>
                  <p className="font-medium">Your Ranking</p>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold">{currentUserRank === 0 ? "-" : currentUserRank}</span>
                    <span className="text-gray-500 text-sm">of {leaderboardData?.length || 0}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm">Your {leaderboardType}</p>
                <p className="text-xl font-bold">
                  {leaderboardType === "points" 
                    ? leaderboardData?.find(u => u.isCurrentUser)?.points || 0
                    : leaderboardData?.find(u => u.isCurrentUser)?.streak || 0}
                  <span className="text-sm font-normal ml-1">
                    {leaderboardType === "points" ? "pts" : "days"}
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12 text-center">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">
                      {leaderboardType === "points" ? "Points" : "Streak"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardData?.slice(0, 10).map((user) => (
                    <TableRow 
                      key={user.id}
                      className={user.isCurrentUser ? "bg-primary/5" : undefined}
                    >
                      <TableCell className="text-center font-medium">
                        {getRankIcon(user.rank)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getAvatarFallback(user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium flex items-center gap-1">
                              {user.name}
                              {user.isCurrentUser && (
                                <Badge variant="outline" className="text-xs py-0 h-5">
                                  You
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">@{user.username}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <div className="flex items-center justify-end gap-1">
                          {leaderboardType === "points" ? (
                            <>
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span>{user.points}</span>
                            </>
                          ) : (
                            <>
                              <Flame className="h-4 w-4 text-orange-500" />
                              <span>{user.streak} days</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Invite friends",
                    description: "Share your progress and invite friends to join the challenge!",
                  });
                }}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Invite friends to climb the ranks
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}