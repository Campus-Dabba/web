"use client";

import { useState } from "react";
import { CooksList } from "@/components/student/dashboard/cooks-list";
import { StatesFilter } from "@/components/student/dashboard/states-filter";
import { states } from "@/lib/data/states";
import { StateCards } from "@/components/student/dashboard/StateCards";

export default function DashboardPage() {
  const [selectedState, setSelectedState] = useState<string>(states[0]);

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
        <h2 className="text-xl font-semibold mb-4">Households nearby you</h2>
      </div>

      <StatesFilter
        selectedState={selectedState}
        onStateChange={setSelectedState}
      />
      <CooksList selectedState={selectedState} />
    </div>
  );
}
