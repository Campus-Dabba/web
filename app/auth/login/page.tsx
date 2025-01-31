
"use client";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {Loader_login} from "@/components/ui/join_us";
import { LoginForm } from "@/components/auth/login-form";


export default function LoginPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex justify-center items-center">
          <div className="flex items-center text-5xl font-medium tracking-tight text-center">
            <Loader_login />
          </div>
        </div>
        <div className="flex-grow relative z-20 flex justify-center items-center my-8">
          <Image
            src="https://ejtjwejiulepzcglswis.supabase.co/storage/v1/object/public/webpage-images//login.webp"
            alt="Login Banner"
            width={500}
            height={700}
            className=" object-cover shadow-xl"
          />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "CampusDabba has transformed how I discover and enjoy authentic
              home-cooked meals. The variety and quality are amazing!"
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <p className="text-sm text-muted-foreground">
              Enter your credentials to sign in to your account
            </p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
