
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
    
    console.log("Verifying SSO for email:", email);
    
    // Generate user metadata with name if provided
    const userMetadata = name ? { name } : {};
    
    let userId;
    
    try {
      // First check if the user already exists
      const { data: existingUser, error: userError } = await supabase
        .from('auth.users')
        .select('id, email')
        .eq('email', email)
        .single();
      
      // If user doesn't exist, create one without sending email
      if (!existingUser && (!userError || userError.code === 'PGRST116')) { // Not found error is expected
        console.log("User not found, creating new user:", email);
        
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email,
          email_confirm: true, // Auto confirm the email
          user_metadata: userMetadata,
        });
        
        if (createError) {
          console.error("Error creating user:", createError);
          return new Response(
            JSON.stringify({ error: "Failed to create user: " + createError.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }
        
        userId = newUser.user.id;
        console.log("Created new user:", userId);
      } else if (userError && userError.code !== 'PGRST116') { // Handle unexpected errors
        console.error("Error checking for existing user:", userError);
        return new Response(
          JSON.stringify({ error: "Failed to check for existing user: " + userError.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      } else { // User exists
        userId = existingUser?.id;
        console.log("Found existing user:", userId);
      }
      
      // Create a session for the user
      const { data: session, error: sessionError } = await supabase.auth.admin.createSession({
        userId: userId,
      });

      if (sessionError) {
        console.error("Session creation error:", sessionError);
        return new Response(
          JSON.stringify({ error: "Failed to create session: " + sessionError.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }

      if (!session) {
        console.error("No session data returned");
        return new Response(
          JSON.stringify({ error: "No session data returned from authentication service" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }

      console.log("Authentication successful for:", email);

      // Return the session data
      return new Response(
        JSON.stringify({ session, success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
      
    } catch (dbError) {
      console.error("Database operation error:", dbError);
      return new Response(
        JSON.stringify({ error: "Database operation failed: " + dbError.message }),
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
