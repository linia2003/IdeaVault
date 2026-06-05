"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button, Input } from "@heroui/react";
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
      const { data, error } = await authClient.signIn.email({
        email: email,
        password: password,
      });

      if (error) {
        toast.error(error.message || "Invalid credentials provided.");
        return;
      }

      toast.success("Welcome back to IdeaVault!");
      router.push(fromRoute);
      router.refresh();
    } catch (err) {
      toast.error("An unexpected error occurred during account login.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: fromRoute,
      });
      toast.success("Connecting to Google Auth Channel...");
    } catch (err) {
      toast.error("Failed to initialize Google login pathway.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900 rounded-3xl p-8">
      
      <div className="flex flex-col gap-1 items-start mb-6">
        <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
          Account Login
        </h2>
        <p className="text-zinc-500 text-xs">
          Access your personal workspace portfolio and interactions hub.
        </p>
      </div>

     
      <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
        <Input
          type="email"
          label="Email Address"
          placeholder="name@example.com"
          variant="bordered"
          radius="xl"
          isRequired
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          startContent={<LucideMail className="text-zinc-400 w-4 h-4 shrink-0" />}
        />
        
        <div>
          <Input
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="••••••••"
            variant="bordered"
            radius="xl"
            isRequired
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            startContent={<LucideLock className="text-zinc-400 w-4 h-4 shrink-0" />}
            endContent={
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="text-zinc-400 hover:text-zinc-600 focus:outline-none shrink-0"
              >
                {showPassword ? <LucideEyeOff size={18} /> : <LucideEye size={18} />}
              </button>
            }
          />
          
          
          <div className="flex justify-end mt-1.5 px-1">
            <button 
              type="button" 
              onClick={() => toast.error("Forget password routing behavior is under UI mock constraints.")} 
              className="text-xs font-semibold text-zinc-500 hover:text-blue-600 hover:underline transition-colors"
            >
              Forget Password?
            </button>
          </div>
        </div>

        <Button
          type="submit"
          color="primary"
          className="w-full font-bold h-11 rounded-xl mt-1 shadow-lg shadow-blue-600/10"
          isLoading={loading}
        >
          Sign In
        </Button>
      </form>

      
      <div className="flex items-center gap-2 my-6">
        <div className="flex-grow h-[1px] bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider whitespace-nowrap">
          or continue with
        </span>
        <div className="flex-grow h-[1px] bg-zinc-200 dark:bg-zinc-800" />
      </div>

      
      <Button
        variant="bordered"
        radius="xl"
        className="w-full h-11 font-semibold border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        startContent={!googleLoading && <FcGoogle size={20} />}
        onPress={handleGoogleLogin}
        isLoading={googleLoading}
      >
        Sign In with Google
      </Button>

      {/* Requirement: Link to Register */}
      <p className="text-center text-xs text-zinc-500 mt-6">
        Don't have an account yet?{" "}
        <Link href="/register" className="text-blue-600 font-bold hover:underline">
          Register here
        </Link>
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