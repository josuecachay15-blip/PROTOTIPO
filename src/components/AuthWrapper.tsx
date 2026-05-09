import React, { useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  User as FirebaseUser,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { motion } from 'motion/react';
import { Scale, LogIn, Loader2 } from 'lucide-react';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        // Sync user to Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        // Use a simple setDoc with merge for the basics, 
        // but handle createdAt only if document doesn't exist to avoid violating immutability rules
        const userData: any = {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          updatedAt: serverTimestamp(),
        };

        try {
          const userDoc = await getDoc(userRef);
          if (!userDoc.exists()) {
            await setDoc(userRef, {
              ...userData,
              createdAt: serverTimestamp(),
            });
          } else {
            await setDoc(userRef, userData, { merge: true });
          }
        } catch (err) {
          console.error("Error syncing user profile:", err);
        }
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.code === 'auth/network-request-failed') {
        alert("Error de red: No se pudo conectar con los servicios de autenticación. Por favor, asegúrate de no tener bloqueadores de anuncios (AD-Blockers) activados o prueba con otro navegador.");
      } else {
        alert("Error al iniciar sesión: " + (error.message || "Inténtalo de nuevo más tarde."));
      }
    }
  };

  if (loading) {
    return (
      <div className="mobile-container flex items-center justify-center bg-black">
        <div className="relative">
          <Loader2 className="w-10 h-10 text-legal-gold animate-spin" />
          <div className="absolute inset-0 blur-xl bg-legal-gold/20 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mobile-container flex flex-col items-center justify-center p-12 bg-black overflow-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-legal-gold/5 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center space-y-12 relative z-10 w-full"
        >
          <div className="relative group mx-auto w-fit">
            <div className="bg-white/5 p-8 rounded-[3rem] shadow-2xl border border-white/5 backdrop-blur-3xl relative z-10">
              <Scale className="text-legal-gold w-24 h-24 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]" />
            </div>
            <div className="absolute -inset-4 bg-legal-gold/10 rounded-[3.5rem] blur-2xl group-hover:bg-legal-gold/20 transition-all"></div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-5xl font-black text-white font-serif tracking-tighter italic">LexDefensa</h1>
            <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] font-bold">Justicia • Inteligencia • Integridad</p>
          </div>

          <p className="text-white/40 text-xs leading-relaxed max-w-[280px] mx-auto italic font-serif">
            "La justicia es la constante y perpetua voluntad de dar a cada uno su derecho."
          </p>

          <div className="space-y-4 w-full">
            <button 
              onClick={handleLogin}
              className="w-full py-5 bg-white text-legal-navy rounded-2xl flex items-center justify-center gap-4 font-black transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
            >
              <LogIn className="w-5 h-5" />
              <span className="uppercase tracking-[0.1em] text-xs">Entrar al Codex</span>
            </button>
            <p className="text-[9px] text-white/20 font-mono">ENCRIPTACIÓN MILITAR ACTIVA • SHA-512</p>
          </div>
        </motion.div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)', backgroundSize: '48px 48px' }}></div>
      </div>
    );
  }

  return <>{children}</>;
}
