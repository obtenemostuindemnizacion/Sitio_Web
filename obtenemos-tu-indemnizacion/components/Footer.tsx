
import React from 'react';
import { ShieldCheck, Facebook, Instagram } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

// Icono de TikTok personalizado ya que no está en la versión estándar de Lucide
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo(0, 0);
    }
  };

  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/profile.php?id=61581343430014',
      icon: <Facebook className="w-5 h-5" />,
      hoverColor: 'hover:text-[#1877F2]'
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/obtenemostuindemnizacion/',
      icon: <Instagram className="w-5 h-5" />,
      hoverColor: 'hover:text-[#E4405F]'
    },
    {
      name: 'TikTok',
      href: 'https://www.tiktok.com/@obtenemostuindemnizacion',
      icon: <TikTokIcon className="w-5 h-5" />,
      hoverColor: 'hover:text-white'
    }
  ];

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-8 h-8 text-white" />
              <span className="text-2xl font-extrabold text-white">
                Obtenemos<span className="text-brand-accent">TuIndemnización</span>
              </span>
            </div>
            <p className="mb-6 max-w-sm">
              Líderes en reclamaciones de indemnizaciones. Luchamos por tus derechos con honestidad, transparencia y eficacia.
            </p>
            
            {/* Social Media Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a 
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center transition-all duration-300 hover:border-slate-400 ${social.hoverColor} hover:bg-white/5 shadow-sm`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#legal" onClick={(e) => handleNav(e, 'legal-notice')} className="hover:text-brand-accent transition-colors">
                  Aviso Legal
                </a>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => handleNav(e, 'privacy')} className="hover:text-brand-accent transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#cookies" onClick={(e) => handleNav(e, 'cookies')} className="hover:text-brand-accent transition-colors">
                  Cookies
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Contacto</h4>
            <ul className="space-y-2">
              <li>Barcelona - Atendemos en toda España</li>
              <li>obtenemostuindemnizacion@gmail.com</li>
              <li>+34 680 885 637</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 text-center text-sm">
          © {new Date().getFullYear()} GARANLEY SLP. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};
