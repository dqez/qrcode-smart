/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DashboardPage() {
  const { user } = useAuth();
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, scans: 0, active: 0 });

  useEffect(() => {
    if (!user) return;

    const fetchQRs = async () => {
      try {
        const q = query(
          collection(db, "qrcodes"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Client-side sort to avoid index requirement
        data.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

        setQrCodes(data);

        const totalScans = data.reduce((acc, curr: any) => acc + (curr.viewCount || 0), 0);
        setStats({
          total: data.length,
          scans: totalScans,
          active: data.filter((d: any) => d.status === 'active').length
        });
      } catch (error) {
        console.error("Error fetching QRs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQRs();
  }, [user]);

  const statCards = [
    { name: 'Total QR Codes', value: stats.total.toString(), change: 'Lifetime' },
    { name: 'Total Scans', value: stats.scans.toLocaleString(), change: 'All time views' },
    { name: 'Active Links', value: stats.active.toString(), change: 'Currently active' },
  ];

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
        {statCards.map((stat) => (
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
                <th className="px-6 py-3 font-medium">Content</th>
                <th className="px-6 py-3 font-medium">Date Created</th>
                <th className="px-6 py-3 font-medium text-right">Scans</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">Loading...</td>
                </tr>
              ) : qrCodes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">No QR codes created yet.</td>
                </tr>
              ) : (
                qrCodes.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white truncate max-w-50">{item.name || 'Untitled'}</td>
                    <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400 truncate max-w-50">
                      {item.content}
                    </td>
                    <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400">
                      {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-neutral-900 dark:text-white">{item.viewCount || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
