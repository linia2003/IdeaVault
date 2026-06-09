"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out safely.");
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Failed to complete signout.");
    }
  };

  return (
    <nav className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl h-16 px-6 flex items-center justify-between">
        
        <Link href="/" className="text-xl font-black text-zinc-950 dark:text-white tracking-tight">
          Idea<span className="text-blue-600">Vault</span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
          <Link 
            href="/" 
            className={`transition-colors ${pathname === "/" ? "text-blue-600 font-bold" : "hover:text-zinc-950 dark:hover:text-white"}`}
          >
            Home
          </Link>
          <Link 
            href="/ideas" 
            className={`transition-colors ${pathname === "/ideas" ? "text-blue-600 font-bold" : "hover:text-zinc-950 dark:hover:text-white"}`}
          >
            Ideas
          </Link>

          {user ? (
            <>
              <Link 
                href="/add-idea" 
                className={`transition-colors ${pathname === "/add-idea" ? "text-blue-600 font-bold" : "hover:text-blue-500"}`}
              >
                Add Idea
              </Link>
              <Link 
                href="/my-ideas" 
                className={`transition-colors ${pathname === "/my-ideas" ? "text-blue-600 font-bold" : "hover:text-zinc-950 dark:hover:text-white"}`}
              >
                My Ideas
              </Link>
              <Link 
                href="/my-interactions" 
                className={`transition-colors ${pathname === "/my-interactions" ? "text-blue-600 font-bold" : "hover:text-zinc-950 dark:hover:text-white"}`}
              >
                My Interactions
              </Link>
              
              <div className="flex items-center gap-3 pl-2 border-l border-zinc-200 dark:border-zinc-800">
                <img 
                  src={user?.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100"} 
                  alt={user?.name} 
                  className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={handleSignOut}
                  className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white px-3 h-8 rounded-xl text-xs transition-colors font-bold"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className={`transition-colors ${pathname === "/login" ? "text-blue-600 font-bold" : "hover:text-zinc-950 dark:hover:text-white"}`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 px-4 h-9 flex items-center justify-center rounded-xl text-xs transition-colors font-bold shadow-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}