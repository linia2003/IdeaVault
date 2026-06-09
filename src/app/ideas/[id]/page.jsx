"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; 
import toast from "react-hot-toast";
import { Loader2, ArrowLeft, Send, Trash2, Edit3, Check, X } from "lucide-react";

export default function IdeaDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const { data: activeSession, isPending: evaluatingSession } = authClient.useSession();
  const loggedInUser = activeSession?.user;

  const [ideaData, setIdeaData] = useState(null);
  const [commentsList, setCommentsList] = useState([]);
  const [newCommentInput, setNewCommentInput] = useState("");
  const [loadingView, setLoadingView] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  const [activeEditingId, setActiveEditingId] = useState(null);
  const [editTextBuffer, setEditTextBuffer] = useState("");

  const apiHost = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    if (!id) return;

    const pullCompleteDataset = async () => {
      setLoadingView(true);
      let baseHost = apiHost.endsWith("/") ? apiHost.slice(0, -1) : apiHost;
      const sanitizedId = String(id).trim();

      try {
        const ideaRes = await fetch(`${baseHost}/ideas/${sanitizedId}`);
        if (!ideaRes.ok) throw new Error("Concept document missing.");
        const ideaPayload = await ideaRes.json();
        setIdeaData(ideaPayload);

        if (ideaPayload?.ideaTitle) {
          document.title = `${ideaPayload.ideaTitle} - Specs Canvas | IdeaVault`;
        }

        try {
          const commentsRes = await fetch(`${baseHost}/comments/${sanitizedId}`);
          if (commentsRes.ok) {
            const commentsPayload = await commentsRes.json();
            setCommentsList(Array.isArray(commentsPayload) ? commentsPayload : []);
          }
        } catch (cErr) {
          console.warn("No comments retrieved yet:", cErr);
        }

      } catch (err) {
        console.error("Pipeline failure:", err);
        toast.error("Roadblock reading this startup blueprint canvas.");
      } finally {
        setLoadingView(false);
      }
    };

    pullCompleteDataset();
  }, [id, apiHost]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentInput.trim() || !loggedInUser) return;

    setSubmittingComment(true);
    try {
      const baseHost = apiHost.endsWith("/") ? apiHost.slice(0, -1) : apiHost;
      const uploadPacket = {
        ideaId: id,
        userName: loggedInUser.name || "Anonymous Innovator",
        userEmail: loggedInUser.email,
        commentText: newCommentInput.trim()
      };

      const response = await fetch(`${baseHost}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uploadPacket)
      });

      if (!response.ok) throw new Error("Server rejected comment.");
      const responseData = await response.json();

      if (responseData.success) {
        setCommentsList((prev) => [responseData.comment, ...prev]);
        setNewCommentInput("");
        toast.success("Feedback stamped into validation registry.");
      }
    } catch (err) {
      toast.error("Couldn't upload feedback profile data.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleSaveEditComment = async (commentId) => {
    if (!editTextBuffer.trim()) return;
    const baseHost = apiHost.endsWith("/") ? apiHost.slice(0, -1) : apiHost;

    try {
      const response = await fetch(`${baseHost}/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentText: editTextBuffer.trim() })
      });

      if (!response.ok) throw new Error("Edit request failed.");

      setCommentsList((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, commentText: editTextBuffer.trim() } : c))
      );
      setActiveEditingId(null);
      toast.success("Feedback log entry updated.");
    } catch (err) {
      toast.error("Had an issue updating your text payload.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Permanently purge this feedback record?")) return;
    const baseHost = apiHost.endsWith("/") ? apiHost.slice(0, -1) : apiHost;

    try {
      const response = await fetch(`${baseHost}/comments/${commentId}?ideaId=${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Delete failed.");

      setCommentsList((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Feedback log cleanly purged.");
    } catch (err) {
      toast.error("Could not remove record entry.");
    }
  };

  if (evaluatingSession || loadingView) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-white dark:bg-zinc-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Assembling Canvas...</span>
      </div>
    );
  }

  if (!loggedInUser) {
    return (
      <div className="w-full max-w-3xl mx-auto py-8">
        <div className="border border-zinc-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900 rounded-3xl p-8 text-center">
          <p className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Please log in to review this startup architecture.</p>
          <button onClick={() => router.push("/login")} className="h-11 px-6 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg">
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8 animate-fadeIn space-y-6">
      
      <button 
        onClick={() => router.push("/ideas")} 
        className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-blue-600 transition-colors cursor-pointer px-1"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Hub
      </button>

      <div className="border border-zinc-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900 rounded-3xl p-8">
        
        <div className="flex flex-col gap-1 items-start mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
            {ideaData?.ideaTitle}
          </h2>
          <p className="text-zinc-500 text-xs">
            Full information profile for the submitted startup concept blueprint.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Category</label>
              <div className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm flex items-center text-zinc-900 dark:text-white">
                {ideaData?.category}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Image URL</label>
              <div className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm flex items-center text-zinc-900 dark:text-white truncate">
                <span className="truncate">{ideaData?.imageUrl || "No Image Linked"}</span>
              </div>
            </div>
          </div>

          {ideaData?.imageUrl && (
            <div className="w-full h-64 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50">
              <img src={ideaData.imageUrl} alt="Concept Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Short Description</label>
            <div className="w-full min-h-11 py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm text-zinc-900 dark:text-white leading-relaxed">
              {ideaData?.shortDescription}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Detailed Description</label>
            <div className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm text-zinc-900 dark:text-white whitespace-pre-line leading-relaxed">
              {ideaData?.detailedDescription}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Estimated Budget</label>
              <div className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm flex items-center text-zinc-900 dark:text-white">
                {ideaData?.estimatedBudget ? `$${Number(ideaData.estimatedBudget).toLocaleString()}` : "Not Specified"}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Target Audience</label>
              <div className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm flex items-center text-zinc-900 dark:text-white">
                {ideaData?.targetAudience}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Problem Statement</label>
            <div className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm text-zinc-900 dark:text-white leading-relaxed whitespace-pre-line">
              {ideaData?.problemStatement}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Proposed Solution</label>
            <div className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm text-zinc-900 dark:text-white leading-relaxed whitespace-pre-line">
              {ideaData?.proposedSolution}
            </div>
          </div>

        </div>
      </div>

      <div className="border border-zinc-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900 rounded-3xl p-8 space-y-6">
        
        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <h3 className="text-base font-black text-zinc-950 dark:text-white">
            Comments ({commentsList.length})
          </h3>
        </div>

        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            type="text"
            required
            placeholder="Write a comment..."
            value={newCommentInput}
            onChange={(e) => setNewCommentInput(e.target.value)}
            className="flex-1 h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white transition-colors"
          />
          <button 
            type="submit" 
            disabled={submittingComment || !newCommentInput.trim()} 
            className="h-11 px-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Comment <Send className="w-3 h-3" />
          </button>
        </form>

        <div className="flex flex-col gap-3">
          {commentsList.length === 0 ? (
            <div className="text-center py-6 text-xs text-zinc-400 font-bold border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
              Nobody commented yet.
            </div>
          ) : (
            commentsList.map((comment) => {
              const isAuthor = loggedInUser?.email === comment.userEmail;
              const isEditing = activeEditingId === comment._id;

              return (
                <div key={comment._id} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex gap-4 items-start justify-between group transition-all">
                  <div className="flex-1 min-w-0 space-y-1">
                    
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-black text-zinc-900 dark:text-white">{comment.userName}</span>
                      {isAuthor && (
                        <span className="text-[8px] font-black px-1.5 py-0.2 bg-blue-500/10 text-blue-500 rounded-md uppercase tracking-wider">You</span>
                      )}
                      <span className="text-[10px] text-zinc-400 font-medium">
                        • {new Date(comment.createdAt).toLocaleDateString(undefined, { hour: '2-digit', minute:'2-digit' })}
                      </span>
                    </div>

                    {isEditing ? (
                      <div className="flex gap-2 items-center mt-2 bg-white dark:bg-zinc-900 p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <input
                          type="text"
                          value={editTextBuffer}
                          onChange={(e) => setEditTextBuffer(e.target.value)}
                          className="flex-1 bg-transparent text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none px-2"
                        />
                        <button onClick={() => handleSaveEditComment(comment._id)} className="p-1 bg-emerald-500 text-white rounded-md cursor-pointer"><Check className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setActiveEditingId(null)} className="p-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-500 rounded-md cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap pt-0.5">{comment.commentText}</p>
                    )}

                  </div>

                  {isAuthor && !isEditing && (
                    <div className="flex items-center gap-0.5 shrink-0 transition-opacity">
                      <button
                        onClick={() => {
                          setActiveEditingId(comment._id);
                          setEditTextBuffer(comment.commentText);
                        }}
                        className="p-1.5 text-zinc-400 hover:text-blue-500 rounded-lg cursor-pointer transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-lg cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}