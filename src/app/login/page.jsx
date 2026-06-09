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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data, error } = await authClient.signIn.email({ 
        email: email.trim(), 
        password: password 
      });

      if (error) {
        toast.error(error.message || "Credential matching mismatched. Review entry details.");
        return;
      }

      if (data?.user) {
        localStorage.setItem("vault_jwt_token", `jwt_bearer_token_session_${data.user.id}`);
      }

      toast.success("Welcome back to IdeaVault database matrix!");
      router.push(fromRoute);
      router.refresh();
    } catch (err) {
      console.error("Critical identity verification failure:", err);
      toast.error("Internal infrastructure issue encountered during authentication verification.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({ 
        provider: "google", 
        callbackURL: fromRoute 
      });
    } catch (err) {
      console.error("Google authentication channel sync drop:", err);
      toast.error("Handshake loop with external social authentication authority fractured.");
    }
  };
  
  return (
    <div className="w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-md bg-white dark:bg-zinc-900 rounded-2xl p-8 mx-auto">
      <div className="flex flex-col gap-1 items-start mb-6">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
          Account Login
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs">
          Verify authorization keys to pull your interactive conceptual tracking grid.
        </p>
      </div>

      <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
        
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Email Address</label>
          <div className="relative w-full flex items-center">
            <LucideMail className="absolute left-4 text-zinc-400 w-4 h-4 pointer-events-none" />
            <input
              type="email"
              required
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-900 dark:text-white transition-all"
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
              className="w-full h-11 pl-11 pr-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-900 dark:text-white transition-all"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 focus:outline-none cursor-pointer"
            >
              {showPassword ? <LucideEyeOff size={16} /> : <LucideEye size={16} />}
            </button>
          </div>
          
          <div className="flex justify-end mt-0.5 px-1">
            <button 
              type="button" 
              onClick={() => toast.error("Infrastructure alert: Mock system validation prevents password sync alterations.")} 
              className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Forget Password?
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl mt-1 shadow-sm transition-colors flex items-center justify-center text-sm disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Validating Session Tokens..." : "Secure Core Sign-In"}
        </button>
      </form>

      <div className="flex items-center gap-2 my-6">
        <div className="flex-grow h-[1px] bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider whitespace-nowrap">
          Alternative Sync Protocol
        </span>
        <div className="flex-grow h-[1px] bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full h-11 font-semibold border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2.5 text-sm cursor-pointer"
      >
        <FcGoogle size={18} />
        <span>Establish Google OAuth Sync</span>
      </button>

      <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6">
        Lacking clearance authorization keys?{" "}
        <Link href="/register" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="w-full min-h-[calc(100vh-12rem)] flex items-center justify-center py-8 px-4 bg-[#fafafa] dark:bg-[#0f0f11] transition-colors duration-200">
      <Suspense fallback={
        <div className="text-xs font-semibold tracking-widest text-zinc-400 uppercase animate-pulse">
          Validating Security Pipeline...
        </div>
      }>
        <LoginContent />
      </Suspense>
    </div>
  );
}