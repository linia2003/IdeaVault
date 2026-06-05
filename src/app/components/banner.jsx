"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Rocket, ShieldCheck, Users } from "lucide-react";

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Turn Your Brightest Ideas Into Reality",
      description: "Stop keeping your concepts in draft folders. Share your pitches with an active network of founders and builders to jumpstart validation.",
      cta: "Explore Ideas",
      link: "/ideas",
      icon: <Rocket className="w-12 h-12 text-blue-500" />,
      bg: "from-blue-500/10 via-transparent to-transparent"
    },
    {
      title: "Validate and Refine Before You Build",
      description: "Gather structural reviews, audience surveys, and strategic problem-solution critiques from experienced community collaborators.",
      cta: "See What's Trending",
      link: "/ideas",
      icon: <ShieldCheck className="w-12 h-12 text-emerald-500" />,
      bg: "from-emerald-500/10 via-transparent to-transparent"
    },
    {
      title: "Join a Growing Circle of Smart Innovators",
      description: "Connect with co-founders, target audience groups, and early testers who can help shift your conceptual model into production.",
      cta: "Discover Pitches",
      link: "/ideas",
      icon: <Users className="w-12 h-12 text-purple-500" />,
      bg: "from-purple-500/10 via-transparent to-transparent"
    }
  ];

  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-zinc-900 text-white min-h-[400px] flex items-center border border-zinc-800 shadow-xl mb-16">
    
      <div className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].bg} transition-all duration-700 pointer-events-none`} />

  
      <div className="relative w-full max-w-4xl mx-auto px-8 py-16 md:px-16 flex flex-col items-start gap-6 transition-all duration-500">
        <div className="p-3 bg-zinc-800/80 rounded-2xl border border-zinc-700/50 backdrop-blur-sm shadow-md animate-bounce">
          {slides[currentSlide].icon}
        </div>
        
        <h1 className="text-3xl md:text-5xl font-black tracking-tight max-w-2xl leading-tight">
          {slides[currentSlide].title}
        </h1>
        
        <p className="text-zinc-400 text-sm md:text-base max-w-xl leading-relaxed">
          {slides[currentSlide].description}
        </p>
        
        <Link 
          href={slides[currentSlide].link}
          className="mt-2 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-6 h-11 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95"
        >
          <span>{slides[currentSlide].cta}</span>
          <ArrowRight size={16} />
        </Link>
      </div>


      <div className="absolute bottom-6 right-8 md:right-16 flex items-center gap-3 z-20">
        <button 
          onClick={handlePrev}
          className="p-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 text-zinc-300 transition-colors active:scale-95"
          aria-label="Previous Slide"
        >
          <ArrowLeft size={16} />
        </button>
        <button 
          onClick={handleNext}
          className="p-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 text-zinc-300 transition-colors active:scale-95"
          aria-label="Next Slide"
        >
          <ArrowRight size={16} />
        </button>
      </div>

   
      <div className="absolute bottom-8 left-8 md:left-16 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${currentSlide === index ? "w-6 bg-blue-500" : "w-2 bg-zinc-700"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}