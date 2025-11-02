import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, Play, Pause, CheckCircle, Clock, Volume2, VolumeX } from 'lucide-react';
import { useVoice } from '@/hooks/useVoice';

interface GuidedExerciseProps {
  exerciseName: string;
  description: string;
  duration: number; // in minutes
  category: string;
  instructions?: string[];
  onClose: () => void;
  onComplete: () => void;
}

export default function GuidedExercise({
  exerciseName,
  description,
  duration,
  category,
  instructions = [],
  onClose,
  onComplete,
}: GuidedExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60); // convert to seconds
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const { speak, stopSpeaking, isSpeaking } = useVoice();

  const totalSeconds = duration * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  useEffect(() => {
    if (!isActive || timeLeft <= 0 || isCompleted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, isCompleted]);

  useEffect(() => {
    if (instructions.length > 0 && isActive && !isCompleted) {
      const stepDuration = totalSeconds / instructions.length;
      const newStep = Math.floor((totalSeconds - timeLeft) / stepDuration);
      if (newStep < instructions.length && newStep !== currentStep) {
        setCurrentStep(newStep);
        // Speak the new instruction
        if (voiceEnabled && instructions[newStep]) {
          speak(instructions[newStep], 0.9);
        }
      }
    }
  }, [timeLeft, instructions.length, isActive, totalSeconds, isCompleted, currentStep, voiceEnabled, speak, instructions]);

  // Cleanup voice on unmount or pause
  useEffect(() => {
    if (!isActive || isCompleted) {
      stopSpeaking();
    }
  }, [isActive, isCompleted, stopSpeaking]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const motivationalMessages = [
    "You're doing great!",
    "Keep going, you've got this!",
    "Feel the positive energy flowing.",
    "You're making progress!",
    "Stay focused, stay calm.",
  ];

  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl"
        >
          <Card className="glass p-8 space-y-6 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 opacity-50" />
            
            {/* Control buttons */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled);
                  if (!voiceEnabled) {
                    stopSpeaking();
                  }
                }}
                title={voiceEnabled ? "Mute voice" : "Enable voice"}
              >
                {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="relative space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-foreground">{exerciseName}</h2>
                <p className="text-muted-foreground">{description}</p>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{duration} minutes</span>
                </div>
              </div>

              {/* Animated Avatar */}
              {!isCompleted && (
                <div className="flex justify-center my-6">
                  <motion.div
                    className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center"
                    animate={isActive ? {
                      scale: [1, 1.2, 1],
                    } : {}}
                    transition={{
                      duration: 4,
                      repeat: isActive ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    <motion.div
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary opacity-60"
                      animate={isActive ? {
                        scale: [1, 1.3, 1],
                        opacity: [0.6, 0.8, 0.6]
                      } : {}}
                      transition={{
                        duration: 4,
                        repeat: isActive ? Infinity : 0,
                        ease: "easeInOut"
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl">🧘</div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Timer */}
              {!isCompleted && (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-primary">
                      {formatTime(timeLeft)}
                    </div>
                  </div>

                  <Progress value={progress} className="h-2" />

                  {/* Current instruction */}
                  {instructions.length > 0 && isActive && (
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center p-4 bg-background/50 rounded-lg"
                    >
                      <p className="text-lg text-foreground">
                        {instructions[currentStep]}
                      </p>
                    </motion.div>
                  )}

                  {/* Motivational message */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2 }}
                      className="text-center text-sm text-primary font-medium"
                    >
                      {randomMessage}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Completion message */}
              {isCompleted && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center space-y-4 py-8"
                >
                  <CheckCircle className="w-20 h-20 text-primary mx-auto" />
                  <h3 className="text-2xl font-bold text-foreground">Exercise Complete!</h3>
                  <p className="text-muted-foreground">
                    Great work! You've completed {exerciseName}.
                  </p>
                </motion.div>
              )}

              {/* Control buttons */}
              <div className="flex justify-center space-x-4">
                {!isCompleted && !isActive && (
                  <Button
                    onClick={() => setIsActive(true)}
                    className="bg-gradient-primary text-white px-8"
                    size="lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Exercise
                  </Button>
                )}

                {!isCompleted && isActive && (
                  <Button
                    onClick={() => setIsActive(false)}
                    variant="outline"
                    size="lg"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </Button>
                )}

                {isCompleted && (
                  <Button
                    onClick={handleComplete}
                    className="bg-gradient-primary text-white px-8"
                    size="lg"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Complete & Earn XP
                  </Button>
                )}
              </div>

              {/* Quick complete option */}
              {isActive && !isCompleted && (
                <div className="text-center">
                  <Button
                    onClick={() => {
                      setIsCompleted(true);
                      setTimeLeft(0);
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                  >
                    Skip to completion
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
