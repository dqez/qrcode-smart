/* eslint-disable @next/next/no-img-element */
"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export function UserMenu() {
  const { user, signInWithGoogle, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // 1. Giao diện khi CHƯA đăng nhập
  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        // Sửa đổi: Xóa 'hidden', thêm padding linh hoạt (px-3 cho mobile, px-4 cho desktop)
        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full text-sm font-medium hover:opacity-90 transition-all shadow-md"
        aria-label="Sign in"
      >
        {/* Icon chỉ hiện trên Mobile (sm:hidden) */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:hidden">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>

        {/* Chữ chỉ hiện trên Desktop (hidden sm:block) */}
        <span className="hidden sm:block">Sign in</span>

        {/* Nếu bạn muốn hiện chữ "Sign in" trên cả mobile thì bỏ dòng trên và dùng dòng dưới này: */}
        {/* <span>Sign in</span> */}
      </button>
    );
  }

  // 2. Giao diện khi ĐÃ đăng nhập (Giữ nguyên logic của bạn)
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none transition-transform active:scale-95"
      >
        <img
          src={user.photoURL || "https://via.placeholder.com/40"}
          alt={user.displayName || "User"}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-200 dark:border-neutral-700 object-cover"
        />
      </button>

      {isOpen && (
        <>
          {/* Overlay tàng hình để click ra ngoài thì đóng menu */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-xl shadow-xl py-1 ring-1 ring-black ring-opacity-5 z-50 border border-neutral-200 dark:border-neutral-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-200 border-b border-neutral-200 dark:border-neutral-800">
              <p className="font-medium truncate">{user.displayName}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">{user.email}</p>
            </div>

            {/* Bạn có thể thêm các menu item khác ở đây (VD: Profile, Settings) */}

            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors first:rounded-t-none last:rounded-b-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
