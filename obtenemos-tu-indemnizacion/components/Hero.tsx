
import * as React from 'react';
import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, CheckCircle, Scan, Shield, Phone, User, FileText, Lock, MessageSquareText, Calendar, Loader2, Mail, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { analyzeCase } from '../services/geminiService';
import { saveToGoogleSheets } from '../services/sheetService';

interface HeroProps {
  onOpenChat: () => void;
  onNavigate?: (page: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenChat, onNavigate }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    description: '',
    name: '',
    phone: '',
    email: ''
  });
  const [phoneError, setPhoneError] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [scanProgress, setScanProgress] = useState(0);
  const [scanText, setScanText] = useState('Iniciando escaneo...');

  const handleDescriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim()) return;
    setStep(2);
  };

  const validatePhone = (phone: string) => {
    const cleanPhone = phone.replace(/\s/g, '').replace(/\D/g, '');
    return cleanPhone.length === 9;
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) return;
    
    if (!validatePhone(formData.phone)) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);

    setIsSubmitting(true);
    try {
      await saveToGoogleSheets({
        origen: 'Hero - Asistente Principal',
        nombre: formData.name,
        telefono: formData.phone,
        email: formData.email,
        mensaje: formData.description,
        datos_extra: 'Usuario ha completado el análisis de viabilidad'
      });
      const result = await analyzeCase(formData.description);
      setAnalysisResult(result);
      setStep(4);
    } catch (error) {
      console.error("Error en el proceso", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLegalClick = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    if (onNavigate) onNavigate(page);
  };

  useEffect(() => {
    if (step === 2) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 2;
        setScanProgress(progress);
        if (progress < 30) setScanText('Analizando palabras clave...');
        else if (progress < 60) setScanText('Buscando jurisprudencia...');
        else if (progress < 90) setScanText('Calculando viabilidad...');
        else setScanText('Generando expediente...');
        if (progress >= 100) {
          clearInterval(interval);
          setStep(3);
        }
      }, 40);
      return () => clearInterval(interval);
    }
  }, [step]);

  return (
    <section className="relative pt-24 pb-12 lg:pt-24 lg:pb-24 overflow-hidden bg-slate-50 min-h-[auto] lg:min-h-[85vh] flex items-start transform-gpu">
      {/* Subtle Background Accents */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full bg-brand-600/10 blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] rounded-full bg-brand-accent/10 blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 grid lg:grid-cols-2 gap-4 lg:gap-20 items-start">
        {/* TEXT COLUMN - Balanced position, keeping lg:mt-4 as requested for desktop */}
        <div className="max-w-2xl animate-fade-in-up gpu-accelerated mt-0 lg:mt-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-tight mb-4 md:mb-6 tracking-tight">
            Te conseguimos la <br className="hidden lg:block" />
            <span className="text-brand-600">
              máxima
            </span>{" "}
            indemnización
          </h1>
          <p className="text-base md:text-xl text-slate-600 mb-6 md:mb-8 leading-relaxed font-medium max-w-lg lg:max-w-none">
            Especialistas líderes en reclamaciones por accidentes de tráfico. Solo cobramos si tú cobras. Consulta gratuita.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-4 lg:mb-10">
            <Button variant="primary" size="lg" className="group w-full sm:w-auto" onClick={() => document.getElementById('hero-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
              Empezar Reclamación
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Abogado" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-slate-500">+1.500 casos ganados</p>
            </div>
          </div>
        </div>

        {/* FORM COLUMN - Aligned with desktop text position */}
        <div id="hero-form" className="relative animate-fade-in-up w-full gpu-accelerated flex flex-col gap-4 mt-8 lg:mt-0" style={{ animationDelay: '0.2s' }}>
          {/* IMAGE CONTAINER */}
          <div className="w-full h-48 md:h-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative group transition-all duration-700 bg-slate-200">
             <img 
               src="https://i.pinimg.com/736x/4d/90/9c/4d909c0fe14f2048e4a9d5391b3ce6b5.jpg" 
               alt="Especialista Legal" 
               className="w-full h-full object-cover object-[center_10%] scale-[1.1] transition-transform duration-1000 group-hover:scale-[1.15]"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
          </div>

          <div className="relative bg-white rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 transform-gpu">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-600" />
                <span className="font-bold text-slate-800 text-sm tracking-tight">ASISTENTE LEGAL IA</span>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step >= i ? (step === i ? 'bg-brand-600 w-12' : 'bg-brand-300') : 'bg-slate-200'}`}></div>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-10 min-h-[380px] md:min-h-[420px] flex flex-col bg-white">
              {step === 1 && (
                <form onSubmit={handleDescriptionSubmit} className="flex-grow flex flex-col animate-fade-in-up">
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Cuéntanos tu caso</h3>
                  <p className="text-slate-500 mb-6 text-sm font-medium">Análisis instantáneo de viabilidad jurídica mediante IA.</p>
                  <div className="relative flex-grow mb-6">
                    <textarea 
                      className="w-full h-full min-h-[160px] p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all resize-none text-slate-900 font-medium text-base placeholder-slate-400 leading-relaxed shadow-inner"
                      placeholder="Ej: Tuve un accidente de tráfico ayer, un coche se saltó un Stop y me golpeó. Tengo dolor en el cuello y el brazo..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                    <FileText className="absolute bottom-4 right-4 text-slate-300 w-6 h-6 pointer-events-none" />
                  </div>
                  <Button type="submit" fullWidth variant="primary" size="lg" disabled={!formData.description.trim()}>
                    Analizar Mi Caso GRATIS
                  </Button>
                </form>
              )}

              {step === 2 && (
                <div className="flex-grow flex flex-col items-center justify-center text-center space-y-8 animate-fade-in-up">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-brand-100 flex items-center justify-center relative bg-brand-50">
                       <Scan className="w-10 h-10 text-brand-600 animate-pulse" />
                       <div className="absolute inset-[-8px] border-4 border-brand-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                  </div>
                  <div className="space-y-3 w-full max-w-xs mx-auto">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">{scanText}</h3>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden w-full shadow-inner">
                      <div className="h-full bg-brand-600 transition-all duration-75 will-change-transform" style={{ width: `${scanProgress}%` }}></div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <form onSubmit={handleLeadSubmit} className="flex-grow flex flex-col animate-fade-in-up">
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl mb-6 flex items-start gap-4">
                    <div className="p-2 bg-emerald-500 rounded-full text-white shadow-lg shadow-emerald-200">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-black text-emerald-900 text-base">¡Caso Viable!</p>
                      <p className="text-sm text-emerald-700 mt-0.5 font-medium">Detectamos altas probabilidades de éxito en tu reclamación.</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-6">¿Dónde enviamos el informe completo?</h3>
                  <div className="space-y-4 mb-8">
                    <div className="relative group">
                      <User className="absolute left-4 top-4 text-slate-400 group-focus-within:text-brand-600 transition-colors w-5 h-5" />
                      <input 
                        type="text" required placeholder="Nombre y apellidos"
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 pl-12 pr-4 outline-none focus:border-brand-500 focus:bg-white focus:shadow-lg transition-all font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-4 text-slate-400 group-focus-within:text-brand-600 transition-colors w-5 h-5" />
                      <input 
                        type="tel" required placeholder="Teléfono de contacto"
                        className={`w-full bg-slate-50 border-2 rounded-2xl px-5 py-4 pl-12 pr-4 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium ${phoneError ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-slate-200 focus:border-brand-500 focus:bg-white focus:shadow-lg'}`}
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({...formData, phone: e.target.value});
                          if (phoneError) setPhoneError(false);
                        }}
                      />
                      {phoneError && (
                        <div className="flex items-center gap-1 mt-1 ml-4 text-red-600 text-xs font-bold animate-fade-in-up">
                          <AlertCircle className="w-3 h-3" />
                          <span>Introduce un número de 9 caracteres</span>
                        </div>
                      )}
                    </div>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-4 text-slate-400 group-focus-within:text-brand-600 transition-colors w-5 h-5" />
                      <input 
                        type="email" required placeholder="Correo electrónico"
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 pl-12 pr-4 outline-none focus:border-brand-500 focus:bg-white focus:shadow-lg transition-all font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Button type="submit" fullWidth variant="primary" size="lg" disabled={!formData.name || !formData.phone || !formData.email || isSubmitting}>
                      {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Procesando...</> : 'Recibir Resultado Ahora'}
                    </Button>
                    <div className="flex flex-col items-center justify-center gap-1 mt-4">
                      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-widest">
                        <Lock className="w-3 h-3" /> <span>Privacidad Protegida</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Consulta nuestra <button type="button" onClick={(e) => handleLegalClick(e, 'privacy')} className="underline hover:text-brand-600">política de privacidad</button>
                      </p>
                    </div>
                  </div>
                </form>
              )}

              {step === 4 && (
                <div className="flex-grow flex flex-col items-center text-center animate-fade-in-up">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-100">
                    <Shield className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Informe Preliminar</h3>
                  <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 w-full mb-8 text-left max-h-48 overflow-y-auto custom-scrollbar">
                     <p className="text-slate-700 font-bold leading-relaxed text-sm italic">"{formData.description}"</p>
                     <div className="h-px bg-slate-200 my-4"></div>
                     <p className="text-slate-600 font-medium leading-relaxed text-base">{analysisResult}</p>
                  </div>
                  <div className="w-full space-y-4">
                    <Button fullWidth variant="secondary" size="lg" onClick={() => window.open('https://cal.com/obtenemostuindemnizacion/30min', '_blank')}>
                      <Calendar className="w-5 h-5 mr-2" /> Agendar llamada
                    </Button>
                    <Button fullWidth variant="outline" size="lg" onClick={onOpenChat}>
                      <MessageSquareText className="w-5 h-5 mr-2" /> Hablar con asistente
                    </Button>
                  </div>
                  <button onClick={() => { setStep(1); setFormData({description: '', name: '', phone: '', email: ''}); }} className="mt-6 text-xs font-bold text-slate-400 hover:text-brand-600 uppercase tracking-widest transition-colors">Nueva consulta</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
