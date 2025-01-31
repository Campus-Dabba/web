import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { CookRegistrationForm } from "@/components/cook/registration-form"
import { BankDetailsForm } from "@/components/cook/bank-details-form"
import { OrdersList } from "@/components/student/orders/orders-list"
// import { PaymentsList } from "@/components/cook/payments"
import { CookProfileForm } from "@/components/cook/profile-form"
// import { RatingsList } from "@/components/cook/ratings-list"
import { MenuList } from "@/components/cook/menu-list"

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
          <h1 className="text-3xl font-bold">Cook Dashboard</h1>
        </div>
        <Link href="/cook/register" className="btn btn-primary">
          Register as a Cook
        </Link>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <CookProfileForm />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Bank Details</h2>
        <BankDetailsForm />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Orders</h2>
        <OrdersList />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Payments</h2>
        {/* <PaymentsList /> */}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Ratings</h2>
        {/* <RatingsList /> */}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Menu</h2>
        <MenuList />
      </section>
    </div>
  )
}

