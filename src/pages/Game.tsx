import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useToast } from "@/hooks/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import { Calendar } from "@/components/ui/calendar"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardDescription,
  HoverCardHeader,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Textarea } from "@/components/ui/textarea"
import { useStore } from "@/hooks/useStore"
import StoreCarousel from "@/components/StoreCarousel";

const Game = () => {
  const { toast } = useToast()
  const { user } = usePrivy();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFighter, setSelectedFighter] = useState(null);
  const { storeItems, userBalance, userInventory, loading, purchaseItem, refetch } = useStore();

  const handleOpenModal = (fighter) => {
    setSelectedFighter(fighter);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePurchase = async (itemId: string, itemName: string, price: number) => {
    const success = await purchaseItem(itemId, itemName, price);
    if (success) {
      handleCloseModal();
    }
  };

  const fighters = [
    {
      name: "Shane Sonny",
      price: 1200,
      rarity: "special",
      image: "/lovable-uploads/a76e21f1-ffca-4130-bd9a-08d09167dca0.png"
    },
    {
      name: "Rey Del Maestro",
      price: 2800,
      rarity: "blue",
      image: "/lovable-uploads/37f256dc-415c-4032-82ad-db63f676284d.png"
    },
    {
      name: "John Strictland",
      price: 1000,
      rarity: "special",
      image: "/lovable-uploads/4e815ce1-bf79-4b3d-887f-88248a86a9e2.png"
    },
    {
      name: "Tarragon Southslice",
      price: 2800,
      rarity: "gold",
      image: "/lovable-uploads/bdd4429c-2d0c-47cc-a05d-9e481770baa5.png"
    },
    {
      name: "The Irish King",
      price: 2500,
      rarity: "gold",
      image: "/lovable-uploads/irish-king-skin.png"
    },
    {
      name: "Stani Eagle",
      price: 1800,
      rarity: "blue",
      image: "/lovable-uploads/370bd874-ad5c-467d-b844-55688b1a0f9a.png"
    },
    {
      name: "Jonesy Bones",
      price: 2200,
      rarity: "silver",
      image: "/lovable-uploads/bones-skin.png"
    },
    {
      name: "Latin Legend",
      price: 1500,
      rarity: "green",
      image: "/lovable-uploads/latin-legend-skin.png"
    }
  ];

  const accessories = [
    {
      name: "Cool Shades",
      price: 800,
      rarity: "green",
      image: "/lovable-uploads/cool-shades.png"
    },
    {
      name: "Golden Tooth",
      price: 1500,
      rarity: "silver",
      image: "/lovable-uploads/golden-tooth.png"
    },
    {
      name: "Diamond Grill",
      price: 2500,
      rarity: "gold",
      image: "/lovable-uploads/diamond-grill.png"
    },
    {
      name: "Bandana",
      price: 1000,
      rarity: "green",
      image: "/lovable-uploads/bandana.png"
    }
  ];

  const emotes = [
    {
      name: "Flex Emote",
      price: 1000,
      rarity: "green",
      image: "/lovable-uploads/flex-emote.png"
    },
    {
      name: "Laughing Taunt",
      price: 1200,
      rarity: "green",
      image: "/lovable-uploads/laughing-taunt.png"
    },
    {
      name: "Crying Emote",
      price: 1500,
      rarity: "silver",
      image: "/lovable-uploads/crying-emote.png"
    },
    {
      name: "Dancing Emote",
      price: 2000,
      rarity: "silver",
      image: "/lovable-uploads/dancing-emote.png"
    }
  ];

  const mobility = [
    {
      name: "Hoverboard",
      price: 3000,
      rarity: "blue",
      image: "/lovable-uploads/hoverboard.png"
    },
    {
      name: "Jetpack",
      price: 4500,
      rarity: "blue",
      image: "/lovable-uploads/jetpack.png"
    },
    {
      name: "Teleportation Device",
      price: 6000,
      rarity: "gold",
      image: "/lovable-uploads/teleportation-device.png"
    },
    {
      name: "Spring Shoes",
      price: 2500,
      rarity: "green",
      image: "/lovable-uploads/spring-shoes.png"
    }
  ];

  const packs = [
    {
      name: "Beginner Pack",
      price: 1500,
      rarity: "green",
      image: "/lovable-uploads/beginner-pack.png"
    },
    {
      name: "Intermediate Pack",
      price: 3000,
      rarity: "silver",
      image: "/lovable-uploads/intermediate-pack.png"
    },
    {
      name: "Advanced Pack",
      price: 5000,
      rarity: "gold",
      image: "/lovable-uploads/advanced-pack.png"
    },
    {
      name: "Elite Pack",
      price: 8000,
      rarity: "gold",
      image: "/lovable-uploads/elite-pack.png"
    }
  ];

  const renderItem = (item, idx) => (
    <Card key={idx} className="bg-stone-800 text-white">
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>Price: {item.price} coins</CardDescription>
      </CardHeader>
      <CardContent>
        <AspectRatio ratio={1 / 1}>
          <img src={item.image} alt={item.name} className="object-cover rounded-md" />
        </AspectRatio>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Badge variant="secondary">{item.rarity}</Badge>
        <Button onClick={() => handleOpenModal(item)}>Buy</Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-4 text-white">Game Store</h1>

      {user ? (
        <div className="mb-6 text-white">
          Your Balance: {userBalance?.coins} coins
        </div>
      ) : null}

      <Separator className="mb-4" />

      <h2 className="text-2xl font-semibold mb-3 text-white">Fighters</h2>
      <StoreCarousel items={fighters} renderItem={renderItem} />

      <Separator className="mb-4" />

      <h2 className="text-2xl font-semibold mb-3 text-white">Accessories</h2>
      <StoreCarousel items={accessories} renderItem={renderItem} />

      <Separator className="mb-4" />

      <h2 className="text-2xl font-semibold mb-3 text-white">Emotes</h2>
      <StoreCarousel items={emotes} renderItem={renderItem} />

      <Separator className="mb-4" />

      <h2 className="text-2xl font-semibold mb-3 text-white">Mobility</h2>
      <StoreCarousel items={mobility} renderItem={renderItem} />

      <Separator className="mb-4" />

      <h2 className="text-2xl font-semibold mb-3 text-white">Packs</h2>
      <StoreCarousel items={packs} renderItem={renderItem} />

      {/* Purchase Modal */}
      {isModalOpen && selectedFighter && (
        <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <AlertDialogContent className="bg-stone-900 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to purchase {selectedFighter.name} for {selectedFighter.price} coins?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCloseModal}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handlePurchase(selectedFighter.name, selectedFighter.name, selectedFighter.price)}>
                Purchase
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default Game;
