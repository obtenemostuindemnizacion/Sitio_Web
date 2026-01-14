import React from 'react';
import { DollarSign, Clock, Gavel, HeartHandshake } from 'lucide-react';

const features = [
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Máxima Indemnización",
    description: "Conocemos los baremos al detalle. Luchamos cada euro que te corresponde."
  },
  {
    icon: <Gavel className="w-6 h-6" />,
    title: "Solo cobramos si tú cobras",
    description: "Trabajamos a éxito. Solo cobramos si tú cobras. Cero riesgos."
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Gestión Rápida",
    description: "Agilizamos los trámites burocráticos para que recibas tu dinero cuanto antes."
  },
  {
    icon: <HeartHandshake className="w-6 h-6" />,
    title: "Trato Humano",
    description: "Entendemos tu dolor. Te acompañamos en todo el proceso médico y legal."
  }
];

export const Features: React.FC = () => {
  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
              <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-brand-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};