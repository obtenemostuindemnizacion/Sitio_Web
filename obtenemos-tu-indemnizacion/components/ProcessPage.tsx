
import React, { useState } from 'react';
import { Search, FileText, Stethoscope, Scale, HandCoins, Sparkles, Clock, ArrowRight, CheckCircle2, Camera } from 'lucide-react';
import { Button } from './ui/Button';
import { askProcessAI } from '../services/geminiService';

// OPTIMIZACIÓN: Datos estáticos fuera del componente
const PROCESS_STEPS = [
  {
    id: 1,
    title: "Estudio de Viabilidad",
    duration: "24-48 horas",
    icon: <FileText className="w-6 h-6 md:w-8 md:h-8 text-white" />,
    color: "bg-slate-800",
    description: "Analizamos tu caso gratis. Las primeras 72 horas son claves: guarda tus informes médicos de urgencias, ya que son la base de una buena reclamación.",
    details: ["Revisión del atestado/parte", "Importancia de las primeras 72h", "Primera valoración legal"]
  },
  {
    id: 2,
    title: "Recopilación de Pruebas",
    duration: "Inmediato",
    icon: <Camera className="w-6 h-6 md:w-8 md:h-8 text-white" />,
    color: "bg-indigo-600",
    description: "Recogemos fotos del accidente, matrículas de vehículos, daños materiales y de las lesiones visibles. Esta evidencia visual es vital para demostrar la culpabilidad.",
    details: ["Fotos de matrículas y daños", "Fotos de heridos y escena", "Testigos y datos de contacto"]
  },
  {
    id: 3,
    title: "Tratamiento y Seguimiento",
    duration: "Según lesiones",
    icon: <Stethoscope className="w-6 h-6 md:w-8 md:h-8 text-white" />,
    color: "bg-blue-600",
    description: "Te centras en recuperarte. Nosotros recopilamos toda la documentación médica. Nuestros peritos médicos valoran tus secuelas para que no se escape ni un euro.",
    details: ["Seguimiento médico", "Recopilación de facturas", "Informe pericial propio"]
  },
  {
    id: 4,
    title: "Negociación Dura",
    duration: "1-2 meses",
    icon: <Scale className="w-6 h-6 md:w-8 md:h-8 text-white" />,
    color: "bg-amber-500",
    description: "Con el alta médica, presentamos la reclamación formal a la aseguradora. Negociamos agresivamente para mejorar su oferta inicial (que siempre es baja).",
    details: ["Reclamación previa", "Rechazo de ofertas bajas", "Defensa de intereses"]
  },
  {
    id: 5,
    title: "Cobro de Indemnización",
    duration: "Inmediato tras acuerdo",
    icon: <HandCoins className="w-6 h-6 md:w-8 md:h-8 text-white" />,
    color: "bg-green-600",
    description: "Si la oferta es justa, tú cobras tu dinero directamente en tu cuenta. Solo cobramos si tú cobras.",
    details: ["Transferencia a tu cuenta", "Pago de honorarios a éxito", "Cierre de expediente"]
  }
];

export const ProcessPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsAiLoading(true);
    setAiAnswer(null);
    
    const response = await askProcessAI(searchQuery);
    
    setAiAnswer(response);
    setIsAiLoading(false);
  };

  const handleFinalCTA = () => {
    onNavigate('home');
    // Aseguramos que el DOM se haya actualizado tras el cambio de estado en App.tsx
    requestAnimationFrame(() => {
      setTimeout(() => {
        const contactSection = document.getElementById('contacto');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    });
  };

  return (
    <div className="pt-28 md:pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="text-brand-600 font-bold tracking-wider uppercase text-sm mb-2 block">Transparencia Total</span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 md:mb-6">
            Así recuperamos tu dinero
          </h1>
          <p className="text-base md:text-lg text-slate-600">
            Sin letra pequeña. Te acompañamos en cada paso del camino, desde la primera llamada hasta que el dinero está en tu cuenta.
          </p>
        </div>

        {/* AI Process Guide */}
        <div className="max-w-3xl mx-auto mb-16 md:mb-20 relative z-20">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 relative overflow-hidden">
             {/* Abstract BG */}
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl"></div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-full bg-brand-900 flex items-center justify-center text-brand-accent">
                      <Clock className="w-5 h-5" />
                   </div>
                   <h3 className="font-bold text-xl text-slate-900">Guía de Tiempos y Etapas</h3>
                </div>
                
                <p className="text-slate-500 mb-6 text-sm">
                  ¿Tienes dudas sobre cuánto tarda tu caso o qué papeles necesitas? Pregunta a nuestra IA experta en gestión procesal.
                </p>

                <form onSubmit={handleAiSearch} className="relative">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ej: ¿Cuánto tardan en pagar después del alta médica?"
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-4 pl-4 pr-32 outline-none focus:border-brand-500 focus:bg-white focus:shadow-lg transition-all text-slate-900 font-medium placeholder-slate-400 text-sm md:text-base"
                  />
                  <Button 
                    type="submit"
                    size="sm"
                    disabled={isAiLoading || !searchQuery.trim()}
                    className="absolute right-2 top-2 bottom-2"
                  >
                    {isAiLoading ? 'Calculando...' : 'Consultar'}
                  </Button>
                </form>

                {/* AI Answer Display */}
                {(aiAnswer || isAiLoading) && (
                  <div className="mt-6 animate-fade-in-up">
                    <div className="bg-brand-50 rounded-xl p-5 border border-brand-100 flex gap-4">
                      <div className="mt-1">
                        <Sparkles className={`w-5 h-5 text-brand-600 ${isAiLoading ? 'animate-spin' : ''}`} />
                      </div>
                      <div>
                         <p className="text-slate-800 leading-relaxed font-medium">
                           {isAiLoading ? "Analizando flujo de trabajo y plazos legales..." : aiAnswer}
                         </p>
                         {!isAiLoading && (
                           <p className="text-xs text-brand-600 mt-2 font-bold">
                             * Los plazos son estimaciones basadas en casos promedio.
                           </p>
                         )}
                      </div>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Vertical Process Timeline */}
        <div className="max-w-4xl mx-auto relative">
           {/* Connecting Line - Mobile: Left Aligned, Desktop: Center */}
           <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-slate-200 -translate-x-1/2 hidden md:block"></div>
           <div className="absolute left-6 top-0 bottom-0 w-1 bg-slate-200 -translate-x-1/2 md:hidden"></div>

           <div className="space-y-12 relative z-10">
              {PROCESS_STEPS.map((step, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={step.id} className={`flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''} gap-8 relative`}>
                     
                     {/* Timeline Node */}
                     <div className="absolute left-6 md:left-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-white shadow-lg bg-brand-600 -translate-x-1/2 mt-6 z-20 flex items-center justify-center">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full"></div>
                     </div>

                     {/* Content Card */}
                     <div className={`flex-1 pl-16 md:pl-0 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow group">
                           <div className={`inline-flex items-center justify-center p-2 md:p-3 rounded-xl ${step.color} shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                              {step.icon}
                           </div>
                           
                           <div className={`flex flex-col ${isEven ? 'md:items-end' : ''}`}>
                             <span className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {step.duration}
                             </span>
                             <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 md:mb-3">
                               {step.id}. {step.title}
                             </h3>
                             <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-4">
                               {step.description}
                             </p>
                             
                             <ul className={`space-y-2 ${isEven ? 'md:items-end' : ''} flex flex-col`}>
                               {step.details.map((detail, i) => (
                                 <li key={i} className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                   {isEven ? (
                                      <span className="flex items-center gap-2 md:flex-row">
                                        <span className="md:order-1">{detail}</span>
                                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 md:order-2" />
                                      </span>
                                   ) : (
                                      <>
                                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        <span>{detail}</span>
                                      </>
                                   )}
                                 </li>
                               ))}
                             </ul>
                           </div>
                        </div>
                     </div>
                     
                     {/* Empty space for the other side */}
                     <div className="flex-1 hidden md:block"></div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Button 
            size="lg" 
            onClick={handleFinalCTA} 
            className="w-full md:w-auto"
          >
             Empezar el Proceso Ahora <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="mt-4 text-slate-500 text-sm">Sin costes iniciales · Consulta gratuita</p>
        </div>

      </div>
    </div>
  );
};
