
import React, { useEffect } from 'react';
import { ArrowLeft, Shield, Lock, Cookie } from 'lucide-react';
import { Button } from './ui/Button';

type LegalType = 'legal' | 'privacy' | 'cookies';

interface LegalPageProps {
  type: LegalType;
  onNavigate: (page: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, onNavigate }) => {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  const getContent = () => {
    switch (type) {
      case 'legal':
        return {
          title: 'Aviso Legal',
          icon: <Shield className="w-10 h-10 text-brand-600" />,
          content: (
            <div className="space-y-8 text-slate-600 leading-relaxed">
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-3">1. Datos Identificativos</h3>
                <p>
                  En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSICE), se exponen los siguientes datos identificativos de la empresa titular del sitio web:
                </p>
                <ul className="list-disc list-inside mt-4 ml-4 space-y-2">
                  <li><strong>Denominación Social:</strong> GARANLEY SLP</li>
                  <li><strong>Nombre comercial:</strong> Obtenemos Tu Indemnizacion</li>
                  <li><strong>NIF:</strong> B65652851</li>
                  <li><strong>Actividad:</strong> Servicios jurídicos de reclamaciones de indemnizaciones</li>
                  <li><strong>Domicilio Social:</strong> Carrer d'Aragó, 210, Eixample, 08011 Barcelona.</li>
                  <li><strong>Email de contacto:</strong> obtenemostuindemnizacion@gmail.com</li>
                  <li><strong>Teléfono:</strong> +34 680 885 637</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-3">2. Usuarios y Uso del Portal</h3>
                <p>
                  El acceso y/o uso de este portal atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas. El portal proporciona el acceso a multitud de informaciones, servicios, programas o datos (en adelante, "los contenidos") en Internet pertenecientes a GARANLEY SLP o a sus licenciantes a los que el USUARIO pueda tener acceso.
                </p>
                <p className="mt-4">
                  El USUARIO asume la responsabilidad del uso del portal. Dicha responsabilidad se extiende al registro que fuese necesario para acceder a determinados servicios o contenidos.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-3">3. Propiedad Intelectual e Industrial</h3>
                <p>
                  GARANLEY SLP por sí o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial de su página web, así como de los elementos contenidos en la misma (a título enunciativo: imágenes, sonido, audio, vídeo, software o textos; marcas o logotipos, combinaciones de colores, estructura y diseño, selección de materiales usados, etc.).
                </p>
                <p className="mt-4">
                  Quedan expresamente prohibidas la reproducción, la distribución y la comunicación pública, incluida su modalidad de puesta a disposición, de la totalidad o parte de los contenidos de esta página web, con fines comerciales, en cualquier soporte y por cualquier medio técnico, sin la autorización de GARANLEY SLP.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-3">4. Exclusión de Garantías y Responsabilidad</h3>
                <p>
                  GARANLEY SLP no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos o lesivos en los contenidos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-3">5. Solicitud de Servicios Jurídicos</h3>
                <p>
                  El cliente solicita voluntariamente la prestación de servicios jurídicos por parte de <strong>GARANLEY SLP</strong> y autoriza expresamente a su equipo jurídico, especializado en accidentes de tráfico, a actuar en su nombre para el asesoramiento legal y la defensa de sus intereses. Asimismo, el cliente consiente expresamente el tratamiento de sus datos personales, incluidos los datos especialmente protegidos, necesarios para la gestión de su expediente y el ejercicio de acciones legales, de conformidad con la normativa vigente en materia de protección de datos.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-3">6. Legislación Aplicable y Jurisdicción</h3>
                <p>
                  La relación entre GARANLEY SLP y el USUARIO se regirá por la normativa española vigente y cualquier controversia se someterá a los Juzgados y tribunales de la ciudad de Barcelona.
                </p>
              </section>
            </div>
          )
        };
      case 'privacy':
        return {
          title: 'Política de Privacidad',
          icon: <Lock className="w-10 h-10 text-brand-600" />,
          content: (
            <div className="space-y-8 text-slate-600 leading-relaxed">
              <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100 mb-8">
                <p className="font-medium text-brand-900">
                  En <strong>GARANLEY SLP</strong>, la confidencialidad de tus datos médicos y legales es nuestra máxima prioridad. Cumplimos estrictamente con el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica de Protección de Datos (LOPDGDD).
                </p>
              </div>

              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-3">1. Responsable del Tratamiento</h3>
                <p>
                  <strong>Identidad:</strong> GARANLEY SLP<br/>
                  <strong>Dirección:</strong> Carrer d'Aragó, 210, Eixample, 08011 Barcelona.<br/>
                  <strong>Contacto:</strong> obtenemostuindemnizacion@gmail.com
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-3">2. Finalidad del Tratamiento</h3>
                <p>Tratamos la información que nos facilitan las personas interesadas con el fin de:</p>
                <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                  <li>Gestionar el estudio de viabilidad de su reclamación.</li>
                  <li>Prestar el servicio de asesoramiento jurídico y defensa legal contratado.</li>
                  <li>Tramitar la documentación médica necesaria para la peritación del daño corporal.</li>
                  <li>Comunicarnos con aseguradoras y juzgados en nombre del cliente.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-3">3. Legitimación</h3>
                <p>La base legal para el tratamiento de sus datos es:</p>
                <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                  <li><strong>Ejecución de un contrato:</strong> Prestación de servicios jurídicos (Hoja de Encargo).</li>
                  <li><strong>Consentimiento del interesado:</strong> Para el estudio previo de viabilidad y formularios de contacto.</li>
                  <li><strong>Interés legítimo:</strong> Para responder a sus consultas.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-3">4. Destinatarios</h3>
                <p>
                  Los datos se comunicarán a los siguientes destinatarios en función de la necesidad para la gestión de su reclamación:
                </p>
                <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                  <li>Compañías Aseguradoras (parte contraria).</li>
                  <li>Procuradores y Tribunales de Justicia.</li>
                  <li>Peritos médicos y clínicas de rehabilitación colaboradoras.</li>
                  <li>Organismos públicos competentes.</li>
                </ul>
                <p className="mt-2">No se prevén transferencias internacionales de datos.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-3">5. Autorización de Servicios y Tratamiento de Datos</h3>
                <p>
                  El cliente solicita voluntariamente la prestación de servicios jurídicos por parte de <strong>GARANLEY SLP</strong> y autoriza expresamente a su equipo jurídico, especializado en accidentes de tráfico, a actuar en su nombre para el asesoramiento legal y la defensa de sus intereses. Asimismo, el cliente consiente expresamente el tratamiento de sus datos personales, incluidos los datos especialmente protegidos, necesarios para la gestión de su expediente y el ejercicio de acciones legales, de conformidad con la normativa vigente en materia de protección de datos.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-3">6. Derechos</h3>
                <p>
                  Cualquier persona tiene derecho a obtener confirmación sobre si estamos tratando datos personales que les conciernan. Las personas interesadas tienen derecho a:
                </p>
                <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                  <li>Solicitar el acceso a los datos personales.</li>
                  <li>Solicitar su rectificación o supresión.</li>
                  <li>Solicitar la limitación de su tratamiento.</li>
                  <li>Oponerse al tratamiento.</li>
                  <li>Solicitar la portabilidad de los datos.</li>
                </ul>
                <p className="mt-4">
                  Puede ejercer sus derechos enviando un correo electrónico a obtenemostuindemnizacion@gmail.com adjuntando copia de su DNI.
                </p>
              </section>
            </div>
          )
        };
      case 'cookies':
        return {
          title: 'Política de Cookies',
          icon: <Cookie className="w-10 h-10 text-brand-600" />,
          content: (
            <div className="space-y-8 text-slate-600 leading-relaxed">
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-3">1. ¿Qué son las cookies?</h3>
                <p>
                  Una cookie es un fichero que se descarga en su ordenador al acceder a determinadas páginas web. Las cookies permiten a una página web, entre otras cosas, almacenar y recuperar información sobre los hábitos de navegación de un usuario o de su equipo y, dependiendo de la información que contengan y de la forma en que utilice su equipo, pueden utilizarse para reconocer al usuario.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-3">2. Tipos de cookies que utiliza esta web</h3>
                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 p-4 rounded-xl">
                    <h4 className="font-bold text-slate-800">Cookies Técnicas (Necesarias)</h4>
                    <p className="text-sm mt-1">
                      Son aquellas que permiten al usuario la navegación a través de la página web y la utilización de las diferentes opciones o servicios que en ella existan, como controlar el tráfico, identificar la sesión o realizar la solicitud de inscripción.
                    </p>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-xl">
                    <h4 className="font-bold text-slate-800">Cookies de Análisis</h4>
                    <p className="text-sm mt-1">
                      Son aquellas que permiten al responsable de las mismas, el seguimiento y análisis del comportamiento de los usuarios de los sitios web a los que están vinculadas. Utilizamos Google Analytics para medir la interacción del usuario con la web.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-3">3. Desactivación o eliminación de cookies</h3>
                <p>
                  Puede usted permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador instalado en su ordenador:
                </p>
                <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                  <li><strong>Chrome:</strong> Configuración -> Mostrar opciones avanzadas -> Privacidad -> Configuración de contenido.</li>
                  <li><strong>Firefox:</strong> Herramientas -> Opciones -> Privacidad -> Historial -> Configuración Personalizada.</li>
                  <li><strong>Safari:</strong> Preferencias -> Seguridad.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-3">4. Consentimiento</h3>
                <p>
                  Al navegar y continuar en nuestro sitio web estará consintiendo el uso de las cookies antes enunciadas, en las condiciones contenidas en la presente Política de Cookies.
                </p>
              </section>
            </div>
          )
        };
      default:
        return { title: '', icon: null, content: null };
    }
  };

  const data = getContent();

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="mb-8">
           <Button variant="ghost" onClick={() => onNavigate('home')} className="pl-0 hover:bg-transparent hover:text-brand-600">
             <ArrowLeft className="w-5 h-5 mr-2" />
             Volver al inicio
           </Button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 p-8 md:p-12 text-white relative overflow-hidden">
            {/* Abstract BG */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 flex items-center gap-6">
               <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                 {data.icon}
               </div>
               <div>
                 <h1 className="text-3xl md:text-4xl font-black mb-2">{data.title}</h1>
                 <p className="text-brand-100 opacity-80">Última actualización: Enero 2026</p>
               </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {data.content}
          </div>
        </div>
      </div>
    </div>
  );
};
