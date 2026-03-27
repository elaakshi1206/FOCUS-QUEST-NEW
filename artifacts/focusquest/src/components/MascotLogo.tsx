import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MascotLogoProps {
  className?: string;
}

export function MascotLogo({ className = "" }: MascotLogoProps) {
  const [logoDesc, setLogoDesc] = useState<string | null>(sessionStorage.getItem('current_finny_logo'));
  const [emoji, setEmoji] = useState('🦜');

  useEffect(() => {
    const handleLogoChange = (e: CustomEvent<string>) => {
      const desc = e.detail;
      setLogoDesc(desc);
      
      // Map description to emoji as fallback
      if (desc.includes('dolphin')) setEmoji('🐬');
      else if (desc.includes('astronaut')) setEmoji('🚀');
      else if (desc.includes('robot')) setEmoji('🤖');
    };

    window.addEventListener('finny_logo_change' as any, handleLogoChange);
    return () => window.removeEventListener('finny_logo_change' as any, handleLogoChange);
  }, []);

  // Determine current theme image path (placeholders for now)
  let imageSrc = "";
  if (logoDesc?.includes('dolphin')) imageSrc = "/assets/mascots/sea_world.png";
  else if (logoDesc?.includes('astronaut')) imageSrc = "/assets/mascots/space_adventure.png";
  else if (logoDesc?.includes('robot')) imageSrc = "/assets/mascots/robotics_ai.png";

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={emoji + (imageSrc ? 'img' : 'emoji')}
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-full h-full flex items-center justify-center overflow-hidden rounded-full bg-white/10 backdrop-blur border-2 border-white/30 shadow-lg"
        >
          {imageSrc ? (
            <img 
              src={imageSrc} 
              alt="Finny Mascot" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to emoji if image fails to load
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as any).nextSibling.style.display = 'block';
              }}
            />
          ) : null}
          <span className="text-2xl" style={{ display: imageSrc ? 'none' : 'block' }}>{emoji}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
