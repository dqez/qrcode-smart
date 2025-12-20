/* eslint-disable @next/next/no-img-element */
"use client";

import { useAuth } from "@/context/AuthContext";
import DomainManager from "@/components/DomainManager";

export default function ProfilePage() {
  const { user, userProfile } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Profile Settings</h1>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6">
        <div className="flex items-center gap-6">
          <img
            src={user?.photoURL || "https://via.placeholder.com/100"}
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-neutral-100 dark:border-neutral-800"
          />
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">{user?.displayName}</h2>
            <p className="text-neutral-500 dark:text-neutral-400">{user?.email}</p>
            {userProfile?.tier && (
              (() => {
                // 1. Định nghĩa bảng màu cho từng loại
                const config = {
                  free: {
                    label: 'Free',
                    classes: 'text-neutral-600 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400',
                  },
                  pro: {
                    label: 'Pro',
                    classes: 'text-amber-800 bg-linear-to-r from-amber-200 to-orange-200 shadow',
                  },
                  enterprise: {
                    label: 'Enterprise',
                    classes: 'text-purple-800 bg-linear-to-r from-purple-200 to-indigo-200 shadow',
                  },
                };

                // 2. Lấy config dựa trên tier hiện tại (fallback về free nếu không khớp)
                const currentTier = config[userProfile.tier] || config.free;

                return (
                  <div className={`inline-block text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${currentTier.classes}`}>
                    {currentTier.label} Plan
                  </div>
                );
              })()
            )}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Display Name</span>
              <input
                type="text"
                disabled
                value={user?.displayName || ''}
                className="mt-1 block w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Email Address</span>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="mt-1 block w-full rounded-md border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2"
              />
            </label>
          </div>
        </div>
      </div>

      <DomainManager />
    </div>
  );
}
