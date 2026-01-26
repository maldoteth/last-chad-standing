import { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet, Save, X } from "lucide-react";
import { useApi } from "@/Api/apiFunction";
import { toast } from "sonner";

export default function AdminWalletDialog({ existingWallet }) {
    const [open, setOpen] = useState(false);
    const [address, setAddress] = useState(existingWallet || "");
    const [loading, setLoading] = useState(false);
    const { post } = useApi()
    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await post("admin/wallet", { address });
            setOpen(false);
            toast.success(response?.message)
        } catch (error) {
            console.error("Failed to save admin wallet", error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setAddress(existingWallet || "");
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={resetForm}>
                    <Wallet className="w-4 h-4 mr-2" />
                    {existingWallet ? "Update Admin Wallet" : "Add Admin Wallet"}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md text-white">
                <DialogHeader>
                    <DialogTitle>
                        {existingWallet ? "Update Admin Wallet Address" : "Add Admin Wallet Address"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <Label htmlFor="address">Wallet Address</Label>
                        <Input
                            id="address"
                            placeholder="Enter admin wallet address"
                            value={address}
                            defaultValue={existingWallet||''}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>

                        <Button type="submit" disabled={loading || !address}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Address
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
