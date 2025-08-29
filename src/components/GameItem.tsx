import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GameItemProps {
  item: {
    item_id: string;
    name?: string;
    item_name?: string;
    quantity: number;
    rarity?: string;
    image_url?: string;
  };
}

export const GameItem = ({ item }: GameItemProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium truncate">
            {item.item_name || item.name || 'Unknown Item'}
          </CardTitle>
          {item.rarity && (
            <Badge variant="secondary" className="text-xs">
              {item.rarity}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {item.image_url && (
          <div className="aspect-square bg-muted rounded-md mb-2 overflow-hidden">
            <img
              src={item.image_url}
              alt={item.item_name || item.name || 'Game item'}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="text-sm text-muted-foreground">
          Quantity: <span className="font-medium">{item.quantity}</span>
        </div>
      </CardContent>
    </Card>
  );
};