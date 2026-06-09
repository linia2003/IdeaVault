"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="w-full max-w-md mx-auto py-24 text-center animate-fadeIn">
      <div className="border border-zinc-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900 rounded-3xl p-8 space-y-6">
        
        <div className="h-12 w-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto animate-pulse">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-black text-zinc-950 dark:text-white tracking-tight">
            Resource Matrix Missing
          </h2>
          <p className="text-zinc-500 text-xs max-w-xs mx-auto leading-relaxed">
            The explicit network location or startup document token path parameter requested could not be located in our registry.
          </p>
        </div>

        <button 
          onClick={() => router.push("/ideas")} 
          className="w-full h-11 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer bg-transparent"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Innovation Hub
        </button>

      </div>
    </div>
  );
}