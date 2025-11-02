import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthLayout } from "@/components/Auth/AuthLayout";
import { AppLayout } from "@/components/Layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Journal from "@/pages/Journal";
import Zenora from "@/pages/Zenora";
import Exercises from "@/pages/Exercises";
import Rewards from "@/pages/Rewards";
import Insights from "@/pages/Insights";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import WellnessResources from "@/pages/WellnessResources";
import Progress from "@/pages/Progress";
import "@/i18n";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, loading } = useAuth();

  // Initialize theme on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('zenora-theme') || 'dark';
    const root = document.documentElement;
    
    if (storedTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(storedTheme);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-wellness flex items-center justify-center">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 bg-white rounded-full animate-bounce" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthLayout />;
  }

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/zenora" element={<Zenora />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/wellness-resources" element={<WellnessResources />} />
        <Route path="/progress" element={<Progress />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
