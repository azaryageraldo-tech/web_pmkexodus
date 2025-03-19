'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

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

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  event?: Event;
}

export default function EventForm({ isOpen, onClose, onSuccess, event }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    status: 'upcoming',
    start_date: '',
    end_date: '',
    category_id: ''  // Menambahkan category_id yang sebelumnya dihapus
  });
  
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Sesi telah berakhir, silakan login kembali');
          return;
        }
    
        const response = await axios.get('http://localhost:8000/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && response.data.data) {
          setCategories(response.data.data);
        } else {
          toast.error('Format data kategori tidak valid');
        }
      } catch (error: any) {
        const message = error.response?.data?.message || 'Gagal mengambil data kategori';
        toast.error(message);
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };
  
    fetchCategories();
  }, []);

  // Tambahkan useEffect untuk handle event data
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        location: event.location,
        status: event.status,
        start_date: event.start_date ? new Date(event.start_date).toISOString().split('T')[0] : '',
        end_date: event.end_date ? new Date(event.end_date).toISOString().split('T')[0] : '',
        category_id: event.category_id?.toString() || ''
      });
      if (event.image) {
        setImagePreview(`http://localhost:8000/storage/${event.image}`);
      }
    } else {
      resetForm();
    }
  }, [event]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      status: 'upcoming',
      start_date: '',
      end_date: '',
      category_id: ''  // tetap sertakan category_id
    });
    setImage(null);
    setImagePreview('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add date validation
    if (formData.end_date && formData.start_date > formData.end_date) {
      toast.error('Tanggal selesai harus setelah tanggal mulai');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });
      if (image) {
        form.append('image', image);
      }

      if (event) {
        await axios.post(`http://localhost:8000/api/events/${event.id}`, form, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Kegiatan berhasil diupdate');
      } else {
        await axios.post('http://localhost:8000/api/events', form, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Kegiatan berhasil ditambahkan');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Gagal menyimpan kegiatan');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (formData.title || formData.description || image) {
      if (window.confirm('Anda yakin ingin membatalkan? Perubahan tidak akan disimpan.')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
        <h2 className="text-2xl font-bold mb-6">
          {event ? 'Edit Kegiatan' : 'Tambah Kegiatan'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar
            </label>
            <div className="flex items-center space-x-4">
              {imagePreview && (
                <div className="w-32 h-32 relative">
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview('');
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    ×
                  </button>
                  <img 
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Judul</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tanggal Selesai</label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Lokasi</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          // Di bagian JSX, hapus div status yang duplikat dan perbaiki komentar
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Event['status'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="upcoming">Akan Datang</option>
              <option value="ongoing">Sedang Berlangsung</option>
              <option value="completed">Selesai</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Kategori</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              disabled={categoriesLoading}
            >
              <option value="">
                {categoriesLoading ? 'Memuat kategori...' : 'Pilih Kategori'}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}