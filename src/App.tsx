
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home as HomeIcon, 
  Scale, 
  History, 
  BookOpen, 
  ShieldAlert, 
  Map as MapIcon,
  ChevronRight,
  Bell,
  Menu,
  LogIn
} from 'lucide-react';
import { ViewState } from './types';
import { cn } from './lib/utils';

// View Components
import HomeView from './components/HomeView';
import TriageView from './components/TriageView';
import TrackingView from './components/TrackingView';
import LibraryView from './components/LibraryView';
import MapView from './components/MapView';
import TransparencyMap from './components/TransparencyMap';
import EmergencyView from './components/EmergencyView';
import CorruptionForm from './components/CorruptionForm';
import OfficerCheck from './components/OfficerCheck';
import InfoRequest from './components/InfoRequest';
import AuthWrapper from './components/AuthWrapper';
import { auth } from './lib/firebase';
import { signOut } from 'firebase/auth';

export default function App() {
  const [activeView, setActiveView] = useState<ViewState>('home');

  const renderView = () => {
    switch (activeView) {
      case 'home': return <HomeView onNavigate={setActiveView} />;
      case 'triage': return <TriageView onBack={() => setActiveView('home')} />;
      case 'tracking': return <TrackingView />;
      case 'library': return <LibraryView />;
      case 'map': return <MapView />;
      case 'transparency-map': return <TransparencyMap onBack={() => setActiveView('home')} onReport={() => setActiveView('corruption-form')} />;
      case 'emergency': return <EmergencyView onBack={() => setActiveView('home')} />;
      case 'corruption-form': return <CorruptionForm onBack={() => setActiveView('home')} />;
      case 'officer-check': return <OfficerCheck onBack={() => setActiveView('home')} />;
      case 'info-request': return <InfoRequest onBack={() => setActiveView('home')} />;
      default: return <HomeView onNavigate={setActiveView} />;
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <AuthWrapper>
      <div className="mobile-container flex flex-col h-screen bg-legal-navy text-white">
        {/* App Header */}
        <header className="px-6 pt-8 pb-4 flex justify-between items-center bg-legal-navy/80 backdrop-blur-md sticky top-0 z-20 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="bg-legal-gold p-1.5 rounded-lg shadow-lg shadow-legal-gold/20">
              <Scale className="text-legal-navy w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white font-serif italic">
              LexDefensa
            </h1>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-white/40 hover:text-legal-gold transition-colors">
              <Bell className="w-6 h-6" />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-white/40 hover:text-red-500 transition-colors"
              title="Cerrar Sesión"
            >
              <LogIn className="w-5 h-5 rotate-180" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-6 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-legal-bg-darker border-t border-white/5 px-6 py-4 flex justify-between items-center z-30 max-w-[480px] mx-auto backdrop-blur-lg">
          <NavItem 
            icon={<HomeIcon />} 
            label="Inicio" 
            active={activeView === 'home'} 
            onClick={() => setActiveView('home')} 
          />
          <NavItem 
            icon={<History />} 
            label="Historial" 
            active={activeView === 'tracking'} 
            onClick={() => setActiveView('tracking')} 
          />
          <div className="relative -top-8">
            <button 
              onClick={() => setActiveView('emergency')}
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform active:scale-95 group relative",
                activeView === 'emergency' ? "bg-red-600" : "bg-red-500"
              )}
            >
              <div className="absolute inset-0 rounded-full bg-red-500 animate-pulse opacity-20 group-hover:opacity-40"></div>
              <ShieldAlert className="text-white w-7 h-7 relative z-10" />
            </button>
          </div>
          <NavItem 
            icon={<BookOpen />} 
            label="Leyes" 
            active={activeView === 'library'} 
            onClick={() => setActiveView('library')} 
          />
          <NavItem 
            icon={<MapIcon />} 
            label="Zonas" 
            active={activeView === 'map'} 
            onClick={() => setActiveView('map')} 
          />
        </nav>
      </div>
    </AuthWrapper>
  );
}

function NavItem({ 
  icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean, 
  onClick: () => void 
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all relative group",
        active ? "text-legal-gold" : "text-white/40 hover:text-white/60"
      )}
    >
      {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5 mb-0.5" })}
      <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-pill"
          className="absolute -bottom-1 w-1 h-1 rounded-full bg-legal-gold shadow-[0_0_8px_rgba(245,158,11,0.5)]"
        />
      )}
    </button>
  );
}
