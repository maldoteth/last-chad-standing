import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const BuyCurrencyDialog = () => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const { toast } = useToast();

  const handlePurchase = () => {
    toast({
      title: "Purchase Feature Coming Soon!",
      description: "Currency purchasing will be available soon.",
    });
    setOpen(false);
    setAmount("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Coins className="w-4 h-4 mr-2" />
          Buy Currency
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy Currency</DialogTitle>
          <DialogDescription>
            Purchase in-game currency to buy items and unlock features.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handlePurchase} disabled={!amount}>
            Purchase
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};