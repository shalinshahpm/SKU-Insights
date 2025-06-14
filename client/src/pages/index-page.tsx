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
  Play,
  Star
} from 'lucide-react';

const IndexPage = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Navigation */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold gradient-text">SKU Insights</span>
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
            <a href="https://www.linkedin.com/in/shalinshah2/" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">Talk to Us</a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION - ROI FOCUSED */}
        <section className="pt-32 pb-20 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
          <div className="container mx-auto px-6">
            {/* Trust Banner */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trusted by CPG leaders across 47 countries
              </div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="text-left">
                <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Stop Guessing.<br />
                  <span className="gradient-text">Start Winning.</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  The only platform that predicts SKU success before launch and maximizes performance after launch. 
                  <strong className="text-gray-900">Average ROI: 340% in first year.</strong>
                </p>
                
                {/* Key Benefits */}
                <div className="mb-8 space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Reduce SKU failure rate by 67%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Cut launch costs by 45% through pre-validation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Increase velocity 3x faster with automated triggers</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <a href="https://www.linkedin.com/in/shalinshah2/" target="_blank" rel="noopener noreferrer" className="bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 text-lg font-medium text-center">
                    Schedule a Call
                  </a>
                  <Button 
                    variant="outline" 
                    className="px-8 py-4 text-lg border-2 border-gray-300 hover:border-emerald-600"
                    onClick={() => window.location.href = '/auth'}
                  >
                    See Live Demo
                  </Button>
                </div>
                
                {/* Social Proof */}
                <div className="text-sm text-gray-500">
                  Join 200+ brand managers using SKU Insights to launch winning products
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-6 border">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">KitKat Original - UK</span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-medium">PERFORMING</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full mb-4">
                      <div className="h-2 bg-emerald-500 rounded-full" style={{width: '78%'}}></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">+23%</div>
                      <div className="text-xs text-gray-500">Velocity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">4.2★</div>
                      <div className="text-xs text-gray-500">Sentiment</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">89%</div>
                      <div className="text-xs text-gray-500">Brand Lift</div>
                    </div>
                  </div>
                  
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 text-emerald-600 mr-2" />
                      <span className="text-sm font-medium text-emerald-800">Auto-trigger: Increase Amazon ads by 15%</span>
                    </div>
                  </div>
                </div>
                
                {/* Floating metrics */}
                <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-3 border">
                  <div className="text-xs text-gray-500 mb-1">Launch Success Rate</div>
                  <div className="text-lg font-bold text-emerald-600">94%</div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-3 border">
                  <div className="text-xs text-gray-500 mb-1">Time to Profitability</div>
                  <div className="text-lg font-bold text-blue-600">47 days</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COST OF FAILURE SECTION */}
        <section className="py-24 bg-gray-900 text-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                Every Failed Launch Costs Your Company <span className="text-red-400">$2.3M</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Brand managers are under immense pressure to deliver wins. But with 80% of new SKUs failing, 
                most are flying blind until it's too late to course-correct.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-8 text-emerald-400">The Hidden Costs of Launching Blind:</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">$800K in sunk launch costs</h4>
                      <p className="text-gray-300">Marketing spend, production setup, retailer fees that can't be recovered</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">$1.2M in missed revenue</h4>
                      <p className="text-gray-300">Opportunity cost while competitors capture market share</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">$300K in team disruption</h4>
                      <p className="text-gray-300">Firefighting, replanning, and organizational stress</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-600 to-blue-600 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">What if you could know with 94% accuracy?</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span>Pre-launch success prediction</span>
                    <span className="font-bold">94% accurate</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Time to detect issues</span>
                    <span className="font-bold">4 hours vs 4 weeks</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Launch cost reduction</span>
                    <span className="font-bold">45% average savings</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Revenue acceleration</span>
                    <span className="font-bold">3x faster velocity</span>
                  </div>
                </div>
                <a href="https://www.linkedin.com/in/shalinshah2/" target="_blank" rel="noopener noreferrer" className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block w-full text-center">
                  See ROI Calculator →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 5-PHASE WORKFLOW SYSTEM */}
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">The Complete SKU Lifecycle Management System</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From concept validation to post-launch optimization - one integrated workflow that eliminates blind spots and maximizes ROI
              </p>
            </div>
            
            {/* Workflow Timeline */}
            <div className="relative mb-16">
              <div className="absolute top-12 left-0 w-full h-0.5 bg-gray-200"></div>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 relative">
                <div className="text-center">
                  <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-2">Upload SKUs</h3>
                  <p className="text-xs text-gray-500">Concept validation</p>
                </div>
                <div className="text-center">
                  <div className="bg-emerald-600 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-2">Pre-Launch</h3>
                  <p className="text-xs text-gray-500">Market testing</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-2">Launch Monitor</h3>
                  <p className="text-xs text-gray-500">Real-time tracking</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-600 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-2">Optimize</h3>
                  <p className="text-xs text-gray-500">Auto-triggers</p>
                </div>
                <div className="text-center">
                  <div className="bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                    <span className="text-white font-bold text-sm">5</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-2">Executive View</h3>
                  <p className="text-xs text-gray-500">Strategic insights</p>
                </div>
              </div>
            </div>
            
            {/* Key Capabilities */}
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-10 w-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">94% Launch Prediction Accuracy</h3>
                <p className="text-gray-600 mb-6">
                  Pre-launch validation through SurvFast integration identifies winning concepts before costly market entry. 
                  Average cost savings: $800K per failed launch prevented.
                </p>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-emerald-800 mb-2">Latest Validation Results</div>
                  <div className="flex justify-between text-sm text-emerald-700">
                    <span>KitKat Chunky Mini</span>
                    <span className="font-bold">✓ 89% Success Probability</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">4-Hour Issue Detection</h3>
                <p className="text-gray-600 mb-6">
                  Smart triggers automatically detect performance anomalies and deploy corrective actions. 
                  Industry average: 4 weeks. SKU Insights: 4 hours.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-blue-800 mb-2">Active Interventions</div>
                  <div className="flex justify-between text-sm text-blue-700">
                    <span>Amazon PPC Boost</span>
                    <span className="font-bold">+23% Velocity</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">3x Faster Time-to-Profitability</h3>
                <p className="text-gray-600 mb-6">
                  Automated workflow reduces manual coordination from weeks to hours. 
                  Cross-functional teams stay aligned with real-time dashboards and automated alerts.
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-purple-800 mb-2">Performance Benchmark</div>
                  <div className="flex justify-between text-sm text-purple-700">
                    <span>Average Profitability</span>
                    <span className="font-bold">47 days vs 141 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MARKET STATS */}
        <section className="py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          </div>
          <div className="container mx-auto px-6 relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">The CPG Launch Challenge</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Behind every successful product launch lies a complex web of market dynamics, consumer behavior, and operational execution
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent group-hover:scale-105 transition-transform">4M</div>
                <p className="text-blue-100 text-lg font-medium">New SKUs launched globally per year</p>
                <p className="text-blue-200 text-sm mt-2">Each competing for consumer attention</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent group-hover:scale-105 transition-transform">$2B</div>
                <p className="text-blue-100 text-lg font-medium">Invested in R&D annually</p>
                <p className="text-blue-200 text-sm mt-2">Innovation requires significant upfront capital</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-red-300 to-pink-300 bg-clip-text text-transparent group-hover:scale-105 transition-transform">80%</div>
                <p className="text-blue-100 text-lg font-medium">Failure rate within first year</p>
                <p className="text-blue-200 text-sm mt-2">Most launches don't meet expectations</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-white/30">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-yellow-300 mr-3" />
                <span className="text-2xl font-bold text-yellow-300">"Bloomberg for CPG"</span>
              </div>
              <p className="text-xl text-center text-blue-100 italic">
                The definitive intelligence platform for consumer goods success
              </p>
            </div>
          </div>
        </section>

        {/* AUDIENCE TARGETING */}
        <section id="audiences" className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/30 to-transparent"></div>
          <div className="container mx-auto px-6 relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Built for High-Performance Teams
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Tailored workflows for every role in your launch process, designed to accelerate decision-making and improve outcomes
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Brand Teams</h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">Track brand health metrics across markets</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">Monitor competitive positioning in real-time</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">Optimize marketing spend with AI insights</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">Deploy intervention playbooks automatically</span>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 group-hover:bg-blue-700 transition-colors" onClick={() => window.location.href = '/auth'}>
                    Explore Brand Dashboard
                  </Button>
                </div>
              </div>

              <div className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <BarChart3 className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Insights Teams</h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">Consumer sentiment analysis with AI</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">Market research automation at scale</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">Predictive modeling for launch success</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">Custom survey deployment and analysis</span>
                    </div>
                  </div>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 group-hover:bg-emerald-700 transition-colors" onClick={() => window.location.href = '/auth'}>
                    View Analytics Suite
                  </Button>
                </div>
              </div>

              <div className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <Briefcase className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Commercial Teams</h3>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">Sales performance tracking by channel</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">Retailer relationship insights and alerts</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">Revenue optimization recommendations</span>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">Account-specific performance dashboards</span>
                    </div>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 group-hover:bg-purple-700 transition-colors" onClick={() => window.location.href = '/auth'}>
                    Access Sales Hub
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS & LOGOS */}
        <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30"></div>
          <div className="container mx-auto px-6 relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Trusted by Industry Leaders
              </h2>
              
              {/* Company Logos */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg mb-16">
                <p className="text-gray-500 mb-6 text-lg">Trusted by teams at leading CPG companies</p>
                <div className="flex justify-center gap-8 md:gap-12 items-center flex-wrap">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/1/13/Coca-Cola_logo.svg" className="h-8 opacity-60 hover:opacity-80 transition-opacity" alt="Coca-Cola" />
                  <img src="https://upload.wikimedia.org/wikipedia/en/8/8a/Pepsi_logo_2014.svg" className="h-8 opacity-60 hover:opacity-80 transition-opacity" alt="Pepsi" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Unilever_Logo.svg" className="h-8 opacity-60 hover:opacity-80 transition-opacity" alt="Unilever" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Nestle_textlogo.svg" className="h-8 opacity-60 hover:opacity-80 transition-opacity" alt="Nestle" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Procter_%26_Gamble_logo.svg" className="h-8 opacity-60 hover:opacity-80 transition-opacity" alt="P&G" />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Sarah Chen</p>
                    <p className="text-sm text-gray-600">VP of Global Marketing</p>
                    <p className="text-sm text-blue-600 font-medium">Fortune 500 CPG</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-lg italic text-gray-700 leading-relaxed">
                  "SKU Insights detected a trending issue 3 weeks before our traditional analytics would have caught it. We pivoted our launch strategy and saved $2.3M in marketing spend."
                </blockquote>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Marcus Rodriguez</p>
                    <p className="text-sm text-gray-600">Brand Director</p>
                    <p className="text-sm text-emerald-600 font-medium">Global Food Company</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-lg italic text-gray-700 leading-relaxed">
                  "The consumer sentiment engine is game-changing. We now launch with confidence knowing exactly what drives purchase intent in each market."
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* CONSULTATION CTA */}
        <section className="py-24 bg-gradient-to-br from-emerald-600 to-blue-600 text-white">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">See Your Potential Savings</h2>
                <p className="text-xl text-emerald-100 mb-8">
                  Discover exactly how SKU Insights can reduce your failed launch costs and accelerate time-to-profitability.
                </p>
                
                <div className="bg-white/10 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-semibold mb-4">Typical Savings Within 12 Months:</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Avoided failed launch costs</span>
                      <span className="font-bold">$1.6M - $4.2M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Faster time-to-profitability</span>
                      <span className="font-bold">$800K - $2.1M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reduced manual coordination</span>
                      <span className="font-bold">$400K - $800K</span>
                    </div>
                    <hr className="border-white/20" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Potential Savings</span>
                      <span>$2.8M - $7.1M</span>
                    </div>
                  </div>
                </div>
                
                <a 
                  href="https://www.linkedin.com/in/shalinshah2/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white text-emerald-600 px-8 py-4 rounded-lg hover:bg-gray-100 text-lg font-medium inline-flex items-center gap-2 mr-4"
                >
                  Schedule a Call
                </a>
                
                <Button 
                  variant="outline" 
                  className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-emerald-600"
                  onClick={() => window.location.href = '/auth'}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Try Live Demo
                </Button>
              </div>
              
              <div className="bg-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">Ready to Start?</h3>
                <div className="space-y-4">
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center mr-3">
                        <span className="text-emerald-900 text-sm font-bold">1</span>
                      </div>
                      <span className="font-semibold">15-min Discovery Call</span>
                    </div>
                    <p className="text-sm text-emerald-100 ml-9">Understand your current launch challenges</p>
                  </div>
                  
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center mr-3">
                        <span className="text-emerald-900 text-sm font-bold">2</span>
                      </div>
                      <span className="font-semibold">Custom Analysis</span>
                    </div>
                    <p className="text-sm text-emerald-100 ml-9">Review specific savings for your portfolio</p>
                  </div>
                  
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center mr-3">
                        <span className="text-emerald-900 text-sm font-bold">3</span>
                      </div>
                      <span className="font-semibold">Live Demo with Your Data</span>
                    </div>
                    <p className="text-sm text-emerald-100 ml-9">See actual insights from your SKU portfolio</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/20 text-center">
                  <p className="text-sm text-emerald-100">Average time to first insights: <strong>48 hours</strong></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section id="contact" className="py-16 bg-gray-900 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Stop Launching Blind. Start Winning Predictably.</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Join 200+ brand managers using SKU Insights to eliminate launch guesswork
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.linkedin.com/in/shalinshah2/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-emerald-600 text-white px-8 py-4 rounded-lg hover:bg-emerald-700 text-lg font-medium"
              >
                Schedule a Call
              </a>
              
              <Button 
                className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg"
                onClick={() => window.location.href = '/auth'}
              >
                <Play className="h-5 w-5 mr-2" />
                Try Live Demo
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">SKU Insights</h3>
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
            <p>&copy; 2025 SKU Insights. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IndexPage;