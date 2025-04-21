import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const IndexPage = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Navigation */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SKU Pulse</a>
          <nav className="hidden md:flex gap-10 text-sm font-medium">
            <a href="#features" className="hover:text-blue-600">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600">How It Works</a>
            <a href="#case-study" className="hover:text-blue-600">Success Stories</a>
            <a href="#pricing" className="hover:text-blue-600">Pricing</a>
          </nav>
          <div className="flex items-center space-x-4 text-sm">
            <Link href="/auth">
              <a className="hover:text-blue-600">Sign In</a>
            </Link>
            <Link href="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">Command launch performance before the market does</h1>
              <p className="text-xl text-gray-600 mb-8">SKU Pulse empowers commercial leaders to identify launch risks and capitalize on demand signals in real time. Powered by XENA API sales tracking and Kantar market panels, SKU Pulse transforms scattered insight into confident decisions.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth">
                  <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white">Start Free Trial</Button>
                </Link>
                <Link href="/auth">
                  <Button variant="outline" className="px-6 py-3">Watch Demo</Button>
                </Link>
              </div>
              <p className="text-sm mt-6 text-gray-500 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4"></path>
                </svg>
                No credit card · 14-day trial · Built for CPG Enterprises
              </p>
            </div>
            <div className="relative">
              <div className="absolute -top-6 -left-6 bg-blue-100 h-full w-full rounded-xl -z-10"></div>
              <img 
                src="https://source.unsplash.com/600x350/?dashboard,analytics" 
                alt="Dashboard Preview" 
                className="rounded-xl shadow-md w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Brands */}
        <section className="py-12">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-500 text-sm mb-6 uppercase">Trusted by global CPG leaders</p>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/1/13/Coca-Cola_logo.svg" className="h-8 opacity-70 grayscale" alt="Coca-Cola" />
              <img src="https://upload.wikimedia.org/wikipedia/en/8/8a/Pepsi_logo_2014.svg" className="h-8 opacity-70 grayscale" alt="PepsiCo" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Unilever_Logo.svg" className="h-8 opacity-70 grayscale" alt="Unilever" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Nestle_textlogo.svg" className="h-8 opacity-70 grayscale" alt="Nestle" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Procter_%26_Gamble_logo.svg" className="h-8 opacity-70 grayscale" alt="Procter & Gamble" />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Built for Commercial Leaders</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">SKU Pulse integrates category-level sales intelligence from XENA and market sentiment from Kantar panels, arming you with a precise read on new product viability, trajectory, and intervention points—across every major channel.</p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
                <p className="text-gray-600">Monitor critical product metrics across multiple regions and retailers in a single unified dashboard.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Anomaly Detection</h3>
                <p className="text-gray-600">AI-powered alerts when your metrics deviate from expected thresholds, enabling rapid response.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Launch Radar</h3>
                <p className="text-gray-600">Track new product launches from day one with phase-based metrics and actionable insights.</p>
              </div>
            </div>
            
            <div className="mt-12">
              <Link href="/auth">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Explore All Features
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-gray-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Define the signals that matter—velocity, sentiment, conversion—and SKU Pulse will continuously track deviations and triggers so your teams can act before reports arrive.</p>
            
            <div className="mt-16">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="relative">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold z-10">1</div>
                  <div className="border border-gray-200 rounded-lg p-6 bg-white h-full">
                    <h3 className="text-lg font-semibold mb-2">Connect Data</h3>
                    <p className="text-gray-600 text-sm">Integrate with your existing data sources and ecommerce platforms.</p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold z-10">2</div>
                  <div className="border border-gray-200 rounded-lg p-6 bg-white h-full">
                    <h3 className="text-lg font-semibold mb-2">Set Thresholds</h3>
                    <p className="text-gray-600 text-sm">Define success metrics and critical thresholds for each product phase.</p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold z-10">3</div>
                  <div className="border border-gray-200 rounded-lg p-6 bg-white h-full">
                    <h3 className="text-lg font-semibold mb-2">Monitor</h3>
                    <p className="text-gray-600 text-sm">Get real-time alerts and insights on your dashboard.</p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold z-10">4</div>
                  <div className="border border-gray-200 rounded-lg p-6 bg-white h-full">
                    <h3 className="text-lg font-semibold mb-2">Take Action</h3>
                    <p className="text-gray-600 text-sm">Deploy recommended interventions and track their impact.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16">
              <Link href="/auth">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  See It In Action
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section id="case-study" className="py-24 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Proven Impact</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">A leading CPG brand averted $1.2M in lost revenue when SKU Pulse flagged allergen-related sentiment spikes within 48 hours of launch. Messaging updates were deployed before market erosion could take hold.</p>
            
            <div className="mt-12 bg-blue-50 rounded-xl p-8 max-w-3xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                  </svg>
                </div>
                <blockquote className="text-lg italic text-gray-700 mb-4">
                  "SKU Pulse gave us an early warning that would have taken weeks to surface through traditional analytics. The ROI was immediate and compelling."
                </blockquote>
                <div>
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">VP of Global Marketing, Fortune 500 CPG Company</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">48hr</div>
                <p className="text-sm text-gray-600">Early warning detection</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">$1.2M</div>
                <p className="text-sm text-gray-600">Revenue protected</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">3x</div>
                <p className="text-sm text-gray-600">Faster intervention</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 bg-blue-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Launch Smarter?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">Let's talk about how SKU Pulse can deliver predictive commercial insight tailored to your portfolio. Our plans are custom-fit for scale and strategy.</p>
            <Link href="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700">Try For Free</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-10 text-sm text-gray-500 text-center">
        <div className="container mx-auto px-6">
          <p>&copy; 2025 SKU Pulse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default IndexPage;