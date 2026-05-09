
import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  ShieldAlert, 
  Navigation, 
  Layers,
  AlertTriangle,
  Scale,
  Plus,
  Minus,
  Map as MapIcon,
  Phone,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { cn } from '../lib/utils';

// Constants for Centers
const CENTROS = [
  {
    nombre: 'Fiscalía Lima Norte',
    tipo: 'fiscalia',
    icon: '⚖️',
    bg: '#fff3e0',
    dir: 'Jr. Quilca 431, Cercado de Lima',
    tel: '(01) 428-8888',
    lat: -12.0464,
    lng: -77.0282,
    dist: '3.4 km',
    horario: 'Lun–Vie 8am–5pm'
  },
  {
    nombre: 'FECOR – Anticorrupción',
    tipo: 'fecor',
    icon: '🔍',
    bg: '#f0ebff',
    dir: 'Av. Abancay 491, Lima',
    tel: '(01) 427-1512',
    lat: -12.0519,
    lng: -77.0203,
    dist: '3.8 km',
    horario: 'Lun–Vie 8am–5pm'
  },
  {
    nombre: 'Contraloría General',
    tipo: 'contraloria',
    icon: '🏛️',
    bg: '#e2f5ec',
    dir: 'Jr. Camilo Carrillo 114, Lima',
    tel: '(01) 330-3000',
    lat: -12.0638,
    lng: -77.0536,
    dist: '4.2 km',
    horario: 'Lun–Vie 8:30am–4:30pm'
  },
  {
    nombre: 'Defensoría del Pueblo',
    tipo: 'defensoria',
    icon: '🛡️',
    bg: '#fde8e8',
    dir: 'Jr. Ucayali 388, Lima',
    tel: '0800-15170',
    lat: -12.0570,
    lng: -77.0260,
    dist: '4.5 km',
    horario: 'Lun–Vie 8am–5pm'
  },
  {
    nombre: 'Comisaría Barranco',
    tipo: 'comisaria',
    icon: '🚔',
    bg: '#e8f0fe',
    dir: 'Av. Pedro de Osma 153, Barranco',
    tel: '(01) 467-0030',
    lat: -12.1481,
    lng: -77.0228,
    dist: '5.1 km',
    horario: '24 horas'
  }
];

function MapSetter({ center, activeTab }: { center: [number, number], activeTab: string }) {
  const map = useMap();
  useEffect(() => {
    if (activeTab === 'centros') {
      // Invalidate size ensures the map fills the container correctly after tab switch
      map.invalidateSize();
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [activeTab, map, center]);
  return null;
}

function MapControls() {
  const map = useMap();
  return (
    <div className="absolute bottom-6 right-6 z-[400] flex flex-col gap-1 shadow-2xl">
      <button 
        className="w-10 h-10 bg-white text-black rounded-t-xl flex items-center justify-center border-b border-black/5 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); map.zoomIn(); }}
      >
        <Plus size={20} strokeWidth={3} />
      </button>
      <button 
        className="w-10 h-10 bg-white text-black rounded-b-xl flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); map.zoomOut(); }}
      >
        <Minus size={20} strokeWidth={3} />
      </button>
    </div>
  );
}

export default function MapView() {
  const [activeTab, setActiveTab] = useState<'calor' | 'centros'>('calor');
  const [mapCenter, setMapCenter] = useState<[number, number]>([-12.0931, -77.0465]);
  const constraintsRef = useRef(null);

  const focusCentro = (lat: number, lng: number) => {
    setMapCenter([lat, lng]);
    const wrapper = document.getElementById('leaflet-map-wrapper');
    if (wrapper) {
      wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="h-full flex flex-col py-4 relative space-y-4 overflow-y-auto no-scrollbar pb-24">
      {/* Header */}
      <section>
        <div className="flex justify-between items-start px-2">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1 font-serif italic">Mapa Ciudadano</h2>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">Monitoreo y Denuncia</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full animate-pulse">
              EN VIVO
            </span>
          </div>
        </div>
      </section>

      {/* Tabs Menu */}
      <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl mx-1 shadow-inner">
        <button 
          onClick={() => setActiveTab('calor')}
          className={cn(
            "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300",
            activeTab === 'calor' ? "bg-legal-gold text-legal-navy shadow-lg" : "text-white/40 hover:text-white"
          )}
        >
          🔥 Mapa de Calor
        </button>
        <button 
          onClick={() => setActiveTab('centros')}
          className={cn(
            "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300",
            activeTab === 'centros' ? "bg-legal-gold text-legal-navy shadow-lg" : "text-white/40 hover:text-white"
          )}
        >
          📍 Denuncia Aquí
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'calor' ? (
          <motion.div 
            key="calor"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 min-h-[400px] flex flex-col space-y-4"
          >
            {/* Simulated Map Container */}
            <div 
              ref={constraintsRef}
              className="h-[300px] bg-white/5 border border-white/5 rounded-[2.5rem] relative overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing group"
            >
              {/* Draggable Map Layer */}
              <motion.div 
                drag
                dragConstraints={constraintsRef}
                dragElastic={0.1}
                className="absolute inset-[-150px] bg-[#0A0A0A]"
              >
                {/* Background Map Grid */}
                <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)', backgroundSize: '60px 60px' }}></div>
                
                {/* Heatmap Blobs (Simulated) */}
                <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-600/5 rounded-full blur-[80px]"></div>

                {/* Dynamic Markers */}
                <MapMarker x="45%" y="35%" type="critical" label="Hurto Agravado" time="12 Oct" />
                <MapMarker x="65%" y="60%" type="warning" label="Alerta Perimetral" time="5 min" />
                <MapMarker x="35%" y="75%" type="warning" label="Vigilancia" time="Activo" />
                <MapMarker x="75%" y="25%" type="critical" label="Zona Restringida" time="24h" />

                {/* City Arteries (Stylized lines) */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 1000 1000">
                  <path d="M 0 500 L 1000 500 M 500 0 L 500 1000 M 200 0 L 800 1000 M 0 200 L 1000 800" stroke="white" strokeWidth="2" fill="none" />
                </svg>
              </motion.div>

              {/* Instructions Overlay */}
              <div className="absolute top-6 left-6 pointer-events-none group-hover:opacity-0 transition-opacity">
                <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                  <p className="text-[8px] text-white/60 font-bold uppercase tracking-widest">Arrastra para explorar el Codex</p>
                </div>
              </div>
            </div>

            {/* Legend / Overlay */}
            <div className="bg-black/60 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-4 mx-1">
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
                <div className="bg-white/5 rounded-2xl p-3 border border-white/5 transition-colors hover:bg-white/10">
                  <p className="text-[8px] text-white/30 mb-1 uppercase tracking-widest font-bold">Índice</p>
                  <p className="text-sm font-bold text-red-500 leading-none">8.4<span className="text-[10px] opacity-40 ml-1">/10</span></p>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                  <p className="text-[8px] text-white/30 mb-1 uppercase tracking-widest font-bold">Tiempo Res.</p>
                  <p className="text-sm font-bold text-white leading-none">4m<span className="text-[10px] opacity-40 ml-1">avg</span></p>
                </div>
                <div className="bg-white/5 rounded-2xl p-3 border border-white/5 font-bold">
                  <p className="text-[8px] text-white/30 mb-1 uppercase tracking-widest">Custodia</p>
                  <p className="text-sm text-legal-gold leading-none">ACTIVA</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="centros"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 flex flex-col space-y-4"
          >
            {/* Real Map Container */}
            <div 
              id="leaflet-map-wrapper"
              className="h-[320px] bg-[#e5e7eb] border border-white/10 rounded-[2.5rem] relative overflow-hidden shadow-2xl z-0 mx-1"
            >
              <MapContainer 
                center={mapCenter} 
                zoom={14} 
                style={{ width: '100%', height: '100%', background: '#e5e7eb' }}
                zoomControl={false}
                scrollWheelZoom={false}
                dragging={true}
                touchZoom={true}
                doubleClickZoom={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <MapSetter center={mapCenter} activeTab={activeTab} />
                <MapControls />
                {CENTROS.map((c, i) => {
                  const customIcon = L.divIcon({
                    html: `
                      <div class="marker-container" style="
                        background: white;
                        border: 2px solid black;
                        border-radius: 12px;
                        width: 44px;
                        height: 44px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 20px;
                        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                        position: relative;
                      ">
                        ${c.icon}
                        <div style="
                          position: absolute;
                          bottom: -6px;
                          left: 50%;
                          transform: translateX(-50%);
                          width: 0;
                          height: 0;
                          border-left: 6px solid transparent;
                          border-right: 6px solid transparent;
                          border-top: 6px solid black;
                        "></div>
                      </div>
                    `,
                    iconSize: [44, 44],
                    iconAnchor: [22, 50],
                    popupAnchor: [0, -50],
                    className: 'custom-leaflet-marker'
                  });

                  return (
                    <Marker key={i} position={[c.lat, c.lng]} icon={customIcon}>
                      <Popup className="custom-popup" offset={[0, -5]}>
                        <div className="p-1 min-w-[140px]">
                          <h3 className="font-bold text-legal-navy text-sm mb-1">{c.nombre}</h3>
                          <p className="text-[10px] text-gray-500 mb-2 leading-tight">📍 {c.dir}</p>
                          <a 
                            href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-legal-gold text-legal-navy text-[9px] px-3 py-1.5 rounded-lg flex items-center justify-center gap-2 font-bold uppercase tracking-widest shadow-sm"
                          >
                            <MapIcon size={10} />
                            Cómo llegar
                          </a>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>

            {/* List Header */}
            <div className="flex justify-between items-center px-4">
              <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Centros de Atención</h4>
              <p className="text-[9px] text-white/30 flex items-center gap-1 font-bold">
                <MapPin size={10} className="text-legal-gold" />
                Lima, Perú
              </p>
            </div>

            {/* List of Centers */}
            <div className="space-y-3 px-1 pb-4">
              {CENTROS.map((c, i) => (
                <div 
                  key={i} 
                  onClick={() => focusCentro(c.lat, c.lng)}
                  className="bg-white/5 border border-white/5 rounded-3xl p-4 flex items-start gap-4 transition-all hover:bg-white/10 active:scale-[0.98] cursor-pointer group"
                >
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg border border-black/5"
                    style={{ background: c.bg }}
                  >
                    {c.icon}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h5 className="text-[13px] font-bold text-white mb-1 group-hover:text-legal-gold transition-colors">{c.nombre}</h5>
                    <p className="text-[10px] text-white/40 mb-1 truncate leading-relaxed">{c.dir}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-bold text-legal-gold/80 uppercase">📍 {c.dist}</span>
                      <span className="text-[9px] text-white/20">•</span>
                      <span className="text-[9px] font-medium text-white/30 uppercase tracking-tight">{c.horario}</span>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-legal-navy border border-white/10 px-3 py-1.5 rounded-lg text-[9px] font-bold text-white uppercase tracking-widest flex items-center gap-2 hover:bg-white/20 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MapIcon size={10} />
                        Mapa
                      </a>
                      <a 
                        href={`tel:${c.tel}`}
                        className="bg-green-500/20 border border-green-500/30 px-3 py-1.5 rounded-lg text-[9px] font-bold text-green-400 uppercase tracking-widest flex items-center gap-2 hover:bg-green-500/30 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone size={10} />
                        Llamar
                      </a>
                    </div>
                  </div>
                  <div className="h-12 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={16} className="text-legal-gold" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
