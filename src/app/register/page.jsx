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
    if (password.length < 6) { toast.error("Password must be at least 6 characters!"); return; }
    if (!/[A-Z]/.test(password)) { toast.error("Password needs an uppercase letter!"); return; }
    if (!/[a-z]/.test(password)) { toast.error("Password needs a lowercase letter!"); return; }

    try {
      setLoading(true);
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        image: photoUrl || undefined,
      });
      if (error) {
        toast.error(error.message || "Registration failed!");
        return;
      }
      toast.success("Account created successfully!");
      router.push("/login");
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-12rem)] flex items-center justify-center py-6">
      <div className="w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900 rounded-3xl p-8">
        <div className="flex flex-col gap-1 items-start mb-6">
          <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">Create an Account</h2>
          <p className="text-zinc-500 text-xs">Join IdeaVault to track and validate startup concepts.</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Full Name</label>
            <div className="relative w-full flex items-center">
              <LucideUser className="absolute left-4 text-zinc-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white transition-colors"
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Photo URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Photo URL</label>
            <div className="relative w-full flex items-center">
              <LucideImage className="absolute left-4 text-zinc-400 w-4 h-4 pointer-events-none" />
              <input
                type="url"
                required
                placeholder="Photo link URL"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white transition-colors"
              />
            </div>
          </div>

          {/* Password */}
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl mt-2 shadow-lg shadow-blue-600/10 transition-colors flex items-center justify-center text-sm disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}