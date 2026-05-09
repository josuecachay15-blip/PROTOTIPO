
import React, { useState } from 'react';
import { 
  Search, 
  Book, 
  ExternalLink, 
  Bookmark,
  Scale,
  FileText
} from 'lucide-react';
import { LEGAL_ARTICLES } from '../constants';
import { cn } from '../lib/utils';

export default function LibraryView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCode, setActiveCode] = useState<'All' | 'Penal' | 'Civil' | 'Constitución' | 'Anticorrupción'>('All');

  const filteredArticles = LEGAL_ARTICLES.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Check if the article code matches or if it's 'Anticorrupción' which might be in content/title
    const matchesCode = activeCode === 'All' || article.code === activeCode || (activeCode === 'Anticorrupción' && article.keywords.includes('anticorrupción'));
    
    return matchesSearch && matchesCode;
  });

  return (
    <div className="space-y-6 py-4">
      <section>
        <h2 className="text-3xl font-bold text-white mb-1 font-serif italic">Codex Jurídico</h2>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">Biblioteca de consulta Offline</p>
      </section>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-legal-gold transition-colors w-5 h-5" />
        <input 
          type="text"
          placeholder="Buscar leyes, artículos o decretos..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-legal-gold/50 focus:bg-white/[0.08] transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['All', 'Penal', 'Constitución', 'Anticorrupción', 'Civil'].map((code) => (
          <button
            key={code}
            onClick={() => setActiveCode(code as any)}
            className={cn(
              "px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all",
              activeCode === code 
                ? "bg-legal-gold text-legal-navy shadow-lg shadow-legal-gold/20" 
                : "bg-white/5 text-white/30 hover:bg-white/10 border border-white/5"
            )}
          >
            {code === 'All' ? 'Todos' : code}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <div key={article.id} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all cursor-pointer group relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "px-2 py-1 rounded text-[8px] font-bold uppercase tracking-[0.2em] border",
                  article.code === 'Penal' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                  article.code === 'Civil' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                  article.code === 'Anticorrupción' ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" :
                  "bg-legal-gold/10 text-legal-gold border-legal-gold/20"
                )}>
                  {article.code}
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-legal-gold transition-colors">{article.article} - {article.title}</h3>
              </div>
              <button className="text-white/10 hover:text-legal-gold transition-colors">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-white/40 text-xs leading-relaxed mb-4 line-clamp-3 italic font-serif relative z-10">
              "{article.content}"
            </p>

            <div className="flex justify-between items-center pt-4 border-t border-white/5 relative z-10">
              <div className="flex gap-2">
                {article.keywords.slice(0, 2).map(kw => (
                  <span key={kw} className="text-[9px] text-white/20 font-bold uppercase tracking-widest">#{kw}</span>
                ))}
              </div>
              <button className="text-legal-gold flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest hover:underline">
                Consultar <ExternalLink size={10} />
              </button>
            </div>

            {/* Decorative Line */}
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-legal-gold opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}

        {filteredArticles.length === 0 && (
          <div className="py-12 text-center space-y-6">
            <div className="bg-white/5 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto border border-white/5 group">
              <Scale className="text-white/10 w-10 h-10 group-hover:text-legal-gold transition-colors" />
            </div>
            <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">Sin coincidencias en el Codex</p>
          </div>
        )}
      </div>
    </div>
  );
}
