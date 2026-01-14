import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageCircle, Gavel, Car, HeartPulse, HardHat, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { askFAQAI } from '../services/geminiService';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    id: 'general',
    label: 'General y Honorarios',
    icon: <Gavel className="w-5 h-5" />,
    items: [
      {
        question: "¿Cuánto cuestan vuestros servicios?",
        answer: "Trabajamos bajo el modelo 'a éxito'. Esto significa que no tienes que adelantarnos nada. Solo cobramos un porcentaje de la indemnización final una vez que tú hayas cobrado. Solo cobramos si tú cobras."
      },
      {
        question: "¿Necesito un abogado si la aseguradora ya me ha hecho una oferta?",
        answer: "Sí, rotundamente. Las aseguradoras son empresas que buscan minimizar costes. Sus primeras ofertas suelen ser entre un 40% y un 60% inferiores a lo que marca la ley. Un abogado independiente garantiza que recibas lo justo."
      },
      {
        question: "¿Cuánto tiempo tardaré en cobrar?",
        answer: "Depende de la complejidad y del tiempo de curación de tus lesiones. Los casos extrajudiciales suelen resolverse en 2-4 meses tras el alta médica. Si vamos a juicio, los plazos se alargan, pero los intereses de demora corren a tu favor."
      }
    ]
  },
  {
    id: 'trafico',
    label: 'Accidentes de Tráfico',
    icon: <Car className="w-5 h-5" />,
    items: [
      {
        question: "¿Tengo derecho a indemnización si soy ocupante?",
        answer: "Siempre. Los ocupantes siempre tienen derecho a cobrar el 100% de la indemnización, incluso si el conductor de su propio vehículo fue el culpable del accidente."
      },
      {
        question: "¿Qué pasa si tengo un latigazo cervical leve?",
        answer: "Desde 2016 se exige un informe médico concluyente en las primeras 72h. Es vital ir a urgencias inmediatamente tras el accidente. Si cumples los requisitos médicos y biomecánicos, es totalmente indemnizable."
      }
    ]
  },
  {
    id: 'negligencia',
    label: 'Negligencias Médicas',
    icon: <HeartPulse className="w-5 h-5" />,
    items: [
      {
        question: "¿Cómo sé si ha habido negligencia médica?",
        answer: "No todo mal resultado es una negligencia. Debe haber una desviación de la 'Lex Artis' (mala praxis). Nuestro equipo médico estudia tu historial clínico gratuitamente para determinar si hubo error."
      },
      {
        question: "¿Qué plazo tengo para demandar a un hospital?",
        answer: "El plazo es muy estricto: 1 año en la Sanidad Pública desde que se estabilizan las secuelas o fallece el paciente. En la Sanidad Privada puede extenderse hasta 5 años (responsabilidad contractual)."
      }
    ]
  },
  {
    id: 'laboral',
    label: 'Accidentes Laborales',
    icon: <HardHat className="w-5 h-5" />,
    items: [
      {
        question: "¿Puedo cobrar indemnización además de mi baja?",
        answer: "Sí, si el accidente se debió a una falta de medidas de seguridad (suelo mojado, maquinaria defectuosa, falta de EPIs). Es una indemnización civil compatible con la prestación de la Seguridad Social."
      },
      {
        question: "¿Me pueden despedir por reclamar?",
        answer: "El despido como represalia por ejercer tus derechos legales es nulo. Si ocurriera, tendrían que readmitirte y pagarte los salarios de tramitación."
      }
    ]
  }
];

export const FAQPage: React.FC<{ onNavigate: (page: string) => void; onOpenChat: () => void }> = ({ onNavigate, onOpenChat }) => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const toggleItem = (idx: string) => {
    setOpenItems(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsAiLoading(true);
    setAiAnswer(null);
    
    const response = await askFAQAI(searchQuery);
    
    setAiAnswer(response);
    setIsAiLoading(false);
  };

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-600 font-bold tracking-wider uppercase text-sm mb-2 block">Centro de Ayuda</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Resolvemos tus dudas legales
          </h1>
          <p className="text-lg text-slate-600">
            Nuestros abogados y nuestra IA están aquí para explicarte tus derechos de forma clara y sin tecnicismos.
          </p>
        </div>

        {/* AI Search Section */}
        <div className="max-w-2xl mx-auto mb-20 relative z-20">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 text-brand-600 font-bold">
                <Sparkles className="w-5 h-5" />
                <span>Asistente Legal Inteligente</span>
              </div>
              
              <form onSubmit={handleAiSearch} className="relative group">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ej: ¿Qué pasa si el contrario no tiene seguro?"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-32 outline-none focus:border-brand-500 focus:bg-white focus:shadow-lg transition-all text-slate-900 font-medium placeholder:text-slate-400"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
                <Button 
                  type="submit"
                  size="sm"
                  disabled={isAiLoading || !searchQuery.trim()}
                  className="absolute right-2 top-2 bottom-2"
                >
                  {isAiLoading ? 'Pensando...' : 'Preguntar'}
                </Button>
              </form>

              {/* AI Answer Display */}
              {(aiAnswer || isAiLoading) && (
                <div className="mt-6 animate-fade-in-up">
                  <div className="bg-brand-50 rounded-2xl p-6 border border-brand-100 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0 text-white shadow-md mt-1">
                      {isAiLoading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Gavel className="w-5 h-5" />}
                    </div>
                    <div>
                       <h4 className="font-bold text-brand-900 text-sm mb-1 uppercase tracking-wide">
                         {isAiLoading ? 'Analizando jurisprudencia...' : 'Respuesta del Experto'}
                       </h4>
                       <p className="text-slate-700 leading-relaxed text-lg">
                         {isAiLoading ? (
                           <span className="animate-pulse">Consultando la base de datos de indemnizaciones...</span>
                         ) : aiAnswer}
                       </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {faqData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-lg scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqData.find(c => c.id === activeCategory)?.items.map((item, index) => {
            const isOpen = openItems.includes(`${activeCategory}-${index}`);
            return (
              <div 
                key={index} 
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen ? 'border-brand-500 shadow-md ring-1 ring-brand-100' : 'border-slate-100 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleItem(`${activeCategory}-${index}`)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className={`font-bold text-lg ${isOpen ? 'text-brand-700' : 'text-slate-800'}`}>
                    {item.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-brand-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                
                <div 
                  className={`px-6 transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'
                  }`}
                >
                  <p className="text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Footer */}
        <div className="mt-20 text-center">
          <div className="inline-block bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-600 to-brand-accent"></div>
             <AlertCircle className="w-12 h-12 text-brand-accent mx-auto mb-4" />
             <h3 className="text-2xl font-bold text-slate-900 mb-2">¿No encuentras tu duda?</h3>
             <p className="text-slate-600 mb-6">
               Cada caso es único. Lo mejor es hablar directamente con un humano.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button onClick={() => onNavigate('home')}>
                 Volver al Inicio
               </Button>
               <Button variant="outline" onClick={onOpenChat}>
                 <MessageCircle className="w-4 h-4 mr-2" />
                 Habla con nosotros
               </Button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};