import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TrendingUp, Calendar, Brain, Heart, Target, Clock } from "lucide-react";

interface MoodEntry {
  date: string;
  mood: string;
  value: number;
}

export default function Insights() {
  const { t } = useTranslation();

  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [averageMood, setAverageMood] = useState<number>(4.2);
  const [streak, setStreak] = useState<number>(7);
  const [timePracticed, setTimePracticed] = useState<number>(89);
  const [exercises, setExercises] = useState<number>(12);

  // 🧠 Function to calculate average mood
  const calculateAverageMood = (data: MoodEntry[]) => {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, d) => acc + d.value, 0);
    return parseFloat((sum / data.length).toFixed(1));
  };

  // 🎯 Convert emoji mood to numeric value
  const moodToValue = (mood: string) => {
    const map: Record<string, number> = {
      happy: 5,
      great: 5,
      good: 4,
      calm: 4,
      okay: 3,
      neutral: 3,
      sad: 2,
      anxious: 2,
      stressed: 1,
      angry: 1,
    };
    const key = mood.toLowerCase().split(" ")[1] || mood.toLowerCase();
    return map[key] || 3;
  };

  // 🌈 Listen to localStorage mood updates (from Zenora)
  useEffect(() => {
    const updateFromStorage = () => {
      const savedMood = localStorage.getItem("zenora-mood");
      if (savedMood) {
        const parsed = JSON.parse(savedMood);
        const today = new Date().toISOString().split("T")[0];
        const todayValue = Math.round((parsed.moodScore / 100) * 5);
        const todayMood = {
          date: today,
          mood: parsed.todayMood,
          value: todayValue,
        };

        setMoodData((prev) => {
          const filtered = prev.filter((d) => d.date !== today);
          const updated = [...filtered.slice(-6), todayMood]; // Keep last 7 days
          const avg = calculateAverageMood(updated);
          setAverageMood(avg);
          localStorage.setItem("insightsData", JSON.stringify({ averageMood: avg, streak, timePracticed, exercises }));
          return updated;
        });
      }
    };

    // Run once and whenever localStorage changes
    updateFromStorage();
    window.addEventListener("storage", updateFromStorage);
    const interval = setInterval(updateFromStorage, 2000); // Real-time check

    return () => {
      window.removeEventListener("storage", updateFromStorage);
      clearInterval(interval);
    };
  }, [streak, timePracticed, exercises]);

  // 📦 Load saved metrics from localStorage (manual fields)
  useEffect(() => {
    const saved = localStorage.getItem("insightsData");
    if (saved) {
      const data = JSON.parse(saved);
      setAverageMood(data.averageMood || 4.2);
      setStreak(data.streak || 7);
      setTimePracticed(data.timePracticed || 89);
      setExercises(data.exercises || 12);
    }
  }, []);

  // 💾 Save metrics whenever changed
  useEffect(() => {
    localStorage.setItem("insightsData", JSON.stringify({ averageMood, streak, timePracticed, exercises }));
  }, [averageMood, streak, timePracticed, exercises]);

  const getMoodColor = (mood: string) => {
    const lower = mood.toLowerCase();
    if (lower.includes("great") || lower.includes("happy")) return "bg-green-500";
    if (lower.includes("good") || lower.includes("calm")) return "bg-blue-500";
    if (lower.includes("okay") || lower.includes("neutral")) return "bg-yellow-500";
    if (lower.includes("sad") || lower.includes("anxious")) return "bg-orange-500";
    if (lower.includes("stressed") || lower.includes("angry")) return "bg-red-500";
    return "bg-gray-400";
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-focus rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("nav.insights") || "Insights"}
            </h1>
            <p className="text-muted-foreground">
              Track your progress and discover patterns
            </p>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Average Mood */}
          <Card className="glass">
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Mood</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-foreground">{averageMood}</p>
                    <Badge variant="outline" className="text-green-600 bg-green-50">
                      Auto
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exercises */}
          <Card className="glass">
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Exercises Completed</p>
                  <p className="text-2xl font-bold text-foreground">{exercises}</p>
                </div>
              </div>
              <Input
                type="number"
                value={exercises}
                onChange={(e) => setExercises(parseInt(e.target.value) || 0)}
                className="bg-white/10 border-white/20 text-white"
              />
            </CardContent>
          </Card>

          {/* Streak */}
          <Card className="glass">
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Streak</p>
                  <p className="text-2xl font-bold text-foreground">{streak} days</p>
                </div>
              </div>
              <Input
                type="number"
                value={streak}
                onChange={(e) => setStreak(parseInt(e.target.value) || 0)}
                className="bg-white/10 border-white/20 text-white"
              />
            </CardContent>
          </Card>

          {/* Time Practiced */}
          <Card className="glass">
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time Practiced</p>
                  <p className="text-2xl font-bold text-foreground">{timePracticed} min</p>
                </div>
              </div>
              <Input
                type="number"
                value={timePracticed}
                onChange={(e) => setTimePracticed(parseInt(e.target.value) || 0)}
                className="bg-white/10 border-white/20 text-white"
              />
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Mood Heatmap */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>7-Day Mood Heatmap</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {moodData.map((day, index) => (
                <motion.div
                  key={day.date + index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="aspect-square"
                >
                  <div
                    className={`w-full h-full rounded-lg ${getMoodColor(day.mood)} 
                    opacity-80 hover:opacity-100 transition flex items-center justify-center text-white font-medium`}
                  >
                    {day.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
