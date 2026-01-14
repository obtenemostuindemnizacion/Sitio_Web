
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Services } from './components/Services';
import { Process } from './components/Process';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { CalculatorTeaser } from './components/CalculatorTeaser';
import { FAQPage } from './components/FAQPage';
import { ProcessPage } from './components/ProcessPage';
import { TestimonialsPage } from './components/TestimonialsPage';
import { LegalPage } from './components/LegalPage';
import { MessageCircle, Phone, X, Loader2 } from 'lucide-react';
import { ServiceLeadModal } from './components/ServiceLeadModal';

// Lazy Load Heavy Components
const CalculatorModal = lazy(() => import('./components/CalculatorModal').then(module => ({ default: module.CalculatorModal })));
const AIChatBot = lazy(() => import('./components/AIChatBot').then(module => ({ default: module.AIChatBot })));
const CallRequestModal = lazy(() => import('./components/CallRequestModal').then(module => ({ default: module.CallRequestModal })));

const LoadingFallback = () => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm">
    <Loader2 className="w-8 h-8 animate-spin text-white" />
  </div>
);

const StickyCTA: React.FC<{ isOpen: boolean; onToggle: () => void }> = React.memo(({ isOpen, onToggle }) => {
  return (
    <div className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 flex-col gap-4 z-[999] items-end pointer-events-auto ${isOpen ? 'hidden md:flex' : 'flex'}`}>
      {!isOpen && (
        <div className="bg-white text-slate-800 text-xs font-bold px-3 py-2 rounded-xl shadow-xl border border-slate-100 animate-bounce mb-1 mr-1 hidden md:block">
           👋 Eva tiene un mensaje
        </div>
      )}
      <button 
        onClick={onToggle}
        className={`relative text-white p-4 rounded-full shadow-2xl transition-all duration-500 flex items-center justify-center group ${isOpen ? 'bg-slate-800' : 'bg-gradient-to-tr from-green-500 to-emerald-400'}`}
      >
        {!isOpen && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 z-20">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600 text-[10px] font-bold text-white items-center justify-center border-2 border-emerald-500">1</span>
          </span>
        )}
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
      </button>
    </div>
  );
});

type PageType = 'home' | 'faq' | 'process' | 'testimonials' | 'legal-notice' | 'privacy' | 'cookies';

interface ActiveService {
  id: string;
  title: string;
}

const App: React.FC = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [activeService, setActiveService] = useState<ActiveService | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  const handleOpenServiceModal = (service: ActiveService) => {
    setActiveService(service);
  };

  const handleRequestCall = () => setShowCallModal(true);

  const navigateTo = (page: string) => {
    setCurrentPage(page as PageType);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50 overflow-x-hidden">
      <Header 
        onNavigate={navigateTo} 
        currentPage={currentPage} 
        onRequestCall={handleRequestCall}
      />
      
      <main className="flex-grow">
        {currentPage === 'home' && (
          <>
            <Hero onOpenChat={() => setShowChatBot(true)} onNavigate={navigateTo} />
            <div className="render-lazy"><CalculatorTeaser onOpen={() => setShowCalculator(true)} /></div>
            <div className="render-lazy"><Services onOpenServiceModal={handleOpenServiceModal} /></div>
            <div className="render-lazy"><Features /></div>
            <div className="render-lazy"><Process onNavigate={navigateTo} /></div>
            <div className="render-lazy"><ContactForm onRequestCall={handleRequestCall} onNavigate={navigateTo} /></div>
          </>
        )}
        
        {currentPage === 'faq' && <FAQPage onNavigate={navigateTo} onOpenChat={() => setShowChatBot(true)} />}
        {currentPage === 'process' && <ProcessPage onNavigate={navigateTo} />}
        {currentPage === 'testimonials' && <TestimonialsPage onNavigate={navigateTo} onOpenChat={() => setShowChatBot(true)} />}
        {currentPage === 'legal-notice' && <LegalPage type="legal" onNavigate={navigateTo} />}
        {currentPage === 'privacy' && <LegalPage type="privacy" onNavigate={navigateTo} />}
        {currentPage === 'cookies' && <LegalPage type="cookies" onNavigate={navigateTo} />}
      </main>
      
      <div className="render-lazy"><Footer onNavigate={navigateTo} /></div>
      
      <StickyCTA isOpen={showChatBot} onToggle={() => setShowChatBot(prev => !prev)} />
      
      <Suspense fallback={<LoadingFallback />}>
        {showCalculator && <CalculatorModal isOpen={showCalculator} onClose={() => setShowCalculator(false)} onOpenChat={() => setShowChatBot(true)} onNavigate={navigateTo} />}
      </Suspense>

      <Suspense fallback={null}>
        {showCallModal && <CallRequestModal isOpen={showCallModal} onClose={() => setShowCallModal(false)} onNavigate={navigateTo} />}
      </Suspense>
      
      <Suspense fallback={null}>
        {showChatBot && <AIChatBot isOpen={showChatBot} onClose={() => setShowChatBot(false)} />}
      </Suspense>

      {/* MODAL DE SERVICIO DINÁMICO GLOBAL */}
      <ServiceLeadModal 
        isOpen={activeService !== null} 
        onClose={() => setActiveService(null)} 
        service={activeService}
        onNavigate={navigateTo}
      />
    </div>
  );
};

export default App;
