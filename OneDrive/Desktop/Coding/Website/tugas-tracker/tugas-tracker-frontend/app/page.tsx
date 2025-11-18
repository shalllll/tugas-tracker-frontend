'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllTugas, getAllMataKuliah } from '@/lib/api';
import { Tugas, MataKuliah } from '@/types';
import { Calendar, BookOpen, CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';

export default function Home() {
  const [tugas, setTugas] = useState<Tugas[]>([]);
  const [mataKuliah, setMataKuliah] = useState<MataKuliah[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
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

    fetchData();
  }, []);

  // Statistics
  const totalTugas = tugas.length;
  const tugasSelesai = tugas.filter(t => t.status === 'selesai' || t.selesai).length;
  const tugasSedangDikerjakan = tugas.filter(t => t.status === 'sedang-dikerjakan').length;
  const tugasBelumDikerjakan = tugas.filter(t => t.status === 'belum-dikerjakan' || (!t.status && !t.selesai)).length;

  // Upcoming deadlines (next 7 days)
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingTugas = tugas
    .filter(t => {
      const deadline = new Date(t.deadline);
      return deadline >= today && deadline <= nextWeek && t.status !== 'selesai' && !t.selesai;
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Selamat datang di Tugas Tracker</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              🏠 Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tugas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalTugas}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Selesai</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{tugasSelesai}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sedang Dikerjakan</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{tugasSedangDikerjakan}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Belum Dikerjakan</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{tugasBelumDikerjakan}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Deadlines */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-blue-600" />
                Deadline Mendekati (7 Hari)
              </h2>
              <Link href="/tugas" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Lihat Semua →
              </Link>
            </div>

            {upcomingTugas.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Tidak ada deadline dalam 7 hari ke depan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingTugas.map((t) => {
                  const daysLeft = Math.ceil((new Date(t.deadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  const isUrgent = daysLeft <= 2;
                  
                  return (
                    <div key={t.id} className={`p-4 rounded-lg border-l-4 ${isUrgent ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{t.nama}</h3>
                          {t.deskripsi && <p className="text-sm text-gray-600 mt-1">{t.deskripsi}</p>}
                          <p className="text-xs text-gray-500 mt-2">
                            Deadline: {new Date(t.deadline).toLocaleDateString('id-ID', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isUrgent ? 'bg-red-200 text-red-800' : 'bg-blue-200 text-blue-800'
                        }`}>
                          {daysLeft} hari lagi
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/tugas"
                  className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition text-center"
                >
                  📝 Kelola Tugas
                </Link>
                <Link
                  href="/mata-kuliah"
                  className="block w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition text-center"
                >
                  📚 Kelola Mata Kuliah
                </Link>
                <Link
                  href="/kalkulator-nilai"
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition text-center"
                >
                  🧮 Kalkulator Nilai
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
                Progress
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-semibold text-gray-900">
                      {totalTugas > 0 ? Math.round((tugasSelesai / totalTugas) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${totalTugas > 0 ? (tugasSelesai / totalTugas) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Total Mata Kuliah</p>
                  <p className="text-2xl font-bold text-gray-900">{mataKuliah.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
