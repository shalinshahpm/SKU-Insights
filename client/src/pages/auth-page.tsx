import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

const AuthPage = () => {
  const { toast } = useToast();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  
  // Redirect to dashboard if already logged in
  if (user) {
    return <Link href="/" replace><a></a></Link>;
  }

  // Login form state
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    role: "Brand Manager", // Default role
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.username || !loginData.password) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    loginMutation.mutate(loginData);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.username || !registerData.password || !registerData.fullName || !registerData.email) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    registerMutation.mutate(registerData);
  };

  return (
    <div className="min-h-screen flex">
      {/* Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 to-indigo-700 p-12 flex-col justify-between text-white">
        <div>
          <h1 className="text-4xl font-bold mb-6">SKU Insights</h1>
          <h2 className="text-2xl font-semibold mb-4">Intelligence for CPG Commercial Leaders</h2>
          <p className="text-lg opacity-90 mb-8">
            Command launch performance before the market does. SKU Insights empowers commercial leaders
            to identify launch risks and capitalize on demand signals in real time.
          </p>
          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Real-time Insights</h3>
                <p className="opacity-80 text-sm">Monitor performance metrics across all markets in one dashboard</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Anomaly Detection</h3>
                <p className="opacity-80 text-sm">AI-powered alerts when metrics deviate from expected thresholds</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Launch Radar</h3>
                <p className="opacity-80 text-sm">Track new product launches from day one with phase-based metrics</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-sm opacity-80">
          © 2025 SKU Insights. All rights reserved.
        </div>
      </div>
      
      {/* Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Welcome to SKU Insights</h1>
            <p className="text-gray-600">Sign in to access your dashboard</p>
          </div>
          
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Create Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <form onSubmit={handleLoginSubmit}>
                  <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>
                      Enter your credentials to access your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        type="text" 
                        placeholder="Enter your username"
                        value={loginData.username}
                        onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <a href="#" className="text-sm text-blue-600 hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <Input 
                        id="password" 
                        type="password"
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <form onSubmit={handleRegisterSubmit}>
                  <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>
                      Register for a new account to access SKU Insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-fullname">Full Name</Label>
                      <Input 
                        id="register-fullname" 
                        type="text"
                        placeholder="Enter your full name"
                        value={registerData.fullName}
                        onChange={(e) => setRegisterData({...registerData, fullName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input 
                        id="register-email" 
                        type="email"
                        placeholder="Enter your email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-username">Username</Label>
                      <Input 
                        id="register-username" 
                        type="text"
                        placeholder="Choose a username"
                        value={registerData.username}
                        onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input 
                        id="register-password" 
                        type="password"
                        placeholder="Create a password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-role">Role</Label>
                      <select
                        id="register-role"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={registerData.role}
                        onChange={(e) => setRegisterData({...registerData, role: e.target.value})}
                      >
                        <option value="Brand Manager">Brand Manager</option>
                        <option value="Regional Insights Lead">Regional Insights Lead</option>
                        <option value="Global Marketing Operations">Global Marketing Operations</option>
                      </select>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => window.location.href = '/dashboard'}
            >
              Continue as Guest
            </Button>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              By signing in, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;