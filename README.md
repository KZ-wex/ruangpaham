# RuangPaham - Transformasi Cara Belajar dengan Generative AI

**RuangPaham** adalah platform _Active Recall_ berbasis AI yang dirancang untuk membantu mahasiswa dan pelajar memahami materi pelajaran yang kompleks secara instan. Projek ini dikembangkan untuk **GDGOC Universitas Esa Unggul Mini Competition (Minicomp)** 2026 dengan tema _"Build Impactful Solutions with Artificial Intelligence"_.

## 🌟 Latar Belakang & Masalah

Banyak pelajar menghabiskan waktu berjam-jam untuk membaca materi secara pasif (membaca ulang/menghafal), namun seringkali kesulitan saat harus menjawab soal ujian karena kurangnya latihan terarah.

**RuangPaham** hadir sebagai solusi yang mengubah proses belajar pasif menjadi aktif. Dengan memanfaatkan **Google Gemini API**, aplikasi ini mampu menyederhanakan materi yang rumit menjadi rangkuman yang ringkas, serta secara otomatis menghasilkan kuis interaktif untuk menguji pemahaman pengguna secara _real-time_.

## 🚀 Fitur Utama

- **AI Summary:** Meringkas materi panjang atau catatan rumit menjadi poin-poin penting yang mudah dipahami (Explain Like I'm 5).
- **Interactive Quiz Generator:** Menghasilkan kuis pilihan ganda secara otomatis berdasarkan materi yang diinput menggunakan _Structured Output (JSON)_ dari Gemini.
- **Smart Scoring:** Memberikan penilaian instan, skor akhir, serta penjelasan mendalam untuk setiap jawaban kuis.
- **History Tracking:** Menyimpan riwayat materi yang pernah dipelajari dan skor kuis pengguna secara aman menggunakan Firebase Firestore.
- **Secure Authentication:** Integrasi Google Sign-In untuk pengalaman pengguna yang lancar dan aman.

## 🛠️ Tech Stack & Arsitektur

Aplikasi ini menggunakan arsitektur hibrida modern untuk memisahkan _statis frontend_ dan _dinamis backend_:

- **Frontend (Client):** React.js (Vite), Tailwind CSS, Shadcn UI.
- **Backend (Server):** Node.js (Express & TypeScript) untuk menjembatani komunikasi aman dengan AI Engine.
- **BaaS (Database & Auth):** Firebase Authentication & Firebase Firestore.
- **AI Engine:** Google Gemini API (`gemini-1.5-flash` via Google AI Studio).

### 🌐 Cloud Deployment Architecture

Untuk efisiensi dan keamanan tingkat tinggi, projek ini di-deploy menggunakan dua infrastruktur Google Cloud secara sinkron:

1. **Firebase Hosting:** Melayani kebutuhan aset statis frontend (HTML, CSS, JS) lewat global CDN agar pemuatan aplikasi menjadi super cepat.
2. **Google Cloud Run:** Menjalankan _containerized backend server_ (`server.ts`) secara serverless untuk memproses logika AI dan data sensitif tanpa mengekspos API Key ke sisi klien.
3. **Firebase Hosting Rewrites (Proxy):** Menghubungkan rute `/api/**` dari domain statis Firebase langsung ke endpoint Cloud Run secara internal.

## ⚙️ Persiapan & Instalasi Lokal

### 1. Prasyarat

Pastikan Anda sudah menginstal:

- Node.js (v18 atau versi terbaru)
- Firebase CLI (`npm install -g firebase-tools`)
- Gemini API Key (dapatkan di [Google AI Studio](https://aistudio.google.com/))

### 2. Setup Projek Lokal

Clone repository ini:

```bash
git clone [https://github.com/username-anda/ruangpaham-gdgoc.git](https://github.com/username-anda/ruangpaham-gdgoc.git)
cd ruangpaham
```
