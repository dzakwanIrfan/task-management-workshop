# Day 1 — Membangun REST API dengan NestJS dan PostgreSQL

## Gambaran Umum Presentasi

**Target durasi:** ±28–30 menit
**Jumlah halaman:** 22. Delapan belas topik awal tetap berurutan; halaman persiapan, analogi NestJS, dan alur kerja Prisma disisipkan pada titik yang relevan.

Presentasi ini **bukan sesi coding**. Tujuannya adalah membangun pemahaman dan mental model peserta sebelum masuk ke sesi live coding.

**Acuan materi:** alur latihan di [`day-1-starter` → `day-1-checkpoint`](./day-1-nestjs-crud-postgresql.md). `backend/` pada `main` sudah memuat hasil Day 3: JWT, relasi `User`, dan pembatasan task berdasarkan `userId`. Untuk slide pembuka Day 1, pakai bentuk Task dan lima endpoint CRUD dari checkpoint Day 1; sebut authentication hanya sebagai kelanjutan Day 3. Jangan mengambil screenshot respons `/tasks` dari `main` tanpa login lalu menyebutnya hasil Day 1.

**Cara memakai outline untuk membuat deck:** bagian *Isi Slide* dan *Visual* adalah bahan yang ditampilkan; bagian *Yang Disampaikan* menjadi speaker notes. Satu halaman membawa satu pesan utama. Contoh Request/Response di bawah adalah ilustrasi kontrak, bukan hasil uji runtime yang baru dijalankan. Gunakan bahasa Indonesia yang sederhana untuk kalimat penjelas. Pertahankan nama konsep teknikal seperti Backend, Frontend, Request, Response, Module, Controller, Service, Provider, Dependency Injection, ValidationPipe, Prisma Schema, Prisma Migrate, Prisma Client, dan Data Access.

Setelah presentasi selesai, peserta diharapkan memahami:

- Apa yang akan dibangun pada Day 1.
- Posisi backend dalam sebuah aplikasi web.
- Apa itu API dan bagaimana frontend berkomunikasi dengan backend.
- Kenapa menggunakan NestJS.
- Hubungan antara NestJS, Prisma, dan PostgreSQL.
- Peran Module, Controller, Service, DTO, dan Validation.
- Alur sebuah HTTP request dari client sampai database.
- CRUD dan hubungannya dengan HTTP Method.
- Gambaran proses live coding yang akan dilakukan setelah presentasi.

---

# Struktur Besar Presentasi

## Bagian 1 — Konteks Workshop

1. Membangun REST API dengan NestJS dan PostgreSQL
2. Apa yang Akan Kita Bangun?
3. Posisi Day 1 dalam Workshop

## Bagian 2 — Kenapa NestJS?

4. Memahami Posisi Backend
5. Kenapa Menggunakan NestJS?
6. Analogi Restoran untuk Module, Controller, dan Service
7. Kenapa Saya Menggunakan NestJS di Project Nyata?

## Bagian 3 — Environment & Tools

8. Tools yang Akan Digunakan
9. Preflight: Cek Environment
10. Siapkan pnpm

## Bagian 4 — Fundamental Backend

11. Apa Itu API?
12. Anatomi HTTP Request
13. CRUD dan HTTP Method
14. HTTP Status Code
15. Bagaimana NestJS Mengorganisasi Aplikasi?
16. Alur Request di Aplikasi Kita
17. Posisi Prisma dan PostgreSQL
18. Dari Model Task ke Query Prisma
19. Kenapa Kita Membutuhkan Validation?

## Bagian 5 — Project Hari Ini

20. Task Data Model
21. Roadmap Live Coding
22. Mental Model yang Perlu Diingat

---

# Slide 1 — Membangun REST API dengan NestJS dan PostgreSQL

## Tujuan Slide

Membuka sesi dan memberi konteks singkat mengenai topik Day 1.

## Isi Slide

**Membangun REST API dengan NestJS dan PostgreSQL**

**Day 1 — Dasar Backend dan CRUD API**

Next.js & NestJS Workshop

## Visual yang Disarankan

Gunakan visual sederhana:

```text
Client
  ↓
NestJS
  ↓
Prisma
  ↓
PostgreSQL
```

Bisa ditambahkan logo:

- NestJS
- PostgreSQL
- Prisma

Jangan terlalu banyak elemen.

## Yang Disampaikan

Perkenalan singkat.

Jelaskan bahwa Day 1 akan fokus pada backend.

Setelah presentasi singkat ini, sesi akan dilanjutkan dengan live coding.

Target akhirnya adalah membuat REST API sederhana yang benar-benar terhubung dengan PostgreSQL.

Kalimat pembuka yang lebih dekat dengan proyek: “Hari ini kita membuat API untuk mencatat task workshop. Setelah tombol buat, ubah, atau hapus hadir di frontend pada Day 2, request-nya akan masuk ke backend yang kita pahami hari ini.”

Tekankan bahwa presentasi hanya akan membahas konsep dan gambaran besarnya.

Syntax dan implementasi akan dipelajari bersama saat live coding.

---

# Slide 2 — Apa yang Akan Kita Bangun?

## Tujuan Slide

Memberi gambaran akhir project sebelum peserta mempelajari konsepnya.

## Isi Slide

### Task Management API

Backend yang dapat:

- Membuat task.
- Mengambil seluruh task.
- Mengambil satu task.
- Mengubah task.
- Menghapus task.
- Menyimpan data ke PostgreSQL.
- Melakukan validasi request.
- Menangani error API sederhana.

Contoh task yang akan dikelola: `Belajar NestJS` dengan status awal `completed: false`. Pada Day 1, semua task berada dalam satu daftar bersama; kepemilikan per user baru ditambahkan pada Day 3.

## Visual yang Disarankan

```text
Bruno
  ↓
NestJS REST API
  ↓
Prisma
  ↓
PostgreSQL
```

## Yang Disampaikan

Pada Day 1 kita **belum membuat frontend**.

Untuk sementara, Bruno akan bertindak sebagai client yang mengirim HTTP request ke backend.

Jelaskan bahwa nantinya pada Day 2 posisi Bruno akan digantikan oleh aplikasi Next.js.

```text
Day 1

Bruno
  ↓
NestJS
```

Kemudian:

```text
Day 2

Next.js
  ↓
NestJS
```

Pesan penting:

> Backend yang baik tidak bergantung pada siapa client-nya.

Selama client mengikuti API contract yang sudah ditentukan, backend dapat digunakan oleh web, mobile, ataupun aplikasi lain.

---

# Slide 3 — Posisi Day 1 dalam Workshop

## Tujuan Slide

Membantu peserta memahami hubungan antarhari workshop.

## Isi Slide

```text
DAY 1
NestJS + REST API + PostgreSQL
              ↓
DAY 2
Next.js + Integrasi API
              ↓
DAY 3
Authentication + Protected API + Deployment
              ↓
DAY 4
Final Project Presentation
```

## Yang Disampaikan

Day 1 fokus pada backend terlebih dahulu.

Peserta akan belajar bagaimana:

- Request diterima.
- Data divalidasi.
- Logic dijalankan.
- Data disimpan ke database.

Day 2 baru masuk ke sisi frontend menggunakan Next.js.

Day 3 akan menambahkan authentication dan security ke API yang sebelumnya sudah dibuat.

Perlihatkan satu task yang sama melintasi sesi: Day 1 membuat dan membaca data lewat Bruno, Day 2 menampilkan dan mengubahnya lewat Next.js, Day 3 mengaitkan task dengan user yang login. Cukup satu kalimat untuk Day 3; detail JWT bukan fokus presentasi ini.

Jelaskan bahwa pemisahan ini sengaja dilakukan agar peserta memahami setiap layer secara bertahap.

---

# Slide 4 — Memahami Posisi Backend

## Tujuan Slide

Membangun pemahaman dasar mengenai posisi backend dalam aplikasi web.

## Isi Slide

### Sebuah aplikasi web bukan hanya UI.

```text
User
 ↓
Frontend
 ↓
HTTP / API
 ↓
Backend
 ↓
Database
```

Backend biasanya menangani:

- Business logic.
- Data access.
- Validation.
- Authentication dan authorization.
- Integrasi dengan service lain.
- Konsistensi data.

## Yang Disampaikan

Frontend biasanya bertanggung jawab terhadap apa yang dilihat dan digunakan oleh user.

Backend bertanggung jawab terhadap logic dan data aplikasi.

Database bertanggung jawab menyimpan data.

Dalam arsitektur yang kita pelajari:

```text
Next.js
   ↓
NestJS
   ↓
PostgreSQL
```

Next.js tidak berkomunikasi langsung dengan PostgreSQL.

NestJS menjadi application layer di antara frontend dan database.

Contoh konkret: ketika nanti pengguna mencentang task sebagai selesai di UI, frontend mengirim `PATCH /tasks/:id` dengan `{ "completed": true }`. Backend yang memproses perubahan, lalu PostgreSQL menyimpan nilai baru.

---

# Slide 5 — Kenapa Menggunakan NestJS?

## Tujuan Slide

Peserta memahami **apa itu NestJS**, masalah apa yang dibantu oleh framework, dan batasnya terhadap Node.js serta database sebelum mendengar istilah Module, Controller, dan Service secara rinci.

## Isi Slide

**NestJS adalah framework untuk membangun aplikasi Backend dengan Node.js.** Node.js menjalankan programnya. NestJS membantu menyusun cara program menerima HTTP Request, menjalankan aturan aplikasi, dan mengirim HTTP Response. PostgreSQL tetap menjadi tempat data disimpan; NestJS bukan database.

Tanpa struktur yang jelas, route dan aturan Task dapat bercampur dalam satu file ketika fitur bertambah. NestJS memberi tempat dan tanggung jawab yang jelas: Module mengelompokkan satu feature, Controller menjadi pintu HTTP, dan Service mengerjakan operasi aplikasi. Nest juga menyediakan Service yang dibutuhkan Controller melalui Dependency Injection. Ini alasan praktis mengapa kita memakainya pada workshop, bukan klaim bahwa semua aplikasi harus memakai NestJS.

## Visual yang Disarankan

Logo NestJS menjadi pusat halaman. Di satu sisi ada kalimat besar “NestJS membantu Backend tetap rapi ketika fitur bertambah.” Di sisi lain tiga anotasi pendek menjelaskan **HTTP**, **pembagian tugas**, dan **Dependency Injection** dengan bahasa sehari-hari. Tidak perlu menampilkan daftar Pipes, Guards, atau konsep lanjut lainnya di halaman.

## Yang Disampaikan

Mulai dari pertanyaan “Kalau Node.js sudah bisa menerima Request, kenapa memakai NestJS?” Node.js menyediakan runtime, tetapi tidak menentukan bagaimana file, route, dan aturan aplikasi harus dibagi. NestJS memberi pola agar developer lain mudah menemukan bagian yang menerima Request dan bagian yang mengerjakan operasi. Proyek workshop memakai HTTP platform Express melalui paket `@nestjs/platform-express`, tetapi peserta tidak perlu memahami adapter itu sekarang.

Saat NestJS dimulai, `AppModule` menjadi titik awal. Nest membaca Module yang terdaftar dan menyiapkan Provider yang diperlukan. Controller dapat memakai Service tanpa membuatnya dengan `new` di setiap Request; itulah gambaran awal Dependency Injection. Bedakan bantuan TypeScript saat menulis kode dari ValidationPipe yang benar-benar memeriksa JSON saat Request berjalan. Hubungkan ke Task: route ada di Controller, operasi Task di Service, dan keduanya terdaftar di TasksModule. Slide berikutnya memberi analogi yang lebih mudah diingat. [NestJS Modules](https://docs.nestjs.com/modules), [Controllers](https://docs.nestjs.com/controllers), dan [Providers](https://docs.nestjs.com/providers) menjelaskan batas ini.

---

# Slide 6 — Analogi Restoran untuk Module, Controller, dan Service

## Tujuan Slide

Membuat tiga peran utama NestJS mudah diingat sebelum peserta melihat susunan file yang sebenarnya.

## Isi Slide

Bayangkan sebuah restoran khusus pesanan Task. **TasksModule** mengumpulkan orang yang diperlukan agar layanan ini berjalan. **TasksController** seperti kasir: menerima pesanan melalui route HTTP yang sesuai dan meneruskannya. **TasksService** seperti dapur: mengerjakan operasi yang diminta. Jika perlu membaca atau menyimpan data, Service memakai **PrismaService** untuk berbicara dengan PostgreSQL.

Tiga kalimat pendek untuk halaman:

> **Module mengumpulkan. Controller menerima. Service mengerjakan.**

Analogi ini menjelaskan pembagian tanggung jawab. Pada aplikasi yang sebenarnya, `ValidationPipe` memeriksa input sebelum method Controller dijalankan; kasir tidak menggantikan proses Validation.

## Visual yang Disarankan

Buat halaman seperti struk pesanan yang ditempel di meja, bukan tiga kartu atau diagram panah. Judul struk `POST /tasks`, lalu tiga baris besar dengan ilustrasi sederhana: papan nama restoran untuk **TasksModule**, loket untuk **TasksController**, dan meja dapur untuk **TasksService**. Tambahkan logo NestJS kecil. Di tepi struk, tampilkan contoh pesanan `title: "Belajar NestJS"`. Gunakan biru sebagai aksen utama Sticker Pop, dengan pink dan kuning untuk penanda peran.

## Yang Disampaikan

Mulai dengan pesanan yang mudah dibayangkan: seseorang ingin membuat Task berjudul Belajar NestJS. Di restoran, kita perlu tempat yang menyiapkan tim; di kode itulah TasksModule. Kasir mengenali jenis pesanan dan menyerahkannya ke bagian yang tepat; di kode itulah TasksController yang mengenali `POST /tasks`. Dapur mengerjakan pesanan; di kode itulah TasksService yang memanggil operasi pembuatan Task. Saat data perlu disimpan, Service memakai PrismaService.

Tegaskan bahwa Module tidak menerima Request satu per satu dan Controller tidak menyimpan data sendiri. `ValidationPipe` dapat menghentikan input yang buruk sebelum method Controller berjalan. Setelah analogi dipahami, lanjutkan ke contoh penggunaan NestJS di project dan kemudian lihat file sebenarnya pada slide struktur NestJS.

---

# Slide 7 — Kenapa Saya Menggunakan NestJS di Project Nyata?

## Tujuan Slide

Memberikan konteks nyata berdasarkan pengalaman sebagai developer.

Slide ini sebaiknya lebih personal dan tidak terasa seperti dokumentasi framework.

## Isi Slide

### Contoh Project Nyata

**Financial Management System — Koperasi Kamorina Surya Niaga**

Teknologi yang digunakan:

```text
Next.js
   ↓
NestJS
   ├──→ PostgreSQL
   └──→ Redis
```

Contoh fakta yang bisa ditampilkan:

- Digunakan oleh 200+ anggota koperasi karyawan.
- Menangani workflow financial management.
- Menggunakan Next.js dan NestJS.
- PostgreSQL sebagai database.
- Redis untuk kebutuhan caching tertentu.

Angka penggunaan, screenshot, dan detail arsitektur project pribadi pada slide ini perlu dikonfirmasi sendiri oleh pemateri sebelum dipublikasikan; semuanya adalah bahan cerita personal, bukan fakta yang diperiksa dari repository workshop.

## Visual yang Disarankan

Gunakan satu screenshot aplikasi jika memungkinkan.

Di sampingnya tampilkan architecture diagram sederhana.

Jangan memenuhi slide dengan penjelasan project.

## Yang Disampaikan

Ceritakan secara singkat pengalaman membangun project tersebut.

Contoh poin yang bisa disampaikan:

- Project memiliki beberapa feature dan business flow.
- Ketika code mulai bertambah, pembagian feature menjadi module membantu menjaga struktur aplikasi.
- Controller tidak perlu menangani seluruh logic.
- Service dapat memisahkan application logic.
- Struktur seperti ini membuat penambahan fitur lebih mudah dibanding menaruh semua logic di satu tempat.

Kemudian hubungkan dengan workshop:

> Project kita hari ini memang jauh lebih kecil. Kita hanya membuat Task Management API. Tetapi konsep dasar yang dipakai tetap sama.

Jembatan ke kode workshop: tunjukkan tiga kotak kecil `TasksModule`, `TasksController`, `TasksService`, lalu lanjut ke slide tools. Tidak perlu membahas Redis lebih jauh.

---

# Slide 8 — Tools yang Akan Digunakan

## Tujuan Slide

Memastikan semua peserta memahami fungsi tools sebelum mulai live coding.

## Isi Slide

| Tool | Fungsi |
|---|---|
| Node.js | Runtime untuk menjalankan aplikasi backend |
| pnpm | Package manager |
| NestJS | Backend framework |
| Prisma | ORM / data access |
| PostgreSQL | Database |
| Bruno | API client |
| VS Code / Editor | Menulis dan mengelola source code |

## Pesan Tambahan

> Tools boleh berbeda, konsepnya tetap sama.

## Yang Disampaikan

Aku sendiri menggunakan MacBook, tetapi workshop tidak dibuat Mac-specific.

Peserta bisa menggunakan:

- Windows.
- Linux.
- macOS.

Yang penting tools utama sudah bisa digunakan sebelum live coding.

Tidak perlu menjelaskan proses instalasi panjang di slide.

Saat live coding baru lakukan pengecekan seperti:

- Node.js sudah tersedia?
- pnpm sudah tersedia?
- PostgreSQL berjalan?
- Bruno tersedia?

Konteks proyek ini: API lokal pada contoh env berjalan di `http://localhost:3001`; Bruno mengirim request ke sana. Nomor port cukup menjadi label kecil, bukan instruksi instalasi di slide.

---

# Slide 9 — Preflight: Cek Environment

## Tujuan Slide

Memastikan peserta tahu apa yang perlu siap **sebelum** live coding, sekaligus membedakan pemeriksaan tool dari bukti bahwa database benar-benar bisa diakses.

## Isi Slide

Tampilkan dua terminal kecil dengan perintah yang sama, satu berlabel **macOS Terminal** dan satu **Windows PowerShell**. Cek `node --version`, `npm --version`, dan `git --version`. Node.js harus mengikuti syarat repo: **20.19+**, **22.12+**, atau **24+**. Jika memakai PostgreSQL lokal melalui Docker, tambahkan `docker --version` dan pastikan Docker Engine berjalan. Jika memakai database dari panitia, Docker tidak wajib.

```bash
# macOS Terminal, dari folder mana saja
node --version
npm --version
git --version
docker --version  # hanya jika memakai PostgreSQL lokal via Docker
```

```powershell
# Windows PowerShell, dari folder mana saja
node --version
npm --version
git --version
docker --version  # hanya jika memakai PostgreSQL lokal via Docker
```

## Visual yang Disarankan

Gunakan dua jendela IDE terminal dengan syntax warna dan satu cap besar **READY?**. Di bawahnya tampilkan garis penanda “Node.js cocok”, “Git tersedia”, dan “PostgreSQL tersedia”. Hindari checklist berupa deretan box. Hasil terminal pada slide adalah contoh, bukan hasil pemeriksaan mesin peserta.

## Yang Disampaikan

Minta peserta membuka terminal sesuai OS. `node --version` memeriksa runtime; `npm --version` menunjukkan package manager bawaan Node tersedia; `git --version` diperlukan untuk mengambil starter. Docker hanya perlu jika mereka menjalankan PostgreSQL lokal seperti opsi di panduan Day 1. Perintah `docker --version` hanya memeriksa CLI, jadi saat praktik nanti kita masih perlu memastikan Engine dan database berjalan. Jika tool belum tersedia, gunakan instruksi instalasi dari panitia dan jangan menebak bahwa versi tertentu pasti cocok. Preflight ini mendahului `pnpm install` dan migrasi.

---

# Slide 10 — Siapkan pnpm

## Tujuan Slide

Menjelaskan kenapa repo memakai pnpm dan memberikan langkah cek serta instalasi yang dapat dipakai di macOS dan Windows.

## Isi Slide

Repo ini mempunyai `backend/pnpm-lock.yaml` dan `frontend/pnpm-lock.yaml`; package untuk masing-masing aplikasi dipasang dari foldernya sendiri. Kita memakai **pnpm 10** agar perintah kelas mengikuti lockfile yang sama. `pnpm install --frozen-lockfile` menjaga resolusi dependency sesuai lockfile, sedangkan shared content-addressable store membantu pemakaian disk lebih efisien. pnpm bukan bagian dari NestJS; ia package manager untuk dependency JavaScript.

```bash
# macOS Terminal
pnpm --version
npm install --global pnpm@10  # jika pnpm belum ada atau bukan versi 10
pnpm --version
cd backend
pnpm install --frozen-lockfile
```

```powershell
# Windows PowerShell
pnpm --version
npm install --global pnpm@10  # jika pnpm belum ada atau bukan versi 10
pnpm --version
cd .\backend
pnpm install --frozen-lockfile
```

## Visual yang Disarankan

Gunakan logo pnpm asli sebagai elemen utama, lalu perlihatkan dua area: **Why pnpm?** dengan lockfile dan shared store sebagai anotasi teks, dan **Do this first** berupa jendela terminal IDE. Jangan membuat halaman berupa bullet list instalasi.

## Yang Disampaikan

Periksa versi lebih dulu; instal hanya bila belum ada atau versinya tidak sesuai. Perintah npm di atas dipakai karena Node dan npm telah diperiksa pada Preflight. macOS dan Windows memakai perintah npm yang sama; yang berbeda hanya terminal dan bentuk path `cd`. Jika pemasangan global gagal karena permission atau policy mesin, selesaikan dengan pengaturan mesin peserta atau panduan panitia, bukan menjalankan perintah acak dengan hak administrator. `pnpm install` dijalankan dari `backend/`, bukan root repo karena root tidak punya `package.json`. Jelaskan bahwa `--frozen-lockfile` akan berhenti bila package manifest dan lockfile tidak cocok, sehingga kelas tidak diam-diam memakai kombinasi versi baru. Untuk instalasi pnpm yang selalu berubah, rujuk [dokumentasi pnpm](https://pnpm.io/installation/).

---

# Slide 11 — Apa Itu API?

## Tujuan Slide

Menyamakan pemahaman peserta mengenai komunikasi antara client dan backend.

## Isi Slide

### API

Interface yang digunakan software untuk berkomunikasi dengan software lain.

Contoh:

```text
Client
   |
   | POST /tasks
   |
   | { "title": "Belajar NestJS" }
   ↓
Backend
   |
   ↓
Database
```

Backend memberikan response:

```text
201 Created
{ "id": 7, "title": "Belajar NestJS", "completed": false, ... }
```

`id: 7` hanya contoh. Saat demo, gunakan ID yang benar-benar dikembalikan API.

## Yang Disampaikan

API yang kita bangun menggunakan:

- HTTP.
- REST-style endpoint.
- JSON.

Frontend tidak perlu mengetahui:

- Bagaimana tabel PostgreSQL dibuat.
- SQL apa yang dijalankan.
- Bagaimana backend menyimpan data secara internal.

Frontend hanya perlu mengetahui **API contract**.

Contoh:

```http
POST http://localhost:3001/tasks
Content-Type: application/json

{"title":"Belajar NestJS","description":"Workshop Day 1"}
```

berarti backend menyediakan cara untuk membuat sebuah task.

---

# Slide 12 — Anatomi HTTP Request

## Tujuan Slide

Menjelaskan komponen request yang nantinya akan sering terlihat saat menggunakan Bruno.

## Isi Slide

Contoh request:

```text
POST /tasks
```

### Method

```text
POST
```

### URL / Endpoint

```text
/tasks
```

### Header

```text
Content-Type: application/json
```

### Body

```json
{"title":"Belajar NestJS","description":"Workshop Day 1"}
```

## Yang Disampaikan

HTTP request bukan hanya URL.

Sebuah request dapat memiliki:

- Method.
- URL.
- Header.
- Body.
- Query parameter.
- Path parameter.

Hari ini kita terutama menggunakan:

- GET.
- POST.
- PATCH.
- DELETE.

Untuk `GET /tasks/7`, angka `7` adalah *path parameter*; untuk `POST /tasks`, JSON berada di body. Query parameter cukup disebut sebagai bagian umum HTTP, karena CRUD Day 1 belum memakai filter atau pagination.

---

# Slide 13 — CRUD dan HTTP Method

## Tujuan Slide

Menghubungkan konsep CRUD dengan REST API.

## Isi Slide

| Operasi | HTTP Method | Endpoint |
|---|---|---|
| Create | POST | `/tasks` |
| Read All | GET | `/tasks` |
| Read One | GET | `/tasks/:id` |
| Update | PATCH | `/tasks/:id` |
| Delete | DELETE | `/tasks/:id` |

Contoh perubahan yang akan dicoba: `PATCH /tasks/7` dengan `{ "completed": true }`. Angka `7` tetap contoh; ID saat latihan diambil dari respons POST, bukan diasumsikan selalu 1 atau 7.

## Yang Disampaikan

CRUD berarti:

```text
Create
Read
Update
Delete
```

CRUD bukan konsep khusus NestJS.

Konsep ini muncul pada hampir semua aplikasi yang mengelola data.

NestJS hanya framework yang kita gunakan untuk membuat endpoint tersebut.

Jelaskan juga bahwa endpoint sebaiknya berbasis resource.

Contoh:

```text
/tasks
```

bukan:

```text
/createTask
/getTask
/deleteTask
```

HTTP Method sudah menyampaikan operasi yang ingin dilakukan.

---

# Slide 14 — HTTP Status Code

## Tujuan Slide

Memperkenalkan response status yang akan ditemukan saat testing API.

## Isi Slide

| Status | Arti | Contoh |
|---:|---|---|
| 200 | OK | Data berhasil dibaca atau diubah |
| 201 | Created | Resource berhasil dibuat |
| 400 | Bad Request | Request client tidak valid |
| 404 | Not Found | Resource tidak ditemukan |
| 500 | Internal Server Error | Terjadi error pada server |

## Yang Disampaikan

HTTP status code adalah bagian dari API contract.

Bedakan dua error penting:

```text
400 Bad Request
```

Masalah berasal dari request client.

Contoh:

```text
title seharusnya string,
tetapi client mengirim number.
```

Sedangkan:

```text
500 Internal Server Error
```

berarti ada error yang tidak seharusnya terjadi di sisi server.

Tekankan bahwa input buruk seharusnya tidak dibiarkan masuk sampai menghasilkan error 500.

Konsep ini akan kembali muncul ketika kita membahas validation.

Jangkar ke checkpoint Day 1: `POST /tasks` valid menghasilkan `201`; body tanpa `title` menghasilkan `400`; `GET /tasks/:id` yang tidak ditemukan menghasilkan `404`; `DELETE /tasks/:id` yang berhasil menghasilkan `200` beserta task yang dihapus. `204` adalah status HTTP yang sah secara umum, tetapi bukan respons DELETE implementasi Day 1 ini. Jangan menjanjikan `404` untuk `PATCH` ID yang hilang pada checkpoint Day 1, karena error Prisma di sana belum diterjemahkan secara eksplisit.

---

# Slide 15 — Bagaimana NestJS Mengorganisasi Aplikasi?

## Tujuan Slide

Membuat konsep umum NestJS dari slide 5 terasa konkret di feature Task, terutama batas Module dan cara Dependency Injection bekerja.

## Isi Slide

**AppModule** adalah root Module aplikasi. Ia memasukkan **TasksModule** agar feature Task tersedia. **TasksModule** mendaftarkan `TasksController` dan `TasksService`, serta mengimpor `PrismaModule`. Module menentukan bagian mana yang bekerja bersama; ia tidak mengerjakan satu Request secara langsung.

**TasksController** mengenali HTTP Method dan route, misalnya `POST /tasks` atau `GET /tasks/:id`. Method Controller menerima input yang sudah melewati Pipe, memanggil Service, lalu mengembalikan hasil. Controller menjaga urusan HTTP tetap terpisah dari operasi Task.

**TasksService** menjalankan operasi Task: membuat, membaca, mengubah, atau menghapus. Ia memakai `PrismaService` saat perlu mengakses data. Service adalah **Provider** yang didaftarkan dalam Module. Nest memberikan Service yang dibutuhkan Controller melalui **Dependency Injection**.

## Visual yang Disarankan

Tampilkan susunan seperti halaman peta kode, bukan tiga kartu: `AppModule` di atas, `TasksModule` sebagai judul bagian, dan penjelasan singkat Controller serta Service dalam dua kolom editorial. Letakkan `PrismaModule` dan `PrismaService` sebagai catatan kecil di bawah. Logo NestJS kecil menjaga konteks brand.

## Yang Disampaikan

Hubungkan kembali ke analogi restoran. `AppModule` adalah titik awal aplikasi; `TasksModule` mengumpulkan bagian yang diperlukan feature Task. Ketika `POST /tasks` datang, `TasksController` mengenali route lalu memanggil `TasksService`. Service menjalankan operasi pembuatan Task dan memakai `PrismaService` untuk menyimpan data. Bila input tidak valid, Pipe dapat menghentikannya sebelum method Controller berjalan.

Jelaskan Dependency Injection dengan contoh sederhana: constructor Controller menyatakan bahwa ia membutuhkan `TasksService`; Nest menyiapkan dan memberikannya. Controller tidak perlu membuat `new TasksService()` sendiri. `PrismaModule` mengekspor `PrismaService`; `TasksModule` mengimpor `PrismaModule`, sehingga Provider itu dapat dipakai oleh TasksService. Ini menunjukkan arti `imports`, `providers`, `controllers`, dan `exports` yang akan terlihat saat peserta membuka file.

Peserta belum perlu menghafal decorator atau sintaks ini. Yang perlu mereka bisa lakukan ialah membuka file dan menunjuk responsibility tiap bagian. Cerita ini berlaku untuk feature lain di NestJS, bukan hanya Task.

---

# Slide 16 — Alur Request di Aplikasi Kita

## Tujuan Slide

Menjadi mental map utama saat sesi live coding.

## Isi Slide

Gunakan diagram besar:

```text
HTTP Request
     ↓
Pencocokan route TasksController
     ↓
DTO + ValidationPipe untuk body / ParseIntPipe untuk id
     ↓
Method controller → TasksService
     ↓
PrismaService → PostgreSQL
```

Response kembali melalui jalur yang sama:

```text
PostgreSQL
     ↓
Prisma
     ↓
Service
     ↓
Controller
     ↓
HTTP Response
```

## Contoh Alur

```text
POST /tasks
```

1. Bruno mengirim `POST /tasks` dengan body JSON.
2. Nest mencocokkan route pada `TasksController`.
3. `ValidationPipe` memeriksa `CreateTaskDto` sebelum method controller dijalankan.
4. Controller meneruskan data ke `TasksService`.
5. Service memanggil `PrismaService.task.create()`.
6. PostgreSQL menyimpan task; hasilnya kembali sebagai respons `201`.

## Yang Disampaikan

Sampaikan bahwa diagram ini menjadi acuan selama live coding.

Kalau peserta bingung:

> "Sekarang kita sedang membuat bagian apa?"

Mereka bisa kembali melihat flow ini.

Saat membahas `GET /tasks/:id`, ganti contoh validasi body dengan `ParseIntPipe` untuk ID. Pada tahap awal live coding, bagian DTO dan PostgreSQL belum dipasang; diagram menunjukkan alur yang akan lengkap pada akhir Day 1.

---

# Slide 17 — Posisi Prisma dan PostgreSQL

## Tujuan Slide

Mencegah miskonsepsi bahwa Prisma adalah database.

## Isi Slide

**NestJS** menjalankan aplikasi Backend dan mengatur HTTP Request melalui Module, Controller, Service, serta Validation. **Prisma** membantu kode Backend membaca dan menulis data dengan API yang mengikuti model di Prisma Schema. **PostgreSQL** adalah database tempat baris Task disimpan.

Contoh konkret: `TasksService` memanggil `PrismaService.task.create()` untuk membuat Task. Prisma mengirim query yang diperlukan, lalu PostgreSQL menyimpan barisnya. Ketika aplikasi dimulai lagi, data tetap berada di PostgreSQL.

## Visual yang Disarankan

Tampilkan dua sisi besar dengan logo Prisma dan PostgreSQL. Pada sisi Prisma tulis “cara kode mengakses data”; pada sisi PostgreSQL tulis “tempat data Task tersimpan”. Di tengah, satu contoh `task.create()` dalam gaya editor. Perbedaan keduanya harus terbaca tanpa panah panjang.

## Yang Disampaikan

Mulai dari pertanyaan: data Task sebenarnya disimpan di mana? Jawabannya PostgreSQL. Prisma membantu kode mengakses data itu. `PrismaService` adalah pembungkus Prisma Client yang dipakai aplikasi workshop, sedangkan PostgreSQL tetap menjadi database. Prisma Client menyediakan method seperti `task.create()` dan `task.findMany()` berdasarkan model yang kita definisikan. Pada slide berikutnya, jelaskan bagaimana model berubah menjadi tabel dan method tersebut.

---

# Slide 18 — Dari Model Task ke Query Prisma

## Tujuan Slide

Menjelaskan tiga bagian Prisma yang akan peserta temui saat praktik: Prisma Schema, Prisma Migrate, dan Prisma Client.

## Isi Slide

**Prisma Schema** mendefinisikan bentuk model `Task`, termasuk `title`, `completed`, dan tipe masing-masing. **Prisma Migrate** membuat perubahan struktur database dari model itu, misalnya tabel Task pada PostgreSQL. **Prisma Client** menghasilkan API bertipe yang dipakai kode, misalnya `task.create()` dan `task.findMany()`. Dalam project ini, `TasksService` memanggil API tersebut melalui `PrismaService`.

Jelaskan urutannya secara lisan: tulis model, jalankan migrasi dan generate sesuai langkah praktik, lalu pakai Client dalam Service. Menulis model saja belum otomatis membuat tabel atau menyimpan data.

## Visual yang Disarankan

Gunakan tata letak seperti halaman editor: di kiri cuplikan model `Task` yang memuat `id`, `title String`, dan `completed Boolean @default(false)`; di tengah tiga anotasi bernomor untuk **Schema**, **Migrate**, dan **Client**; di kanan satu baris kode `this.prismaService.task.create({ data: body })` dari checkpoint Day 1. Logo Prisma kecil cukup sebagai penanda. Hindari diagram panah dan paragraf panjang.

## Yang Disampaikan

Buka dengan contoh Task Belajar NestJS. Di `backend/prisma/schema.prisma`, model Task memberi tahu Prisma field yang ada dan tipenya; `completed` adalah Boolean dengan default `false`. Prisma Migrate mencatat perubahan schema sebagai migrasi dan menerapkannya ke PostgreSQL. Prisma Client kemudian dihasilkan dari schema, sehingga kode TypeScript mengenal method dan tipe untuk model Task. Saat `TasksService` memanggil `this.prismaService.task.create({ data: body })`, operasi itu menulis data ke PostgreSQL melalui Prisma Client.

Tekankan perbedaan struktur dan isi: migrasi menyiapkan tabel, sedangkan `create()` menambah satu baris Task. Jika model berubah, developer memperbarui schema, membuat migrasi yang diperlukan, dan menghasilkan ulang Client. Pada Day 1, jangan membahas relasi User atau JWT. Rujukan: [Prisma Schema](https://docs.prisma.io/docs/orm/v7/prisma-schema/overview), [Prisma Migrate](https://docs.prisma.io/docs/orm/v7/prisma-migrate), dan [Prisma Client](https://docs.prisma.io/docs/orm/v7/prisma-client/setup-and-configuration/generating-prisma-client).

---

# Slide 19 — Kenapa Kita Membutuhkan Validation?

## Tujuan Slide

Mempersiapkan peserta untuk eksperimen POST tanpa DTO pada sesi live coding.

## Isi Slide

### Request Valid

```json
{"title":"Belajar NestJS","description":"Workshop Day 1"}
```

### Request Tidak Valid

```json
{"title":123,"description":{},"randomField":true}
```

Pertanyaan utama:

> Request mana yang boleh diteruskan ke service dan database?

Jawaban:

Hanya request valid. Request kedua harus ditolak sebelum operasi database.

## Visual

```text
Invalid Request
      ↓
  Validation
      ✕
Database tidak disentuh
```

## Kenalkan Dua Konsep

### DTO

Mendefinisikan bentuk data yang kita harapkan dari client.

### Validation

Memastikan data yang dikirim client mengikuti aturan tersebut.

## Yang Disampaikan

Jangan menjelaskan syntax DTO di slide.

Gunakan ini sebagai teaser live coding.

Sampaikan:

> Saat live coding nanti kita sengaja akan membuat endpoint pertama tanpa DTO terlebih dahulu.

Kemudian kita akan mencoba mengirim request yang salah melalui Bruno.

Dari situ peserta dapat melihat sendiri:

> Kenapa validation dibutuhkan?

Baru setelah problem terlihat, kita memperbaikinya menggunakan DTO dan ValidationPipe.

Dalam checkpoint Day 1, `CreateTaskDto` meminta `title` berupa string yang tidak kosong (maksimal 120 karakter); `description` opsional dan maksimal 500 karakter. `ValidationPipe` global menolak field asing. Jelaskan perbedaan *tipe TypeScript saat menulis kode* dan *validasi JSON saat request berjalan* secara lisan. Hindari janji bahwa semua input bermasalah sudah tertangani: judul berisi spasi saja dan beberapa kasus PATCH masih menjadi bahan hardening.

---

# Slide 20 — Task Data Model

## Tujuan Slide

Memperkenalkan bentuk data sebelum membuat API.

## Isi Slide

### Task

| Field | Type | Keterangan |
|---|---|---|
| id | Integer | Dibuat otomatis |
| title | String | Wajib |
| description | String? | Opsional, dapat kosong/null di database |
| completed | Boolean | Default `false` |
| createdAt | DateTime | Dibuat otomatis |
| updatedAt | DateTime | Diperbarui otomatis |

## Yang Disampaikan

Sebelum membuat endpoint, kita harus tahu:

> Data apa yang akan kita kelola?

Dari data model ini nantinya kita dapat menentukan:

- Database schema.
- API endpoint.
- DTO.
- Validation.
- Response.

Mental flow:

```text
Requirement
    ↓
Data Model
    ↓
API Design
    ↓
Implementation
```

Contoh yang mudah diingat: task baru dengan judul “Belajar NestJS” otomatis mendapat `id`, `completed: false`, `createdAt`, dan `updatedAt`. Pada Day 1 belum ada `userId`; field itu baru masuk bersama relasi `User` di Day 3. Gunakan nama `completed`, sesuai schema dan API, bukan `isCompleted`.

---

# Slide 21 — Roadmap Live Coding

## Tujuan Slide

Memberikan gambaran perjalanan praktikum tanpa memberikan tutorial coding di slide.

## Isi Slide

```text
1. Mulai dari day-1-starter; cek environment dan PostgreSQL
        ↓
2. GET /tasks dengan data statis → pindah ke TasksService
        ↓
3. POST sederhana → kirim input buruk → temukan kebutuhan validasi
        ↓
4. Tambahkan DTO + ValidationPipe
        ↓
5. Kenali schema, migrasi, PrismaService; ganti array dengan database
        ↓
6. GET detail → PATCH → DELETE; uji ulang lewat Bruno
        ↓
7. Bahas batas implementasi; seed hanya bila diperlukan
```

## Yang Disampaikan

Tekankan metode belajar sesi ini:

> Kita tidak akan langsung membuat versi final.

Kita akan:

```text
Build
 ↓
Test
 ↓
Temukan masalah
 ↓
Perbaiki
 ↓
Test kembali
```

Sampaikan bahwa beberapa implementasi awal sengaja dibuat belum ideal.

Tujuannya agar peserta memahami **kenapa** sebuah pattern digunakan, bukan hanya menyalin syntax.

Panduan Day 1 memakai kerangka Nest dan model/migrasi Task yang sudah ada di `day-1-starter`; jangan menjanjikan membuat proyek dari nol atau melakukan reset database sebagai bagian wajib. Saat demo, perubahan dari array sementara ke PostgreSQL adalah momen penting: request yang sama kini menghasilkan data yang tetap ada setelah server direstart.

---

# Slide 22 — Mental Model yang Perlu Diingat

## Tujuan Slide

Menutup presentasi sebelum berpindah ke VS Code.

## Isi Slide

Gunakan diagram besar dan sederhana:

```text
Client
  ↓
Route TasksController
  ↓
DTO / ValidationPipe
  ↓
TasksService
  ↓
PrismaService
  ↓
PostgreSQL
```

### Tiga Hal yang Perlu Diingat

**1. HTTP menghubungkan client dengan backend.**

**2. NestJS membantu memisahkan responsibility aplikasi.**

**3. Validasi dilakukan sebelum data mencapai database.**

## Pesan Penutup

> Tidak perlu menghafal semua syntax NestJS hari ini.

Target utamanya adalah memahami alurnya.

Ketika sebuah request masuk ke backend, peserta harus dapat membayangkan:

- Request masuk melalui mana?
- Siapa yang menerima request?
- Di mana input divalidasi?
- Di mana logic dijalankan?
- Siapa yang berbicara dengan database?
- Bagaimana response kembali ke client?

Setelah itu:

**Pindah ke VS Code dan mulai live coding.**

Transisi lisan yang dapat dipakai: “Sekarang kita mulai dari route paling sederhana. Nanti kita ikuti satu task bernama `Belajar NestJS` dari request Bruno, melewati controller dan service, sampai benar-benar tersimpan di PostgreSQL.”

---

# Panduan Durasi Presentasi

| Bagian | Halaman | Target durasi |
| --- | ---: | ---: |
| Pembuka dan konteks | 1–3 | 3 menit |
| Backend dan dasar NestJS | 4–7 | 5 menit |
| Tools, Preflight, pnpm | 8–10 | 4 menit |
| API dan HTTP | 11–14 | 5 menit |
| Struktur NestJS dan alur Request | 15–16 | 4 menit |
| Prisma dan Validation | 17–19 | 5 menit |
| Task dan pengantar live coding | 20–22 | 4 menit |
| **Total** | **22** | **±30 menit** |

Cover dan Tools bisa bergerak cepat. Beri waktu lebih untuk NestJS fundamentals, Dependency Injection, Request lifecycle, dan Validation. Preflight adalah orientasi; pengecekan mesin peserta yang sesungguhnya dilakukan saat praktik.

---

# Arahan Visual untuk Slide

Pakai theme **Sticker Pop** dari lampiran dengan electric purple diganti biru. Latar warm peach, tipografi Outfit/Inter, pink dan kuning untuk aksen, garis tegas, serta cap miring kecil menjadi kosakata visualnya. Pertahankan deck statis sesuai permintaan awal, tanpa animation. Variasikan komposisi: headline editorial, logo collage, terminal IDE, lembar anotasi, tabel typographic, dan satu diagram garis halus. Hindari deretan kartu identik, panah besar, dan karakter dekoratif yang mengganggu keterbacaan.

Gunakan logo Bruno, NestJS, Prisma, PostgreSQL, Node.js, dan pnpm pada konteks yang tepat. Logo membantu orientasi tetapi tidak menggantikan penjelasan. Bila halaman menampilkan HTTP atau command, pakai jendela IDE dengan label file/terminal, syntax color, dan ukuran huruf yang terbaca dari belakang ruangan. Slide 8 dan 9 adalah pengecualian yang memang perlu menampilkan command; halaman konsep lain tidak berubah menjadi tutorial panjang.

Visual prioritas: slide 4 memperlihatkan batas Frontend, Backend, dan Database; slide 5 menjelaskan NestJS secara umum; slide 6 memakai analogi restoran; slide 15 menjelaskan Module, Controller, dan Service; slide 16 memperlihatkan alur Request; slide 18 menjelaskan Prisma; slide 19 membandingkan input valid dan tidak valid; slide 21 mengantar praktik.

---

# Hal yang Tidak Perlu Masuk Slide

Karena coding dilakukan setelah presentasi, hindari memasukkan:

- Command instalasi Node.js yang panjang.
- Command pnpm di luar halaman Preflight dan penyiapan package manager.
- Command Nest CLI.
- NestJS decorator syntax.
- Source code Controller.
- Source code Service.
- Source code DTO.
- Source code Prisma yang panjang.
- Isi `schema.prisma` secara penuh.
- Isi `.env`.
- Migration command.
- Seeder implementation.
- Validation decorator.
- Struktur folder terlalu detail.
- Dokumentasi PostgreSQL.
- Semua HTTP Status Code.
- Sejarah Node.js.
- Sejarah NestJS.
- Teori ORM panjang.
- Design pattern kompleks.
- Dependency Injection secara akademis.
- Authentication.
- JWT.
- Deployment.

Materi tersebut lebih baik muncul secara kontekstual saat live coding atau pada Day berikutnya.

---

# Prinsip Penyampaian Day 1

## Jangan Mulai dari Syntax

Mulai dari:

```text
Kenapa kita membutuhkan ini?
```

baru kemudian ketika live coding:

```text
Bagaimana cara membuatnya?
```

---

## Tunjukkan Problem Sebelum Solution

Contoh:

Jangan langsung mengatakan:

> Kita harus menggunakan DTO.

Lebih baik:

1. Buat POST endpoint tanpa DTO.
2. Test request normal.
3. Kirim request yang buruk.
4. Lihat problem-nya.
5. Baru kenalkan DTO dan validation.

---

## Hubungkan Setiap Konsep

Peserta sebaiknya memahami hubungan:

```text
HTTP
 ↓
Controller
 ↓
DTO
 ↓
Service
 ↓
Prisma
 ↓
PostgreSQL
```

bukan melihat semuanya sebagai topik yang berdiri sendiri.

---

## Fokus pada Mental Model

Target Day 1 bukan agar peserta hafal:

```text
Decorator A
Decorator B
Command C
Method D
```

Targetnya:

> Peserta memahami perjalanan sebuah request dari client sampai database dan kembali menjadi response.

Syntax dapat dicari kembali melalui dokumentasi.

Pemahaman arsitektur jauh lebih penting.

## Rujukan untuk revisi ini

- [NestJS Modules](https://docs.nestjs.com/modules), [Controllers](https://docs.nestjs.com/controllers), dan [Providers](https://docs.nestjs.com/providers) untuk penjelasan Module, HTTP boundary, Provider, serta Dependency Injection.
- [Prisma Schema](https://docs.prisma.io/docs/orm/v7/prisma-schema/overview), [Prisma Migrate](https://docs.prisma.io/docs/orm/v7/prisma-migrate), dan [Prisma Client](https://docs.prisma.io/docs/orm/v7/prisma-client/setup-and-configuration/generating-prisma-client) untuk pembagian fungsi Schema, Migrate, dan Client.
- [pnpm Installation](https://pnpm.io/installation/) untuk kompatibilitas versi dan pilihan instalasi; [pnpm](https://pnpm.io/) untuk shared content-addressable store.
- [Simple Icons](https://simpleicons.org/) untuk file logo vektor yang disimpan lokal di folder deck.
