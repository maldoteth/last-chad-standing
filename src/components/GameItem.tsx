import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StoreItem } from "@/hooks/useStore";

interface GameItemProps {
  item: StoreItem;
}

export const GameItem: React.FC<GameItemProps> = ({ item }) => {
  return (
    <Card className="hover:scale-105 transition-transform cursor-pointer">
      <CardContent className="p-4 text-center">
        <img 
          src={item.image_url} 
          alt={item.name} 
          className="w-16 h-16 mx-auto mb-3 rounded-lg object-cover"
        />
        <h3 className="font-semibold text-sm mb-2">{item.name}</h3>
        <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
        <Button size="sm" className="w-full">
          {item.price} coins
        </Button>
      </CardContent>
    </Card>
  );
};