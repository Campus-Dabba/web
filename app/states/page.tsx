"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CooksList from "@/components/student/dashboard/cooks-list";

export default function StatePage() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const state = localStorage.getItem('selectedState');
    if (!state) {
      router.push('/');
      return;
    }
    setSelectedState(state);
  }, [router]);

  if (!selectedState) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">
        Cooks in {selectedState}
      </h1>
      <CooksList selectedState={selectedState} />
    </div>
  );
}