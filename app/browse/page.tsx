"use client";

import type { Metadata } from "next";
import { CooksList } from "@/components/student/dashboard/cooks-list";
import { StatesFilter } from "@/components/student/dashboard/states-filter";
import { createContext, useState } from "react";
import { metadata } from "./metadata";

export default function BrowseCooksPage() {
  const [selectedState, setSelectedState] = useState("All States");

  const handleStateChange = (state: string) => {
    setSelectedState(state);
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Browse Cooks</h1>
        <p className="text-muted-foreground">
          Discover talented home cooks and their delicious offerings
        </p>
      </div>
      <StatesFilter
        selectedState={selectedState}
        onStateChange={handleStateChange}
      />
      <CooksList selectedState={selectedState} />
    </div>
  );
}
