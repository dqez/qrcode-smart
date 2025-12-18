/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Protect the route
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: HomeIcon },
    { name: "History", href: "/dashboard/history", icon: ListIcon },
    { name: "Profile", href: "/dashboard/profile", icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <span className="font-bold text-xl"><span>QRCode <span className="text-indigo-600 dark:text-indigo-400">Smart</span></span></span>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="flex flex-col h-full">
            <div className="h-16 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-800">
              <Link href="/" className="font-bold text-xl"><span>QRCode <span className="text-indigo-600 dark:text-indigo-400">Smart</span></span></Link>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
              <button
                onClick={() => logout()}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogoutIcon className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

// Icons
function HomeIcon(props: any) {
  return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
}
function ListIcon(props: any) {
  return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
}
function UserIcon(props: any) {
  return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
}
function MenuIcon(props: any) {
  return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>;
}
function LogoutIcon(props: any) {
  return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
}
