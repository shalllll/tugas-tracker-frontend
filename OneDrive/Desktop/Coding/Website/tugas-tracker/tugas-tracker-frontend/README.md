# 📚 Tugas Tracker - Aplikasi Manajemen Tugas Kuliah

Aplikasi web untuk membantu mahasiswa mengelola tugas kuliah, tracking kehadiran, dan menghitung prediksi nilai.

## 🌟 Fitur Utama

### 1. **Dashboard**
- 📊 Statistik tugas (Total, Selesai, Sedang Dikerjakan, Belum Dikerjakan)
- 📅 Deadline mendekati (7 hari ke depan)
- 📈 Progress completion rate
- 🚀 Quick actions untuk akses cepat

### 2. **Manajemen Mata Kuliah (CRUD)**
- ✅ Create - Tambah mata kuliah baru
- 📖 Read - Lihat semua mata kuliah
- ✏️ Update - Edit detail mata kuliah
- 🗑️ Delete - Hapus mata kuliah

**Fitur Opsional: Bolos Tracker** 🎯
- Tracking jumlah kehadiran dan ketidakhadiran
- Perhitungan persentase bolos otomatis
- Warning system untuk batas toleransi 25%
- Visual progress bar
- Status indikator (Aman/Hati-hati/Bahaya)

### 3. **Manajemen Tugas (CRUD)**
- ✅ Create - Tambah tugas baru dengan deadline
- 📖 Read - Lihat semua tugas
- ✏️ Update - Edit detail tugas
- 🗑️ Delete - Hapus tugas
- 🔄 Filter berdasarkan status

**Tracker Tugas** 📝
Status tugas dapat diubah dengan mudah:
- 🔴 **Belum Dikerjakan** - Status default
- 🟡 **Sedang Dikerjakan** - Tugas dalam progress
- 🟢 **Selesai** - Tugas telah tuntas

Fitur tambahan:
- Sorting otomatis berdasarkan deadline
- Warning untuk tugas yang terlambat
- Alert untuk deadline mendesak (≤2 hari)
- Link ke mata kuliah terkait

### 4. **Kalkulator Nilai** 🧮
**Fitur Opsional - Frontend Only**
- Tambah komponen penilaian (Tugas, UTS, UAS, dll)
- Set bobot untuk setiap komponen
- Input nilai yang sudah didapat
- Perhitungan nilai akhir otomatis
- Konversi ke grade (A, B+, B, dll)
- Kalkulator target nilai untuk setiap komponen
- Visual grade reference
- Tidak perlu backend/database

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS v4
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Backend API:** https://pekris-webdev.vercel.app/api

## 📦 Instalasi

1. **Clone repository**
```bash
git clone https://github.com/shalllll/tugas-tracker-frontend.git
cd tugas-tracker-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Buka browser**
```
http://localhost:3000
```

## 🔑 Cara Menggunakan

### 1. Akses Aplikasi
- Buka aplikasi di browser `http://localhost:3000`
- Langsung dapat menggunakan semua fitur tanpa login

### 2. Dashboard
- Lihat statistik tugas secara keseluruhan
- Cek deadline yang mendekat
- Akses quick actions untuk navigasi cepat

### 3. Kelola Mata Kuliah
- Klik "Kelola Mata Kuliah" atau menu "Mata Kuliah"
- **Tambah:** Klik "Tambah Mata Kuliah"
  - Isi: Nama, Kode, SKS, Dosen
  - (Opsional) Set total pertemuan dan jumlah bolos
- **Edit:** Klik icon pensil pada kartu mata kuliah
- **Hapus:** Klik icon trash
- **Bolos Tracker:**
  - Klik "+ Tambah Bolos" untuk menambah ketidakhadiran
  - Klik "- Kurangi Bolos" untuk koreksi
  - Lihat persentase dan status (Aman/Hati-hati/Bahaya)
  - Warning otomatis jika ≥25%

### 4. Kelola Tugas
- Klik "Kelola Tugas" atau menu "Tugas"
- **Tambah:** Klik "Tambah Tugas"
  - Isi: Nama, Mata Kuliah, Deskripsi, Deadline, Status
- **Edit:** Klik icon pensil
- **Hapus:** Klik icon trash
- **Ubah Status:** Klik tombol status (Belum/Sedang/Selesai)
- **Filter:** Gunakan filter untuk melihat tugas berdasarkan status

### 5. Kalkulator Nilai
- Klik "Kalkulator Nilai"
- Masukkan nama mata kuliah (opsional)
- **Tambah Komponen:**
  - Klik "+ Tambah Komponen"
  - Isi nama (misal: UTS, UAS, Tugas)
  - Set bobot (%) untuk komponen
  - Masukkan nilai yang didapat (0-100)
- **Lihat Hasil:**
  - Nilai akhir otomatis terhitung
  - Grade otomatis muncul (A, B+, B, dll)
  - Target nilai untuk setiap grade tersedia
- **Tips:** Pastikan total bobot = 100%

## 📁 Struktur Folder

```
tugas-tracker-frontend/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Dashboard
│   ├── mata-kuliah/
│   │   └── page.tsx         # Halaman Mata Kuliah + Bolos Tracker
│   ├── tugas/
│   │   └── page.tsx         # Halaman Tugas + Status Tracker
│   ├── kalkulator-nilai/
│   │   └── page.tsx         # Kalkulator Nilai (Frontend only)
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── lib/
│   ├── api.ts               # API service functions
│   └── axios.ts             # Axios instance & interceptors
├── types/
│   └── index.ts             # TypeScript interfaces
├── components/              # Reusable components
├── public/                  # Static files
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

Base URL: `https://pekris-webdev.vercel.app/api`

### System
- `POST /system/generate-key` - Generate API key
- `POST /system/verify-key` - Verify API key

### Mata Kuliah
- `GET /matakuliah` - Get all mata kuliah
- `GET /matakuliah/:id` - Get mata kuliah by ID
- `POST /matakuliah` - Create mata kuliah
- `PUT /matakuliah/:id` - Update mata kuliah
- `DELETE /matakuliah/:id` - Delete mata kuliah

### Tugas
- `GET /tugas` - Get all tugas
- `GET /tugas/:id` - Get tugas by ID
- `POST /tugas` - Create tugas
- `PUT /tugas/:id` - Update tugas
- `DELETE /tugas/:id` - Delete tugas
- `PATCH /tugas/:id/toggle` - Toggle status selesai

## 🎨 Fitur UI/UX

- ✨ Modern & responsive design
- 🎯 Intuitive user interface
- 🌈 Color-coded status indicators
- 📱 Mobile-friendly
- ⚡ Fast & smooth transitions
- 🔔 Visual warnings & alerts
- 📊 Progress bars & statistics
- 🎨 Gradient backgrounds
- 🖼️ Beautiful card layouts

## ⚠️ Catatan Penting

1. **Data Persistence:** Semua data disimpan di API backend. Data tidak akan hilang saat refresh browser.

2. **Bolos Tracker:** Batas toleransi default 25%. Jika melewati batas, status akan berubah menjadi "Bahaya".

3. **Kalkulator Nilai:** Pastikan total bobot = 100% untuk hasil akurat. Fitur ini tidak tersimpan di database.

4. **Status Tugas:** Dapat diubah kapan saja. Status "Selesai" akan memberi strikethrough pada nama tugas.

5. **Deadline Warning:**
   - Merah: Tugas terlambat
   - Kuning: Deadline ≤ 2 hari
   - Biru: Deadline normal

## 🚀 Build untuk Production

```bash
npm run build
npm start
```

## 📝 License

MIT License - Free to use

## 👨‍💻 Developer

Developed with ❤️ for mahasiswa Indonesia

---

**Link Repository Backend:** https://github.com/shalllll/tugas-tracker-backend

**API Documentation:** https://pekris-webdev.vercel.app/
