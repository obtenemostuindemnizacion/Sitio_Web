
// PEGA AQUÍ LA URL DE TU SCRIPT DE GOOGLE (La que termina en /exec)
const SCRIPT_URL: string = "https://script.google.com/macros/s/AKfycbxexQPMimx0THyP5r0CYUmNzs8hWAofjvnoOa7cqe5clRK72MnBkMtn6_vrnWHDXmp7gA/exec"; 

interface LeadData {
  origen: string;
  nombre?: string;
  telefono: string;
  email?: string;
  mensaje?: string;
  datos_extra?: string;
}

export const saveToGoogleSheets = async (data: LeadData): Promise<boolean> => {
  if (!SCRIPT_URL) {
    console.error("⚠️ URL de Script no configurada");
    return false;
  }

  console.log("🚀 Iniciando envío a Google Sheets...", data);

  try {
    // ESTRATEGIA ESTÁNDAR (FormData):
    const formData = new FormData();
    
    // Las claves coinciden con los encabezados de tu Excel
    // La fecha la genera el propio script ahora para ser más preciso, pero la enviamos por si acaso
    formData.append("Fecha", new Date().toLocaleString('es-ES'));
    formData.append("Origen", data.origen);
    formData.append("Nombre", data.nombre || "");
    formData.append("Telefono", data.telefono);
    formData.append("Email", data.email || "");
    formData.append("Mensaje", data.mensaje || "");
    formData.append("Datos_Extra", data.datos_extra || "");

    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Necesario para evitar bloqueos del navegador
      body: formData
    });
    
    console.log("✅ Datos enviados (Modo No-CORS). Revisa tu hoja de cálculo.");
    return true;
  } catch (error) {
    console.error("❌ Error de red al enviar a Sheets:", error);
    return false;
  }
};
