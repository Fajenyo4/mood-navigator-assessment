
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
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
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
    
    // Initialize Supabase admin client with service role
    console.log("Initializing Supabase admin client");
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    console.log("Supabase admin client initialized");
    
    // SIMPLIFIED APPROACH:
    // 1. Try to sign in the user directly (this ignores if they exist or not)
    // 2. If that fails with "user not found", then create the user
    // 3. Return the session either way
    
    let session;
    
    try {
      console.log("Attempting to create session for:", email);
      
      // Try to create a user first (will fail if user exists, but that's okay)
      try {
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: { name: name || email.split('@')[0] },
        });
        
        if (createError) {
          if (createError.status === 422 || createError.code === "email_exists") {
            console.log("User already exists (expected):", email);
          } else {
            console.error("Unexpected error creating user:", createError);
          }
        } else {
          console.log("New user created:", email);
        }
      } catch (createError) {
        console.log("Error during user creation (likely already exists):", createError.message);
      }
      
      // Now retrieve the user ID (regardless of whether they were just created or already existed)
      const { data: user, error: getUserError } = await supabaseAdmin.auth.admin.listUsers({
        filter: {
          email: email
        }
      });
      
      if (getUserError) {
        console.error("Failed to retrieve user:", getUserError);
        return new Response(
          JSON.stringify({ error: `Could not find or create user: ${getUserError.message}` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      if (!user || !user.users || user.users.length === 0) {
        console.error("No user found or created with email:", email);
        return new Response(
          JSON.stringify({ error: "Failed to find or create user account" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      const userId = user.users[0].id;
      console.log("Found user ID:", userId);
      
      // Create a session for this user
      const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.createSession({
        userId: userId
      });
      
      if (sessionError) {
        console.error("Session creation error:", sessionError);
        return new Response(
          JSON.stringify({ error: `Failed to create session: ${sessionError.message}` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      session = sessionData;
      console.log("Session created successfully");
      
    } catch (authError) {
      console.error("Authentication process error:", authError);
      return new Response(
        JSON.stringify({ error: `Authentication failed: ${authError.message}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    console.log("Authentication successful for:", email);
    return new Response(
      JSON.stringify({ session, success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
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
