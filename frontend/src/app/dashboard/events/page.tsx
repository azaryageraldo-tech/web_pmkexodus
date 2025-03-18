'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/components/ConfirmDialog';
import EventForm from './EventForm';

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  start_date: string;
  end_date: string;
  image?: string;
  category_id?: number;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data.data);
    } catch (error) {
      toast.error('Gagal mengambil data kegiatan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setEventToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/events/${eventToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Kegiatan berhasil dihapus');
      fetchEvents();
    } catch (error) {
      toast.error('Gagal menghapus kegiatan');
    } finally {
      setIsConfirmOpen(false);
      setEventToDelete(null);
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kegiatan</h1>
        <button 
          onClick={() => {
            setSelectedEvent(undefined);
            setIsFormOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Tambah Kegiatan
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Belum ada kegiatan
        </div>
      ) : (
        <div className="grid gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Tanggal:</span>{' '}
                      {new Date(event.start_date).toLocaleDateString('id-ID')}
                      {event.end_date && ` - ${new Date(event.end_date).toLocaleDateString('id-ID')}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Lokasi:</span> {event.location}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                </div>
                <div className="space-x-2">
                  <button 
                    onClick={() => setSelectedEvent(event)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(event.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus kegiatan ini?"
      />
      
      <EventForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchEvents}
        event={selectedEvent}
      />
    </div>
  );
}