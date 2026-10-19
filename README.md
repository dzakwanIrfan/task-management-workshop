# Task Management Workshop

Repository utama untuk live coding **Day 1–3**: NestJS + Prisma + PostgreSQL, Next.js, lalu authentication JWT dan Task milik masing-masing user. Backend dan frontend adalah dua proyek `pnpm` terpisah; jalankan perintah dari direktorinya masing-masing.

**Peserta baru:** selesaikan [Environment Setup Guide](docs/environment-setup-guide.md) sebelum workshop. Panduan mencakup instalasi tools, akun GitHub, database lokal, uji API, dan checklist kesiapan.

**Uji API cepat:** buka [Bruno collection + contoh environment](bruno/README.md) untuk menjalankan register, login, CRUD Task, dan cek akses antar-user tanpa menyalin token secara manual.

## Mulai dari checkpoint yang tepat

| Sesi | Branch untuk mulai latihan | Tag untuk melihat hasil sesi | Materi |
| --- | --- | --- | --- |
| Day 1 — API CRUD dan PostgreSQL | `day-1-starter` | `day-1-checkpoint` | [Panduan Day 1](docs/day-1-nestjs-crud-postgresql.md) |
| Day 2 — UI Next.js dan CRUD | `day-2-starter` | `day-2-checkpoint` | [Panduan Day 2](docs/day-2-nextjs-crud-frontend.md) |
| Day 3 — register, login, JWT, ownership | `day-3-starter` | `day-3-checkpoint` | [Panduan Day 3](docs/day-3-auth-nextjs-nestjs.md) |

`main` dan branch `final-reference` berisi acuan akhir Day 3, contoh environment, dan dokumentasi ini. Tag checkpoint menunjuk commit historis pada akhir sesi, bukan salinan dokumentasi terbaru. Lihat materi di `main` sambil mengerjakan branch latihan.

Peta Git:

```text
day-1-starter     945c575  Kerangka Nest + model/migrasi Task; belum ada CRUD
day-1-checkpoint  0e0e8a4  CRUD backend + seed; belum ada frontend
day-2-starter     2504228  Proyek Next.js sudah ada; halaman awal akan ditulis ulang dalam panduan
day-2-checkpoint  69af26d  UI CRUD sebelum authentication
day-3-starter     69af26d  Titik awal perubahan authentication
day-3-checkpoint  6a33d39  JWT + Task per user
final-reference   main     Day 3 + dokumentasi dan contoh environment terbaru
```

Contoh untuk fasilitator yang ingin menjaga `main` tetap terbuka sebagai materi:

```bash
git clone https://github.com/dzakwanIrfan/task-management-workshop.git
cd task-management-workshop
git worktree add -b practice/day-1 ../task-management-day1-starter origin/day-1-starter
cp backend/.env.example ../task-management-day1-starter/backend/.env
cd ../task-management-day1-starter
```

Ganti `practice/day-1`, `task-management-day1-starter`, dan `day-1-starter` dengan nama Day 2/3 sesuai sesi. Untuk Day 2/3, dari repo `main` salin juga `frontend/.env.example` ke `frontend/.env` di worktree **sebelum** perintah `cd`. Seluruh perintah `cd backend`/`cd frontend` dalam panduan sesi dijalankan dari root **worktree latihan**, bukan dari repo `main`. Perubahan latihan di worktree tidak mengubah `main`. `day-1-starter` belum mempunyai frontend; `day-2-starter` sudah mempunyai proyek Next.js dan contoh halaman yang akan diganti bertahap sesuai materi.

**Batas checkpoint historis:** backend `day-1-checkpoint` memakai port bawaan `3000` bila `PORT` tidak diisi, jadi gunakan `PORT=3001` dari contoh env. Pada `day-2-checkpoint`, satu klik toggle masih mengirim dua PATCH dan ada jeda loading dua detik; [langkah 7 panduan Day 2](docs/day-2-nextjs-crud-frontend.md) memperbaikinya. Gunakan `main`/`final-reference` untuk melihat aplikasi akhir dengan authentication. Pada Day 1/2, `GET /tasks` tanpa token bisa `200`; pada Day 3 dan `main`, endpoint itu wajib JWT dan mengembalikan `401` tanpa token.

## Menjalankan acuan akhir (`main`)

Prasyarat: Node.js **20.19+**, **22.12+**, atau **24+** (sesuai syarat Prisma yang terpasang), `pnpm` 10, dan PostgreSQL. Contoh PostgreSQL lokal dengan Docker ada di [persiapan Day 1](docs/day-1-nestjs-crud-postgresql.md#0b-siapkan-postgresql-latihan). Root repo tidak memiliki `package.json` atau Docker Compose.

1. Siapkan **database latihan baru yang kosong**. Migrasi Day 3 menambah `Task.userId` wajib; migrasi itu tidak dapat langsung diterapkan pada tabel Task Day 1/2 yang sudah berisi baris tanpa pemilik. Jika datanya perlu disimpan, rencanakan backfill pemilik sebelum migrasi.
2. Salin contoh konfigurasi dan isi secret lokal:

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   openssl rand -hex 32
   ```

   Tempel hasil perintah terakhir sebagai nilai `JWT_SECRET` di `backend/.env`. Ganti `DATABASE_URL` dengan alamat database latihan yang benar. Nilai contoh URL cocok dengan opsi Docker Day 1 pada port host `5433`. `SEED_USER_EMAIL` dan `SEED_USER_PASSWORD` hanya diperlukan bila menjalankan seed opsional. Jangan commit file `.env` atau memakai secret di variabel `NEXT_PUBLIC_`.
3. Siapkan database dan jalankan backend dari terminal pertama:

   ```bash
   cd backend
   pnpm install --frozen-lockfile
   pnpm exec prisma validate
   pnpm exec prisma generate
   pnpm exec prisma migrate deploy
   pnpm start:dev
   ```

4. Jalankan frontend dari terminal kedua:

   ```bash
   cd frontend
   pnpm install --frozen-lockfile
   pnpm dev
   ```

Buka `http://localhost:3000/register`, buat akun, login di `/login`, lalu coba membuat dan mengubah Task di `/tasks`. Backend ada di `http://localhost:3001`; `GET /` mengembalikan `Hello World!`, sedangkan `GET /tasks` tanpa token mengembalikan `401`. Akun dan Task untuk latihan bisa dibuat lewat UI; seed tidak wajib. Jika ingin seed, isi kedua variabel `SEED_USER_*` di `backend/.env`, jalankan `cd backend && pnpm exec prisma db seed`, lalu login dengan akun itu. Seed saat ini membuat tiga Task hanya jika user tersebut belum punya Task.

Perubahan `backend/.env` perlu restart Nest; perubahan `frontend/.env` perlu restart Next.js. Jika port frontend berubah, sesuaikan `FRONTEND_URL` di backend karena CORS hanya mengizinkan origin itu. `NEXT_PUBLIC_API_URL` adalah alamat API yang terlihat di browser.

## Peta kode dan verifikasi

| Lokasi | Isi |
| --- | --- |
| `backend/src/tasks/` | Controller, service, DTO CRUD, dan batas kepemilikan Task |
| `backend/src/auth/` | Register, login, JWT guard, dan profil user |
| `backend/prisma/` | Schema, migrasi, dan seed opsional |
| `frontend/src/app/` | Halaman register, login, dan daftar Task |
| `frontend/src/features/` | API client, sesi, tipe, dan komponen UI |

Pemeriksaan kode dari masing-masing direktori:

```bash
cd backend
pnpm exec prisma validate
pnpm exec prisma generate
pnpm run build

cd ../frontend
pnpm run lint
pnpm run build
```

Build tidak menggantikan uji alur melalui browser/API dan database. Spec Jest bawaan backend belum disesuaikan dengan import Prisma Client dan paket Nest berbentuk ESM; `pnpm test` saat ini gagal pada resolusi modul tersebut. Jangan memakai spec bawaan itu sebagai bukti CRUD/auth berhasil. [Panduan deployment uji](docs/test-deployment-vercel-render-neon.md) membahas Vercel, Render, dan Neon setelah alur lokal berfungsi.
