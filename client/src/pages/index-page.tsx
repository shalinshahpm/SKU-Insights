import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  MessageSquare, 
  Zap, 
  TrendingUp, 
  Shield, 
  Users,
  Target,
  Briefcase,
  Download,
  Calendar,
  Play
} from 'lucide-react';

const IndexPage = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Navigation */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold gradient-text">SKU Pulse</span>
          <nav className="hidden md:flex gap-10 text-sm font-medium">
            <a href="#features" className="hover:text-blue-600">Features</a>
            <a href="#audiences" className="hover:text-blue-600">Teams</a>
            <a href="#testimonials" className="hover:text-blue-600">Clients</a>
            <a href="#contact" className="hover:text-blue-600">Contact</a>
          </nav>
          <div className="flex items-center gap-4">
            <Button 
              variant="link" 
              className="text-sm p-0 m-0 h-auto"
              onClick={() => window.location.href = '/auth'}
            >
              Sign In
            </Button>
            <a href="#contact" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">Talk to Us</a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
              Launch Winning CPG Products with 
              <span className="gradient-text"> Confidence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The real-time growth command center for brand managers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a href="#contact" className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 text-lg font-medium">
                Schedule Call
              </a>
              <Button 
                variant="outline" 
                className="px-8 py-4 text-lg"
                onClick={() => window.location.href = '/auth'}
              >
                Try SKU Signal Demo
              </Button>
            </div>
            <div className="relative max-w-4xl mx-auto">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop&crop=center" 
                className="rounded-xl shadow-2xl w-full h-auto object-cover"
                alt="Dashboard Preview" 
              />
            </div>
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section className="py-24 bg-red-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6 text-red-900">
              80% of new SKUs fail. It doesn't have to be yours.
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Pre-launch validation</h3>
                <p className="text-gray-600">Test concepts before costly market entry</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Real-time alerts</h3>
                <p className="text-gray-600">Catch performance issues in hours, not weeks</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Unified data view</h3>
                <p className="text-gray-600">See all your SKU metrics in one dashboard</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE OVERVIEW */}
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Three Intelligence Engines. One Platform.</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Bloomberg for CPG - comprehensive market intelligence at your fingertips
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Marketplace Intelligence */}
              <div className="text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Marketplace Intelligence</h3>
                <p className="text-gray-600 mb-6">
                  Track SKU performance across Amazon, Walmart, Target, and 50+ retailers with real-time sales data and competitive insights.
                </p>
                <div className="bg-gray-100 rounded-lg p-4">
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop" 
                    alt="Marketplace Analytics"
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              </div>

              {/* Consumer Sentiment Engine */}
              <div className="text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Consumer Sentiment Engine</h3>
                <p className="text-gray-600 mb-6">
                  AI-powered analysis of reviews, social media, and survey data to predict consumer behavior and identify friction points.
                </p>
                <div className="bg-gray-100 rounded-lg p-4">
                  <img 
                    src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop" 
                    alt="Sentiment Analysis"
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              </div>

              {/* SKU Pulse */}
              <div className="text-center">
                <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">SKU Pulse</h3>
                <p className="text-gray-600 mb-6">
                  Instant anomaly detection and intervention recommendations powered by machine learning and industry benchmarks.
                </p>
                <div className="bg-gray-100 rounded-lg p-4">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop" 
                    alt="Real-time Alerts"
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MARKET STATS */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-12">The CPG Launch Challenge</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-5xl font-bold mb-2">4M</div>
                <p className="text-blue-100">New SKUs launched globally per year</p>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">$2B</div>
                <p className="text-blue-100">Invested in R&D annually</p>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">80%</div>
                <p className="text-blue-100">Failure rate within first year</p>
              </div>
            </div>
            <div className="mt-12 bg-white/10 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-xl italic">
                "Bloomberg for CPG" - The definitive platform for consumer goods intelligence
              </p>
            </div>
          </div>
        </section>

        {/* AUDIENCE TARGETING */}
        <section id="audiences" className="py-24 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Built for High-Performance Teams</h2>
              <p className="text-xl text-gray-600">Tailored workflows for every role in your launch process</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Brand Teams</h3>
                <ul className="text-gray-600 space-y-3">
                  <li>• Track brand health metrics</li>
                  <li>• Monitor competitive positioning</li>
                  <li>• Optimize marketing spend</li>
                  <li>• Launch intervention playbooks</li>
                </ul>
                <Button className="mt-6 w-full" onClick={() => window.location.href = '/auth'}>
                  Explore Brand Dashboard
                </Button>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Insights Teams</h3>
                <ul className="text-gray-600 space-y-3">
                  <li>• Consumer sentiment analysis</li>
                  <li>• Market research automation</li>
                  <li>• Predictive modeling</li>
                  <li>• Custom survey deployment</li>
                </ul>
                <Button className="mt-6 w-full" onClick={() => window.location.href = '/auth'}>
                  View Analytics Suite
                </Button>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <Briefcase className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Commercial Teams</h3>
                <ul className="text-gray-600 space-y-3">
                  <li>• Sales performance tracking</li>
                  <li>• Retailer relationship insights</li>
                  <li>• Revenue optimization</li>
                  <li>• Account-specific dashboards</li>
                </ul>
                <Button className="mt-6 w-full" onClick={() => window.location.href = '/auth'}>
                  Access Sales Hub
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS & LOGOS */}
        <section id="testimonials" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Trusted by Industry Leaders</h2>
              <div className="flex justify-center gap-12 items-center flex-wrap opacity-60">
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/13/Coca-Cola_logo.svg" className="h-8" alt="Coca-Cola" />
                <img src="https://upload.wikimedia.org/wikipedia/en/8/8a/Pepsi_logo_2014.svg" className="h-8" alt="Pepsi" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Unilever_Logo.svg" className="h-8" alt="Unilever" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Nestle_textlogo.svg" className="h-8" alt="Nestle" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Procter_%26_Gamble_logo.svg" className="h-8" alt="P&G" />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-blue-50 rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Sarah Chen</p>
                    <p className="text-sm text-gray-600">VP of Global Marketing, Fortune 500 CPG</p>
                  </div>
                </div>
                <blockquote className="text-lg italic text-gray-700">
                  "SKU Pulse detected a trending issue 3 weeks before our traditional analytics would have caught it. We pivoted our launch strategy and saved $2.3M in marketing spend."
                </blockquote>
              </div>

              <div className="bg-green-50 rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Marcus Rodriguez</p>
                    <p className="text-sm text-gray-600">Brand Director, Global Food Company</p>
                  </div>
                </div>
                <blockquote className="text-lg italic text-gray-700">
                  "The consumer sentiment engine is game-changing. We now launch with confidence knowing exactly what drives purchase intent in each market."
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FOOTER */}
        <section id="contact" className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Validate, Launch & Grow Winning SKUs?</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12">
              Join the brands using SKU Pulse to turn launch uncertainty into predictable growth
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a 
                href="https://www.linkedin.com/in/shalinshah2/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 text-lg font-medium flex items-center justify-center gap-2"
              >
                <Calendar className="h-5 w-5" />
                Schedule Call
              </a>
              
              <Button 
                variant="outline" 
                className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => {/* Add download functionality */}}
              >
                <Download className="h-5 w-5 mr-2" />
                Download One-Pager
              </Button>
              
              <Button 
                className="bg-green-500 hover:bg-green-600 px-8 py-4 text-lg"
                onClick={() => window.location.href = '/auth'}
              >
                <Play className="h-5 w-5 mr-2" />
                Try SKU Signal Demo
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">SKU Pulse</h3>
              <p className="text-sm">The Bloomberg of CPG intelligence</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2025 SKU Pulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IndexPage;