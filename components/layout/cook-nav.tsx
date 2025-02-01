"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/cart-provider";
import { useToast } from "@/components/ui/use-toast";
import {Input_search2} from "@/components/ui/search-bar";
import { UserNav } from "@/components/layout/User-nav";
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";

const navItems = [
  { title: "Profile", href: "/cook/profile" },
  { title: "MyDabba", href: "/cook/menu" },
  { title: "Orders", href: "/cook/orderprog" },
  { title: "Payments", href: "/cook/payments" },
];

export function CookNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { cart, getCartTotal } = useCart();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = getCartTotal();
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    router.push("/");
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="mr-4 flex items-center justify-between w-full">
      <div className="flex items-center">
        <Link
          href="/cook/dashboard"
          className="mr-6 flex items-center space-x-2"
        >
          <Image
            src="https://ejtjwejiulepzcglswis.supabase.co/storage/v1/object/public/webpage-images//logo.png"
            alt="CampusDabba Logo"
            width={60}
            height={60}
            className="mr-4 rounded-lg"
          />
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.href
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        {!["/cook/search", "/cook/login", "/cook/register"].includes(
          pathname
        ) && (
          <Link href="/chatbot">
            <Input_search2 />
          </Link>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/cook/orderprog" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Active Orders</span>
          </Link>
        </Button>
        {session ? (
          <UserNav
            onLogout={async () => {
              const { error } = await supabase.auth.signOut();
              if (error) {
                toast({
                  title: "Error logging out",
                  description: error.message,
                  variant: "destructive",
                });
                return;
              }
              toast({
                title: "Logged out successfully",
                description: "You have been logged out of your account.",
              });
              setSession(null);
              router.push("/cook/login");
            }}
          />
        ) : (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cook/login">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
