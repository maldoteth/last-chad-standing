import { useState } from "react";
import { createPublicClient, http, getContract } from "viem";
import { base, baseSepolia } from "viem/chains";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Your NFT contract ABI (ERC721Enumerable)
const NFT_ABI = [
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "balance", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

interface OwnedNFT {
  id: string;
  uri: string;
}

const NFTQueryComponent = () => {
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [ownedNFTs, setOwnedNFTs] = useState<OwnedNFT[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Initialize viem public client
  const client = createPublicClient({
    chain: base, // Change to your network (ethereum, polygon, etc.)
    transport: http(),
  });

  // Get NFT balance
  const handleGetBalance = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!walletAddress || !contractAddress) {
      toast({
        title: "Error",
        description: "Please enter both wallet and contract addresses",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const nft = getContract({
        address: contractAddress as `0x${string}`,
        abi: NFT_ABI,

        client,
      });

      const bal = await nft.read.balanceOf([walletAddress as `0x${string}`]);
      setBalance(bal);
      setOwnedNFTs([]);

      toast({
        title: "Success",
        description: `Wallet owns ${bal.toString()} NFTs`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch balance",
        variant: "destructive",
      });
      setBalance(null);
    } finally {
      setLoading(false);
    }
  };

  // Get owned token IDs and URIs
  const handleGetOwnedNFTs = async () => {
    if (balance === null || balance === 0n) {
      toast({
        title: "Error",
        description: "No NFTs found or balance not fetched",
        variant: "destructive",
      });
      return;
    }

    setLoadingDetails(true);
    try {
      const nft = getContract({
        address: contractAddress as `0x${string}`,
        abi: NFT_ABI,
        client,
      });

      const owned: OwnedNFT[] = [];

      // Get each token ID one by one
      for (let i = 0n; i < balance; i++) {
        const tokenId = await nft.read.tokenOfOwnerByIndex([
          walletAddress as `0x${string}`,
          i,
        ]);

        // Get the URI for this token
        const uri = await nft.read.tokenURI([tokenId]);

        owned.push({
          id: tokenId.toString(),
          uri,
        });
      }

      setOwnedNFTs(owned);
      toast({
        title: "Success",
        description: `Fetched ${owned.length} NFT details`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch NFT details",
        variant: "destructive",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  // Fetch URIs for owned NFTs (parallel execution)
  const handleFetchAllURIs = async () => {
    if (ownedNFTs.length === 0) {
      toast({
        title: "Error",
        description: "No NFTs to fetch URIs for",
        variant: "destructive",
      });
      return;
    }

    setLoadingDetails(true);
    try {
      const uris = await Promise.all(
        ownedNFTs.map((nft) =>
          nft.read.tokenURI([BigInt(nft.id)])
        )
      );

      const updated = ownedNFTs.map((nft, index) => ({
        ...nft,
        uri: uris[index],
      }));

      setOwnedNFTs(updated);
      toast({
        title: "Success",
        description: "All URIs fetched successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch URIs",
        variant: "destructive",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Query Section */}
        <Card>
          <CardHeader>
            <CardTitle>Query NFT Ownership</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleGetBalance} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="wallet">Wallet Address</Label>
                  <Input
                    id="wallet"
                    placeholder="0x..."
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="contract">Contract Address</Label>
                  <Input
                    id="contract"
                    placeholder="0x..."
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Fetching Balance...
                    </>
                  ) : (
                    "Get Balance"
                  )}
                </Button>

                {balance !== null && balance > 0n && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGetOwnedNFTs}
                    disabled={loadingDetails}
                  >
                    {loadingDetails ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Fetching Details...
                      </>
                    ) : (
                      `Get Owned NFTs (${balance.toString()})`
                    )}
                  </Button>
                )}
              </div>
            </form>

            {/* Balance Display */}
            {balance !== null && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Total NFTs Owned</p>
                <p className="text-3xl font-bold">{balance.toString()}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Owned NFTs List */}
        {ownedNFTs.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Owned NFTs ({ownedNFTs.length})</CardTitle>
              {ownedNFTs.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleFetchAllURIs}
                  disabled={loadingDetails}
                >
                  {loadingDetails ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                      Fetching URIs...
                    </>
                  ) : (
                    "Fetch All URIs"
                  )}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ownedNFTs.map((nft, index) => (
                  <div
                    key={index}
                    className="p-3 border border-border rounded-lg hover:bg-muted/50 transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-muted-foreground">
                          Token ID
                        </p>
                        <p className="text-lg font-mono font-bold">{nft.id}</p>

                        {nft.uri && (
                          <>
                            <p className="text-sm font-semibold text-muted-foreground mt-2">
                              Metadata URI
                            </p>
                            <p className="text-xs font-mono break-all text-muted-foreground">
                              {nft.uri}
                            </p>
                          </>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          copyToClipboard(
                            nft.uri || nft.id
                          )
                        }
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-semibold">1. balanceOf(address)</p>
              <p className="text-muted-foreground">
                Returns the number of NFTs owned by a wallet in this contract.
              </p>
            </div>
            <div>
              <p className="font-semibold">2. tokenOfOwnerByIndex(address, index)</p>
              <p className="text-muted-foreground">
                Returns the specific token ID at that index position in the owner's list.
              </p>
            </div>
            <div>
              <p className="font-semibold">3. tokenURI(tokenId)</p>
              <p className="text-muted-foreground">
                Returns the metadata URL (IPFS, HTTP, etc.) for that specific NFT.
              </p>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Note: For wallets with thousands of NFTs, consider using an indexer API
                (Alchemy, Moralis) for better performance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NFTQueryComponent;
