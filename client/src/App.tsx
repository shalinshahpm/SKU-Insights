import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import SKUManagement from "@/pages/SKUManagement";
import Behavioral from "@/pages/Behavioral";
import SurveyBuilder from "@/pages/SurveyBuilder";
import BrandHealth from "@/pages/BrandHealth";
import InsightsTimeline from "@/pages/InsightsTimeline";
import UserManagement from "@/pages/UserManagement";
import AccountSettings from "@/pages/AccountSettings";
import AuthPage from "@/pages/auth-page";
import IndexPage from "@/pages/index-page";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={IndexPage} />
      <Route path="/auth" component={AuthPage} />

      {/* Protected routes */}
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/sku-management" component={SKUManagement} />
      <ProtectedRoute path="/behavioral" component={Behavioral} />
      <ProtectedRoute path="/survey-builder" component={SurveyBuilder} />
      <ProtectedRoute path="/brand-health" component={BrandHealth} />
      <ProtectedRoute path="/insights-timeline" component={InsightsTimeline} />
      <ProtectedRoute path="/user-management" component={UserManagement} />
      <ProtectedRoute path="/account-settings" component={AccountSettings} />
      
      {/* 404 route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
