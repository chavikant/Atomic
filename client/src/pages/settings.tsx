import { useState } from "react";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Moon, 
  LogOut
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");
  const { user, logout } = useAuth();

  // Default user data if no data
  const userData = { 
    name: user?.name || "Guest User", 
    email: user?.email || "guest@example.com", 
    username: user?.username || "guest"
  };

  return (
    <>
      <header className="bg-white p-4 border-b border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        </div>
      </header>

      <div className="p-4 sm:p-6">
        <Tabs 
          defaultValue="account" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account information and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-semibold text-gray-600">
                      {userData.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{userData.name}</h3>
                      <p className="text-sm text-gray-500">{userData.email}</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Change Photo
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={userData.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue={userData.username} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue={userData.email} type="email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input id="timezone" defaultValue="UTC-5 (Eastern Time)" />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <Label htmlFor="metric-system" className="text-base">
                      Use Metric System
                    </Label>
                    <Switch id="metric-system" defaultChecked />
                  </div>

                  <div className="pt-4 flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications about your habits.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Habit Reminders</h3>
                      <p className="text-sm text-gray-500">Receive reminders for your habits</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Achievement Notifications</h3>
                      <p className="text-sm text-gray-500">Be notified when you unlock achievements</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Weekly Reports</h3>
                      <p className="text-sm text-gray-500">Get a weekly summary of your progress</p>
                    </div>
                    <Switch />
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">New Features</h3>
                      <p className="text-sm text-gray-500">Learn about new app features and updates</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="pt-4 flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control your data and privacy preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Data Collection</h3>
                      <p className="text-sm text-gray-500">Allow anonymous usage data to improve the app</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Show Profile in Community</h3>
                      <p className="text-sm text-gray-500">Make your profile visible to others in the community</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Show Streak in Leaderboard</h3>
                      <p className="text-sm text-gray-500">Display your habit streaks on community leaderboards</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Data Export & Deletion</h3>
                    <div className="flex gap-3">
                      <Button variant="outline">Export Data</Button>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize how the app looks.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Theme</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="border border-primary rounded-lg p-3 cursor-pointer bg-white">
                        <div className="h-16 bg-gray-50 rounded-md mb-2 flex items-center justify-center text-gray-800">
                          Light
                        </div>
                        <p className="text-xs text-center font-medium">Light Mode</p>
                      </div>
                      <div className="border rounded-lg p-3 cursor-pointer hover:border-primary">
                        <div className="h-16 bg-gray-800 rounded-md mb-2 flex items-center justify-center text-gray-200">
                          Dark
                        </div>
                        <p className="text-xs text-center font-medium">Dark Mode</p>
                      </div>
                      <div className="border rounded-lg p-3 cursor-pointer hover:border-primary">
                        <div className="h-16 bg-gradient-to-br from-gray-50 to-gray-800 rounded-md mb-2 flex items-center justify-center text-gray-600">
                          Auto
                        </div>
                        <p className="text-xs text-center font-medium">System Default</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-3">Color Scheme</h3>
                    <div className="grid grid-cols-5 gap-3">
                      <div className="cursor-pointer">
                        <div className="h-10 w-10 rounded-full border-2 border-primary bg-indigo-600 mx-auto"></div>
                        <p className="text-xs text-center mt-1">Indigo</p>
                      </div>
                      <div className="cursor-pointer">
                        <div className="h-10 w-10 rounded-full bg-blue-600 mx-auto"></div>
                        <p className="text-xs text-center mt-1">Blue</p>
                      </div>
                      <div className="cursor-pointer">
                        <div className="h-10 w-10 rounded-full bg-green-600 mx-auto"></div>
                        <p className="text-xs text-center mt-1">Green</p>
                      </div>
                      <div className="cursor-pointer">
                        <div className="h-10 w-10 rounded-full bg-amber-600 mx-auto"></div>
                        <p className="text-xs text-center mt-1">Amber</p>
                      </div>
                      <div className="cursor-pointer">
                        <div className="h-10 w-10 rounded-full bg-red-600 mx-auto"></div>
                        <p className="text-xs text-center mt-1">Red</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Reduce Animations</h3>
                      <p className="text-sm text-gray-500">For improved performance and reduced motion</p>
                    </div>
                    <Switch />
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Compact Mode</h3>
                      <p className="text-sm text-gray-500">Display more content with reduced spacing</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="pt-4 flex justify-end gap-2">
                    <Button variant="outline">Reset to Default</Button>
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="font-medium">Sign Out of Your Account</h3>
                <p className="text-sm text-gray-500">You can sign back in at any time</p>
              </div>
              <Button 
                variant="destructive" 
                className="flex items-center gap-2"
                onClick={() => logout()}
              >
                <LogOut className="h-4 w-4" /> 
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
