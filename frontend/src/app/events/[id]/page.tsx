'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  image?: string;
}

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  const fetchEventDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/public/events/${id}`);
      setEvent(response.data.data);
    } catch (error) {
      console.error('Failed to fetch event detail');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Kegiatan tidak ditemukan</h1>
          <Link href="/events" className="text-indigo-600 hover:text-indigo-800">
            Kembali ke daftar kegiatan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/events" className="text-indigo-600 hover:text-indigo-800 mb-8 block">
        ← Kembali ke daftar kegiatan
      </Link>

      {event.image && (
        <div className="mb-8">
          <img
            src={`http://localhost:8000/storage/${event.image}`}
            alt={event.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
          <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(event.status)}`}>
            {event.status === 'upcoming' ? 'Akan Datang' :
             event.status === 'ongoing' ? 'Sedang Berlangsung' : 'Selesai'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Tanggal</h3>
            <p className="mt-1 text-lg text-gray-900">
              {new Date(event.date).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Lokasi</h3>
            <p className="mt-1 text-lg text-gray-900">{event.location}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Deskripsi</h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}