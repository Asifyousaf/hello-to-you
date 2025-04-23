
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';

interface EmailRequest {
  email: string;
  name: string;
  fitness_goal: string | null;
  fitness_level: string | null;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { email, name, fitness_goal, fitness_level }: EmailRequest = await req.json();

    // In a real application, you would integrate with an email service like Resend, SendGrid, etc.
    // For this example, we'll just log the email that would be sent
    console.log(`
      Sending welcome email to: ${email}
      Subject: Welcome to Fitness Tracker!
      
      Email Content:
      Hi ${name},
      
      Welcome to Fitness Tracker! We're excited to have you join our community.
      
      Your profile has been set up with:
      - Fitness Goal: ${fitness_goal || 'Not set yet'}
      - Fitness Level: ${fitness_level || 'Not set yet'}
      
      Get started by exploring workouts that match your fitness level and goals.
      
      Stay active!
      The Fitness Tracker Team
    `);

    return new Response(
      JSON.stringify({ success: true, message: "Email would be sent" }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 500,
      }
    );
  }
};

serve(handler);
