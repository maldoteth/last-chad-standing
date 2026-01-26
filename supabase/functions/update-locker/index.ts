import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        )

        const { id, updates } = await req.json()

        if (!id) throw new Error('Item ID is required')

        const { data, error } = await supabaseAdmin
            .from('Locker')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return new Response(
            JSON.stringify({ success: true, data }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(
            JSON.stringify({ success: false, error: errorMessage }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
