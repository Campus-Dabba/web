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
import { MenuItem, CartItem, DayOfWeek, dayMapping } from "@/types";
import { useState, useEffect } from "react";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";

interface Address {
  city: string;
  state: string;
  street: string;
  pincode: string;
}

export interface Cook {
  id: string;
  cook_id: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  price: number;
  rating: number;
  certification: string;
  address: Address;
  menuItems?: MenuItem[];
  totalOrders: number;
}

interface CookWithMenu extends Cook {
  menuItems?: MenuItem[];
}

interface CooksListProps {
  selectedState: string;
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
  const staticCooks = cooksByState[selectedState] || [];
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cooks, setCooks] = useState<Cook[]>([]);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCooks = async () => {
    const supabase = createClient();
    try {
      setIsLoading(true);

      // Simple query to check all regions first
      const { data: allRegions } = await supabase
        .from("cooks")
        .select("region");

      console.log("All available regions:", allRegions);

      // Try both exact and partial matches
      const { data: cooksData, error: cooksError } = await supabase
        .from("cooks")
        .select(
          `
        id,
        cook_id,
        first_name,
        last_name,
        address,
        rating,
        certification,
        profile_image
      `
        )
        .or(`region.eq.${selectedState},region.ilike.%${selectedState}%`);

      console.log("Query params:", selectedState);
      console.log("Found cooks:", cooksData);

      if (cooksError) {
        console.error("Supabase error:", cooksError);
        setError("Error fetching cooks");
        return;
      }

      if (!cooksData || cooksData.length === 0) {
        console.log("No cooks found in data:", cooksData);
        setError("No cooks found for this location");
        return;
      }

      // Fetch menu items with debug logging
      const cookIds = cooksData.map((cook) => cook.cook_id);
      const cookIdsArray = Array.isArray(cookIds) ? cookIds : [cookIds];

      if (!cookIdsArray.length) {
        console.error("No cook IDs to query");
        return;
      }

      console.log("Fetching menu items for cook IDs:", cookIdsArray);

      const { data: menuData, error: menuError } = await supabase
        .from("dabba_menu")
        .select("*")
        .in("cook_id", cookIdsArray);

      console.log("Menu data:", menuData);

      if (menuError) throw menuError;

      if (!menuData?.length) {
        console.warn(
          `No menu items found for cook IDs: ${cookIdsArray.join(", ")}`
        );
      }
      const processedCooks = cooksData.map((cook) => ({
        ...cook,
        id: cook.id,
        cook_id: cook.cook_id,
        first_name: cook.first_name,
        last_name: cook.last_name,
        price: menuData
          ?.filter((item) => item.cook_id === cook.cook_id)
          .reduce((total, item) => total + item.price, 0),
        profile_image: cook.profile_image,
        certification: cook.certification,
        totalOrders: 0,
        menuItems:
          menuData?.filter((item) => item.cook_id === cook.cook_id) || [],
      }));

      setCooks(processedCooks);

      console.log("Processed cooks:", processedCooks);
    } catch (error) {
      const err = error as Error;
      console.error(err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCooks();
  }, [selectedState]);

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
      (item) => item.day_of_week === getCurrentDayNumber()
    );

    const bundledMenu: CartItem = {
      id: itemId,
      cook_id: cook.cook_id,
      item_name: `${cook.first_name}'s ${
        dayMapping[getCurrentDayNumber()]
      } Dabba`,
      description: `${dayMapping[getCurrentDayNumber()]}'s special dabba`,
      price: todayMenu.reduce((total, item) => total + item.price, 0),
      dietary_type: todayMenu[0]?.dietary_type || "veg",
      cuisine_type: todayMenu[0]?.cuisine_type || "indian",
      meal_type: "lunch",
      day_of_week: getCurrentDayNumber(),
      isAvailable: true,
      quantity: newQty,
      menuItems: todayMenu,
    };

    addToCart(bundledMenu);
    setQuantities((prev) => ({ ...prev, [itemId]: newQty }));

    toast({
      title: "Added to cart",
      description: `${cook.first_name}'s ${
        dayMapping[getCurrentDayNumber()]
      } Dabba has been added to your cart.`,
    });
  };
  const handleRemoveFromCart = (cook: CookWithMenu) => {
    try {
      const cartItemId = `${cook.id}-${getCurrentDayNumber()}`;
      removeFromCart(cartItemId);
      toast({
        title: "Removed from cart",
        description: `${cook.first_name}'s ${
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

  if (isLoading) return <div>Loading cooks...</div>;

  const formatAddress = (address: Address): string => {
    return `${address.street}, ${address.city}, ${address.state} ${address.pincode}`;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cooks.map((cook) => (
        <Card key={cook.cook_id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4">
              <AspectRatio ratio={1} className="h-20 w-20 flex-none">
                <Image
                  src={cook.profile_image || "/placeholder-chef.jpg"}
                  alt={cook.first_name}
                  className="rounded-lg object-cover"
                  fill
                  sizes="80px"
                />
              </AspectRatio>
              <div className="flex-1 space-y-1">
                <CardTitle className="text-lg">
                  <Link href={`/cooks/${cook.id}`} className="hover:underline">
                    {cook.first_name}
                  </Link>
                </CardTitle>
                <CardDescription>
                  {cook.address
                    ? formatAddress(cook.address)
                    : "Address not available"}
                </CardDescription>
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
                        (item) => item.day_of_week === getCurrentDayNumber()
                      )
                      .map((item) => (
                        <div key={item.id} className="text-sm">
                          <div className="flex justify-between">
                            <span>{item.item_name}</span>
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
        .filter((item) => item.day_of_week === getCurrentDayNumber())
        .reduce((total, item) => total + item.price, 0) * quantity
    );
  }
}
