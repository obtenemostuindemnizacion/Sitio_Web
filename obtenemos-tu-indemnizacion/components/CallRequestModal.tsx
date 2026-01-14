
import React, { useState, useEffect } from 'react';
import { X, Phone, CheckCircle, Loader2, Send, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { saveToGoogleSheets } from '../services/sheetService';

interface CallRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

export const CallRequestModal: React.FC<CallRequestModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Bloquear scroll cuando el modal está abierto
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
    if (!phone) return;

    if (!validatePhone(phone)) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);
    
    setStatus('submitting');
    
    // Guardar en Google Sheets
    await saveToGoogleSheets({
      origen: 'Llamada Gratuita (Header)',
      telefono: phone,
      mensaje: 'Solicitud de llamada inmediata'
    });
    
    setStatus('success');
  };

  const handleClose = () => {
    onClose();
    // Resetear estado después de cerrar (con un pequeño delay para la animación)
    setTimeout(() => {
      setStatus('idle');
      setPhone('');
      setPhoneError(false);
    }, 300);
  };

  const handleLegalClick = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    onClose();
    if (onNavigate) onNavigate(page);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-10 text-center">
          {status === 'success' ? (
            <div className="animate-fade-in-up">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                ¡Solicitud Recibida!
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Gracias por ponerte en contacto con nosotros, has dado el paso correcto. En un plazo de <span className="font-bold text-slate-900">24-48h</span> nos pondremos en contacto contigo.
              </p>
              <Button onClick={handleClose} fullWidth variant="primary">
                Entendido, cerrar
              </Button>
            </div>
          ) : (
            <div className="animate-fade-in-up">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-brand-50">
                <Phone className="w-8 h-8 text-brand-600" />
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                Te llamamos gratis
              </h3>
              <p className="text-slate-500 mb-8">
                Déjanos tu número y un abogado especialista te contactará sin compromiso.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className={`font-bold text-sm ${phoneError ? 'text-red-500' : 'text-slate-400'}`}>+34</span>
                  </div>
                  <input
                    id="phone-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (phoneError) setPhoneError(false);
                    }}
                    placeholder="Tu número de teléfono"
                    required
                    autoFocus
                    className={`w-full bg-slate-50 border-2 rounded-xl py-4 pl-12 pr-4 outline-none transition-all font-medium text-slate-900 text-lg placeholder:text-slate-400 ${phoneError ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-slate-200 focus:border-brand-500 focus:bg-white focus:shadow-lg'}`}
                  />
                  {phoneError && (
                    <div className="flex items-center gap-1 mt-1 ml-4 text-red-600 text-left text-xs font-bold animate-fade-in-up">
                      <AlertCircle className="w-3 h-3" />
                      <span>Introduce un número de 9 caracteres</span>
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  fullWidth 
                  size="lg" 
                  disabled={!phone || status === 'submitting'}
                  className="shadow-xl shadow-brand-600/20"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Solicitar Llamada
                      <Send className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-slate-400 mt-4">
                  Al enviar aceptas nuestra <button type="button" onClick={(e) => handleLegalClick(e, 'privacy')} className="underline hover:text-brand-600">política de privacidad</button>. Tus datos no serán compartidos con terceros.
                </p>
              </form>
            </div>
          )}
        </div>
        
        {/* Decorative bottom bar */}
        <div className="h-2 w-full bg-gradient-to-r from-brand-600 to-brand-accent"></div>
      </div>
    </div>
  );
};
