
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the email and token from the request
    const { email, token } = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log("Verifying access for email:", email);
    
    // Validate the token (simple validation in this implementation)
    // In a real implementation, we'd do more robust validation
    try {
      const decoded = atob(token);
      const [tokenEmail, timestamp] = decoded.split(':');
      
      // Verify email matches
      if (tokenEmail !== email) {
        return new Response(
          JSON.stringify({ error: "Invalid token" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
        );
      }
      
      // Verify token is not expired (24 hours)
      const parsedTimestamp = parseInt(timestamp);
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if ((now - parsedTimestamp) > maxAge) {
        return new Response(
          JSON.stringify({ error: "Token expired" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
        );
      }
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Invalid token format" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    
    // If validation passes, create a Supabase session
    const { data, error } = await fetch(
      `https://thvtgvvwksbxywhdnwcv.supabase.co/auth/v1/magiclink/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRodnRndnZ3a3NieHl3aGRud2N2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDgxNDEzMiwiZXhwIjoyMDYwMzkwMTMyfQ.zt2-qgy-uhd_Wx3n-K9MvfGBVCelzRM_iKPb1CVYVk4",
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRodnRndnZ3a3NieHl3aGRud2N2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDgxNDEzMiwiZXhwIjoyMDYwMzkwMTMyfQ.zt2-qgy-uhd_Wx3n-K9MvfGBVCelzRM_iKPb1CVYVk4`
        },
        body: JSON.stringify({ email, create_user: true })
      }
    ).then(res => res.json());

    if (error) {
      console.error("Authentication error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to authenticate" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    console.log("Authentication successful for:", email);

    // Return the session data
    return new Response(
      JSON.stringify({ session: data, success: true }),
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
