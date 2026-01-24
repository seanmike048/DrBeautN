import React, { useState } from 'react';
import Layout from './components/Layout';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { UserProfile, AnalysisResult } from './types';
import { generateSkinAnalysis } from './services/geminiService';
import { AlertCircle } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LogoIcon from './components/LogoIcon';

const AppContent: React.FC = () => {
  const { t } = useLanguage();
  const [view, setView] = useState<'intro' | 'onboarding' | 'dashboard'>('intro');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => setView('onboarding');

  const handleAnalysis = async (userProfile: UserProfile) => {
    setProfile(userProfile);
    setLoading(true);
    setError(null);
    
    try {
      const data = await generateSkinAnalysis(userProfile);
      setResult(data);
      setView('dashboard');
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setView('intro');
    setProfile(null);
    setResult(null);
    setError(null);
  };

  return (
    <Layout>
      {view === 'intro' && (
        <div className="flex flex-col items-center justify-center min-h-[75vh] text-center max-w-4xl mx-auto space-y-10 fade-in relative">
          
          {/* HERO VISUAL: Croix.png from public */}
          <div className="relative mb-4">
            {/* Minimal atmospheric glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold/5 rounded-full blur-3xl"></div>
            
            {/* The Main Hero Icon */}
            <img 
              src="/Croix.png" 
              alt="Docteur Beauté Noire"
              className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl relative z-10"
            />
          </div>
          
          <div className="space-y-8 relative z-10">
            {/* Wordmark Hierarchy - Matching Reference Brand Voice */}
            <div className="flex flex-col items-center">
              <span className="font-sans text-sm md:text-base tracking-[0.3em] text-charcoal/60 font-medium uppercase mb-3">
                Docteur
              </span>
              <h2 className="text-5xl md:text-7xl font-playfair font-bold text-charcoal tracking-wide leading-tight">
                BEAUTÉ NOIRE
              </h2>
            </div>
            
            {/* LOWER SECTION SEPARATOR: Small Croix Stamp */}
            <div className="flex justify-center py-2 opacity-80">
               <img src="/Croix.png" alt="icon" className="w-8 h-8 opacity-60" />
            </div>

            <p className="text-charcoal/80 text-lg md:text-xl max-w-xl mx-auto font-light leading-relaxed font-sans">
              {t.hero}
            </p>
          </div>

          <button 
            onClick={handleStart}
            className="bg-charcoal text-gold text-lg px-12 py-5 rounded-sm font-bold shadow-2xl hover:bg-gold hover:text-charcoal transition-all duration-300 tracking-widest uppercase border border-gold ring-1 ring-gold/20"
          >
            {t.start}
          </button>
          
          <div className="mt-12 pt-6 border-t border-charcoal/5 w-full max-w-sm">
            <p className="text-[10px] text-charcoal/40 uppercase tracking-widest font-medium">
              {t.heroDisclaimer}
            </p>
          </div>
        </div>
      )}

      {view === 'onboarding' && (
        <div className="py-4">
           {error && (
             <div className="max-w-xl mx-auto mb-8 bg-charcoal text-cream p-4 rounded-sm flex items-center gap-4 border-l-4 border-error shadow-xl">
               <AlertCircle className="text-error" />
               {error}
             </div>
           )}
           <Onboarding onComplete={handleAnalysis} isLoading={loading} />
        </div>
      )}

      {view === 'dashboard' && result && (
        <Dashboard result={result} onReset={handleReset} />
      )}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;