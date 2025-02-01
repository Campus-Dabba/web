"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/providers/cart-provider";
import { dayMapping } from "@/types";
import { Badge } from "@/components/ui/badge";

type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const dayNames: Record<DayOfWeek, string> = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
};

const getDayName = (dayNumber: number): string => {
  return dayNames[dayNumber as DayOfWeek] || "Invalid day";
};

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { toast } = useToast();
  const total = getCartTotal();

  const handleUpdateQuantity = (id: string, change: number) => {
    const item = cart.find((item) => item.id === id);
    if (item) {
      const newQuantity = Math.max(0, item.quantity + change);
      if (newQuantity === 0) {
        removeFromCart(id);
        toast({
          description: "Item removed from cart",
        });
      } else {
        updateQuantity(id, newQuantity);
      }
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Your cart is empty</p>
          <Link href="/" className="mt-4">
            <Button className="mt-4">Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      {item.item_name?.includes("undefined")
                        ? item.item_name.replace("undefined", " ")
                        : item.item_name}
                    </h3>
                    
                    <p className="text-muted-foreground">₹{item.price}</p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                      {item.dietary_type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleUpdateQuantity(item.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleUpdateQuantity(item.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() =>
                        handleUpdateQuantity(item.id, -item.quantity)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-end gap-4">
            <div className="text-lg">
              Total: <span className="font-bold">₹{total}</span>
            </div>
            <Link href="/checkout">
              <Button
                size="lg"
                onClick={() => {
                  toast({
                    title: "Proceeding to checkout",
                    description: "Redirecting to payment page...",
                  });
                }}
              >
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
