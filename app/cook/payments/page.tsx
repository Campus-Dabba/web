"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchPayments = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data, error } = await supabase
          .from("payments")
          .select("*")
          .eq("cook_id", session.user.id)
          .order('created_at', { ascending: false });

        if (data) setPayments(data);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Payment History</h1>
      <div className="space-y-4">
        {payments.length === 0 ? (
          <p className="text-gray-500">No payment history found</p>
        ) : (
          payments.map((payment: any) => (
            <div 
              key={payment.id} 
              className="border p-4 rounded-lg shadow-sm"
            >
              <p>Amount: ₹{payment.amount}</p>
              <p>Date: {new Date(payment.created_at).toLocaleDateString()}</p>
              <p>Status: {payment.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}