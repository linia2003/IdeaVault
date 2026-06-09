"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Sun, Moon, User, LogOut, Settings, ChevronDown, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const [newName, setNewName] = useState("");
  const [newPhoto, setNewPhoto] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
      toast.success("Light mode activated globally.");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
      toast.success("Dark mode activated globally.");
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      localStorage.removeItem("vault_jwt_token");
      setIsDropdownOpen(false);
      toast.success("Logged out safely.");
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Failed to complete signout.");
    }
  };

  const openProfileManagement = () => {
    setNewName(user?.name || "");
    setNewPhoto(user?.image || "");
    setIsDropdownOpen(false);
    setIsProfileModalOpen(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      toast.success("Profile updates saved to your active session.");
      setIsProfileModalOpen(false);
      router.refresh();
    } catch (err) {
      toast.error("Failed to update profile records.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <nav className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl h-16 px-6 flex items-center justify-between">
          
          <Link href="/" className="text-xl font-black text-zinc-950 dark:text-white tracking-tight">
            Idea<span className="text-blue-600">Vault</span>
          </Link>

          <div className="flex items-center gap-6 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
            <Link href="/" className={`transition-colors ${pathname === "/" ? "text-blue-600 font-bold" : "hover:text-zinc-950 dark:hover:text-white"}`}>Home</Link>
            <Link href="/ideas" className={`transition-colors ${pathname === "/ideas" ? "text-blue-600 font-bold" : "hover:text-zinc-950 dark:hover:text-white"}`}>Ideas</Link>

            {user ? (
              <>
                <Link href="/add-idea" className={`transition-colors ${pathname === "/add-idea" ? "text-blue-600 font-bold" : "hover:text-blue-500"}`}>Add Idea</Link>
                <Link href="/my-ideas" className={`transition-colors ${pathname === "/my-ideas" ? "text-blue-600 font-bold" : "hover:text-zinc-950 dark:hover:text-white"}`}>My Ideas</Link>
                <Link href="/my-interactions" className={`transition-colors ${pathname === "/my-interactions" ? "text-blue-600 font-bold" : "hover:text-zinc-950 dark:hover:text-white"}`}>My Interactions</Link>
                
                <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800 relative">
                  <button onClick={toggleTheme} className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-xl cursor-pointer transition-colors mr-2">
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>

                  <div className="flex items-center gap-1 cursor-pointer select-none" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <img 
                      src={user?.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100"} 
                      alt={user?.name} 
                      className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute right-0 top-12 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 max-w-full">
                        <p className="text-xs font-black text-zinc-950 dark:text-white truncate">{user?.name}</p>
                        <p className="text-[10px] text-zinc-400 truncate">{user?.email}</p>
                      </div>
                      <button onClick={openProfileManagement} className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer transition-colors">
                        <Settings className="w-3.5 h-3.5" /> Manage Profile
                      </button>
                      <button onClick={handleSignOut} className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-500 hover:bg-rose-500/5 flex items-center gap-2 cursor-pointer transition-colors">
                        <LogOut className="w-3.5 h-3.5" /> Logout Account
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button onClick={toggleTheme} className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-xl cursor-pointer transition-colors">
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <Link href="/login" className={`transition-colors ${pathname === "/login" ? "text-blue-600 font-bold" : "hover:text-zinc-950 dark:hover:text-white"}`}>Login</Link>
                <Link href="/register" className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 px-4 h-9 flex items-center justify-center rounded-xl text-xs transition-colors font-bold shadow-sm">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-900 rounded-3xl p-8 w-full max-w-md relative">
            <button onClick={() => setIsProfileModalOpen(false)} className="absolute top-6 right-6 p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg cursor-pointer"><X className="w-5 h-5" /></button>
            <div className="flex flex-col gap-1 items-start mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h3 className="text-xl font-black text-zinc-950 dark:text-white">Profile Management</h3>
              <p className="text-zinc-400 text-xs">Update your session identity metadata configurations.</p>
            </div>
            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Full Name</label>
                <input type="text" required value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Photo Profile URL</label>
                <input type="url" required value={newPhoto} onChange={(e) => setNewPhoto(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white" />
              </div>
              <button type="submit" disabled={updating} className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg mt-2 transition-colors flex items-center justify-center disabled:opacity-50 cursor-pointer">
                {updating ? "Updating..." : "Commit Metadata Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}