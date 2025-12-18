"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

// Mock Data
const stats = [
  { name: 'Total QR Codes', value: '12', change: '+2 this week' },
  { name: 'Total Scans', value: '1,234', change: '+15% vs last month' },
  { name: 'Active Links', value: '8', change: 'Currently active' },
];

const recentActivity = [
  { id: 1, name: 'Portfolio Website', type: 'URL', date: '2023-12-18', scans: 45 },
  { id: 2, name: 'WiFi Guest Access', type: 'WiFi', date: '2023-12-15', scans: 12 },
  { id: 3, name: 'Contact Card', type: 'vCard', date: '2023-12-10', scans: 89 },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Welcome back, {user?.displayName?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Here&apos;s what&apos;s happening with your QR codes.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New QR
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{stat.name}</p>
            <p className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
            <p className="mt-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Recent Activity</h2>
          <Link href="/dashboard/history" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Date Created</th>
                <th className="px-6 py-3 font-medium text-right">Scans</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {recentActivity.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">{item.name}</td>
                  <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400">{item.date}</td>
                  <td className="px-6 py-4 text-right font-medium text-neutral-900 dark:text-white">{item.scans}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
