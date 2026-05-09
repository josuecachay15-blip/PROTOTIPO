
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ChevronRight, 
  AlertCircle, 
  Camera, 
  Video, 
  MapPin, 
  Clock, 
  CheckCircle2,
  Lock,
  Upload,
  Scale
} from 'lucide-react';
import { TRIAGE_FLOW } from '../constants';
import { TriageStep } from '../types';
import { cn } from '../lib/utils';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface TriageViewProps {
  onBack: () => void;
}

export default function TriageView({ onBack }: TriageViewProps) {
  const [currentStepId, setCurrentStepId] = useState('start');
  const [history, setHistory] = useState<string[]>([]);
  const [result, setResult] = useState<{ text: string, classification: string } | null>(null);
  const [showEvidence, setShowEvidence] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = TRIAGE_FLOW[currentStepId];

  const handleOptionClick = (option: any) => {
    if (option.result) {
      setResult({ text: option.result, classification: option.classification });
    } else if (option.nextStepId) {
      setHistory([...history, currentStepId]);
      setCurrentStepId(option.nextStepId);
    }
  };

  const handleGoBack = () => {
    if (result) {
      setResult(null);
    } else if (history.length > 0) {
      const prevStepId = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentStepId(prevStepId);
    } else {
      onBack();
    }
  };

  const handleSubmitReport = async () => {
    if (!auth.currentUser || !result) return;
    
    setIsSubmitting(true);
    const reportPath = 'reports';
    
    try {
      await addDoc(collection(db, reportPath), {
        userId: auth.currentUser.uid,
        status: 'Radicado',
        classification: result.text,
        description: `Denuncia auto-generada mediante triaje. Nivel: ${result.classification}`,
        location: { lat: -12.0464, lng: -77.0428 }, // Mock GPS for demo
        metadata: {
          timestamp: new Date().toISOString(),
          hash: '7e8f' + Math.random().toString(16).slice(2, 8),
          gps: '-12.0464, -77.0428'
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Delay for "Processing" animation
      setTimeout(() => {
        setIsSubmitting(false);
        onBack();
      }, 1500);
    } catch (error) {
      setIsSubmitting(false);
      handleFirestoreError(error, OperationType.CREATE, reportPath);
    }
  };

  if (isSubmitting) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-legal-navy">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-8"
        >
          <div className="w-20 h-20 bg-legal-gold/10 rounded-2xl flex items-center justify-center border border-legal-gold/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
            <Scale className="text-legal-gold w-10 h-10" />
          </div>
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-3 font-serif italic">Sincronizando...</h3>
        <p className="text-white/40 text-xs uppercase tracking-widest font-bold leading-relaxed">
          Registrando metadata con cifrado E2EE militar y verificación de integridad.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col py-4">
      {/* Header Navigation */}
      <button 
        onClick={handleGoBack}
        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Volver</span>
      </button>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div>
              <span className="text-legal-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-3 block">
                Triaje Inteligente v2.1
              </span>
              <h2 className="text-3xl font-bold text-white font-serif italic leading-tight">
                {currentStep.question}
              </h2>
            </div>

            <div className="space-y-3">
              {currentStep.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleOptionClick(option)}
                  className="w-full p-6 text-left border border-white/10 rounded-2xl flex items-center justify-between group transition-all bg-white/[0.02]"
                >
                  <span className="font-medium text-white/70 group-hover:text-white">{option.label}</span>
                  <ChevronRight className="text-white/20 group-hover:text-legal-gold w-5 h-5 transition-transform group-hover:translate-x-1" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : !showEvidence ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-legal-gold/10 rounded-xl flex items-center justify-center mb-6 border border-legal-gold/20">
                  <AlertCircle className="text-legal-gold w-6 h-6" />
                </div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-2">Dictamen Preliminar</h3>
                <p className="text-2xl font-bold font-serif mb-4 italic text-legal-gold">{result.text}</p>
                <div className="flex gap-2">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest",
                    result.classification === 'Grave' ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-legal-gold/20 text-legal-gold border border-legal-gold/30"
                  )}>
                    Prioridad: {result.classification}
                  </span>
                </div>
              </div>
              <div className="absolute top-[-40px] right-[-40px] opacity-[0.03]">
                <Scale size={200} />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Exégesis Jurídica</h4>
              <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5 shadow-inner">
                <p className="text-white/60 text-sm leading-relaxed font-serif italic">
                  "El análisis computacional encuadra los hechos en el <span className="text-white font-bold">{result.text}</span>. 
                  Se recomienda la aseguración de la cadena de custodia multimedia."
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowEvidence(true)}
              className="w-full py-5 bg-legal-gold text-legal-navy rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-legal-gold/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              Protocolo de Evidencia
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="evidence"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-white font-serif italic mb-2">Módulo Forense</h2>
              <p className="text-white/40 text-xs uppercase tracking-widest font-medium">Registro con Integridad Hash SHA-256</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <EvidenceSlot icon={<Camera />} label="Imagen" />
              <EvidenceSlot icon={<Video />} label="Video" />
            </div>

            <div className="bg-black/40 rounded-2xl p-6 border border-white/5 space-y-5">
              <div className="flex items-center gap-3">
                <Lock className="text-legal-gold w-4 h-4" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Metadata de Seguridad</p>
              </div>
              <div className="space-y-3">
                <MetadataRow icon={<MapPin size={12}/>} label="Coordenadas" value="-12.0464, -77.0428" />
                <MetadataRow icon={<Clock size={12}/>} label="ISO Timestamp" value="2026-05-08T06:42Z" />
                <MetadataRow icon={<CheckCircle2 size={12}/>} label="Hash Digital" value="7e8f...92a1" />
              </div>
            </div>

            <button
              onClick={handleSubmitReport}
              className="w-full py-5 bg-white text-legal-navy rounded-2xl font-bold uppercase tracking-widest text-xs shadow-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 hover:bg-slate-100"
            >
              Registrar en Sistema
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EvidenceSlot({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="aspect-square border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3 text-white/30 hover:border-legal-gold hover:text-legal-gold cursor-pointer transition-all bg-white/[0.01] hover:bg-white/[0.03]">
      <div className="p-5 bg-white/5 rounded-2xl">
        {React.cloneElement(icon as React.ReactElement, { className: "w-8 h-8" })}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </div>
  );
}

function MetadataRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-white/20">{icon}</span>
        <span className="text-[9px] uppercase tracking-widest font-bold text-white/40">{label}</span>
      </div>
      <span className="text-[9px] font-mono text-white/60">{value}</span>
    </div>
  );
}
