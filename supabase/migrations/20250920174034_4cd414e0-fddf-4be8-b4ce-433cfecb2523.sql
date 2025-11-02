-- Create exercise_sessions table for tracking user exercise sessions
CREATE TABLE IF NOT EXISTS public.exercise_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  exercise_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'breathing',
  duration_minutes INTEGER NOT NULL DEFAULT 5,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.exercise_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for exercise_sessions
CREATE POLICY "Users can view their own exercise sessions" 
ON public.exercise_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exercise sessions" 
ON public.exercise_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise sessions" 
ON public.exercise_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_exercise_sessions_updated_at
BEFORE UPDATE ON public.exercise_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_exercise_sessions_user_id ON public.exercise_sessions(user_id);
CREATE INDEX idx_exercise_sessions_status ON public.exercise_sessions(status);
CREATE INDEX idx_exercise_sessions_created_at ON public.exercise_sessions(created_at);