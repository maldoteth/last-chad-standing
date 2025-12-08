import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ArrowLeft, Plus, Edit, Trash2, Save, X, LogOut, Loader2, ExternalLink, CheckCircle, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isAdminAuthenticated, adminLogout, getAdminSession, adminLogin } from '@/lib/adminAuth';
import { uploadFile, uploadPinataFile } from "@/Api/uploadFile";
import { useApi } from "@/Api/apiFunction";
import { formatDateToYMD } from "@/lib/utils";
import { StoreItem } from "@/context/storeData";
import { deployNFTContract, getContractInfo, getUserWalletBalance, mintNFT } from "@/utils/nftContractUtils";
import { Address, Hex } from "viem";
import { EIP1193Provider, usePrivy, useWallets } from "@privy-io/react-auth";
import { base } from "viem/chains";
import SessionSigners from "@/components/session-signers";
import AdminWalletDialog from "./AdminWalletDialog";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = usePrivy()
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);
  const [adminSession, setAdminSession] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const contractBytecode: Hex = import.meta.env.VITE_SUPABASE_BYTECODE

  // Transaction success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionData, setTransactionData] = useState<{
    txHash: string;
    explorerUrl: string;
    contractAddress: string;
    itemName: string;
  } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [adminWallet, setAdminWallet] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation()
  const [uploading, setUploading] = useState(false);
  const { post, get, put, deleteData } = useApi();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    rarity: '',
    image_url: '',
    ImgGatewayUrl: '',
    is_active: true,
    sale_end_date: '',
    sale_start_date: '',
    max_supply: '',
    first_release_date: '',
  });
  const { wallets } = useWallets()

  const walletProvider = async () => {
    if (!wallets?.length) throw new Error("No wallets connected.");

    const wallet = wallets[0];
    const address = wallet.address as Address;
    await wallet.switchChain(base.id);
    const provider = await wallet.getEthereumProvider();

    return {
      provider: provider as EIP1193Provider,
      address,
    };
  };
  // Get the block explorer URL based on chain
  const getExplorerUrl = (txHash: string, contractAddress?: string) => {
    // Update these based on your blockchain network
    // For Ethereum mainnet: https://etherscan.io
    // For Base: https://basescan.org
    // For Polygon: https://polygonscan.com
    const explorerBase = 'https://basescan.org';

    if (contractAddress) {
      return `${explorerBase}/address/${contractAddress}`;
    }
    return `${explorerBase}/tx/${txHash}`;
  };

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    setAdminSession(getAdminSession());
  }, [location]);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      fetchStoreItems();
    }
  }, [currentPage]);

  const handleGenerateMetadata = async (data: any) => {
    try {
      const { gatewayUrl, ipfsHash, local_folder_url, baseURI, name, symbol } = await post('store-item/generate-metadata', data)
      return {
        gatewayUrl, ipfsHash, local_folder_url, baseURI, symbol, name
      }
    } catch (error) {
      throw error
    }
  }

  const handleGetContractInfo = async (contractAddress) => {
    // Fetch contract info
    const info: any = await getContractInfo(contractAddress as Address);
    return (info)
  }

  const handleWalletBalance = async (walletAddress) => {
    // Fetch contract info
    const balance: any = await getUserWalletBalance(walletAddress as Address);
    return (balance)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadedUrl = await uploadPinataFile(file, true);
    setUploading(false);

    if (uploadedUrl) {
      setFormData({ ...formData, image_url: uploadedUrl.ipfsHash, ImgGatewayUrl: uploadedUrl?.gatewayUrl });
      toast({
        title: "Image uploaded",
        description: "Image has been uploaded successfully"
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    }
  };

  const fetchStoreItems = async () => {
    setLoading(true);
    try {
      const response = await get(`store-item/?page=${currentPage}`);

      if (response.success) {
        setStoreItems(response.items);
        setTotalItems(response.pagination.total);
        setTotalPages(response.pagination.totalPages);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch store items",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch store items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      rarity: '',
      image_url: '',
      ImgGatewayUrl: '',
      first_release_date: '',
      sale_end_date: '',
      sale_start_date: '',
      max_supply: '',
      is_active: true,
    });
    setEditingItem(null);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let response = null;
      const metaData = await handleGenerateMetadata(formData)
      const { provider, address: anyad } = await walletProvider()
      const address = user.smartWallet.address as Address
      const deployParams: any = {
        provider,
        name: metaData.name,
        symbol: metaData.symbol,
        baseURI: metaData.baseURI,
        maxSupply: formData?.max_supply,
        bytecode: contractBytecode,
        userAddress: address,
        owner: address,
      };
      const result = await deployNFTContract(deployParams);
      const deployData = {
        contractAddress: result.contractAddress,
        deploymentTxHash: result.transactionHash,
      }

      // const mintResponse = await mintNFT({
      //   provider,
      //   contractAddress: deployData.contractAddress as Address,
      //   toAddress: address,
      //   userAddress: address,
      //   quantity: 1
      // });

      if (editingItem) {
        response = await put(`store-item/${editingItem.id}`, {
          ...formData,
          ...metaData,
          ...deployData,
          nftDeployWalletId: user?.wallet?.id
          // mintingTxHash: mintResponse.transactionHash,
        });
      } else {
        response = await post('store-item/', {
          ...formData,
          ...metaData,
          ...deployData,
          nftDeployWalletId: user?.wallet?.id
          // mintingTxHash: mintResponse.transactionHash,
        });
      }

      if (response.success) {
        // Show success modal with transaction details
        setTransactionData({
          txHash: deployData.deploymentTxHash,
          explorerUrl: getExplorerUrl(deployData.deploymentTxHash),
          contractAddress: deployData.contractAddress,
          itemName: formData.name,
        });
        setShowSuccessModal(true);

        // Close the form dialog
        setIsDialogOpen(false);
        resetForm();

        // Refresh the items list after a short delay
        setTimeout(() => {
          fetchStoreItems();
        }, 1500);
      } else {
        throw new Error(response.message || 'Operation failed');
      }
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingItem ? 'update' : 'create'} item`,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: StoreItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category: item.category,
      rarity: item.rarity,
      image_url: item.image_url || '',
      ImgGatewayUrl: item.image_url || '',
      is_active: item.is_active,
      first_release_date: formatDateToYMD(item.first_release_date),
      sale_start_date: formatDateToYMD(item.sale_start_date),
      max_supply: item.max_supply,
      sale_end_date: formatDateToYMD(item.sale_end_date),
    });
    setIsDialogOpen(true);
  };
  const handleGetAdminWallet = async () => {
    try {
      setIsLoading(true)
      const response = await get('admin/wallet')
      setAdminWallet(response?.wallet?.address)
    } catch (error) {
      console.log(error)
    }
    finally {
      setIsLoading(false)
    }
  }
  const handleCopyWalletAddress = async () => {
    if (!user?.linkedAccounts?.length) {
      toast({
        title: "No wallet connected",
        description: "Please connect a wallet first",
        variant: "default"
      });
      return;
    }
    const wallet = user.linkedAccounts.find(account => account.type === 'wallet');
    if (!wallet) {
      toast({
        title: "No wallet found",
        description: "No wallet address available to copy",
        variant: "default"
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(wallet.address);
      toast({
        title: "Address copied!",
        description: `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)} copied to clipboard`
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy wallet address",
        variant: "default"
      });
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setDeleting(id);
    try {
      const response = await deleteData(`store-item/${id}`);

      if (response.success) {
        toast({
          title: "Success",
          description: "Item deleted successfully"
        });
        fetchStoreItems();
      } else {
        throw new Error(response.message || 'Delete failed');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete item",
        variant: "destructive"
      });
    } finally {
      setDeleting(null);
    }
  };

  const toggleActive = async (item: StoreItem) => {
    setToggling(item.id);
    try {
      const response = await put(`store-item/${item.id}`, {
        ...item,
        is_active: !item.is_active
      });

      if (response.success) {
        fetchStoreItems();
      } else {
        throw new Error(response.message || 'Update failed');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update item status",
        variant: "destructive"
      });
    } finally {
      setToggling(null);
    }
  };

  const handleLogout = () => {
    logout()
      .then((result) => {
        adminLogout();
        toast({
          title: "Logged out",
          description: "You have been logged out of the admin panel",
        });
        navigate('/admin/login');

      }).catch((err) => {
        console.log(err)
      });
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && !loading) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, and pages around current
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('ellipsis');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }

    return pages;
  };
 
  useEffect(() => {
    handleGetAdminWallet()
  }, []);
  if (!isAdminAuthenticated()) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/game')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Game
            </Button>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {adminSession?.email}
              <Button size="sm" variant="outline" className=" transition-all ms-1 duration-300 text-xs px-2 py-1" onClick={handleCopyWalletAddress}>
                Wallet   <Copy className="w-3 h-3" />
              </Button>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
            {!isLoading && <AdminWalletDialog existingWallet={adminWallet} />}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md text-white max-h-[90vh] custom-scroll overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Edit Item' : 'Add New Item'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter item name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      disabled={submitting}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter a short description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      required
                      disabled={submitting}
                    />
                  </div>

                  {/* Price + Category */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        placeholder="Enter price"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        required
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                        disabled={submitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="skins">Skins</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                          <SelectItem value="fighters">Fighters</SelectItem>
                          <SelectItem value="emotes">Emotes</SelectItem>
                          <SelectItem value="packs">Packs</SelectItem>
                          <SelectItem value="mobility">Mobility</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Rarity */}
                  <div>
                    <Label htmlFor="rarity">Rarity</Label>
                    <Select
                      value={formData.rarity}
                      onValueChange={(value) => setFormData({ ...formData, rarity: value })}
                      disabled={submitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rarity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="common">Common</SelectItem>
                        <SelectItem value="rare">Rare</SelectItem>
                        <SelectItem value="epic">Epic</SelectItem>
                        <SelectItem value="legendary">Legendary</SelectItem>
                        <SelectItem value="special">Special</SelectItem>
                        <SelectItem value="sparse">Sparse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* First Release Date */}
                  <div>
                    <Label htmlFor="first_release_date">First Release Date</Label>
                    <Input
                      id="first_release_date"
                      type="date"
                      placeholder="Select release date"
                      value={formData.first_release_date || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, first_release_date: e.target.value })
                      }
                      required
                      disabled={submitting}
                    />
                  </div>

                  {/* Max Supply */}
                  <div>
                    <Label htmlFor="max_supply">Max Supply</Label>
                    <Input
                      id="max_supply"
                      type="number"
                      min="0"
                      required
                      placeholder="Enter max supply"
                      value={formData.max_supply || ""}
                      onChange={(e) => setFormData({ ...formData, max_supply: e.target.value })}
                      disabled={submitting}
                    />
                  </div>

                  {/* Sale Start + End Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sale_start_date">Sale Start Date</Label>
                      <Input
                        id="sale_start_date"
                        type="date"
                        placeholder="Select start date"
                        value={formData.sale_start_date || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, sale_start_date: e.target.value })
                        }
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sale_end_date">Sale End Date</Label>
                      <Input
                        id="sale_end_date"
                        type="date"
                        placeholder="Select end date"
                        value={formData.sale_end_date || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, sale_end_date: e.target.value })
                        }
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <Label htmlFor="image">Upload Image</Label>
                    <Input
                      id="image"
                      type="file"
                      required={!editingItem}
                      accept="image/*"
                      placeholder="Choose an image"
                      onChange={handleFileChange}
                      disabled={submitting || uploading}
                    />
                    {uploading && (
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </div>
                    )}
                    {(formData.ImgGatewayUrl || formData.image_url) && (
                      <img
                        src={formData.ImgGatewayUrl || formData.image_url}
                        alt="Preview"
                        className="mt-2 w-20 h-20 object-cover rounded"
                      />
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={submitting}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting || uploading}>
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {editingItem ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {editingItem ? "Update" : "Create"}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>
      {/* Transaction Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              NFT Minted Successfully
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {transactionData && (
              <>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Item Name</p>
                    <p className="font-semibold">{transactionData.itemName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contract Address</p>
                    <p className="font-mono text-sm break-all">{transactionData.contractAddress}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction Hash</p>
                    <p className="font-mono text-sm break-all">{transactionData.txHash}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => window.open(transactionData.explorerUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Block Explorer
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      navigator.clipboard.writeText(transactionData.txHash);
                      toast({
                        title: "Copied",
                        description: "Transaction hash copied to clipboard"
                      });
                    }}
                    variant="outline"
                  >
                    Copy Transaction Hash
                  </Button>
                </div>
              </>
            )}

            <Button
              className="w-full"
              onClick={() => setShowSuccessModal(false)}
              variant="secondary"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <SessionSigners isSigner={adminSession?.isSigner} isAdmin={true} quorumId={adminSession?.quorumId} />

        <Card>
          <CardHeader>
            <CardTitle>Store Items ({totalItems})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Rarity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {storeItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <img
                            src={item?.ImgGatewayUrl || item.image_url || '/placeholder.svg'}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="capitalize">{item.category}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize text-dark">
                            {item.rarity}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleActive(item)}
                            disabled={toggling === item.id}
                          >
                            {toggling === item.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Badge variant={item.is_active ? "default" : "secondary"}>
                                {item.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {/* <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(item)}
                              disabled={deleting === item.id}
                            >
                              <Edit className="w-4 h-4" />
                            </Button> */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              className="text-red-500 hover:text-red-700"
                              disabled={deleting === item.id}
                            >
                              {deleting === item.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => goToPage(currentPage - 1)}
                            className={currentPage === 1 || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>

                        {renderPageNumbers().map((page, index) => (
                          <PaginationItem key={index}>
                            {page === 'ellipsis' ? (
                              <PaginationEllipsis />
                            ) : (
                              <PaginationLink
                                onClick={() => goToPage(page as number)}
                                isActive={currentPage === page}
                                className={loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                              >
                                {page}
                              </PaginationLink>
                            )}
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => goToPage(currentPage + 1)}
                            className={currentPage === totalPages || loading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>

                    <div className="text-center mt-2 text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages} ({totalItems} total items)
                    </div>
                  </div>
                )}
              </>
            )}

            {!loading && storeItems.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No items found. Create your first store item!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;