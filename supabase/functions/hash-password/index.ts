import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const password = "admin42069"
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    
    console.log('Password:', password)
    console.log('Hash:', hashedPassword)
    
    // Test the hash
    const isValid = await bcrypt.compare(password, hashedPassword)
    console.log('Verification test:', isValid)

    return new Response(
      JSON.stringify({ 
        password,
        hash: hashedPassword,
        verified: isValid
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})