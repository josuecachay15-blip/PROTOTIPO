
import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Navigation, 
  Plus, 
  Minus,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ViewState } from '../types';

interface TransparencyMapProps {
  onBack: () => void;
  onReport: () => void;
}

export default function TransparencyMap({ onBack, onReport }: TransparencyMapProps) {
  const constraintsRef = useRef(null);

  return (
    <div className="h-full flex flex-col py-4 relative space-y-6">
      {/* Header */}
      <section>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Volver al Inicio</span>
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1 font-serif italic">Mapa de Transparencia</h2>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">Densidad de Irregularidades Administrativas</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full animate-pulse">
              LIVE • INTEGRIDAD
            </span>
          </div>
        </div>
      </section>

      {/* Simulated Map Container */}
      <div 
        ref={constraintsRef}
        className="flex-1 bg-white/5 border border-white/5 rounded-[2.5rem] relative overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing"
      >
        {/* Draggable Map Layer */}
        <motion.div 
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          className="absolute inset-[-100px] bg-[#0A0A0A]"
        >
          {/* Background Map Grid */}
          <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)', backgroundSize: '60px 60px' }}></div>
          
          {/* Heatmap Blobs (Simulated) */}
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-purple-600/5 rounded-full blur-[90px]"></div>
          
          <MapMarker x="30%" y="40%" type="info" label="Irregularidad Licitación" time="Reciente" />
          <MapMarker x="55%" y="30%" type="info" label="Presunto Cohecho" time="Bajo Investigación" />
          <MapMarker x="40%" y="65%" type="info" label="Abuso de Autoridad" time="Reportado" />
          <MapMarker x="70%" y="50%" type="info" label="Nepotismo Flagrante" time="Auditando" />

          {/* City Arteries (Stylized lines) */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 1000 1000">
            <path d="M 0 500 L 1000 500 M 500 0 L 500 1000 M 200 0 L 800 1000 M 0 200 L 1000 800" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </motion.div>

        {/* Legend / Overlay */}
        <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Análisis de Ética Pública</h4>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 bg-white/5 rounded-2xl p-3 border border-white/5">
              <p className="text-[8px] text-white/30 mb-1 uppercase tracking-widest font-bold">Integridad</p>
              <p className="text-sm font-bold text-blue-400 leading-none">6.2<span className="text-[10px] opacity-40 ml-1">/10</span></p>
            </div>
            <button 
              onClick={onReport}
              className="flex-[2] bg-blue-500 text-legal-navy rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95 transition-transform"
            >
              <AlertCircle size={14} />
              Denuncia Aquí
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute top-6 right-6 space-y-3 z-10">
          <MapControl icon={<Plus />} />
          <MapControl icon={<Minus />} />
          <MapControl icon={<Navigation className="text-blue-400" />} />
        </div>
      </div>
    </div>
  );
}

function MapMarker({ x, y, type, label, time }: { x: string, y: string, type: 'info', label: string, time: string }) {
  const color = 'bg-blue-400';
  const shadow = 'shadow-[0_0_20px_rgba(96,165,250,0.5)]';
  
  return (
    <motion.div 
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute flex flex-col items-center group cursor-pointer"
      style={{ left: x, top: y }}
    >
      <div className="relative">
        <div className={cn("w-4 h-4 rounded-full relative z-10 border-2 border-white/20 transition-transform group-hover:scale-125", color, shadow)}></div>
        <div className={cn("absolute inset-[-10px] rounded-full animate-ping opacity-20", color)}></div>
      </div>
      
      {/* Label Tooltip */}
      <div className="mt-3 bg-black/90 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 whitespace-nowrap shadow-2xl pointer-events-none z-20">
        <div className="flex items-center gap-2 mb-1">
          <div className={cn("w-1.5 h-1.5 rounded-full", color)}></div>
          <p className="text-[11px] font-bold text-white font-serif italic">{label}</p>
        </div>
        <p className="text-[8px] text-white/40 font-mono uppercase tracking-widest">{time} • AUDITADO</p>
      </div>
    </motion.div>
  );
}

function MapControl({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-12 h-12 bg-black/80 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 flex items-center justify-center text-white/40 hover:text-blue-400 hover:border-blue-400 transition-all active:scale-95">
      {React.cloneElement(icon as React.ReactElement, { size: 20 })}
    </button>
  );
}
