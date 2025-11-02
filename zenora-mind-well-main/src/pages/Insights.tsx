import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  Brain, 
  Heart,
  Zap,
  Target,
  Clock
} from 'lucide-react';

const moodData = [
  { date: '2024-01-15', mood: 'great', value: 5 },
  { date: '2024-01-16', mood: 'good', value: 4 },
  { date: '2024-01-17', mood: 'okay', value: 3 },
  { date: '2024-01-18', mood: 'good', value: 4 },
  { date: '2024-01-19', mood: 'great', value: 5 },
  { date: '2024-01-20', mood: 'good', value: 4 },
  { date: '2024-01-21', mood: 'great', value: 5 },
];

const weeklyStats = [
  { day: 'Mon', exercises: 2, journal: 1, mood: 4 },
  { day: 'Tue', exercises: 1, journal: 1, mood: 3 },
  { day: 'Wed', exercises: 3, journal: 1, mood: 5 },
  { day: 'Thu', exercises: 1, journal: 0, mood: 3 },
  { day: 'Fri', exercises: 2, journal: 1, mood: 4 },
  { day: 'Sat', exercises: 1, journal: 1, mood: 4 },
  { day: 'Sun', exercises: 2, journal: 1, mood: 5 },
];

export default function Insights() {
  const { t } = useTranslation();

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'great': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'okay': return 'bg-yellow-500';
      case 'low': return 'bg-orange-500';
      case 'difficult': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-focus rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('nav.insights')}</h1>
            <p className="text-muted-foreground">Track your progress and discover patterns</p>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Mood</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-foreground">4.2</p>
                    <Badge variant="outline" className="text-green-600 bg-green-50">
                      +0.3 this week
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Exercises Completed</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-foreground">12</p>
                    <Badge variant="outline" className="text-blue-600 bg-blue-50">
                      This week
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Streak</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-foreground">7 days</p>
                    <Badge variant="outline" className="text-orange-600 bg-orange-50">
                      Personal best
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time Practiced</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-foreground">89 min</p>
                    <Badge variant="outline" className="text-purple-600 bg-purple-50">
                      This week
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Mood Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>7-Day Mood Heatmap</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Past 7 days</span>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>Less</span>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-gray-200 rounded"></div>
                    <div className="w-3 h-3 bg-green-200 rounded"></div>
                    <div className="w-3 h-3 bg-green-400 rounded"></div>
                    <div className="w-3 h-3 bg-green-600 rounded"></div>
                  </div>
                  <span>More</span>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {moodData.map((day, index) => (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="aspect-square"
                  >
                    <div
                      className={`w-full h-full rounded-lg ${getMoodColor(day.mood)} opacity-80 hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center text-white text-xs font-medium`}
                      title={`${day.date}: ${day.mood}`}
                    >
                      {day.value}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>Weekly Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyStats.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-12 text-sm font-medium text-muted-foreground">
                    {day.day}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground w-16">Exercises</span>
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-primary transition-all duration-500"
                          style={{ width: `${(day.exercises / 3) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium w-4">{day.exercises}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground w-16">Journal</span>
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-energy transition-all duration-500"
                          style={{ width: `${day.journal * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium w-4">{day.journal}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights and Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-primary" />
              <span>AI Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                    <TrendingUp className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Positive Trend Detected</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Your mood has been consistently improving over the past week. Keep up the great work with your daily exercises!
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                    <Target className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900 dark:text-green-100">Goal Achievement</h4>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      You've maintained a 7-day streak! Consider setting a new goal of 14 days to continue building this healthy habit.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mt-0.5">
                    <Brain className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-900 dark:text-orange-100">Opportunity</h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                      Your Thursday activities are typically lower. Consider scheduling a reminder to practice mindfulness on Thursday mornings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}