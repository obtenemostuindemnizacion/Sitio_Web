
import React, { useState } from 'react';
import { Send, CheckCircle, Phone, Mail, MapPin, Clock, Loader2, ArrowRight, Calendar, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { saveToGoogleSheets } from '../services/sheetService';

interface FloatingInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  icon?: React.ReactNode;
  activeField: string | null;
  setActiveField: (name: string | null) => void;
  error?: boolean;
}

// Componente extraído fuera para evitar re-renders que pierden el foco
const FloatingInput: React.FC<FloatingInputProps> = ({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange,
  icon,
  activeField,
  setActiveField,
  error
}) => {
  const isActive = activeField === name || value.length > 0;
  const inputId = `input-${name}`;

  return (
    <div className="relative group mb-4">
      <div className={`absolute left-4 top-4 transition-colors duration-300 ${error ? 'text-red-500' : (isActive ? 'text-brand-600' : 'text-slate-400')}`}>
        {icon}
      </div>
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setActiveField(name)}
        onBlur={() => setActiveField(null)}
        className={`w-full bg-slate-50 border-2 rounded-xl px-4 py-4 pl-12 outline-none transition-all duration-300 font-medium text-slate-900
          ${error 
            ? 'border-red-500 bg-red-50 focus:border-red-600' 
            : (isActive 
              ? 'pt-6 pb-2 border-brand-500 bg-white shadow-lg shadow-brand-100' 
              : 'border-slate-200 hover:border-slate-300')
          }`}
      />
      <label 
        htmlFor={inputId}
        className={`absolute left-12 transition-all duration-300 pointer-events-none
          ${isActive 
            ? 'top-2 text-xs font-bold' 
            : 'top-4 text-base font-medium'
          } ${error ? 'text-red-600' : (isActive ? 'text-brand-600' : 'text-slate-500')}`}
      >
        {label}
      </label>
      {error && name === 'phone' && (
        <div className="flex items-center gap-1 mt-1 ml-4 text-red-600 text-[10px] font-bold animate-fade-in-up">
          <AlertCircle className="w-3 h-3" />
          <span>Introduce un número de 9 caracteres</span>
        </div>
      )}
    </div>
  );
};

interface ContactFormProps {
  onRequestCall?: () => void;
  onNavigate?: (page: string) => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onRequestCall, onNavigate }) => {
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'Tráfico',
    message: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [activeField, setActiveField] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState(false);

  const validatePhone = (p: string) => {
    const cleanPhone = p.replace(/\s/g, '').replace(/\D/g, '');
    return cleanPhone.length === 9;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhone(formState.phone)) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);

    setStatus('submitting');
    
    // Retraso artificial mínimo de 1 segundo para UX y asegurar buffer de red
    const minDelay = new Promise(resolve => setTimeout(resolve, 1000));
    
    // Enviar a Google Sheets
    const savePromise = saveToGoogleSheets({
      origen: 'Formulario Principal',
      nombre: formState.name,
      telefono: formState.phone,
      email: formState.email,
      mensaje: formState.message,
      datos_extra: `Tipo: ${formState.type}`
    });

    await Promise.all([minDelay, savePromise]);

    setStatus('success');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone' && phoneError) setPhoneError(false);
    
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleLegalClick = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    if (onNavigate) onNavigate(page);
  };

  return (
    <section id="contacto" className="py-24 bg-slate-50 relative overflow-hidden scroll-mt-28 md:scroll-mt-32">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-100/50 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-slate-100">
          
          {/* Left Panel: Info & Branding */}
          <div className="lg:w-5/12 bg-slate-900 text-white p-10 md:p-12 relative overflow-hidden flex flex-col justify-between">
            {/* Abstract Patterns */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            
            <div className="relative z-10 space-y-8">
              <div>
                <h3 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                  ¿Hablamos de <br/>
                  <span className="text-brand-accent">tu caso?</span>
                </h3>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Nuestros abogados están disponibles ahora mismo para evaluar tu situación sin coste alguno.
                </p>
              </div>

              <div className="space-y-6">
                <div 
                  onClick={onRequestCall}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Llámanos Gratis</p>
                    <p className="text-xl font-bold">+34 680 885 637</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-brand-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Escríbenos</p>
                    <p className="text-sm font-bold break-all">obtenemostuindemnizacion@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-400 text-sm pt-4 border-t border-white/10">
                   <Clock className="w-4 h-4" />
                   <span>Respuesta garantizada en menos de 24h</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-12 lg:mt-0">
              <div className="flex items-center gap-2 text-brand-accent font-bold">
                <MapPin className="w-5 h-5" />
                <span>Atendemos en toda España</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive Form */}
          <div className="lg:w-7/12 p-8 md:p-12 bg-white relative">
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in-up p-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">¡Mensaje Recibido!</h3>
                <p className="text-slate-600 text-lg mb-8 max-w-md">
                  Gracias {formState.name}. Para agilizar tu caso, te recomendamos agendar una llamada normal corta con un abogado ahora mismo.
                </p>
                
                <div className="w-full max-w-sm space-y-3">
                  <Button 
                    fullWidth 
                    variant="secondary"
                    onClick={() => window.open('https://cal.com/obtenemostuindemnizacion/30min', '_blank')}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Agendar llamada
                  </Button>
                  
                  <Button onClick={() => { setStatus('idle'); setFormState({ name: '', phone: '', email: '', type: 'Tráfico', message: '' }); }} variant="outline" fullWidth>
                    Volver al formulario
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="h-full flex flex-col justify-center relative">
                <div className="mb-8">
                  <h4 className="text-2xl font-bold text-slate-800 mb-2">Déjanos tus datos</h4>
                  <p className="text-slate-500">Completa el formulario y te asesoraremos gratis.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FloatingInput 
                    label="Nombre completo" 
                    name="name" 
                    value={formState.name} 
                    onChange={handleChange}
                    icon={<div className="w-5 h-5 rounded-full bg-slate-200" />} // Placeholder icon
                    activeField={activeField}
                    setActiveField={setActiveField}
                  />
                  <FloatingInput 
                    label="Teléfono de contacto" 
                    name="phone" 
                    type="tel"
                    value={formState.phone} 
                    onChange={handleChange}
                    icon={<Phone className="w-5 h-5" />}
                    activeField={activeField}
                    setActiveField={setActiveField}
                    error={phoneError}
                  />
                </div>

                <FloatingInput 
                  label="Correo electrónico" 
                  name="email" 
                  type="email"
                  value={formState.email} 
                  onChange={handleChange}
                  icon={<Mail className="w-5 h-5" />}
                  activeField={activeField}
                  setActiveField={setActiveField}
                />

                <div className="mb-4 relative">
                   <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Tipo de Accidente</label>
                   <div className="relative">
                     <select 
                      name="type"
                      value={formState.type}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-4 outline-none focus:border-brand-500 focus:bg-white focus:shadow-lg transition-all font-medium text-slate-900 appearance-none"
                     >
                      <option>Accidente de Tráfico</option>
                      <option>Accidente Laboral</option>
                      <option>Negligencia Médica</option>
                      <option>Caída en Vía Pública</option>
                      <option>Otro</option>
                     </select>
                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                       <ArrowRight className="w-5 h-5 rotate-90" />
                     </div>
                   </div>
                </div>

                <div className="relative mb-8">
                   <textarea
                    name="message"
                    rows={3}
                    placeholder="Cuéntanos brevemente qué pasó..."
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-4 outline-none focus:border-brand-500 focus:bg-white focus:shadow-lg transition-all font-medium text-slate-900 resize-none placeholder-slate-400"
                   ></textarea>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  variant="primary" 
                  fullWidth 
                  disabled={!formState.name || !formState.phone || status === 'submitting'}
                  className="shadow-brand-600/40 hover:shadow-brand-600/60"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Enviando solicitud...
                    </>
                  ) : (
                    <>
                      Solicitar Estudio Gratuito
                      <Send className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-slate-400 text-center mt-4">
                  Tus datos están protegidos por SSL y nuestra <button type="button" onClick={(e) => handleLegalClick(e, 'privacy')} className="underline hover:text-brand-600">política de privacidad</button>.
                </p>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
