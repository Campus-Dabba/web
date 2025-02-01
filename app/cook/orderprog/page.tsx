"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { formatDistance } from "date-fns";

type Order = {
  id: string;
  created_at: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  customer_name: string;
  items: any[];
  total_amount: number;
};

export default function OrderHandlerPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  const supabase = createClient();

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data } = await supabase
          .from('orders')
          .select('*, customers(full_name)')
          .eq('cook_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (data) setOrders(data);
      }
    };

    fetchOrders();

    // Set up real-time subscription
    const channel = supabase
      .channel('orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
        payload => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (!error) {
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          All Orders
        </button>
        <button 
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Active Orders
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Completed Orders
        </button>
      </div>

      <div className="space-y-4">
        {orders
          .filter(order => {
            if (filter === 'active') return order.status !== 'delivered';
            if (filter === 'completed') return order.status === 'delivered';
            return true;
          })
          .map(order => (
            <div key={order.id} className="border p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                  <p className="text-sm text-gray-600">
                    {formatDistance(new Date(order.created_at), new Date(), { addSuffix: true })}
                  </p>
                  <p className="mt-2">Customer: {order.customer_name}</p>
                  <p>Total: ₹{order.total_amount}</p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <select 
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                    className="border rounded p-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                  </select>
                  
                  <span className={`px-2 py-1 rounded text-sm ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}