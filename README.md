🧩 Project Name : tugas-tracker-frontend
🚀 Tech Stack

Framework: React (Vite)

Library tambahan:

    1. Axios → komunikasi API

    2. React Router DOM → routing halaman

    3. TailwindCSS → styling

📁 Folder Structure
src/
├── assets/      -> Menyimpan file statis (gambar, ikon, style tambahan)
├── components/  -> Komponen UI yang dapat digunakan kembali
├── pages/       -> Halaman utama aplikasi (Home, Login, dsb)
├── layouts/     -> Template layout (misal layout dengan sidebar)
├── hooks/       -> Custom hooks untuk state & logic reusable
├── services/    -> File untuk komunikasi API ke back-end (misal axiosInstance.js)
├── contexts/    -> Context API (misal AuthContext)
├── routes/      -> Routing aplikasi menggunakan react-router-dom
├── utils/       -> Fungsi helper umum (format date, validator, dsb)
├── App.jsx      -> Komponen utama aplikasi
└── main.jsx     -> Entry point yang render <App />


🔗 Back-End Repository
https://github.com/shalllll/tugas-tracker-backend