// components/MyNFTs.tsx
"use client";

import { useState, useEffect } from "react";
import type { Address } from "viem";

interface NFTToken {
  tokenName: string;
  tokenSymbol: string;
  tokenId: string;
  contractAddress: string;
}

export const MyNFTsGallery = () => {
    const walletAddress: Address = '0x4201a1971Eb8734e34151c73C9161b24C3e1bcf0'
    const BASESCAN_API_KEY = 'AJUZEAEMS8I3BXDFK6Q6VPSNCR4JRZ8TQD';
    const [nfts, setNfts] = useState<NFTToken[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!walletAddress) return;

        const fetchNFTs = async () => {
            setLoading(true);
            setError(null);

            try {
                const url = `https://api.etherscan.io/v2/api?chainid=8453&module=account&action=tokentx&address=0x4201a1971Eb8734e34151c73C9161b24C3e1bcf0&&apikey=${BASESCAN_API_KEY}`;

                const fetchedNFTs = await fetch(url);
                if (!fetchedNFTs.ok) { throw new Error(`HTTP error! status: ${ fetchedNFTs.status }`); }
                const data = await fetchedNFTs.json();
                console.log({ data })
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchNFTs();
    }, [walletAddress]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-6">
                My NFTs ({nfts.length})
            </h2>

            {nfts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p>No NFTs found in this wallet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nfts.map((nft, index) => (
                        <NFTCard key={index} nft={nft} />
                    ))}
                </div>
            )}
        </div>
    );
};

// NFT Card Component
const NFTCard = ({ nft }: { nft: NFTToken }) => {
    const [metadata, setMetadata] = useState<any>(null);
    const [loadingMetadata, setLoadingMetadata] = useState(false);

    useEffect(() => {
        // Optionally fetch metadata if you have token URI
        // For now, just show basic info
    }, []);

    return (
        <div className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                {nft.tokenName.charAt(0)}
            </div>

            <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{nft.tokenName}</h3>
                <p className="text-gray-600 text-sm mb-3">{nft.tokenSymbol}</p>

                <div className="space-y-2 text-xs text-gray-600 mb-4">
                    <p>
                        <span className="font-semibold">Token ID:</span> {nft.tokenId}
                    </p>
                    <p>
                        <span className="font-semibold">Contract:</span>
                        <br />
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">
                            {nft.contractAddress.slice(0, 10)}...
                            {nft.contractAddress.slice(-8)}
                        </code>
                    </p>
                </div>

                <a
                    href={`https://basescan.org/token/${nft.contractAddress}?a=${nft.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-blue-600 text-sm hover:underline font-semibold"
                >
                    View on BaseScan →
                </a>
            </div>
        </div>
    );
};