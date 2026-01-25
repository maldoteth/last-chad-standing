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
import { ArrowLeft, Plus, Edit, Trash2, LogOut, Loader2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isAdminAuthenticated, adminLogout, getAdminSession } from '@/lib/adminAuth';
import { uploadFile, uploadPinataFile } from "@/Api/uploadFile";
import { useApi } from "@/Api/apiFunction";
import { formatDateToYMD } from "@/lib/utils";
import { StoreItem } from "@/context/storeData";
import { deployNFTContract, getContractInfo, getUserWalletBalance, mintNFT } from "@/utils/nftContractUtils";
import { Address, Hex } from "viem";
import { EIP1193Provider, usePrivy, useWallets } from "@privy-io/react-auth";
import { base } from "viem/chains";
import AdminWalletDialog from "./AdminWalletDialog";
import { supabase } from "@/integrations/supabase/client";
import { DialogDescription } from "@/components/ui/dialog";

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
  const contractBytecode = import.meta.env.VITE_SUPABASE_BYTECODE as Hex;

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

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    setAdminSession(getAdminSession());
  }, [location, navigate]);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      fetchStoreItems();
    }
  }, [currentPage]);

  const handleGenerateMetadata = async (data: any) => {
    try {
      // Try backend first
      const result = await post('store-item/generate-metadata', data)
      return {
        gatewayUrl: result.gatewayUrl, 
        ipfsHash: result.ipfsHash, 
        local_folder_url: result.local_folder_url, 
        baseURI: result.baseURI, 
        symbol: result.symbol, 
        name: result.name
      }
    } catch (error) {
      console.warn("Backend metadata generation failed, trying FRONTEND fallback...", error);
      // Frontend Fallback: Create metadata JSON and upload to Supabase
      try {
        const metadata = {
          name: data.name,
          description: data.description,
          image: data.ImgGatewayUrl || data.image_url,
          attributes: [
            { trait_type: "Rarity", value: data.rarity },
            { trait_type: "Category", value: data.category }
          ]
        };

        // ERC721 expects baseURI + tokenId. We'll use a unique folder and name the file '1'
        const folderName = `item-${Date.now()}`;
        const fileName = `${folderName}/1`; // The contract will look for baseURI + "1"
        const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
        const file = new File([blob], "1"); // Internal name '1'

        const { error: uploadError } = await supabase.storage
          .from('items')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('items')
          .getPublicUrl(fileName);

        const baseURI = publicUrl.replace("/1", "/");

        console.log("✅ Frontend Metadata Fallback Success. BaseURI:", baseURI);

        return {
          gatewayUrl: publicUrl,
          ipfsHash: folderName,
          local_folder_url: publicUrl,
          baseURI: baseURI,
          symbol: data.name.substring(0, 3).toUpperCase(),
          name: data.name
        };
      } catch (fallbackError) {
        console.error("Frontend metadata fallback also failed:", fallbackError);
        throw error;
      }
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      let uploadedUrl;
      try {
        uploadedUrl = await uploadPinataFile(file, true);
      } catch (pinataError: any) {
        console.warn("Pinata upload failed, trying backend fallback...", pinataError);
        try {
          uploadedUrl = await uploadFile(file, true);
        } catch (backendError: any) {
          console.warn("Backend upload failed, trying DIRECT SUPABASE fallback...");
          const fileName = `${Date.now()}-${file.name}`;
          const { error } = await supabase.storage
            .from('items')
            .upload(fileName, file);

          if (error) throw error;
          
          const { data: { publicUrl } } = supabase.storage
            .from('items')
            .getPublicUrl(fileName);

          uploadedUrl = { ipfsHash: fileName, gatewayUrl: publicUrl, image_url: publicUrl };
        }
      }

      if (uploadedUrl && (uploadedUrl.ipfsHash || uploadedUrl.image_url)) {
        setFormData({ 
          ...formData, 
          image_url: uploadedUrl.ipfsHash || uploadedUrl.image_url, 
          ImgGatewayUrl: uploadedUrl?.gatewayUrl || uploadedUrl?.image_url 
        });
        toast({
          title: "Image uploaded",
          description: "Image has been uploaded successfully"
        });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please check bucket configuration.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
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
      sale_start_date: '',
      sale_end_date: '',
      max_supply: '',
      is_active: true,
    });
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image_url) {
      toast({
        title: "Image required",
        description: "Please upload an image before creating the item.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      let response = null;
      const metaData = await handleGenerateMetadata(formData)
      
      const { provider } = await walletProvider()
      
      // Better address fetching from Privy
      const address = (user?.smartWallet?.address || user?.wallet?.address || wallets[0]?.address) as Address;
      
      console.log('🚀 Starting Deployment...', {
        address,
        hasBytecode: !!contractBytecode,
        bytecodeLength: contractBytecode?.length
      });

      if (!contractBytecode || contractBytecode === '0x') {
        throw new Error("Contract Bytecode is missing! Please check VITE_SUPABASE_BYTECODE in your .env file.");
      }

      // 2. Deploy Contract
      const deployParams: any = {
        name: metaData.name,
        symbol: metaData.symbol,
        baseURI: metaData.baseURI,
        owner: address,
        provider: provider,
        userAddress: address,
        maxSupply: Number(formData.max_supply),
        bytecode: contractBytecode
      }
      const deploymentResult = await deployNFTContract(deployParams);
      const contractAddress = deploymentResult.contractAddress as Address;
      console.log('Contract deployed at:', contractAddress);

      // 3. Mint NFT
      const mintParams: any = {
        contractAddress: contractAddress,
        recipient: address,
        provider: provider,
        quantity: 1,
        userAddress: address
      }
      const mintResult = await mintNFT(mintParams);
      const mintTx = mintResult.transactionHash;
      console.log('NFT minted. Tx hash:', mintTx);

      // 4. Prepare Payload
      const payload = {
        ...formData,
        ...metaData,
        price: Number(formData.price),
        max_supply: Number(formData.max_supply),
        nftAddress: contractAddress,
        deploymentTxHash: deploymentResult.transactionHash,
        mintingTxHash: mintTx,
        userAddress: address,
        is_active: formData.is_active || true
      };

      // 5. Save to Database with Fallback
      if (editingItem) {
        try {
          response = await put(`store-item/${editingItem.id}`, payload);
        } catch (apiError) {
          const { error } = await supabase
            .from('store_items')
            .update(payload)
            .eq('id', editingItem.id);
          if (error) throw error;
          response = { success: true };
        }
      } else {
        try {
          response = await post('store-item', payload);
        } catch (apiError) {
          const { error } = await supabase
            .from('store_items')
            .insert({
              ...payload,
              total_purchased: 0
            });
          if (error) throw error;
          response = { success: true };
        }
      }

      if (response.success) {
        toast({
          title: editingItem ? "Item Updated" : "Item Created",
          description: `Successfully ${editingItem ? "updated" : "created"} ${formData.name}`,
        });
        setIsDialogOpen(false);
        resetForm();
        fetchStoreItems();
      } else {
        throw new Error(response.message || 'Operation failed');
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      toast({
        title: "Submit Failed",
        description: error.message || "An unexpected error occurred",
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
      max_supply: item.max_supply.toString(),
      sale_end_date: formatDateToYMD(item.sale_end_date),
    });
    setIsDialogOpen(true);
  };

  const handleGetAdminWallet = async () => {
    try {
      setIsLoading(true)
      const response = await get('admin/wallet')
      if (response?.wallet?.address) {
        setAdminWallet(response.wallet.address)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyWalletAddress = async () => {
    const address = user?.smartWallet?.address || user?.wallet?.address;
    if (!address) {
      toast({
        title: "No wallet found",
        description: "No wallet address available to copy",
        variant: "default"
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Address copied!",
        description: `${address.slice(0, 6)}...${address.slice(-4)} copied to clipboard`
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
        toast({ title: "Success", description: "Item deleted successfully" });
        fetchStoreItems();
      } else {
        const { error } = await supabase.from('store_items').delete().eq('id', id);
        if (error) throw error;
        toast({ title: "Success", description: "Item deleted successfully (fallback)" });
        fetchStoreItems();
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
        const { error } = await supabase
          .from('store_items')
          .update({ is_active: !item.is_active })
          .eq('id', item.id);
        if (error) throw error;
        fetchStoreItems();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update item status",
        variant: "destructive"
      });
    } finally {
      setToggling(null);
    }
  };

  const handleLogout = () => {
    logout()
      .then(() => {
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
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
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
    <div className="min-h-screen bg-background text-white">
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
                Wallet <Copy className="w-3 h-3" />
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
                  <DialogDescription>
                    Fill in the details below to {editingItem ? 'update' : 'create'} a store item.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                          <SelectItem value="skins">Fighters</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                          <SelectItem value="emotes">Emotes</SelectItem>
                          <SelectItem value="packs">Packs</SelectItem>
                          <SelectItem value="mobility">Mobility</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
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
                  <div>
                    <Label htmlFor="first_release_date">First Release Date</Label>
                    <Input
                      id="first_release_date"
                      type="date"
                      value={formData.first_release_date || ""}
                      onChange={(e) => setFormData({ ...formData, first_release_date: e.target.value })}
                      required
                      disabled={submitting}
                    />
                  </div>
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sale_start_date">Sale Start Date</Label>
                      <Input
                        id="sale_start_date"
                        type="date"
                        value={formData.sale_start_date || ""}
                        onChange={(e) => setFormData({ ...formData, sale_start_date: e.target.value })}
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sale_end_date">Sale End Date</Label>
                      <Input
                        id="sale_end_date"
                        type="date"
                        value={formData.sale_end_date || ""}
                        onChange={(e) => setFormData({ ...formData, sale_end_date: e.target.value })}
                        disabled={submitting}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Item Image</Label>
                    <div className="mt-2 flex items-center space-x-4">
                      {(formData.ImgGatewayUrl || formData.image_url) && (
                        <div className="relative w-20 h-20 rounded-md overflow-hidden border border-border">
                          {(() => {
                            let displayUrl = formData.ImgGatewayUrl || formData.image_url;
                            let finalUrl = displayUrl;

                            if (displayUrl) {
                              // 1. Detect and fix broken Pinata URLs
                              if (displayUrl.includes('pinata.cloud/ipfs/')) {
                                const parts = displayUrl.split('/ipfs/');
                                const path = parts[parts.length - 1];
                                if (!(path.startsWith('Qm') || path.startsWith('bafy'))) {
                                  const cleanPath = decodeURIComponent(path).split('/').pop() || path;
                                  const { data: { publicUrl } } = supabase.storage.from('items').getPublicUrl(cleanPath);
                                  finalUrl = publicUrl;
                                }
                              }
                              // 2. Resolve relative paths
                              else if (!displayUrl.startsWith('http')) {
                                const isIPFS = displayUrl.startsWith('Qm') || displayUrl.startsWith('bafy');
                                if (isIPFS) {
                                  finalUrl = `https://gateway.pinata.cloud/ipfs/${displayUrl}`;
                                } else {
                                  const cleanPath = decodeURIComponent(displayUrl).split('/').pop() || displayUrl;
                                  const { data: { publicUrl } } = supabase.storage.from('items').getPublicUrl(cleanPath);
                                  finalUrl = publicUrl;
                                }
                              }
                            }
                            return (
                              <img
                                src={finalUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            );
                          })()}
                        </div>
                      )}
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={uploading || submitting}
                          className="cursor-pointer"
                        />
                        {uploading && (
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting || uploading}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {editingItem ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingItem ? 'Update Item' : 'Create Item'
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="p-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Store Items Management</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Rarity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {storeItems.length > 0 ? (
                        storeItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="w-12 h-12 rounded-md overflow-hidden bg-muted border border-border">
                                {(() => {
                                  const rawUrl = item.ImgGatewayUrl || item.image_url || item.image;
                                  if (!rawUrl) return (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground text-center p-1">
                                      No img
                                    </div>
                                  );

                                  let finalUrl = rawUrl;
                                  
                                  // 1. Detect and fix broken Pinata URLs (filename instead of CID)
                                  if (rawUrl.includes('pinata.cloud/ipfs/')) {
                                    const parts = rawUrl.split('/ipfs/');
                                    const path = parts[parts.length - 1];
                                    const isID = path.startsWith('Qm') || path.startsWith('bafy');
                                    
                                    if (!isID) {
                                      // It's a broken Pinata URL with a filename. Use Supabase fallback.
                                      const cleanPath = decodeURIComponent(path).split('/').pop() || path;
                                      const { data: { publicUrl } } = supabase.storage.from('items').getPublicUrl(cleanPath);
                                      finalUrl = publicUrl;
                                    }
                                  } 
                                  // 2. Resolve relative paths (Supabase filenames)
                                  else if (!rawUrl.startsWith('http')) {
                                    const isIPFS = rawUrl.startsWith('Qm') || rawUrl.startsWith('bafy');
                                    if (isIPFS) {
                                      finalUrl = `https://gateway.pinata.cloud/ipfs/${rawUrl}`;
                                    } else {
                                      const cleanPath = decodeURIComponent(rawUrl).split('/').pop() || rawUrl;
                                      const { data: { publicUrl } } = supabase.storage.from('items').getPublicUrl(cleanPath);
                                      finalUrl = publicUrl;
                                    }
                                  }

                                  return (
                                    <img
                                      src={finalUrl}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        // Fallback if the URL fails to load
                                        (e.target as HTMLImageElement).src = '/placeholder.png'; 
                                        (e.target as HTMLImageElement).className = 'w-full h-full object-contain opacity-20';
                                      }}
                                    />
                                  );
                                })()}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="capitalize">{item.category}</TableCell>
                            <TableCell>{item.price} coins</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`capitalize rarity-${item.rarity}`}>
                                {item.rarity}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleActive(item)}
                                disabled={toggling === item.id}
                              >
                                {toggling === item.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : item.is_active ? (
                                  <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
                                    Active
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="opacity-50">
                                    Inactive
                                  </Badge>
                                )}
                              </Button>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(item)}
                                  className="h-8 w-8 text-blue-500"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(item.id)}
                                  disabled={deleting === item.id}
                                  className="h-8 w-8 text-red-500"
                                >
                                  {deleting === item.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                            No items found in the store.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => goToPage(currentPage - 1)}
                        />
                      </PaginationItem>
                      {renderPageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                          {page === 'ellipsis' ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              isActive={currentPage === page}
                              onClick={() => goToPage(page as number)}
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => goToPage(currentPage + 1)}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;