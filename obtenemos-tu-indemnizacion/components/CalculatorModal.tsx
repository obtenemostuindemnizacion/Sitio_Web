
import React, { useState, useEffect } from 'react';
import { X, Calculator, ArrowRight, RefreshCcw, Scale, ShieldAlert, Loader2, Activity, BedDouble, CalendarClock, Plus, Minus, MessageSquareText, Calendar, Phone, Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { calculateCompensationWithAI } from '../services/geminiService';
import { saveToGoogleSheets } from '../services/sheetService';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: () => void;
  onNavigate?: (page: string) => void;
}

type AccidentType = 'Trafico' | 'Laboral' | 'Negligencia' | 'Caida' | 'Otro' | '';

const CounterInput = ({ 
  label, 
  subLabel, 
  value, 
  onChange, 
  icon: Icon, 
  colorClass,
  bgClass,
  borderClass
}: { 
  label: string, 
  subLabel: string, 
  value: number, 
  onChange: (val: number) => void, 
  icon: any,
  colorClass: string,
  bgClass: string,
  borderClass: string
}) => (
  <div className={`relative p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 ${borderClass} bg-white hover:shadow-lg group`}>
    <div className="flex items-start justify-between mb-4">
      <div>
        <h4 className="font-bold text-slate-900 text-sm md:text-base">{label}</h4>
        <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider opacity-70 mt-1">{subLabel}</p>
      </div>
      <div className={`p-2 md:p-2.5 rounded-xl ${bgClass} ${colorClass}`}>
        <Icon className="w-4 h-4 md:w-5 md:h-5" />
      </div>
    </div>
    
    <div className="flex items-center justify-between bg-slate-50 rounded-xl p-1.5 border border-slate-100">
      <button 
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-10 h-10 md:w-12 md:h-10 flex items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm hover:text-brand-600 hover:shadow-md transition-all active:scale-95 touch-manipulation"
      >
        <Minus className="w-4 h-4" />
      </button>
      
      <input 
        type="number" 
        min="0"
        value={value === 0 ? '' : value}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          onChange(isNaN(val) ? 0 : Math.max(0, val));
        }}
        placeholder="0"
        className="w-12 md:w-16 text-center bg-transparent font-bold text-lg md:text-xl text-slate-800 outline-none"
      />
      
      <button 
        onClick={() => onChange(value + 1)}
        className="w-10 h-10 md:w-12 md:h-10 flex items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm hover:text-brand-600 hover:shadow-md transition-all active:scale-95 touch-manipulation"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export const CalculatorModal: React.FC<CalculatorModalProps> = ({ isOpen, onClose, onOpenChat, onNavigate }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  // Form State
  const [accidentType, setAccidentType] = useState<AccidentType>('');
  const [hasMaterialDamages, setHasMaterialDamages] = useState<boolean | null>(null);
  const [hasInjuries, setHasInjuries] = useState<boolean | null>(null);
  const [daysICU, setDaysICU] = useState(0);
  const [daysHospital, setDaysHospital] = useState(0);
  const [daysRehab, setDaysRehab] = useState(0);
  const [hasLegalDefense, setHasLegalDefense] = useState<boolean | null>(null);
  const [legalDefenseStatus, setLegalDefenseStatus] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [email, setEmail] = useState('');

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

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !email) return;

    if (!validatePhone(phone)) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);

    setStep(5); // Show result/loading view
    setIsLoading(true);
    
    const data = {
      accidentType,
      hasMaterialDamages,
      hasInjuries,
      daysICU,
      daysHospital,
      daysRehab,
      hasLegalDefense,
      legalDefenseStatus
    };

    try {
      const result = await calculateCompensationWithAI(data);
      setAiResult(result);
      
      // Guardar el lead completo
      await saveToGoogleSheets({
        origen: 'Calculadora IA - Proceso Completo',
        telefono: phone,
        email: email,
        mensaje: `Estimación solicitada para: ${accidentType}. Daños: ${hasMaterialDamages ? 'SÍ' : 'NO'}. Lesiones: ${hasInjuries ? 'SÍ' : 'NO'}.`,
        datos_extra: `Días: ICU(${daysICU}) Hosp(${daysHospital}) Rehab(${daysRehab}) | Situación: ${legalDefenseStatus} | Resultado: ${result.substring(0, 150)}`
      });
    } catch (error) {
      console.error("Error al calcular", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setAccidentType('');
    setHasMaterialDamages(null);
    setHasInjuries(null);
    setDaysICU(0);
    setDaysHospital(0);
    setDaysRehab(0);
    setHasLegalDefense(null);
    setLegalDefenseStatus('');
    setPhone('');
    setPhoneError(false);
    setEmail('');
    setAiResult(null);
  };

  const handleLegalClick = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    onClose();
    if (onNavigate) onNavigate(page);
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">¿Qué tipo de accidente has tenido?</h3>
        <p className="text-slate-500 mb-6">Selecciona la opción que mejor describa tu caso.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['Trafico', 'Laboral', 'Negligencia', 'Caida', 'Otro'].map((type) => (
            <button
              key={type}
              onClick={() => setAccidentType(type as AccidentType)}
              className={`p-4 rounded-xl border-2 text-left transition-all active:scale-95 ${
                accidentType === type 
                  ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-md' 
                  : 'border-slate-200 hover:border-brand-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="font-bold block">{type === 'Trafico' ? 'Accidente de Tráfico' : type === 'Caida' ? 'Caída en Vía Pública' : type === 'Negligencia' ? 'Negligencia Médica' : type === 'Laboral' ? 'Accidente Laboral' : 'Otro'}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <Button onClick={() => setStep(2)} disabled={!accidentType} fullWidth={window.innerWidth < 768} className="md:w-auto">
          Siguiente <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 md:space-y-8 animate-fade-in-up">
      <div>
        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-4">¿Tuviste daños materiales?</h3>
        <div className="flex gap-4">
          <button onClick={() => setHasMaterialDamages(true)} className={`flex-1 p-4 rounded-xl border-2 font-bold transition-all active:scale-95 ${hasMaterialDamages === true ? 'border-brand-600 bg-brand-600 text-white shadow-lg' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>SÍ</button>
          <button onClick={() => setHasMaterialDamages(false)} className={`flex-1 p-4 rounded-xl border-2 font-bold transition-all active:scale-95 ${hasMaterialDamages === false ? 'border-brand-600 bg-brand-600 text-white shadow-lg' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>NO</button>
        </div>
      </div>
      <div>
        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-4">¿Tuviste lesiones físicas?</h3>
        <div className="flex gap-4">
          <button onClick={() => setHasInjuries(true)} className={`flex-1 p-4 rounded-xl border-2 font-bold transition-all active:scale-95 ${hasInjuries === true ? 'border-brand-600 bg-brand-600 text-white shadow-lg' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>SÍ</button>
          <button onClick={() => setHasInjuries(false)} className={`flex-1 p-4 rounded-xl border-2 font-bold transition-all active:scale-95 ${hasInjuries === false ? 'border-brand-600 bg-brand-600 text-white shadow-lg' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>NO</button>
        </div>
      </div>
      {hasInjuries && (
        <div className="space-y-4 animate-fade-in-up pb-4">
           <div className="flex items-center justify-between">
             <h3 className="text-lg font-bold text-slate-800">Detalle de días de curación</h3>
             <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-md">Baremo 2026-27</span>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CounterInput label="Días UCI" subLabel="Muy Grave" value={daysICU} onChange={setDaysICU} icon={Activity} colorClass="text-rose-600" bgClass="bg-rose-100" borderClass={daysICU > 0 ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200 hover:border-rose-300"} />
              <CounterInput label="Hospital" subLabel="Grave" value={daysHospital} onChange={setDaysHospital} icon={BedDouble} colorClass="text-amber-600" bgClass="bg-amber-100" borderClass={daysHospital > 0 ? "border-amber-500 ring-1 ring-amber-500" : "border-slate-200 hover:border-amber-300"} />
              <CounterInput label="Baja/Rehab" subLabel="Moderado" value={daysRehab} onChange={setDaysRehab} icon={CalendarClock} colorClass="text-brand-600" bgClass="bg-brand-100" borderClass={daysRehab > 0 ? "border-brand-500 ring-1 ring-brand-500" : "border-slate-200 hover:border-amber-300"} />
           </div>
        </div>
      )}
      <div className="flex justify-between pt-6 border-t border-slate-100 mt-6 items-center">
        <button onClick={() => setStep(1)} className="text-slate-500 font-medium underline hover:text-brand-600 p-2">Atrás</button>
        <button onClick={() => setStep(3)} disabled={hasMaterialDamages === null || hasInjuries === null} className="inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 ml-auto bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 shadow-lg shadow-brand-600/30">Siguiente <ArrowRight className="ml-2 w-4 h-4" /></button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 md:space-y-8 animate-fade-in-up">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Scale className="w-6 h-6 text-brand-600" />
          <h3 className="text-lg md:text-xl font-bold text-slate-900">¿Tienes actualmente defensa jurídica?</h3>
        </div>
        <div className="flex gap-4 mb-6">
          <button onClick={() => { setHasLegalDefense(true); setLegalDefenseStatus(''); }} className={`flex-1 p-4 rounded-xl border-2 font-bold transition-all active:scale-95 ${hasLegalDefense === true ? 'border-brand-600 bg-brand-600 text-white shadow-lg' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>SÍ</button>
          <button onClick={() => { setHasLegalDefense(false); setLegalDefenseStatus('No tengo abogado'); }} className={`flex-1 p-4 rounded-xl border-2 font-bold transition-all active:scale-95 ${hasLegalDefense === false ? 'border-brand-600 bg-brand-600 text-white shadow-lg' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>NO</button>
        </div>
        {hasLegalDefense === true && (
          <div className="bg-blue-50 p-4 md:p-6 rounded-2xl border border-blue-100 animate-fade-in-up">
             <h4 className="text-sm font-bold text-blue-900 mb-4 uppercase tracking-wide">Indícanos más información</h4>
             <div className="space-y-3">
               {["He contratado al abogado de mi aseguradora", "He contratado a un abogado externo", "No estoy conforme con mi defensa actual"].map((option) => (
                 <label key={option} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${legalDefenseStatus === option ? 'bg-white border-brand-500 shadow-md ring-1 ring-brand-500' : 'bg-white/50 border-slate-200 hover:bg-white'}`}>
                   <input type="radio" name="legalStatus" className="w-4 h-4 text-brand-600 focus:ring-brand-500 shrink-0" checked={legalDefenseStatus === option} onChange={() => setLegalDefenseStatus(option)} />
                   <span className="ml-3 text-slate-700 text-sm font-medium">{option}</span>
                 </label>
               ))}
             </div>
          </div>
        )}
      </div>
      <div className="flex justify-between pt-4 items-center">
        <button onClick={() => setStep(2)} className="text-slate-500 font-medium underline hover:text-brand-600 p-2">Atrás</button>
        <button onClick={() => setStep(4)} disabled={hasLegalDefense === null || (hasLegalDefense === true && !legalDefenseStatus)} className="inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 shadow-lg shadow-brand-600/30">Ver estimación</button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 md:space-y-8 animate-fade-in-up py-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2">¡Cálculo casi listo!</h3>
        <p className="text-slate-500 max-w-sm mx-auto">
          Para revelarte la estimación exacta según el Baremo 2026, necesitamos tus datos de contacto. Un abogado validará tu caso gratuitamente.
        </p>
      </div>

      <form onSubmit={handleFinalSubmit} className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Phone className={`w-5 h-5 transition-colors ${phoneError ? 'text-red-500' : 'text-slate-400 group-focus-within:text-brand-600'}`} />
          </div>
          <input 
            type="tel"
            required
            placeholder="Tu número de teléfono"
            className={`w-full bg-slate-50 border-2 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-slate-900 text-lg placeholder:text-slate-400 ${phoneError ? 'border-red-500 bg-red-50 focus:border-red-600' : 'border-slate-200 focus:border-brand-500 focus:bg-white focus:shadow-xl'}`}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
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
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
          </div>
          <input 
            type="email"
            required
            placeholder="Tu correo electrónico"
            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-brand-500 focus:bg-white focus:shadow-xl transition-all font-bold text-slate-900 text-lg placeholder:text-slate-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
           <Lock className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
           <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
             Tus datos están protegidos. Al hacer clic, aceptas que un abogado te contacte para confirmar tu estimación sin compromiso. Solo cobramos si tú cobras. Puedes leer nuestra <button type="button" onClick={(e) => handleLegalClick(e, 'privacy')} className="underline hover:text-brand-600">política de privacidad</button>.
           </p>
        </div>

        <button type="submit" disabled={!phone || !email} className="inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 w-full bg-brand-600 hover:bg-brand-500 text-white px-8 py-5 text-lg shadow-xl shadow-brand-600/40">
           REVELAR MI ESTIMACIÓN <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </form>
      
      <div className="text-center">
        <button onClick={() => setStep(3)} className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600 transition-colors">Volver atrás</button>
      </div>
    </div>
  );

  const renderResult = () => (
    <div className="text-center py-4 animate-fade-in-up min-h-[350px] md:min-h-[400px] flex flex-col justify-center">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-16 h-16 text-brand-600 animate-spin mb-6" />
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Consultando Baremo 2026...</h3>
          <p className="text-slate-500">Analizando tus lesiones y situación legal con nuestra IA.</p>
        </div>
      ) : (
        <>
          <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Calculator className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Análisis Finalizado</h3>
          <p className="text-slate-500 mb-6 text-sm uppercase tracking-widest">Basado en Baremo 2026</p>
          <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden text-left shadow-2xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-3xl opacity-20"></div>
             <div className="relative z-10"><p className="text-base md:text-lg leading-relaxed font-medium">{aiResult}</p></div>
          </div>
          {(legalDefenseStatus.includes("aseguradora") || legalDefenseStatus.includes("No estoy conforme")) && (
             <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-left mb-6 flex gap-3">
              <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0" /><p className="text-xs md:text-sm text-amber-800"><strong>Ojo:</strong> Has indicado dudas sobre tu defensa. Las aseguradoras suelen ofrecer acuerdos a la baja. Una segunda opinión es crítica.</p>
            </div>
          )}
          <div className="space-y-3">
            <button className="inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 w-full bg-brand-accent hover:bg-amber-400 text-brand-900 px-8 py-4 text-lg shadow-xl shadow-amber-500/30 hover:scale-105" onClick={() => window.open('https://cal.com/obtenemostuindemnizacion/30min', '_blank')}><Calendar className="w-5 h-5 mr-2" />Agendar llamada</button>
            <button className="inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 w-full bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 text-lg shadow-xl shadow-brand-600/40" onClick={() => { onClose(); onOpenChat(); }}><MessageSquareText className="w-5 h-5 mr-2" />Hablar con asistente</button>
            <button onClick={resetForm} className="text-slate-500 font-medium text-sm flex items-center justify-center gap-2 mx-auto py-2 hover:text-brand-600"><RefreshCcw className="w-4 h-4" /> Realizar otro cálculo</button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white w-full md:max-w-2xl rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden h-[92vh] md:h-auto md:max-h-[95vh] flex flex-col mt-auto md:mt-0">
        <div className="bg-white px-6 py-4 border-b border-slate-100 flex justify-between items-center z-10 shrink-0">
          <div className="flex items-center gap-2"><Calculator className="w-5 h-5 text-brand-600" /><span className="font-bold text-slate-700">Calculadora IA</span></div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <div className="h-1 bg-slate-100 w-full shrink-0">
          <div className="h-full bg-brand-600 transition-all duration-500 ease-out" style={{ width: `${(step / 5) * 100}%` }}></div>
        </div>
        <div className="p-4 md:p-10 overflow-y-auto custom-scrollbar bg-white relative flex-grow pb-12">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderResult()}
        </div>
      </div>
    </div>
  );
};
