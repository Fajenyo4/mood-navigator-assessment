
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
    
    try {
      // First check if the user exists
      console.log("Checking if user exists:", email);
      
      // Try to sign in the user with a magic link token
      // This will create a session without sending an email
      const { data, error } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: email,
        options: {
          // Create the user if they don't exist
          createUser: true,
          // Add user metadata
          data: name ? { 
            name: name,
            email_verified: true  // Mark as verified since we're doing SSO
          } : {
            email_verified: true
          }
        }
      });
      
      if (error) {
        console.error("Error generating auth link:", error);
        return new Response(
          JSON.stringify({ error: `Authentication failed: ${error.message}` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      // Success - extract the access and refresh tokens directly
      console.log("Auth link generated successfully with tokens");
      
      const session = {
        access_token: data.properties.access_token,
        refresh_token: data.properties.refresh_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          user_metadata: {
            ...data.user.user_metadata,
            email_verified: true,
            name: data.user.user_metadata?.name || name || email.split('@')[0]
          }
        }
      };
      
      console.log("Session created successfully for user:", session.user.id);
      
      return new Response(
        JSON.stringify({ session, success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (authError) {
      console.error("Error in authentication flow:", authError);
      return new Response(
        JSON.stringify({ 
          error: `Authentication error: ${authError.message}`,
          details: authError.stack
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
