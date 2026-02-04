import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { ethers } from "https://esm.sh/ethers@6.10.0";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ABI = [
    "function mint(uint256 quantity) public",
    "function mintTo(address to, uint256 quantity) public",
    "function totalMinted() public view returns (uint256)",
];

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { WALLET_ID, RECIPIENT, NFT_CONTRACT } = await req.json();

        if (!NFT_CONTRACT || !RECIPIENT) {
            throw new Error("Missing parameters");
        }

        // System Wallet configuration
        const RPC_URL = "https://mainnet.base.org"; // Or use environment variable
        const PRIVATE_KEY = Deno.env.get("ADMIN_PRIVATE_KEY");

        if (!PRIVATE_KEY) {
            throw new Error("ADMIN_PRIVATE_KEY is not set in environment");
        }

        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        const contract = new ethers.Contract(NFT_CONTRACT, ABI, wallet);

        const adminAddress = wallet.address;
        const balance = await provider.getBalance(adminAddress);

        console.log(`🚀 Minting NFT on ${NFT_CONTRACT} for ${RECIPIENT}...`);
        console.log(`Admin Wallet: ${adminAddress}, Balance: ${ethers.formatEther(balance)} ETH`);

        try {
            // Execute Mint to recipient's wallet
            const tx = await contract.mintTo(RECIPIENT, 1);
            const receipt = await tx.wait();

            console.log("✅ Mint Successful:", receipt.hash);

            return new Response(JSON.stringify({ mintTx: { hash: receipt.hash } }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });
        } catch (error: any) {
            if (error.code === 'INSUFFICIENT_FUNDS') {
                const errMessage = `Admin wallet (${adminAddress}) has insufficient funds for gas. Balance: ${ethers.formatEther(balance)} ETH. Please fund this wallet on Base Mainnet.`;
                console.error("❌ " + errMessage);
                return new Response(JSON.stringify({
                    error: "INSUFFICIENT_FUNDS",
                    message: errMessage,
                    adminAddress
                }), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                    status: 500,
                });
            }
            throw error;
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("❌ Mint Error:", errorMessage);
        return new Response(JSON.stringify({ error: errorMessage }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});
