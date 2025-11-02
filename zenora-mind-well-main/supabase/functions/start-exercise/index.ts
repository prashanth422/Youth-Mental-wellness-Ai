import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { exerciseName, duration, xp, userId } = await req.json();
    
    console.log('Starting exercise:', { exerciseName, duration, xp, userId });

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Record exercise session
    const sessionData = {
      user_id: userId,
      exercise_name: exerciseName,
      duration_minutes: duration,
      xp_earned: xp,
      started_at: new Date().toISOString(),
      status: 'started'
    };

    const { data, error } = await supabase
      .from('exercise_sessions')
      .insert(sessionData)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Exercise session created:', data);

    return new Response(JSON.stringify({ 
      success: true, 
      sessionId: data.id,
      message: `Started ${exerciseName} exercise!`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error starting exercise:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});