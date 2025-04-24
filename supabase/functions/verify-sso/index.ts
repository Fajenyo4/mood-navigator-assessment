
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
    console.log("SSO verification function started");
    
    // Initialize Supabase with the service role key
    if (!supabaseServiceKey) {
      console.error("MISSING SUPABASE_SERVICE_ROLE_KEY");
      return new Response(
        JSON.stringify({ error: "Server configuration error: Missing service role key" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 500 
        }
      );
    }

    // Parse request data
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request data parsed:", JSON.stringify(requestData));
    } catch (parseError) {
      console.error("Error parsing request JSON:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid request format", details: parseError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    const { email, token, name } = requestData;
    
    if (!email) {
      console.error("Missing required email parameter");
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log("Processing SSO for email:", email, "name:", name);
    
    try {
      // Initialize Supabase client
      console.log("Initializing Supabase client");
      const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
      
      console.log("Supabase client initialized");
      
      // First, try to find if the user exists
      let userData;
      try {
        console.log("Checking if user exists:", email);
        const { data, error } = await supabase.auth.admin.getUserByEmail(email);
        if (error) {
          console.log("Error fetching user by email:", error.message);
        } else if (data) {
          console.log("User found:", data.user?.id);
          userData = data;
        }
      } catch (userFetchError) {
        console.error("Exception when fetching user:", userFetchError.message);
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
          
          console.log("User creation response:", JSON.stringify(newUser));
          
          if (!newUser || !newUser.user) {
            console.error("User creation returned no user data");
            return new Response(
              JSON.stringify({ error: "Failed to create user: No user data returned" }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
            );
          }
          
          userId = newUser.user.id;
          console.log("New user created with ID:", userId);
        } catch (createUserError) {
          console.error("Exception during user creation:", createUserError);
          return new Response(
            JSON.stringify({ 
              error: `Exception creating user: ${createUserError.message}`,
              stack: createUserError.stack
            }),
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
        console.log("Creating session for user ID:", userId);
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
        
        console.log("Session creation response received");
        
        if (!session) {
          console.error("No session data returned");
          return new Response(
            JSON.stringify({ error: "Failed to create session: No session data returned" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }
        
        sessionData = session;
        console.log("Session created successfully");
      } catch (sessionCreateError) {
        console.error("Exception during session creation:", sessionCreateError);
        return new Response(
          JSON.stringify({ 
            error: `Exception creating session: ${sessionCreateError.message}`,
            stack: sessionCreateError.stack
          }),
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
        JSON.stringify({ 
          error: `Authentication failed: ${authError.message}`,
          stack: authError.stack 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
  } catch (error) {
    console.error("Unhandled error in SSO function:", error);
    return new Response(
      JSON.stringify({ 
        error: `Authentication failed: ${error.message}`,
        stack: error.stack
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
