import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Habits from "@/pages/habits";
import Analytics from "@/pages/analytics";
import Community from "@/pages/community";
import Settings from "@/pages/settings";
import AuthPage from "@/pages/auth-page";
import MainLayout from "@/layouts/main-layout";
import { useState, useEffect } from "react";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/protected-route";

// Theme setup
import "./index.css";

function Router() {
  return (
    <Switch>
      <Route path="/auth">
        <AuthPage />
      </Route>
      <Route path="/">
        <ProtectedRoute>
          <MainLayout>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/habits" component={Habits} />
              <Route path="/analytics" component={Analytics} />
              <Route path="/community" component={Community} />
              <Route path="/settings" component={Settings} />
              <Route component={NotFound} />
            </Switch>
          </MainLayout>
        </ProtectedRoute>
      </Route>
    </Switch>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state for initial data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Atomic Habits</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Building better habits...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
