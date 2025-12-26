import { useStore, StoreItem } from "@/context/storeData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlowCard } from "@/components/ui/spotlight-card";
import { getRarityDisplayName, getRarityColor, } from "@/lib/utils";

const StoreItemCard = ({
  item,
  onClick
}: {
  item: any;
  onClick: (item: StoreItem) => void;
}) => {
  return (
    <GlowCard className="cursor-pointer">
      <div className="p-3">
        <div
          className="aspect-square bg-gray-800/50 rounded-lg mb-2 overflow-hidden cursor-pointer"
          onClick={() => onClick(item.raw)}
        >
          <img
            src={item?.ImgGatewayUrl || item.image}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>

        <div className="mb-1 md:mb-2 flex items-center justify-between gap-1">
          <h3 className="font-semibold text-xs md:text-lg lg:text-xs text-white truncate flex-1">
            {item.name}
          </h3>
          <Badge
            variant="outline"
            className={`text-[10px] px-1 py-0 h-4 shrink-0 ${getRarityColor(item.rarity)}`}
          >
            {getRarityDisplayName(item.rarity)}
          </Badge>
        </div>

        <Button
          size="sm"
          variant="secondary"
          className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-xs md:text-sm lg:text-xs h-7 md:h-9 lg:h-7 flex items-center justify-center gap-1"
          onClick={() => onClick(item.raw)}
        >
          <img
            src="/lovable-uploads/d85650a5-bc8a-4c1d-846e-8a281fe16ed0.png"
            alt="LCS Coin"
            className="w-3 h-3 md:w-4 md:h-4 lg:w-3 lg:h-3"
          />
          <span>{item.price.toLocaleString()}</span>
        </Button>
      </div>
    </GlowCard>
  );
};


export default StoreItemCard;