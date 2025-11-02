import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { TrendingUp, Heart, Zap, Calendar } from 'lucide-react';
import { format, subDays } from 'date-fns';

interface EmotionTrend {
  date: string;
  sentiment: string;
  intensity: number;
  emotions: string[];
}

export default function Progress() {
  const { user } = useAuth();
  const [moodData, setMoodData] = useState<any[]>([]);
  const [weeklyAverage, setWeeklyAverage] = useState<number>(5);
  const [mostCommonEmotion, setMostCommonEmotion] = useState<string>('neutral');
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    if (user) {
      fetchProgressData();
    }
  }, [user]);

  const fetchProgressData = async () => {
    if (!user) return;

    const sevenDaysAgo = subDays(new Date(), 7);

    // Fetch mood entries
    const { data: moods } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', format(sevenDaysAgo, 'yyyy-MM-dd'))
      .order('date', { ascending: true });

    if (moods) {
      setMoodData(moods);
      
      // Calculate average stress/energy
      const avgStress = moods.reduce((sum, m) => sum + (m.stress_level || 5), 0) / moods.length;
      setWeeklyAverage(Math.round(10 - avgStress));

      // Calculate streak
      const today = format(new Date(), 'yyyy-MM-dd');
      let currentStreak = 0;
      for (let i = 0; i < 7; i++) {
        const checkDate = format(subDays(new Date(), i), 'yyyy-MM-dd');
        const hasEntry = moods.some(m => m.date === checkDate);
        if (hasEntry) {
          currentStreak++;
        } else if (checkDate !== today) {
          break;
        }
      }
      setStreak(currentStreak);

      // Find most common mood
      const moodCounts: Record<string, number> = {};
      moods.forEach(m => {
        moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
      });
      const mostCommon = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';
      setMostCommonEmotion(mostCommon);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Your Wellness Journey</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-6 w-6 text-primary" />
              <h3 className="font-semibold">Weekly Average</h3>
            </div>
            <p className="text-3xl font-bold">{weeklyAverage}/10</p>
            <p className="text-sm text-muted-foreground mt-1">Emotional wellness score</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-6 w-6 text-accent" />
              <h3 className="font-semibold">Current Streak</h3>
            </div>
            <p className="text-3xl font-bold">{streak} days</p>
            <p className="text-sm text-muted-foreground mt-1">Keep it going!</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-6 w-6 text-purple-500" />
              <h3 className="font-semibold">Most Common</h3>
            </div>
            <p className="text-3xl font-bold capitalize">{mostCommonEmotion}</p>
            <p className="text-sm text-muted-foreground mt-1">This week's mood</p>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">7-Day Mood Timeline</h2>
          <div className="space-y-3">
            {moodData.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Start tracking your mood to see progress over time
              </p>
            ) : (
              moodData.map((mood) => (
                <div key={mood.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="text-sm font-medium w-24">
                    {format(new Date(mood.date), 'MMM dd')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="capitalize font-medium">{mood.mood}</span>
                      <span className="text-xs text-muted-foreground">
                        Energy: {mood.energy_level}/10 | Stress: {mood.stress_level}/10
                      </span>
                    </div>
                    {mood.notes && (
                      <p className="text-sm text-muted-foreground">{mood.notes}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-6 bg-primary/5">
          <h2 className="text-xl font-semibold mb-2">💡 Progress Insight</h2>
          <p className="text-muted-foreground">
            {streak >= 7
              ? "Amazing! You've maintained a full week of check-ins. This consistency is key to understanding your patterns."
              : streak >= 3
              ? "Great start! Keep tracking your mood daily to build better self-awareness."
              : "Start your wellness journey by checking in with Zenora daily. Small steps lead to big changes."}
          </p>
        </Card>
      </div>
    </div>
  );
}
