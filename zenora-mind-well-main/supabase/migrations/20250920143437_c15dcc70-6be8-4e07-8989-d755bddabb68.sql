-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi', 'te')),
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create journal entries table
CREATE TABLE public.journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  mood TEXT CHECK (mood IN ('great', 'good', 'okay', 'low', 'difficult')),
  tags TEXT[],
  encrypted_content TEXT, -- For sensitive content
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat sessions table
CREATE TABLE public.chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  encrypted_content TEXT,
  emotion_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create mood tracking table
CREATE TABLE public.mood_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood TEXT NOT NULL CHECK (mood IN ('great', 'good', 'okay', 'low', 'difficult')),
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 5),
  notes TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create habits table
CREATE TABLE public.habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  xp_reward INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create habit completions table
CREATE TABLE public.habit_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completion_date DATE DEFAULT CURRENT_DATE,
  xp_earned INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(habit_id, user_id, completion_date)
);

-- Create exercises table
CREATE TABLE public.exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('breathing', 'meditation', 'mindfulness', 'gratitude')),
  duration_minutes INTEGER,
  instructions JSONB,
  xp_reward INTEGER DEFAULT 15,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user exercise completions
CREATE TABLE public.exercise_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_completed INTEGER,
  xp_earned INTEGER DEFAULT 15,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create rewards and badges table
CREATE TABLE public.rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  badge_icon TEXT,
  xp_required INTEGER DEFAULT 100,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user rewards (earned badges)
CREATE TABLE public.user_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, reward_id)
);

-- Create XP transactions table
CREATE TABLE public.xp_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('journal', 'chat', 'exercise', 'habit', 'streak', 'bonus')),
  source_id UUID,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user settings table
CREATE TABLE public.user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  notifications_enabled BOOLEAN DEFAULT true,
  voice_enabled BOOLEAN DEFAULT true,
  preferred_voice TEXT DEFAULT 'en-US',
  speech_rate DECIMAL DEFAULT 1.0,
  theme_preference TEXT DEFAULT 'system' CHECK (theme_preference IN ('light', 'dark', 'system')),
  privacy_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for journal entries
CREATE POLICY "Users can view their own journal entries" ON public.journal_entries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own journal entries" ON public.journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own journal entries" ON public.journal_entries
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own journal entries" ON public.journal_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for chat sessions
CREATE POLICY "Users can view their own chat sessions" ON public.chat_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own chat sessions" ON public.chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own chat sessions" ON public.chat_sessions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own chat sessions" ON public.chat_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for chat messages
CREATE POLICY "Users can view their own chat messages" ON public.chat_messages
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own chat messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for mood entries
CREATE POLICY "Users can view their own mood entries" ON public.mood_entries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own mood entries" ON public.mood_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own mood entries" ON public.mood_entries
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own mood entries" ON public.mood_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for habits
CREATE POLICY "Users can view their own habits" ON public.habits
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own habits" ON public.habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habits" ON public.habits
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habits" ON public.habits
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for habit completions
CREATE POLICY "Users can view their own habit completions" ON public.habit_completions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own habit completions" ON public.habit_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for exercises (public read, no user modification)
CREATE POLICY "Anyone can view exercises" ON public.exercises
  FOR SELECT USING (true);

-- Create RLS policies for exercise completions
CREATE POLICY "Users can view their own exercise completions" ON public.exercise_completions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own exercise completions" ON public.exercise_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for rewards (public read)
CREATE POLICY "Anyone can view rewards" ON public.rewards
  FOR SELECT USING (true);

-- Create RLS policies for user rewards
CREATE POLICY "Users can view their own rewards" ON public.user_rewards
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can earn rewards" ON public.user_rewards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for XP transactions
CREATE POLICY "Users can view their own XP transactions" ON public.xp_transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create XP transactions" ON public.xp_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user settings
CREATE POLICY "Users can view their own settings" ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own settings" ON public.user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to automatically create profile and settings on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON public.chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_habits_updated_at
  BEFORE UPDATE ON public.habits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default exercises
INSERT INTO public.exercises (name, description, category, duration_minutes, instructions, xp_reward) VALUES
('Box Breathing', 'A calming breathing technique using a 4-4-4-4 pattern', 'breathing', 5, '{"steps": ["Breathe in for 4 counts", "Hold for 4 counts", "Breathe out for 4 counts", "Hold for 4 counts", "Repeat"]}', 15),
('Progressive Muscle Relaxation', 'Systematic tensing and relaxing of muscle groups', 'meditation', 10, '{"steps": ["Start with your toes", "Tense for 5 seconds", "Relax completely", "Move up through each muscle group"]}', 25),
('Mindful Observation', 'Focus on observing your surroundings without judgment', 'mindfulness', 8, '{"steps": ["Find a comfortable position", "Choose an object to focus on", "Observe without labeling", "Notice thoughts and let them pass"]}', 20),
('Gratitude Practice', 'Reflect on three things you are grateful for today', 'gratitude', 5, '{"steps": ["Think of 3 specific things", "Consider why you are grateful", "Feel the emotion of gratitude", "Write them down if possible"]}', 15);

-- Insert default rewards/badges
INSERT INTO public.rewards (name, description, badge_icon, xp_required, category) VALUES
('First Steps', 'Complete your first journal entry', '🌱', 0, 'journal'),
('Mindful Beginner', 'Complete your first meditation exercise', '🧘', 25, 'exercise'),
('Streak Starter', 'Maintain a 3-day habit streak', '🔥', 50, 'habit'),
('Conversationalist', 'Have your first chat with Zenora', '💬', 15, 'chat'),
('Wellness Warrior', 'Earn 500 XP total', '⚡', 500, 'xp'),
('Consistent Creator', 'Journal for 7 consecutive days', '📝', 100, 'journal'),
('Breathing Expert', 'Complete 10 breathing exercises', '🫁', 150, 'exercise'),
('Mood Master', 'Track your mood for 14 consecutive days', '😊', 200, 'mood');