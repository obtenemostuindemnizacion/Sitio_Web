
import React from 'react';
import { Star, Quote, ArrowRight, MapPin, BadgeCheck, Trophy, TrendingUp, CheckCircle2, MessageCircle } from 'lucide-react';
import { Button } from './ui/Button';

interface TestimonialsPageProps {
  onNavigate: (page: string) => void;
  onOpenChat: () => void;
}

// OPTIMIZACIÓN: Datos estáticos fuera del componente para evitar recreación en cada render
const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: "María González",
    image: "https://i.pinimg.com/736x/f6/61/ea/f661ea61616909838a9fbfeda0d2ea14.jpg",
    location: "Madrid",
    type: "Accidente de Tráfico",
    amount: "11.800€", 
    text: "La aseguradora me ofrecía 3.000€ y me decían que no tenía derecho a más por ser un latigazo cervical leve. Gracias al equipo, conseguimos cuatro veces más. Se encargaron de todo.",
    rating: 5,
    date: "Hace 2 semanas"
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    image: "https://i.pinimg.com/736x/25/33/8f/25338f488af2c45912c15ebab325e363.jpg",
    location: "Barcelona",
    type: "Accidente Laboral",
    amount: "26.500€", 
    text: "Tuve una caída en la obra por falta de arnés. Tenía miedo de reclamar por si me despedían, pero me explicaron mis derechos perfectamente. Al final logramos la indemnización y el recargo de prestaciones.",
    rating: 5,
    date: "Hace 1 mes"
  },
  {
    id: 3,
    name: "Elena M.",
    image: "https://i.pinimg.com/736x/89/18/6e/89186e357f672a7eb9c19e1d3dc7c18c.jpg",
    location: "Valencia",
    type: "Negligencia Médica",
    amount: "48.000€", 
    text: "Un error en el parto dejó secuelas a mi hijo. Fue un proceso largo y duro, pero la empatía de los abogados fue increíble. No solo ganamos el juicio, sino que nos sentimos acompañados.",
    rating: 5,
    date: "Hace 3 meses"
  },
  {
    id: 4,
    name: "Javier T.",
    location: "Sevilla",
    type: "Caída en Vía Pública",
    amount: "3.900€", 
    text: "Me tropecé con una baldosa levantada. El Ayuntamiento negaba su responsabilidad. Hicieron fotos, buscaron testigos y pelearon hasta el final.",
    rating: 5,
    date: "Hace 4 meses"
  },
  {
    id: 5,
    name: "Sofía L.",
    location: "Málaga",
    type: "Atropello en Paso de Cebra",
    amount: "12.400€", 
    text: "Estaba cruzando correctamente y un coche me golpeó. La rehabilitación fue pesada, pero ellos gestionaron todas las citas médicas privadas sin que yo pagara nada.",
    rating: 4,
    date: "Hace 5 meses"
  },
  {
    id: 6,
    name: "Roberto F.",
    location: "Bilbao",
    type: "Accidente de Moto",
    amount: "7.600€", 
    text: "Como motorista, siempre intentan culparte a ti. Demostraron que la culpa fue del contrario mediante un perito reconstructor. Muy profesionales.",
    rating: 5,
    date: "Hace 6 meses"
  }
];

export const TestimonialsPage: React.FC<TestimonialsPageProps> = ({ onNavigate, onOpenChat }) => {
  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen relative overflow-hidden">
      {/* Background Pattern - Increased Visibility */}
      <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-700 font-bold text-sm mb-6 shadow-sm">
            <Star className="w-4 h-4 fill-brand-accent text-brand-accent" />
            Excelencia Legal Certificada
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Nuestros Resultados <br/>
            <span className="text-brand-600">
              Hablan por Nosotros
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            No somos nosotros quienes decimos que somos buenos. Son las personas a las que hemos ayudado a recuperar su tranquilidad y su dinero.
          </p>
        </div>

        {/* Stats Section - Floating Bar Design */}
        <div className="max-w-5xl mx-auto mb-24">
           <div className="bg-white/80 backdrop-blur-md border border-white/50 shadow-2xl rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
               
               <div className="flex flex-col items-center justify-center p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-brand-100 rounded-lg text-brand-600">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <span className="text-4xl font-black text-slate-900">98%</span>
                  </div>
                  <p className="text-slate-500 font-medium text-sm uppercase tracking-wide">Casos Ganados</p>
               </div>

               <div className="flex flex-col items-center justify-center p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <span className="text-4xl font-black text-slate-900">+3.1M€</span>
                  </div>
                  <p className="text-slate-500 font-medium text-sm uppercase tracking-wide">Recuperados en 2025-26</p>
               </div>

               <div className="flex flex-col items-center justify-center p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                      <Star className="w-6 h-6 fill-current" />
                    </div>
                    <span className="text-4xl font-black text-slate-900">4.9/5</span>
                  </div>
                  <p className="text-slate-500 font-medium text-sm uppercase tracking-wide">Valoración Clientes</p>
               </div>

           </div>
        </div>

        {/* Testimonials Grid - New Card Design */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {TESTIMONIALS_DATA.map((item) => (
            <div key={item.id} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden relative border border-slate-100 hover:-translate-y-2">
               
               {/* Decorative Top Bar */}
               <div className="h-2 w-full bg-brand-600"></div>

               <div className="p-8 relative">
                 {/* Giant Quote Watermark */}
                 <Quote className="absolute top-4 right-6 w-24 h-24 text-slate-50 opacity-50 rotate-180 pointer-events-none" />

                 {/* User Header */}
                 <div className="flex items-center gap-4 mb-6 relative z-10">
                   <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-md overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        item.name.charAt(0)
                      )}
                   </div>
                   <div>
                     <p className="font-bold text-slate-900 text-lg leading-none">{item.name}</p>
                     <div className="flex items-center gap-1 mt-1 text-xs text-slate-400 font-medium">
                        <MapPin className="w-3 h-3" /> {item.location}
                     </div>
                   </div>
                 </div>

                 {/* Rating */}
                 <div className="flex gap-1 mb-4">
                   {[...Array(5)].map((_, i) => (
                     <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                     />
                   ))}
                 </div>

                 {/* Content */}
                 <p className="text-slate-600 leading-relaxed mb-8 min-h-[80px]">
                   "{item.text}"
                 </p>

                 {/* Footer Info */}
                 <div className="space-y-4">
                    <div className="inline-block px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {item.type}
                    </div>
                    
                    {/* Amount Highlight */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-xs text-slate-400 font-medium">Indemnización conseguida</span>
                      <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                        <BadgeCheck className="w-4 h-4" />
                        <span className="font-black text-lg">{item.amount}</span>
                      </div>
                    </div>
                 </div>
               </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA - Redesigned */}
        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
           <div className="absolute inset-0 bg-slate-900"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-brand-900 to-slate-900"></div>
           
           {/* Abstract shapes */}
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-600 rounded-full blur-[120px] opacity-30 translate-x-1/3 -translate-y-1/3"></div>
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-accent rounded-full blur-[100px] opacity-20 -translate-x-1/3 translate-y-1/3"></div>

           <div className="relative z-10 px-8 py-20 md:py-24 text-center max-w-3xl mx-auto">
             <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-brand-200 text-sm font-medium mb-8">
               <CheckCircle2 className="w-4 h-4 text-green-400" />
               Estudio de viabilidad gratuito
             </div>
             
             <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
               ¿Tu caso será el siguiente <br/> éxito que celebremos?
             </h2>
             
             <p className="text-slate-300 text-xl mb-10 font-light">
               Analizamos tu situación sin compromiso. Solo cobramos si tú cobras.
             </p>
             
             <div className="flex flex-col sm:flex-row gap-5 justify-center">
               <Button 
                 size="lg" 
                 className="shadow-lg shadow-brand-600/50 hover:scale-105 transition-transform" 
                 onClick={() => {
                   onNavigate('home');
                   setTimeout(() => {
                     const contactSection = document.getElementById('contacto');
                     contactSection?.scrollIntoView({ behavior: 'smooth' });
                   }, 100);
                 }}
               >
                 Quiero Reclamar Ahora <ArrowRight className="ml-2 w-5 h-5" />
               </Button>
               <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:border-white" onClick={onOpenChat}>
                 <MessageCircle className="w-5 h-5 mr-2" />
                 Contactar con nosotros
               </Button>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};
