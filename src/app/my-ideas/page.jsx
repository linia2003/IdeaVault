"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; 
import toast from "react-hot-toast";
import { Loader2, Edit3, Trash2, ShieldAlert, LucideLightbulb, X, Eye } from "lucide-react";

export default function MyIdeasPage() {
  const router = useRouter();
  const { data: activeSession, isPending: evaluatingSession } = authClient.useSession();
  const loggedInUser = activeSession?.user;

  const [myIdeas, setMyIdeas] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Modal Control Reference States
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);

  // Form State parameters matching the Add Idea design structure exactly
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Tech");
  const [shortDesc, setShortDesc] = useState("");
  const [detailedDesc, setDetailedDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [budget, setBudget] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [proposedSolution, setProposedSolution] = useState("");

  const apiHost = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    if (!loggedInUser?.email) return;

    const pullUserIdeas = async () => {
      setLoadingData(true);
      let baseHost = apiHost.endsWith("/") ? apiHost.slice(0, -1) : apiHost;
      try {
        const response = await fetch(`${baseHost}/ideas/user/${encodeURIComponent(loggedInUser.email)}`);
        if (!response.ok) throw new Error("Failed to load user records.");
        const data = await response.json();
        setMyIdeas(data);
      } catch (err) {
        console.error(err);
        toast.error("Had trouble compiling your startup canvas items.");
      } finally {
        setLoadingData(false);
      }
    };

    pullUserIdeas();
  }, [loggedInUser, apiHost]);

  // Open Update Overlay and Populate Form variables
  const triggerUpdateSetup = (idea) => {
    setSelectedIdea(idea);
    setTitle(idea.ideaTitle || "");
    setCategory(idea.category || "Tech");
    setShortDesc(idea.shortDescription || "");
    setDetailedDesc(idea.detailedDescription || "");
    setImageUrl(idea.imageUrl || "");
    setBudget(idea.estimatedBudget ? String(idea.estimatedBudget) : "");
    setTargetAudience(idea.targetAudience || "");
    setProblemStatement(idea.problemStatement || "");
    setProposedSolution(idea.proposedSolution || "");
    setIsUpdateModalOpen(true);
  };

  // Submit Update Put request
  const handleExecuteUpdate = async (e) => {
    e.preventDefault();
    if (!selectedIdea) return;
    setProcessingAction(true);

    const updatedPayload = {
      ideaTitle: title.trim(),
      category,
      shortDescription: shortDesc.trim(),
      detailedDescription: detailedDesc.trim(),
      imageUrl: imageUrl.trim(),
      estimatedBudget: budget ? Number(budget) : null,
      targetAudience: targetAudience.trim(),
      problemStatement: problemStatement.trim(),
      proposedSolution: proposedSolution.trim()
    };

    let baseHost = apiHost.endsWith("/") ? apiHost.slice(0, -1) : apiHost;
    try {
      const response = await fetch(`${baseHost}/ideas/${selectedIdea._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload)
      });

      if (!response.ok) throw new Error("Update rejected.");

      setMyIdeas((prev) =>
        prev.map((item) => (item._id === selectedIdea._id ? { ...item, ...updatedPayload } : item))
      );
      setIsUpdateModalOpen(false);
      toast.success("Startup concept record rewritten cleanly!");
    } catch (err) {
      toast.error("Could not overwrite document parameters.");
    } finally {
      setProcessingAction(false);
    }
  };

  // Open Delete Confirmation Dialogue Box Interceptor
  const triggerDeleteSetup = (idea) => {
    setSelectedIdea(idea);
    setIsDeleteModalOpen(true);
  };

  // Execute Delete operational request
  const handleExecuteDelete = async () => {
    if (!selectedIdea) return;
    setProcessingAction(true);

    let baseHost = apiHost.endsWith("/") ? apiHost.slice(0, -1) : apiHost;
    try {
      const response = await fetch(`${baseHost}/ideas/${selectedIdea._id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Deletion rejected.");

      setMyIdeas((prev) => prev.filter((item) => item._id !== selectedIdea._id));
      setIsDeleteModalOpen(false);
      toast.success("Concept successfully purged from database stack.");
    } catch (err) {
      toast.error("Had a roadblock pulling down record history logs.");
    } finally {
      setProcessingAction(false);
    }
  };

  if (evaluatingSession || loadingData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-white dark:bg-zinc-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Synchronizing Workspace...</span>
      </div>
    );
  }

  if (!loggedInUser) {
    return (
      <div className="w-full max-w-3xl mx-auto py-8">
        <div className="border border-zinc-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900 rounded-3xl p-8 text-center">
          <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <p className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Please log in to manage your profile portfolio canvas.</p>
          <button onClick={() => router.push("/login")} className="h-11 px-6 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer">Log In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8 animate-fadeIn space-y-6">
      
      {/* Portfolio Title Card Container Frame */}
      <div className="border border-zinc-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900 rounded-3xl p-8">
        <div className="flex flex-col gap-1 items-start mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4 w-full">
          <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white flex items-center gap-2">
            <LucideLightbulb className="text-blue-500 w-6 h-6" />
            My Custom Concept Vault
          </h2>
          <p className="text-zinc-500 text-xs">
            Review, update parameter specifications, or remove startup records mapped under your profile sequence.
          </p>
        </div>

        {/* Dashboard Grid Data Lists */}
        {myIdeas.length === 0 ? (
          <div className="text-center py-12 text-xs text-zinc-400 font-bold border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
            You haven't added any startup concepts yet. Go to Add Idea to log your first record!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {myIdeas.map((idea) => (
              <div key={idea._id} className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/10 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-black text-zinc-950 dark:text-white truncate">{idea.ideaTitle}</h4>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-1">{idea.category} • Counter: {idea.commentCount || 0} comments</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => router.push(`/ideas/${idea._id}`)} className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 rounded-xl transition-colors cursor-pointer" title="View details canvas"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => triggerUpdateSetup(idea)} className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-amber-500 rounded-xl transition-colors cursor-pointer" title="Modify fields"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => triggerDeleteSetup(idea)} className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-rose-500 rounded-xl transition-colors cursor-pointer" title="Purge document"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── FEATURES 1: UPDATE OVERLAY MODAL CANVAS ─── */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
          <div className="border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-900 rounded-3xl p-8 w-full max-w-2xl my-8 max-h-[85vh] overflow-y-auto no-scrollbar relative">
            
            <button onClick={() => setIsUpdateModalOpen(false)} className="absolute top-6 right-6 p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg cursor-pointer"><X className="w-5 h-5" /></button>

            <div className="flex flex-col gap-1 items-start mb-6 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <h3 className="text-xl font-black text-zinc-950 dark:text-white">Modify Concept Specifications</h3>
              <p className="text-zinc-400 text-xs">Update your system architectural layout values below.</p>
            </div>

            <form onSubmit={handleExecuteUpdate} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Idea Title</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white cursor-pointer">
                    <option value="Tech">Tech</option><option value="Health">Health</option><option value="AI">AI</option><option value="Education">Education</option><option value="Agriculture">Agriculture</option><option value="Fintech">Fintech</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Short Description</label>
                <input type="text" required value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Detailed Description</label>
                <textarea required rows={3} value={detailedDesc} onChange={(e) => setDetailedDesc(e.target.value)} className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Image URL</label>
                  <input type="url" required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Estimated Budget</label>
                  <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Target Audience</label>
                <input type="text" required value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-rose-500 px-1">Problem Statement</label>
                <textarea required rows={2} value={problemStatement} onChange={(e) => setProblemStatement(e.target.value)} className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white resize-none" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-emerald-500 px-1">Proposed Solution</label>
                <textarea required rows={2} value={proposedSolution} onChange={(e) => setProposedSolution(e.target.value)} className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white resize-none" />
              </div>

              <button type="submit" disabled={processingAction} className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg mt-2 transition-colors flex items-center justify-center disabled:opacity-50 cursor-pointer">
                {processingAction ? "Committing Updates..." : "Save Selection Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── FEATURES 2: DELETE CONFIRMATION INTERCEPT OVERLAY MODAL ─── */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-900 rounded-3xl p-6 w-full max-w-sm text-center">
            
            <div className="h-12 w-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5" />
            </div>

            <h3 className="text-base font-black text-zinc-950 dark:text-white">Purge System Document?</h3>
            <p className="text-zinc-500 text-xs mt-1.5 leading-relaxed">
              Are you absolutely sure you want to delete <span className="font-bold text-zinc-900 dark:text-white">"{selectedIdea?.ideaTitle}"</span>? This action is permanent and clears all related commentary tracks.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={() => setIsDeleteModalOpen(false)} disabled={processingAction} className="h-10 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={handleExecuteDelete} disabled={processingAction} className="h-10 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg flex items-center justify-center disabled:opacity-50 cursor-pointer">
                {processingAction ? "Purging..." : "Confirm Purge"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}