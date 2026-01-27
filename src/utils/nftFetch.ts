// utils/nftFetchByWalletOnly.ts
import type { Address } from "viem";

// -------------------------
// Interfaces
// -------------------------
export interface NFTToken {
  contractAddress: Address;
  tokenId: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  name: string;
  image: string | null;
  description: string | null;
  externalUrl: string | null;
  attributes: Record<string, any>[] | null;
}

export interface BasescanNFT {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  tokenID: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}

// -------------------------
// Fetch NFTs using Basescan API (easiest method)
// -------------------------
export const getNFTsFromBasescanAPI = async (
  walletAddress: Address
): Promise<NFTToken[]> => {
  const BASESCAN_API_KEY = 'AJUZEAEMS8I3BXDFK6Q6VPSNCR4JRZ8TQD';

  if (!BASESCAN_API_KEY) {
    throw new Error(
      "NEXT_PUBLIC_BASESCAN_API_KEY is not set in environment variables"
    );
  }

  try {
    console.log(`🔍 Fetching NFTs for wallet ${walletAddress} using Basescan API...`);

    const url = `https://api.basescan.org/v2/api?chainid=8453&module=account&action=tokennfttx&address=${walletAddress}&page=1&offset=100&sort=desc&apikey=${BASESCAN_API_KEY}`;
    console.log("📡 API Endpoint: https://api.basescan.org (Base Mainnet)");

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log({ data })
    if (data.status === "0") {
      console.log(" No NFTs found for this wallet");
      return [];
    }

    if (!Array.isArray(data.result)) {
      throw new Error("Invalid response format from Basescan");
    }

    // Group by contract and token ID to get unique NFTs
    const nftMap = new Map<string, BasescanNFT>();

    for (const nft of data.result) {
      const key = `${nft.contractAddress.toLowerCase()}-${nft.tokenID}`;
      // Keep only the most recent transfer (last transfer = current owner)
      nftMap.set(key, nft);
    }

    console.log(`✅ Found ${nftMap.size} unique NFT(s)`);

    // Convert to formatted NFT objects
    const nfts: NFTToken[] = Array.from(nftMap.values()).map((nft) => ({
      contractAddress: nft.contractAddress as Address,
      tokenId: nft.tokenID,
      tokenName: nft.tokenName,
      tokenSymbol: nft.tokenSymbol,
      tokenDecimal: nft.tokenDecimal,
      name: nft.tokenName,
      image: null,
      description: null,
      externalUrl: null,
      attributes: null,
    }));

    return nfts;
  } catch (error) {
    console.error("❌ Error fetching NFTs from Basescan:", error);
    throw new Error(
      `Failed to fetch NFTs: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

// -------------------------
// Alternative: Fetch NFTs using Viem (contract calls)
// -------------------------
import {
  createPublicClient,
  http,
  defineChain,
} from "viem";

const baseChain = defineChain({
  id: 8453,
  name: 'Base',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://mainnet.base.org'] },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://basescan.org' },
  },
});

const publicClient = createPublicClient({
  chain: baseChain,
  transport: http(),
});

export const getNFTsByWalletViem = async (
  walletAddress: Address,
  contractAddress: Address
): Promise<NFTToken[]> => {
  try {
    console.log(
      `🔍 Fetching NFTs using Viem for ${walletAddress} on Base...`
    );

    // Get current block
    const currentBlock = await publicClient.getBlockNumber();

    // Fetch Transfer events
    const events = await publicClient.getLogs({
      address: contractAddress,
      event: {
        type: "event",
        name: "Transfer",
        inputs: [
          { indexed: true, name: "from", type: "address" },
          { indexed: true, name: "to", type: "address" },
          { indexed: true, name: "tokenId", type: "uint256" },
        ],
      },
      args: {
        to: walletAddress,
      },
      fromBlock: 0n,
      toBlock: currentBlock,
    });

    console.log(`✅ Found ${events.length} transfer events`);

    const nfts: NFTToken[] = events.map((event: any) => ({
      contractAddress: contractAddress,
      tokenId: event.args.tokenId?.toString() || "0",
      tokenName: "Unknown",
      tokenSymbol: "UNKNOWN",
      tokenDecimal: "0",
      name: "Unknown",
      image: null,
      description: null,
      externalUrl: null,
      attributes: null,
    }));

    return nfts;
  } catch (error) {
    console.error("❌ Error fetching NFTs with Viem:", error);
    throw new Error(
      `Failed to fetch NFTs: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

// -------------------------
// Fetch NFT metadata from IPFS/HTTP
// -------------------------
export const fetchNFTMetadata = async (
  metadataURI: string
): Promise<Partial<NFTToken> | null> => {
  try {
    // Handle IPFS URLs
    let url = metadataURI;
    if (url.startsWith("ipfs://")) {
      url = `https://ipfs.io/ipfs/${url.slice(7)}`;
    }

    console.log(`📥 Fetching metadata from ${url}...`);

    const response = await fetch(url, {
    });

    if (!response.ok) {
      console.warn(`⚠️ Failed to fetch metadata: ${response.status}`);
      return null;
    }

    const metadata = await response.json();

    // Normalize image URL if it's IPFS
    let imageUrl = metadata.image;
    if (imageUrl?.startsWith("ipfs://")) {
      imageUrl = `https://ipfs.io/ipfs/${imageUrl.slice(7)}`;
    }

    return {
      name: metadata.name || undefined,
      description: metadata.description || undefined,
      image: imageUrl || undefined,
      externalUrl: metadata.external_url || undefined,
      attributes: metadata.attributes || undefined,
    };
  } catch (error) {
    console.warn("⚠️ Error fetching metadata:", error);
    return null;
  }
};

// -------------------------
// Enrich NFT data with metadata (requires contract interaction)
// -------------------------
export const enrichNFTsWithMetadata = async (
  nfts: NFTToken[],
  contractABI: any
): Promise<NFTToken[]> => {
  const enrichedNFTs = await Promise.all(
    nfts.map(async (nft) => {
      try {
        // You would need to call getTokenURI on the contract here
        // This is a placeholder - implement based on your contract ABI
        console.log(`🔄 Enriching NFT #${nft.tokenId}...`);
        return nft;
      } catch (error) {
        console.warn(`⚠️ Error enriching NFT #${nft.tokenId}:`, error);
        return nft;
      }
    })
  );

  return enrichedNFTs;
};

// -------------------------
// Simple wrapper with just wallet address
// -------------------------
export const getMyNFTs = async (walletAddress: Address): Promise<NFTToken[]> => {
  try {
    console.log("🎨 Fetching your NFTs...");
    const nfts = await getNFTsFromBasescanAPI(walletAddress);
    console.log(`✅ Retrieved ${nfts.length} NFT(s)`);
    return nfts;
  } catch (error) {
    console.error("❌ Failed to fetch NFTs:", error);
    throw error;
  }
};