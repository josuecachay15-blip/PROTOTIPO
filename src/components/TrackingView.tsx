
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  UserCheck, 
  Search, 
  CheckCircle2,
  ChevronRight,
  Clock,
  Loader2,
  Inbox,
  Scale
} from 'lucide-react';
import { cn } from '../lib/utils';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export default function TrackingView() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const reportPath = 'reports';
    const q = query(
      collection(db, reportPath),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, reportPath);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Scale className="text-legal-gold/20 w-12 h-12" />
        </motion.div>
        <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Consultando Servidores...</span>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-12">
        <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-12 text-center shadow-2xl relative overflow-hidden group">
          <div className="bg-white/5 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110">
            <Inbox className="text-white/10 w-10 h-10" />
          </div>
          <h3 className="text-white font-serif italic text-2xl mb-3 leading-tight">Sin actividad</h3>
          <p className="text-white/40 text-xs max-w-[200px] mx-auto leading-relaxed uppercase tracking-widest font-bold">
            Aún no has registrado procesos legales en el sistema.
          </p>
          <div className="absolute -bottom-10 -right-10 opacity-[0.02]">
            <Scale size={180} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <section>
        <h2 className="text-3xl font-bold text-white mb-1 font-serif italic">Bitácora Legal</h2>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">Seguimiento de Procesos Activos</p>
      </section>

      <div className="space-y-6">
        {reports.map((report) => (
          <div key={report.id}>
            <ReportCard report={report} />
          </div>
        ))}
      </div>
    </div>
  );
}

const ReportCard = ({ report }: { report: any }) => {
  const steps = [
    { status: 'Radicado', completed: true },
    { status: 'Asignado', completed: ['Asignado', 'Investigación', 'Resolución'].includes(report.status) },
    { status: 'Investigación', completed: ['Investigación', 'Resolución'].includes(report.status) },
    { status: 'Resolución', completed: report.status === 'Resolución' }
  ];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:bg-white/[0.08] transition-all shadow-2xl"
    >
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-legal-gold mb-2 block">
            RADICADO N° {report.id.slice(0, 8).toUpperCase()}
          </span>
          <h4 className="text-xl font-bold text-white font-serif italic">{report.classification}</h4>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono text-white/30 uppercase font-bold">
            {report.createdAt?.toDate ? new Date(report.createdAt.toDate()).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }) : '...'}
          </span>
          <div className="bg-legal-gold/10 text-legal-gold border border-legal-gold/20 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest mt-2">
            {report.status}
          </div>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="absolute left-3 top-2 bottom-2 w-[1px] bg-white/5"></div>
        {steps.map((step, idx) => (
          <div key={idx} className="relative z-10 flex gap-5 items-center">
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all",
              step.completed 
                ? "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.3)]" 
                : "bg-[#0A0D14] border border-white/10"
            )}>
              {step.completed ? (
                <CheckCircle2 className="text-white w-3 h-3" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
              )}
            </div>
            <div className="flex-1">
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                step.completed ? "text-white" : "text-white/20"
              )}>
                {step.status}
              </span>
              {report.status === step.status && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[9px] text-white/40 mt-0.5 leading-relaxed"
                >
                  Sincronizado con base de datos central.
                </motion.p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
            <FileText className="text-white/30 w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Cadena de custodia intacta</span>
        </div>
        <button className="bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-colors">
          <ChevronRight className="text-white/20 w-5 h-5" />
        </button>
      </div>

      {/* Decorative Scale */}
      <div className="absolute top-[-30px] right-[-30px] opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
        <Scale size={140} />
      </div>
    </motion.div>
  );
}
