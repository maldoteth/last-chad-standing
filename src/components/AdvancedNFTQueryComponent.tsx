import { useState, useCallback } from "react";
import { createPublicClient, http, getContract } from "viem";
import { base } from "viem/chains";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  metadata?: Record<string, any>;
}

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

const AdvancedNFTQueryComponent = () => {
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [ownedNFTs, setOwnedNFTs] = useState<OwnedNFT[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState("20");
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 20,
    totalPages: 1,
  });

  const client = createPublicClient({
    chain: base,
    transport: http(import.meta.env.VITE_RPC_URL || "https://base-mainnet.g.alchemy.com/v2/YOUR_KEY"),
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
      const bal = await (client as any).readContract({
        address: contractAddress as `0x${string}`,
        abi: NFT_ABI,
        functionName: "balanceOf",
        args: [walletAddress as `0x${string}`],
      }) as bigint;
      setBalance(bal);
      setOwnedNFTs([]);
      setPagination({
        currentPage: 1,
        itemsPerPage: parseInt(itemsPerPage),
        totalPages: Math.ceil(Number(bal) / parseInt(itemsPerPage)),
      });

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

  // Get owned NFTs with pagination
  const handleGetOwnedNFTsPage = async (page: number) => {
    if (balance === null) return;

    setLoadingDetails(true);
    try {
      const startIdx = (page - 1) * pagination.itemsPerPage;
      const endIdx = Math.min(startIdx + pagination.itemsPerPage, Number(balance));
      const owned: OwnedNFT[] = [];

      // Fetch token IDs for this page
      for (let i = startIdx; i < endIdx; i++) {
        const tokenId = await (client as any).readContract({
          address: contractAddress as `0x${string}`,
          abi: NFT_ABI,
          functionName: "tokenOfOwnerByIndex",
          args: [walletAddress as `0x${string}`, BigInt(i)],
        }) as bigint;

        const uri = await (client as any).readContract({
          address: contractAddress as `0x${string}`,
          abi: NFT_ABI,
          functionName: "tokenURI",
          args: [tokenId],
        }) as string;

        owned.push({
          id: tokenId.toString(),
          uri,
        });
      }

      setOwnedNFTs(owned);
      setPagination((prev) => ({
        ...prev,
        currentPage: page,
      }));

      toast({
        title: "Success",
        description: `Fetched NFTs ${startIdx + 1} - ${endIdx}`,
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

  // Fetch metadata from URI
  const fetchMetadata = async (uri: string): Promise<Record<string, any> | null> => {
    try {
      // Handle IPFS URIs
      const httpUri = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
      const response = await fetch(httpUri);
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  };

  // Fetch all metadata for current page
  const handleFetchMetadata = async () => {
    if (ownedNFTs.length === 0) return;

    setLoadingDetails(true);
    try {
      const metadataPromises = ownedNFTs.map((nft) => fetchMetadata(nft.uri));
      const metadata = await Promise.all(metadataPromises);

      const updated = ownedNFTs.map((nft, index) => ({
        ...nft,
        metadata: metadata[index] || undefined,
      }));

      setOwnedNFTs(updated);
      toast({
        title: "Success",
        description: "Metadata fetched successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch metadata",
        variant: "destructive",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  // Export as JSON
  const handleExportJSON = () => {
    const data = {
      walletAddress,
      contractAddress,
      totalBalance: balance?.toString(),
      nfts: ownedNFTs,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `nft-portfolio-${walletAddress.slice(0, 6)}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Success",
      description: "Portfolio exported as JSON",
    });
  };

  const displayedNFTs = ownedNFTs;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Query Section */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced NFT Portfolio Viewer</CardTitle>
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
                    onClick={() => handleGetOwnedNFTsPage(1)}
                    disabled={loadingDetails}
                  >
                    {loadingDetails ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Fetching...
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
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total NFTs Owned</p>
                  <p className="text-3xl font-bold">{balance.toString()}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Items Per Page</p>
                  <Select
                    value={itemsPerPage}
                    onValueChange={(value) => {
                      setItemsPerPage(value);
                      setPagination((prev) => ({
                        ...prev,
                        itemsPerPage: parseInt(value),
                        totalPages: Math.ceil(Number(balance) / parseInt(value)),
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Owned NFTs List */}
        {displayedNFTs.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Owned NFTs ({ownedNFTs.length})</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleFetchMetadata}
                  disabled={loadingDetails}
                >
                  {loadingDetails ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                      Fetching...
                    </>
                  ) : (
                    "Fetch Metadata"
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExportJSON}
                >
                  <Download className="w-3 h-3 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* NFT Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto">
                {displayedNFTs.map((nft, index) => (
                  <div
                    key={index}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                  >
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">
                          Token ID
                        </p>
                        <p className="text-base font-mono font-bold">{nft.id}</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">
                          URI
                        </p>
                        <p className="text-xs font-mono break-all text-muted-foreground truncate">
                          {nft.uri}
                        </p>
                      </div>

                      {nft.metadata && (
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs font-semibold text-muted-foreground">
                            Metadata
                          </p>
                          <div className="text-xs space-y-1 mt-1">
                            {nft.metadata.name && (
                              <p>
                                <span className="font-semibold">Name:</span>{" "}
                                {nft.metadata.name}
                              </p>
                            )}
                            {nft.metadata.description && (
                              <p className="line-clamp-2">
                                <span className="font-semibold">Desc:</span>{" "}
                                {nft.metadata.description}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-4 border-t border-border">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGetOwnedNFTsPage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1 || loadingDetails}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                    const pageNum = pagination.currentPage - 2 + i;
                    if (pageNum < 1 || pageNum > pagination.totalPages) return null;
                    return (
                      <Button
                        key={pageNum}
                        size="sm"
                        variant={pageNum === pagination.currentPage ? "default" : "outline"}
                        onClick={() => handleGetOwnedNFTsPage(pageNum)}
                        disabled={loadingDetails}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleGetOwnedNFTsPage(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages || loadingDetails}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-semibold">Step 1: Get Balance</p>
              <p className="text-muted-foreground">
                Enter wallet and contract addresses, then click "Get Balance" to see total NFTs.
              </p>
            </div>
            <div>
              <p className="font-semibold">Step 2: View NFTs</p>
              <p className="text-muted-foreground">
                Click "Get Owned NFTs" to fetch token IDs and URIs for the current page.
              </p>
            </div>
            <div>
              <p className="font-semibold">Step 3: Fetch Metadata (Optional)</p>
              <p className="text-muted-foreground">
                Click "Fetch Metadata" to load names and descriptions from IPFS.
              </p>
            </div>
            <div>
              <p className="font-semibold">Step 4: Export</p>
              <p className="text-muted-foreground">
                Download your portfolio as JSON for backup or analysis.
              </p>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                For large portfolios (1000+ NFTs), pagination prevents RPC overload.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedNFTQueryComponent;
