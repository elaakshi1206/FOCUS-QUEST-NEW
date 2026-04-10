import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

export function IntroPage() {
  const [, setLocation] = useLocation();

  const handleBegin = () => {
    setLocation('/login');
  };

  const handleCreateAccount = () => {
    setLocation('/signup');
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, overflow: 'hidden',
        fontFamily: "'Fredoka', 'Nunito', 'Outfit', sans-serif",
        backgroundImage: "url('/background/Untitled%20design%20(1).jpg.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');
        
        @keyframes float-cloud {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>

      {/* ── Soft floating decorations behind mascot ── */}
      <div style={{ position: 'absolute', top: '15%', left: '15%', width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.45)', filter: 'blur(12px)', animation: 'float-cloud 6s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '25%', right: '10%', width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', filter: 'blur(16px)', animation: 'float-cloud 8s ease-in-out infinite alternate', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '35%', right: '8%', width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', filter: 'blur(8px)', animation: 'float-cloud 5s ease-in-out infinite', pointerEvents: 'none' }} />

      <AnimatePresence mode="wait">
        <motion.div
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative', zIndex: 10 }}
        >
          {/* ── Mascot Container (Wide format) ── */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.1 }}
            style={{
              width: '100%', maxWidth: 400,
              marginBottom: 24,
              animation: 'bounce-slow 4s ease-in-out infinite',
              position: 'relative', zIndex: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <img 
              src="/background/bg_logo-removebg-preview.png" 
              alt="Focus Quest Logo" 
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }} 
            />
          </motion.div>

          
          <motion.p
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            style={{
              fontSize: 'clamp(1.1rem, 3.5vw, 1.45rem)',
              fontWeight: 500,
              color: '#475569',
              margin: '0 0 48px 0',
              textAlign: 'center',
              maxWidth: '400px'
            }}
          >
            Turn focus into wins 🎯
          </motion.p>

          <motion.div
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 360 }}
          >
            {/* ── Primary: Create Account (new full signup) ── */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ y: 4, scale: 0.98, boxShadow: '0 2px 10px rgba(99,102,241,0.4), inset 0 -1px 0 rgba(0,0,0,0.1)' }}
              onClick={handleCreateAccount}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white',
                border: 'none',
                borderRadius: 24,
                padding: '20px 32px',
                fontSize: '1.2rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 8px 15px rgba(99,102,241,0.35), inset 0 -5px 0 rgba(0,0,0,0.15)',
                transition: 'background 0.3s, box-shadow 0.1s',
                fontFamily: "'Fredoka', sans-serif",
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}
            >
              ✨ Start Learning Free
            </motion.button>

            {/* ── Secondary: Let's Begin (existing name-only flow) ── */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ y: 2, scale: 0.98 }}
              onClick={handleBegin}
              style={{
                background: 'rgba(255,255,255,0.85)',
                color: '#475569',
                border: '2px solid rgba(255,255,255,0.9)',
                borderRadius: 24,
                padding: '14px 32px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.2s',
                fontFamily: "'Fredoka', sans-serif",
                letterSpacing: '0.03em',
              }}
            >
              Already have an account? Sign in
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

