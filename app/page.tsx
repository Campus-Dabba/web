"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { CooksList } from "@/components/student/dashboard/cooks-list";
import { StatesFilter } from "@/components/student/dashboard/states-filter";
import { states } from "@/lib/data/states";
import { StateCards } from "@/components/student/dashboard/StateCards";
import { MapPreview } from "@/components/map/map-preview";

export default function DashboardPage() {
  const [selectedState, setSelectedState] = useState<string>(states[0]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Check if user is a cook
        const { data: cook } = await supabase
          .from("cooks")
          .select("*")
          .eq("cook_id", session.user.id)
          .single();

        if (cook) {
          router.push("/cook/dashboard");
          return;
        }
      }
    };

    checkUserRole();
  }, [router]);

  return (
    <div className="space-y-6">
      {/* Header Section with Background */}
      <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://img.freepik.com/premium-photo/cozy-kitchen-with-plants-sunlight_21085-115553.jpg?w=1480')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative h-full flex flex-col justify-center px-6 z-10">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-gray-200">
            Browse delicious home-cooked meals from verified cooks in your area
          </p>
        </div>
      </div>
      <StateCards
        states={states}
        selectedState={selectedState}
        onStateSelect={setSelectedState}
      />

      <div className="px-6">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-orange-300 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent border-b-2 border-orange-300 dark:border-blue-300 pb-2">
          Households nearby you
        </h2>
      </div>

      <StatesFilter
        selectedState={selectedState}
        onStateChange={setSelectedState}
      />
      <CooksList selectedState={selectedState} />
      <div className="px-6">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-orange-300 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent border-b-2 border-orange-300 dark:border-blue-300 pb-2">
          Dabba Providers near you
        </h2>
      </div>

      <MapPreview>{/* Map component and related logic goes here */}</MapPreview>

      <footer className="mt-8 p-6 bg-gray-800 text-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="font-semibold text-lg">Contact Us</h3>
            <p className="mt-2">Email: contact@example.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
          <div className="mb-6 md:mb-0">
            <h3 className="font-semibold text-lg">Help</h3>
            <p className="mt-2">FAQ</p>
            <p>Support</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">About Us</h3>
            <p className="mt-2">Company Info</p>
            <p>Careers</p>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Campus Dabba. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
