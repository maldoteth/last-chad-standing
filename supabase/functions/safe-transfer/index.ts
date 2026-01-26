import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { ethers } from "https://esm.sh/ethers@6.10.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ABI = [
    "function safeTransferFrom(address from, address to, uint256 tokenId) public",
];

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { WALLET_ID, RECIPIENT, NFT_CONTRACT, TOKEN_ID } = await req.json();

        if (!NFT_CONTRACT || !RECIPIENT || !TOKEN_ID) {
            throw new Error("Missing parameters");
        }

        const RPC_URL = "https://mainnet.base.org";
        const PRIVATE_KEY = Deno.env.get("ADMIN_PRIVATE_KEY");

        if (!PRIVATE_KEY) {
            throw new Error("ADMIN_PRIVATE_KEY is not set in environment");
        }

        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        const contract = new ethers.Contract(NFT_CONTRACT, ABI, wallet);

        console.log(`🚀 Transferring NFT ${TOKEN_ID} on ${NFT_CONTRACT} to ${RECIPIENT}...`);

        // The system wallet must be the owner or approved for this token
        // In this project, the system wallet usually holds the NFTs for marketplace trades 
        // or handles the transfer if it has operator permissions.
        const fromAddress = wallet.address;

        // Execute Transfer
        const tx = await contract.safeTransferFrom(fromAddress, RECIPIENT, TOKEN_ID);
        const receipt = await tx.wait();

        console.log("✅ Transfer Successful:", receipt.hash);

        return new Response(JSON.stringify({ txHash: { hash: receipt.hash } }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("❌ Transfer Error:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});
