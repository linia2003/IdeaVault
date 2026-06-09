"use client";
import React, { useState, useEffect } from "react";
import { Link } from "@heroui/react";
import toast from "react-hot-toast";
import { Loader2, Search, SlidersHorizontal } from "lucide-react";

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
    "Fintech",
  ];

 
  useEffect(() => {
    const fetchIdeas = async () => {
      setLoadingData(true);
      try {
        const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
        
        
        let targetEndpoint = `${backendUrl}/ideas?search=${encodeURIComponent(searchQuery)}`;
        if (selectedCategory !== "All") {
          targetEndpoint += `&category=${encodeURIComponent(selectedCategory)}`;
        }

        const fallbackResponse = await fetch(targetEndpoint);
        if (!fallbackResponse.ok) {
          throw new Error("Could not parse data stream from endpoint safely.");
        }
        
        const payloadData = await fallbackResponse.json();
        setIdeasList(payloadData);
      } catch (err) {
        console.error("Data fetching tracking error:", err);
        toast.error("Had trouble sync-loading the ideas feed. Give it another shot!");
      } finally {
        setLoadingData(false);
      }
    };

    
    const inputDelayTimer = setTimeout(() => {
      fetchIdeas();
    }, 400);

    return () => clearTimeout(inputDelayTimer);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0f0f11] text-[#1c1c1f] dark:text-[#ececed] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
       
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-[#0f0f11] dark:text-white">
            Innovation Sandbox
          </h1>
          <p className="mt-2 text-sm md:text-base text-[#61616a] dark:text-[#9da0a8] max-w-xl">
            Explore community-submitted concepts, validate structural ideas, and drop feedback to build the future collaboratively.
          </p>
        </div>

        
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between bg-white dark:bg-[#18181c] p-4 rounded-xl border border-[#e4e4e7] dark:border-[#27272a] shadow-sm">
          <div className="relative w-full sm:max-w-md">
            <span className="absolute inset-y-0 left-3 flex items-center text-[#9da0a8]">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search concepts by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-[#e4e4e7] dark:border-[#27272a] bg-[#fafafa] dark:bg-[#0f0f11] focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[#1c1c1f] dark:text-[#ececed]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar py-1">
            <SlidersHorizontal className="w-4 h-4 text-[#61616a] dark:text-[#9da0a8] shrink-0 hidden md:block" />
            <div className="flex gap-1.5">
              {platformCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                      : "bg-[#f4f4f5] dark:bg-[#27272a] text-[#61616a] dark:text-[#ced1d9] hover:bg-[#e4e4e7] dark:hover:bg-[#3f3f46]"
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
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-xs font-medium text-[#61616a] dark:text-[#9da0a8] tracking-widest uppercase">
              Assembling Feed Pipeline...
            </p>
          </div>
        ) : ideasList.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#18181c] rounded-2xl border border-dashed border-[#e4e4e7] dark:border-[#27272a] max-w-2xl mx-auto px-4">
            <p className="text-base font-semibold text-[#1c1c1f] dark:text-white">
              No matching records discovered
            </p>
            <p className="mt-1 text-sm text-[#61616a] dark:text-[#9da0a8]">
              We couldn&apos;t find anything matching your inputs. Try broadening your keywords or changing the category filter.
            </p>
          </div>
        ) : (
          

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideasList.map((idea) => (
              <div 
                key={idea._id}
                className="flex flex-col bg-white dark:bg-[#18181c] rounded-xl border border-[#e4e4e7] dark:border-[#27272a] overflow-hidden hover:shadow-md hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-200 group"
              >
               
                <div className="relative h-44 w-full bg-[#f4f4f5] dark:bg-[#27272a] overflow-hidden border-b border-[#e4e4e7] dark:border-[#27272a]">
                  {idea.imageUrl ? (
                    <img 
                      src={idea.imageUrl} 
                      alt={idea.ideaTitle}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#222226] dark:to-[#2a2a30]">
                      <span className="text-xs font-medium tracking-wider text-[#9da0a8] uppercase">Concept Blueprint</span>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-white/90 dark:bg-[#18181c]/90 text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide text-[10px] uppercase px-2.5 py-1 rounded-md shadow-sm backdrop-blur-xs border border-white/20">
                    {idea.category}
                  </span>
                </div>

               
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#0f0f11] dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-150">
                      {idea.ideaTitle}
                    </h3>
                    <p className="mt-2 text-xs text-[#61616a] dark:text-[#9da0a8] line-clamp-3 leading-relaxed">
                      {idea.shortDescription}
                    </p>
                  </div>

                  
                  <div className="mt-5 pt-4 border-t border-[#f4f4f5] dark:border-[#27272a] grid grid-cols-2 gap-y-2 text-[11px]">
                    <div className="flex flex-col">
                      <span className="text-[#a1a1aa] dark:text-[#71717a] font-medium uppercase tracking-wider text-[9px]">Target Space</span>
                      <span className="text-[#3f3f46] dark:text-[#d4d4d8] font-semibold truncate mt-0.5">{idea.targetAudience || "General Public"}</span>
                    </div>
                    <div className="flex flex-col pl-2 border-l border-[#f4f4f5] dark:border-[#27272a]">
                      <span className="text-[#a1a1aa] dark:text-[#71717a] font-medium uppercase tracking-wider text-[9px]">Est. Budget</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                        {idea.estimatedBudget ? `$${Number(idea.estimatedBudget).toLocaleString()}` : "Bootstrapped"}
                      </span>
                    </div>
                  </div>

                  
                  <div className="mt-5">
                    <Link
                      href={`/ideas/${idea._id}`}
                      className="w-full flex items-center justify-center text-center px-4 py-2 text-xs font-semibold rounded-lg text-white bg-[#0f0f11] dark:bg-[#27272a] hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:shadow-sm transition-all duration-150 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-600 cursor-pointer"
                    >
                      Analyze Blueprint Details
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