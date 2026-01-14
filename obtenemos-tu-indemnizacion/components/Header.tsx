
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Menu, X, Phone } from 'lucide-react';
import { Button } from './ui/Button';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onRequestCall: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage, onRequestCall }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    
    if (href === 'faq') {
      onNavigate('faq');
      window.scrollTo(0, 0);
      return;
    }
    
    if (href === 'process') {
      onNavigate('process');
      window.scrollTo(0, 0);
      return;
    }

    if (href === 'testimonials') {
      onNavigate('testimonials');
      window.scrollTo(0, 0);
      return;
    }

    onNavigate('home');
    
    const performScroll = () => {
      if (href === '#' || !href.startsWith('#')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    };
    
    if (currentPage === 'home') {
      performScroll();
    } else {
      setTimeout(performScroll, 100);
    }
  };

  const navLinks = [
    { name: 'Servicios', href: '#servicios' },
    { name: 'Proceso', href: 'process' }, 
    { name: 'Testimonios', href: 'testimonials' },
    { name: 'FAQ', href: 'faq' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-500 bg-white/80 backdrop-blur-xl ${
        isScrolled 
          ? 'py-0.5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.06)] border-b border-slate-100/60' 
          : 'py-2 border-b border-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-12 md:h-14">
        {/* Logo Section - Smooth rounded-xl with subtle shadow */}
        <div 
          className="flex items-center gap-2 cursor-pointer group flex-shrink-0" 
          onClick={() => handleNavClick('#')}
        >
          <div className="bg-brand-600 rounded-xl p-1.5 transition-all duration-500 group-hover:bg-brand-700 shadow-[0_4px_12px_-2px_rgba(37,99,235,0.2)]">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col leading-[0.6] py-0 translate-y-[1px]">
             <span className="text-base md:text-lg font-extrabold tracking-tighter text-slate-900">
               ObtenemosTu
             </span>
             <span className="text-base md:text-lg font-extrabold tracking-tighter text-brand-accent">
               Indemnización
             </span>
          </div>
        </div>

        {/* Desktop Nav - Clean links and soft rounded action button */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => handleNavClick(link.href)}
              className="font-semibold text-slate-600 hover:text-brand-600 transition-colors text-[13px] tracking-tight"
            >
              {link.name}
            </button>
          ))}
          <div className="h-4 w-px bg-slate-100 mx-1"></div>
          <Button 
            variant="primary" 
            size="sm"
            onClick={onRequestCall}
            className="text-[13px] px-5 py-1.5 h-8 shadow-none rounded-full"
          >
            <Phone className="w-3.5 h-3.5 mr-2" />
            Llamada gratis
          </Button>
        </nav>

        {/* Mobile Actions Container - Smooth elements */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={onRequestCall}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-[11px] transition-all bg-brand-600 text-white active:scale-95 shadow-[0_4px_12px_-2px_rgba(37,99,235,0.25)]"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Llamada gratis</span>
          </button>

          <button 
            className="p-1.5 rounded-full hover:bg-slate-50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
               <X className="text-slate-900 w-5 h-5" /> 
            ) : (
               <Menu className="text-slate-900 w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Ultra smooth transitions */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t border-slate-50 flex flex-col p-6 gap-1 animate-fade-in-up">
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => handleNavClick(link.href)}
              className="text-left text-base font-bold text-slate-700 py-3 border-b border-slate-50 last:border-0"
            >
              {link.name}
            </button>
          ))}
          <Button 
            variant="primary" 
            fullWidth 
            className="mt-4 py-4 text-base shadow-lg rounded-2xl"
            onClick={() => {
              setMobileMenuOpen(false);
              onRequestCall();
            }}
          >
            <Phone className="w-5 h-5 mr-2" />
            Llamada gratis
          </Button>
        </div>
      )}
    </header>
  );
};
