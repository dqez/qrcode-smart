/* eslint-disable @next/next/no-img-element */
"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export function UserMenu() {
  const { user, signInWithGoogle, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full text-sm font-medium hover:opacity-90 transition-all"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <img src={user.photoURL || "https://via.placeholder.com/40"} alt={user.displayName || "User"} className="w-8 h-8 rounded-full border border-gray-200" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-xl shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50 border border-neutral-200 dark:border-neutral-800">
          <div className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-200 border-b border-neutral-200 dark:border-neutral-800">
            <p className="font-medium truncate">{user.displayName}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">{user.email}</p>
          </div>
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors first:rounded-t-none last:rounded-b-xl"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
