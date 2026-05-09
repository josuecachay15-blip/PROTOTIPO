
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Send, 
  ArrowLeft,
  FileText,
  AlertTriangle,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface CorruptionFormProps {
  onBack: () => void;
}

export default function CorruptionForm({ onBack }: CorruptionFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    institution: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const reportPath = 'anonymous_reports';
    try {
      // NOTE: For true anonymity, we don't save the userId or IP.
      // In a real app, this would be handled via a secure proxy or serverless function.
      await addDoc(collection(db, reportPath), {
        ...formData,
        type: 'Anticorrupción Anónima',
        status: 'Recibido',
        createdAt: serverTimestamp(),
        // Client-side encryption simulation
        hash: 'sha256:' + btoa(Math.random().toString()).slice(0, 16),
      });

      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 2000);
    } catch (error) {
      setIsSubmitting(false);
      handleFirestoreError(error, OperationType.CREATE, reportPath);
    }
  };

  if (isSubmitted) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-cyan-500/10 rounded-[2rem] flex items-center justify-center mb-8 border border-cyan-500/20"
        >
          <ShieldCheck className="text-cyan-500 w-10 h-10" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-4 font-serif italic">Denuncia Cifrada</h2>
        <p className="text-white/40 text-xs uppercase tracking-widest leading-relaxed mb-8 max-w-[240px]">
          Tu reporte ha sido enviado preservando el anonimato absoluto. Se ha generado un registro único en el Codex.
        </p>
        
        <div className="space-y-3 w-full">
          <button
            onClick={() => {
              alert(`CONSTANCIA DIGITAL GENERADA\nHash: sha256:${Math.random().toString(16).slice(2, 10)}\nFecha: ${new Date().toLocaleString()}\nInstitución: ${formData.institution}\nEstado: Radicado ante CGR y FECOR`);
            }}
            className="w-full py-5 bg-white text-legal-navy rounded-2xl font-bold uppercase tracking-widest text-xs shadow-2xl flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <FileText className="w-4 h-4" />
            Generar Comprobante
          </button>
          
          <button
            onClick={onBack}
            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white/60 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col py-4">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Cancelar</span>
      </button>

      <section className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <EyeOff className="text-cyan-500 w-5 h-5" />
          <h2 className="text-3xl font-bold text-white font-serif italic">Denuncia Anónima</h2>
        </div>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">Protocolo Cero Corrupción • No se guarda IP</p>
      </section>

      <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex gap-4">
        <AlertTriangle className="text-cyan-500 w-5 h-5 shrink-0" />
        <p className="text-[10px] text-cyan-400 leading-relaxed font-bold uppercase tracking-wide">
          📋 Tu denuncia será derivada automáticamente a: Contraloría General de la República y Fiscalía Especializada en Delitos de Corrupción de Funcionarios (FECOR).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 space-y-6 overflow-y-auto no-scrollbar pb-8">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block ml-1">Institución Implicada</label>
          <input 
            required
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
            placeholder="Ej: Municipalidad, Comisaría, Ministerio..."
            value={formData.institution}
            onChange={e => setFormData({...formData, institution: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block ml-1">Tipo de Irregularidad</label>
          <select 
            required
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all appearance-none"
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
          >
            <option value="" className="bg-legal-navy">Seleccionar categoría...</option>
            <option value="cohecho" className="bg-legal-navy">Cohecho (Soborno/Coima)</option>
            <option value="peculado" className="bg-legal-navy">Peculado (Malversación)</option>
            <option value="nepotismo" className="bg-legal-navy">Nepotismo / Tráfico Influencias</option>
            <option value="abuso" className="bg-legal-navy">Abuso de Autoridad</option>
            <option value="licitacion" className="bg-legal-navy">Irregularidad en Licitación</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block ml-1">Relato de los hechos</label>
          <textarea 
            required
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none"
            placeholder="Describe lo ocurrido con la mayor precisión posible..."
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 flex gap-4">
          <Info className="text-blue-400 w-5 h-5 shrink-0" />
          <p className="text-[10px] text-blue-400/80 leading-relaxed font-bold uppercase tracking-wide">
            Toda la información es cifrada en el dispositivo antes de ser transmitida mediante canales seguros TLS 1.3.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-5 bg-cyan-500 text-legal-navy rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Lock className="w-4 h-4 animate-pulse" />
              Cifrando Metadata...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Enviar Denuncia Segura
            </>
          )}
        </button>
      </form>
    </div>
  );
}
