"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Plus, Minus, ShoppingCart } from "lucide-react";

import { cooksByState } from "@/lib/data/states";
import { useCart } from "@/components/providers/cart-provider";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Cook, MenuItem, CartItem, DayOfWeek, dayMapping } from "@/types";
import { useState, useEffect } from "react";

interface CooksListProps {
  selectedState: string;
}

interface CookWithMenu extends Cook {
  menuItems: MenuItem[];
}

interface CartOperationResult {
  success: boolean;
  message: string;
}

const getCurrentDayNumber = (): DayOfWeek => {
  const day = new Date().getDay();
  return (day === 0 ? 7 : day) as DayOfWeek;
};

export function CooksList({ selectedState }: CooksListProps) {
  const { cart, addToCart, removeFromCart } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const cooks = cooksByState[selectedState] || [];

  useEffect(() => {
    const newQuantities: Record<string, number> = {};
    cart.forEach((item) => {
      newQuantities[item.id] = item.quantity;
    });
    setQuantities(newQuantities);
  }, [cart]);

  const getCartItemId = (cookId: string) =>
    `${cookId}-${getCurrentDayNumber()}`;

  const handleQuantityChange = (cook: CookWithMenu, change: number) => {
    const itemId = getCartItemId(cook.id);
    const currentQty = quantities[itemId] || 0;
    const newQty = Math.max(0, currentQty + change);

   

    if (change < 0) {
      handleRemoveFromCart(cook);
      return;
    }

    
    setQuantities((prev) => ({ ...prev, [itemId]: newQty }));

    const todayMenu = cook.menuItems.filter(
      (item) => item.dayOfWeek === getCurrentDayNumber()
    );

    const bundledMenu: CartItem = {
      id: itemId,
      cookId: cook.id,
      name: `${cook.name}'s ${dayMapping[getCurrentDayNumber()]} Dabba`,
      description: `${dayMapping[getCurrentDayNumber()]}'s special dabba`,
      price: todayMenu.reduce((total, item) => total + item.price, 0),
      dietaryType: todayMenu[0]?.dietaryType || "veg",
      cuisineType: todayMenu[0]?.cuisineType || "indian",
      mealType: "lunch",
      dayOfWeek: getCurrentDayNumber(),
      isAvailable: true,
      quantity: newQty,
      menuItems: todayMenu,
    };

    addToCart(bundledMenu);
    setQuantities((prev) => ({ ...prev, [itemId]: newQty }));

    toast({
      title: "Added to cart",
      description: `${cook.name}'s ${dayMapping[getCurrentDayNumber()]} Dabba has been added to your cart.`,
    });
  };
  const handleRemoveFromCart = (cook: CookWithMenu) => {
    try {
      const cartItemId = `${cook.id}-${getCurrentDayNumber()}`;
      removeFromCart(cartItemId);
      toast({
        title: "Removed from cart",
        description: `${cook.name}'s ${
          dayMapping[getCurrentDayNumber()]
        } Dabba has been removed from your cart.`,
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cooks.map((cook) => (
        <Card key={cook.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4">
              <AspectRatio ratio={1} className="h-12 w-12 flex-none">
                <Image
                  src={cook.profilePicture || "/placeholder-chef.jpg"}
                  alt={cook.name}
                  className="rounded-full object-cover"
                  fill
                  sizes="48px"
                />
              </AspectRatio>
              <div className="flex-1 space-y-1">
                <CardTitle className="text-lg">
                  <Link href={`/cooks/${cook.id}`} className="hover:underline">
                    {cook.name}
                  </Link>
                </CardTitle>
                <CardDescription>{cook.address}</CardDescription>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-sm">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>{cook.rating}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-6">
            <div className="flex gap-2">
              <Badge variant="secondary">{cook.totalOrders}+ orders</Badge>
              {cook.certification && (
                <Badge variant="outline">{cook.certification}</Badge>
              )}
            </div>
            <Separator className="my-2" />
            <div className="space-y-2">
              <div className="space-y-2 border border-primary p-2 rounded-md">
                {" "}
                {/* Added outline */}
                <h4 className="text-xl font-bold text-primary">Dabba:</h4>
                <ScrollArea className="h-48">
                  <div className="space-y-2 border border-primary p-2 rounded-md">
                    {" "}
                    {/* Added outline */}
                    {cook.menuItems
                      .filter(
                        (item) => item.dayOfWeek === getCurrentDayNumber()
                      )
                      .map((item) => (
                        <div key={item.id} className="text-sm">
                          <div className="flex justify-between">
                            <span>{item.name}</span>
                            <span>₹{item.price}</span>
                          </div>
                          <p className="text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      ))}
                  </div>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-semibold">
                  Total: ₹
                  {getTotalPrice(cook, quantities[getCartItemId(cook.id)] || 0)}
                </p>
                <div className="flex items-center gap-2">
                  {quantities[getCartItemId(cook.id)] ? (
                    <>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleRemoveFromCart(cook)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">
                        {quantities[getCartItemId(cook.id)]}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleQuantityChange(cook, 1)}
                      >
                        +
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => handleQuantityChange(cook, 1)}>
                      Add Today's Dabba
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="mt-2">
            <Button asChild className="w-full">
              <Link href={`/cooks/${cook.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  function getTotalPrice(cook: CookWithMenu, quantity: number): number {
    return (
      cook.menuItems
        .filter((item) => item.dayOfWeek === getCurrentDayNumber())
        .reduce((total, item) => total + item.price, 0) * quantity
    );
  }
}
