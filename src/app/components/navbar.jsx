"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Button, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem, 
  Avatar 
} from "@heroui/react";
import { Lightbulb, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const [user, setUser] = useState({
    name: "Mahbuba Chowdhury",
    email: "mahbuba@example.com",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  });

  const linkStyle = (path) => {
    const base = "text-sm font-medium transition-colors duration-200";
    return pathname === path 
      ? `${base} text-blue-600 font-bold` 
      : `${base} text-zinc-600 hover:text-blue-600 dark:text-zinc-300`;
  };

  return (
    <nav className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md sticky top-0 z-50 px-6 h-16 flex items-center justify-between">
      
   
      <div className="flex items-center gap-4">
        <button 
          className="sm:hidden text-zinc-600 dark:text-zinc-300 p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link href="/" className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-xl dark:bg-blue-950/50">
            <Lightbulb className="w-5 h-5 fill-blue-500/20" />
          </div>
          <p className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
            idea<span className="text-blue-600">vault</span>
          </p>
        </Link>
      </div>

   
      <div className="hidden sm:flex items-center gap-6">
        <Link href="/" className={linkStyle("/")}>Home</Link>
        <Link href="/ideas" className={linkStyle("/ideas")}>Ideas</Link>
        
        {user && (
          <>
            <Link href="/add-idea" className={linkStyle("/add-idea")}>Add Idea</Link>
            <Link href="/my-ideas" className={linkStyle("/my-ideas")}>My Ideas</Link>
            <Link href="/my-interactions" className={linkStyle("/my-interactions")}>My Interactions</Link>
          </>
        )}
      </div>

    
      <div className="flex items-center gap-2">
        {user ? (
          <Dropdown placement="bottom-end" className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xl">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform w-8 h-8 text-sm"
                color="primary"
                name={user.name}
                src={user.image}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="User Options Menu" variant="flat">
              <DropdownItem key="user_meta" className="h-14 gap-2 opacity-100 cursor-default pointer-events-none">
                <p className="font-semibold text-xs text-zinc-400">Signed in as</p>
                <p className="font-bold text-sm text-zinc-700 dark:text-zinc-200">{user.email}</p>
              </DropdownItem>
              <DropdownItem key="user_profile" href="/profile" className="text-zinc-700 dark:text-zinc-300">
                Profile Management
              </DropdownItem>
              <DropdownItem key="user_logout" color="danger" className="text-danger" onPress={() => setUser(null)}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <div className="flex items-center gap-2">
            <Button as={Link} href="/login" variant="light" size="sm" className="font-medium text-zinc-700 dark:text-zinc-200">
              Login
            </Button>
            <Button as={Link} href="/signup" color="primary" size="sm" className="font-medium shadow-md">
              Register
            </Button>
          </div>
        )}
      </div>

  
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-4 shadow-xl sm:hidden animate-in fade-in slide-in-from-top-5 duration-200">
          <Link href="/" className={linkStyle("/")} onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link href="/ideas" className={linkStyle("/ideas")} onClick={() => setIsMenuOpen(false)}>Ideas</Link>
          
          {user && (
            <>
              <Link href="/add-idea" className={linkStyle("/add-idea")} onClick={() => setIsMenuOpen(false)}>Add Idea</Link>
              <Link href="/my-ideas" className={linkStyle("/my-ideas")} onClick={() => setIsMenuOpen(false)}>My Ideas</Link>
              <Link href="/my-interactions" className={linkStyle("/my-interactions")} onClick={() => setIsMenuOpen(false)}>My Interactions</Link>
              <Link href="/profile" className={linkStyle("/profile")} onClick={() => setIsMenuOpen(false)}>Profile Management</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}