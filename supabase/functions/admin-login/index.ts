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
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        )

        const { email, privy_id, walletAddress } = await req.json()

        // 1. Find admin user by any of these identifiers
        let query = supabaseClient.from('AdminUsers').select('*')

        if (email) {
            query = query.eq('email', email)
        } else if (walletAddress) {
            query = query.eq('wallet', walletAddress)
        } else if (privy_id) {
            query = query.eq('privy_id', privy_id)
        } else {
            throw new Error('No identifier provided')
        }

        const { data: admin, error } = await query.single()

        if (error || !admin) {
            return new Response(
                JSON.stringify({ success: false, message: 'Admin access denied' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
            )
        }

        // 2. Return admin data with a fake token for compatibility
        return new Response(
            JSON.stringify({
                success: true,
                admin: {
                    id: admin.id,
                    email: admin.email,
                    quorumId: admin.quorumId,
                    isSigner: admin.isSigner,
                },
                token: 'supabase-admin-token-' + Math.random().toString(36).substring(7)
            }),
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
