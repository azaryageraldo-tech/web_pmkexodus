'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import MemberForm from './MemberForm';
import ConfirmDialog from '@/components/ConfirmDialog';

interface Member {
  id: number;
  name: string;
  position: string;
  phone: string;
  email: string;
  photo?: string;
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/members', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembers(response.data.data);
    } catch (error) {
      toast.error('Gagal mengambil data members');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setMemberToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setIsFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/members/${memberToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Member berhasil dihapus');
      fetchMembers();
    } catch (error) {
      toast.error('Gagal menghapus member');
    } finally {
      setIsConfirmOpen(false);
      setMemberToDelete(null);
    }
  };

  const handleExport = () => {
    const csvContent = members.map(member => 
      `${member.name},${member.position},${member.email},${member.phone}`
    ).join('\n');
    
    const blob = new Blob([`Name,Position,Email,Phone\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'members.csv';
    a.click();
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) ||
                         member.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || member.position.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Members</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Export CSV
          </button>
          <button 
            onClick={() => {
              setSelectedMember(undefined);
              setIsFormOpen(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Tambah Member
          </button>
        </div>
      </div>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Cari member..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-md w-64"
        />
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="all">Semua Posisi</option>
          <option value="ketua">Ketua</option>
          <option value="wakil">Wakil</option>
          <option value="sekretaris">Sekretaris</option>
          <option value="bendahara">Bendahara</option>
          <option value="anggota">Anggota</option>
        </select>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : members.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Belum ada data member</div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left">Foto</th>
                <th className="px-6 py-3 text-left">Nama</th>
                <th className="px-6 py-3 text-left">Posisi</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Telepon</th>
                <th className="px-6 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                      {member.photo ? (
                        <img 
                          src={`http://localhost:8000/storage/${member.photo}`}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">{member.name}</td>
                  <td className="px-6 py-4">{member.position}</td>
                  <td className="px-6 py-4">{member.email}</td>
                  <td className="px-6 py-4">{member.phone}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button 
                      onClick={() => handleEdit(member)} 
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(member.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <MemberForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchMembers}
        member={selectedMember}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus member ini?"
      />
    </div>
  );
}