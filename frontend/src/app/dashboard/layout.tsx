'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      localStorage.removeItem('token');
      router.push('/auth/login');
    }
  };

  const isActive = (path: string) => {
    return currentPath.startsWith(path) ? 'bg-indigo-600' : '';
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-700 text-white flex flex-col">
        <div className="p-4 border-b border-indigo-600">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="flex-1 py-4">
          <Link href="/dashboard" className={`block px-4 py-2 hover:bg-indigo-600 ${isActive('/dashboard') && currentPath === '/dashboard' ? 'bg-indigo-600' : ''}`}>
            Dashboard
          </Link>
          <Link href="/dashboard/members" className={`block px-4 py-2 hover:bg-indigo-600 ${isActive('/dashboard/members')}`}>
            Members
          </Link>
          <Link href="/dashboard/news" className={`block px-4 py-2 hover:bg-indigo-600 ${isActive('/dashboard/news')}`}>
            News
          </Link>
        </nav>
        <div className="p-4 border-t border-indigo-600">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left hover:bg-indigo-600 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-100">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}