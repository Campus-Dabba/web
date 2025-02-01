"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Home, MapPin } from "lucide-react"

type AddressData = {
  street: string;
  city: string;
  state: string;
  pincode: string;
};

type UserInfo = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile_image: string | null;
  address: AddressData | null;
  created_at: string;
};

export default function CheckoutPage() {
  const { cart, getCartTotal } = useCart();
  const { toast } = useToast();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<AddressData>({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const supabase = createClient();

  const [activeSection, setActiveSection] = useState<'user' | 'address' | 'payment'>('user');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authUser) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select(`
            id,
            first_name,
            last_name,
            email,
            phone,
            profile_image,
            address,
            created_at
          `)
          .eq('id', authUser.id)
          .single();

        if (userError) throw userError;

        setUser({
          ...userData,
          address: userData.address as AddressData | null
        });

        // If user has saved address, populate the form
        if (userData.address) {
          setNewAddress(userData.address as AddressData);
          setUseNewAddress(false);
        } else {
          setUseNewAddress(true);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Please login first",
        description: "You need to be logged in to complete the checkout",
        variant: "destructive",
      });
      return;
    }

    const selectedAddress = useNewAddress ? newAddress : user.address;
    if (!selectedAddress?.street || !selectedAddress?.city || 
        !selectedAddress?.state || !selectedAddress?.pincode) {
      toast({
        title: "Missing address",
        description: "Please fill in all address fields",
        variant: "destructive",
      });
      return;
    }

    // Save new address to user profile if using new address
    if (useNewAddress) {
      try {
        const { error } = await supabase
          .from('users')
          .update({ address: newAddress })
          .eq('id', user.id);

        if (error) throw error;
      } catch (error) {
        console.error("Error saving address:", error);
        toast({
          title: "Error",
          description: "Failed to save address",
          variant: "destructive",
        });
        return;
      }
    }

    // Placeholder for payment gateway
    toast({
      title: "Redirecting to payment gateway",
      description: "You will be redirected to complete the payment",
    });
  };

  const canProceedToAddress = () => {
    return user !== null;
  };

  const canProceedToPayment = () => {
    const selectedAddress = useNewAddress ? newAddress : user?.address;
    return selectedAddress?.street && selectedAddress?.city && 
           selectedAddress?.state && selectedAddress?.pincode;
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.18; // 18% tax
  const total = subtotal + tax;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* User Information Section */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              {!user ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground">Please login to continue</p>
                  <Button asChild>
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/auth/register">Register</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone}</p>
                </div>
              )}
              {user && (
                <Button 
                  onClick={() => setActiveSection('address')}
                  className="mt-4"
                  disabled={!canProceedToAddress()}
                >
                  Next
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Delivery Address Section */}
          {activeSection !== 'user' && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent>
                {user?.address && (
                  <div className="space-y-4 mb-4">
                    <Label 
                      className="flex items-start space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer w-full"
                      htmlFor="saved-address"
                    >
                      <input
                        id="saved-address"
                        type="radio"
                        name="address"
                        checked={!useNewAddress}
                        onChange={() => setUseNewAddress(false)}
                        className="mt-1"
                      />
                      <div>
                        <p>{user.address.street}</p>
                        <p>{user.address.city}, {user.address.state} - {user.address.pincode}</p>
                      </div>
                    </Label>
                  </div>
                )}

                <Label 
                  className="flex items-center space-x-2 mb-4 p-2 border rounded hover:bg-gray-50 cursor-pointer w-full"
                  htmlFor="new-address"
                >
                  <input
                    id="new-address"
                    type="radio"
                    name="address"
                    checked={useNewAddress}
                    onChange={() => setUseNewAddress(true)}
                  />
                  <span>Use New Address</span>
                </Label>

                {useNewAddress && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        placeholder="Enter your street address"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="pincode">PIN Code</Label>
                      <Input
                        id="pincode"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      />
                    </div>
                  </div>
                )}
                <Button 
                  onClick={() => setActiveSection('payment')}
                  className="mt-4"
                  disabled={!canProceedToPayment()}
                >
                  Next
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Payment Method Section */}
          {activeSection === 'payment' && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="upi"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <Label htmlFor="upi">UPI</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="card"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <Label htmlFor="card">Credit/Debit Card</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary Section */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              < Link href="/payment" >
              <Button 
                className="w-full" 
                onClick={handlePayment}
                disabled={activeSection !== 'payment'}
              >
                Proceed to Payment
              </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}