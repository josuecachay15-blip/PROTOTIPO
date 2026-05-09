
import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  ShieldAlert, 
  Navigation, 
  Layers,
  AlertTriangle,
  Scale,
  Plus,
  Minus
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function MapView() {
  const constraintsRef = useRef(null);

  return (
    <div className="h-full flex flex-col py-4 relative space-y-6">
      {/* Header */}
      <section>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1 font-serif italic">Zonas de Riesgo</h2>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">Monitoreo de Seguridad Ciudadana</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full animate-pulse">
              LIVE • LIMA
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
          <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-600/5 rounded-full blur-[80px]"></div>

          {/* City Arteries (Stylized lines) */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 1000 1000">
            <path d="M 0 500 L 1000 500 M 500 0 L 500 1000 M 200 0 L 800 1000 M 0 200 L 1000 800" stroke="white" strokeWidth="2" fill="none" />
          </svg>

          {/* Dynamic Markers */}
          <MapMarker x="45%" y="35%" type="critical" label="Hurto Agravado" time="12 Oct" />
          <MapMarker x="65%" y="60%" type="warning" label="Alerta Perimetral" time="5 min" />
          <MapMarker x="35%" y="75%" type="warning" label="Vigilancia" time="Activo" />
          <MapMarker x="75%" y="25%" type="critical" label="Zona Restringida" time="24h" />
        </motion.div>

        {/* Legend / Overlay */}
        <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4 z-10">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Análisis de Entorno</h4>
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-red-500">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                Crítico
              </span>
              <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-amber-500">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Precaución
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
              <p className="text-[8px] text-white/30 mb-1 uppercase tracking-widest font-bold">Índice</p>
              <p className="text-sm font-bold text-red-500 leading-none">8.4<span className="text-[10px] opacity-40 ml-1">/10</span></p>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
              <p className="text-[8px] text-white/30 mb-1 uppercase tracking-widest font-bold">Tiempo Res.</p>
              <p className="text-sm font-bold text-white leading-none">4m<span className="text-[10px] opacity-40 ml-1">avg</span></p>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
              <p className="text-[8px] text-white/30 mb-1 uppercase tracking-widest font-bold">Custodia</p>
              <p className="text-sm font-bold text-legal-gold leading-none">ACTIVA</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute top-6 right-6 space-y-3 z-10">
          <MapControl icon={<Plus />} />
          <MapControl icon={<Minus />} />
          <MapControl icon={<Navigation className="text-legal-gold" />} />
        </div>

        {/* Instructions Overlay (Briefly shown) */}
        <div className="absolute top-6 left-6 pointer-events-none">
          <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
            <p className="text-[8px] text-white/60 font-bold uppercase tracking-widest">Arrastra para explorar el Codex</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapMarker({ x, y, type, label, time }: { x: string, y: string, type: 'critical' | 'warning', label: string, time: string }) {
  const color = type === 'critical' ? 'bg-red-500' : 'bg-amber-500';
  const shadow = type === 'critical' ? 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'shadow-[0_0_20px_rgba(245,158,11,0.5)]';
  
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
        <p className="text-[8px] text-white/40 font-mono uppercase tracking-widest">{time} • VERIFICADO</p>
      </div>
    </motion.div>
  );
}

function MapControl({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-12 h-12 bg-black/80 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 flex items-center justify-center text-white/40 hover:text-legal-gold hover:border-legal-gold transition-all active:scale-95">
      {React.cloneElement(icon as React.ReactElement, { size: 20 })}
    </button>
  );
}
