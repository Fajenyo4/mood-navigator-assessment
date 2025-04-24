
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
    let requestData;
    try {
      requestData = await req.json();
    } catch (parseError) {
      console.error("Error parsing request JSON:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid request format" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    const { email, token, name } = requestData;
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log("Processing SSO for email:", email);
    
    try {
      // First, try to find if the user exists
      const { data: existingUser, error: fetchError } = await supabase.auth.admin.getUserByEmail(email);
      
      let userId;
      
      if (!existingUser || fetchError) {
        // User doesn't exist, create them
        console.log("Creating new user:", email);
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: { name },
        });
        
        if (createError) {
          console.error("Error creating user:", createError);
          throw new Error("Failed to create user: " + createError.message);
        }
        
        userId = newUser.user.id;
      } else {
        userId = existingUser.user.id;
      }
      
      // Create a session directly
      const { data: session, error: sessionError } = await supabase.auth.admin.createSession({
        userId: userId,
      });
      
      if (sessionError) {
        console.error("Session creation error:", sessionError);
        throw new Error("Failed to create session");
      }
      
      console.log("Authentication successful for:", email);
      return new Response(
        JSON.stringify({ session, success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
      
    } catch (authError) {
      console.error("Authentication error:", authError);
      return new Response(
        JSON.stringify({ error: "Authentication failed: " + authError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
  } catch (error) {
    console.error("Unhandled error in SSO function:", error);
    return new Response(
      JSON.stringify({ error: "Authentication failed: " + error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
