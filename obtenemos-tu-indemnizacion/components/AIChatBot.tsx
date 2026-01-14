
import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Smile, Paperclip, Mic, Phone, Video, MoreVertical, ArrowLeft, Check, CheckCheck, Calendar } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';
import { saveToGoogleSheets } from '../services/sheetService';

interface AIChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sent' | 'read';
  hasAction?: 'schedule'; // New field for actions
}

// OPTIMIZACIÓN: Regex movidas fuera del componente para evitar recompilación constante
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
const PHONE_REGEX = /(\+34|0034|34)?[ -]*(6|7|8|9)[0-9]{2}[ -]*[0-9]{3}[ -]*[0-9]{3}/;

export const AIChatBot: React.FC<AIChatBotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Hola. Soy Eva, tu asistente legal. ¿En qué puedo ayudarte hoy?",
      sender: 'bot',
      timestamp: new Date(),
      status: 'read'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // --- LÓGICA DE DETECCIÓN Y GUARDADO AUTOMÁTICO ---
  const detectAndSaveLead = async (text: string, currentHistory: Message[]) => {
    const hasEmail = text.match(EMAIL_REGEX);
    const hasPhone = text.match(PHONE_REGEX);

    // Si detectamos un dato de contacto, guardamos la conversación
    if (hasEmail || hasPhone) {
      console.log("🎯 Dato de contacto detectado en el chat. Guardando lead...");
      
      // Formateamos la conversación para que sea legible en el Excel
      const fullConversation = currentHistory
        .map(m => `[${m.sender === 'user' ? 'USUARIO' : 'EVA'}]: ${m.text}`)
        .join('\n');

      // Enviamos a Google Sheets
      await saveToGoogleSheets({
        origen: 'Chatbot IA (Eva)',
        nombre: 'Usuario del Chat', // No sabemos el nombre exacto a menos que lo extraigamos, pero guardamos el contacto
        email: hasEmail ? hasEmail[0] : undefined,
        telefono: hasPhone ? hasPhone[0] : 'Detectado por contexto',
        mensaje: fullConversation, // Guardamos TODA la charla en la columna mensaje
        datos_extra: `Captura automática por detección de ${hasEmail ? 'Email' : 'Teléfono'}`
      });
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };

    // Actualizamos estado local
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(true); // Comienza la animación

    // INTENTO DE GUARDADO AUTOMÁTICO
    detectAndSaveLead(newUserMessage.text, updatedMessages);

    // Simulate "read" status change for user message
    setTimeout(() => {
      setMessages(prev => prev.map(msg => msg.id === newUserMessage.id ? {...msg, status: 'read'} : msg));
    }, 1000);

    // Prepare history for API
    const history = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    try {
      // --- LÓGICA DE TIEMPO DE ESPERA ARTIFICIAL ---
      // Creamos una promesa que tarda 2 segundos en resolverse (animación de escritura)
      const minDelayPromise = new Promise(resolve => setTimeout(resolve, 2000));
      
      // Llamada real a la API
      const apiCallPromise = getChatResponse(newUserMessage.text, history);

      // Esperamos a que AMBAS terminen. Esto asegura que la animación dure al menos 2s.
      // Si la API tarda 0.5s, esperamos 1.5s extra. Si tarda 3s, esperamos los 3s.
      const [_, apiResult] = await Promise.all([minDelayPromise, apiCallPromise]);
      
      const { text: responseText, showAction } = apiResult;

      setIsTyping(false); // Detiene la animación
      
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
        hasAction: showAction ? 'schedule' : undefined
      };

      setMessages(prev => [...prev, newBotMessage]);

    } catch (error) {
      console.error("Error sending message", error);
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const openCalendar = () => {
    window.open('https://cal.com/obtenemostuindemnizacion/30min', '_blank');
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 z-[115] bg-black/40 sm:bg-transparent transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto sm:pointer-events-none' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={onClose} 
      />

      <div className={`
        fixed inset-x-0 bottom-0 sm:right-6 sm:left-auto sm:bottom-6 z-[120]
        flex items-end sm:items-center justify-center sm:justify-end
        pointer-events-none
        transition-all duration-300 ease-in-out
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 scale-95'}
      `}>
        
        {/* Chat Container (WhatsApp Style) */}
        <div className={`
          ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}
          w-full sm:w-[380px] 
          h-[75vh] sm:h-[600px] sm:max-h-[80vh]
          bg-[#efeae2] 
          sm:rounded-xl rounded-t-xl
          shadow-2xl 
          flex flex-col 
          overflow-hidden
          border border-slate-200
          relative
        `}>
          
          {/* WhatsApp Background Pattern */}
          <div className="absolute inset-0 z-0 opacity-[0.4]" style={{ 
            backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
            backgroundRepeat: 'repeat',
            backgroundSize: '400px'
          }}></div>

          {/* WhatsApp Header */}
          <div className="bg-[#008069] px-2 py-2 flex justify-between items-center relative z-10 shadow-sm text-white">
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 sm:hidden">
                <ArrowLeft className="w-6 h-6" />
              </button>
              
              <div className="relative cursor-pointer">
                 <div className="w-10 h-10 rounded-full bg-white overflow-hidden flex items-center justify-center p-0.5">
                    <div className="w-full h-full rounded-full bg-[#25D366] flex items-center justify-center text-white font-bold text-xl">
                      E
                    </div>
                 </div>
              </div>
              
              <div className="flex flex-col cursor-pointer">
                <h3 className="font-semibold text-white text-[17px] leading-tight">Eva (Asistente)</h3>
                <p className="text-[13px] text-white/80 leading-tight truncate w-32">
                  {isTyping ? 'Escribiendo...' : 'En línea'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 pr-2">
               <Video className="w-6 h-6 cursor-pointer" />
               <Phone className="w-5 h-5 cursor-pointer" />
               <button onClick={onClose} className="hidden sm:block">
                 <X className="w-6 h-6 cursor-pointer" />
               </button>
               <MoreVertical className="w-5 h-5 cursor-pointer sm:hidden" />
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 relative z-10 custom-scrollbar">
            
            {/* Encryption Notice */}
            <div className="flex justify-center my-4">
              <div className="bg-[#FFF3C2] text-[#5E5E5E] text-[10px] px-3 py-1.5 rounded-lg shadow-sm text-center max-w-[80%] leading-tight">
                🔒 Los mensajes están cifrados y se guardarán para estudio de tu caso.
              </div>
            </div>

            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  relative max-w-[85%] px-3 py-1.5 rounded-lg shadow-sm text-[15px] leading-snug
                  ${msg.sender === 'user' 
                    ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none' 
                    : 'bg-white text-slate-900 rounded-tl-none'
                  }
                `}>
                  {/* Tail Effect (CSS Triangle) */}
                  <div className={`absolute top-0 w-0 h-0 border-[6px] border-transparent 
                    ${msg.sender === 'user' 
                      ? '-right-[6px] border-t-[#d9fdd3] border-l-[#d9fdd3] rotate-0' 
                      : '-left-[6px] border-t-white border-r-white rotate-0'
                    }`} 
                  />

                  <div className="pr-2 pb-1 whitespace-pre-wrap">{msg.text}</div>

                  {/* ACTION BUTTON RENDER */}
                  {msg.hasAction === 'schedule' && (
                    <div className="mt-2 mb-1">
                      <button 
                        onClick={openCalendar}
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors shadow-sm"
                      >
                        <Calendar className="w-4 h-4" />
                        Agendar llamada
                      </button>
                    </div>
                  )}
                  
                  <div className="flex justify-end items-center gap-1 -mt-1 opacity-70 float-right">
                    <span className="text-[11px] min-w-fit mt-1">
                      {formatTime(msg.timestamp)}
                    </span>
                    {msg.sender === 'user' && (
                      <span className="mt-1">
                        {msg.status === 'read' 
                          ? <CheckCheck className="w-4 h-4 text-[#53bdeb]" /> 
                          : <Check className="w-4 h-4 text-slate-500" />
                        }
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
               <div className="flex w-full justify-start animate-fade-in-up">
                 <div className="relative max-w-[85%] px-4 py-3 rounded-lg shadow-sm bg-white rounded-tl-none flex items-center gap-1">
                    <div className="absolute top-0 -left-[6px] w-0 h-0 border-[6px] border-transparent border-t-white border-r-white"></div>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                 </div>
               </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area (WhatsApp Style) */}
          <div className="bg-[#f0f2f5] px-2 py-2 flex items-center gap-2 relative z-20">
            <button className="p-2 text-[#54656f] hover:bg-black/5 rounded-full transition-colors">
              <Smile className="w-6 h-6" />
            </button>
            <button className="p-2 text-[#54656f] hover:bg-black/5 rounded-full transition-colors hidden sm:block">
              <Paperclip className="w-6 h-6" />
            </button>

            <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2">
              <div className="flex-1 bg-white rounded-lg px-4 py-2 flex items-center">
                <input 
                  ref={inputRef}
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Escribe un mensaje"
                  className="flex-1 bg-transparent outline-none text-[15px] text-slate-900 placeholder-slate-500"
                  disabled={isTyping}
                />
              </div>
              
              <button 
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className={`
                   w-10 h-10 flex items-center justify-center rounded-full transition-all
                   ${inputText.trim() 
                     ? 'bg-[#00a884] text-white hover:bg-[#008f6f] shadow-sm transform hover:scale-105' 
                     : 'bg-transparent text-[#54656f]'
                   }
                `}
              >
                {inputText.trim() ? <Send className="w-5 h-5 ml-0.5" /> : <Mic className="w-6 h-6" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
