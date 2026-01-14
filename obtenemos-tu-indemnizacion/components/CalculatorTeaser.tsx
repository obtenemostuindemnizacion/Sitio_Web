import React from 'react';
import { Calculator, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from './ui/Button';

interface CalculatorTeaserProps {
  onOpen: () => void;
}

export const CalculatorTeaser: React.FC<CalculatorTeaserProps> = ({ onOpen }) => {
  return (
    <section className="relative py-24 overflow-hidden bg-slate-900">
      {/* 
        TRANSICIONES SUAVES: 
        Estos degradados simulan un desvanecimiento entre el color de fondo de las secciones adyacentes (slate-50) 
        y el fondo oscuro de esta sección, haciendo que el cambio sea visualmente menos brusco.
      */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-50 to-transparent z-10 opacity-100"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent z-10 opacity-100"></div>

      {/* Background Gradients - Decorativos internos */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-600 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-accent rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="bg-slate-800/80 border border-white/5 shadow-2xl rounded-[2.5rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/20 text-brand-accent border border-brand-accent/30 text-sm font-bold animate-pulse">
              <TrendingUp className="w-4 h-4" />
              <span>Herramienta Gratuita 2026-27</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              ¿No sabes cuánto te corresponde? <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-amber-300">
                Calcúlalo ahora
              </span>
            </h2>
            
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              Utiliza nuestra tecnología basada en el Baremo de Tráfico 2026. Obtén una estimación inmediata sin compromiso y de forma anónima.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
              <Button variant="secondary" size="lg" onClick={onOpen} className="group px-10 py-5 text-xl">
                <Calculator className="w-6 h-6 mr-3" />
                Empezar Cálculo
              </Button>
              <div className="flex flex-col items-center lg:items-start">
                 <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                   Tiempo estimado
                 </p>
                 <p className="text-white font-black text-lg">
                   ~ 60 segundos
                 </p>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-accent rounded-[2rem] blur-3xl opacity-20 transform scale-110 group-hover:scale-125 transition-transform duration-700"></div>
            
            <div className="relative bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 shadow-3xl transform-gpu transition-all duration-500 group-hover:-translate-y-2">
              {/* Previsualización de UI de la calculadora */}
              <div className="space-y-6 opacity-60 pointer-events-none select-none">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-1 bg-brand-600 rounded-full"></div>
                  <div className="w-12 h-1 bg-slate-700 rounded-full"></div>
                  <div className="w-12 h-1 bg-slate-700 rounded-full"></div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-slate-400 text-sm font-bold uppercase tracking-wider">
                    <span>Baja impeditiva</span>
                    <span className="text-white">32 días</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full w-4/5 bg-gradient-to-r from-brand-600 to-brand-500"></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-slate-400 text-sm font-bold uppercase tracking-wider">
                    <span>Secuelas leves</span>
                    <span className="text-white">2 puntos</span>
                  </div>
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full w-1/3 bg-brand-accent"></div>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-white/5 flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Estimación Máxima</p>
                    <p className="text-4xl font-black text-white tracking-tighter">4.280 €</p>
                  </div>
                  <div className="h-14 w-14 bg-white text-slate-900 rounded-2xl flex items-center justify-center shadow-2xl rotate-3">
                    <Calculator className="w-8 h-8" />
                  </div>
                </div>
              </div>
              
              {/* Botón flotante central */}
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button variant="primary" onClick={onOpen} className="scale-110 shadow-2xl">
                   Abrir Calculadora
                </Button>
              </div>
            </div>
            
            {/* Elemento decorativo flotante */}
            <div className="absolute -bottom-6 -right-6 bg-brand-accent text-slate-900 p-4 rounded-2xl shadow-2xl font-black text-sm hidden md:block animate-bounce">
               ¡Baremo 2026 Activo!
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};