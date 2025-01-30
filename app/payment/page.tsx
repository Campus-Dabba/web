"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (timeLeft === 0) {
      router.push('/');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, router]);

  return (
    <div className="container mx-auto py-20">
      <Card className="max-w-md mx-auto text-center">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold mb-4">Payment Processing</h1>
          <div className="animate-pulse text-xl">Work in Progress...</div>
          <p className="text-muted-foreground">
            Redirecting to home in {timeLeft} seconds
          </p>
          <Button 
            onClick={() => router.push('/')}
            variant="outline"
          >
            Go to Home Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}