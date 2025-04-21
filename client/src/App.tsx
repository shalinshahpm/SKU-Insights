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
import { ThemeProvider } from "next-themes";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/sku-management" component={SKUManagement} />
      <Route path="/behavioral" component={Behavioral} />
      <Route path="/survey-builder" component={SurveyBuilder} />
      <Route path="/brand-health" component={BrandHealth} />
      <Route path="/insights-timeline" component={InsightsTimeline} />
      <Route path="/user-management" component={UserManagement} />
      <Route path="/account-settings" component={AccountSettings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
