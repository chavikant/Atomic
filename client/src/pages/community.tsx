import React from "react";
import { Users, MessageSquare, Share2, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Community() {
  // This page is a placeholder/mockup for the community feature
  // In a full implementation, we would fetch real community data

  return (
    <>
      <header className="bg-white p-4 border-b border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Community</h2>
          <Button>Join a Challenge</Button>
        </div>
      </header>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Community features */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Atomic Habits Community</CardTitle>
                <CardDescription>
                  Connect with others on their habit-building journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/5 rounded-lg p-4 mb-6">
                  <h3 className="font-medium mb-2">Coming Soon!</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    We're working on building a community feature to help you connect with others,
                    join challenges, and stay motivated on your habit-building journey.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <Users className="h-6 w-6 text-primary mx-auto mb-1" />
                      <p className="text-xs font-medium">Friend Challenges</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <MessageSquare className="h-6 w-6 text-primary mx-auto mb-1" />
                      <p className="text-xs font-medium">Discussion Forums</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <Share2 className="h-6 w-6 text-primary mx-auto mb-1" />
                      <p className="text-xs font-medium">Progress Sharing</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <Award className="h-6 w-6 text-primary mx-auto mb-1" />
                      <p className="text-xs font-medium">Group Achievements</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Join the Waiting List</h3>
                  <div className="flex gap-2">
                    <Input placeholder="Enter your email" />
                    <Button>Subscribe</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Challenges</CardTitle>
                <CardDescription>
                  Join a challenge to boost your habit-building motivation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">30-Day Reading Challenge</h4>
                        <p className="text-sm text-gray-500">Read every day for 30 days</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-3 text-sm">
                      <div className="flex -space-x-2">
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs">JD</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs">MK</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs">TS</AvatarFallback>
                        </Avatar>
                      </div>
                      <span className="text-gray-500">24 participants</span>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-500">Ends in 22 days</span>
                    </div>
                    <Button className="w-full mt-3">Join Challenge</Button>
                  </div>

                  <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Morning Routine Builder</h4>
                        <p className="text-sm text-gray-500">Establish a consistent morning routine</p>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                        Upcoming
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-3 text-sm">
                      <div className="flex -space-x-2">
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs">AL</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs">BD</AvatarFallback>
                        </Avatar>
                      </div>
                      <span className="text-gray-500">12 participants</span>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-500">Starts in 3 days</span>
                    </div>
                    <Button variant="outline" className="w-full mt-3">Remind Me</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Leaderboard</CardTitle>
                <CardDescription>
                  Top performers this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 w-8 h-8 rounded-full flex items-center justify-center text-amber-800 font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Sarah J.</p>
                        <p className="text-xs text-gray-500">7 day streak</p>
                      </div>
                    </div>
                    <div className="flex items-center text-green-600 text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>245 pts</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center text-gray-800 font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Michael T.</p>
                        <p className="text-xs text-gray-500">5 day streak</p>
                      </div>
                    </div>
                    <div className="flex items-center text-green-600 text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>210 pts</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-50 w-8 h-8 rounded-full flex items-center justify-center text-amber-700 font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Alex J.</p>
                        <p className="text-xs text-gray-500">4 day streak</p>
                      </div>
                    </div>
                    <div className="flex items-center text-green-600 text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>180 pts</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View Full Leaderboard
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips & Motivation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-3 py-1">
                    <p className="text-sm italic">
                      "Small habits don't add up, they compound. That's the power of atomic habits."
                    </p>
                    <p className="text-xs text-gray-500 mt-1">- James Clear</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Quick Tip</h4>
                    <p className="text-sm text-gray-600">
                      Try "habit stacking" - link a new habit to an existing one to increase your chances of success.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Did You Know?</h4>
                    <p className="text-sm text-gray-600">
                      It takes an average of 66 days to form a new habit, not the commonly cited 21 days.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
