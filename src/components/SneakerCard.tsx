import { Heart, Star, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Sneaker } from "@/data/mockData";

export function SneakerCard({ sneaker, compact }: { sneaker: Sneaker; compact?: boolean }) {
  const discount = sneaker.originalPrice
    ? Math.round(((sneaker.originalPrice - sneaker.price) / sneaker.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className="relative aspect-square overflow-hidden bg-secondary/50">
        <img src={sneaker.image} alt={sneaker.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
        {sneaker.badge && (
          <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground text-[10px]">
            100% Original
          </Badge>
        )}
        {discount > 0 && (
          <Badge className="absolute right-3 top-3 bg-destructive text-destructive-foreground text-[10px]">
            -{discount}%
          </Badge>
        )}
        <button className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
          <Heart className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </button>
      </div>
      <div className={`p-4 ${compact ? "p-3" : ""}`}>
        <p className="text-xs font-medium text-primary">{sneaker.brand}</p>
        <h3 className="mt-1 text-sm font-semibold leading-tight">{sneaker.name}</h3>
        {!compact && (
          <div className="mt-1.5 flex items-center gap-1">
            <Star className="h-3 w-3 fill-warning text-warning" />
            <span className="text-xs text-muted-foreground">{sneaker.rating} ({sneaker.reviews})</span>
          </div>
        )}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">${sneaker.price}</span>
            {sneaker.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">${sneaker.originalPrice}</span>
            )}
          </div>
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
