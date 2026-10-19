# Environment Setup Guide — Sebelum Workshop

Siapkan laptop yang akan kamu pakai saat workshop dengan mengikuti urutan di bawah. Alokasikan sekitar **60–90 menit**, di luar waktu download. Selesaikan paling lambat sehari sebelum workshop agar masih ada waktu memperbaiki kendala.

**Target selesai:** kamu bisa membuka kode di VS Code, menjalankan Node.js, mengunduh dependency dengan pnpm, terhubung ke PostgreSQL, dan mengirim request ke backend lokal melalui API client.

## 1. Yang perlu disiapkan

| Kebutuhan | Pilihan untuk workshop | Fungsinya | Bukti berhasil |
| --- | --- | --- | --- |
| Node.js | **24.x LTS**; npm ikut terpasang | Menjalankan NestJS dan Next.js | `node -v` → `v24.x.x` |
| pnpm | **10.26.2** | Menginstal dependency proyek | `pnpm -v` → `10.26.2` |
| Git | Versi stabil dari situs resmi | Mengunduh dan menyimpan perubahan kode | `git --version` menampilkan versi |
| VS Code | Versi stabil | Editor dan terminal | Folder proyek dan terminal bisa dibuka |
| PostgreSQL | **16.x** sebagai acuan | Database lokal | Query SQL dan migrasi berhasil |
| API client | **Bruno desktop** (atau Postman) | Menguji endpoint backend | Request lokal mendapat `200 OK` |
| Akun GitHub | Akun pribadi dengan email terverifikasi | Mengakses repository dan menyimpan latihan | Bisa login dan membuat repository |

Node.js 24 dipilih untuk menyamakan lingkungan peserta. Repository memakai Prisma 7; Node.js 18 atau 20 versi awal tidak cocok dengan kebutuhan proyek. PostgreSQL 17/18 yang sudah terpasang boleh dipakai; tidak perlu memasang server kedua. pnpm dipatok mengikuti `frontend/package.json` di repository ini.

Pastikan ada koneksi internet untuk download, browser, dan izin instalasi aplikasi di laptop. Jika laptop kantor membatasi instalasi, selesaikan aksesnya dengan pengelola perangkat sebelum workshop.

### Cara membaca perintah

- Jalankan satu baris perintah setiap kali, lalu tunggu sampai selesai. Jangan ketik tanda pagar pembuka/penutup blok kode.
- **Windows:** gunakan **Command Prompt** agar perintah npm/pnpm tidak terhalang kebijakan script PowerShell. Di VS Code: **Terminal → Select Default Profile → Command Prompt**, lalu **Terminal → New Terminal**.
- **macOS/Linux:** gunakan Terminal bawaan atau terminal VS Code.
- Blok `sql` dijalankan di Query Tool pgAdmin atau di prompt `psql`, bukan langsung di terminal biasa.
- Setelah instalasi, tutup terminal dan buka lagi agar perintah baru dikenali.

## 2. Instal Node.js dan pnpm

1. Buka [download resmi Node.js](https://nodejs.org/en/download).
2. Pilih **Node.js 24 LTS** dan sistem operasi laptopmu. Untuk Windows gunakan installer `.msi`; untuk macOS gunakan `.pkg` dengan arsitektur yang sesuai. Apple Silicon (M1/M2/M3/dst.) memakai ARM64; Mac Intel memakai x64.
3. Jalankan installer dengan pilihan default, termasuk npm dan penambahan ke PATH. Untuk Linux, ikuti pilihan instalasi Linux pada halaman resmi tersebut dan pilih versi 24.
4. Buka terminal baru, lalu cek:

```bash
node -v
npm -v
node -e "console.log('Node.js siap')"
```

Hasil: versi Node diawali `v24.`, npm menampilkan nomor versi, dan muncul `Node.js siap`.

Instal pnpm dengan versi yang digunakan workshop:

```bash
npm install --global pnpm@10.26.2
pnpm -v
```

Hasil: `10.26.2`. Kita memakai pnpm untuk dependency proyek; npm di atas hanya dipakai untuk memasang pnpm. Rujukan: [instalasi pnpm](https://pnpm.io/installation).

## 3. Instal Git dan siapkan akun GitHub

### Git

1. Buka [download resmi Git](https://git-scm.com/downloads/), pilih sistem operasi.
2. Windows: jalankan installer, gunakan opsi Git yang bisa dipanggil dari command line. macOS: ikuti opsi installer/Command Line Tools di halaman download. Ubuntu: jalankan `sudo apt update`, lalu `sudo apt install git`.
3. Buka terminal baru:

```bash
git --version
```

Atur identitas commit. **Ganti** nama dan email contoh dengan milikmu; email dapat memakai alamat privat `noreply` dari **GitHub Settings → Emails**.

```bash
git config --global user.name "Nama Kamu"
git config --global user.email "email-kamu@example.com"
git config --global --get user.name
git config --global --get user.email
```

Hasil dua perintah terakhir harus sesuai identitas yang kamu isi. Identitas commit ini tidak otomatis membuatmu login ke GitHub.

### Akun GitHub

1. Daftar di [github.com/signup](https://github.com/signup), atau gunakan akun yang sudah ada.
2. Verifikasi email dari pesan GitHub dan pastikan kamu bisa login kembali.
3. Klik **+ → New repository**, beri nama `workshop-setup-check`, pilih **Private**, centang **Add a README file**, lalu buat repository.
4. Buka repository tersebut. Jika README terlihat, akunmu siap untuk membuat repository latihan.

Rujukan: [membuat akun GitHub](https://docs.github.com/en/account-and-profile/how-tos/account-management/creating-an-account-on-github). Clone repository publik pada langkah 7 tidak memerlukan login; login browser dan keberhasilan clone belum membuktikan akses push. Saat perlu push ke repository milikmu, ikuti login browser dari Git Credential Manager/VS Code; password akun GitHub bukan password untuk Git HTTPS.

## 4. Instal VS Code

1. Unduh dari [situs resmi VS Code](https://code.visualstudio.com/download).
2. Windows: jalankan installer dan aktifkan **Add to PATH** jika ditawarkan. macOS: pindahkan aplikasi ke **Applications**. Linux: pasang paket yang sesuai distribusi.
3. Buka VS Code, pilih **File → Open Folder**, lalu coba **Terminal → New Terminal**.
4. Jalankan `node -v`, `pnpm -v`, dan `git --version` di terminal VS Code. Hasilnya harus sama seperti terminal sebelumnya.

Extension yang membantu: **ESLint** dan **Prettier - Code formatter**. Cari melalui panel Extensions dan pilih publisher resmi masing-masing. Extension tidak wajib untuk lulus setup.

Perintah `code .` opsional. Di macOS, aktifkan melalui Command Palette (`Cmd+Shift+P`) → **Shell Command: Install 'code' command in PATH**. Jika belum tersedia, tetap bisa membuka proyek lewat **File → Open Folder**. Rujukan: [CLI VS Code](https://code.visualstudio.com/docs/configure/command-line).

## 5. Instal PostgreSQL dan buat database latihan

Pilih **satu jalur** sesuai sistem operasi. Bagian ini memakai PostgreSQL native pada port **5432**. Jika sudah mempunyai PostgreSQL yang berjalan, gunakan server tersebut dan buat database baru untuk workshop.

### Windows atau macOS: installer dan pgAdmin

1. Buka [download resmi PostgreSQL](https://www.postgresql.org/download/), lalu pilih Windows atau macOS dan ikuti tautan installer.
2. Pilih versi **16.x** bila tersedia. Instal **PostgreSQL Server**, **pgAdmin 4**, dan **Command Line Tools**. Komponen tambahan Stack Builder boleh dilewati.
3. Saat diminta, buat dan simpan password administrator database `postgres`. Ini berbeda dari password login laptop atau GitHub.
4. Gunakan port **5432** jika masih kosong. Jika installer menyatakan port terpakai, cek apakah PostgreSQL sudah berjalan; gunakan instance yang ada, atau catat port lain yang dipilih.
5. Buka **pgAdmin 4**. Master password pgAdmin, jika diminta, adalah pengunci penyimpanan password aplikasi; password koneksi server tetap password `postgres` tadi.
6. Buka server PostgreSQL di panel kiri dan masukkan password `postgres`. Jika belum terdaftar: klik kanan **Servers → Register → Server**, isi nama `Workshop Local`; pada tab **Connection**, isi host `localhost`, port `5432`, maintenance database `postgres`, username `postgres`, dan password instalasi.
7. Pilih database `postgres`, lalu **Tools → Query Tool**.

### Ubuntu 24.04: paket sistem

Di terminal, jalankan satu per satu:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl enable --now postgresql
sudo -u postgres psql
```

Perintah terakhir membuka prompt `postgres=#`. Untuk distribusi/versi Linux lain, gunakan [petunjuk PostgreSQL Ubuntu](https://www.postgresql.org/download/linux/ubuntu/) atau pilih distribusimu di halaman download resmi.

### Buat user dan database khusus workshop

Jalankan SQL berikut **satu per satu** di Query Tool atau prompt `psql`. Pada pgAdmin, seleksi satu statement lalu tekan Execute/F5. `CREATE DATABASE` harus dijalankan sendiri, di luar transaksi.

```sql
CREATE ROLE workshop WITH LOGIN PASSWORD 'workshop_local_only' CREATEDB;
```

```sql
CREATE DATABASE task_management_day1 OWNER workshop;
```

Password contoh hanya untuk database latihan pada laptop sendiri. Hak `CREATEDB` disiapkan untuk shadow database yang dipakai `prisma migrate dev` saat workshop. Jika role/database sudah ada dari setup ini, lewati statement pembuatannya dan verifikasi koneksi di bawah; jangan hapus database yang sudah berisi pekerjaanmu.

**Windows/macOS:** di pgAdmin, daftarkan koneksi server kedua bernama `Workshop User`, host `localhost`, port `5432`, maintenance database `task_management_day1`, username `workshop`, password `workshop_local_only`. Buka Query Tool pada database `task_management_day1` melalui koneksi ini, agar benar-benar menguji user latihan.

**Ubuntu:** keluar dari prompt administrator dengan `\q`, lalu login sebagai user latihan:

```bash
psql -h localhost -p 5432 -U workshop -d task_management_day1
```

Masukkan `workshop_local_only` saat diminta. Karakter password tidak terlihat saat diketik di terminal; itu normal.

Jalankan query verifikasi melalui koneksi user latihan:

```sql
SELECT current_user, current_database(), version();
```

Hasil harus memuat user **`workshop`**, database **`task_management_day1`**, dan versi PostgreSQL. Ubuntu: ketik `\q` untuk kembali ke terminal biasa.

Simpan catatan lokal ini untuk langkah 7:

```dotenv
DATABASE_URL="postgresql://workshop:workshop_local_only@localhost:5432/task_management_day1?schema=public"
```

Jika portmu berbeda, ubah `5432` sesuai instalasi. Template `.env.example` di `main` menggunakan port **5433** untuk opsi Docker pada panduan Day 1; jangan menyalin port itu untuk instalasi native 5432 ini. Jika sudah memakai Docker sesuai [panduan Day 1](day-1-nestjs-crud-postgresql.md#0b-siapkan-postgresql-latihan), gunakan koneksi Docker tersebut dan database khusus latihan; instalasi native tambahan tidak diperlukan.

## 6. Instal API client

Repository menyediakan [Bruno collection dan contoh environment](../bruno/README.md) untuk uji API cepat. Jika memilih Bruno, instal [Bruno desktop](https://www.usebruno.com/downloads), lalu gunakan **New Request** untuk uji `GET /` pada langkah 7. Setelah backend Day 3/acuan akhir siap, buka folder `bruno/` melalui **Open Collection**, pilih environment `Local.example`, lalu jalankan collection sesuai panduannya. Run All collection memerlukan endpoint auth dan CRUD yang belum tersedia pada starter Day 1.

Alternatif: gunakan **Postman desktop** dari [halaman download resmi](https://www.postman.com/downloads/). Pilih sistem operasi dan arsitektur laptop, instal, lalu buka aplikasinya. Jika belum ingin membuat akun Postman, gunakan pilihan lightweight API client tanpa login bila tersedia. Akun GitHub tetap disiapkan terpisah.

Pilih **New → HTTP Request** atau tombol untuk request baru. Siapkan method **GET**; alamat dan verifikasi request ada pada langkah 7. Tampilan tombol dapat berbeda antarversi.

Gunakan aplikasi desktop untuk mengakses backend lokal. Jika memilih Postman web, pasang dan aktifkan **Desktop Agent** sebelum mengirim request ke `localhost`. Rujukan: [instalasi Postman](https://learning.postman.com/docs/getting-started/installation/install-app/).

## 7. Uji seluruh setup dengan starter Day 1

Bagian ini memeriksa Git, dependency, PostgreSQL, Prisma, NestJS, dan API client sekaligus. Kita memakai **`day-1-starter`**, yaitu kerangka awal latihan; `main` sudah berisi authentication dan aplikasi akhir.

### Unduh kode

Buka terminal di folder tempat kamu menyimpan proyek, misalnya folder Documents. Jalankan:

```bash
git clone --branch day-1-starter https://github.com/dzakwanIrfan/task-management-workshop.git task-management-latihan
cd task-management-latihan
git branch --show-current
```

Hasil perintah terakhir: `day-1-starter`. Buka folder **`task-management-latihan`** di VS Code melalui **File → Open Folder**. Jika nama folder sudah ada, buka hasil clone sebelumnya atau gunakan nama folder baru; jangan menimpa latihanmu.

### Siapkan konfigurasi dan dependency

Di VS Code, buat file **`backend/.env`** melalui Explorer → klik kanan folder `backend` → **New File** → `.env`. File contoh tidak tersedia di semua checkpoint historis, jadi isi langsung:

```dotenv
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL="postgresql://workshop:workshop_local_only@localhost:5432/task_management_day1?schema=public"
```

Gunakan port/user/password database milikmu jika berbeda. Simpan file. Pastikan namanya tepat `.env`, bukan `.env.txt`, dan letaknya di dalam folder `backend`.

Di terminal pada root `task-management-latihan`, jalankan:

```bash
cd backend
pnpm install --frozen-lockfile
pnpm exec prisma validate
pnpm exec prisma generate
pnpm exec prisma migrate deploy
pnpm start:dev
```

Tunggu setiap perintah selesai sebelum lanjut. Hasil yang diharapkan:

- Install selesai tanpa error.
- Prisma menyatakan schema valid dan client berhasil dibuat. Kedua perintah ini sendiri belum membuktikan koneksi database.
- `migrate deploy` berhasil menerapkan migrasi ke `task_management_day1` (atau menyatakan tidak ada migrasi tertunda jika pernah dijalankan). Ini membuktikan koneksi dan penulisan schema database.
- Nest menampilkan pesan aplikasi berhasil dimulai. Biarkan terminal tetap terbuka.

**Khusus starter Day 1:** kode awal belum membaca `.env` untuk startup Nest, sehingga backend berjalan pada **port 3000**, walaupun file `.env` berisi `PORT=3001`. Prisma CLI sudah membaca `.env` untuk koneksi database. Pada materi Day 1 kita menambahkan `ConfigModule` agar backend memakai **3001**, lalu frontend memakai **3000** pada Day 2. Untuk uji awal ini, pastikan port 3000 kosong.

### Kirim request lokal

Di Bruno atau Postman, buat request:

```http
GET http://localhost:3000/
```

Klik **Send**. Hasil yang benar:

```text
Status: 200 OK
Body: Hello World!
```

Buka juga alamat tersebut di browser. Jika teks yang sama muncul, server lokal bisa diakses. `GET /tasks` belum tersedia pada starter ini; endpoint CRUD akan dibuat bersama saat workshop.

Setelah selesai, hentikan server dengan **Ctrl+C** di terminal. Untuk menjalankannya lagi, buka terminal di folder `backend` dan jalankan `pnpm start:dev`. PostgreSQL harus tetap berjalan. Simpan clone ini untuk Day 1; pembukaan materi Day 1 akan menambahkan kode ke starter tersebut. Jika mengikuti pola worktree fasilitator di panduan sesi, salin konfigurasi database lokal ini ke worktree yang dipakai.

Frontend baru diperlukan pada Day 2. Tidak adanya folder frontend pada starter Day 1 adalah kondisi yang benar. Perpindahan checkpoint Day 2/3 mengikuti [README utama](../README.md#mulai-dari-checkpoint-yang-tepat); setiap tahap mempunyai perubahan schema, jadi jangan menerapkan migrasi Day 3 ke data Day 1 yang ingin disimpan tanpa mengikuti panduannya.

## 8. Jika menemui kendala

| Gejala | Yang perlu dilakukan |
| --- | --- |
| `node`, `npm`, `pnpm`, atau `git` tidak dikenali | Tutup seluruh terminal dan VS Code, buka lagi. Cek instalasi dan opsi PATH. Setelah Node dikenali, ulangi pemasangan pnpm jika diperlukan. |
| `node -v` masih versi lama | Windows: jalankan `where node`. macOS/Linux: `which -a node`. Periksa instalasi ganda atau version manager; pilih Node 24 lalu buka terminal baru. |
| PowerShell menampilkan `running scripts is disabled` | Ganti profil terminal ke **Command Prompt**, lalu buka terminal baru. |
| `npm install --global` gagal `EACCES` pada macOS/Linux | Gunakan instalasi Node melalui version manager pada halaman resmi Node, pilih Node 24, lalu ulangi instalasi pnpm pada terminal baru. Hindari mengganti permission folder sistem secara acak. |
| pnpm menampilkan versi selain 10.26.2 | Jalankan lagi `npm install --global pnpm@10.26.2`, buka terminal baru, cek `pnpm -v`. |
| Clone gagal `Repository not found` | Salin URL persis dari langkah 7 dan pastikan repository dapat dibuka di browser. Jangan memakai URL repository privat peserta lain. |
| `ERR_PNPM_NO_PKG_MANIFEST` | Kamu berada di root repo. Masuk ke `backend`, lalu ulangi perintah pnpm. |
| Download dependency timeout/proxy/certificate error | Pastikan internet tersambung; coba jaringan lain yang diizinkan. Jika perangkat dikelola kantor, cek proxy/sertifikat dengan pengelola. Jangan menonaktifkan pemeriksaan TLS. |
| `psql` tidak dikenali di Windows/macOS | Gunakan Query Tool pgAdmin untuk SQL, atau tambahkan folder `bin` instalasi PostgreSQL ke PATH. Prisma tidak membutuhkan perintah `psql` untuk menjalankan migrasi. |
| PostgreSQL `connection refused` / Prisma `P1001` | Pastikan server PostgreSQL aktif. Windows: cek service PostgreSQL di **Services**. macOS: gunakan kontrol server dari installer. Ubuntu: `sudo systemctl status postgresql`. Cocokkan host/port dengan `DATABASE_URL`. |
| `password authentication failed` / Prisma `P1000` | Cocokkan user dan password dengan koneksi yang berhasil di pgAdmin/psql. Password `postgres` dan `workshop` berbeda. Jika memakai password sendiri dengan karakter khusus, lakukan URL-encoding pada password di URL. |
| `database does not exist` / Prisma `P1003` | Buat database `task_management_day1` sesuai langkah 5, lalu cocokkan nama database di URL. |
| Role atau database `already exists` | Verifikasi koneksi user `workshop` ke database yang benar. Lewati statement pembuatannya bila sudah benar; jangan menghapus data yang ada. |
| Prisma tidak menemukan `DATABASE_URL` | Periksa file `backend/.env`, simpan, dan jalankan perintah dari `backend`. |
| `EADDRINUSE` / port 3000 terpakai | Hentikan server latihan sebelumnya dengan Ctrl+C. Untuk starter Day 1, `.env` belum mengubah port Nest; kosongkan port 3000 dahulu. |
| API client `ECONNREFUSED` | Pastikan terminal Nest masih berjalan tanpa error dan pakai `http://localhost:3000/` untuk starter. Setelah penambahan ConfigModule pada sesi, gunakan port 3001. |
| `404` pada `/tasks` | Starter belum punya CRUD. Uji `GET /` untuk setup. |
| `401` pada `/tasks` | Cek `git branch --show-current`; kamu mungkin menjalankan acuan akhir yang sudah memakai JWT. Kembali ke petunjuk checkpoint yang sesuai. |

Jika masih gagal, catat **OS, langkah terakhir, perintah yang dijalankan, dan pesan error lengkap** untuk disampaikan ke panitia melalui kanal workshop. Jangan membagikan isi `.env`, password, token, atau URL database yang memuat kredensial. Jangan melanjutkan ke langkah berikutnya sebelum langkah yang gagal selesai.

## 9. Checklist siap workshop

- [ ] Node.js 24, npm, pnpm 10.26.2, dan Git terdeteksi dari terminal VS Code.
- [ ] Identitas Git sudah diisi dengan nama dan email milikku.
- [ ] Akun GitHub bisa login, email terverifikasi, dan bisa membuat repository percobaan.
- [ ] VS Code dapat membuka folder hasil clone `task-management-latihan`.
- [ ] PostgreSQL berjalan; login sebagai user `workshop` dan query database berhasil.
- [ ] File `backend/.env` tersimpan dengan URL database lokal yang benar.
- [ ] Install dependency, Prisma validate/generate, dan migrasi starter selesai tanpa error.
- [ ] Backend starter bisa dijalankan kembali dengan `pnpm start:dev`.
- [ ] Bruno atau Postman menerima `200 OK` dan `Hello World!` dari `GET http://localhost:3000/`.
- [ ] Aku tahu cara menghentikan backend dengan Ctrl+C dan menjalankannya lagi.

Jika seluruh kotak sudah dicentang, environment siap untuk memulai Day 1. Saat workshop, bawa laptop yang sama beserta charger.
