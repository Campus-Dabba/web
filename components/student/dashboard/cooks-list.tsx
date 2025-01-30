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
import { Cook, MenuItem, CartItem } from "@/types";

interface CooksListProps {
  selectedState: string;
}

interface CookWithMenu extends Cook {
  menuItems: MenuItem[];
}

export function CooksList({ selectedState }: CooksListProps) {
  const cooks = cooksByState[selectedState as keyof typeof cooksByState] || [];
  const { cart, addToCart, removeFromCart } = useCart();

  const handleAddToCart = (cook: CookWithMenu) => {
    const bundledMenu: CartItem = {
      id: cook.id,
      cookId: cook.id,
      name: `${cook.name}'s Complete Menu`,
      description: `Full menu by ${cook.name}`,
      price: cook.menuItems.reduce((total, item) => total + item.price, 0),
      dietaryType: "veg", // Default or derive from items
      cuisineType: "indian", // Default or derive from items
      mealType: "lunch", // Default or derive from items
      dayOfWeek: 1, // Default value
      isAvailable: true,
      quantity: 1,
      menuItems: cook.menuItems,
    };

    addToCart(bundledMenu);
    toast({
      title: "Added to cart",
      description: `${cook.name}'s complete menu has been added to your cart.`,
    });
  };

  const handleRemoveFromCart = (cook: CookWithMenu) => {
    removeFromCart(cook.id);
    toast({
      title: "Removed from cart",
      description: `${cook.name}'s menu has been removed from your cart.`,
    });
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
                    {cook.menuItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-start"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ₹{item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="text-lg font-semibold">
                  Total: ₹
                  {cook.menuItems.reduce(
                    (total, item) => total + item.price,
                    0
                  )}
                </div>
                {cart.find((item) => item.id === cook.id) ? (
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveFromCart(cook)}
                  >
                    Remove Dabba
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    onClick={() => handleAddToCart(cook)}
                  >
                    Add Dabba to Cart
                  </Button>
                )}
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
}
