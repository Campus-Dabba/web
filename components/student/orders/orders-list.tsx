"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface CookOrder {
  id: string;
  cook_id: string;
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  earnings: number;
  cook?: {
    first_name: string;
    last_name: string;
  };
}

export function OrdersList() {
  const [orders, setOrders] = useState<CookOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const supabase = createClient();
    try {
      setLoading(true);
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authUser) {
      const { data, error } = await supabase.from("cook_orders").select(`
          *,
          cook:cooks(first_name, last_name)
        `)
        .eq("cook_id", authUser.id)
          .single();

      if (error) throw error;
      setOrders(data || []);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
      toast({
        title: "Error",
        description: "Could not load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {order.cook?.first_name} {order.cook?.last_name}
                </CardTitle>
                <CardDescription>Order Summary</CardDescription>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Total Orders</p>
                  <p className="text-2xl font-bold">{order.total_orders}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold">{order.pending_orders}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Completed</p>
                  <p className="text-2xl font-bold">{order.completed_orders}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Earnings</p>
                  <p className="text-2xl font-bold">₹{order.earnings}</p>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      ))}
    </div>
  );
}
