
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  ArrowLeft, 
  Download, 
  Clock, 
  Scale, 
  CheckCircle2,
  Calendar,
  Building2,
  Mail
} from 'lucide-react';
import { cn } from '../lib/utils';

interface InfoRequestProps {
  onBack: () => void;
}

export default function InfoRequest({ onBack }: InfoRequestProps) {
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    details: '',
    requesterName: '',
    requesterDni: '',
    requesterEmail: ''
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('preview');
  };

  if (step === 'preview') {
    return (
      <div className="h-full flex flex-col py-4">
        <button 
          onClick={() => setStep('form')}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Volver a editar</span>
        </button>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white font-serif italic mb-2">Vista Preliminar</h2>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">Solicitud de Acceso a la Información • Ley 27806</p>
        </section>

        <div className="flex-1 bg-white p-8 rounded-2xl shadow-inner text-black font-serif text-[11px] leading-relaxed relative overflow-hidden mb-8">
          <div className="absolute top-10 right-10 opacity-10">
            <Scale size={130} />
          </div>
          
          <div className="space-y-6 max-w-[90%] mx-auto py-10">
            <p className="font-bold text-sm">PARA: {formData.to.toUpperCase()}</p>
            <p className="font-bold">DE: {formData.requesterName} (DNI: {formData.requesterDni})</p>
            <p className="font-bold">ASUNTO: Solicitud de acceso a la información pública.</p>
            
            <p className="pt-4">
              Por intermedio de la presente, y al amparo del Texto Único Ordenado de la <span className="font-bold">Ley Nº 27806, Ley de Transparencia y Acceso a la Información Pública</span>, solicito lo siguiente:
            </p>
            
            <div className="bg-slate-50 p-4 border border-black/10 font-bold italic">
              {formData.details}
            </div>
            
            <p>
              Solicito que la información me sea entregada en un plazo máximo de <span className="font-bold underline">siete (07) días útiles</span>, conforme lo establece el artículo 11 de la referida norma. De no ser atendida mi solicitud en el plazo legal, me reservo el derecho de interponer recurso de apelación.
            </p>

            <div className="pt-20 border-t border-black/10">
              <p>Email para notificaciones: {formData.requesterEmail}</p>
              <p>Fecha de generación: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3 h-fit">
            <Clock className="text-legal-gold w-4 h-4 shrink-0" />
            <div>
              <p className="text-[9px] font-bold text-white uppercase tracking-widest mb-1">Recordatorio</p>
              <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest leading-loose">Si en 7 días no responden, puedes acudir a la Autoridad de Transparencia.</p>
            </div>
          </div>
          <button
            onClick={() => alert("Documento PDF generado exitosamente.")}
            className="w-full py-5 bg-white text-legal-navy rounded-2xl font-bold uppercase tracking-widest text-xs shadow-2xl flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Download className="w-4 h-4" />
            Descargar PDF
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
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Volver</span>
      </button>

      <section className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="text-legal-gold w-6 h-6" />
          <h2 className="text-3xl font-bold text-white font-serif italic">Portal Transparencia</h2>
        </div>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">Solicitud al amparo de la Ley 27806</p>
      </section>

      <form onSubmit={handleGenerate} className="flex-1 space-y-6 overflow-y-auto no-scrollbar pb-8 px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block ml-1">Entidad Destino</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
              <input required className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm text-white focus:outline-none focus:ring-1 focus:ring-legal-gold/50 transition-all font-bold" placeholder="Ejem: Poder Judicial, Congreso..." value={formData.to} onChange={e => setFormData({...formData, to: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block ml-1">Tu Nombre Completo</label>
            <input required className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-legal-gold/50 transition-all font-bold" placeholder="Tu nombre legal" value={formData.requesterName} onChange={e => setFormData({...formData, requesterName: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block ml-1">DNI</label>
            <input required className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-legal-gold/50 transition-all font-mono" placeholder="8 dígitos" value={formData.requesterDni} onChange={e => setFormData({...formData, requesterDni: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block ml-1">Email Notificación</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
              <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm text-white focus:outline-none focus:ring-1 focus:ring-legal-gold/50 transition-all" placeholder="tucorreo@ejem.com" value={formData.requesterEmail} onChange={e => setFormData({...formData, requesterEmail: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block ml-1">Información Solicitada</label>
          <textarea 
            required
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-legal-gold/50 transition-all resize-none"
            placeholder="Deseo acceder al registro de órdenes de servicio del mes de Mayo de la oficina de adquisiciones..."
            value={formData.details}
            onChange={e => setFormData({...formData, details: e.target.value})}
          />
        </div>

        <button
          type="submit"
          className="w-full py-5 bg-legal-gold text-legal-navy rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-legal-gold/20 flex items-center justify-center gap-3 transition-transform active:scale-95 mt-4"
        >
          <CheckCircle2 className="w-4 h-4" />
          Previsualizar Solicitud
        </button>
      </form>
    </div>
  );
}
