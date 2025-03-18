'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalMembers: number;
  totalNews: number;
  totalEvents: number;
  activeEvents: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    totalNews: 0,
    totalEvents: 0,
    activeEvents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal mengambil data dashboard';
      toast.error(message);
      console.error('Dashboard stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Anggota</h3>
          <p className="text-3xl font-bold">{stats.totalMembers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Berita</h3>
          <p className="text-3xl font-bold">{stats.totalNews}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Kegiatan</h3>
          <p className="text-3xl font-bold">{stats.totalEvents}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Kegiatan Aktif</h3>
          <p className="text-3xl font-bold">{stats.activeEvents}</p>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Members</h2>
          <p className="text-gray-600 mb-4">Kelola data anggota organisasi</p>
          <Link 
            href="/dashboard/members" 
            className="text-indigo-600 hover:text-indigo-800"
          >
            Manage Members →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">News</h2>
          <p className="text-gray-600 mb-4">Kelola berita dan pengumuman</p>
          <Link 
            href="/dashboard/news" 
            className="text-indigo-600 hover:text-indigo-800"
          >
            Manage News →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Events</h2>
          <p className="text-gray-600 mb-4">Kelola kegiatan organisasi</p>
          <Link 
            href="/dashboard/events" 
            className="text-indigo-600 hover:text-indigo-800"
          >
            Manage Events →
          </Link>
        </div>
      </div>
    </div>
  );
}