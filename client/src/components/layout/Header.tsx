import { useState } from "react";
import { Search, Menu, Bell, HelpCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface HeaderProps {
  onOpenSidebar: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const [notificationCount] = useState(3);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-border">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="hidden md:flex items-center space-x-2"
          onClick={() => window.location.href = '/'}
        >
          <Home className="h-4 w-4" />
          <span>Back to Home</span>
        </Button>
      </div>
      
      <div className="flex-1 flex justify-between md:justify-end">
        <div className="relative w-full max-w-xl md:max-w-md lg:max-w-lg">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search"
            placeholder="Search..." 
            className="w-full pl-10 pr-4 py-2"
          />
        </div>
        
        <div className="flex items-center ml-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            {notificationCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-accent text-accent-foreground"
              >
                {notificationCount}
              </Badge>
            )}
          </Button>
          <Button variant="ghost" size="icon" className="ml-2">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </Button>
          
          {/* Mobile back to home button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-2 md:hidden"
            onClick={() => window.location.href = '/'}
          >
            <Home className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </header>
  );
}
