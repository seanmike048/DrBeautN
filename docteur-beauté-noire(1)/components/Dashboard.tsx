import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import RoutineStepCard from './RoutineStepCard';
import IngredientCard from './IngredientCard';
import { Sun, Moon, Calendar, Activity, Shield, Download, AlertCircle } from 'lucide-react';
import Button from './Button';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ result, onReset }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'snapshot' | 'am' | 'pm' | 'weekly' | 'ingredients'>('snapshot');

  const getTabStyle = (tab: string) => 
    `flex-1 py-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap px-4 uppercase tracking-widest ${
      activeTab === tab 
      ? 'border-gold text-charcoal' 
      : 'border-transparent text-charcoal/40 hover:text-charcoal'
    }`;

  return (
    <div className="max-w-5xl mx-auto fade-in pb-24">
      <div className="flex justify-between items-end mb-8 border-b border-charcoal/10 pb-6">
        <div>
          <h2 className="text-3xl font-playfair font-bold text-charcoal">{t.dashboard.title}</h2>
          <p className="text-charcoal/60 text-sm mt-1 font-light">Analysis completed. Review your personalized protocol.</p>
        </div>
        <Button variant="ghost" onClick={onReset} className="text-xs border border-charcoal/10">{t.dashboard.reset}</Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto mb-8 bg-white border border-gold/20 shadow-sm scrollbar-hide sticky top-24 z-30">
        <button onClick={() => setActiveTab('snapshot')} className={getTabStyle('snapshot')}>
          {t.dashboard.snapshot}
        </button>
        <button onClick={() => setActiveTab('am')} className={getTabStyle('am')}>
          {t.dashboard.am}
        </button>
        <button onClick={() => setActiveTab('pm')} className={getTabStyle('pm')}>
          {t.dashboard.pm}
        </button>
        <button onClick={() => setActiveTab('weekly')} className={getTabStyle('weekly')}>
          {t.dashboard.weekly}
        </button>
        <button onClick={() => setActiveTab('ingredients')} className={getTabStyle('ingredients')}>
          {t.dashboard.ingredients}
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        
        {/* SNAPSHOT TAB */}
        {activeTab === 'snapshot' && (
          <div className="space-y-8 fade-in">
            {/* Disclaimer Banner */}
            <div className="bg-charcoal/5 border-l-4 border-charcoal p-4 flex items-start gap-4 text-sm text-charcoal/80">
               <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-gold" />
               <p className="font-medium">{result.disclaimer}</p>
            </div>

            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-7 bg-charcoal text-cream p-8 rounded-sm shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <h3 className="text-xs font-bold mb-2 text-gold uppercase tracking-widest">Diagnostic Summary</h3>
                <p className="text-xl font-playfair leading-relaxed mb-8">{result.snapshot.summary}</p>
                
                <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-6">
                  <div>
                     <span className="block text-[10px] uppercase opacity-50 tracking-widest mb-1">AI Confidence</span>
                     <span className="font-playfair font-bold text-2xl text-gold">{(result.snapshot.skinTypeConfidence * 100).toFixed(0)}%</span>
                  </div>
                  <div>
                     <span className="block text-[10px] uppercase opacity-50 tracking-widest mb-1">Barrier Health</span>
                     <span className="font-playfair font-bold text-xl">{result.snapshot.barrierStatus}</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 bg-white p-8 rounded-sm shadow-sm border border-gold/20">
                <h3 className="font-bold text-charcoal mb-4 flex items-center gap-2 font-playfair text-lg">
                  <Shield size={18} className="text-gold" /> {t.dashboard.triggers}
                </h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {result.snapshot.triggers.map((trigger, i) => (
                    <span key={i} className="bg-charcoal/5 text-charcoal border border-charcoal/10 px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wide">
                      {trigger}
                    </span>
                  ))}
                </div>

                <h3 className="font-bold text-charcoal mb-4 flex items-center gap-2 font-playfair text-lg">
                  <Activity size={18} className="text-gold" /> {t.dashboard.lifestyle}
                </h3>
                <ul className="space-y-3">
                  {result.lifestyleTips.map((tip, i) => (
                    <li key={i} className="text-sm text-charcoal/70 flex items-start gap-3 leading-relaxed">
                      <span className="text-gold mt-1.5 h-1.5 w-1.5 rounded-full bg-gold flex-shrink-0"></span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* AM ROUTINE TAB */}
        {activeTab === 'am' && (
          <div className="fade-in space-y-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-charcoal/10">
              <div className="p-2 bg-gold/20 rounded-full text-charcoal"><Sun className="w-6 h-6" /></div>
              <h3 className="text-2xl font-bold font-playfair text-charcoal">{t.dashboard.am}</h3>
            </div>
            {result.routine.am.map((step, idx) => (
              <RoutineStepCard key={idx} step={step} index={idx} />
            ))}
          </div>
        )}

        {/* PM ROUTINE TAB */}
        {activeTab === 'pm' && (
          <div className="fade-in space-y-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-charcoal/10">
              <div className="p-2 bg-charcoal text-gold rounded-full"><Moon className="w-6 h-6" /></div>
              <h3 className="text-2xl font-bold font-playfair text-charcoal">{t.dashboard.pm}</h3>
            </div>
            {result.routine.pm.map((step, idx) => (
              <RoutineStepCard key={idx} step={step} index={idx} />
            ))}
          </div>
        )}

        {/* WEEKLY ROUTINE TAB */}
        {activeTab === 'weekly' && (
          <div className="fade-in space-y-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-charcoal/10">
              <div className="p-2 bg-charcoal/10 text-charcoal rounded-full"><Calendar className="w-6 h-6" /></div>
              <h3 className="text-2xl font-bold font-playfair text-charcoal">{t.dashboard.weekly}</h3>
            </div>
            {result.routine.weekly.length > 0 ? (
              result.routine.weekly.map((step, idx) => (
                <RoutineStepCard key={idx} step={step} index={idx} />
              ))
            ) : (
              <div className="bg-white p-12 rounded-sm border border-charcoal/10 text-center text-charcoal/50 italic font-playfair">
                No specific weekly treatments needed. Consistency is key.
              </div>
            )}
          </div>
        )}

        {/* INGREDIENTS TAB */}
        {activeTab === 'ingredients' && (
          <div className="fade-in grid md:grid-cols-2 gap-6">
            <div className="col-span-full mb-4">
               <h3 className="text-2xl font-bold font-playfair text-charcoal mb-2">{t.dashboard.ingredients}</h3>
               <p className="text-charcoal/60 text-sm">Active molecules selected for your skin profile.</p>
            </div>
            {result.keyIngredients.map((ing, idx) => (
              <IngredientCard key={idx} ingredient={ing} />
            ))}
          </div>
        )}

      </div>
      
      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-cream/90 backdrop-blur-md border-t border-gold/20 flex justify-center z-50">
        <Button variant="primary" onClick={() => window.print()} className="shadow-xl px-12">
           <Download size={18} /> {t.dashboard.save}
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;