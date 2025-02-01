"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function StatePage() {
  const [stateData, setStateData] = useState({
    cooks: [],
    meals: [],
    loading: true,
    error: null
  });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchStateData = async () => {
      const selectedState = localStorage.getItem('selectedState');
      
      if (!selectedState) {
        router.push('/');
        return;
      }

      try {
        // Fetch cooks from selected state
        const { data: cooks, error: cooksError } = await supabase
          .from('cooks')
          .select('*')
          .eq('state', selectedState);

        // Fetch meals from cooks in this state
        const { data: meals, error: mealsError } = await supabase
          .from('meals')
          .select('*')
          .in('cook_id', cooks?.map(cook => cook.id) || []);

        if (cooksError || mealsError) throw new Error('Failed to fetch data');

        setStateData({
          cooks: cooks || [],
          meals: meals || [],
          loading: false,
          error: null
        });
      } catch (error) {
        setStateData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load state data'
        }));
      }
    };

    fetchStateData();
  }, []);

  if (stateData.loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (stateData.error) {
    return <div className="p-6 text-red-500">{stateData.error}</div>;
  }

  const selectedState = localStorage.getItem('selectedState');

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{selectedState}</h1>
        <p className="text-gray-600">
          {stateData.cooks.length} Cooks Available • {stateData.meals.length} Meals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stateData.cooks.map((cook: any) => (
          <div key={cook.id} className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold">{cook.name}</h3>
            <p className="text-sm text-gray-600">{cook.specialty}</p>
            {/* Add more cook details as needed */}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Available Meals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stateData.meals.map((meal: any) => (
            <div key={meal.id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold">{meal.name}</h3>
              <p className="text-sm text-gray-600">₹{meal.price}</p>
              {/* Add more meal details as needed */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}