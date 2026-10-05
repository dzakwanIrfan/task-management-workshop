# Test deployment reference app — Vercel, Render, dan Neon

> Diperiksa pada **5 Oktober 2026**. Panduan ini memakai paket gratis untuk menguji **build production** aplikasi workshop. Hasilnya dapat diakses melalui HTTPS, tetapi layanan Free dapat tidur, lambat saat bangun, atau berhenti ketika kuota habis. Render sendiri tidak menganjurkan Free instance untuk aplikasi production yang membutuhkan ketersediaan terjamin. Tidak ada langkah yang memerlukan domain berbayar atau upgrade paket.

## Hasil yang akan diuji

```text
Browser ── membuka halaman ──> Next.js di Vercel (*.vercel.app)
Browser ── fetch HTTPS + Bearer JWT ──> NestJS di Render (*.onrender.com)
NestJS ── koneksi PostgreSQL/TLS ──> Neon
```

Pada checkout ini, request API dijalankan langsung oleh browser melalui `NEXT_PUBLIC_API_URL` di `frontend/src/features/auth/api/`. Frontend **tidak** membuka koneksi database. Hanya backend yang menerima `DATABASE_URL`; backend juga memegang `JWT_SECRET`. Login menyimpan token dalam cookie di host frontend, lalu request API mengirim header `Authorization: Bearer ...`. Karena dua host berbeda, CORS backend harus mengizinkan origin Vercel yang tepat. Cookie token Day 3 dapat dibaca JavaScript; pengamanan sesi untuk aplikasi sungguhan perlu dirancang terpisah.

| Komponen | Paket untuk panduan ini | Batas yang perlu diketahui |
| --- | --- | --- |
| Vercel | Hobby | Gratis untuk proyek pribadi/nonkomersial; gunakan subdomain `vercel.app`. Jika kuota gratis terlampaui, layanan Hobby dijeda. Node.js 20 sudah dinonaktifkan untuk deployment baru sejak 1 Oktober 2026, jadi pilih Node.js **24.x**. [Ketentuan Hobby](https://vercel.com/legal/terms), [batas paket](https://vercel.com/docs/plans), [perubahan Node.js 20](https://vercel.com/changelog/node-js-20-is-being-deprecated). |
| Render | Free Web Service | Tidur setelah 15 menit tanpa request; bangun kembali dapat memakan sekitar satu menit. Ada 750 jam instance aktif per workspace per bulan, serta batas bandwidth/build. Jangan menambahkan metode pembayaran jika ingin layanan berhenti saat kuota gratis habis, tanpa tagihan tambahan. [Batas Free](https://render.com/docs/free). |
| Neon | Free | Sejak pengumuman **2 Oktober 2026**: 1 GB penyimpanan dan 100 CU-hours komputasi per proyek per bulan. Kuota ini cukup untuk latihan dengan penggunaan ringan, bukan janji layanan menyala 24/7. [Pengumuman Neon](https://neon.com/blog/neon-free-plan-1-gb-per-project). |

Render Postgres Free kedaluwarsa setelah 30 hari, sehingga panduan memakai Neon untuk database. Periksa paket **Free/Hobby** pada ketiga dashboard sebelum menekan tombol deploy; jangan memilih add-on berbayar. [Sumber: Render Free](https://render.com/docs/free).

## 0. Periksa repo sebelum deploy

Repo mempunyai dua proyek terpisah dan dua lockfile: `backend/` untuk NestJS/Prisma, `frontend/` untuk Next.js. Root repo tidak memiliki `package.json`. Pastikan versi Day 3 yang berisi auth, relasi pemilik Task, serta ketiga folder migrasi di `backend/prisma/migrations/` sudah di-commit dan tersedia di GitHub. Untuk jalur Hobby gratis, gunakan repo GitHub **milik akun pribadi**, seperti remote `origin` repo ini; [Vercel Hobby tidak mendukung menghubungkan repo milik organisasi Git](https://vercel.com/docs/limits). Pemilik project Hobby juga perlu menjadi penulis commit yang di-deploy. [Aturan Git Vercel](https://vercel.com/docs/git).

Jalankan dari root repo:

```bash
git status --short
git ls-files backend/prisma/migrations frontend/src/proxy.ts

cd backend
pnpm install --frozen-lockfile
pnpm exec prisma validate --config prisma7.config.ts
pnpm exec prisma generate --config prisma7.config.ts
pnpm run build

cd ../frontend
pnpm install --frozen-lockfile
pnpm run build
```

`prisma generate` wajib: `backend/generate/prisma/` tidak disimpan dalam Git, tetapi diimpor oleh source NestJS. Jika `next build` lokal gagal karena unduhan `next/font/google`, periksa koneksi ke Google Fonts; kode frontend memang mengimpor font tersebut di `frontend/src/app/layout.tsx`. Jangan commit `backend/.env`, `frontend/.env`, `node_modules`, atau URL database yang mengandung password. Commit perubahan kode yang akan di-deploy, lalu push branch tersebut ke GitHub. Pada repo ini, remote `origin` dan branch `main` sudah ada; untuk commit yang telah siap, perintahnya `git push origin main`.

## 1. Buat PostgreSQL Free di Neon

1. Daftar/login di [Neon Console](https://console.neon.tech/), pilih paket **Free**, lalu **Create project**. Misalnya beri nama `task-management-workshop`.
2. Pilih region terdekat yang tersedia untuk kedua layanan, misalnya **Singapore** untuk Neon dan Render. Pilih branch/database bawaan project untuk tutorial ini. [Region Render](https://render.com/docs/regions), [region Neon](https://neon.com/docs/introduction/regions).
3. Di project Neon, buka **Connect**. Pilih branch, database, dan role yang benar. **Matikan Connection pooling** saat menyalin connection string. Untuk satu backend Render dengan trafik workshop ringan, URL langsung ini dapat dipakai baik oleh adapter `pg` maupun `prisma migrate deploy`. Host URL langsung tidak mengandung `-pooler`; biarkan parameter `sslmode=require` dari Neon. [Koneksi Neon](https://neon.com/docs/get-started/connect-neon).
4. Simpan URL tersebut secara privat untuk langkah Render. Bentuknya seperti di bawah; **jangan salin contoh ini sebagai kredensial nyata**:

   ```text
   postgresql://ROLE:PASSWORD@ep-EXAMPLE.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

Gunakan **database baru yang kosong**. Migrasi `20261003000001_add_task_owners` menambah kolom `Task.userId` yang wajib; migrasi itu tidak dapat langsung diterapkan jika tabel `Task` lama sudah berisi baris tanpa pemilik. Jangan mengarahkan tutorial ke database lokal yang sudah berisi data Day 1/2. Tidak perlu menjalankan seed; akun dan Task akan dibuat lewat UI setelah deploy.

## 2. Deploy backend NestJS di Render

1. Login di [Render Dashboard](https://dashboard.render.com/), pilih **New → Web Service**, lalu hubungkan repository GitHub dan branch yang memuat kode terbaru. [Panduan Render Web Service](https://render.com/docs/web-services).
2. Isi konfigurasi berikut:

   | Field Render | Nilai |
   | --- | --- |
   | Name | Nama unik, misalnya `task-workshop-api-NAMA` |
   | Language/Runtime | **Node** |
   | Root Directory | `backend` |
   | Region | **Singapore** jika sama dengan project Neon |
   | Instance Type / Compute Plan | **Free** |
   | Build Command | Perintah di bawah |
   | Start Command | `node dist/src/main.js` |

   **Build Command** (satu baris di Render):

   ```bash
   corepack pnpm@10.26.2 install --frozen-lockfile --prod=false && corepack pnpm@10.26.2 exec prisma generate --config prisma7.config.ts && corepack pnpm@10.26.2 run build && corepack pnpm@10.26.2 exec prisma migrate deploy --config prisma7.config.ts
   ```

   `corepack pnpm@10.26.2` menjalankan pnpm pada versi yang ditentukan tanpa `corepack enable`. Langkah `enable` mencoba mengubah `/usr/bin/pnpm` dan dapat gagal dengan `EROFS` pada filesystem Render yang read-only. `--prod=false` memastikan devDependencies seperti Prisma CLI dan Nest CLI tersedia saat build. `prisma migrate deploy` menjalankan migrasi yang sudah di-commit, setelah TypeScript berhasil dibangun; perintah ini tidak menjalankan seed dan tidak membuat Prisma Client. `start:prod` di `backend/package.json` saat ini menunjuk `dist/main`, sedangkan hasil build checkout ini ada di `dist/src/main.js`, sehingga isi **Start Command** persis seperti tabel. [Corepack: jalankan package manager langsung](https://github.com/nodejs/corepack/blob/main/README.md#utility-commands), [Prisma migrate deploy](https://www.prisma.io/docs/cli/v7/migrate/deploy), [tahapan deploy Render](https://render.com/docs/deploys).

3. Tambahkan **Environment Variables** di Render, bukan di Git:

   | Key | Value |
   | --- | --- |
   | `DATABASE_URL` | Connection string **langsung** dari Neon, termasuk `sslmode=require` |
   | `JWT_SECRET` | Secret acak hasil `openssl rand -hex 32` dari terminal lokal; simpan outputnya secara privat |
   | `FRONTEND_URL` | Sementara `http://localhost:3000`; akan diganti dengan domain Vercel pada langkah 4 |
   | `NODE_VERSION` | `24.21.0` untuk memakai versi Node 24 yang tetap pada Render |

   Render menyediakan `PORT` sendiri (default `10000`); `main.ts` sudah membaca `process.env.PORT`, jadi tidak perlu mengisi port manual. `app.listen(...)` NestJS pada checkout ini menggunakan alamat semua interface secara default, sesuai syarat Render. [Port Render](https://render.com/docs/web-services), [versi Node Render](https://render.com/docs/node-version).

4. Klik **Deploy Web Service**. Pada log build, cari urutan `prisma generate` → `nest build` → `prisma migrate deploy` dan pastikan migrasi selesai tanpa error. Render Free tidak menyediakan **Pre-deploy Command** atau shell/one-off job; karena itu migrasi diletakkan di akhir Build Command. Untuk workshop dengan database baru, ini praktis. Pada deploy berikutnya, tinjau SQL migrasi sebelum push: migrasi yang sudah sukses mengubah Neon walaupun proses start versi baru kemudian gagal. [Batas Render Free](https://render.com/docs/free), [Pre-deploy Render](https://render.com/docs/deploys).
5. Catat URL HTTPS yang ditampilkan Render, misalnya `https://task-workshop-api-NAMA.onrender.com`. Buka URL tersebut; route `GET /` seharusnya menampilkan **`Hello World!`**. Route ini membuktikan proses NestJS hidup, sementara uji register/Task pada langkah 5 membuktikan koneksi database.

## 3. Deploy frontend Next.js di Vercel

1. Login ke [Vercel Dashboard](https://vercel.com/dashboard) dengan akun **Hobby**. Klik **Add New → Project**, lalu **Import** repository GitHub yang sama.
2. Klik **Edit** pada **Root Directory**, pilih `frontend`, lalu pastikan **Framework Preset = Next.js**. Pilih **Node.js 24.x** dan biarkan Output Directory bawaan. [Panduan Vercel monorepo](https://vercel.com/docs/monorepos), [Node.js Vercel](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).
3. Pada **Build & Development Settings**, aktifkan **Override** untuk dua field berikut:

   | Field Vercel | Nilai |
   | --- | --- |
   | Install Command | `corepack pnpm@10.26.2 install --frozen-lockfile` |
   | Build Command | `corepack pnpm@10.26.2 run build` |

   `frontend/pnpm-lock.yaml` memakai format 9.0 dan `frontend/package.json` mematok pnpm 10.26.2. Repo ini tidak memiliki `package.json` pada **root repository**. Vercel membutuhkan field `packageManager` di root repository untuk fitur `ENABLE_EXPERIMENTAL_COREPACK=1`; tanpa itu, Corepack otomatis tidak aktif dan Vercel dapat menjalankan pnpm lama yang mengabaikan lockfile. Dua command di atas memanggil versi pnpm yang benar secara langsung. Jangan mengganti Install Command dengan `pnpm install` saja: [Vercel dapat memilih pnpm 6 untuk override seperti itu](https://vercel.com/docs/package-managers). [Aturan Corepack Vercel](https://vercel.com/docs/builds/configure-a-build#corepack).
4. Sebelum klik Deploy, tambahkan Environment Variable untuk **Production**:

   ```text
   NEXT_PUBLIC_API_URL=https://URL-RENDER-YANG-SEBENARNYA.onrender.com
   ```

   Salin URL Render yang nyata, **tanpa slash di akhir** dan tanpa path `/auth` atau `/tasks`. Jika sebelumnya menambahkan `ENABLE_EXPERIMENTAL_COREPACK=1`, hapus variable itu dari Vercel; command pada langkah 3 sudah memilih pnpm 10 secara eksplisit. Nilai `NEXT_PUBLIC_` masuk ke JavaScript browser ketika Next.js dibangun. Jangan isi `DATABASE_URL` atau `JWT_SECRET` di Vercel. [Environment variables Vercel](https://vercel.com/docs/environment-variables).
5. Klik **Deploy** dan catat domain **Production** yang stabil, misalnya `https://task-workshop-NAMA.vercel.app`. Buka halaman `/register` untuk memastikan frontend terpasang. Jika mengubah `NEXT_PUBLIC_API_URL` sesudahnya, buat **deployment Production baru**; perubahan env tidak mengubah build yang sudah terbit.

## 4. Hubungkan CORS backend ke domain Vercel

Di Render, buka Web Service → **Environment**. Ubah `FRONTEND_URL` menjadi **origin domain Production Vercel yang tepat**, misalnya:

```text
https://task-workshop-NAMA.vercel.app
```

Jangan tambahkan slash di belakang, `/login`, atau `/tasks`. Simpan dan tunggu service selesai deploy/restart. Backend `main.ts` hanya mengizinkan satu origin tersebut. Domain Preview Vercel yang berubah tiap branch/commit tidak otomatis diizinkan; jalankan uji tutorial pada domain Production. Frontend memakai Bearer token, sehingga tidak perlu konfigurasi `credentials: include` atau cookie lintas domain pada NestJS.

## 5. Uji alur frontend → backend → database

Ganti placeholder berikut dengan URL nyata. Jalankan dari terminal lokal; tanda kutip menjaga URL tetap satu argumen.

```bash
API_URL='https://URL-RENDER-YANG-SEBENARNYA.onrender.com'
WEB_URL='https://URL-VERCEL-YANG-SEBENARNYA.vercel.app'

curl -i "$API_URL/"
curl -i "$API_URL/tasks"
curl -i -X OPTIONS "$API_URL/tasks" \
  -H "Origin: $WEB_URL" \
  -H 'Access-Control-Request-Method: GET' \
  -H 'Access-Control-Request-Headers: authorization'
```

**Hasil yang diharapkan:** `GET /` → `200` dengan `Hello World!`; `GET /tasks` tanpa token → `401`; respons `OPTIONS` memuat `Access-Control-Allow-Origin` yang **sama persis** dengan `$WEB_URL` dan mengizinkan header `authorization`. Request pertama dapat menunggu sekitar satu menit karena Render Free sedang bangun.

Lanjutkan lewat browser pada **domain Production Vercel**:

1. Buka `/register`, buat akun latihan dengan email unik, lalu login di `/login`.
2. Buka `/tasks`; buat satu Task dan catat judulnya. Refresh halaman. Task yang sama harus tetap ada.
3. Buka DevTools → **Network**. Request `/auth/login` dan `/tasks` harus menuju `https://...onrender.com`, bukan `localhost`. Request `/tasks` setelah login membawa `Authorization: Bearer ...`; jangan menyalin token ke screenshot atau chat.
4. Di Neon Console → **SQL Editor**, jalankan query baca-saja berikut pada branch/database yang dipakai Render:

   ```sql
   SELECT id, title, "userId" FROM "Task" ORDER BY id DESC LIMIT 5;
   ```

   Judul Task yang dibuat dari halaman Vercel harus ada di Neon. Ini membuktikan alur lengkap: browser → Render API → PostgreSQL Neon.
5. Opsional: logout, lalu buka `/tasks` lagi. Next.js Proxy akan mengarahkan ke `/login`; request API tanpa JWT tetap ditolak backend dengan `401`.

## Jika ada error

| Gejala | Periksa |
| --- | --- |
| Render: `EROFS ... unlink '/usr/bin/pnpm'` saat `corepack enable` | Ganti Build Command dengan perintah pada langkah 2 yang memanggil `corepack pnpm@10.26.2` langsung; jalankan deploy ulang. Error ini terjadi sebelum migrasi database. |
| Vercel: `package.json is missing "packageManager"`, `Ignoring not compatible lockfile`, atau `ERR_INVALID_THIS` ketika `pnpm install` | Hapus `ENABLE_EXPERIMENTAL_COREPACK=1`. Pada Root Directory `frontend`, isi **Install Command** dan **Build Command** persis seperti langkah 3, lalu deploy ulang. Root repo ini memang tidak memiliki `package.json`; pin di `frontend/package.json` saja tidak dipakai oleh aktivasi Corepack otomatis Vercel. |
| Vercel berhasil, tetapi browser memanggil `localhost:3001` | `NEXT_PUBLIC_API_URL` belum diisi untuk **Production**, salah Root Directory, atau env berubah tanpa deployment baru. Cek request URL di Network. |
| Error CORS atau `OPTIONS` tidak mengembalikan origin Vercel | Cocokkan `FRONTEND_URL` Render dengan domain **Production** Vercel secara persis: `https://`, hostname, tanpa slash akhir. Tunggu Render menerapkan perubahan. |
| Render: `Cannot find module .../dist/main` | Pakai Start Command `node dist/src/main.js`, bukan script `start:prod` yang ada saat ini. |
| Render: `Cannot find module .../generate/prisma/client` / tipe Prisma hilang | Pastikan `pnpm exec prisma generate --config prisma7.config.ts` berjalan **sebelum** `pnpm run build` di Root Directory `backend`. |
| Migrasi gagal pada `Task.userId` | Neon harus memakai database baru/kosong. Jika data lama perlu dipertahankan, buat rencana backfill pemilik dulu; jangan menjalankan `migrate reset`, `migrate dev`, atau `db push` pada database deploy. |
| Render gagal start: `JWT_SECRET` / `DATABASE_URL` tidak ada | Pastikan kedua variable terisi di Render Environment dan `JWT_SECRET` minimal 32 karakter. Jangan mengandalkan `backend/.env` lokal karena file itu tidak ikut Git. |
| Request awal lambat, kemudian normal | Wajar saat Render Free baru bangun. Jika terus gagal, periksa Events/Logs Render dan kuota Free Neon/Render. |

Untuk deployment berikutnya, jalankan `prisma generate`, build, dan `migrate deploy` lewat Build Command yang sama. Sebelum push migrasi baru, baca SQL-nya dan pastikan aman untuk data yang sudah ada. Jangan menjalankan seed demo secara otomatis pada setiap deploy.

### Rujukan resmi tambahan

- [Render: Root Directory untuk repo dengan beberapa proyek](https://render.com/docs/monorepo-support)
- [Render: Build, Pre-deploy, dan Start Command](https://render.com/docs/deploys)
- [Prisma 7: migrate deploy](https://www.prisma.io/docs/cli/v7/migrate/deploy)
- [Vercel: mengatur environment variables](https://vercel.com/docs/environment-variables)
- [Neon: connection string](https://neon.com/docs/get-started/connect-neon)
