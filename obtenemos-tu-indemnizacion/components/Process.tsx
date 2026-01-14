
import React from 'react';
import { ArrowRight, FileText, Stethoscope, Scale, HandCoins } from 'lucide-react';
import { Button } from './ui/Button';

interface ProcessProps {
  onNavigate?: (page: string) => void;
}

export const Process: React.FC<ProcessProps> = ({ onNavigate }) => {
  const steps = [
    {
      num: '01',
      title: 'Contáctanos',
      desc: 'Analizamos tu caso gratis. Las primeras 72h son claves: guarda tus informes de urgencias.',
      icon: <FileText className="w-5 h-5" />
    },
    {
      num: '02',
      title: 'Tratamiento',
      desc: 'Seguimiento médico especializado para valorar todas tus secuelas reales.',
      icon: <Stethoscope className="w-5 h-5" />
    },
    {
      num: '03',
      title: 'Negociación',
      desc: 'Reclamación formal y negociación agresiva con la aseguradora contraria.',
      icon: <Scale className="w-5 h-5" />
    },
    {
      num: '04',
      title: 'Cobro',
      desc: 'Recibes tu indemnización máxima. Solo cobramos si tú cobras.',
      icon: <HandCoins className="w-5 h-5" />
    }
  ];

  const handleStartProcess = () => {
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="proceso" className="py-20 bg-brand-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
              Un proceso de <span className="text-brand-accent">4 pasos</span> hacia tu éxito
            </h2>
            <p className="text-slate-300 text-lg mb-10 leading-relaxed">
              Sabemos que estás pasando por un momento difícil. Por eso hemos simplificado todo para que tú solo te preocupes de recuperarte mientras nosotros peleamos por ti.
            </p>
            
            <div className="space-y-6 mb-10">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-4 md:gap-6 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-brand-800 border border-brand-700 flex items-center justify-center font-bold text-brand-accent text-xl transition-all group-hover:bg-brand-700 group-hover:scale-110">
                    {step.icon}
                  </div>
                  <div className="pt-1">
                    <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                       <span className="text-brand-accent/50 text-xs">PASO {step.num}</span>
                       {step.title}
                    </h3>
                    <p className="text-slate-400 text-sm md:text-base leading-snug">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              variant="secondary" 
              size="lg" 
              onClick={handleStartProcess}
              className="w-full sm:w-auto shadow-amber-500/20"
            >
              Empezar el Proceso Ahora <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          <div className="relative mt-8 lg:mt-0 lg:h-[700px]">
             <div className="absolute inset-0 bg-gradient-to-tr from-brand-accent to-brand-600 rounded-3xl transform rotate-3 blur-sm opacity-40"></div>
             <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              alt="Abogada especialista en traje" 
              className="relative rounded-3xl shadow-2xl border-4 border-brand-800 w-full h-full object-cover"
            />
            <div className="absolute -bottom-6 -left-2 md:-left-6 bg-white text-brand-900 p-5 md:p-6 rounded-xl shadow-xl max-w-[90%] md:max-w-xs mx-auto md:mx-0 left-0 right-0 md:right-auto">
              <p className="font-bold text-base md:text-lg mb-1">"Hicisteis posible que mi rehabilitación fuera 100% gratuita."</p>
              <p className="text-sm text-slate-500">- María G., Cliente Satisfecha</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
