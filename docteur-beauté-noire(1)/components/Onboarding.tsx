import React, { useState } from 'react';
import { UserProfile, SkinType, BudgetTier } from '../types';
import { APP_NAME, SKIN_CONCERNS_EN, SKIN_CONCERNS_FR, AFRICAN_COUNTRIES, CLIMATES } from '../constants';
import Button from './Button';
import { ArrowRight, ArrowLeft, Check, Camera as CameraIcon, ClipboardList } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import CameraCapture from './CameraCapture';
import LogoIcon from './LogoIcon';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  isLoading: boolean;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, isLoading }) => {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [showCamera, setShowCamera] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    concerns: [],
    name: '',
    age: 25,
    isPregnantOrBreastfeeding: false,
    sensitivity: 'Medium',
    budget: BudgetTier.MID,
    historyFlags: [],
    photos: {},
    language: language
  });

  const updateProfile = (key: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const toggleConcern = (concern: string) => {
    const current = profile.concerns || [];
    if (current.includes(concern)) {
      updateProfile('concerns', current.filter(c => c !== concern));
    } else {
      if (current.length < 3) {
        updateProfile('concerns', [...current, concern]);
      }
    }
  };

  const toggleHistory = (flag: string) => {
    if (flag === 'None' || flag === 'Aucun') {
       updateProfile('historyFlags', []);
       return;
    }
    const current = profile.historyFlags || [];
    if (current.includes(flag)) {
      updateProfile('historyFlags', current.filter(c => c !== flag));
    } else {
      updateProfile('historyFlags', [...current, flag]);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = () => {
    onComplete(profile as UserProfile);
  };

  const handleCameraComplete = (photos: { front?: string }) => {
    setProfile(prev => ({ ...prev, photos }));
    setShowCamera(false);
    handleSubmit();
  };

  // Input styles for consistent accessibility
  const labelStyle = "block text-sm font-semibold text-charcoal mb-1.5 uppercase tracking-wide opacity-80";
  const inputStyle = "w-full p-4 bg-white border border-charcoal/20 rounded-sm text-charcoal placeholder-charcoal/40 focus:ring-1 focus:ring-gold focus:border-gold outline-none transition-all shadow-sm";
  const selectStyle = "w-full p-4 bg-white border border-charcoal/20 rounded-sm text-charcoal focus:ring-1 focus:ring-gold focus:border-gold outline-none shadow-sm appearance-none";

  // Steps UI
  const renderStep = () => {
    switch (step) {
      case 1: // Identity
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-playfair font-bold text-charcoal mb-4 border-b border-gold/30 pb-4">{t.onboarding.step1}</h2>
            
            <div>
              <label className={labelStyle}>{t.onboarding.name}</label>
              <input 
                type="text" 
                className={inputStyle}
                value={profile.name}
                onChange={e => updateProfile('name', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>{t.onboarding.age}</label>
                <input 
                  type="number" 
                  className={inputStyle}
                  value={profile.age}
                  onChange={e => updateProfile('age', Number(e.target.value))}
                />
              </div>
              <div>
                <label className={labelStyle}>{t.onboarding.gender}</label>
                <div className="relative">
                  <select 
                    className={selectStyle}
                    onChange={e => updateProfile('isPregnantOrBreastfeeding', e.target.value === 'female_pregnant')}
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="female_pregnant">Female (Pregnant/Nursing)</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal/50">▼</div>
                </div>
              </div>
            </div>

            <div>
              <label className={labelStyle}>{t.onboarding.location}</label>
              <div className="relative mb-4">
                <select 
                  className={selectStyle}
                  value={profile.location || ''}
                  onChange={e => updateProfile('location', e.target.value)}
                >
                  <option value="" disabled>Select</option>
                  {AFRICAN_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal/50">▼</div>
              </div>

              <label className={labelStyle}>{t.onboarding.climate}</label>
              <div className="relative">
                <select 
                  className={selectStyle}
                  value={profile.climate || ''}
                  onChange={e => updateProfile('climate', e.target.value)}
                >
                  <option value="" disabled>Select</option>
                  {CLIMATES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal/50">▼</div>
              </div>
            </div>
            
            <div className="pt-6 flex justify-end">
               <Button onClick={nextStep} disabled={!profile.name || !profile.location}>{t.onboarding.next} <ArrowRight size={18} /></Button>
            </div>
          </div>
        );

      case 2: // Skin Type
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-playfair font-bold text-charcoal mb-4 border-b border-gold/30 pb-4">{t.onboarding.step2}</h2>
            
            <div className="grid grid-cols-2 gap-3">
              {Object.values(SkinType).map(type => (
                <button
                  key={type}
                  onClick={() => updateProfile('skinType', type)}
                  className={`p-4 rounded-sm border transition-all text-left ${
                    profile.skinType === type 
                    ? 'border-gold bg-gold text-charcoal shadow-md' 
                    : 'bg-white border-charcoal/20 text-charcoal/70 hover:border-gold/50 hover:text-charcoal'
                  }`}
                >
                  <span className="block font-bold mb-1 font-playfair">{type}</span>
                </button>
              ))}
            </div>

            <div>
              <label className={labelStyle}>{t.onboarding.sensitivity}</label>
              <div className="flex gap-2 bg-white p-1 rounded-sm border border-charcoal/10">
                 {['Low', 'Medium', 'High'].map(level => (
                   <button
                    key={level}
                    onClick={() => updateProfile('sensitivity', level)}
                    className={`flex-1 py-2 rounded-sm text-sm font-medium transition-all ${
                      profile.sensitivity === level ? 'bg-charcoal text-gold shadow-sm' : 'text-charcoal/50 hover:text-charcoal'
                    }`}
                   >
                     {level}
                   </button>
                 ))}
              </div>
            </div>

             <div>
                <label className={labelStyle}>{t.onboarding.shaving}</label>
                <div className="relative">
                  <select 
                    className={selectStyle}
                    onChange={e => updateProfile('shavingFrequency', e.target.value)}
                    value={profile.shavingFrequency || ''}
                  >
                    <option value="" disabled>Select</option>
                    {t.onboarding.shavingOpts.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal/50">▼</div>
                </div>
            </div>

            <div className="pt-6 flex justify-between">
              <Button variant="ghost" onClick={prevStep}><ArrowLeft size={18} /> {t.onboarding.back}</Button>
              <Button onClick={nextStep} disabled={!profile.skinType}>{t.onboarding.next} <ArrowRight size={18} /></Button>
            </div>
          </div>
        );

      case 3: // Concerns
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-playfair font-bold text-charcoal mb-4 border-b border-gold/30 pb-4">{t.onboarding.step3}</h2>
            <p className="text-charcoal/60 -mt-2 italic">{t.onboarding.concerns}</p>
            
            <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {(language === 'fr' ? SKIN_CONCERNS_FR : SKIN_CONCERNS_EN).map(concern => {
                const isSelected = profile.concerns?.includes(concern);
                return (
                  <button
                    key={concern}
                    onClick={() => toggleConcern(concern)}
                    className={`p-4 rounded-sm border flex items-center justify-between transition-all ${
                      isSelected 
                      ? 'border-gold bg-gold/10 text-charcoal font-semibold' 
                      : 'bg-white border-charcoal/10 text-charcoal/70 hover:bg-white hover:border-gold/30'
                    }`}
                  >
                    <span className="font-medium">{concern}</span>
                    {isSelected && <Check size={18} className="text-gold" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-6 flex justify-between">
              <Button variant="ghost" onClick={prevStep}><ArrowLeft size={18} /> {t.onboarding.back}</Button>
              <Button onClick={nextStep} disabled={(profile.concerns?.length || 0) === 0}>{t.onboarding.next} <ArrowRight size={18} /></Button>
            </div>
          </div>
        );

      case 4: // History & Routine & Budget
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="text-3xl font-playfair font-bold text-charcoal mb-4 border-b border-gold/30 pb-4">{t.onboarding.step4}</h2>
             
             <div>
                <label className={labelStyle}>{t.onboarding.history}</label>
                <div className="flex flex-wrap gap-2">
                  {t.onboarding.historyOpts.map(flag => {
                    const isSelected = profile.historyFlags?.includes(flag);
                    return (
                       <button
                        key={flag}
                        onClick={() => toggleHistory(flag)}
                        className={`px-4 py-2 rounded-sm text-xs font-bold border transition-all uppercase tracking-wide ${
                          isSelected ? 'bg-charcoal text-gold border-charcoal' : 'bg-white border-charcoal/20 text-charcoal/60'
                        }`}
                       >
                         {flag}
                       </button>
                    )
                  })}
                </div>
             </div>

             <div>
               <label className={labelStyle}>{t.onboarding.routine}</label>
               <textarea 
                  className={inputStyle}
                  placeholder="..."
                  value={profile.currentRoutine || ''}
                  onChange={e => updateProfile('currentRoutine', e.target.value)}
                  rows={3}
               />
             </div>

             <div>
              <label className={labelStyle}>{t.onboarding.budget}</label>
              <div className="grid grid-cols-3 gap-3">
                {Object.values(BudgetTier).map(tier => (
                  <button
                    key={tier}
                    onClick={() => updateProfile('budget', tier)}
                    className={`p-3 rounded-sm border text-center text-sm transition-all font-medium ${
                      profile.budget === tier 
                      ? 'border-gold bg-gold/10 text-charcoal ring-1 ring-gold' 
                      : 'bg-white border-charcoal/20 text-charcoal/50'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-charcoal text-cream p-6 rounded-sm shadow-lg mt-4">
                <p className="font-playfair font-bold text-xl mb-2 text-gold">{t.onboarding.photoAsk}</p>
                <p className="text-sm opacity-80 mb-4">{t.onboarding.photoDesc}</p>
                <div className="grid gap-3">
                  <button 
                    onClick={() => setShowCamera(true)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gold text-charcoal rounded-sm font-bold shadow-md hover:bg-white transition-colors"
                  >
                    <CameraIcon size={18} /> {t.onboarding.photoYes}
                  </button>
                  <button 
                    onClick={handleSubmit}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-transparent text-cream/60 rounded-sm border border-cream/20 text-sm font-medium hover:text-white hover:border-white"
                  >
                    <ClipboardList size={18} /> {t.onboarding.photoNo}
                  </button>
                </div>
            </div>

            <div className="pt-4 flex justify-start">
              <Button variant="ghost" onClick={prevStep}><ArrowLeft size={18} /> {t.onboarding.back}</Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (showCamera) {
    return (
      <CameraCapture 
        onCaptureComplete={handleCameraComplete} 
        onSkip={() => { setShowCamera(false); handleSubmit(); }} 
      />
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-cream p-6 md:p-10 rounded-sm shadow-2xl border border-gold/20 relative overflow-hidden">
      {/* Ornamental background detail */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
      
      <div className="mb-8 flex items-center justify-between relative z-10 border-b border-gold/20 pb-4">
        {/* Updated Mini Header: Use logo1.png */}
        <div className="h-10">
            <img 
              src="/logo1.png" 
              alt={APP_NAME} 
              className="h-full w-auto object-contain"
            />
        </div>
        <div className="flex gap-1.5">
          {[1,2,3,4].map(i => (
            <div key={i} className={`h-0.5 w-6 rounded-full transition-colors ${i <= step ? 'bg-gold' : 'bg-charcoal/10'}`} />
          ))}
        </div>
      </div>
      {renderStep()}
    </div>
  );
};

export default Onboarding;