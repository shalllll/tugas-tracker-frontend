'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllTugas, getAllMataKuliah, createTugas, updateTugas, deleteTugas } from '@/lib/api';
import { Tugas, MataKuliah, TugasStatus } from '@/types';
import { FileText, Plus, Edit2, Trash2, Circle, Clock, CheckCircle2, Calendar, Filter } from 'lucide-react';

export default function TugasPage() {
  const [tugas, setTugas] = useState<Tugas[]>([]);
  const [mataKuliah, setMataKuliah] = useState<MataKuliah[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<TugasStatus | 'all'>('all');
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    deadline: '',
    mataKuliahId: '',
    status: 'belum-dikerjakan' as TugasStatus,
  });
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tugasData, mkData] = await Promise.all([
        getAllTugas(),
        getAllMataKuliah()
      ]);
      setTugas(tugasData);
      setMataKuliah(mkData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTugas(editingId, formData);
      } else {
        await createTugas(formData);
      }
      await fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving tugas:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tugas ini?')) return;
    try {
      await deleteTugas(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting tugas:', error);
    }
  };

  const handleEdit = (t: Tugas) => {
    setEditingId(t.id);
    setFormData({
      nama: t.nama,
      deskripsi: t.deskripsi || '',
      deadline: t.deadline,
      mataKuliahId: t.mataKuliahId,
      status: t.status || 'belum-dikerjakan',
    });
    setShowForm(true);
  };

  const handleChangeStatus = async (t: Tugas, newStatus: TugasStatus) => {
    try {
      await updateTugas(t.id, { ...t, status: newStatus, selesai: newStatus === 'selesai' });
      await fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      deskripsi: '',
      deadline: '',
      mataKuliahId: '',
      status: 'belum-dikerjakan',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getStatusBadge = (status: TugasStatus | undefined, selesai?: boolean) => {
    const actualStatus = selesai ? 'selesai' : (status || 'belum-dikerjakan');
    
    switch (actualStatus) {
      case 'selesai':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-500',
          icon: CheckCircle2,
          label: 'Selesai'
        };
      case 'sedang-dikerjakan':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-500',
          icon: Clock,
          label: 'Sedang Dikerjakan'
        };
      default:
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-500',
          icon: Circle,
          label: 'Belum Dikerjakan'
        };
    }
  };

  const filteredTugas = filterStatus === 'all' 
    ? tugas 
    : tugas.filter(t => {
        const actualStatus = t.selesai ? 'selesai' : (t.status || 'belum-dikerjakan');
        return actualStatus === filterStatus;
      });

  const sortedTugas = [...filteredTugas].sort((a, b) => {
    // Sort by deadline
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FileText className="w-8 h-8 mr-3 text-blue-600" />
                Tugas
              </h1>
              <p className="text-gray-600 mt-1">Kelola dan tracking status tugas kuliah</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                ← Dashboard
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                {showForm ? 'Tutup Form' : 'Tambah Tugas'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-700">Filter:</span>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua ({tugas.length})
            </button>
            <button
              onClick={() => setFilterStatus('belum-dikerjakan')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === 'belum-dikerjakan' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Belum Dikerjakan ({tugas.filter(t => !t.status && !t.selesai || t.status === 'belum-dikerjakan').length})
            </button>
            <button
              onClick={() => setFilterStatus('sedang-dikerjakan')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === 'sedang-dikerjakan' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sedang Dikerjakan ({tugas.filter(t => t.status === 'sedang-dikerjakan').length})
            </button>
            <button
              onClick={() => setFilterStatus('selesai')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === 'selesai' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Selesai ({tugas.filter(t => t.status === 'selesai' || t.selesai).length})
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? 'Edit Tugas' : 'Tambah Tugas Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Tugas *</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mata Kuliah *</label>
                  <select
                    value={formData.mataKuliahId}
                    onChange={(e) => setFormData({ ...formData, mataKuliahId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Pilih Mata Kuliah</option>
                    {mataKuliah.map(mk => (
                      <option key={mk.id} value={mk.id}>{mk.nama} ({mk.kode})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Deadline *</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TugasStatus })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="belum-dikerjakan">Belum Dikerjakan</option>
                    <option value="sedang-dikerjakan">Sedang Dikerjakan</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  {editingId ? 'Update' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition font-semibold"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List Tugas */}
        {sortedTugas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FileText className="w-24 h-24 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">
              {filterStatus === 'all' 
                ? 'Belum ada tugas. Tambahkan tugas pertama Anda!' 
                : `Tidak ada tugas dengan status "${filterStatus === 'belum-dikerjakan' ? 'Belum Dikerjakan' : filterStatus === 'sedang-dikerjakan' ? 'Sedang Dikerjakan' : 'Selesai'}"`
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {sortedTugas.map((t) => {
              const badge = getStatusBadge(t.status, t.selesai);
              const BadgeIcon = badge.icon;
              const mkData = mataKuliah.find(mk => mk.id === t.mataKuliahId);
              const deadline = new Date(t.deadline);
              const today = new Date();
              const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              const isOverdue = daysLeft < 0 && t.status !== 'selesai' && !t.selesai;
              const isUrgent = daysLeft <= 2 && daysLeft >= 0 && t.status !== 'selesai' && !t.selesai;

              return (
                <div key={t.id} className={`bg-white rounded-xl shadow-md hover:shadow-lg transition border-l-4 ${badge.border}`}>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`${badge.bg} p-2 rounded-lg`}>
                            <BadgeIcon className={`w-6 h-6 ${badge.text}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-xl font-bold ${t.status === 'selesai' || t.selesai ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {t.nama}
                            </h3>
                            {t.deskripsi && (
                              <p className="text-gray-600 mt-1">{t.deskripsi}</p>
                            )}
                            {mkData && (
                              <p className="text-sm text-gray-500 mt-2">
                                📚 {mkData.nama} ({mkData.kode})
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 items-center">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className={`text-sm ${isOverdue ? 'text-red-600 font-semibold' : isUrgent ? 'text-yellow-600 font-semibold' : 'text-gray-600'}`}>
                              {deadline.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              {isOverdue && ' (Terlambat!)'}
                              {isUrgent && ` (${daysLeft} hari lagi)`}
                            </span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                            {badge.label}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(t)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Status Actions */}
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <button
                        onClick={() => handleChangeStatus(t, 'belum-dikerjakan')}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                          (t.status === 'belum-dikerjakan' || (!t.status && !t.selesai))
                            ? 'bg-red-600 text-white'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        Belum Dikerjakan
                      </button>
                      <button
                        onClick={() => handleChangeStatus(t, 'sedang-dikerjakan')}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                          t.status === 'sedang-dikerjakan'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        Sedang Dikerjakan
                      </button>
                      <button
                        onClick={() => handleChangeStatus(t, 'selesai')}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                          (t.status === 'selesai' || t.selesai)
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        Selesai
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
