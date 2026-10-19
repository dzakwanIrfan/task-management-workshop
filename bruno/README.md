# API Collection — Bruno

Collection ini menguji backend **`main` / `final-reference` (hasil Day 3)**: register, login, profil, dan seluruh CRUD Task dengan JWT. Request disimpan sebagai file `.bru` agar bisa dibuka langsung dan dipelajari bersama kode.

## Mulai cepat

1. Siapkan dan jalankan backend mengikuti [README utama](../README.md#menjalankan-acuan-akhir-main). Gunakan **database latihan khusus**, dengan migrasi Day 3 sudah diterapkan. Backend default: `http://localhost:3001`.
2. Instal [Bruno desktop](https://www.usebruno.com/downloads), lalu pilih **Open Collection** dan buka folder **`bruno/`** ini, yang berisi `bruno.json`. Tidak perlu import Postman atau akun Bruno.
3. Pilih environment **`Local.example`**. Nilai contoh sudah dapat dipakai pada backend lokal port 3001.
4. Buka **Collection Runner**, pilih seluruh request, lalu jalankan **berurutan 01–22**, satu iterasi. Jangan menjalankan secara paralel karena request saling memakai token dan ID.
5. Semua assertion harus lulus, termasuk request yang memang mengharapkan `400`, `401`, `404`, atau `409`.

Untuk belajar satu per satu, klik Send mulai dari `01 Health` sampai `08 Update Task`. Token login dan ID task otomatis dipakai oleh request berikutnya; tidak perlu copy-paste JWT. Jalankan request **20** saat siap menghapus task latihan. Setelah request 20, request detail/update untuk ID yang sama akan menghasilkan 404; mulai lagi dari 01 untuk alur baru.

Collection ini **menulis data**: setiap eksekusi penuh membuat dua akun latihan, membuat satu task, mengubahnya, lalu menghapus task tersebut. Kedua akun tetap tersimpan karena API tidak memiliki endpoint hapus user. Jika run terputus, task yang sempat dibuat bisa tersisa. Gunakan database latihan yang boleh diubah.

## Environment variables

Contoh siap pakai ada di [environments/Local.example.bru](environments/Local.example.bru). Untuk pengaturan pribadi, duplikasikan file itu menjadi **`environments/Local.bru`**, pilih environment **Local**, lalu sesuaikan nilainya. File environment pribadi diabaikan Git; file `*.example.bru` tetap dilacak.

| Variable environment | Contoh | Kegunaan |
| --- | --- | --- |
| `baseUrl` | `http://localhost:3001` | Alamat backend, tanpa slash terakhir dan tanpa `/api` |
| `emailPrefix` | `workshop` | Awalan email akun latihan |
| `emailDomain` | `example.com` | Domain email contoh; backend tidak mengirim email verifikasi |
| `password` | `Workshop-local-123!` | Password latihan untuk kedua akun; 8–72 karakter, maksimal 72 byte UTF-8 |
| `taskTitle` | `Belajar Bruno` | Judul task yang dibuat; maksimal 120 karakter, tidak kosong |
| `taskDescription` | `Task latihan dari API collection` | Deskripsi task; maksimal 500 karakter |

`01 Health` membuat `email` dan `otherEmail` unik dengan waktu dan suffix acak, serta membersihkan state runtime sebelumnya. Ini membuat run penuh bisa diulang tanpa konflik email. Gunakan awalan/domain email contoh yang valid.

| Variable runtime | Diisi oleh | Digunakan untuk |
| --- | --- | --- |
| `email`, `otherEmail` | 01 Health | Register/login dua akun berbeda |
| `accessToken`, `userId` | 03 Login | JWT dan identitas pemilik task |
| `taskId` | 05 Create Task | Detail, update, cek ownership, dan delete |
| `otherToken`, `otherUserId` | 14 Login Other User | Memastikan user kedua tidak bisa mengakses task user pertama |

Variable runtime memakai `bru.setVar()`, sehingga JWT tidak ditulis ke file environment. Jika sesi runtime hilang atau JWT kedaluwarsa, jalankan lagi alur dari 01. Jangan simpan token, password sungguhan, atau `JWT_SECRET` backend di file contoh yang akan di-commit. Collection hanya membutuhkan token hasil login, bukan secret penandatangan JWT.

## Daftar request dan hasil yang diharapkan

| Urutan | Request | Status | Yang diperiksa |
| --- | --- | --- | --- |
| 01 | `GET /` | 200 | `Hello World!`, inisialisasi run |
| 02 | `POST /auth/register` | 201 | User dibuat tanpa membocorkan password hash |
| 03 | `POST /auth/login` | 200 | Token dan identitas disimpan otomatis |
| 04 | `GET /auth/me` | 200 | Profil sesuai user login |
| 05 | `POST /tasks` | 201 | Task baru milik user login, `completed=false` |
| 06 | `GET /tasks` | 200 | Task baru ada, semua hasil milik user login |
| 07 | `GET /tasks/:id` | 200 | Detail dengan ID yang benar |
| 08 | `PATCH /tasks/:id` | 200 | Judul/deskripsi berubah, `completed=true` |
| 09 | `POST /tasks` dengan judul kosong | 400 | Validasi input |
| 10 | `GET /tasks` tanpa token | 401 | Authentication diwajibkan |
| 11 | `POST /auth/login` dengan password salah | 401 | Kredensial salah ditolak |
| 12 | `POST /auth/register` dengan email sama | 409 | Duplikasi email ditolak |
| 13–14 | Register dan login user kedua | 201 / 200 | Identitas dan token kedua |
| 15 | `GET /tasks` sebagai user kedua | 200 | Task user pertama tidak muncul |
| 16–18 | GET / PATCH / DELETE task user pertama sebagai user kedua | 404 | Batas kepemilikan pada tiga operasi |
| 19 | `GET /tasks/:id` sebagai pemilik | 200 | Task tetap ada dan isinya tidak berubah oleh user kedua |
| 20 | `DELETE /tasks/:id` sebagai pemilik | 200 | Task yang benar dihapus |
| 21 | `GET /tasks/:id` setelah dihapus | 404 | Task sudah tidak tersedia |
| 22 | `GET /tasks` setelah dihapus | 200 | Task tidak muncul lagi dalam daftar |

## Jalankan lewat CLI (opsional)

Dari root repository, setelah backend berjalan:

```bash
cd bruno
npm exec --yes --package=@usebruno/cli@4.2.1 -- bru run --env Local.example --bail
```

CLI dipatok ke versi 4.2.1 dan tidak menambah dependency ke backend/frontend. Perintah ini menjalankan semua request sesuai `seq`; `--bail` menghentikan run ketika assertion gagal. Script collection memakai API Bruno bawaan dan dapat dijalankan pada sandbox safe default.

Jika memakai environment pribadi, ganti `--env Local.example` dengan `--env Local`. Untuk port backend lain, override tanpa mengubah file:

```bash
npm exec --yes --package=@usebruno/cli@4.2.1 -- bru run --env Local.example --env-var baseUrl=http://localhost:3002 --bail
```

Rujukan: [Bruno CLI](https://www.usebruno.com/product/cli) dan [API scripting Bruno](https://github.com/usebruno/bruno-docs/blob/main/testing/script/javascript-reference.mdx).

## Kendala umum dan checkpoint workshop

- **Connection refused:** pastikan backend menyala dan `baseUrl` sesuai port. URL tidak memakai prefix `/api`.
- **Register/login 404:** cek branch. Authentication baru tersedia pada Day 3; collection lengkap ini menargetkan `main` / `final-reference`.
- **401 pada request yang seharusnya 200:** jalankan 01 → 02 → 03 lebih dahulu; token adalah runtime variable. Request 10 memang sengaja tanpa token.
- **409 pada request 02:** jalankan 01 lagi agar email baru dibuat. Request 12 memang sengaja memakai email yang sama.
- **ID kosong / 404 setelah delete:** jalankan create task terlebih dahulu. Untuk mengulang seluruh skenario, mulai dari 01.
- **Prisma/database error:** selesaikan konfigurasi `DATABASE_URL` dan migrasi backend; mengganti environment Bruno tidak mengubah koneksi database server.

Pada **Day 1/2 checkpoint** yang sudah memiliki CRUD tanpa JWT, request health dan CRUD bisa dikirim manual karena backend lama mengabaikan Bearer header. Isi runtime `taskId` dari hasil create jika tidak memakai script, dan cocokkan port. Lewati request auth, ownership, serta assertion yang memeriksa `userId` atau 401; **Run All hanya untuk Day 3/acuan akhir**. Pada `day-1-starter`, yang tersedia baru `GET /` pada port 3000; CRUD akan ditulis saat sesi.
