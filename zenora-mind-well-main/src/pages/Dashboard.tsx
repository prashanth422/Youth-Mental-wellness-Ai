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
  Phone
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 'Friend';

  const quickActions = [
    { 
      key: 'journal', 
      icon: BookOpen, 
      path: '/journal',
      gradient: 'bg-gradient-energy'
    },
    { 
      key: 'zenora', 
      icon: Brain, 
      path: '/zenora',
      gradient: 'bg-gradient-primary'
    },
    { 
      key: 'exercises', 
      icon: Dumbbell, 
      path: '/exercises',
      gradient: 'bg-gradient-focus'
    },
    { 
      key: 'rewards', 
      icon: Gift, 
      path: '/rewards',
      gradient: 'bg-gradient-calm'
    },
    { 
      key: 'insights', 
      icon: BarChart3, 
      path: '/insights',
      gradient: 'bg-gradient-energy'
    },
    { 
      key: 'wellnessResources', 
      icon: Phone, 
      path: '/wellness-resources',
      gradient: 'bg-gradient-primary'
    },
  ];

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-foreground">
          {t('dashboard.welcome')}, {userName}! 👋
        </h1>
        <p className="text-muted-foreground">
          Ready to continue your wellness journey today?
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today's Mood */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Smile className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('dashboard.todaysMood')}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {t('moods.good')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
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

        {/* Streak Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
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
                  <p className="text-2xl font-bold text-foreground">
                    7
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* XP Points */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-calm rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    XP Points
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    1,250
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
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

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Journal Entry</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30">
                <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <p className="font-medium">Chat with Zenora</p>
                  <p className="text-sm text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}