# Day 1 — Building REST API with NestJS & PostgreSQL

## Gambaran Umum Presentasi

**Target durasi:** ±20–25 menit  
**Batas maksimal:** <30 menit

Presentasi ini **bukan sesi coding**. Tujuannya adalah membangun pemahaman dan mental model peserta sebelum masuk ke sesi live coding.

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

1. Building REST API with NestJS & PostgreSQL
2. Apa yang Akan Kita Bangun?
3. Posisi Day 1 dalam Workshop

## Bagian 2 — Kenapa NestJS?

4. Memahami Posisi Backend
5. Kenapa Menggunakan NestJS?
6. Kenapa Saya Menggunakan NestJS di Project Nyata?

## Bagian 3 — Environment & Tools

7. Tools yang Akan Digunakan

## Bagian 4 — Fundamental Backend

8. Apa Itu API?
9. Anatomi HTTP Request
10. CRUD dan HTTP Method
11. HTTP Status Code
12. Bagaimana NestJS Mengorganisasi Aplikasi?
13. Alur Request di Aplikasi Kita
14. Posisi Prisma dan PostgreSQL
15. Kenapa Kita Membutuhkan Validation?

## Bagian 5 — Project Hari Ini

16. Task Data Model
17. Roadmap Live Coding
18. Mental Model yang Perlu Diingat

---

# Slide 1 — Building REST API with NestJS & PostgreSQL

## Tujuan Slide

Membuka sesi dan memberi konteks singkat mengenai topik Day 1.

## Isi Slide

**Building REST API with NestJS & PostgreSQL**

**Day 1 — Backend Fundamentals & CRUD API**

Next.js & NestJS Workshop

## Visual yang Disarankan

Gunakan visual sederhana:

```text
Client
  ↓
NestJS
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

---

# Slide 5 — Kenapa Menggunakan NestJS?

## Tujuan Slide

Menjelaskan alasan pemilihan framework tanpa membuat klaim bahwa NestJS selalu menjadi pilihan terbaik.

## Isi Slide

### TypeScript First

Dibangun dengan dukungan TypeScript yang kuat.

### Structured by Default

Memiliki konsep:

- Module.
- Controller.
- Service.
- Dependency Injection.

### Cocok untuk Aplikasi yang Berkembang

Feature dapat dipisahkan dengan struktur yang jelas.

### Ekosistem Lengkap

Mendukung:

- Validation.
- Authentication.
- WebSocket.
- Testing.
- OpenAPI / Swagger.
- Microservices.

### Arsitektur yang Familiar

Konsep Controller, Service, dan Dependency Injection juga banyak ditemukan pada backend framework lain.

## Visual yang Disarankan

Bandingkan secara sederhana.

### Minimal Server

```text
Route
 ↓
Handler
 ↓
Logic
 ↓
Database
```

Jika tidak diatur dengan baik, banyak responsibility dapat bercampur.

### NestJS

```text
Controller
    ↓
Service
    ↓
Data Access
```

## Yang Disampaikan

NestJS cukup **opinionated**.

Framework sudah memberikan pola bagaimana sebuah project sebaiknya diorganisasi.

Untuk project yang mulai berkembang, struktur ini membantu menjaga code agar tidak mudah menjadi berantakan.

Tekankan:

> Framework tidak otomatis membuat code kita bagus.

NestJS hanya memberikan struktur dan tools yang membantu kita menjaga separation of concerns.

---

# Slide 6 — Kenapa Saya Menggunakan NestJS di Project Nyata?

## Tujuan Slide

Memberikan konteks nyata berdasarkan pengalaman sebagai developer.

Slide ini sebaiknya lebih personal dan tidak terasa seperti dokumentasi framework.

## Isi Slide

### Contoh Project Nyata

**Financial Management System — Koperasi Kamorina Surya Niaga**

Tech stack:

```text
Next.js
   ↓
NestJS
   ↓
PostgreSQL
   ↕
Redis
```

Contoh fakta yang bisa ditampilkan:

- Digunakan oleh 200+ anggota koperasi karyawan.
- Menangani workflow financial management.
- Menggunakan Next.js dan NestJS.
- PostgreSQL sebagai database.
- Redis untuk kebutuhan caching tertentu.

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

---

# Slide 7 — Tools yang Akan Digunakan

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

---

# Slide 8 — Apa Itu API?

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
   | title: "Belajar NestJS"
   ↓
Backend
   |
   ↓
Database
```

Backend memberikan response:

```text
201 Created
```

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

```text
POST /tasks
```

berarti backend menyediakan cara untuk membuat sebuah task.

---

# Slide 9 — Anatomi HTTP Request

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

```text
title       : Belajar NestJS
description : Workshop Day 1
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

---

# Slide 10 — CRUD dan HTTP Method

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

# Slide 11 — HTTP Status Code

## Tujuan Slide

Memperkenalkan response status yang akan ditemukan saat testing API.

## Isi Slide

| Status | Arti | Contoh |
|---:|---|---|
| 200 | OK | Data berhasil dibaca atau diubah |
| 201 | Created | Resource berhasil dibuat |
| 204 | No Content | Delete berhasil |
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

---

# Slide 12 — Bagaimana NestJS Mengorganisasi Aplikasi?

## Tujuan Slide

Memperkenalkan tiga building block terpenting sebelum live coding.

## Isi Slide

```text
                  TasksModule
                      │
           ┌──────────┴──────────┐
           │                     │
   TasksController         TasksService
           │                     │
      HTTP Layer          Application Logic
```

Kemudian:

```text
TasksService
     ↓
PrismaService
     ↓
PostgreSQL
```

## Module

Mengelompokkan komponen yang berhubungan dengan satu feature.

Contoh:

```text
TasksModule
```

berisi hal-hal yang berhubungan dengan Task.

## Controller

Menangani HTTP request dan route.

Contoh responsibility:

```text
POST /tasks
GET /tasks
PATCH /tasks/:id
```

## Service

Menangani application/business logic.

Contoh:

```text
Membuat Task
Mengambil Task
Mengubah Task
Menghapus Task
```

## Yang Disampaikan

Mental model sederhananya:

```text
Controller
=
HTTP boundary
```

```text
Service
=
application logic
```

```text
Module
=
feature organization
```

Peserta tidak perlu menghafal decorator atau syntax pada titik ini.

Yang penting memahami responsibility setiap layer.

---

# Slide 13 — Alur Request di Aplikasi Kita

## Tujuan Slide

Menjadi mental map utama saat sesi live coding.

## Isi Slide

Gunakan diagram besar:

```text
HTTP Request
     ↓
Controller
     ↓
DTO / Validation
     ↓
Service
     ↓
Prisma
     ↓
PostgreSQL
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

1. Client mengirim request.
2. Controller menerima request.
3. Data request divalidasi.
4. Service menjalankan logic.
5. Prisma melakukan operasi database.
6. PostgreSQL menyimpan data.
7. Result dikembalikan ke client.

## Yang Disampaikan

Sampaikan bahwa diagram ini menjadi acuan selama live coding.

Kalau peserta bingung:

> "Sekarang kita sedang membuat bagian apa?"

Mereka bisa kembali melihat flow ini.

---

# Slide 14 — Posisi Prisma dan PostgreSQL

## Tujuan Slide

Mencegah miskonsepsi bahwa Prisma adalah database.

## Isi Slide

```text
NestJS
  ↓
Prisma
  ↓
PostgreSQL
```

### NestJS

Application framework.

Menangani:

- HTTP.
- Module.
- Controller.
- Service.
- Validation.
- Application logic.

### Prisma

ORM / data access tool.

Membantu aplikasi berkomunikasi dengan database.

### PostgreSQL

Database sebenarnya.

Tempat data disimpan secara persisten.

## Visual Tambahan

```text
Application
    ↓
Prisma
    ↓
Database Query
    ↓
PostgreSQL
```

## Yang Disampaikan

Tekankan:

> Prisma bukan database.

Jika Prisma dihapus, PostgreSQL tetap merupakan database.

Prisma berada di antara aplikasi dan database agar kita dapat mengakses data dengan API yang lebih nyaman dan type-safe.

---

# Slide 15 — Kenapa Kita Membutuhkan Validation?

## Tujuan Slide

Mempersiapkan peserta untuk eksperimen POST tanpa DTO pada sesi live coding.

## Isi Slide

### Request Valid

```text
title       : "Belajar NestJS"
description : "Workshop Day 1"
```

### Request Tidak Valid

```text
title       : 123
description : object
randomField : true
```

Pertanyaan utama:

> Apakah kedua request tersebut boleh sampai ke database?

Jawaban:

**Tidak.**

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

---

# Slide 16 — Task Data Model

## Tujuan Slide

Memperkenalkan bentuk data sebelum membuat API.

## Isi Slide

### Task

| Field | Type | Keterangan |
|---|---|---|
| id | Integer | Dibuat otomatis |
| title | String | Wajib |
| description | String | Opsional |
| isCompleted | Boolean | Default `false` |
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

---

# Slide 17 — Roadmap Live Coding

## Tujuan Slide

Memberikan gambaran perjalanan praktikum tanpa memberikan tutorial coding di slide.

## Isi Slide

```text
1. Cek environment
        ↓
2. Buat project NestJS
        ↓
3. Setup PostgreSQL + Prisma
        ↓
4. Buat Tasks Module
        ↓
5. Buat endpoint POST pertama
        ↓
6. Buat Service + simpan ke database
        ↓
7. Testing menggunakan Bruno
        ↓
8. Temukan masalah tanpa DTO
        ↓
9. Tambahkan DTO + Validation
        ↓
10. Selesaikan CRUD
        ↓
11. Hardening endpoint
        ↓
12. Database Seed & Reset
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

---

# Slide 18 — Mental Model yang Perlu Diingat

## Tujuan Slide

Menutup presentasi sebelum berpindah ke VS Code.

## Isi Slide

Gunakan diagram besar dan sederhana:

```text
Client
  ↓
Controller
  ↓
DTO / Validation
  ↓
Service
  ↓
Prisma
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

---

# Panduan Durasi Presentasi

| Bagian | Slide | Target Durasi |
|---|---:|---:|
| Opening & konteks | 1–3 | 3–4 menit |
| Backend & NestJS | 4–6 | 5 menit |
| Tools | 7 | 1–2 menit |
| Fundamental API & HTTP | 8–11 | 5 menit |
| Arsitektur NestJS | 12–15 | 7 menit |
| Project & live coding | 16–18 | 3 menit |
| **Total** | **18 slide** | **±24–26 menit** |

Jangan merasa harus menghabiskan satu menit untuk setiap slide.

Beberapa slide seperti cover dan tools cukup 30–45 detik.

Slide yang sebaiknya mendapat penjelasan lebih lama:

- Kenapa NestJS.
- Real project.
- Struktur NestJS.
- Request lifecycle.
- Validation.

---

# Arahan Visual untuk Slide

Secara umum, hindari slide yang penuh paragraf.

Prioritaskan:

- Diagram.
- Flow.
- Icon.
- Screenshot.
- Tabel kecil.
- Keyword.
- Simple architecture visualization.

## Slide yang Sebaiknya Sangat Visual

### Slide 4

```text
Frontend → Backend → Database
```

### Slide 6

Screenshot project + tech stack.

### Slide 8

Client → API → Backend.

### Slide 12

Module → Controller → Service.

### Slide 13

Full request lifecycle.

### Slide 14

NestJS → Prisma → PostgreSQL.

### Slide 15

Valid vs invalid request.

### Slide 17

Live coding roadmap.

### Slide 18

Final mental model.

---

# Hal yang Tidak Perlu Masuk Slide

Karena coding dilakukan setelah presentasi, hindari memasukkan:

- Command instalasi Node.js.
- Command pnpm.
- Command Nest CLI.
- NestJS decorator syntax.
- Source code Controller.
- Source code Service.
- Source code DTO.
- Source code Prisma.
- Isi `schema.prisma`.
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