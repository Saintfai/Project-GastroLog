<div align="center">

# 🌿 GastroLog
### Smart Reflux Journal — Jurnal Cerdas untuk Pejuang Asam Lambung

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-v5_beta-purple)](https://authjs.dev)

*Desain: Serene Digestive Care — Soft Minimalist, Sage Green, Mobile-First*

</div>

---

## 📖 Tentang Proyek

**GastroLog** adalah aplikasi web jurnal pintar yang dirancang khusus untuk penderita GERD (Gastroesophageal Reflux Disease) dan asam lambung. Aplikasi ini membantu pengguna mencatat gejala harian, makanan yang dikonsumsi, aktivitas, dan pola tidur — lalu menganalisis data tersebut untuk menemukan pemicu kambuhnya asam lambung.

Filosofi desainnya berpusat pada **empati dan ketenangan**: antarmuka yang "breathable" dan menenangkan, agar aktivitas jurnal terasa terapeutik, bukan membebani.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 📓 **Jurnal Harian** | Catat makanan, gejala, dan aktivitas setiap hari |
| 🍽️ **Log Makanan** | Lacak jenis makanan, porsi, dan waktu makan |
| 🤢 **Log Gejala** | Rekam jenis, intensitas (1–10), dan durasi gejala |
| 🏃 **Log Aktivitas** | Pantau tidur, posisi tidur, stres, dan olahraga |
| 🥗 **Database Makanan** | Katalog item makanan dengan level risiko GERD |
| 🔔 **Notifikasi** | Pengingat makan, jurnal, dan pengecekan gejala |
| 🔐 **Login Google** | Autentikasi aman via OAuth 2.0 (NextAuth.js v5) |

---

## 🖼️ Tampilan Layar

| Login | Dashboard |
|-------|-----------|
| Halaman masuk dengan tema sage hijau, animasi daun, dan Google Sign-In | Jurnal harian & ringkasan kondisi |

> Lihat desain lengkap di [`DESIGN.md`](./DESIGN.md) — sistem desain *Serene Digestive Care*.

---

## 🗂️ Struktur Proyek

```
Project-GastroLog/
├── app/
│   ├── api/                    # API Route handlers (NextAuth, dll.)
│   ├── dashboard/
│   │   └── page.tsx            # Halaman dashboard utama
│   ├── login/
│   │   └── page.tsx            # Halaman login (Google OAuth)
│   ├── globals.css             # CSS global + token desain GastroLog
│   ├── layout.tsx              # Root layout (font Inter, metadata)
│   └── page.tsx                # Halaman utama (redirect)
├── lib/
│   └── prisma.ts               # Prisma client singleton
├── prisma/
│   ├── schema.prisma           # Skema database lengkap
│   ├── seed.ts                 # Seeder data awal
│   └── migrations/             # Riwayat migrasi database
├── auth.ts                     # Konfigurasi NextAuth (Google + Prisma Adapter)
├── DESIGN.md                   # Dokumentasi sistem desain
└── .env                        # Variabel lingkungan (tidak di-commit)
```

---

## 🗄️ Skema Database

Aplikasi ini menggunakan **PostgreSQL** dengan ORM **Prisma**. Berikut adalah model-model utama:

```
User ──┬── UserProfile       (profil: usia, gender, keparahan GERD)
       ├── DailyLog ──┬── MealLog       (log makanan)
       │              ├── SymptomLog    (log gejala)
       │              └── ActivityLog   (log aktivitas & tidur)
       ├── Notification                 (pengingat jadwal)
       └── Account / Session           (NextAuth OAuth)

FoodItem                               (katalog makanan + level risiko GERD)
```

**Enum tersedia:** `Gender`, `GerdSeverity`, `MealType`, `PortionSize`, `SymptomType`, `SleepPosition`, `FoodCategory`, `GerdRiskLevel`, `NotificationType`

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Framework** | [Next.js 14](https://nextjs.org) (App Router) |
| **Bahasa** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 + CSS Custom Properties |
| **Database** | PostgreSQL |
| **ORM** | Prisma 5 |
| **Auth** | NextAuth.js v5 beta — Google OAuth 2.0 + JWT |
| **Font** | Inter (Google Fonts via `next/font`) |
| **Design** | Stitch MCP — *Serene Digestive Care* theme |

---

## 🚀 Memulai (Getting Started)

### 1. Clone & Install

```bash
git clone <repo-url>
cd Project-GastroLog
npm install
```

### 2. Buat File `.env`

Buat file `.env` di root proyek dengan variabel berikut:

```env
# Database (gunakan Supabase, Neon, atau PostgreSQL lokal)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?pgbouncer=true"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (dari Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

> **Cara mendapatkan Google Client ID & Secret:**
> 1. Buka [Google Cloud Console](https://console.cloud.google.com/)
> 2. Buat project baru atau pilih yang sudah ada
> 3. Aktifkan **Google+ API** / **Google Identity**
> 4. Di **Credentials**, buat **OAuth 2.0 Client ID** (tipe: Web application)
> 5. Tambahkan `http://localhost:3000/api/auth/callback/google` ke *Authorized Redirect URIs*

### 3. Siapkan Database

```bash
# Jalankan migrasi
npx prisma migrate dev

# (Opsional) Isi data awal
npx prisma db seed

# Lihat database di browser
npx prisma studio
```

### 4. Jalankan Dev Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser. Halaman login ada di `/login`.

---

## 📜 Scripts

| Perintah | Deskripsi |
|----------|-----------|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build production bundle |
| `npm run start` | Jalankan production server |
| `npm run lint` | Jalankan ESLint |
| `npx prisma studio` | GUI untuk melihat & edit database |
| `npx prisma migrate dev` | Buat & jalankan migrasi baru |
| `npx prisma db seed` | Isi database dengan data awal |

---

## 🎨 Sistem Desain

GastroLog menggunakan sistem desain **Serene Digestive Care** yang didokumentasikan di [`DESIGN.md`](./DESIGN.md).

| Token | Nilai | Deskripsi |
|-------|-------|-----------|
| Primary | `#566342` | Sage hijau tua — aksi utama |
| Primary Container | `#a3b18a` | Sage hijau terang — fill button |
| Background | `#f7faf5` | Putih sage — latar utama |
| Surface | `#ecefea` | Hijau abu — card background |
| On Surface | `#191c1a` | Charcoal gelap — teks utama |
| Font | `Inter` | Digunakan di semua peran teks |
| Border Radius | `4px – 9999px` | Semua elemen sangat membulat |
| Shadow | `0 4px 20px rgba(45,49,46,0.06)` | Satu level shadow difus |

---

## 🔐 Autentikasi

Autentikasi dikelola oleh **NextAuth.js v5** dengan strategi:
- **Provider:** Google OAuth 2.0
- **Adapter:** Prisma Adapter (menyimpan user, account, session ke PostgreSQL)
- **Session Strategy:** JWT (lebih ringan untuk Edge runtime)
- **Redirect setelah login:** `/dashboard`

File konfigurasi: [`auth.ts`](./auth.ts) | Route handler: `app/api/auth/[...nextauth]/`

---

## 🚢 Deploy

### Deploy ke Vercel (Rekomendasi)

1. Push kode ke GitHub
2. Import proyek di [vercel.com](https://vercel.com)
3. Tambahkan semua variabel `.env` di Vercel Dashboard → Settings → Environment Variables
4. Update **Authorized Redirect URIs** di Google Cloud Console ke URL produksi:
   ```
   https://your-domain.vercel.app/api/auth/callback/google
   ```
5. Klik **Deploy**

### Database Produksi

Gunakan layanan PostgreSQL managed seperti:
- [Supabase](https://supabase.com) — gratis, mudah diintegrasikan
- [Neon](https://neon.tech) — serverless PostgreSQL
- [Railway](https://railway.app) — all-in-one deployment

---

## 📄 Lisensi

Proyek ini bersifat privat. Seluruh hak cipta dilindungi.

---

<div align="center">

Dibuat dengan 🌿 untuk pejuang asam lambung

</div>
