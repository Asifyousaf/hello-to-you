
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { data } = await req.json();
    const { user_id, user_email, user_name } = data;

    if (!user_id || !user_email) {
      return new Response(
        JSON.stringify({ error: "User ID and email are required" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // In a real implementation, you would use an email service like SendGrid,
    // Mailgun, Resend, etc. Here we'll just log the email details
    console.log(`
      Sending welcome email to: ${user_email}
      Subject: Welcome to FitTrack!
      
      Body:
      Hi ${user_name || "there"},
      
      Welcome to FitTrack! We're excited to have you join our community.
      
      Here's what you can do now:
      - Complete your profile
      - Start tracking your workouts
      - Explore our nutrition plans
      - Connect with the fitness community
      
      Let's achieve your fitness goals together!
      
      Best,
      The FitTrack Team
    `);

    // Log the welcome email operation to a Supabase table (optional)
    const { error: logError } = await supabaseClient
      .from("email_logs")
      .insert({
        user_id,
        email_type: "welcome",
        recipient: user_email,
        status: "sent",
        timestamp: new Date().toISOString(),
      });

    if (logError) {
      console.error("Error logging email:", logError);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Welcome email sent" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send welcome email" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
