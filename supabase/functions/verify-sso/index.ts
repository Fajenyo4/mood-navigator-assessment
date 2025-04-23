
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = 'https://thvtgvvwksbxywhdnwcv.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey || '', {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Get the email from the request
    const { email, token, name } = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log("Verifying SSO for email:", email);
    
    // First check if the user already exists
    const { data: existingUser, error: userError } = await supabase
      .from('auth.users')
      .select('id, email')
      .eq('email', email)
      .single();

    // Generate user metadata with name if provided
    const userMetadata = name ? { name } : {};
    
    let userId;
    
    // If user doesn't exist, create one without sending email
    if (!existingUser && !userError) {
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true, // Auto confirm the email
        user_metadata: userMetadata,
      });
      
      if (createError) {
        console.error("Error creating user:", createError);
        return new Response(
          JSON.stringify({ error: "Failed to create user" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      userId = newUser.user.id;
      console.log("Created new user:", userId);
    } else if (userError && userError.code !== 'PGRST116') { // Not found error is expected
      console.error("Error checking for existing user:", userError);
      return new Response(
        JSON.stringify({ error: "Failed to check for existing user" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    } else {
      userId = existingUser?.id;
      console.log("Found existing user:", userId);
    }
    
    // Create a session for the user
    const { data: session, error: sessionError } = await supabase.auth.admin.createSession({
      userId: userId || existingUser?.id,
    });

    if (sessionError) {
      console.error("Session creation error:", sessionError);
      return new Response(
        JSON.stringify({ error: "Failed to create session" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    console.log("Authentication successful for:", email);

    // Return the session data
    return new Response(
      JSON.stringify({ session, success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
