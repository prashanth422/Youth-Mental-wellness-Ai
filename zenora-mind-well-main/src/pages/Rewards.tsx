import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  Star, 
  Trophy, 
  Crown, 
  Zap,
  Gift,
  Target,
  CheckCircle
} from 'lucide-react';

const badges = [
  { 
    id: 1, 
    name: 'First Steps', 
    description: 'Complete your first journal entry', 
    icon: '🌱', 
    earned: true, 
    xpRequired: 0,
    category: 'journal'
  },
  { 
    id: 2, 
    name: 'Mindful Beginner', 
    description: 'Complete your first meditation exercise', 
    icon: '🧘', 
    earned: true, 
    xpRequired: 25,
    category: 'exercise'
  },
  { 
    id: 3, 
    name: 'Streak Starter', 
    description: 'Maintain a 3-day habit streak', 
    icon: '🔥', 
    earned: false, 
    xpRequired: 50,
    category: 'habit',
    progress: 66
  },
  { 
    id: 4, 
    name: 'Conversationalist', 
    description: 'Have your first chat with Zenora', 
    icon: '💬', 
    earned: true, 
    xpRequired: 15,
    category: 'chat'
  },
  { 
    id: 5, 
    name: 'Wellness Warrior', 
    description: 'Earn 500 XP total', 
    icon: '⚡', 
    earned: false, 
    xpRequired: 500,
    category: 'xp',
    progress: 25
  },
  { 
    id: 6, 
    name: 'Breathing Expert', 
    description: 'Complete 10 breathing exercises', 
    icon: '🫁', 
    earned: false, 
    xpRequired: 150,
    category: 'exercise',
    progress: 40
  }
];

const challenges = [
  {
    id: 1,
    title: "Weekly Wellness",
    description: "Complete 5 exercises this week",
    reward: 100,
    progress: 60,
    daysLeft: 3,
    type: "weekly"
  },
  {
    id: 2,
    title: "Mindful March",
    description: "Journal daily for 7 consecutive days",
    reward: 150,
    progress: 28,
    daysLeft: 5,
    type: "challenge"
  },
  {
    id: 3,
    title: "Habit Hero",
    description: "Complete all daily habits for 5 days",
    reward: 200,
    progress: 80,
    daysLeft: 1,
    type: "habit"
  }
];

export default function Rewards() {
  const { t } = useTranslation();

  const earnedBadges = badges.filter(badge => badge.earned);
  const availableBadges = badges.filter(badge => !badge.earned);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-energy rounded-full flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('nav.rewards')}</h1>
            <p className="text-muted-foreground">Celebrate your wellness journey achievements</p>
          </div>
        </div>
      </motion.div>

      {/* XP Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Your XP Balance</h2>
                <p className="text-muted-foreground">Keep earning to unlock more rewards!</p>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-8 h-8 text-primary animate-pulse" />
                <span className="text-3xl font-bold text-primary">1,250</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-lg font-bold text-secondary">+50</div>
                <div className="text-xs text-muted-foreground">Today's XP</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-lg font-bold text-accent">+320</div>
                <div className="text-xs text-muted-foreground">This Week</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-lg font-bold text-primary">Level 8</div>
                <div className="text-xs text-muted-foreground">Current Level</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <span>Active Challenges</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {challenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="border border-border/20 rounded-lg p-4 hover:shadow-medium transition-all duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-foreground">{challenge.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {challenge.daysLeft}d left
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Gift className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{challenge.reward} XP</span>
                      </div>
                      {challenge.progress === 100 ? (
                        <Button size="sm" className="bg-green-500 text-white">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Claim
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Badges Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earned Badges */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span>Earned Badges ({earnedBadges.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {earnedBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, rotate: -10 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-gradient-primary p-4 rounded-lg text-white text-center hover:shadow-glow transition-all duration-300"
                  >
                    <div className="text-2xl mb-2">{badge.icon}</div>
                    <h4 className="font-medium text-sm">{badge.name}</h4>
                    <p className="text-xs opacity-90 mt-1">{badge.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Available Badges */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-muted-foreground" />
                <span>Available Badges</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center space-x-3 p-3 border border-border/20 rounded-lg hover:bg-muted/30 transition-all duration-200"
                  >
                    <div className="text-2xl grayscale">{badge.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-muted-foreground">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                      {badge.progress && (
                        <div className="mt-2">
                          <Progress value={badge.progress} className="h-1" />
                          <span className="text-xs text-muted-foreground">{badge.progress}%</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{badge.xpRequired}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}