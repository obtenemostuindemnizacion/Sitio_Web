
import { GoogleGenAI } from "@google/genai";

// Standard initialization using the environment variable as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCase = async (description: string): Promise<string> => {
  try {
    const model = "gemini-3-pro-preview";
    const prompt = `
      Actúa como un abogado experto en indemnizaciones y reclamaciones en España.
      El usuario te dará una breve descripción de su accidente o problema.
      Tu objetivo es dar una respuesta empática, profesional y alentadora, confirmando que su caso parece viable para reclamar una indemnización.
      Analiza la viabilidad basándote en la jurisprudencia española actual.
      No des cifras exactas, solo confirma el potencial.
      
      Descripción del usuario: "${description}"
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    return response.text || "Tu caso tiene un alto potencial de indemnización. Contáctanos para confirmar los detalles.";
  } catch (error) {
    console.error("Error analysing case:", error);
    return "Gracias por compartirlo. Según lo que nos cuentas, es muy probable que tengas derecho a una indemnización importante.";
  }
};

interface CalculationData {
  accidentType: string;
  hasMaterialDamages: boolean | null;
  hasInjuries: boolean | null;
  daysICU: number;
  daysHospital: number;
  daysRehab: number;
  hasLegalDefense: boolean | null;
  legalDefenseStatus: string;
}

export const calculateCompensationWithAI = async (data: CalculationData): Promise<string> => {
  try {
    const model = "gemini-3-pro-preview";
    
    const prompt = `
      Actúa como un perito médico-legal experto en el Baremo de Tráfico Español actualizado a 2026.
      Calcula una estimación de indemnización basada en los siguientes datos proporcionados por una víctima:

      DATOS DEL ACCIDENTE:
      - Tipo: ${data.accidentType}
      - Daños materiales: ${data.hasMaterialDamages ? 'SÍ' : 'NO'}
      - Lesiones físicas: ${data.hasInjuries ? 'SÍ' : 'NO'}
      
      DÍAS DE PERJUICIO (Si hay lesiones):
      - Días en UCI (Perjuicio Muy Grave): ${data.daysICU}
      - Días en Hospital (Perjuicio Grave): ${data.daysHospital}
      - Días de Rehabilitación/Baja (Perjuicio Moderado): ${data.daysRehab}

      SITUACIÓN LEGAL ACTUAL:
      - Tiene abogado: ${data.hasLegalDefense ? 'SÍ' : 'NO'}
      - Detalle legal: ${data.legalDefenseStatus || 'N/A'}

      INSTRUCCIONES:
      1. Calcula el rango económico aproximado sumando los días según los valores estimados del Baremo 2026 (Aprox: UCI ~128€/día, Hospital ~96€/día, Moderado ~64€/día). 
      2. Genera una respuesta MUY BREVE (máximo 50 palabras).
      3. Primero, da el rango de precio estimado en negrita (ej: "Estimamos entre X€ y Y€").
      4. Segundo, si su situación legal es "No estoy conforme" o "Abogado de aseguradora", aconséjale sutilmente que una segunda opinión experta podría aumentar esa cifra. Si no tiene abogado, dile que es vital para conseguir el máximo.
      5. Sé profesional pero cercano.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    return response.text || "Según los datos introducidos, estimamos una indemnización significativa. Por favor, contáctanos para un cálculo exacto.";
  } catch (error) {
    console.error("Error calculating compensation:", error);
    return "Hemos tenido un problema calculando la cifra exacta ahora mismo, pero basándonos en tus días de baja, la cuantía será elevada. Déjanos tus datos para informarte.";
  }
};

export const getChatResponse = async (message: string, history: any[]): Promise<{text: string, showAction: boolean}> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        { role: 'user', parts: [{ text: `
          Eres Eva, gestora de casos senior de 'Obtenemos Tu Indemnización'. 
          
          ESTADO DE LA CONVERSACIÓN:
          Debes analizar el historial para saber si el usuario YA te ha proporcionado su NOMBRE, TELÉFONO y CORREO ELECTRÓNICO.

          ESCENARIO A: Si NO tienes los datos de contacto:
          1. Tu prioridad es capturarlos (NOMBRE, TELÉFONO y CORREO) para formalizar el estudio gratuito.
          2. No seas un muro. Si pregunta algo, dale una "pequeña dosis" de valor (ej: plazos, consejos médicos iniciales).
          3. Pide los datos de forma natural pero persistente.

          ESCENARIO B: Si YA tienes los datos (revisa el historial):
          1. ¡NO vuelvas a pedirlos! Sería repetitivo y poco profesional.
          2. Cambia a un modo de conversación cotidiano, cercano y resolutivo.
          3. Responde a todas sus dudas técnicas o legales con detalle, actuando como su mano derecha.
          4. La primera vez que recibas los 3 datos, confirma su recepción y añade la etiqueta '[SCHEDULE]' al final. En los siguientes mensajes de este escenario, ya no es necesario el [SCHEDULE] a menos que sientas que el usuario quiere agendar.

          REGLAS GENERALES:
          - Sé concisa (máximo 45-50 palabras).
          - Tono: Empático, experto y muy servicial.
          - Si el usuario se despide o agradece, sé amable.
        `}]},
        ...history,
        { role: 'user', parts: [{ text: message }]}
      ],
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    let text = response.text || "";
    // Detectamos si el modelo ha decidido que es momento de agendar
    const showAction = text.includes('[SCHEDULE]');
    text = text.replace('[SCHEDULE]', '').trim();

    return { text, showAction };
  } catch (error) {
    console.error("Error in chat:", error);
    return { 
      text: "Entiendo perfectamente tu situación. Para poder darte una respuesta técnica precisa y que nuestro equipo médico-legal valore el caso, ¿podrías facilitarme tu nombre y un teléfono de contacto?", 
      showAction: false 
    };
  }
};

export const askFAQAI = async (question: string): Promise<string> => {
  try {
    const model = "gemini-3-flash-preview";
    const websiteContext = `
      INFORMACIÓN DE LA EMPRESA 'Obtenemos Tu Indemnización' (Razón Social: 'GARANLEY SLP'):
      - Política de cobro: Trabajamos a éxito. Solo cobramos un porcentaje de la indemnización. Solo cobramos si tú cobras (No Win No Fee).
      - Primera consulta: Totalmente gratuita.
      - Servicios: Accidentes de tráfico, laborales, negligencias médicas, caídas en vía pública, incidencias de vuelos.
      - Equipo: Abogados especialistas y peritos médicos propios.
      - Ubicación: Barcelona. Operamos en toda España.
      - Contacto: +34 680 885 637 o obtenemostuindemnizacion@gmail.com.
      - Plazos generales: 1 año para reclamar responsabilidad civil (tráfico, caídas), 5 años para negligencias (depende caso), etc.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: `
        CONTEXTO:
        ${websiteContext}

        ROL:
        Eres un Abogado Senior Especialista en Responsabilidad Civil de GARANLEY SLP. Estás en la sección de "Preguntas Frecuentes" de la web.

        TAREA:
        Responde a la pregunta del usuario "${question}".

        REGLAS:
        1. Prioriza la información del CONTEXTO de la empresa.
        2. Sé conciso (máximo 3-4 frases).
        3. Termina invitando sutilmente a contactar para un estudio gratuito.
      `,
    });

    return response.text || "Para esa consulta específica, lo mejor es que uno de nuestros abogados analice tu caso gratuitamente.";
  } catch (error) {
    console.error("Error FAQ AI:", error);
    return "En este momento estoy consultando la base de datos jurídica. Por favor, llámanos gratis.";
  }
};

export const askProcessAI = async (question: string): Promise<string> => {
  try {
    const model = "gemini-3-flash-preview";
    const processContext = `
      FLUJO DE TRABAJO DE 'Obtenemos Tu Indemnización' (Gestionado por GARANLEY SLP):
      Fase 1: Contacto y Viabilidad (24h)
      Fase 2: Curación y Documentación (1-6 meses variable)
      Fase 3: Negociación Extrajudicial (1-2 meses)
      Fase 4: Cobro o Juicio
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: `
        CONTEXTO:
        ${processContext}
        PREGUNTA DEL USUARIO: "${question}"
        Explica tiempos y fases brevemente.
      `,
    });

    return response.text || "Depende de la complejidad de tu caso. Llámanos para un estimado personalizado.";
  } catch (error) {
    console.error("Error Process AI:", error);
    return "Estoy recalculando los plazos estimados. Por favor, consúltanos directamente.";
  }
};
