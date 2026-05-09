
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  ShieldAlert, 
  Users, 
  Heart,
  ChevronRight,
  Send,
  Scale
} from 'lucide-react';
import { cn } from '../lib/utils';

interface EmergencyViewProps {
  onBack: () => void;
}

export default function EmergencyView({ onBack }: EmergencyViewProps) {
  const [isCanceled, setIsCanceled] = useState(false);
  const [timer, setTimer] = useState(5);
  const [activeTab, setActiveTab] = useState<'Protocolo' | 'Contactos'>('Protocolo');

  // Simulated countdown
  React.useEffect(() => {
    if (timer > 0 && !isCanceled) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isCanceled]);

  return (
    <div className="h-full flex flex-col py-4">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white/30 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Volver</span>
      </button>

      {timer > 0 && !isCanceled ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12">
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }} 
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-48 h-48 rounded-full bg-red-600/10 flex items-center justify-center border border-red-500/20"
            >
              <div className="w-36 h-36 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.4)] border-4 border-red-400/30">
                <span className="text-6xl font-bold text-white font-mono tracking-tighter">{timer}</span>
              </div>
            </motion.div>
            <div className="absolute inset-[-20px] border-2 border-red-500/20 rounded-full animate-ping"></div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white font-serif italic text-center">Modo Demo Activo</h2>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold max-w-[280px] mx-auto leading-relaxed text-center">
              Esta alerta simula el envío de GPS y protocolos legales de custodia. En producción, contactaría autoridades reales.
            </p>
          </div>

          <button 
            onClick={() => setIsCanceled(true)}
            className="px-12 py-5 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-bold hover:text-white hover:bg-white/10 transition-all uppercase tracking-[0.3em] text-[10px] shadow-2xl"
          >
            Abortar Alerta
          </button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col space-y-8"
          >
            <div className="bg-red-600 rounded-[2.5rem] p-8 text-white flex items-center justify-between shadow-[0_0_40px_rgba(220,38,38,0.2)] border border-red-400/20 relative overflow-hidden group">
              <div className="flex items-center gap-5 relative z-10">
                <div className="bg-white/10 p-4 rounded-2xl">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif italic">Ayuda en Camino</h3>
                  <p className="text-[10px] text-red-100 uppercase tracking-widest font-bold opacity-70">Ubicación compartida • SHA-256 OK</p>
                </div>
              </div>
              <button className="bg-white/20 p-4 rounded-2xl hover:bg-white/30 transition-colors relative z-10 shadow-xl">
                <Phone className="w-5 h-5 text-white" />
              </button>
              <div className="absolute top-[-40px] right-[-40px] opacity-[0.05] group-hover:scale-125 transition-transform">
                <Scale size={180} />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-white/5 p-1.5 rounded-[1.5rem] border border-white/5 shadow-inner">
              {['Protocolo', 'Contactos'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={cn(
                    "flex-1 py-3 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all",
                    activeTab === tab 
                      ? "bg-legal-gold text-legal-navy shadow-lg shadow-legal-gold/20" 
                      : "text-white/30 hover:text-white/50"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
              {activeTab === 'Protocolo' ? (
                <div className="space-y-6">
                  <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Asistencia Legal IA</h4>
                  <div className="space-y-4">
                    <ChatBubble text="Mantén la calma. ¿Existen heridos o riesgo inminente de vida?" isUser={false} />
                    <ChatBubble text="Acabo de registrar tu geolocalización con hash inmutable. Mantente en un lugar iluminado." isUser={false} />
                  </div>
                  
                  {/* Chat Input Sim */}
                  <div className="mt-8 flex gap-3">
                    <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white/30 text-[10px] uppercase tracking-widest font-bold">Respuesta rápida...</div>
                    <button className="bg-white text-legal-navy p-4 rounded-2xl shadow-xl transition-transform active:scale-95"><Send size={18}/></button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Círculo de Seguridad</h4>
                  <ContactItem name="Maria Sosa" role="Madre (Principal)" status="Notificada" />
                  <ContactItem name="Dr. Torres" role="Firma Legal" status="Standby" />
                  <button className="w-full py-5 border border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-2 text-white/20 hover:text-legal-gold hover:border-legal-gold hover:bg-white/[0.02] transition-all">
                    <Users size={24} className="opacity-40" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Agregar Protector</span>
                  </button>
                </div>
              )}
            </div>

            <button className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all hover:bg-white/10 shadow-2xl">
              <Phone className="w-4 h-4 text-red-500" />
              Llamada de Emergencia (123)
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

function ChatBubble({ text, isUser }: { text: string, isUser: boolean }) {
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cn(
        "max-w-[85%] px-5 py-4 rounded-[1.5rem] text-[11px] leading-relaxed font-serif italic shadow-lg shadow-black/20",
        isUser 
          ? "bg-legal-gold text-legal-navy rounded-tr-none" 
          : "bg-white/10 text-white/80 rounded-tl-none border border-white/5"
      )}>
        {text}
      </div>
    </div>
  );
}

function ContactItem({ name, role, status }: { name: string, role: string, status: string }) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
          <Users className="text-white/20 w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">{name}</p>
          <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{role}</p>
        </div>
      </div>
      <span className={cn(
        "text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border",
        status === 'Notificada' 
          ? "bg-green-500/10 text-green-500 border-green-500/20" 
          : "bg-white/5 text-white/20 border-white/5"
      )}>
        {status}
      </span>
    </div>
  );
}
