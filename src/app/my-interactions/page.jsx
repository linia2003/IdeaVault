"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; 
import toast from "react-hot-toast";
import { Loader2, ShieldAlert, MessageSquare, ArrowRight, Calendar } from "lucide-react";

export default function MyInteractionsPage() {
  const router = useRouter();
  const { data: activeSession, isPending: evaluatingSession } = authClient.useSession();
  const loggedInUser = activeSession?.user;

  const [interactions, setInteractions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const apiHost = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    if (!loggedInUser?.email) return;

    const pullUserInteractions = async () => {
      setLoadingData(true);
      let baseHost = apiHost.endsWith("/") ? apiHost.slice(0, -1) : apiHost;
      try {
        const response = await fetch(`${baseHost}/user-interactions/${encodeURIComponent(loggedInUser.email)}`);
        if (!response.ok) throw new Error("Failed to pull validation activity.");
        const payload = await response.json();
        setInteractions(payload);
      } catch (err) {
        console.error(err);
        toast.error("Had a roadblock compiling your activity profile matrix.");
      } finally {
        setLoadingData(false);
      }
    };

    pullUserInteractions();
  }, [loggedInUser, apiHost]);

  if (evaluatingSession || loadingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-white dark:bg-zinc-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Compiling Activity Logs...</span>
      </div>
    );
  }

  if (!loggedInUser) {
    return (
      <div className="w-full max-w-3xl mx-auto py-8">
        <div className="border border-zinc-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900 rounded-3xl p-8 text-center">
          <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <p className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Please log in to inspect your transaction interaction history matrix.</p>
          <button onClick={() => router.push("/login")} className="h-11 px-6 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer">Log In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8 animate-fadeIn space-y-6">
      
      
      <div className="border border-zinc-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900 rounded-3xl p-8">
        <div className="flex flex-col gap-1 items-start mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4 w-full">
          <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white flex items-center gap-2">
            <MessageSquare className="text-blue-600 w-6 h-6" />
            My Interaction Registry
          </h2>
          <p className="text-zinc-500 text-xs">
            Review community ideas and technical blueprints where you have contributed validation comments.
          </p>
        </div>

       
        {interactions.length === 0 ? (
          <div className="text-center py-12 text-xs text-zinc-400 font-bold border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
            No interaction logs captured yet. Post comments on project ideas to register activity histories!
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {interactions.map((item) => (
              <div key={item._id} className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-950/20 space-y-4">
                
              
                <div className="flex items-start justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-3 flex-wrap sm:flex-nowrap">
                  <div>
                    <h3 className="text-base font-black text-zinc-950 dark:text-white">{item.ideaTitle}</h3>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mt-0.5">{item.category}</p>
                  </div>
                  <button 
                    onClick={() => router.push(`/ideas/${item._id}`)}
                    className="h-9 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold hover:text-blue-600 dark:bg-zinc-900 bg-white shadow-xs hover:border-blue-500 flex items-center gap-1.5 transition-all cursor-pointer group shrink-0"
                  >
                    View Canvas <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                
                <div className="flex flex-col gap-2.5">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block px-1">Your Logs Posted:</span>
                  {item.userComments.map((comment) => (
                    <div key={comment.commentId} className="p-4 rounded-xl border border-zinc-200/70 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-xs space-y-2">
                      <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{comment.commentText}</p>
                      <div className="text-[10px] font-bold text-zinc-400 flex items-center gap-1.5 pt-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        {new Date(comment.createdAt).toLocaleDateString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}