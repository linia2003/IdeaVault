"use client";

import React, { useEffect } from "react";
import { RouterProvider } from "@heroui/react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import "@/app/globals.css";

export default function RootLayout({ children }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased">
        <RouterProvider>
          <Toaster position="top-center" />
          <Navbar />
          <main className="container mx-auto max-w-7xl px-6 pt-6 flex-grow pb-16">
            {children}
          </main>
          <Footer />
        </RouterProvider>
      </body>
    </html>
  );
}