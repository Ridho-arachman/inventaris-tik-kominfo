# 🧾 Inventaris TIK Kominfo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Aplikasi berbasis web untuk **manajemen inventaris aset Teknologi Informasi dan Komunikasi (TIK)** di lingkungan instansi pemerintah — khususnya mendukung struktur **OPD (Organisasi Perangkat Daerah)** dengan pembagian akses berbasis peran (**admin** dan **OPD**).

Dibangun dengan arsitektur modern: **Next.js App Router**, **Prisma ORM**, dan **Better Auth** untuk keamanan autentikasi.

---

## 🧭 Navigasi Cepat

- [✨ Fitur yang Sudah Ada](#-fitur-yang-sudah-ada)
- [🛠️ Tech Stack](#️-tech-stack)
- [🔐 Autentikasi](#-autentikasi)
- [📂 Struktur Route & API](#-struktur-route--api)
- [🚀 Instalasi & Pengembangan](#-instalasi--pengembangan)
- [⚙️ Konfigurasi Environment](#️-konfigurasi-environment)
- [📄 Lisensi](#-lisensi)

---

## ✨ Fitur yang Sudah Ada

### 🔐 Autentikasi & Akun

- ✅ Login & registrasi admin (`/login`, `/api/auth/sign-up/admin`)
- ✅ Lupa & reset password (`/forgot-password`, `/reset-password`)
- ✅ Verifikasi email sukses (`/verify-success`)
- ✅ Manajemen profil:
  - Edit nama, email, password (`/admin/setting-user/*`, `/opd/setting-user/*`)

### 👥 Manajemen Data (Admin)

- ✅ Kelola OPD: tambah, edit, lihat detail (`/admin/manage-opd/*`)
- ✅ Kelola pengguna OPD (`/admin/manage-user-opd/*`)
- ✅ Kelola kategori aset:
  - Hardware (`/admin/manage-kategori-asset/hardware/*`)
  - Software (`/admin/manage-kategori-asset/software/*`)
- ✅ Kelola aset pusat:
  - Hardware (`/admin/manage-asset/opd-hardware/*`)
  - Software (`/admin/manage-asset/opd-software/*`)

### 🖥️ Dashboard & Akses OPD

- ✅ Dashboard admin (`/admin`)
- ✅ Dashboard OPD (`/opd`)
- ✅ Manajemen aset khusus OPD:
  - Tambah/edit hardware & software (`/opd/asset/hardware/add`, `.../edit`)
  - Detail aset (`/opd/asset/hardware/[id]`)

### 🛠️ API Backend (Next.js Route Handlers)

- ✅ RESTful API untuk:
  - `opd`, `user-opd`, `hardware`, `software`, `kategori`, `dashboard`
  - CRUD lengkap dengan dynamic route (`/[id]`, `/edit`)
  - Autentikasi: `sign-in`, `sign-up/admin`, `logout`, `change-*`, `reset-password`, dll.

### 🎨 UI & Pengalaman Pengguna

- ✅ Desain responsif dengan **Tailwind CSS v4**
- ✅ Komponen UI interaktif:
  - Radix UI (Dialog, Select, Tooltip, dll)
  - Framer Motion (animasi halus)
  - React Hook Form + Zod (validasi form ketat)
  - Recharts (grafik — siap pakai untuk dashboard)
- ✅ Dark/light mode (`next-themes`)
- ✅ Notifikasi (`sonner`) & konfirmasi (`cmdk`)

> 💡 _Catatan_: Fitur ekspor (PDF/Excel), SSO (Google/GitHub), dan integrasi SIMDA Barang direncanakan di fase berikutnya.

---

## 🛠️ Tech Stack

| Kategori                  | Teknologi                                                       |
| ------------------------- | --------------------------------------------------------------- |
| **Framework**             | Next.js 16 (App Router), React 19                               |
| **Bahasa**                | TypeScript                                                      |
| **Styling**               | Tailwind CSS v4 + `tailwind-merge` + `clsx` + `cva`             |
| **UI Components**         | Radix UI + `lucide-react` + `cmdk` + `sonner`                   |
| **Form & Validasi**       | `react-hook-form` + `zod` + `@hookform/resolvers`               |
| **State & Data Fetching** | SWR + `react-use` + `use-debounce`                              |
| **Animasi**               | Framer Motion + `react-confetti`                                |
| **Database**              | PostgreSQL (via `pg`) + Prisma ORM (`@prisma/client`, `prisma`) |
| **Auth**                  | [`better-auth`](https://better-auth.com) (session + JWT token)  |
| **Utility**               | `date-fns`, `bcrypt`, `nodemailer`, `axios`                     |
| **Dev Tools**             | ESLint, TypeScript, `tsx`, `babel-plugin-react-compiler`        |

---

## 🔐 Autentikasi

Menggunakan **[Better Auth](https://better-auth.com)** — library modern untuk Next.js dengan:

- Session-based auth dengan token
- Proteksi route via middleware
- Built-in:
  - Email/password
  - Email verification
  - Password reset
  - Profile update
- Siap dikembangkan ke:
  - OAuth (Google, GitHub)
  - 2FA
  - Role-based session

🔐 API Auth tersedia di:  
`/api/auth/sign-in`, `/sign-up/admin`, `/logout`, `/change-*`, `/reset-password`, dll.

---

## 📂 Struktur Route & API

Struktur routing aplikasi ini menggunakan **Next.js App Router**, terdiri dari halaman publik, area admin, area OPD, serta endpoint API :

## 🌐 Halaman Publik

Halaman yang dapat diakses tanpa autentikasi:

```txt
/
├─ /login
├─ /forgot-password
├─ /reset-password
├─ /verify-success
├─ /help
└─ /profile
```

---

## 👮 Area Admin (`/admin/*`)

Digunakan untuk pengelolaan data utama seperti OPD, user, kategori aset, dan aset global.

### 📊 Dashboard

```txt
/admin
```

### 🏢 Manajemen OPD

```txt
/admin/manage-opd
├─ /add
├─ /[id]
└─ /[id]/edit
```

### 👥 Manajemen User OPD

```txt
/admin/manage-opd
├─ /add
├─ /[id]
└─ /[id]/edit
```

### 🗂️ Manajemen Kategori Aset

```txt
/admin/manage-kategori-asset
├─ /hardware
│  ├─ /add
│  └─ /[id]
└─ /software
   ├─ /add
   └─ /[id]
```

### 💻 Manajemen Aset OPD

```txt
/admin/manage-asset
├─ /opd-hardware
│  ├─ /add
│  ├─ /[id]
│  └─ /[id]/edit
└─ /opd-software
   ├─ /add
   ├─ /[id]
   └─ /[id]/edit
```

### ⚙️ Pengaturan Akun Admin

```txt
/admin/setting-user
├─ /edit-profile
├─ /edit-email
└─ /edit-password
```

---

## 🏢 Area OPD (`/opd/*`)

Digunakan oleh OPD untuk mengelola aset dan akun masing-masing.

### 📊 Dashboard OPD

```txt
/opd
```

### 📦 Aset OPD

```txt
/opd/asset
├─ /hardware
│  ├─ /add
│  ├─ /[id]
│  └─ /[id]/edit
└─ /software
   ├─ /add
   ├─ /[id]
   └─ /[id]/edit
```

### ❓ Bantuan OPD

```txt
/opd/help
```

### ⚙️ Pengaturan Akun OPD

```txt
/opd/setting-user
├─ /edit-profile
├─ /edit-email
└─ /edit-password
```

---

## 📡 API Endpoint (`/api/*`)

Semua endpoint API bersifat **server-side** dan digunakan oleh frontend.

### 🔐 Autentikasi & Akun

```txt
/api/auth/*
├─ /sign-in
├─ /sign-up/admin
├─ /logout
├─ /change-name
├─ /change-email
├─ /change-password
├─ /request-password-reset
└─ /reset-password
```

### 🏢 OPD

```txt
/api/opd
├─ /
└─ /[id]
```

### 👥 User OPD

```txt
/api/user-opd
├─ /
└─ /[id]
```

### 💻 Hardware

```txt
/api/hardware
├─ /
├─ /[id]
├─ /kategori
└─ /kategori/[id]

/api/hardware-opd
├─ /
└─ /[id]
```

### 🧩 Software

```txt
/api/software
├─ /
├─ /[id]
├─ /kategori
└─ /kategori/[id]

/api/software-opd
├─ /
└─ /[id]
```

### 📊 Dashboard Statistik

```txt
/api/dashboard
├─ /admin
└─ /opd
```

> ⚙️ Seluruh route dinamis (`[id]`) dan form (`add`, `edit`) sudah siap untuk integrasi dengan Prisma.

---

## 🚀 Instalasi & Pengembangan

### Prasyarat

- Node.js ≥ 18.x
- PostgreSQL (untuk dev/prod)
- `pnpm` direkomendasikan (lihat `package.json`)

### Langkah

```bash
# 1. Clone & masuk ke folder
git clone https://github.com/Ridho-arachman/inventaris-tik-kominfo.git
cd inventaris-tik-kominfo

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp .env.example .env.local
# → Isi: DATABASE_URL, BETTER_AUTH_SECRET, SMTP_*, dll

# 4. Generate Prisma Client & migrate (jika schema sudah ada)
npx prisma generate
npx prisma migrate dev --name init

# 5. Jalankan dev server
pnpm dev
# Akses: http://localhost:3000
```

---

## ⚙️ Konfigurasi Environment

### Contoh `.env.local` / `.env`:

```env
## NEXT JS
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

## BETTER AUTH
BETTER_AUTH_SECRET=rahasia_panjang_dan_kuat_32_char_min
BETTER_AUTH_URL=http://localhost:3000

## SMTP (Email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tim.tik@example.com
SMTP_PASS=app_password_gmail

## DATABASE (PostgreSQL)
DATABASE_URL="postgresql://user:pass@localhost:5432/db_name"
```

> 📌 `BETTER_AUTH_SECRET` wajib kuat (minimal 32 karakter) untuk keamanan session.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License** — lihat file [`LICENSE`](https://chat.qwen.ai/c/LICENSE).

```
Copyright © 2025 Kominfo & Kontributor

Permission is hereby granted... (full text in LICENSE)
```
