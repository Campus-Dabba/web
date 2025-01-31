import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { CookProfileForm } from "@/components/cook/profile-form"


export const metadata: Metadata = {
  title: "Cook Dashboard",
  description: "Manage your profile, orders, payments, and menu",
}

export default function CookDashboardPage() {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          <h1 className="text-3xl font-bold">Cook Registration</h1>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <CookProfileForm />
      </section>
    </div>
  )
}