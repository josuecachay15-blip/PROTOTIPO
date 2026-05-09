
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  PlusCircle, 
  ShieldCheck, 
  MapPin, 
  ChevronRight,
  AlertCircle,
  FileText,
  Search,
  Scale
} from 'lucide-react';
import { ViewState } from '../types';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';

interface HomeViewProps {
  onNavigate: (view: ViewState) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  const [reportCount, setReportCount] = useState(0);
  const userName = auth.currentUser?.displayName?.split(' ')[0] || 'Ciudadano';

  useEffect(() => {
    if (!auth.currentUser) return;
    
    const fetchCount = async () => {
      const q = query(collection(db, 'reports'), where('userId', '==', auth.currentUser?.uid));
      const snapshot = await getCountFromServer(q);
      setReportCount(snapshot.data().count);
    };

    fetchCount();
  }, []);
  return (
    <div className="space-y-8 py-4">
      {/* Welcome Section */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-1 font-serif italic">Hola, {userName}</h2>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">Panel de Control Ciudadano</p>
      </section>

      {/* Main Action Card */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate('triage')}
        className="w-full relative overflow-hidden bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-left shadow-2xl group transition-all hover:bg-white/[0.08]"
      >
        <div className="relative z-10">
          <div className="bg-legal-gold rounded-xl w-12 h-12 flex items-center justify-center mb-8 shadow-lg shadow-legal-gold/20">
            <PlusCircle className="text-legal-navy w-7 h-7" />
          </div>
          <h3 className="text-white text-2xl font-bold mb-2 font-serif italic">Iniciar Denuncia Inteligente</h3>
          <p className="text-white/50 text-sm max-w-[200px] leading-relaxed">
            Motor de calificación penal v2.1 para asistencia ciudadana.
          </p>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute right-[-40px] bottom-[-40px] opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
          <Scale size={240} className="text-white" />
        </div>
        <div className="absolute top-8 right-8">
          <ChevronRight className="text-legal-gold w-6 h-6 opacity-30 group-hover:opacity-100 transition-opacity" />
        </div>
      </motion.button>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-2">Mis Procesos</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-white font-mono">{reportCount.toString().padStart(2, '0')}</span>
            {reportCount > 0 && <span className="text-green-500 text-[9px] font-bold mb-1 uppercase tracking-tighter">Sincronizado</span>}
          </div>
        </div>
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-2">Estado de Alerta</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-legal-gold animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
            <span className="text-xs font-bold text-white uppercase tracking-tight">Vigilancia</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Actividad Reciente</h4>
          <button className="text-legal-gold text-[10px] font-bold uppercase tracking-widest hover:underline">Ver bitácora</button>
        </div>
        
        <div className="space-y-3">
          <ActivityItem 
            icon={<FileText className="text-amber-500" />}
            title="Expediente #77412"
            status="Investigación"
            date="Hace 2 días"
          />
          <ActivityItem 
            icon={<MapPin className="text-red-500" />}
            title="Alerta Perimetral"
            status="Chapinero Alto"
            date="Hace 3 horas"
          />
        </div>
      </section>

      {/* Search Library Shortcut */}
      <button 
        onClick={() => onNavigate('library')}
        className="w-full bg-legal-gold text-legal-navy rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-legal-gold/10 transition-transform active:scale-95"
      >
        <div className="flex items-center gap-3">
          <div className="bg-black/10 p-1.5 rounded-lg">
            <Search className="text-legal-navy w-4 h-4" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest">Biblioteca Jurídica</p>
        </div>
        <ChevronRight className="text-legal-navy w-5 h-5 opacity-40" />
      </button>
    </div>
  );
}

function ActivityItem({ icon, title, status, date }: { icon: React.ReactNode, title: string, status: string, date: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-white/20 transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="bg-white/5 p-3 rounded-xl group-hover:bg-white/10 transition-colors">
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-white">{title}</p>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{status}</p>
        </div>
      </div>
      <p className="text-[10px] text-white/20 font-mono">{date}</p>
    </div>
  );
}
