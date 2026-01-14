
import React from 'react';
import { 
  Car, HardHat, AlertTriangle, Bike, Bus, Lock, ArrowRight, MessageSquare
} from 'lucide-react';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const servicesData: ServiceItem[] = [
  {
    id: 'trafico',
    title: 'Accidentes de Tráfico',
    description: 'Especialistas en la reclamación de latigazos cervicales y lesiones graves. Aplicamos el Baremo 2026 para que recibas hasta el último euro.',
    icon: <Car className="w-8 h-8 text-white" />,
    color: 'bg-blue-600',
  },
  {
    id: 'consorcio',
    title: 'Reclamación al Consorcio',
    description: 'Tramitamos tu expediente con urgencia si el responsable se dio a la fuga o no tiene seguro. Garantizamos tu cobro.',
    icon: <Lock className="w-8 h-8 text-white" />,
    color: 'bg-teal-600',
  },
  {
    id: 'laboral',
    title: 'Accidentes Laborales',
    description: 'Protegemos tu futuro si has sufrido daños trabajando por negligencia en seguridad. Reclamamos indemnización y recargo.',
    icon: <HardHat className="w-8 h-8 text-white" />,
    color: 'bg-orange-500',
  },
  {
    id: 'autobus',
    title: 'Accidente en Autobús',
    description: 'Como pasajero tu protección es máxima. Reclamamos el Seguro Obligatorio y la Responsabilidad Civil.',
    icon: <Bus className="w-8 h-8 text-white" />,
    color: 'bg-sky-500',
  },
  {
    id: 'caidas',
    title: 'Caídas en Vía Pública',
    description: 'Mal estado de la acera o suelos resbaladizos. Luchamos para que seas compensado por tus lesiones.',
    icon: <AlertTriangle className="w-8 h-8 text-white" />,
    color: 'bg-red-500',
  },
  {
    id: 'otros',
    title: 'Otros Atropellos y Daños',
    description: 'Atropellos a peatones o ciclistas. Analizamos tu caso de forma personalizada y sin compromiso.',
    icon: <Bike className="w-8 h-8 text-white" />,
    color: 'bg-purple-500',
  }
];

const ServiceCard: React.FC<{ service: ServiceItem, onOpenServiceModal: (s: {id: string, title: string}) => void }> = ({ service, onOpenServiceModal }) => {
  return (
    <div 
      onClick={() => onOpenServiceModal({ id: service.id, title: service.title })}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full transition-all duration-300 cursor-pointer hover:shadow-2xl hover:-translate-y-2 group"
    >
      <div className={`${service.color} p-8 flex justify-between items-start`}>
        <div className="text-white transition-transform duration-300 group-hover:scale-110">
           {service.icon}
        </div>
        <ArrowRight className="w-5 h-5 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-8 flex-grow flex flex-col">
        <h3 className="text-xl font-bold mb-4 transition-colors text-brand-900 group-hover:text-brand-600">
          {service.title}
        </h3>
        <p className="text-slate-600 mb-6 text-sm leading-relaxed flex-grow font-medium">
          {service.description}
        </p>
        
        {/* CTA Button at Bottom Left */}
        <div className="mt-auto pt-4 flex items-center gap-2 text-brand-600 font-black text-xs uppercase tracking-widest group-hover:text-brand-700 transition-colors">
          <span className="relative">
            Consultar caso gratis
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-600 transition-all duration-300 group-hover:w-full"></span>
          </span>
          <MessageSquare className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export const Services: React.FC<{ onOpenServiceModal: (s: {id: string, title: string}) => void }> = ({ onOpenServiceModal }) => {
  return (
    <section id="servicios" className="py-24 bg-slate-50 scroll-mt-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-brand-900 mb-4 uppercase tracking-tight">
            ¿En qué podemos ayudarte?
          </h2>
          <p className="text-lg text-slate-600 font-medium">
            Especialistas en obtener la reparación económica que mereces. Cada caso es único y lo tratamos de forma individual.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              onOpenServiceModal={onOpenServiceModal} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};
