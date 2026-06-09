"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LucideLock, LucideMail, LucideUser, LucideImage, LucideEye, LucideEyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    
    if (password.length < 6) { 
      toast.error("Password standard unmet: Minimum 6 characters required."); 
      return; 
    }
    if (!/[A-Z]/.test(password)) { 
      toast.error("Security policy warning: Include at least one uppercase character."); 
      return; 
    }
    if (!/[a-z]/.test(password)) { 
      toast.error("Security policy warning: Include at least one lowercase character."); 
      return; 
    }

    try {
      setLoading(true);
      const { data, error } = await authClient.signUp.email({
        email: email,
        password: password,
        name: name,
        image: photoUrl || undefined,
      });

      if (error) {
        toast.error(error.message || "Registration failed. Verify your input parameters.");
        return;
      }

      toast.success("Identity profile authorized successfully! Please sign in.");
      router.push("/login");
    } catch (err) {
      console.error("Auth tracking malfunction:", err);
      toast.error("Encountered an internal handshake issue. Try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-12rem)] flex items-center justify-center py-8 px-4 bg-[#fafafa] dark:bg-[#0f0f11] transition-colors duration-200">
      <div className="w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-md bg-white dark:bg-zinc-900 rounded-2xl p-8">
        
        <div className="flex flex-col gap-1 items-start mb-6">
          <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
            Create an Account
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs">
            Join IdeaVault to track, collaborate, and validate startup concepts.
          </p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Full Name</label>
            <div className="relative w-full flex items-center">
              <LucideUser className="absolute left-4 text-zinc-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                name="name" 
                required
                placeholder="Mahbuba Rahman"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-900 dark:text-white transition-all"
              />
            </div>
          </div>

          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Email Address</label>
            <div className="relative w-full flex items-center">
              <LucideMail className="absolute left-4 text-zinc-400 w-4 h-4 pointer-events-none" />
              <input
                type="email"
                name="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-900 dark:text-white transition-all"
              />
            </div>
          </div>

          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Photo URL</label>
            <div className="relative w-full flex items-center">
              <LucideImage className="absolute left-4 text-zinc-400 w-4 h-4 pointer-events-none" />
              <input
                type="url"
                name="photoUrl"
                required
                placeholder="https://images.unsplash.com/...image.jpg"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
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
                name="password"
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl mt-3 shadow-sm transition-colors flex items-center justify-center text-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Constructing Identity Record..." : "Authorize Registration"}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6">
          Already registered inside the vault?{" "}
          <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}