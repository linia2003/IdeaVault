"use client";

import React from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Lightbulb, LogOut, Menu, User, PlusCircle, Folder, MessageSquare } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, Button } from "@heroui/react";

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <nav className="w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600/10 text-blue-600 rounded-xl">
            <Lightbulb className="w-5 h-5 fill-blue-600/10" />
          </div>
          <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
            idea<span className="text-blue-600">vault</span>
          </span>
        </Link>

        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link href="/ideas" className="hover:text-blue-600 transition-colors">Ideas</Link>
          
   
          {user && (
            <>
              <Link href="/add-idea" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                <PlusCircle size={14} /> Add Idea
              </Link>
              <Link href="/my-ideas" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                <Folder size={14} /> My Ideas
              </Link>
              <Link href="/my-interactions" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                <MessageSquare size={14} /> My Interactions
              </Link>
            </>
          )}
        </div>

    
        <div className="flex items-center gap-4">
          {user ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="transition-transform w-8 h-8 text-sm border-2 border-blue-600"
                  name={user.name || "User"}
                  src={user.image || undefined}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2" textValue="Signed in profile heading">
                  <p className="font-semibold text-xs text-zinc-400">Signed in as</p>
                  <p className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{user.email}</p>
                </DropdownItem>
                <DropdownItem key="manage" startContent={<User size={16} />} textValue="Profile Management Link">
                  <Link href="/profile" className="w-full h-full block">Profile Management</Link>
                </DropdownItem>
                <DropdownItem key="logout" color="danger" startContent={<LogOut size={16} />} onPress={handleSignOut} textValue="Sign out application trigger">
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 transition-colors">
                Login
              </Link>
              <Button as={Link} href="/register" color="primary" size="sm" className="font-bold rounded-xl shadow-lg shadow-blue-600/10">
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}