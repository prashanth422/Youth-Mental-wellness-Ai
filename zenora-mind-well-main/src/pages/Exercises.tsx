import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { 
  Dumbbell, 
  Wind, 
  Brain, 
  Heart, 
  Sparkles,
  Play,
  Clock,
  Award,
  Loader2
} from 'lucide-react';
import BoxBreathing from '@/components/exercises/BoxBreathing';
import GuidedExercise from '@/components/exercises/GuidedExercise';
import { exerciseInstructions } from '@/data/exerciseInstructions';

const exerciseCategories = [
  {
    key: 'breathing',
    icon: Wind,
    gradient: 'bg-gradient-calm',
    description: 'WHO-recommended breathing exercises to reduce stress and anxiety',
    exercises: [
      { 
        name: 'Deep Breathing (4-7-8)', 
        duration: 5, 
        xp: 15, 
        difficulty: 'Beginner',
        description: 'Breathe in for 4, hold for 7, exhale for 8 seconds'
      },
      { 
        name: 'Box Breathing', 
        duration: 8, 
        xp: 20, 
        difficulty: 'Beginner',
        description: 'Square breathing: 4 counts each for inhale, hold, exhale, hold'
      },
      { 
        name: 'Alternate Nostril', 
        duration: 10, 
        xp: 25, 
        difficulty: 'Advanced',
        description: 'Calm the nervous system with balanced nostril breathing'
      }
    ]
  },
  {
    key: 'grounding',
    icon: Brain,
    gradient: 'bg-gradient-focus',
    description: 'Sensory awareness exercises to anchor yourself in the present',
    exercises: [
      { 
        name: '5-4-3-2-1 Grounding', 
        duration: 5, 
        xp: 15, 
        difficulty: 'Beginner',
        description: '5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste'
      },
      { 
        name: 'Body Scan', 
        duration: 15, 
        xp: 30, 
        difficulty: 'Beginner',
        description: 'Systematically focus on each body part to release tension'
      },
      { 
        name: 'Present Moment Awareness', 
        duration: 10, 
        xp: 20, 
        difficulty: 'Intermediate',
        description: 'Notice your surroundings without judgment'
      }
    ]
  },
  {
    key: 'movement',
    icon: Dumbbell,
    gradient: 'bg-gradient-primary',
    description: 'Light physical activities to boost mood and energy',
    exercises: [
      { 
        name: 'Stretch Break', 
        duration: 5, 
        xp: 10, 
        difficulty: 'Beginner',
        description: 'Simple stretches to release physical tension'
      },
      { 
        name: 'Mindful Walking', 
        duration: 15, 
        xp: 25, 
        difficulty: 'Beginner',
        description: 'Walk slowly, focusing on each step and breath'
      },
      { 
        name: 'Progressive Muscle Relaxation', 
        duration: 20, 
        xp: 35, 
        difficulty: 'Intermediate',
        description: 'Tense and release muscle groups systematically'
      }
    ]
  },
  {
    key: 'gratitude',
    icon: Heart,
    gradient: 'bg-gradient-energy',
    description: 'Cultivate positive emotions through gratitude practice',
    exercises: [
      { 
        name: 'Gratitude Journal', 
        duration: 5, 
        xp: 10, 
        difficulty: 'Beginner',
        description: 'Write 3 things you\'re grateful for today'
      },
      { 
        name: 'Gratitude Letter', 
        duration: 15, 
        xp: 30, 
        difficulty: 'Intermediate',
        description: 'Write to someone who made a difference in your life'
      },
      { 
        name: 'Loving Kindness Meditation', 
        duration: 12, 
        xp: 25, 
        difficulty: 'Intermediate',
        description: 'Send wishes of wellbeing to yourself and others'
      }
    ]
  },
  {
    key: 'sleep',
    icon: Sparkles,
    gradient: 'bg-gradient-calm',
    description: 'WHO sleep hygiene practices for better rest',
    exercises: [
      { 
        name: 'Sleep Prep Routine', 
        duration: 10, 
        xp: 20, 
        difficulty: 'Beginner',
        description: 'Screen-off time, dim lights, and relaxation'
      },
      { 
        name: 'Body Relaxation for Sleep', 
        duration: 15, 
        xp: 25, 
        difficulty: 'Beginner',
        description: 'Progressive relaxation to prepare for sleep'
      },
      { 
        name: 'Sleep Meditation', 
        duration: 20, 
        xp: 30, 
        difficulty: 'Intermediate',
        description: 'Guided meditation to calm the mind before bed'
      }
    ]
  }
];

export default function Exercises() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [startingExercise, setStartingExercise] = useState<string | null>(null);
  const [showBoxBreathing, setShowBoxBreathing] = useState(false);
  const [activeExercise, setActiveExercise] = useState<{
    name: string;
    description: string;
    duration: number;
    xp: number;
    category: string;
  } | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const startExercise = async (exerciseName: string, duration: number, xp: number, category: string) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to start exercises.",
        variant: "destructive",
      });
      return;
    }

    // Special handling for Box Breathing
    if (exerciseName === 'Box Breathing') {
      setShowBoxBreathing(true);
      return;
    }

    // For all other exercises, show the guided exercise component
    const exerciseData = exerciseCategories
      .flatMap(cat => cat.exercises)
      .find(ex => ex.name === exerciseName);

    if (exerciseData) {
      setActiveExercise({
        name: exerciseName,
        description: exerciseData.description,
        duration,
        xp,
        category
      });
    }
  };

  const handleExerciseComplete = async (exerciseName: string, duration: number, xp: number, category: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.functions.invoke('start-exercise', {
        body: {
          exerciseName,
          duration,
          xp,
          userId: user.id,
          category
        }
      });

      if (error) throw error;

      toast({
        title: "Exercise Completed! 🎉",
        description: `Great work! You've earned ${xp} XP for completing ${exerciseName}.`,
      });
    } catch (error) {
      console.error('Error completing exercise:', error);
      toast({
        title: "Error",
        description: "Could not record exercise completion. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <AnimatePresence>
        {showBoxBreathing && (
          <BoxBreathing
            onClose={() => setShowBoxBreathing(false)}
            onComplete={() => {
              setShowBoxBreathing(false);
              handleExerciseComplete('Box Breathing', 8, 20, 'breathing');
            }}
          />
        )}
        
        {activeExercise && (
          <GuidedExercise
            exerciseName={activeExercise.name}
            description={activeExercise.description}
            duration={activeExercise.duration}
            category={activeExercise.category}
            instructions={exerciseInstructions[activeExercise.name] || []}
            onClose={() => setActiveExercise(null)}
            onComplete={() => {
              handleExerciseComplete(
                activeExercise.name,
                activeExercise.duration,
                activeExercise.xp,
                activeExercise.category
              );
              setActiveExercise(null);
            }}
          />
        )}
      </AnimatePresence>

      <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-focus rounded-full flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('exercises.title')}</h1>
            <p className="text-muted-foreground">Strengthen your mind with guided exercises</p>
          </div>
        </div>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">47</div>
                <div className="text-sm text-muted-foreground">Exercises Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">128</div>
                <div className="text-sm text-muted-foreground">Minutes Practiced</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">15</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Exercise Categories */}
      <div className="space-y-8">
        {exerciseCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + categoryIndex * 0.1 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${category.gradient} rounded-lg flex items-center justify-center`}>
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="capitalize">{t(`exercises.${category.key}`)}</span>
                  </div>
                  <p className="text-sm font-normal text-muted-foreground">{category.description}</p>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.exercises.map((exercise, exerciseIndex) => (
                    <motion.div
                      key={exercise.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + exerciseIndex * 0.1 }}
                      className="border border-border/20 rounded-lg p-4 hover:shadow-medium transition-all duration-200 hover-lift"
                    >
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-medium text-foreground">{exercise.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{exercise.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getDifficultyColor(exercise.difficulty)}`}
                            >
                              {exercise.difficulty}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{exercise.duration} min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="w-3 h-3" />
                            <span>{exercise.xp} XP</span>
                          </div>
                        </div>

                        <Button
                          onClick={() => startExercise(exercise.name, exercise.duration, exercise.xp, category.key)}
                          disabled={startingExercise === exercise.name}
                          className={`w-full ${category.gradient} text-white hover:opacity-90 shadow-soft`}
                        >
                          {startingExercise === exercise.name ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Play className="w-4 h-4 mr-2" />
                          )}
                          {startingExercise === exercise.name ? 'Starting...' : 'Start Exercise'}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Daily Challenge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="glass border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span>Today's Challenge</span>
              <Badge className="bg-primary text-white">+50 XP</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Complete 3 Different Exercise Types</h3>
                <p className="text-sm text-muted-foreground">
                  Practice one breathing, meditation, and mindfulness exercise to earn bonus XP!
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>1/3</span>
                </div>
                <Progress value={33} className="h-2" />
              </div>

              <div className="flex space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-xs">Breathing ✓</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-xs">Meditation</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-xs">Mindfulness</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      </div>
    </>
  );
}