"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LucideLock, LucideMail, LucideEye, LucideEyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromRoute = searchParams.get("callbackUrl") || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data, error } = await authClient.signIn.email({ email, password });
      if (error) {
        toast.error(error.message || "Invalid credentials.");
        return;
      }
      toast.success("Welcome back to IdeaVault!");
      router.push(fromRoute);
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await authClient.signIn.social({ provider: "google", callbackURL: fromRoute });
    } catch (err) {
      toast.error("Failed to connect Google login.");
      setGoogleLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900 rounded-3xl p-8 mx-auto mt-12">
      <div className="flex flex-col gap-1 items-start mb-6">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">Account Login</h2>
        <p className="text-zinc-500 text-xs">Access your portfolio and concept hub portfolio hub.</p>
      </div>

      <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Email Address</label>
          <div className="relative w-full flex items-center">
            <LucideMail className="absolute left-4 text-zinc-400 w-4 h-4 pointer-events-none" />
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white transition-colors"
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Password</label>
          <div className="relative w-full flex items-center">
            <LucideLock className="absolute left-4 text-zinc-400 w-4 h-4 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 pl-11 pr-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white transition-colors"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-4 text-zinc-400 hover:text-zinc-600 focus:outline-none"
            >
              {showPassword ? <LucideEyeOff size={18} /> : <LucideEye size={18} />}
            </button>
          </div>
          
          <div className="flex justify-end mt-0.5 px-1">
            <button 
              type="button" 
              onClick={() => toast.error("Forget password behavior is under mock constraints.")} 
              className="text-xs font-semibold text-zinc-500 hover:text-blue-600 transition-colors"
            >
              Forget Password?
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl mt-1 shadow-lg shadow-blue-600/10 transition-colors flex items-center justify-center text-sm disabled:opacity-50"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="flex items-center gap-2 my-6">
        <div className="flex-grow h-[1px] bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider whitespace-nowrap">or continue with</span>
        <div className="flex-grow h-[1px] bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full h-11 font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center text-sm"
      >
        <span>Sign In with Google</span>
      </button>

      <p className="text-center text-xs text-zinc-500 mt-6">
        Don't have an account yet?{" "}
        <Link href="/register" className="text-blue-600 font-bold hover:underline">Register here</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="w-full min-h-[calc(100vh-12rem)] flex items-center justify-center py-6">
      <Suspense fallback={<div className="text-sm font-medium text-zinc-400">Loading auth context...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}