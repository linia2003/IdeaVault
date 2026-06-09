"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LucideLightbulb, LucideCoins, LucideTag, LucideImage, LucideLayers } from "lucide-react";
import toast from "react-hot-toast";

export default function AddIdeaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [detailedDesc, setDetailedDesc] = useState("");
  const [category, setCategory] = useState("Tech");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [budget, setBudget] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [proposedSolution, setProposedSolution] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    
    const ideaPayload = {
      title,
      shortDescription: shortDesc,
      detailedDescription: detailedDesc,
      category,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
      imageUrl,
      estimatedBudget: budget ? Number(budget) : null,
      targetAudience,
      problemStatement,
      proposedSolution,
      createdAt: new Date(),
    };

    try {
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/ideas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ideaPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to store document context.");
      }

      toast.success("Startup idea submitted successfully!");
      
   
      router.push("/my-ideas");
      router.refresh();
    } catch (err) {
      toast.error("Failed to submit startup idea. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 animate-fadeIn">
      <div className="border border-zinc-200 dark:border-zinc-800 shadow-xl bg-white dark:bg-zinc-900 rounded-3xl p-8">
        
        
        <div className="flex flex-col gap-1 items-start mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <h2 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white flex items-center gap-2">
            <LucideLightbulb className="text-red-800 w-6 h-6" />
             Startup Concept
          </h2>
          <p className="text-zinc-500 text-xs">
            Publish your innovative ideas, define target segments, and explain the requirements.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Idea Title</label>
              <input
                type="text"
                required
                placeholder="e.g., SmartCrop AI Analytics"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Category</label>
              <div className="relative w-full flex items-center">
                <LucideLayers className="absolute left-4 text-zinc-400 w-4 h-4 pointer-events-none" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white transition-colors appearance-none cursor-pointer"
                >
                  <option value="Tech">Tech</option>
                  <option value="Health">Health</option>
                  <option value="AI">AI</option>
                  <option value="Education">Education</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Fintech">Fintech</option>
                </select>
              </div>
            </div>
          </div>

         
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Short Description</label>
            <input
              type="text"
              required
              placeholder="Briefly pitch your core concept in one line"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white transition-colors"
            />
          </div>

         
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Detailed Description</label>
            <textarea
              required
              rows={4}
              placeholder="Deep dive into your complete technical architecture or operations system strategy..."
              value={detailedDesc}
              onChange={(e) => setDetailedDesc(e.target.value)}
              className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white transition-colors resize-none"
            />
          </div>

         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Tags (Comma Separated - Optional)</label>
              <div className="relative w-full flex items-center">
                <LucideTag className="absolute left-4 text-zinc-400 w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="saas, cloud, automated"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Image URL</label>
              <div className="relative w-full flex items-center">
                <LucideImage className="absolute left-4 text-zinc-400 w-4 h-4 pointer-events-none" />
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white transition-colors"
                />
              </div>
            </div>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Estimated Budget (Taka)</label>
              <div className="relative w-full flex items-center">
                <LucideCoins className="absolute left-4 text-zinc-400 w-4 h-4 pointer-events-none" />
                <input
                  type="number"
                  placeholder="e.g., 5000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Target Audience</label>
              <input
                type="text"
                required
                placeholder="e.g., Small-scale coastal farmers"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white transition-colors"
              />
            </div>
          </div>

        
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Problem Statement</label>
            <textarea
              required
              rows={3}
              placeholder="Describe the structural problem or market pain point you are resolving..."
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white transition-colors resize-none"
            />
          </div>

         
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 px-1">Proposed Solution</label>
            <textarea
              required
              rows={3}
              placeholder="How does your startup architecture natively solve this problem..."
              value={proposedSolution}
              onChange={(e) => setProposedSolution(e.target.value)}
              className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-sm focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white transition-colors resize-none"
            />
          </div>

         
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl mt-2 shadow-lg shadow-blue-600/10 transition-colors flex items-center justify-center text-sm disabled:opacity-50"
          >
            {loading ? "Saving Concept Record..." : "Submit Idea"}
          </button>
        </form>
      </div>
    </div>
  );
}