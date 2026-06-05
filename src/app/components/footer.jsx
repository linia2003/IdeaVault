"use client";

import React from "react";
import Link from "next/link";
import { Lightbulb, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; 

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-zinc-900 text-zinc-400 mt-auto border-t border-zinc-800">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-600/10 text-blue-500 rounded-xl">
                <Lightbulb className="w-5 h-5 fill-blue-500/20" />
              </div>
              <p className="font-bold text-xl tracking-tight text-white">
                idea<span className="text-blue-500">vault</span>
              </p>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed">
              A community-driven workspace for innovators to share, explore, and validate groundbreaking startup concepts collectively.
            </p>
          </div>

         
          <div className="flex flex-col gap-3">
            <p className="font-semibold text-white text-sm uppercase tracking-wider">Platform Links</p>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link href="/ideas" className="hover:text-blue-500 transition-colors">Browse Ideas</Link>
              </li>
              <li>
                <Link href="/ideas?category=tech" className="hover:text-blue-500 transition-colors">Tech Innovation</Link>
              </li>
              <li>
                <Link href="/ideas?category=ai" className="hover:text-blue-500 transition-colors">AI Systems</Link>
              </li>
              <li>
                <Link href="/add-idea" className="hover:text-blue-500 transition-colors">Submit a Concept</Link>
              </li>
            </ul>
          </div>

       
          <div className="flex flex-col gap-3">
            <p className="font-semibold text-white text-sm uppercase tracking-wider">Contact Info</p>
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-500 shrink-0" />
                <span>Sylhet</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-blue-500 shrink-0" />
                <span className="hover:text-blue-500 transition-colors cursor-pointer">support@ideavault.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-blue-500 shrink-0" />
                <span>+880 1234567890</span>
              </li>
            </ul>
          </div>

         
          <div className="flex flex-col gap-3">
            <p className="font-semibold text-white text-sm uppercase tracking-wider">Connect With Us</p>
            <p className="text-sm text-zinc-500 mb-1">Stay updated with newly posted trending pitches.</p>
            <div className="flex items-center gap-4 text-xl text-zinc-400">
              <div className="hover:text-blue-500 transition-colors cursor-pointer" aria-label="GitHub Logo">
                <FaGithub />
              </div>
              <div className="hover:text-blue-500 transition-colors cursor-pointer" aria-label="LinkedIn Logo">
                <FaLinkedin />
              </div>
              <div className="hover:text-blue-500 transition-colors cursor-pointer" aria-label="X Logo">
                <FaXTwitter />
              </div>
              <div className="hover:text-blue-500 transition-colors cursor-pointer" aria-label="Facebook Logo">
                <FaFacebook />
              </div>
            </div>
          </div>

        </div>

      
        <div className="pt-8 border-t border-zinc-800 text-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-600">
          <p>© {currentYear} IdeaVault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}