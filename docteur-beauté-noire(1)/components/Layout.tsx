import React from 'react';
import { APP_NAME } from '../constants';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LogoIcon from './LogoIcon';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream text-charcoal font-sans selection:bg-gold selection:text-charcoal">
      <header className="bg-cream/95 backdrop-blur-sm sticky top-0 z-40 border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          
          {/* BRAND MARK - OFFICIAL HORIZONTAL IMAGE LOCKUP */}
          <div className="flex items-center">
            <img 
              src="/logo1.png" 
              alt={APP_NAME} 
              className="h-8 md:h-10 w-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-6">
             {/* Beta Badge */}
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-sm bg-charcoal/5 border border-charcoal/5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                <span className="text-[10px] font-bold text-charcoal/60 uppercase tracking-widest">
                  Beta V1 • Africa First
                </span>
             </div>
             
             <button 
                onClick={toggleLanguage} 
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-sm border border-gold/40 hover:bg-gold hover:text-charcoal transition-all uppercase tracking-wider text-charcoal/80"
             >
                <Globe size={14} /> {language.toUpperCase()}
             </button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12 relative">
        {children}
      </main>

      <footer className="bg-charcoal text-cream py-16 border-t border-gold/20">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8 flex justify-center">
             {/* Reuse the official cross here as well */}
             <LogoIcon className="w-24 h-24 opacity-90" />
          </div>
          <h2 className="font-playfair text-2xl mb-4 tracking-widest uppercase text-gold">{APP_NAME}</h2>
          <p className="text-sm opacity-50 mb-8 font-light max-w-md mx-auto leading-relaxed">Your trusted guide to melanin-rich skincare. Science-backed, Africa-first, safe.</p>
          <div className="text-[10px] opacity-30 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} {APP_NAME}. Not medical advice.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;