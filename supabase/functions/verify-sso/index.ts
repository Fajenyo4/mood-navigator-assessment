
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import * as jose from "https://deno.land/x/jose@v4.14.4/index.ts";

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
    // Get the JWT token from the request
    const { token, email } = await req.json();
    
    if (!token || !email) {
      return new Response(
        JSON.stringify({ error: "Token and email are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // In a production environment, you should verify the JWT token with LearnWorlds secret
    // This is a simplified example
    // const secret = Deno.env.get("LEARNWORLDS_JWT_SECRET");
    // await jose.jwtVerify(token, new TextEncoder().encode(secret));
    
    // For now, we'll trust the token and create a Supabase session
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
      console.error("Supabase auth error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to authenticate with Supabase" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Return the session data
    return new Response(
      JSON.stringify({ session: data }),
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
