'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllMataKuliah, createMataKuliah, updateMataKuliah, deleteMataKuliah } from '@/lib/api';
import { MataKuliah } from '@/types';
import { BookOpen, Plus, Edit2, Trash2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function MataKuliahPage() {
  const [mataKuliah, setMataKuliah] = useState<MataKuliah[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    kode: '',
    sks: 0,
    dosen: '',
    jumlahPertemuan: 16,
    jumlahBolos: 0,
  });
  const router = useRouter();

  useEffect(() => {
    fetchMataKuliah();
  }, []);

  const fetchMataKuliah = async () => {
    try {
      const data = await getAllMataKuliah();
      setMataKuliah(data);
    } catch (error) {
      console.error('Error fetching mata kuliah:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMataKuliah(editingId, formData);
      } else {
        await createMataKuliah(formData);
      }
      await fetchMataKuliah();
      resetForm();
    } catch (error) {
      console.error('Error saving mata kuliah:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus mata kuliah ini?')) return;
    try {
      await deleteMataKuliah(id);
      await fetchMataKuliah();
    } catch (error) {
      console.error('Error deleting mata kuliah:', error);
    }
  };

  const handleEdit = (mk: MataKuliah) => {
    setEditingId(mk.id);
    setFormData({
      nama: mk.nama,
      kode: mk.kode,
      sks: mk.sks,
      dosen: mk.dosen,
      jumlahPertemuan: mk.jumlahPertemuan || 16,
      jumlahBolos: mk.jumlahBolos || 0,
    });
    setShowForm(true);
  };

  const handleTambahBolos = async (mk: MataKuliah) => {
    try {
      await updateMataKuliah(mk.id, {
        ...mk,
        jumlahBolos: (mk.jumlahBolos || 0) + 1,
      });
      await fetchMataKuliah();
    } catch (error) {
      console.error('Error updating bolos:', error);
    }
  };

  const handleKurangiBolos = async (mk: MataKuliah) => {
    if ((mk.jumlahBolos || 0) <= 0) return;
    try {
      await updateMataKuliah(mk.id, {
        ...mk,
        jumlahBolos: (mk.jumlahBolos || 0) - 1,
      });
      await fetchMataKuliah();
    } catch (error) {
      console.error('Error updating bolos:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      kode: '',
      sks: 0,
      dosen: '',
      jumlahPertemuan: 16,
      jumlahBolos: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const calculatePercentage = (bolos: number, total: number) => {
    return total > 0 ? ((bolos / total) * 100).toFixed(1) : '0.0';
  };

  const getBolosStatus = (percentage: number) => {
    if (percentage >= 25) return { color: 'red', icon: XCircle, text: 'Bahaya!' };
    if (percentage >= 20) return { color: 'yellow', icon: AlertTriangle, text: 'Hati-hati' };
    return { color: 'green', icon: CheckCircle, text: 'Aman' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BookOpen className="w-8 h-8 mr-3 text-green-600" />
                Mata Kuliah
              </h1>
              <p className="text-gray-600 mt-1">Kelola mata kuliah dan tracking kehadiran</p>
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
                className="px-4 py-2 bg-linear-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                {showForm ? 'Tutup Form' : 'Tambah Mata Kuliah'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Mata Kuliah *</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kode MK *</label>
                <input
                  type="text"
                  value={formData.kode}
                  onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">SKS *</label>
                <input
                  type="number"
                  value={formData.sks}
                  onChange={(e) => setFormData({ ...formData, sks: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Dosen *</label>
                <input
                  type="text"
                  value={formData.dosen}
                  onChange={(e) => setFormData({ ...formData, dosen: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Pertemuan</label>
                <input
                  type="number"
                  value={formData.jumlahPertemuan}
                  onChange={(e) => setFormData({ ...formData, jumlahPertemuan: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Jumlah Bolos</label>
                <input
                  type="number"
                  value={formData.jumlahBolos}
                  onChange={(e) => setFormData({ ...formData, jumlahBolos: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
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

        {/* List Mata Kuliah */}
        {mataKuliah.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <BookOpen className="w-24 h-24 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">Belum ada mata kuliah. Tambahkan mata kuliah pertama Anda!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {mataKuliah.map((mk) => {
              const bolosPercentage = parseFloat(calculatePercentage(mk.jumlahBolos || 0, mk.jumlahPertemuan || 16));
              const status = getBolosStatus(bolosPercentage);
              const StatusIcon = status.icon;

              return (
                <div key={mk.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <BookOpen className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{mk.nama}</h3>
                            <p className="text-gray-600 mt-1">Kode: {mk.kode} • SKS: {mk.sks}</p>
                            <p className="text-gray-600">Dosen: {mk.dosen}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(mk)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(mk.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Bolos Tracker */}
                    <div className={`mt-4 p-4 rounded-lg border-l-4 ${
                      status.color === 'red' ? 'bg-red-50 border-red-500' :
                      status.color === 'yellow' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-green-50 border-green-500'
                    }`}>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-5 h-5 ${
                            status.color === 'red' ? 'text-red-600' :
                            status.color === 'yellow' ? 'text-yellow-600' :
                            'text-green-600'
                          }`} />
                          <h4 className="font-semibold text-gray-900">Bolos Tracker</h4>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          status.color === 'red' ? 'bg-red-200 text-red-800' :
                          status.color === 'yellow' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-green-200 text-green-800'
                        }`}>
                          {status.text}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-600">Total Pertemuan</p>
                          <p className="text-lg font-bold text-gray-900">{mk.jumlahPertemuan || 16}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Jumlah Bolos</p>
                          <p className="text-lg font-bold text-gray-900">{mk.jumlahBolos || 0}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Persentase Bolos</p>
                          <p className="text-lg font-bold text-gray-900">{bolosPercentage}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Batas Maksimal</p>
                          <p className="text-lg font-bold text-gray-900">25%</p>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            status.color === 'red' ? 'bg-red-500' :
                            status.color === 'yellow' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(bolosPercentage, 100)}%` }}
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTambahBolos(mk)}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm"
                        >
                          + Tambah Bolos
                        </button>
                        <button
                          onClick={() => handleKurangiBolos(mk)}
                          disabled={(mk.jumlahBolos || 0) <= 0}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          - Kurangi Bolos
                        </button>
                      </div>

                      {bolosPercentage >= 25 && (
                        <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg">
                          <p className="text-xs text-red-800 font-semibold">
                            ⚠️ Anda telah melewati batas toleransi 25%! Tidak bisa bolos lagi.
                          </p>
                        </div>
                      )}
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
