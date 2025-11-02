import { useState, useEffect } from 'react';
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
  Heart,
  Trash2
} from 'lucide-react';

/* Small UI primitives used for dialogs/inputs (assumes shadcn/ui or similar) */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

/**
 * Settings page
 * --- UI unchanged, only wiring up actions for profile/privacy/delete/help dialogs
 */
export default function Settings() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();

  // existing UI states
  const [notifications, setNotifications] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechRate, setSpeechRate] = useState([1.0]);

  // Dialog control states (added)
  const [editOpen, setEditOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [helpOpen, setHelpOpen] = useState(false);
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  // Profile & privacy state — persisted to localStorage so data survives reloads
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: ''
  });

  const [privacy, setPrivacy] = useState({
    shareData: true,
    locationAccess: false
  });

  useEffect(() => {
    // hydrate from localStorage on mount
    try {
      const p = localStorage.getItem('zenora_profile');
      const priv = localStorage.getItem('zenora_privacy');
      if (p) setProfile(JSON.parse(p));
      if (priv) setPrivacy(JSON.parse(priv));
    } catch (e) {
      console.warn('Could not load saved profile/privacy', e);
    }
  }, []);

  // persist profile / privacy when they change
  useEffect(() => {
    try {
      localStorage.setItem('zenora_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('zenora_privacy', JSON.stringify(privacy));
    } catch {}
  }, [privacy]);

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

  // Delete account handler (simulated): clear local storage, show toast, navigate home
  const handleDeleteAccount = () => {
    // perform any backend delete here if required
    try {
      localStorage.clear();
    } catch {}
    setDeleteOpen(false);
    toast({
      title: 'Account deleted',
      description: 'Your local data was cleared. (Implement server-side delete separately.)'
    });
    navigate('/'); // send user to home / onboarding
  };

  // Save profile action (from dialog)
  const saveProfile = () => {
    setEditOpen(false);
    toast({
      title: 'Profile updated',
      description: 'Your changes have been saved locally.'
    });
  };

  // Save privacy action
  const savePrivacy = () => {
    setPrivacyOpen(false);
    toast({
      title: 'Privacy settings saved',
      description: 'Your privacy preferences have been updated.'
    });
  };

  // small helper to open support pages — here we show simple dialogs; you can replace with navigate('/help')
  const openSupportDialog = (type: 'help' | 'privacy' | 'terms') => {
    if (type === 'help') setHelpOpen(true);
    if (type === 'privacy') setPrivacyPolicyOpen(true);
    if (type === 'terms') setTermsOpen(true);
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
              {/* Buttons now open dialogs */}
              <Button variant="outline" className="w-full justify-start" onClick={() => setEditOpen(true)}>
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setPrivacyOpen(true)}>
                <Shield className="w-4 h-4 mr-2" />
                Privacy Settings
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="w-4 h-4 mr-2" />
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
              <Button variant="outline" className="w-full justify-start" onClick={() => openSupportDialog('help')}>
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & FAQ
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => openSupportDialog('privacy')}>
                <Shield className="w-4 h-4 mr-2" />
                Privacy Policy
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => openSupportDialog('terms')}>
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

      {/* ---------------- Dialogs (functionality only, UI unchanged above) ---------------- */}

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div>
              <Label>Name</Label>
              <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => { saveProfile(); }}>Save Changes</Button>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Privacy Settings Dialog */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Privacy Settings</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <span>Share my data for analytics</span>
              <Switch checked={privacy.shareData} onCheckedChange={(v) => setPrivacy({ ...privacy, shareData: v })} />
            </div>
            <div className="flex items-center justify-between">
              <span>Allow location access</span>
              <Switch checked={privacy.locationAccess} onCheckedChange={(v) => setPrivacy({ ...privacy, locationAccess: v })} />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => savePrivacy()}>Save</Button>
            <Button variant="outline" onClick={() => setPrivacyOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Account Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete your account? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleDeleteAccount()}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Help & FAQ Dialog */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Help & FAQ</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm text-muted-foreground">
  <strong>Privacy Policy</strong>
  <ul className="list-disc ml-5 space-y-1">
    <li>
      Your chat messages and personal information are kept confidential and stored securely. We never sell your data to third parties.
    </li>
    <li>
      All data is used only to improve your experience and the quality of the chatbot service.
    </li>
    <li>
      You can request to delete your account and chat history at any time from the settings page.
    </li>
    <li>
      We may use anonymized data for analysis, but no personally identifying information is ever shared.
    </li>
    <li>
      This chatbot is not intended for users under 18 years old. Please seek parental consent if you are a minor.
    </li>
    <li>
      For any questions or requests related to your data, please contact our support team.
    </li>
  </ul>
</div>

          <DialogFooter>
            <Button onClick={() => setHelpOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Dialog */}
      <Dialog open={privacyPolicyOpen} onOpenChange={setPrivacyPolicyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
          </DialogHeader>
         <div className="space-y-3 py-2 text-sm text-muted-foreground">
  <strong>Privacy Policy</strong>
  <ul className="list-disc ml-5 space-y-1">
    <li>
      Your chat messages and personal information are kept confidential and stored securely. We never sell your data to third parties.
    </li>
    <li>
      All data is used only to improve your experience and the quality of the chatbot service.
    </li>
    <li>
      You can request to delete your account and chat history at any time from the settings page.
    </li>
    <li>
      We may use anonymized data for analysis, but no personally identifying information is ever shared.
    </li>
    <li>
      This chatbot is not intended for users under 18 years old. Please seek parental consent if you are a minor.
    </li>
    <li>
      For any questions or requests related to your data, please contact our support team.
    </li>
  </ul>
</div>

          <DialogFooter>
            <Button onClick={() => setPrivacyPolicyOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terms of Service Dialog */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm text-muted-foreground">
  <strong>Terms of Service & Disclaimer</strong>
  <ul className="list-disc ml-5 space-y-1">
    <li>
      This chatbot does <span className="underline">not</span> provide medical advice, treatment, or diagnosis. For urgent help, contact a qualified mental health professional or helpline.
    </li>
    <li>
      Your messages may be stored securely to help improve service quality; your private data will never be shared without your consent.
    </li>
    <li>
      You can request deletion of your chat history at any time from your settings page.
    </li>
    <li>
      Conversations with the chatbot are confidential, but we recommend you avoid sharing personal details such as your full name or address in chat.
    </li>
    <li>
      By using this service, you agree to our privacy policy and understand your data rights.
    </li>
    <li>
      The chatbot may use your feedback to improve responses, but you always have the option to export or remove your data.
    </li>
  </ul>
</div>

          <DialogFooter>
            <Button onClick={() => setTermsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
