import React from "react";
import Link from "next/link";
import Banner from "./components/banner";
import { Lightbulb, MessageSquare, Tag, LayoutGrid, CheckCircle, Code, Briefcase } from "lucide-react";


async function getTrendingIdeas() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/ideas/trending`, {
      cache: "no-store", 
    });
    
    if (!res.ok) {
      return [];
    }
    
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch trending ideas from server context:", error);
    return [];
  }
}

export default async function HomePage() {
  const trendingIdeas = await getTrendingIdeas();

  return (
    <div className="w-full py-2">
      
     
      <Banner />

     
      <section className="mb-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">How IdeaVault Works</h2>
          <p className="text-zinc-500 text-sm mt-2">Validate concepts systematically inside a collaborative workspace environment.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center font-bold">1</div>
            <h3 className="font-bold text-base text-zinc-800 dark:text-zinc-100">Post Your Concept</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">Fill out the structured platform canvas mapping out your problem statements, budget estimates, and targeted buyer personas.</p>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center font-bold">2</div>
            <h3 className="font-bold text-base text-zinc-800 dark:text-zinc-100">Gather Critiques</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">Receive localized feedback, alternative solutions paths, and iterative community discussions inside your thread.</p>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center font-bold">3</div>
            <h3 className="font-bold text-base text-zinc-800 dark:text-zinc-100">Form Active Squads</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">Bookmark strategic configurations, connect with developers, and launch real software iterations confidently.</p>
          </div>
        </div>
      </section>

      
      <section className="mb-20">
        <div className="flex items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Trending Innovations</h2>
            <p className="text-zinc-500 text-sm mt-1">High-engagement project models sorted by community discussion volume.</p>
          </div>
          <Link href="/ideas" className="text-xs font-bold text-blue-600 hover:underline shrink-0">
            View All Ideas →
          </Link>
        </div>

        {trendingIdeas.length === 0 ? (
          <div className="w-full text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900">
            <Lightbulb className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
            <p className="text-sm text-zinc-500 font-medium">No trending startup ideas found in the database yet.</p>
            <p className="text-xs text-zinc-400 mt-1">They will populate right here as soon as documents are added to MongoDB!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingIdeas.map((item) => (
              <div 
                key={item._id.toString()} 
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-0.5 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-semibold">
                      <Tag size={12} className="text-blue-500" />
                      {item.category}
                    </span>
                    {item.estimatedBudget && (
                      <span className="text-xs font-mono text-zinc-400">
                        Est. Budget: <span className="text-zinc-700 dark:text-zinc-200 font-bold">${item.estimatedBudget}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-2 tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {item.ideaTitle || item.title}
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed mb-6 line-clamp-3">
                    {item.shortDescription || item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <MessageSquare size={14} className="text-zinc-400" />
                    <span>{item.commentCount || 0} Feedbacks</span>
                  </span>
                  
                  <Link 
                    href={`/ideas/${item._id.toString()}`}
                    className="inline-flex items-center justify-center bg-zinc-100 hover:bg-blue-600 dark:bg-zinc-800 dark:hover:bg-blue-600 text-zinc-700 dark:text-zinc-300 hover:text-white dark:hover:text-white text-xs font-bold px-4 h-9 rounded-xl transition-all active:scale-95"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

     
      <section className="mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10 pointer-events-none">
            <Lightbulb size={300} />
          </div>
          
          <div className="max-w-xl relative z-10">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3">Explore Domains</h2>
            <p className="text-blue-100 text-xs md:text-sm leading-relaxed mb-8">
              Filter tracking layouts instantly across targeted tech sectors to find architectural paths matching your core skill sets.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
            <Link href="/ideas?category=tech" className="p-4 bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-sm rounded-xl flex items-center gap-3 transition-colors group">
              <Code size={18} className="text-blue-200" />
              <span className="text-xs font-bold tracking-wide">Software</span>
            </Link>
            <Link href="/ideas?category=health" className="p-4 bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-sm rounded-xl flex items-center gap-3 transition-colors group">
              <CheckCircle size={18} className="text-emerald-200" />
              <span className="text-xs font-bold tracking-wide">Healthcare</span>
            </Link>
            <Link href="/ideas?category=ai" className="p-4 bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-sm rounded-xl flex items-center gap-3 transition-colors group">
              <LayoutGrid size={18} className="text-purple-200" />
              <span className="text-xs font-bold tracking-wide">AI Systems</span>
            </Link>
            <Link href="/ideas?category=finance" className="p-4 bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-sm rounded-xl flex items-center gap-3 transition-colors group">
              <Briefcase size={18} className="text-amber-200" />
              <span className="text-xs font-bold tracking-wide">FinTech</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}