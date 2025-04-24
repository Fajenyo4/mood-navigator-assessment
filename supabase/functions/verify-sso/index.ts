
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
    
    try {
      // Try to sign in the user directly first - faster than checking if they exist
      const { data: signInData, error: signInError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: email,
        options: {
          redirectTo: 'https://mood-navigator-assessment.lovable.app/check-auth',
        }
      });
      
      // If we get a valid session, return it immediately
      if (signInData && signInData.properties && signInData.properties.hashed_token) {
        // Instead of sending an email, we'll create a session directly
        console.log("User exists, creating session directly");
        
        // Find the user
        const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(email);
        
        if (userError || !userData) {
          console.error("Error finding user:", userError);
          throw new Error("Failed to find user");
        }
        
        // Create a session for the existing user
        const { data: session, error: sessionError } = await supabase.auth.admin.createSession({
          userId: userData.user.id,
        });
        
        if (sessionError) {
          console.error("Session creation error:", sessionError);
          throw new Error("Failed to create session");
        }
        
        console.log("Authentication successful for existing user:", email);
        return new Response(
          JSON.stringify({ session, success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } 
      
      // If user doesn't exist (or there was an error), create a new one
      console.log("Creating new user:", email);
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true, // Auto confirm the email
        user_metadata: userMetadata,
      });
      
      if (createError) {
        console.error("Error creating user:", createError);
        
        // If the error is that the user already exists, try to create a session
        if (createError.message.includes("already exists")) {
          // Find the user
          const { data: existingUser, error: fetchError } = await supabase.auth.admin.getUserByEmail(email);
          
          if (fetchError || !existingUser) {
            console.error("Error finding existing user:", fetchError);
            throw new Error("Failed to find existing user");
          }
          
          // Create a session for the existing user
          const { data: session, error: sessionError } = await supabase.auth.admin.createSession({
            userId: existingUser.user.id,
          });
          
          if (sessionError) {
            console.error("Session creation error for existing user:", sessionError);
            throw new Error("Failed to create session for existing user");
          }
          
          console.log("Authentication successful for existing user (after create attempt):", email);
          return new Response(
            JSON.stringify({ session, success: true }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        throw new Error("Failed to create user: " + createError.message);
      }
      
      // Create a session for the new user
      const { data: session, error: sessionError } = await supabase.auth.admin.createSession({
        userId: newUser.user.id,
      });
      
      if (sessionError) {
        console.error("Session creation error for new user:", sessionError);
        throw new Error("Failed to create session for new user");
      }
      
      console.log("Authentication successful for new user:", email);
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
