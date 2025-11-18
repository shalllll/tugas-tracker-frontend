export interface MataKuliah {
  id: string;
  nama: string;
  kode: string;
  sks: number;
  dosen: string;
  jumlahPertemuan?: number;
  jumlahBolos?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type TugasStatus = 'belum-dikerjakan' | 'sedang-dikerjakan' | 'selesai';

export interface Tugas {
  id: string;
  nama: string;
  deskripsi?: string;
  deadline: string;
  mataKuliahId: string;
  mataKuliah?: MataKuliah;
  status: TugasStatus;
  selesai?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiKey {
  apiKey: string;
  name?: string;
}

export interface KomponenNilai {
  nama: string;
  bobot: number;
  nilai: number;
}
