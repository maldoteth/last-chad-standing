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

        const data = await req.json()
        const { name, description, image, rarity, category } = data

        // 1. Create metadata JSON
        const metadata = {
            name: name,
            description: description,
            image: image,
            attributes: [
                { trait_type: "Rarity", value: rarity },
                { trait_type: "Category", value: category }
            ]
        }

        // 2. Upload to Supabase Storage
        const folderName = `item-${Date.now()}`
        const fileName = `${folderName}/1`
        const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' })

        const { error: uploadError } = await supabaseClient.storage
            .from('items')
            .upload(fileName, blob)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabaseClient.storage
            .from('items')
            .getPublicUrl(fileName)

        const baseURI = publicUrl.replace("/1", "/")

        return new Response(
            JSON.stringify({
                success: true,
                gatewayUrl: publicUrl,
                ipfsHash: folderName,
                local_folder_url: publicUrl,
                baseURI: baseURI,
                symbol: name.substring(0, 3).toUpperCase(),
                name: name
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        return new Response(
            JSON.stringify({ success: false, error: errorMessage }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
})
