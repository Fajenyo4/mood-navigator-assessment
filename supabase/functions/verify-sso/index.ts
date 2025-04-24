
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
    if (!supabaseServiceKey) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 500 
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
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
    
    console.log("Processing SSO for email:", email, "name:", name);
    
    try {
      // First, try to find if the user exists
      let userData;
      try {
        const { data, error } = await supabase.auth.admin.getUserByEmail(email);
        if (error) {
          console.log("Error fetching user by email:", error.message);
          // Don't throw here, we'll create the user if not found
        }
        userData = data;
      } catch (userFetchError) {
        console.log("Exception when fetching user:", userFetchError.message);
        // Continue with user creation
      }
      
      let userId;
      
      if (!userData || !userData.user) {
        // User doesn't exist, create them
        console.log("Creating new user:", email);
        try {
          const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email,
            email_confirm: true,
            user_metadata: { name: name || email.split('@')[0] },
          });
          
          if (createError) {
            console.error("Error creating user:", createError);
            return new Response(
              JSON.stringify({ error: `Failed to create user: ${createError.message}` }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
            );
          }
          
          if (!newUser || !newUser.user) {
            console.error("User creation returned no user data");
            return new Response(
              JSON.stringify({ error: "Failed to create user: No user data returned" }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
            );
          }
          
          userId = newUser.user.id;
        } catch (createUserError) {
          console.error("Exception during user creation:", createUserError);
          return new Response(
            JSON.stringify({ error: `Exception creating user: ${createUserError.message}` }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }
      } else {
        userId = userData.user.id;
        console.log("Found existing user with ID:", userId);
      }
      
      // Create a session directly
      let sessionData;
      try {
        const { data: session, error: sessionError } = await supabase.auth.admin.createSession({
          userId: userId,
        });
        
        if (sessionError) {
          console.error("Session creation error:", sessionError);
          return new Response(
            JSON.stringify({ error: `Failed to create session: ${sessionError.message}` }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }
        
        if (!session) {
          console.error("No session data returned");
          return new Response(
            JSON.stringify({ error: "Failed to create session: No session data returned" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }
        
        sessionData = session;
      } catch (sessionCreateError) {
        console.error("Exception during session creation:", sessionCreateError);
        return new Response(
          JSON.stringify({ error: `Exception creating session: ${sessionCreateError.message}` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      console.log("Authentication successful for:", email);
      return new Response(
        JSON.stringify({ session: sessionData, success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
      
    } catch (authError) {
      console.error("Authentication error:", authError);
      return new Response(
        JSON.stringify({ error: `Authentication failed: ${authError.message}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
  } catch (error) {
    console.error("Unhandled error in SSO function:", error);
    return new Response(
      JSON.stringify({ error: `Authentication failed: ${error.message}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
