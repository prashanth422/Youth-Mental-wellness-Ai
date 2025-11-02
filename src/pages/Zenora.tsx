import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Brain,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageCircle,
  Loader2,
  Trash2
} from 'lucide-react';
import { useVoice } from '@/hooks/useVoice';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface MoodData {
  moodScore: number;
  todayMood: string;
  motivation: string[];
}

export default function Zenora() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hello! I'm Zenora, your AI wellness companion. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 🌈 Mood tracker state
  const [moodData, setMoodData] = useState<MoodData>({
    moodScore: 75,
    todayMood: '😊 Happy',
    motivation: [
      'Keep growing every day!',
      "You're stronger than you think.",
      'Small steps make a big difference.'
    ]
  });
  const [newMotivation, setNewMotivation] = useState('');

  const {
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isSupported
  } = useVoice();

  // 🧠 Load saved mood data
  useEffect(() => {
    const saved = localStorage.getItem('zenora-mood');
    if (saved) setMoodData(JSON.parse(saved));
  }, []);

  // 💾 Save mood data when it changes
  useEffect(() => {
    localStorage.setItem('zenora-mood', JSON.stringify(moodData));
  }, [moodData]);

  // 🎤 Speech input sync
  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  // 📜 Auto scroll
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // 🧠 Local sentiment detection
  const analyzeLocalMood = (message: string) => {
    const lower = message.toLowerCase();
    if (lower.includes('sad') || lower.includes('tired') || lower.includes('upset'))
      return { emoji: '😔', mood: 'Sad', score: 45 };
    if (lower.includes('angry') || lower.includes('mad'))
      return { emoji: '😡', mood: 'Angry', score: 35 };
    if (lower.includes('happy') || lower.includes('great') || lower.includes('good'))
      return { emoji: '😊', mood: 'Happy', score: 85 };
    if (lower.includes('anxious') || lower.includes('worried'))
      return { emoji: '😰', mood: 'Anxious', score: 55 };
    if (lower.includes('relax') || lower.includes('calm'))
      return { emoji: '😌', mood: 'Calm', score: 80 };
    return { emoji: '🙂', mood: 'Neutral', score: 70 };
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // 🌤️ Update mood instantly from user message
    const localMood = analyzeLocalMood(userMessage.content);
    setMoodData(prev => ({
      ...prev,
      moodScore: localMood.score,
      todayMood: `${localMood.emoji} ${localMood.mood}`
    }));

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: userMessage.content,
          userId: user?.id,
          context: messages.slice(-5).map(m => ({ role: m.role, content: m.content }))
        }
      });

      if (error) throw error;

      if (data.isCrisis) {
        toast.error('⚠️ Crisis Support Available', {
          description: 'Please reach out to a helpline immediately.',
          duration: 10000
        });
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);

      // 💬 Mood auto update from AI emotion (Supabase)
      if (data.emotionAnalysis) {
        const emotion = data.emotionAnalysis.emotions[0] || 'Calm';
        const intensity = data.emotionAnalysis.intensity;
        const emojiMap: Record<string, string> = {
          happy: '😊',
          calm: '😌',
          sad: '😔',
          angry: '😡',
          anxious: '😰',
          stressed: '😩',
          relaxed: '😴'
        };

        const emoji = emojiMap[emotion.toLowerCase()] || '🙂';
        const newMood = {
          ...moodData,
          moodScore: Math.min(100, Math.max(0, 100 - intensity * 10)),
          todayMood: `${emoji} ${emotion.charAt(0).toUpperCase() + emotion.slice(1)}`
        };
        setMoodData(newMood);
        localStorage.setItem('zenora-mood', JSON.stringify(newMood));
      } else {
        // 🌙 Fallback to local AI mood analysis
        const aiMood = analyzeLocalMood(data.response);
        setMoodData(prev => ({
          ...prev,
          moodScore: aiMood.score,
          todayMood: `${aiMood.emoji} ${aiMood.mood}`
        }));
      }

      // 🗣️ Speak AI reply
      setTimeout(() => {
        if ('speechSynthesis' in window) speak(aiResponse.content);
      }, 300);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            "I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date()
        }
      ]);
      toast.error('Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 🎧 Voice & TTS toggles
  const handleVoiceToggle = () =>
    isListening ? stopListening() : startListening();
  const handleTTSToggle = () => {
    if (isSpeaking) stopSpeaking();
    else {
      const last = messages[messages.length - 1];
      if (last?.role === 'assistant') speak(last.content);
    }
  };

  // 🌻 Motivation functions
  const addMotivation = () => {
    if (!newMotivation.trim()) return;
    const updated = {
      ...moodData,
      motivation: [...moodData.motivation, newMotivation]
    };
    setMoodData(updated);
    setNewMotivation('');
  };

  const deleteMotivation = (i: number) => {
    const updated = {
      ...moodData,
      motivation: moodData.motivation.filter((_, idx) => idx !== i)
    };
    setMoodData(updated);
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t('zenora.title')}
            </h1>
            <p className="text-muted-foreground">
              Your AI wellness companion
            </p>
          </div>
        </div>
      </motion.div>

      {/* Mood Overview */}
      <Card className="mb-4 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-0 shadow-lg">
        <CardContent className="text-center py-4">
          <h2 className="text-xl font-semibold">Today's Mood</h2>
          <p className="text-3xl font-bold">{moodData.todayMood}</p>
          <p className="text-sm mt-1">Mood Score: {moodData.moodScore}</p>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col glass border-border/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <span>Chat with Zenora</span>
            </span>
            <div className="flex space-x-2">
              {isSupported && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVoiceToggle}
                  className={isListening ? 'bg-primary text-white' : ''}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleTTSToggle}
                className={isSpeaking ? 'bg-primary text-white' : ''}
              >
                {isSpeaking ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start space-x-3 ${
                    msg.role === 'user'
                      ? 'flex-row-reverse space-x-reverse'
                      : ''
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback
                      className={
                        msg.role === 'user'
                          ? 'bg-secondary text-white'
                          : 'bg-primary text-white'
                      }
                    >
                      {msg.role === 'user' ? 'U' : 'Z'}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-primary text-white ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start space-x-3"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-white">
                      Z
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          <div className="p-6 border-t border-border/20">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                placeholder={t('zenora.placeholder')}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-primary hover:opacity-90 text-white shadow-glow"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            {isListening && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-primary mt-2 flex items-center space-x-2"
              >
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>{t('zenora.listening')}</span>
              </motion.p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Motivation Section */}
      <Card className="mt-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-0 shadow-lg">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Motivational Notes</h2>
          <div className="space-y-2">
            {moodData.motivation.map((m, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-white/10 p-2 rounded-md"
              >
                <span>{m}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMotivation(i)}
                  className="text-red-500"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex mt-3 gap-2">
            <Input
              placeholder="Add a motivational note..."
              value={newMotivation}
              onChange={e => setNewMotivation(e.target.value)}
            />
            <Button onClick={addMotivation}>Add</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
