import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  Calendar,
  Flame,
  BookOpen,
  Brain,
  Dumbbell,
  Smile,
  Star,
  Gift,
  BarChart3,
  Phone,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const supabaseClient = useSupabaseClient();
  const userAuth = useUser();

  const [streak, setStreak] = useState(0);
  const [todayMood, setTodayMood] = useState<string | null>(null);
  const [loadingMood, setLoadingMood] = useState(true);

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'Friend';

  // 🧩 Helper function to calculate streak
  function calculateStreak(dates: string[]): number {
    let streak = 0;
    let currentDate = new Date();

    for (let d of dates) {
      const entryDate = new Date(d);
      if (entryDate.toDateString() === currentDate.toDateString()) {
        streak += 1;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  // 🌤 Fetch today's mood from Supabase
  useEffect(() => {
    async function fetchTodayMood() {
      if (!userAuth?.id) return;

      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      const { data, error } = await supabaseClient
        .from('mood_entries')
        .select('mood, created_at')
        .eq('user_id', userAuth.id)
        .gte('created_at', startOfDay)
        .lte('created_at', endOfDay)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching mood:', error.message);
        setLoadingMood(false);
        return;
      }

      if (data && data.length > 0) {
        setTodayMood(data[0].mood);
      } else {
        setTodayMood(null);
      }

      setLoadingMood(false);
    }

    fetchTodayMood();
  }, [userAuth, supabaseClient]);

  // 🔥 Fetch streak data
  useEffect(() => {
    async function fetchStreak() {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('created_at')
        .eq('user_id', userAuth?.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const uniqueDates = Array.from(
          new Set(data.map((x: any) => new Date(x.created_at).toDateString()))
        );
        setStreak(calculateStreak(uniqueDates));
      }
    }

    if (userAuth?.id) fetchStreak();
  }, [userAuth]);

  // 🎨 Mood color mapping
  const moodColors: Record<string, string> = {
    happy: 'bg-yellow-400',
    sad: 'bg-blue-400',
    calm: 'bg-green-400',
    angry: 'bg-red-400',
    good: 'bg-gradient-primary',
  };

  const currentMood = todayMood || 'good';

  // ⚡ Quick Actions
  const quickActions = [
    { key: 'journal', icon: BookOpen, path: '/journal', gradient: 'bg-gradient-energy' },
    { key: 'zenora', icon: Brain, path: '/zenora', gradient: 'bg-gradient-primary' },
    { key: 'exercises', icon: Dumbbell, path: '/exercises', gradient: 'bg-gradient-focus' },
    { key: 'rewards', icon: Gift, path: '/rewards', gradient: 'bg-gradient-calm' },
    { key: 'insights', icon: BarChart3, path: '/insights', gradient: 'bg-gradient-energy' },
    { key: 'wellnessResources', icon: Phone, path: '/wellness-resources', gradient: 'bg-gradient-primary' },
  ];

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      {/* 👋 Welcome Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          {t('dashboard.welcome')}, {userName}! 👋
        </h1>
        <p className="text-muted-foreground">
          Ready to continue your wellness journey today?
        </p>
      </motion.div>

      {/* 📊 Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* 🌤 Today's Mood */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="glass hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    moodColors[currentMood] || 'bg-gradient-primary'
                  }`}
                >
                  <Smile className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('dashboard.todaysMood')}
                  </p>

                  {loadingMood ? (
                    <p className="text-2xl font-bold text-foreground animate-pulse">Loading...</p>
                  ) : todayMood ? (
                    <p className="text-2xl font-bold text-foreground">
                      {t(`moods.${todayMood}`)}
                    </p>
                  ) : (
                    <p className="text-2xl font-bold text-muted-foreground">
                      {t('dashboard.noMoodLogged')}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 📈 Weekly Progress */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Card className="glass hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-focus rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('dashboard.weeklyProgress')}
                  </p>
                  <div className="space-y-2">
                    <Progress value={75} className="h-2" />
                    <p className="text-lg font-bold text-foreground">75%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 🔥 Streak Counter */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card className="glass hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-energy rounded-full flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('dashboard.streakCounter')}
                  </p>
                  <p className="text-2xl font-bold text-foreground">{streak}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 🌟 XP Points */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <Card className="glass hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-calm rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">XP Points</p>
                  <p className="text-2xl font-bold text-foreground">1,250</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 🚀 Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>{t('dashboard.quickActions')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className={`w-full h-24 ${action.gradient} text-white border-none shadow-medium hover:shadow-strong transition-all duration-300`}
                    onClick={() => navigate(action.path)}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <action.icon className="w-8 h-8" />
                      <span className="font-medium">{t(`nav.${action.key}`)}</span>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
