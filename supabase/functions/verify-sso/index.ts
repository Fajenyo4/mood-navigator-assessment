
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = 'https://thvtgvvwksbxywhdnwcv.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Always use the production domain for redirects
const PRODUCTION_DOMAIN = 'https://mood-navigator-assessment.lovable.app';

// Helper function to get the correct redirect URL based on language
function getRedirectUrl(lang = 'en') {
  // Normalize language code
  let langPath = 'en';
  if (lang === 'zh-cn') langPath = 'zh-cn';
  else if (lang === 'zh-hk' || lang === 'zh-tw') langPath = 'zh-hk';
  
  return `${PRODUCTION_DOMAIN}/${langPath}`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("SSO verification function started");
    
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
    
    const { email, token, name, lang = 'en' } = requestData;
    
    if (!email) {
      console.error("Missing required email parameter");
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Get the correct redirect URL based on language
    const finalRedirectUrl = getRedirectUrl(lang);
    console.log("Using redirect URL:", finalRedirectUrl);
    
    // Initialize Supabase admin client
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
    
    try {
      // Check if user exists
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
      
      let userId;
      if (existingUsers?.users && existingUsers.users.length > 0) {
        userId = existingUsers.users[0].id;
      } else {
        // Create user if not exists
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
        
        userId = newUser.user.id;
      }
      
      // Generate sign-in link with the language-specific redirect URL
      const options = {
        redirectTo: finalRedirectUrl,
        shouldCreateUser: false
      };
      
      console.log("Generating sign-in link with options:", JSON.stringify(options));
      
      const { data: signInData, error: signInError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: email,
        options: options
      });
      
      if (signInError) {
        console.error("Error generating sign-in link:", signInError);
        return new Response(
          JSON.stringify({ error: `Sign-in link generation failed: ${signInError.message}` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
      
      // Extract and verify the magic link
      let magicLink = signInData.properties.action_link;
      
      // Double-check the magic link and ensure it uses the production domain
      try {
        const magicLinkUrl = new URL(magicLink);
        const redirectParam = magicLinkUrl.searchParams.get('redirect_to');
        
        if (redirectParam) {
          if (redirectParam.includes('localhost') || !redirectParam.includes(PRODUCTION_DOMAIN)) {
            magicLinkUrl.searchParams.set('redirect_to', finalRedirectUrl);
            magicLink = magicLinkUrl.toString();
          }
        }
      } catch (urlError) {
        console.error("Error processing magic link URL:", urlError);
      }
      
      return new Response(
        JSON.stringify({ 
          magicLink: magicLink,
          success: true,
          redirectUrl: finalRedirectUrl
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
