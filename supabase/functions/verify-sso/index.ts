
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
    
    const { email, token, name, redirectUrl } = requestData;
    
    if (!email) {
      console.error("Missing required email parameter");
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Get the redirect URL or default to the app domain
    const finalRedirectUrl = redirectUrl || new URL(req.url).origin;
    
    console.log("Processing SSO for email:", email, "name:", name, "redirect:", finalRedirectUrl);
    
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
      // 1. Check if user exists
      console.log("Looking up user by email:", email);
      const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1,
        filter: {
          email: email
        }
      });
      
      if (listError) {
        console.error("Error listing users:", listError);
        return new Response(
          JSON.stringify({ error: `User lookup failed: ${listError.message}` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      console.log("User lookup results:", JSON.stringify(existingUsers));
      
      let userId;
      // Check if user exists
      if (existingUsers && existingUsers.users && existingUsers.users.length > 0) {
        console.log("User exists, using existing user");
        userId = existingUsers.users[0].id;
      } else {
        // 2. Create user if not exists
        console.log("User does not exist, creating new user");
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: email,
          email_confirm: true,
          user_metadata: { 
            name: name || email.split('@')[0],
            email_verified: true
          }
        });
        
        if (createError) {
          console.error("Error creating user:", createError);
          return new Response(
            JSON.stringify({ error: `User creation failed: ${createError.message}` }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
          );
        }
        
        console.log("User created successfully:", newUser.user.id);
        userId = newUser.user.id;
      }
      
      // 3. Generate a sign-in link with magic link
      console.log("Generating sign-in link for user ID:", userId);
      const { data: signInData, error: signInError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: email,
        options: {
          redirectTo: finalRedirectUrl
        }
      });
      
      if (signInError) {
        console.error("Error generating sign-in link:", signInError);
        return new Response(
          JSON.stringify({ error: `Sign-in link generation failed: ${signInError.message}` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      console.log("Sign-in link generated successfully");
      
      // Return the sign-in link to the client
      return new Response(
        JSON.stringify({ 
          magicLink: signInData.properties.action_link,
          success: true 
        }),
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
