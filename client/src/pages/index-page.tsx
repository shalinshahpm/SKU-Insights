import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const IndexPage = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* We're using CSS classes defined in index.css */}

      {/* Navigation */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold gradient-text">SKU Pulse</span>
          <nav className="hidden md:flex gap-10 text-sm font-medium">
            <a href="#features" className="hover:text-blue-600">Value</a>
            <a href="#how" className="hover:text-blue-600">How</a>
            <a href="#impact" className="hover:text-blue-600">Results</a>
            <a href="#contact" className="hover:text-blue-600">Talk</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth">
              <a className="text-sm hover:text-blue-600">Sign In</a>
            </Link>
            <a href="#contact" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">Talk to Us</a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">Know if a Launch Will Win – Instantly</h1>
              <ul className="text-lg text-gray-600 mb-6 list-disc list-inside space-y-2">
                <li>⚡ Spot anomalies before competitors react</li>
                <li>📊 Validate with real consumer & Kantar data</li>
                <li>📍Trigger action with confidence</li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#contact" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 text-sm">Schedule Call</a>
                <Link href="/auth">
                  <Button variant="outline" className="px-6 py-3">See Sample Dashboard</Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://source.unsplash.com/600x350/?analytics,dashboard" 
                className="rounded-xl shadow-md w-full h-auto object-cover"
                alt="Dashboard Preview" 
              />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">What You Gain</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-12">Built for commercial leaders: SKU Pulse unifies four key capabilities that turn launch chaos into confident decision-making.</p>
            <div className="grid md:grid-cols-4 gap-6 text-left text-sm">
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-semibold text-lg mb-2">⚡ Detect Faster</h3>
                <p>Real-time visibility into SKU signals across channels and geos.</p>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-semibold text-lg mb-2">📊 Decide with Confidence</h3>
                <p>Back decisions with sentiment + Kantar panel research.</p>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-semibold text-lg mb-2">🚀 Act Instantly</h3>
                <p>Deploy marketing or retail intervention plans on signal detection.</p>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-semibold text-lg mb-2">📝 Launch a Brand Survey</h3>
                <p>Pre-built survey templates with auto-optimized sample sizes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* BRANDS */}
        <section className="py-10">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-500 text-sm uppercase mb-6">Trusted by global CPG leaders</p>
            <div className="flex justify-center gap-10 items-center flex-wrap">
              <img src="https://upload.wikimedia.org/wikipedia/commons/1/13/Coca-Cola_logo.svg" className="h-8 grayscale opacity-70" alt="Coca-Cola" />
              <img src="https://upload.wikimedia.org/wikipedia/en/8/8a/Pepsi_logo_2014.svg" className="h-8 grayscale opacity-70" alt="Pepsi" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Unilever_Logo.svg" className="h-8 grayscale opacity-70" alt="Unilever" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Nestle_textlogo.svg" className="h-8 grayscale opacity-70" alt="Nestle" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Procter_%26_Gamble_logo.svg" className="h-8 grayscale opacity-70" alt="P&G" />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="py-24 bg-gray-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">4 Capabilities. One Platform.</h2>
            <div className="grid md:grid-cols-4 gap-8 text-left text-sm">
              <div>
                <h3 className="font-semibold mb-2">1. Configure KPIs</h3>
                <p>Set launch thresholds and KPI triggers in minutes.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Stream Data</h3>
                <p>Pull live SKU signals from retail + sentiment sources.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. Take Action</h3>
                <p>SKU Pulse alerts you the moment performance dips—or spikes.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">4. Launch a Brand Survey</h3>
                <p>Run custom surveys with built-in brand KPIs—like Awareness, Consideration, Message Recall, and Friction Points.</p>
              </div>
            </div>
          </div>
        </section>

        {/* RESULTS */}
        <section id="impact" className="py-24">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Proven Impact</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">$1.2M in revenue saved. 48-hour response window. 27% improvement in repurchase rate.</p>
            
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

        {/* CTA / CONTACT */}
        <section id="contact" className="py-24 bg-blue-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Launch Confidently. Act Instantly.</h2>
            <p className="text-gray-600 max-w-xl mx-auto mb-6">Talk with our team to tailor SKU Pulse to your commercial playbook.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://www.linkedin.com/in/shalinshah2/" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-sm font-medium">Book Strategy Call</a>
              <Link href="/auth">
                <Button className="px-6 py-3">Sign In</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8 text-center text-sm text-gray-500">
        <p>&copy; 2025 SKU Pulse. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default IndexPage;