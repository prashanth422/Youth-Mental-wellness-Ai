import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, X } from 'lucide-react';

interface BoxBreathingProps {
  onClose: () => void;
  onComplete: () => void;
}

const phases = [
  { name: 'Breathe in...', duration: 4000, instruction: 'Feel your lungs expand' },
  { name: 'Hold it...', duration: 4000, instruction: 'Stay present with the breath' },
  { name: 'Exhale slowly...', duration: 4000, instruction: 'Release all tension' },
  { name: 'Hold again...', duration: 4000, instruction: 'Find your center' },
];

const motivationalQuotes = [
  "You've got this",
  "Feel the calm flow in",
  "Let your body settle",
  "You're doing great",
  "Peace begins with breath",
  "This moment is yours"
];

export default function BoxBreathing({ onClose, onComplete }: BoxBreathingProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [showMotivation, setShowMotivation] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      utteranceRef.current = new SpeechSynthesisUtterance(text);
      utteranceRef.current.rate = 0.9;
      utteranceRef.current.pitch = 1.0;
      utteranceRef.current.volume = 0.8;
      
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'));
        if (englishVoice) {
          utteranceRef.current!.voice = englishVoice;
        }
        window.speechSynthesis.speak(utteranceRef.current!);
      };

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoice();
      } else {
        window.speechSynthesis.onvoiceschanged = setVoice;
      }
    }
  };

  useEffect(() => {
    if (isActive) {
      const phase = phases[currentPhase];
      speak(phase.name);

      timerRef.current = setTimeout(() => {
        const nextPhase = (currentPhase + 1) % phases.length;
        setCurrentPhase(nextPhase);

        if (nextPhase === 0) {
          const newCycles = cycles + 1;
          setCycles(newCycles);
          
          // Show motivation every 2 cycles
          if (newCycles % 2 === 0) {
            setShowMotivation(true);
            setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
            speak(motivationalQuotes[currentQuote]);
            setTimeout(() => setShowMotivation(false), 3000);
          }

          // Complete after 5 cycles
          if (newCycles >= 5) {
            setIsActive(false);
            speak("Well done. You've completed the exercise.");
            onComplete();
          }
        }
      }, phase.duration);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, currentPhase, cycles]);

  const toggleActive = () => {
    if (isActive) {
      window.speechSynthesis.cancel();
    } else {
      speak("Let's begin. Find a comfortable position and relax.");
    }
    setIsActive(!isActive);
  };

  const handleClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    window.speechSynthesis.cancel();
    onClose();
  };

  const getAvatarScale = () => {
    if (!isActive) return 1;
    if (currentPhase === 0) return 1.3; // Inhale
    if (currentPhase === 1) return 1.3; // Hold inhale
    if (currentPhase === 2) return 1; // Exhale
    return 1; // Hold exhale
  };

  const getAvatarOpacity = () => {
    if (!isActive) return 0.6;
    if (currentPhase === 0 || currentPhase === 1) return 0.9;
    return 0.6;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
    >
      {/* Peaceful Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(135deg, 
            hsl(180 85% 70% / 0.3) 0%, 
            hsl(200 80% 65% / 0.3) 50%,
            hsl(240 85% 65% / 0.3) 100%)`,
          backgroundSize: '400% 400%',
          animation: 'gradient-shift 15s ease infinite'
        }}
      />

      <Card className="relative w-full max-w-2xl mx-4 p-8 glass-strong">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-4 right-4 hover:bg-muted"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Box Breathing
          </h2>
          <p className="text-muted-foreground">
            A calming 4-4-4-4 breathing pattern
          </p>
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <span className="text-muted-foreground">Cycles: {cycles}/5</span>
            <span className="text-primary font-medium">
              {phases[currentPhase].name}
            </span>
          </div>
        </div>

        {/* Breathing Avatar */}
        <div className="relative flex items-center justify-center mb-8" style={{ height: '320px' }}>
          {/* Outer breathing circle */}
          <motion.div
            animate={{
              scale: getAvatarScale(),
              opacity: getAvatarOpacity(),
            }}
            transition={{
              duration: phases[currentPhase].duration / 1000,
              ease: 'easeInOut',
            }}
            className="absolute w-64 h-64 rounded-full bg-gradient-calm shadow-glow"
            style={{
              boxShadow: '0 0 60px hsl(180 85% 70% / 0.4)',
            }}
          />

          {/* Avatar silhouette */}
          <motion.div
            animate={{
              scale: getAvatarScale(),
            }}
            transition={{
              duration: phases[currentPhase].duration / 1000,
              ease: 'easeInOut',
            }}
            className="absolute w-48 h-48"
          >
            {/* Head */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-b from-primary/60 to-primary/80" />
            
            {/* Body */}
            <div className="absolute top-14 left-1/2 -translate-x-1/2 w-20 h-24 rounded-t-full bg-gradient-to-b from-primary/60 to-primary/40" />
            
            {/* Breathing indicator (chest expansion) */}
            <motion.div
              animate={{
                scaleY: currentPhase === 0 || currentPhase === 1 ? 1.2 : 1,
                opacity: currentPhase === 0 || currentPhase === 1 ? 0.8 : 0.4,
              }}
              transition={{
                duration: phases[currentPhase].duration / 1000,
                ease: 'easeInOut',
              }}
              className="absolute top-20 left-1/2 -translate-x-1/2 w-16 h-12 rounded-full bg-secondary/40"
            />
          </motion.div>

          {/* Phase instruction */}
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-0 text-center"
          >
            <p className="text-xl font-medium text-foreground mb-1">
              {phases[currentPhase].name}
            </p>
            <p className="text-sm text-muted-foreground">
              {phases[currentPhase].instruction}
            </p>
          </motion.div>
        </div>

        {/* Motivational Quotes */}
        <AnimatePresence>
          {showMotivation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center mb-6"
            >
              <p className="text-2xl font-medium text-primary animate-pulse-slow">
                ✨ {motivationalQuotes[currentQuote]} ✨
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={toggleActive}
            size="lg"
            className="bg-gradient-primary text-white hover:opacity-90 shadow-glow px-8"
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                {cycles > 0 ? 'Resume' : 'Start'}
              </>
            )}
          </Button>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < cycles ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </Card>

      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </motion.div>
  );
}
