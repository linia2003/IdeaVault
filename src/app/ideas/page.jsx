"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Loader2, Search, SlidersHorizontal, ArrowUpRight } from "lucide-react";

export default function IdeasPage() {
  const [ideasList, setIdeasList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loadingData, setLoadingData] = useState(true);

  const platformCategories = [
    "All",
    "Tech",
    "Health",
    "AI",
    "Education",
    "Agriculture",
    "Fintech"
  ];

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoadingData(true);
      try {
        let backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        if (backendUrl.endsWith("/")) {
          backendUrl = backendUrl.slice(0, -1);
        }
        
        let targetEndpoint = `${backendUrl}/ideas?search=${encodeURIComponent(searchQuery)}`;
        if (selectedCategory !== "All") {
          targetEndpoint += `&category=${encodeURIComponent(selectedCategory)}`;
        }

        const response = await fetch(targetEndpoint);
        if (!response.ok) {
          throw new Error("Could not drop response pipeline safely from backend engine.");
        }
        
        const payloadData = await response.json();
        setIdeasList(payloadData);
      } catch (err) {
        console.error("Feed loading operational drop:", err);
        toast.error("Had an issue updating the ideas timeline grid.");
      } finally {
        setLoadingData(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchIdeas();
    }, 350);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0f0f11] text-[#1c1c1f] dark:text-[#ececed] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-150">
      <title>Innovation Hub | IdeaVault</title>
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-black tracking-tight md:text-4xl text-zinc-950 dark:text-white">
            Innovation Hub
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
            Browse through the submitted ideas and you can analyze the blueprint details if you want.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-zinc-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search concepts by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-11 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent focus:outline-none focus:border-indigo-500 text-zinc-900 dark:text-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto no-scrollbar py-1">
            <SlidersHorizontal className="w-4 h-4 text-zinc-400 shrink-0 hidden sm:block" />
            <div className="flex gap-2">
              {platformCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 h-9 text-xs font-bold rounded-lg tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loadingData ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
            <p className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase animate-pulse">
              Pulling Live Records...
            </p>
          </div>
        ) : ideasList.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 max-w-lg mx-auto px-6">
            <p className="text-base font-bold text-zinc-900 dark:text-white">
              Vault archive empty
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              No matching concept documents found under your specific filter configurations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideasList.map((idea) => (
              <div 
                key={idea._id}
                className="flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-44 w-full bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-100 dark:border-zinc-800 overflow-hidden">
                  {idea.imageUrl ? (
                    <img 
                      src={idea.imageUrl} 
                      alt={idea.ideaTitle}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      onError={(imgEvent) => {
                        imgEvent.target.onerror = null;
                        imgEvent.target.src = "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900">
                      <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Vault Content Matrix</span>
                    </div>
                  )}
                  
                  <span className="absolute top-4 left-4 bg-white/95 dark:bg-zinc-900/95 text-indigo-600 dark:text-indigo-400 font-extrabold tracking-wider text-[10px] uppercase px-3 py-1 rounded-md shadow-xs backdrop-blur-xs border border-zinc-100 dark:border-zinc-800">
                    {idea.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                  <div>
                    <h3 className="text-base font-black text-zinc-950 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {idea.ideaTitle}
                    </h3>
                    <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                      {idea.shortDescription}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-2 gap-y-3 text-[11px]">
                    <div className="flex flex-col">
                      <span className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">Market Segment</span>
                      <span className="text-zinc-700 dark:text-zinc-300 font-semibold truncate mt-0.5">
                        {idea.targetAudience || "General Market"}
                      </span>
                    </div>
                    <div className="flex flex-col pl-4 border-l border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-400 font-bold uppercase tracking-wider text-[9px]">Target Budget</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                        {idea.estimatedBudget ? `$${Number(idea.estimatedBudget).toLocaleString()}` : "Bootstrapped"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-1">
                    <Link
                      href={`/ideas/${idea._id}`}
                      className="w-full flex items-center justify-center gap-1.5 h-10 text-xs font-bold rounded-xl text-white bg-zinc-950 dark:bg-zinc-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 transition-all duration-200 cursor-pointer"
                    >
                      <span>Analyze Blueprint Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}