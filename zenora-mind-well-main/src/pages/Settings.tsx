import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/hooks/useTheme';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Volume2, 
  Bell, 
  Moon, 
  Sun, 
  Monitor,
  User,
  Shield,
  HelpCircle,
  Heart
} from 'lucide-react';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechRate, setSpeechRate] = useState([1.0]);

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  ];

  const themes = [
    { value: 'light', icon: Sun, name: 'Light' },
    { value: 'dark', icon: Moon, name: 'Dark' },
    { value: 'system', icon: Monitor, name: 'System' },
  ];

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('nav.settings')}</h1>
            <p className="text-muted-foreground">Customize your Zenora experience</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language & Accessibility */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-primary" />
                <span>Language & Accessibility</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <Select value={i18n.language} onValueChange={handleLanguageChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center space-x-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Voice Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Voice Features</label>
                    <p className="text-xs text-muted-foreground">
                      Enable speech recognition and text-to-speech
                    </p>
                  </div>
                  <Switch
                    checked={voiceEnabled}
                    onCheckedChange={setVoiceEnabled}
                  />
                </div>

                {voiceEnabled && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Speech Rate</label>
                    <div className="px-3">
                      <Slider
                        value={speechRate}
                        onValueChange={setSpeechRate}
                        min={0.5}
                        max={2.0}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Slow</span>
                        <span>{speechRate[0]}x</span>
                        <span>Fast</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance & Notifications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="w-5 h-5 text-primary" />
                <span>Appearance & Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {themes.map((themeOption) => (
                    <Button
                      key={themeOption.value}
                      variant={theme === themeOption.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme(themeOption.value as 'light' | 'dark' | 'system')}
                      className="flex items-center space-x-2"
                    >
                      <themeOption.icon className="w-4 h-4" />
                      <span>{themeOption.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Push Notifications</label>
                    <p className="text-xs text-muted-foreground">
                      Get reminders for daily wellness activities
                    </p>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>

                {notifications && (
                  <div className="space-y-3 pl-4 border-l-2 border-border/30">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Daily journal reminders</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Exercise suggestions</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mood check-ins</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weekly insights</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <span>Profile Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Privacy Settings
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600">
                <User className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Support & About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                <span>Support & About</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & FAQ
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Privacy Policy
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Terms of Service
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-primary"
                onClick={() => navigate('/wellness-resources')}
              >
                <Heart className="w-4 h-4 mr-2" />
                Wellness Resources
              </Button>
              
              <div className="pt-4 border-t border-border/20">
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium">Zenora v1.0.0</p>
                  <p className="text-xs text-muted-foreground">
                    Your AI-powered wellness companion
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}