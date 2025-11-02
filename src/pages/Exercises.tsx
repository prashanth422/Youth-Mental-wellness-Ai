import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import {
  Dumbbell,
  Wind,
  Brain,
  Heart,
  Sparkles,
  Play,
  Clock,
  Award,
  Loader2,
  Trash2
} from 'lucide-react';
import BoxBreathing from '@/components/exercises/BoxBreathing';
import GuidedExercise from '@/components/exercises/GuidedExercise';
import { exerciseInstructions } from '@/data/exerciseInstructions';

// 🧘 Exercise Categories
const exerciseCategories = [
  {
    key: 'breathing',
    icon: Wind,
    gradient: 'bg-gradient-calm',
    description: 'WHO-recommended breathing exercises to reduce stress and anxiety',
    exercises: [
      { name: 'Deep Breathing (4-7-8)', duration: 5, xp: 15, difficulty: 'Beginner', description: 'Breathe in for 4, hold for 7, exhale for 8 seconds' },
      { name: 'Box Breathing', duration: 8, xp: 20, difficulty: 'Beginner', description: 'Square breathing: 4 counts each for inhale, hold, exhale, hold' },
      { name: 'Alternate Nostril', duration: 10, xp: 25, difficulty: 'Advanced', description: 'Calm the nervous system with balanced nostril breathing' }
    ]
  },
  {
    key: 'gratitude',
    icon: Heart,
    gradient: 'bg-gradient-energy',
    description: 'Cultivate positive emotions through gratitude practice',
    exercises: [
      { name: 'Gratitude Journal', duration: 5, xp: 10, difficulty: 'Beginner', description: "Write 3 things you're grateful for today" },
      { name: 'Gratitude Letter', duration: 15, xp: 30, difficulty: 'Intermediate', description: 'Write to someone who made a difference in your life' },
      { name: 'Loving Kindness Meditation', duration: 12, xp: 25, difficulty: 'Intermediate', description: 'Send wishes of wellbeing to yourself and others' }
    ]
  }
];

export default function Exercises() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [startingExercise, setStartingExercise] = useState<string | null>(null);
  const [showBoxBreathing, setShowBoxBreathing] = useState(false);
  const [activeExercise, setActiveExercise] = useState<any>(null);
  const [progress, setProgress] = useState<{ exercises_done: number; minutes_practiced: number; day_streak: number } | null>(null);
  const [motivations, setMotivations] = useState<string[]>([
    "Keep going, you're doing great!",
    "Every breath counts.",
    "You’ve got this!"
  ]);
  const [newMotivation, setNewMotivation] = useState('');

  // 🎨 Difficulty Color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 🧠 Fetch user progress
  const fetchProgress = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('user_progress')
      .select('exercises_done, minutes_practiced, day_streak')
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      // Initialize default progress
      setProgress({ exercises_done: 0, minutes_practiced: 0, day_streak: 0 });
      await supabase.from('user_progress').upsert({
        user_id: user.id,
        exercises_done: 0,
        minutes_practiced: 0,
        day_streak: 0,
        last_exercise_at: new Date().toISOString()
      });
    } else {
      setProgress(data);
    }
  };

  useEffect(() => { fetchProgress(); }, [user]);

  // 🚀 Start Exercise
  const startExercise = (exerciseName: string, duration: number, xp: number, category: string) => {
    if (!user) {
      toast({ title: 'Please log in', description: 'You need to be logged in to start exercises.', variant: 'destructive' });
      return;
    }
    if (exerciseName === 'Box Breathing') {
      setShowBoxBreathing(true);
      return;
    }
    const exerciseData = exerciseCategories.flatMap(c => c.exercises).find(e => e.name === exerciseName);
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

  // ✅ Complete Exercise
  const handleExerciseComplete = async (exerciseName: string, duration: number, xp: number, category: string) => {
    if (!user) return;
    try {
      await supabase.functions.invoke('start-exercise', { body: { exerciseName, duration, xp, userId: user.id, category } });

      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const today = new Date().toDateString();
      let newExercises = (progressData?.exercises_done || 0) + 1;
      let newMinutes = (progressData?.minutes_practiced || 0) + duration;
      let newStreak = progressData?.day_streak || 1;

      if (progressData?.last_exercise_at) {
        const lastDate = new Date(progressData.last_exercise_at).toDateString();
        if (lastDate !== today) newStreak += 1;
      }

      await supabase.from('user_progress').upsert({
        user_id: user.id,
        exercises_done: newExercises,
        minutes_practiced: newMinutes,
        day_streak: newStreak,
        last_exercise_at: new Date().toISOString()
      });

      toast({ title: 'Exercise Completed 🎉', description: `You earned ${xp} XP and added ${duration} minutes!` });
      fetchProgress();
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Could not record exercise completion.', variant: 'destructive' });
    }
  };

  // 💬 Motivation handlers
  const addMotivation = () => {
    if (newMotivation.trim()) {
      setMotivations([...motivations, newMotivation.trim()]);
      setNewMotivation('');
    }
  };
  const deleteMotivation = (index: number) => {
    setMotivations(motivations.filter((_, i) => i !== index));
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
              handleExerciseComplete(activeExercise.name, activeExercise.duration, activeExercise.xp, activeExercise.category);
              setActiveExercise(null);
            }}
          />
        )}
      </AnimatePresence>

      <div className="h-full overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
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
        <Card className="glass">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {progress ? progress.exercises_done : 0}
                </div>
                <p className="text-sm text-muted-foreground">Exercises Completed</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">
                  {progress ? progress.minutes_practiced : 0}
                </div>
                <p className="text-sm text-muted-foreground">Minutes Practiced</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">
                  {progress ? progress.day_streak : 0}
                </div>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motivations */}
        <Card className="glass">
          <CardHeader><CardTitle>Motivation Board 💫</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {motivations.map((msg, i) => (
                <div key={i} className="flex items-center justify-between bg-muted p-2 rounded-md">
                  <span>{msg}</span>
                  <Button variant="ghost" size="icon" onClick={() => deleteMotivation(i)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  value={newMotivation}
                  onChange={(e) => setNewMotivation(e.target.value)}
                  placeholder="Add your motivation..."
                  className="border rounded-md p-2 w-full text-sm bg-background"
                />
                <Button onClick={addMotivation}>Add</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Categories */}
        {exerciseCategories.map((category, idx) => (
          <motion.div key={category.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.1 }}>
            <Card className="glass">
              <CardHeader>
                <CardTitle className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${category.gradient} rounded-lg flex items-center justify-center`}>
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="capitalize">{t(`exercises.${category.key}`)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.exercises.map(exercise => (
                    <div key={exercise.name} className="border border-border/20 rounded-lg p-4 hover:shadow-md transition-all">
                      <h3 className="font-medium">{exercise.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{exercise.description}</p>
                      <Badge className={`mt-2 text-xs ${getDifficultyColor(exercise.difficulty)}`}>{exercise.difficulty}</Badge>

                      <div className="flex items-center justify-between text-sm text-muted-foreground mt-3">
                        <span><Clock className="w-3 h-3 inline mr-1" />{exercise.duration} min</span>
                        <span><Award className="w-3 h-3 inline mr-1" />{exercise.xp} XP</span>
                      </div>

                      <Button
                        onClick={() => startExercise(exercise.name, exercise.duration, exercise.xp, category.key)}
                        className={`w-full mt-3 ${category.gradient} text-white hover:opacity-90`}
                      >
                        <Play className="w-4 h-4 mr-2" /> Start Exercise
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  );
}
