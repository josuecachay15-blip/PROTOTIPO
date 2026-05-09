
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  UserCheck, 
  UserX, 
  Scale, 
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

interface OfficerCheckProps {
  onBack: () => void;
}

export default function OfficerCheck({ onBack }: OfficerCheckProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<'not_found' | 'clean' | 'flagged' | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setIsSearching(true);
    setResult(null);

    // Simulate database lookup
    setTimeout(() => {
      setIsSearching(false);
      // Realistic simulation: Some names have results
      if (query.toLowerCase().includes('inhabilitado') || query.toLowerCase().includes('garcia')) {
        setResult('flagged');
      } else if (query.split(' ').length < 2) {
        setResult('not_found');
      } else {
        setResult('clean');
      }
    }, 1800);
  };

  return (
    <div className="h-full flex flex-col py-4">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Volver</span>
      </button>

      <section className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <UserCheck className="text-legal-gold w-6 h-6" />
          <h2 className="text-3xl font-bold text-white font-serif italic">Verificador Ético</h2>
        </div>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">Consulta Registro Civil de Sanciones (RNSSC)</p>
      </section>

      <form onSubmit={handleSearch} className="mb-8 relative">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-legal-gold transition-colors w-5 h-5" />
          <input 
            type="text"
            placeholder="DNI o Nombre completo del funcionario..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-32 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-legal-gold/50 transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit"
            disabled={isSearching}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-legal-gold text-legal-navy px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 transition-all active:scale-95"
          >
            Consultar
          </button>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center pt-20 gap-4"
            >
              <Loader2 className="text-legal-gold w-10 h-10 animate-spin opacity-40" />
              <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Cruzando Bases de Datos...</p>
            </motion.div>
          ) : result === 'flagged' ? (
            <motion.div 
              key="flagged"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center relative overflow-hidden">
                <div className="bg-red-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ShieldAlert className="text-red-500 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white font-serif italic mb-2">ALERTA: Sanción Vigente</h3>
                <p className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-6">INHABILITACIÓN PARA EL SERVICIO CIVIL</p>
                
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                    <p className="text-[8px] text-white/30 uppercase font-bold mb-1">Estado</p>
                    <p className="text-xs text-white font-bold">Vigente</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                    <p className="text-[8px] text-white/30 uppercase font-bold mb-1">Fecha Fin</p>
                    <p className="text-xs text-white font-bold text-red-400">12/04/2028</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4">
                <p className="text-white/60 text-xs leading-relaxed italic">
                  "Todo servidor público con sanción vigente de inhabilitación no puede realizar trámites ni ejercer autoridad ante la ciudadanía."
                </p>
                <button className="flex items-center gap-2 text-legal-gold text-[10px] font-bold uppercase tracking-widest hover:underline">
                  Ver detalle del expediente <ExternalLink size={10} />
                </button>
              </div>
            </motion.div>
          ) : result === 'clean' ? (
            <motion.div 
              key="clean"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-green-500/10 border border-green-500/20 rounded-3xl p-8 text-center">
                <div className="bg-green-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="text-green-500 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white font-serif italic mb-2">Sin Sanciones</h3>
                <p className="text-green-500/60 text-[10px] uppercase tracking-widest font-bold">Habilitado para la función pública</p>
              </div>

              <div className="grid gap-3">
                <CheckItem label="No registra inhabilitación en RNSSC" />
                <CheckItem label="Sin sanciones administrativas vigentes" />
                <CheckItem label="Declaración Jurada en orden (CGR)" />
              </div>
            </motion.div>
          ) : result === 'not_found' ? (
            <motion.div 
              key="not-found"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center pt-20 text-center px-8"
            >
              <div className="bg-white/5 p-6 rounded-full mb-6">
                <UserX className="text-white/20 w-10 h-10" />
              </div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold leading-relaxed">
                No se encontraron registros precisos con ese nombre. Por favor, ingresa el DNI o el nombre completo.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 pt-4"
            >
              <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Preguntas Frecuentes</h4>
              <FAQItem question="¿Qué es el RNSSC?" answer="Registro Nacional de Sanciones contra Servidores Civiles." />
              <FAQItem question="¿Por qué no aparece?" answer="Solo se muestran inhabilitaciones vigentes o sanciones inscritas." />
              <FAQItem question="¿Es vinculante?" answer="Este módulo es informativo facilitado por interoperabilidad." />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CheckItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl">
      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]"></div>
      <span className="text-[11px] font-bold text-white uppercase tracking-tight">{label}</span>
      <ChevronRight className="ml-auto text-white/10 w-4 h-4" />
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="p-5 border border-white/5 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
      <p className="text-[10px] font-bold text-white group-hover:text-legal-gold transition-colors mb-1">{question}</p>
      <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest leading-loose">{answer}</p>
    </div>
  );
}
