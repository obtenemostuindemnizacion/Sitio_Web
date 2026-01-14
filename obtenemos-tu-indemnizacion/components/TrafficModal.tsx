
import React, { useState, useEffect } from 'react';
import { X, CheckCircle, User, Mail, Phone, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { saveToGoogleSheets } from '../services/sheetService';

interface TrafficModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

export const TrafficModal: React.FC<TrafficModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [phoneError, setPhoneError] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    privacy: false
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const validatePhone = (p: string) => {
    const cleanPhone = p.replace(/\s/g, '').replace(/\D/g, '');
    return cleanPhone.length === 9;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacy) return;

    if (!validatePhone(formData.phone)) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);

    setStatus('submitting');
    
    await saveToGoogleSheets({
      origen: 'Formulario Modal Tráfico',
      nombre: formData.name,
      email: formData.email,
      telefono: formData.phone,
      mensaje: 'Interés en Accidentes de Tráfico (Modal Optimizado)'
    });

    setStatus('success');
  };

  const handleLegalClick = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    onClose();
    if (onNavigate) onNavigate(page);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-0 sm:p-4 overflow-hidden">
      {/* Backdrop con desenfoque */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      
      {/* Contenedor del Modal */}
      <div className="relative bg-white w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] sm:rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in-up flex flex-col md:flex-row">
        
        {/* Botón Cerrar */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-all z-[100] shadow-sm"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Lado Izquierdo: Imagen (Oculta en móvil) */}
        <div className="hidden md:flex md:w-2/5 bg-slate-50 relative items-end overflow-hidden border-r border-slate-100">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" 
            alt="Abogada especialista" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
        </div>

        {/* Lado Derecho: Formulario */}
        <div className="w-full md:w-3/5 p-6 md:p-12 overflow-y-auto bg-white flex flex-col">
          {status === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-xl">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter">¡Solicitud Enviada!</h4>
              <p className="text-slate-600 mb-8 font-medium">Gracias. Un abogado especialista contactará contigo en breve para analizar tu accidente.</p>
              <Button onClick={onClose} fullWidth>Cerrar</Button>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Logo y Branding */}
              <div className="flex flex-col items-center md:items-start gap-1 mb-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-brand-600" />
                  <div className="flex flex-col leading-none">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">ObtenemosTu</span>
                    <span className="text-xs font-black text-brand-600 uppercase tracking-tighter">Indemnización</span>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-[#2563eb] mb-2 leading-tight text-center md:text-left">
                No le regales tu dinero a tu aseguradora
              </h3>
              <p className="text-slate-600 font-semibold mb-6 text-center md:text-left text-sm">
                Contacta con nosotros y consigue la <span className="text-slate-900 font-extrabold uppercase">máxima indemnización</span>
              </p>

              <div className="bg-[#5392C1] text-white px-4 py-2.5 rounded-xl font-black text-center text-[11px] md:text-xs uppercase tracking-[0.2em] mb-8 shadow-md">
                SÓLO COBRAMOS SI TÚ COBRAS
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-brand-600 transition-colors" />
                  <input 
                    type="text" required placeholder="Nombre"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-full py-4 pl-12 pr-4 outline-none focus:border-brand-600 focus:bg-white transition-all font-bold text-slate-900"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-brand-600 transition-colors" />
                  <input 
                    type="email" required placeholder="Correo electrónico"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-full py-4 pl-12 pr-4 outline-none focus:border-brand-600 focus:bg-white transition-all font-bold text-slate-900"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="relative flex items-center group">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 font-black border-r border-slate-200 pr-3 h-6 ${phoneError ? 'text-red-500' : 'text-slate-900'}`}>
                    <img src="https://flagcdn.com/w20/es.png" alt="ES" className="w-4 shadow-sm" />
                    <span className="text-sm">+34</span>
                  </div>
                  <input 
                    type="tel" required placeholder="Teléfono"
                    className={`w-full bg-slate-50 border-2 rounded-full py-4 pl-24 pr-4 outline-none transition-all font-bold text-slate-900 ${phoneError ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-slate-100 focus:border-brand-600 focus:bg-white'}`}
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({...formData, phone: e.target.value});
                      if (phoneError) setPhoneError(false);
                    }}
                  />
                  {phoneError && (
                    <div className="absolute top-full left-6 mt-1 flex items-center gap-1 text-red-600 text-[10px] font-bold animate-fade-in-up">
                      <AlertCircle className="w-3 h-3" />
                      <span>Introduce un número de 9 caracteres</span>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-3 px-2 pt-2">
                  <input 
                    type="checkbox" id="privacy-traffic-modal" required 
                    className="mt-1 w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                    checked={formData.privacy}
                    onChange={(e) => setFormData({...formData, privacy: e.target.checked})}
                  />
                  <label htmlFor="privacy-traffic-modal" className="text-[10px] text-slate-500 font-medium leading-tight cursor-pointer">
                    Acepto la <button type="button" onClick={(e) => handleLegalClick(e, 'privacy')} className="text-brand-600 font-bold underline hover:text-brand-500 transition-colors">política de privacidad</button> *
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'submitting' || !formData.privacy}
                  className="w-full bg-[#FF9D00] hover:bg-[#E68D00] text-white font-black py-4.5 rounded-full text-lg shadow-xl shadow-amber-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                >
                  {status === 'submitting' ? <Loader2 className="w-6 h-6 animate-spin" /> : "Solicitar Información"}
                </button>
              </form>
              
              <p className="text-[10px] text-slate-400 text-center mt-6 uppercase tracking-widest font-bold">
                🔒 Tus datos están seguros con nosotros
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
