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
  Loader2
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

export default function Zenora() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Zenora, your AI wellness companion. How are you feeling today? I'm here to listen and support you on your mental health journey.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
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

  // Update input when speech recognition produces transcript
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Auto-scroll to bottom when new message is added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

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

      // Handle crisis detection
      if (data.isCrisis) {
        toast.error("⚠️ Crisis Support Available", {
          description: "Please reach out to a helpline immediately. You're not alone.",
          duration: 10000,
        });
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);

      // Show emotion insight
      if (data.emotionAnalysis && data.emotionAnalysis.intensity >= 7) {
        toast("💚 I'm here for you", {
          description: `I sense you're feeling ${data.emotionAnalysis.emotions.join(', ')}. Take your time.`,
          duration: 5000,
        });
      }

      // Auto-speak the response if TTS is enabled
      setTimeout(() => {
        if ('speechSynthesis' in window) {
          speak(aiResponse.content);
        }
      }, 300);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
      toast.error('Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove the getZenoraResponse function as we're now using real AI

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleTTSToggle = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'assistant') {
        speak(lastMessage.content);
      }
    }
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
            <h1 className="text-2xl font-bold text-foreground">{t('zenora.title')}</h1>
            <p className="text-muted-foreground">Your AI wellness companion</p>
          </div>
        </div>
      </motion.div>

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
                  className={`${isListening ? 'bg-primary text-white' : ''}`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleTTSToggle}
                className={`${isSpeaking ? 'bg-primary text-white' : ''}`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea 
            className="flex-1 p-6" 
            ref={scrollAreaRef}
          >
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback 
                      className={`${
                        message.role === 'user' 
                          ? 'bg-secondary text-white' 
                          : 'bg-primary text-white'
                      }`}
                    >
                      {message.role === 'user' ? 'U' : 'Z'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-white ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
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
                    <AvatarFallback className="bg-primary text-white">Z</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-6 border-t border-border/20">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t('zenora.placeholder')}
                className="flex-1 focus-ring"
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
    </div>
  );
}