"use client";
import { useState, useEffect } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Check, MapPin, Clock, Truck } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cooksByState } from "@/lib/data/states";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Cook,
  MenuItem,
  dayMapping,
  WeeklySchedule,
  DayOfWeek,
} from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Minus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

// Add these helper functions before the component

interface CartItem {
  id: string;
  cookId: string;
  name: string;
  description: string;
  price: number;
  dietaryType: "veg" | "non-veg" | "vegan";
  mealType: "breakfast" | "lunch" | "dinner";
  dayOfWeek: string;
  quantity: number;
}

const { toast } = useToast();

export default function CookProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const [cookData, setCookData] = useState<Cook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const getCurrentDayNumber = (): DayOfWeek => {
    const day = new Date().getDay();
    return (day === 0 ? 7 : day) as DayOfWeek;
  };
  // Add state for selected day
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(
    getCurrentDayNumber()
  );
  const day = selectedDay;
  const dayName = dayMapping[day as DayOfWeek];
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Find cook from all states
  const cook = Object.values(cooksByState)
    .flat()
    .find((c) => c.id === params.id);

  if (!cook) {
    return <div>Cook not found</div>;
  }
  const { cart, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    const newQuantities: Record<string, number> = {};
    cart.forEach((item) => {
      newQuantities[item.id] = item.quantity;
    });
    setQuantities(newQuantities);
  }, [cart]);

  // Add getCartItemId helper
  const getCartItemId = (cookId: string, day: number) => `${cookId}-${day}`;

  const handleQuantityChange = (day: number, change: number) => {
    if (!cook) return;

    const itemId = getCartItemId(cook.id, day);
    const currentQty = quantities[itemId] || 0;
    const newQty = Math.max(0, currentQty + change);

    if (change < 0) {
      handleRemoveFromCart(day);
      return;
    }

    setQuantities((prev) => ({ ...prev, [itemId]: newQty }));

    const dayMenu = cook.menuItems.filter((item) => item.dayOfWeek === day);

    const bundledMenu: CartItem = {
      id: itemId,
      cookId: cook.id,
      name: `${cook.name}'s ${dayMapping[day as DayOfWeek]} Dabba`,
      description: `${dayMapping[day as DayOfWeek]}'s special dabba`,
      price: dayMenu.reduce((total, item) => total + item.price, 0),
      dietaryType: dayMenu[0]?.dietaryType || "veg",
      cuisineType: dayMenu[0]?.cuisineType || "indian",
      mealType: "lunch",
      dayOfWeek: day, 
      isAvailable: true,
      quantity: newQty,
      menuItems: dayMenu,
    };

    addToCart(bundledMenu);
    toast({
      title: "Added to cart",
      description: `${cook.name}'s ${
        dayMapping[day as DayOfWeek]
      } Dabba has been added to your cart.`,
    });
  };

  // Add remove handler
  const handleRemoveFromCart = (day: number) => {
    if (!cook) return;
    const itemId = getCartItemId(cook.id, day);
    removeFromCart(itemId);
    const newQuantities = { ...quantities };
    delete newQuantities[itemId];
    setQuantities(newQuantities);
    toast({
      title: "Removed from cart",
      description: `${cook.name}'s ${
        dayMapping[day as DayOfWeek]
      } Dabba has been removed from your cart.`,
    });
  };

  useEffect(() => {
    const fetchCookData = async () => {
      try {
        setIsLoading(true);
        const supabase = createClient();

        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        // Find static cook data  
        const staticCook = Object.values(cooksByState)
          .flat()
          .find((c) => c.id === params.id);

        // Fetch dynamic cook data
        const { data: dynamicCook, error: cookError } = await supabase
          .from("cooks")
          .select(
            `
            *,
            dabba_menu (*)
          `
          )
          .eq("id", params.id)
          .single();

        if (cookError) throw cookError;

        // Merge static and dynamic data
        const mergedCook = {
          ...staticCook,
          ...dynamicCook,
          menuItems: dynamicCook?.dabba_menu || staticCook?.menuItems,
        };

        setCookData(mergedCook);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCookData();
  }, [params.id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!cookData) return <div>Cook not found</div>;

  return (
    <div className="container mx-auto py-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Image
                src={
                  cook.profilePicture ||
                  "https://source.unsplash.com/random/100x100?chef"
                }
                alt={cook.name}
                width={80}
                height={80}
                className="rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold">{cook.name}</h1>
                <p className="text-muted-foreground">Cooking & Baking</p>
                <p className="text-sm text-muted-foreground">
                  {cook.certification}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="flex items-center gap-2 p-4">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{cook.address}</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-2 p-4">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Pre-order: 1 hour in advance</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-2 p-4">
                  <Truck className="h-4 w-4" />
                  <span className="text-sm">Delivery available</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-2 p-4">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Delivery radius: 2.5 km</span>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">About</h2>
              <p className="text-muted-foreground">
                I am a home chef who loves to cook and bake. I specialize in
                South Indian cuisine. I use organic ingredients and cook with
                love.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Food Certification</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Food Safety Training</span>
                  <Badge variant="outline">
                    <Check className="mr-1 h-3 w-3" /> Completed
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Aadhaar Verification</span>
                  <Badge variant="outline">
                    <Check className="mr-1 h-3 w-3" /> Verified
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>PAN</span>
                  <Badge variant="outline">
                    <Check className="mr-1 h-3 w-3" /> Verified
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Tabs defaultValue="menu" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="menu">Today's Dabba</TabsTrigger>
              <TabsTrigger value="schedule">This week's Dabba</TabsTrigger>
            </TabsList>
            <TabsContent value="menu">
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold">Today's Dabba</h3>
                      <Badge variant="secondary">
                        {cook.menuItems.find(
                          (item) => item.dayOfWeek === getCurrentDayNumber()
                        )?.dietaryType || "veg"}
                      </Badge>
                    </div>

                    <ScrollArea className="h-[250px]">
                      <div className="space-y-2">
                        {cook.menuItems
                          .filter(
                            (item) => item.dayOfWeek === getCurrentDayNumber()
                          )
                          .map((item) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-start border-b pb-2"
                            >
                              <div>
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {item.description}
                                </p>
                              </div>
                              <p className="font-semibold">₹{item.price}</p>
                            </div>
                          ))}
                      </div>
                      <ScrollBar orientation="vertical" />
                    </ScrollArea>

                    <div className="flex justify-between items-center mt-2">
                      <div className="text-lg font-semibold">
                        Total: ₹
                        {cook.menuItems
                          .filter(
                            (item) => item.dayOfWeek === getCurrentDayNumber()
                          )
                          .reduce((total, item) => total + item.price, 0)}
                      </div>
                      {quantities[`${cook.id}-${day}`] ? (
                        <div className="flex items-center gap-2">
                          {quantities[
                            getCartItemId(cook.id, getCurrentDayNumber())
                          ] ? (
                            <>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() =>
                                  handleQuantityChange(
                                    getCurrentDayNumber(),
                                    -1
                                  )
                                }
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">
                                {
                                  quantities[
                                    getCartItemId(
                                      cook.id,
                                      getCurrentDayNumber()
                                    )
                                  ]
                                }
                              </span>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() =>
                                  handleQuantityChange(getCurrentDayNumber(), 1)
                                }
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={() =>
                                handleQuantityChange(getCurrentDayNumber(), 1)
                              }
                            >
                              Add Today's Dabba
                            </Button>
                          )}
                        </div>
                      ) : (
                        // Keep existing Add button
                        <Button
                          className="w-[200px]"
                          onClick={() => {
                            const dayMenu = cook.menuItems.filter(
                              (item) => item.dayOfWeek === Number(day)
                            );
                            const bundledMenu: CartItem = {
                              id: `${cook.id}-${day}`,
                              cookId: cook.id,
                              name: `${cook.name}'s ${dayName} Dabba`,
                              description: `${dayName}'s special dabba by ${cook.name}`,
                              price: dayMenu.reduce(
                                (total, item) => total + item.price,
                                0
                              ),
                              dietaryType: dayMenu[0]?.dietaryType || "veg",
                              cuisineType: dayMenu[0]?.cuisineType || "indian",
                              mealType: dayMenu[0]?.mealType || "lunch",
                              dayOfWeek: Number(day) as DayOfWeek,
                              isAvailable: true,
                              quantity: 1,
                              menuItems: dayMenu,
                            };
                            addToCart(bundledMenu);
                            setQuantities((prev) => ({
                              ...prev,
                              [`${cook.id}-${day}`]: 1,
                            }));
                            toast({
                              title: "Added to cart",
                              description: `${dayName}'s Dabba has been added to your cart.`,
                            });
                          }}
                        >
                          Add {dayName}'s Dabba
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule">
              <Card>
                <CardContent className="p-4">
                  <Tabs
                    defaultValue={getCurrentDayNumber().toString()}
                    className="flex"
                  >
                    <TabsList className="w-[150px] h-full flex-col">
                      {Object.entries(dayMapping).map(([day, dayName]) => (
                        <TabsTrigger
                          key={day}
                          value={day}
                          className="justify-start w-full"
                        >
                          {dayName}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {Object.entries(dayMapping).map(([day, dayName]) => (
                      <TabsContent
                        key={day}
                        value={day}
                        className="flex-1 ml-4"
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold">
                              {dayName}'s Menu
                            </h3>
                            <Badge variant="secondary">
                              {cook.menuItems.find(
                                (item) => item.dayOfWeek === Number(day)
                              )?.dietaryType || "veg"}
                            </Badge>
                          </div>

                          <ScrollArea className="h-[250px]">
                            <div className="space-y-2">
                              {cook.menuItems
                                .filter(
                                  (item) => item.dayOfWeek === Number(day)
                                )
                                .map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex justify-between items-start border-b pb-2"
                                  >
                                    <div>
                                      <h4 className="font-medium">
                                        {item.name}
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        {item.description}
                                      </p>
                                    </div>
                                    <p className="font-semibold">
                                      ₹{item.price}
                                    </p>
                                  </div>
                                ))}
                            </div>
                            <ScrollBar orientation="vertical" />
                          </ScrollArea>

                          <div className="flex justify-between items-center mt-2">
                            <div className="text-lg font-semibold">
                              Total: ₹
                              {cook.menuItems
                                .filter(
                                  (item) => item.dayOfWeek === Number(day)
                                )
                                .reduce((total, item) => total + item.price, 0)}
                            </div>
                            {quantities[`${cook.id}-${day}`] ? (
                              <div className="flex items-center gap-2">
                                {quantities[
                                  getCartItemId(cook.id, Number(day))
                                ] ? (
                                  <>
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      onClick={() =>
                                        handleQuantityChange(Number(day), -1)
                                      }
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center">
                                      {
                                        quantities[
                                          getCartItemId(cook.id, Number(day))
                                        ]
                                      }
                                    </span>
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      onClick={() =>
                                        handleQuantityChange(Number(day), 1)
                                      }
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    onClick={() =>
                                      handleQuantityChange(Number(day), 1)
                                    }
                                  >
                                    Add {dayName}'s Dabba
                                  </Button>
                                )}
                              </div>
                            ) : (
                              // Keep existing Add button
                              <Button
                                className="w-[200px]"
                                onClick={() => {
                                  const dayMenu = cook.menuItems.filter(
                                    (item) => item.dayOfWeek === Number(day)
                                  );
                                  const bundledMenu: CartItem = {
                                    id: `${cook.id}-${day}`,
                                    cookId: cook.id,
                                    name: `${cook.name}'s ${dayName} Dabba`,
                                    description: `${dayName}'s special dabba by ${cook.name}`,
                                    price: dayMenu.reduce(
                                      (total, item) => total + item.price,
                                      0
                                    ),
                                    dietaryType:
                                      dayMenu[0]?.dietaryType || "veg",
                                    cuisineType:
                                      dayMenu[0]?.cuisineType || "indian",
                                    mealType: dayMenu[0]?.mealType || "lunch",
                                    dayOfWeek: Number(day) as DayOfWeek,
                                    isAvailable: true,
                                    quantity: 1,
                                    menuItems: dayMenu,
                                  };
                                  addToCart(bundledMenu);
                                  setQuantities((prev) => ({
                                    ...prev,
                                    [`${cook.id}-${day}`]: 1,
                                  }));
                                  toast({
                                    title: "Added to cart",
                                    description: `${dayName}'s Dabba has been added to your cart.`,
                                  });
                                }}
                              >
                                Add {dayName}'s Dabba
                              </Button>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
