'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calculator, Plus, Trash2, TrendingUp } from 'lucide-react';
import { KomponenNilai } from '@/types';

export default function KalkulatorNilaiPage() {
  const [mataKuliah, setMataKuliah] = useState('');
  const [komponenNilai, setKomponenNilai] = useState<KomponenNilai[]>([
    { nama: 'Tugas', bobot: 20, nilai: 0 },
    { nama: 'UTS', bobot: 30, nilai: 0 },
    { nama: 'UAS', bobot: 40, nilai: 0 },
    { nama: 'Kehadiran', bobot: 10, nilai: 0 },
  ]);
  const router = useRouter();

  const addKomponen = () => {
    setKomponenNilai([...komponenNilai, { nama: '', bobot: 0, nilai: 0 }]);
  };

  const removeKomponen = (index: number) => {
    setKomponenNilai(komponenNilai.filter((_, i) => i !== index));
  };

  const updateKomponen = (index: number, field: keyof KomponenNilai, value: string | number) => {
    const updated = [...komponenNilai];
    updated[index] = { ...updated[index], [field]: value };
    setKomponenNilai(updated);
  };

  const totalBobot = komponenNilai.reduce((sum, k) => sum + Number(k.bobot), 0);
  const nilaiAkhir = komponenNilai.reduce((sum, k) => sum + (Number(k.nilai) * Number(k.bobot) / 100), 0);

  const getGrade = (nilai: number) => {
    if (nilai >= 85) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100' };
    if (nilai >= 80) return { grade: 'A-', color: 'text-green-600', bg: 'bg-green-100' };
    if (nilai >= 75) return { grade: 'B+', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (nilai >= 70) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (nilai >= 65) return { grade: 'B-', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (nilai >= 60) return { grade: 'C+', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (nilai >= 55) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (nilai >= 50) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { grade: 'E', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const gradeInfo = getGrade(nilaiAkhir);

  const calculateTargetScore = (targetNilai: number, komponenIndex: number) => {
    const otherKomponen = komponenNilai.filter((_, i) => i !== komponenIndex);
    const otherTotal = otherKomponen.reduce((sum, k) => sum + (Number(k.nilai) * Number(k.bobot) / 100), 0);
    const targetKomponen = komponenNilai[komponenIndex];
    const required = (targetNilai - otherTotal) * 100 / Number(targetKomponen.bobot);
    return Math.ceil(required);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Calculator className="w-8 h-8 mr-3 text-purple-600" />
                Kalkulator Nilai
              </h1>
              <p className="text-gray-600 mt-1">Hitung prediksi nilai akhir mata kuliah</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              ← Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mata Kuliah */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informasi Mata Kuliah</h2>
              <input
                type="text"
                value={mataKuliah}
                onChange={(e) => setMataKuliah(e.target.value)}
                placeholder="Nama Mata Kuliah (opsional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              />
            </div>

            {/* Komponen Nilai */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Komponen Penilaian</h2>
                <button
                  onClick={addKomponen}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center text-sm font-semibold"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah Komponen
                </button>
              </div>

              <div className="space-y-4">
                {komponenNilai.map((komponen, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-12 gap-3 items-center">
                      <div className="col-span-12 md:col-span-4">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Nama Komponen</label>
                        <input
                          type="text"
                          value={komponen.nama}
                          onChange={(e) => updateKomponen(index, 'nama', e.target.value)}
                          placeholder="e.g., UTS"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-5 md:col-span-3">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Bobot (%)</label>
                        <input
                          type="number"
                          value={komponen.bobot}
                          onChange={(e) => updateKomponen(index, 'bobot', Number(e.target.value))}
                          min="0"
                          max="100"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-5 md:col-span-3">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Nilai (0-100)</label>
                        <input
                          type="number"
                          value={komponen.nilai}
                          onChange={(e) => updateKomponen(index, 'nilai', Number(e.target.value))}
                          min="0"
                          max="100"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-2 flex justify-end">
                        <button
                          onClick={() => removeKomponen(index)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Target Calculator */}
                    {komponen.bobot > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Nilai minimal untuk mendapat:</p>
                        <div className="flex gap-2 flex-wrap">
                          {[85, 80, 75, 70].map(target => {
                            const required = calculateTargetScore(target, index);
                            const isPossible = required <= 100 && required >= 0;
                            return (
                              <span 
                                key={target}
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  isPossible 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-gray-100 text-gray-400'
                                }`}
                              >
                                {getGrade(target).grade}: {isPossible ? required : 'N/A'}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Total Bobot Warning */}
              {totalBobot !== 100 && (
                <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Total bobot saat ini: <strong>{totalBobot}%</strong>
                    {totalBobot < 100 && ` (kurang ${100 - totalBobot}%)`}
                    {totalBobot > 100 && ` (lebih ${totalBobot - 100}%)`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            {/* Nilai Akhir */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                Hasil Perhitungan
              </h2>

              {mataKuliah && (
                <div className="mb-4 pb-4 border-b">
                  <p className="text-sm text-gray-600">Mata Kuliah</p>
                  <p className="text-lg font-bold text-gray-900">{mataKuliah}</p>
                </div>
              )}

              <div className="text-center py-8 bg-linear-to-br from-purple-50 to-pink-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Nilai Akhir</p>
                <p className="text-6xl font-bold text-gray-900 mb-4">
                  {nilaiAkhir.toFixed(2)}
                </p>
                <div className={`inline-block px-6 py-3 rounded-full ${gradeInfo.bg}`}>
                  <p className={`text-3xl font-bold ${gradeInfo.color}`}>
                    {gradeInfo.grade}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Bobot</span>
                  <span className={`font-semibold ${totalBobot === 100 ? 'text-green-600' : 'text-red-600'}`}>
                    {totalBobot}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Komponen Nilai</span>
                  <span className="font-semibold text-gray-900">{komponenNilai.length}</span>
                </div>
              </div>
            </div>

            {/* Grade Reference */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Referensi Nilai</h3>
              <div className="space-y-2">
                {[
                  { grade: 'A', range: '85 - 100', color: 'bg-green-100 text-green-800' },
                  { grade: 'A-', range: '80 - 84', color: 'bg-green-100 text-green-700' },
                  { grade: 'B+', range: '75 - 79', color: 'bg-blue-100 text-blue-800' },
                  { grade: 'B', range: '70 - 74', color: 'bg-blue-100 text-blue-700' },
                  { grade: 'B-', range: '65 - 69', color: 'bg-blue-100 text-blue-600' },
                  { grade: 'C+', range: '60 - 64', color: 'bg-yellow-100 text-yellow-800' },
                  { grade: 'C', range: '55 - 59', color: 'bg-yellow-100 text-yellow-700' },
                  { grade: 'D', range: '50 - 54', color: 'bg-orange-100 text-orange-700' },
                  { grade: 'E', range: '0 - 49', color: 'bg-red-100 text-red-700' },
                ].map(item => (
                  <div key={item.grade} className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded font-bold text-sm ${item.color}`}>
                      {item.grade}
                    </span>
                    <span className="text-sm text-gray-600">{item.range}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-linear-to-r from-purple-100 to-pink-100 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Tips</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Pastikan total bobot = 100%</li>
                <li>• Masukkan nilai yang sudah ada</li>
                <li>• Lihat nilai target di setiap komponen</li>
                <li>• Kalkulator ini hanya prediksi</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
