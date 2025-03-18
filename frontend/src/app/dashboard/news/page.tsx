'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/components/ConfirmDialog';
import NewsForm from './NewsForm';

interface News {
  id: number;
  title: string;
  content: string;
  image?: string;
  created_at: string;
  category?: string; // Tambahkan field category
}

export default function News() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | undefined>();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedNewsDetail, setSelectedNewsDetail] = useState<News | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/news', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNews(response.data.data);
    } catch (error) {
      toast.error('Gagal mengambil data berita');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setNewsToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!newsToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/news/${newsToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Berita berhasil dihapus');
      fetchNews();
    } catch (error) {
      toast.error('Gagal menghapus berita');
    } finally {
      setIsConfirmOpen(false);
      setNewsToDelete(null);
    }
  };

  const [category, setCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'akademik', label: 'Akademik' },
    { value: 'organisasi', label: 'Organisasi' },
    { value: 'prestasi', label: 'Prestasi' },
    { value: 'umum', label: 'Umum' }
  ];
  const filteredAndSortedNews = news
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                     item.content.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || item.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
  
  const handleShare = async (news: News) => {
    try {
      await navigator.share({
        title: news.title,
        text: news.content.substring(0, 100) + '...',
        url: window.location.href
      });
    } catch (error) {
      // Fallback jika Web Share API tidak didukung
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link berita telah disalin');
    }
  };
  
  const handleViewDetail = (news: News) => {
    setSelectedNewsDetail(news);
    setIsDetailOpen(true);
  };

  const paginatedNews = filteredAndSortedNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAndSortedNews.length / itemsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Berita</h1>
        <button 
          onClick={() => {
            setSelectedNews(undefined);
            setIsFormOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Tambah Berita
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Cari berita..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-md w-64"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">Loading...</div>
        ) : paginatedNews.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            {search ? 'Tidak ada berita yang sesuai dengan pencarian' : 'Belum ada berita'}
          </div>
        ) : (
          paginatedNews.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {item.image && (
                <img 
                  src={`http://localhost:8000/storage/${item.image}`}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 cursor-pointer hover:text-indigo-600" onClick={() => handleViewDetail(item)}>
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{item.content}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <div className="space-x-2">
                    <button 
                      onClick={() => setSelectedNews(item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Sebelumnya
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === i + 1 ? 'bg-indigo-600 text-white' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Selanjutnya
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailOpen && selectedNewsDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
            {selectedNewsDetail.image && (
              <img 
                src={`http://localhost:8000/storage/${selectedNewsDetail.image}`}
                alt={selectedNewsDetail.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-2xl font-bold mb-4">{selectedNewsDetail.title}</h2>
            <p className="text-gray-600 mb-4 whitespace-pre-wrap">{selectedNewsDetail.content}</p>
            <div className="text-sm text-gray-500 mb-4">
              Dipublikasikan: {new Date(selectedNewsDetail.created_at).toLocaleDateString()}
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={() => handleShare(selectedNewsDetail)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Bagikan
              </button>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus berita ini?"
      />
      <NewsForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchNews}
        news={selectedNews}
      />
    </div>
  );
}