"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button, Input } from "@heroui/react";
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
      toast.error("Password must be at least 6 characters long!");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter!");
      return;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain at least one lowercase letter!");
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
        toast.error(error.message || "Registration failed!");
        return;
      }

      toast.success("Account created successfully!");
      router.push("/login");
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong during account creation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-12rem)] flex items-center justify-center py-6">
      <div className="w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900 rounded-3xl p-8">
        <div className="flex flex-col gap-1 items-start mb-6">
          <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">Create an Account</h2>
          <p className="text-zinc-500 text-xs">Join IdeaVault to submit and validate startup concepts.</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            placeholder="Enter your name"
            variant="bordered"
            radius="xl"
            isRequired
            value={name}
            onChange={(e) => setName(e.target.value)}
            startContent={<LucideUser className="text-zinc-400 w-4 h-4 shrink-0" />}
          />
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
          <Input
            label="Photo URL (Optional)"
            placeholder="https://example.com/avatar.jpg"
            variant="bordered"
            radius="xl"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            startContent={<LucideImage className="text-zinc-400 w-4 h-4 shrink-0" />}
          />
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
            endContent = {
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-zinc-400 hover:text-zinc-600 focus:outline-none shrink-0">
                {showPassword ? <LucideEyeOff size={18} /> : <LucideEye size={18} />}
              </button>
            }
          />
          <Button type="submit" color="primary" className="w-full font-bold h-11 rounded-xl mt-2 shadow-lg shadow-blue-600/10" isLoading={loading}>
            Sign Up
          </Button>
        </form>

        <p className="text-center text-xs text-zinc-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}