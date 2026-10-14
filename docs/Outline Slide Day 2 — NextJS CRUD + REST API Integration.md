# Day 2 — Membangun Frontend dengan Next.js dan Integrasi REST API

## Gambaran Umum Presentasi

**Target durasi:** ±28–30 menit  
**Jumlah halaman:** 23. Struktur mengikuti pola Day 1: konteks → alasan teknologi → tools/preflight → fundamental → alur aplikasi → project hari ini → transisi ke live coding.

Presentasi ini **bukan sesi coding**. Tujuannya adalah membangun mental model peserta sebelum masuk ke implementasi Next.js. Source code, syntax React/Next.js, dan refactor modular dilakukan pada sesi live coding setelah presentasi.

**Acuan materi:** backend hasil Day 1 menjadi API yang dikonsumsi frontend pada Day 2. Route yang menjadi fokus Day 2 adalah `/` dan `/tasks`. Route `/auth/register`, `/auth/login`, authentication, middleware/proxy auth, JWT, dan user-owned task tetap menjadi kelanjutan Day 3. Jika branch `main` backend sudah berisi hasil Day 3 dan endpoint `/tasks` sudah protected, gunakan checkpoint/backend Day 1 saat demo Day 2 agar alur CRUD frontend tetap sesuai scope.

**Cara memakai outline untuk membuat deck:** bagian *Isi Slide* dan *Visual yang Disarankan* adalah bahan yang tampil di layar; bagian *Yang Disampaikan* menjadi speaker notes. Satu slide membawa satu pesan utama. Hindari menjadikan slide sebagai dokumentasi source code. Gunakan bahasa Indonesia yang sederhana untuk kalimat penjelas, tetapi pertahankan istilah teknis seperti Frontend, Backend, Component, Props, State, Event, Server Component, Client Component, App Router, Request, Response, API Contract, Fetch, Loading State, Error State, dan Environment Variable.

**Pilihan pedagogis Day 2:** Next.js App Router mendukung data fetching pada Server Components maupun Client Components. Untuk workshop ini, operasi CRUD Task sengaja diperlihatkan dari sisi browser/Client Component agar peserta dapat melihat hubungan **interaksi user → State/Event → HTTP Request → NestJS API → Response → UI Update** secara langsung. Ini adalah pilihan pembelajaran untuk memahami integrasi frontend-backend, bukan klaim bahwa seluruh aplikasi Next.js harus menggunakan client-side fetching.

Setelah presentasi selesai, peserta diharapkan memahami:

- Apa yang akan dibangun pada Day 2.
- Hubungan Day 2 dengan backend yang sudah dibuat pada Day 1.
- Perbedaan peran React dan Next.js secara sederhana.
- Kenapa Next.js dipakai dalam workshop.
- Bagaimana App Router memetakan struktur folder menjadi URL.
- Apa itu Component, Props, State, dan Event dalam konteks Task Management.
- Perbedaan Server Component dan Client Component pada level yang cukup untuk praktik.
- Bagaimana browser dan Next.js berkomunikasi dengan NestJS melalui HTTP.
- Kenapa proses mengambil dan mengubah data bersifat asynchronous.
- Bagaimana API Contract Day 1 dipakai oleh frontend.
- Bagaimana form berubah menjadi request `POST`.
- Bagaimana aksi UI berubah menjadi request `PATCH` dan `DELETE`.
- Kenapa UI harus memikirkan Loading, Success, Empty, dan Error State.
- Kenapa Backend Validation tetap dibutuhkan meskipun frontend melakukan validation.
- Gambaran struktur frontend yang bertahap, reusable, dan tidak over-engineered.
- Urutan live coding Day 2 dari baseline sampai CRUD berjalan dari browser.

---

# Struktur Besar Presentasi

## Bagian 1 — Konteks Workshop

1. Membangun Frontend dengan Next.js
2. Apa yang Akan Kita Bangun?
3. Posisi Day 2 dalam Workshop
4. Dari Bruno ke Browser: Apa yang Berubah?

## Bagian 2 — Kenapa Next.js?

5. React dan Next.js: Apa Bedanya?
6. Kenapa Menggunakan Next.js?
7. Kenapa Saya Menggunakan Next.js di Project Nyata?

## Bagian 3 — Environment & Tools

8. Tools yang Akan Digunakan
9. Preflight Day 2: Pastikan Backend Day 1 Siap
10. Menjalankan Dua Aplikasi: Frontend dan Backend

## Bagian 4 — Fundamental Frontend & Next.js

11. App Router dan File-Based Routing
12. UI sebagai Component Tree
13. Props, State, dan Event
14. Server Component vs Client Component

## Bagian 5 — Integrasi Frontend dan Backend

15. Alur Lengkap: User sampai Database lalu Kembali ke UI
16. Fetch, Async, dan Response
17. API Contract: Kesepakatan Frontend dan Backend
18. Read: Menampilkan Data dan UI State
19. Create: Dari Form menjadi POST Request
20. Update & Delete: Aksi User dan Sinkronisasi UI
21. Dari Satu Page ke Struktur yang Lebih Rapi

## Bagian 6 — Project Hari Ini

22. Roadmap Live Coding
23. Mental Model yang Perlu Diingat

---

# Slide 1 — Membangun Frontend dengan Next.js

## Tujuan Slide

Membuka sesi Day 2 dan langsung menghubungkannya dengan hasil Day 1.

## Isi Slide

**Membangun Frontend dengan Next.js**

**Day 2 — Frontend Fundamentals & REST API Integration**

Next.js & NestJS Workshop

Satu kalimat kecil:

> Kemarin API-nya bekerja lewat Bruno. Hari ini user akan memakainya lewat browser.

## Visual yang Disarankan

Gunakan visual utama:

```text
Browser
   ↓
Next.js
   ↓
NestJS
   ↓
PostgreSQL
```

NestJS dan PostgreSQL dapat dibuat sedikit lebih kecil atau redup untuk menunjukkan bahwa keduanya sudah dibangun pada Day 1, sedangkan Next.js menjadi fokus baru.

Gunakan logo:

- Next.js.
- NestJS.
- PostgreSQL.

Jangan memenuhi cover dengan detail React, Prisma, atau endpoint.

## Yang Disampaikan

Buka dengan continuity, bukan memperkenalkan project baru.

Kalimat yang dapat dipakai:

> “Kemarin kita membuat backend yang sudah bisa create, read, update, dan delete Task melalui Bruno. Hari ini kita tidak mengganti backend itu. Kita membuat interface yang benar-benar dipakai user, lalu menghubungkannya ke API yang sama.”

Jelaskan bahwa Day 2 akan fokus pada:

- bagaimana halaman dibuat;
- bagaimana data API masuk ke UI;
- bagaimana input user menjadi request;
- bagaimana UI bereaksi terhadap response.

Setelah presentasi singkat, sesi langsung beralih ke live coding.

Tekankan:

> Hari ini targetnya bukan membuat UI yang paling cantik. Targetnya membuat frontend yang benar-benar terhubung dengan backend dan memahami alur datanya.

---

# Slide 2 — Apa yang Akan Kita Bangun?

## Tujuan Slide

Memberikan gambaran akhir yang konkret sebelum peserta mempelajari konsep Next.js.

## Isi Slide

### Task Management Frontend

User dapat:

- Membuka halaman Task.
- Melihat daftar Task dari NestJS API.
- Membuat Task baru melalui form.
- Menandai Task selesai atau belum selesai.
- Mengubah informasi Task.
- Menghapus Task.
- Mendapat feedback saat data sedang diproses.
- Mendapat feedback ketika request gagal atau data kosong.

Route utama:

```text
/        → Landing Page
/tasks   → Task Management
```

Disiapkan untuk Day 3, tetapi **belum diimplementasikan hari ini**:

```text
/auth/register
/auth/login
```

## Visual yang Disarankan

Buat mockup Task Management sederhana, bukan screenshot source code.

Contoh:

```text
┌─────────────────────────────────────────────┐
│ Task Management                             │
│ Kelola task workshop dari satu tempat       │
│                                             │
│ [ Judul Task...               ] [ Tambah ]  │
│                                             │
│ □ Belajar Next.js            Edit   Delete  │
│ ☑ Belajar NestJS             Edit   Delete  │
│ □ Integrasi REST API         Edit   Delete  │
└─────────────────────────────────────────────┘
```

Gunakan satu task yang sama dengan Day 1, misalnya `Belajar NestJS`, agar perjalanan data terasa konsisten.

## Yang Disampaikan

Jelaskan bahwa UI ini hanya representasi data yang backend sudah kelola.

Ketika halaman `/tasks` dibuka, frontend perlu mengambil data melalui:

```text
GET /tasks
```

Ketika user menekan tombol tambah:

```text
POST /tasks
```

Ketika user mencentang Task:

```text
PATCH /tasks/:id
```

Ketika user menekan Delete:

```text
DELETE /tasks/:id
```

Ini bukan empat aplikasi berbeda. Semuanya hanya empat interaksi UI terhadap API yang sama.

Tekankan bahwa Day 2 dianggap berhasil ketika CRUD sudah dapat dilakukan **dari browser**, bukan hanya dari Bruno.

---

# Slide 3 — Posisi Day 2 dalam Workshop

## Tujuan Slide

Menunjukkan bahwa Day 2 adalah sambungan langsung dari Day 1 dan fondasi untuk Day 3.

## Isi Slide

```text
DAY 1
NestJS + REST API + PostgreSQL
              ↓
DAY 2
Next.js + Integrasi REST API
              ↓
DAY 3
Authentication + Protected CRUD + Deployment
              ↓
DAY 4
Final Project Presentation
```

Tambahkan satu Task yang sama melintasi tiap hari:

```text
Day 1 → Task dibuat lewat Bruno
Day 2 → Task dikelola lewat Browser
Day 3 → Task dimiliki User yang login
```

## Yang Disampaikan

Day 1 menjawab:

> Bagaimana backend menerima request dan menyimpan data?

Day 2 menjawab:

> Bagaimana user berinteraksi dengan backend tersebut melalui UI?

Day 3 menjawab:

> Bagaimana backend tahu siapa user yang melakukan request dan data mana yang boleh dia akses?

Tekankan bahwa authentication sengaja tidak masuk hari ini agar peserta memahami komunikasi frontend-backend normal terlebih dahulu.

Jangan membahas JWT, cookie, token storage, atau protected route secara detail pada slide ini.

---

# Slide 4 — Dari Bruno ke Browser: Apa yang Berubah?

## Tujuan Slide

Menghubungkan konsep API Client pada Day 1 dengan frontend web pada Day 2.

## Isi Slide

### Day 1 — Developer menguji API

```text
Developer
   ↓
Bruno
   ↓
HTTP Request
   ↓
NestJS API
```

### Day 2 — User menggunakan aplikasi

```text
User
   ↓
Browser
   ↓
Next.js UI
   ↓
HTTP Request
   ↓
NestJS API
```

Pesan utama:

> **Backend-nya sama. Client-nya yang berubah.**

## Visual yang Disarankan

Gunakan layout before/after.

Kiri: Bruno dengan request `GET /tasks`.  
Kanan: UI browser dengan daftar Task.

NestJS API ditempatkan sebagai satu blok yang sama di tengah/bawah kedua sisi untuk menekankan API tidak berubah hanya karena client berubah.

## Yang Disampaikan

Bruno sebenarnya sudah menjadi client.

Bedanya:

- Bruno memberikan interface untuk developer menguji endpoint.
- Next.js memberikan interface yang digunakan user.

Backend tidak perlu mengetahui apakah request datang dari:

- Bruno;
- aplikasi Next.js;
- aplikasi mobile;
- atau client lain.

Yang penting client mengikuti API Contract.

Kalimat jembatan:

> “Jadi pengetahuan HTTP dari Day 1 tidak kita buang. Hari ini kita memberi tombol, form, dan tampilan kepada request-request yang kemarin kita kirim manual.”

---

# Slide 5 — React dan Next.js: Apa Bedanya?

## Tujuan Slide

Mencegah peserta menyamakan React dengan Next.js atau menganggap keduanya dua teknologi yang tidak berhubungan.

## Isi Slide

### React

Library untuk membangun User Interface berbasis Component.

Konsep yang akan kita pakai:

- Component.
- Props.
- State.
- Event.

### Next.js

Framework React untuk membangun aplikasi web dengan conventions dan kemampuan tambahan.

Yang relevan untuk workshop:

- App Router.
- Page dan Layout.
- Navigation.
- Server dan Client Components.
- Data fetching.
- Build dan development tooling.

Visual sederhana:

```text
JavaScript / TypeScript
        ↓
      React
        ↓
     Next.js
        ↓
  Web Application
```

## Visual yang Disarankan

Gunakan logo React sebagai fondasi dan logo Next.js sebagai layer framework di atasnya.

Hindari tabel fitur React vs Next.js yang terlalu panjang.

## Yang Disampaikan

Jelaskan dengan kalimat sederhana:

> “React memberi kita model untuk membangun UI dari Component. Next.js memakai React dan menambahkan struktur aplikasi web di sekitarnya.”

Next.js bukan pengganti React.

Saat kita menulis Component di Next.js, kita tetap menggunakan React.

Workshop juga tidak bertujuan mengajarkan React dari nol. Peserta cukup membawa fundamental:

- component;
- state;
- form;
- event;
- `fetch`;
- `async/await`.

Jika ada peserta yang belum kuat React, tekankan mental model terlebih dahulu daripada syntax.

---

# Slide 6 — Kenapa Menggunakan Next.js?

## Tujuan Slide

Peserta memahami alasan Next.js dipakai dalam workshop dan masalah apa yang dibantu framework.

## Isi Slide

**Next.js adalah framework React untuk membangun aplikasi web dengan struktur dan conventions yang sudah disediakan.**

Empat alasan yang relevan untuk workshop:

### File-Based Routing

Struktur folder dapat merepresentasikan route aplikasi.

### Server & Client Components

Kita dapat memilih bagian UI yang bekerja di server dan bagian yang membutuhkan interaksi browser.

### Built-In Web Application Structure

Page, Layout, navigation, asset, environment, dan build memiliki convention yang jelas.

### React Ecosystem

Tetap memakai Component, Props, State, dan Event yang menjadi dasar React.

Tambahkan satu kalimat:

> Next.js dapat memiliki kemampuan backend sendiri, tetapi pada workshop ini backend sengaja tetap dipisahkan menggunakan NestJS.

## Visual yang Disarankan

Logo Next.js menjadi fokus.

Di sekelilingnya tampilkan empat anotasi:

```text
Routing
Components
Rendering
Web App Structure
```

Di bagian bawah gunakan architecture kecil:

```text
Next.js
   ↓ HTTP
NestJS
```

untuk menunjukkan keputusan workshop.

## Yang Disampaikan

Mulai dengan pertanyaan:

> “Kalau React sudah bisa bikin UI, kenapa kita pakai Next.js?”

Jawab bahwa React memberikan UI model, sedangkan Next.js memberi struktur aplikasi web yang lebih lengkap.

Kemudian jelaskan keputusan workshop:

> Next.js sebenarnya juga punya kemampuan server. Tetapi kita sengaja memakai NestJS sebagai backend terpisah supaya batas Frontend, REST API, Backend, dan Database terlihat jelas.

Ini keputusan arsitektur sekaligus keputusan pembelajaran.

Jangan mengklaim bahwa semua project Next.js harus memiliki backend terpisah.

---

# Slide 7 — Kenapa Saya Menggunakan Next.js di Project Nyata?

## Tujuan Slide

Memberikan konteks nyata berdasarkan pengalaman pemateri dan menunjukkan bahwa konsep Day 2 dipakai dalam aplikasi yang lebih besar.

## Isi Slide

### Contoh Project Nyata

**Financial Management System — Koperasi Kamorina Surya Niaga**

Teknologi:

```text
Browser
   ↓
Next.js
   ↓
NestJS
   ├──→ PostgreSQL
   └──→ Redis
```

Fokus cerita Day 2:

- Next.js menjadi interface yang dipakai user.
- Halaman dan form menerjemahkan aksi user menjadi request ke backend.
- UI perlu menampilkan data, loading, error, dan hasil perubahan.
- Ketika feature bertambah, Component dan API access perlu diorganisasi agar tidak bercampur.

Angka penggunaan, screenshot, dan detail arsitektur project pribadi perlu dikonfirmasi sendiri sebelum deck dipublikasikan.

## Visual yang Disarankan

Gunakan satu screenshot frontend project yang memang aman untuk ditampilkan.

Tambahkan callout kecil pada elemen UI:

```text
Form → Request
Table/List → Response Data
Action Button → Update/Delete
```

Jangan membahas Redis di sini selain sebagai bagian kecil dari diagram arsitektur.

## Yang Disampaikan

Day 1 memakai project yang sama untuk menjelaskan backend. Day 2 dapat memakai screenshot yang sama dari perspektif berbeda:

> “Kemarin kita melihat kenapa backend perlu struktur. Hari ini kita lihat sisi yang dipakai user.”

Ceritakan bahwa semakin banyak page, form, dan state, semakin penting membagi responsibility frontend.

Kemudian hubungkan dengan Task Management:

> “Project workshop jauh lebih kecil, tapi alur dasarnya sama: user berinteraksi dengan UI, frontend mengirim request, backend memproses, lalu UI menampilkan hasil.”

---

# Slide 8 — Tools yang Akan Digunakan

## Tujuan Slide

Memastikan peserta memahami fungsi tools Day 2 tanpa mengulang instalasi panjang Day 1.

## Isi Slide

| Tool | Fungsi pada Day 2 |
|---|---|
| Node.js | Runtime development |
| pnpm | Mengelola dependency dan menjalankan script |
| Next.js | Framework aplikasi frontend |
| React | Component, State, Props, Event |
| TypeScript | Type safety dan kontrak data di frontend |
| Tailwind CSS | Styling UI sederhana |
| NestJS API | Backend hasil Day 1 |
| Browser DevTools | Melihat Console dan Network Request |
| Bruno | Membuktikan API masih bekerja jika frontend bermasalah |
| VS Code / Editor | Menulis dan mengelola source code |

Pesan tambahan:

> Tools boleh berbeda. Alur datanya tetap sama.

## Visual yang Disarankan

Gunakan logo Next.js, React, Tailwind, NestJS, pnpm, dan Browser DevTools dalam komposisi editorial.

Next.js harus menjadi logo paling dominan.

Jangan membuat halaman sebagai sembilan kartu identik.

## Yang Disampaikan

Tidak perlu menginstal ulang semua tools jika sudah mengikuti Day 1.

Yang berubah hari ini adalah kita mulai memakai folder/aplikasi `frontend`.

Bruno tetap berguna. Jika UI gagal mengambil data, kita dapat mengecek:

> Apakah API memang mati, atau frontend yang salah?

Browser DevTools akan menjadi alat baru yang sangat penting, terutama tab:

- Console.
- Network.

Tekankan bahwa debugging frontend bukan hanya melihat UI.

---

# Slide 9 — Preflight Day 2: Pastikan Backend Day 1 Siap

## Tujuan Slide

Mencegah peserta debugging frontend ketika akar masalahnya adalah backend atau environment Day 1 belum berjalan.

## Isi Slide

Sebelum menyentuh UI, pastikan:

```text
Node.js       ✅
pnpm          ✅
Frontend deps ✅
Backend deps  ✅
PostgreSQL    ✅
NestJS API    ✅
GET /tasks    ✅
```

Contoh pemeriksaan cross-platform:

```bash
node --version
pnpm --version
git --version
```

Dari backend:

```bash
cd backend
pnpm install --frozen-lockfile
pnpm start:dev
```

Kemudian pastikan API Day 1 dapat diakses, misalnya melalui Bruno:

```text
GET http://localhost:3001/tasks
```

Expected secara konsep:

```text
200 OK
[ ...tasks ]
```

Node.js dan versi pnpm mengikuti requirement serta lockfile repo workshop yang sama dengan Day 1. Jangan mengganti versi dependency hanya karena ada versi terbaru di internet saat workshop berlangsung.

## Visual yang Disarankan

Tampilkan tiga area, bukan checklist box biasa:

1. Terminal kecil untuk cek versi.
2. Terminal backend dengan label `localhost:3001`.
3. Bruno dengan `GET /tasks → 200`.

Tambahkan cap besar:

**BACKEND READY**

## Yang Disampaikan

Tekankan urutannya:

> Jangan mulai debugging `fetch()` kalau `GET /tasks` di Bruno saja belum berhasil.

Preflight memisahkan dua jenis masalah:

```text
API bermasalah
vs
Frontend integration bermasalah
```

Jika backend pada `main` sudah berisi auth Day 3, gunakan backend checkpoint Day 1 agar endpoint Task dapat dipanggil tanpa JWT pada sesi ini.

Bila PostgreSQL menggunakan Docker, pastikan Engine/container memang berjalan; `docker --version` saja tidak membuktikan database aktif.

---

# Slide 10 — Menjalankan Dua Aplikasi: Frontend dan Backend

## Tujuan Slide

Membantu peserta memahami bahwa full-stack development hari ini berarti dua proses development berjalan bersamaan.

## Isi Slide

### Terminal 1 — Backend

```text
NestJS
http://localhost:3001
```

### Terminal 2 — Frontend

```text
Next.js
http://localhost:3000
```

Alur:

```text
Browser :3000
      ↓
Next.js
      ↓ HTTP
NestJS :3001
      ↓
PostgreSQL
```

Command minimal untuk frontend setelah dependency tersedia:

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm dev
```

## Visual yang Disarankan

Gunakan dua jendela terminal berdampingan:

- kiri berlabel `BACKEND :3001`;
- kanan berlabel `FRONTEND :3000`.

Di bagian atas/bawah, browser mengarah ke `localhost:3000`.

Gunakan warna berbeda untuk Frontend dan Backend agar batasnya jelas.

## Yang Disampaikan

Jelaskan bahwa `localhost` yang sama dapat memiliki beberapa aplikasi melalui port berbeda.

Port adalah bagian dari origin browser.

Jika frontend di browser melakukan request langsung dari `localhost:3000` menuju API `localhost:3001`, browser melihat dua origin berbeda. Backend perlu mengizinkan origin frontend agar request browser tidak diblokir oleh kebijakan CORS.

Untuk Day 2:

- pastikan konfigurasi CORS yang diperlukan sudah tersedia pada starter/checkpoint;
- cukup jelaskan sebagai **browser security boundary**;
- detail konfigurasi environment, CORS, dan deployment dibahas lebih lanjut pada Day 3.

Jangan menghabiskan presentasi Day 2 untuk teori CORS.

---

# Slide 11 — App Router dan File-Based Routing

## Tujuan Slide

Peserta memahami hubungan struktur folder dengan URL sebelum membuka source code.

## Isi Slide

Next.js App Router menggunakan struktur folder dan file untuk mendefinisikan route.

Project workshop:

```text
app/
│
├── page.tsx
│      ↓
│      /
│
└── tasks/
    └── page.tsx
           ↓
         /tasks
```

Disiapkan untuk Day 3:

```text
app/
└── auth/
    ├── login/
    │   └── page.tsx  → /auth/login
    │
    └── register/
        └── page.tsx  → /auth/register
```

Pesan utama:

> **Folder menentukan segment. `page.tsx` membuat UI untuk route tersebut.**

## Visual yang Disarankan

Buat tampilan seperti file explorer di VS Code di kiri dan browser URL di kanan.

Contoh:

```text
app/tasks/page.tsx
        ↔
localhost:3000/tasks
```

Jangan menampilkan source code isi `page.tsx`.

## Yang Disampaikan

Hubungkan struktur file dengan sesuatu yang langsung terlihat peserta.

Ketika membuat folder `tasks` dengan sebuah page, URL `/tasks` tersedia.

Tidak perlu membuat array route manual.

Kenalkan `layout.tsx` hanya secara singkat:

> Layout membungkus UI yang digunakan bersama oleh page di bawahnya.

Jangan masuk ke:

- route groups;
- parallel routes;
- intercepting routes;
- dynamic route kompleks.

Project Day 2 hanya membutuhkan `/` dan `/tasks`.

---

# Slide 12 — UI sebagai Component Tree

## Tujuan Slide

Membuat konsep Component konkret melalui UI Task Management, bukan definisi React yang abstrak.

## Isi Slide

Satu halaman dapat dipecah menjadi bagian dengan responsibility berbeda:

```text
TasksPage
│
├── TaskHeader
│
├── TaskForm
│
└── TaskList
     │
     ├── TaskItem
     ├── TaskItem
     └── TaskItem
```

Pesan utama:

> **Component adalah bagian UI yang memiliki responsibility yang jelas dan dapat disusun bersama.**

Tidak semua elemen kecil harus langsung menjadi Component baru.

## Visual yang Disarankan

Gunakan mockup Task Management dan beri outline warna pada area:

- Header.
- Form.
- List.
- Item.

Di sisi lain tampilkan Component Tree.

Jangan gunakan analogi benda lain; UI project sendiri sudah cukup konkret.

## Yang Disampaikan

Mulai dari UI, bukan folder structure.

Tanyakan:

> “Kalau halaman ini mulai membesar, bagian mana yang secara natural punya tanggung jawab sendiri?”

Contohnya:

- form mengelola input dan submit;
- list menampilkan kumpulan Task;
- item menampilkan satu Task dan action-nya.

Tekankan bahwa componentization bukan lomba membuat file sebanyak mungkin.

Kita tidak langsung memecah semua hal.

Pattern workshop:

```text
buat sederhana
     ↓
lihat responsibility
     ↓
baru pecah jika memang membantu
```

Ini konsisten dengan Day 1: pahami masalah sebelum menerima final structure.

---

# Slide 13 — Props, State, dan Event

## Tujuan Slide

Memberikan mental model React minimum yang diperlukan untuk CRUD tanpa mengubah presentasi menjadi kelas React lengkap.

## Isi Slide

### Props

Data yang diberikan dari parent kepada child.

Contoh konsep:

```text
TaskList
   ↓ memberikan Task
TaskItem
```

### State

Data yang dapat berubah selama user menggunakan halaman.

Contoh:

```text
tasks
title input
description input
loading
error
editing task
```

### Event

Aksi yang terjadi karena interaksi user.

Contoh:

```text
onChange  → user mengetik
onSubmit  → user submit form
onClick   → user menekan Delete
```

Flow utama:

```text
User Action
    ↓
Event
    ↓
State / API berubah
    ↓
UI dirender ulang
```

## Visual yang Disarankan

Gunakan satu UI form Task.

Sorot input sebagai State, tombol sebagai Event, dan data TaskItem sebagai Props.

Hindari tiga kartu teori yang tidak terhubung ke project.

## Yang Disampaikan

Jelaskan dengan satu scenario:

> User mengetik “Belajar Next.js”.

Nilai input berubah → State berubah → UI menampilkan nilai baru.

Ketika user menekan Submit → Event terjadi → frontend menggunakan nilai State untuk membuat request.

Setelah backend membalas → daftar Task perlu diperbarui → UI menampilkan keadaan baru.

Tekankan:

> State bukan database.

State adalah keadaan UI/aplikasi frontend saat ini. Data persisten tetap berada di PostgreSQL melalui backend.

---

# Slide 14 — Server Component vs Client Component

## Tujuan Slide

Peserta memahami kenapa beberapa Component dapat tetap berjalan di server dan kenapa Task UI yang interaktif membutuhkan Client Component.

## Isi Slide

### Server Component

Default untuk Page/Layout di App Router.

Cocok ketika:

- tidak membutuhkan interaksi browser;
- dapat mengambil/menyiapkan data di server;
- tidak memakai browser-only API;
- tidak membutuhkan State atau Event handler interaktif.

### Client Component

Digunakan ketika membutuhkan:

- State.
- `onClick`.
- `onChange`.
- Form interaction.
- lifecycle/effect.
- Browser APIs.

Visual:

```text
Next.js Page
│
├── Bagian statis / server
│
└── Interactive Task UI
       ↓
    Client boundary
       ↓
 State + Event + Browser
```

Pesan utama:

> **`use client` adalah boundary, bukan instruksi untuk menjadikan seluruh aplikasi client-side.**

## Visual yang Disarankan

Buat split screen:

**SERVER** di kiri dan **BROWSER** di kanan.

Letakkan Task Form, checkbox, dan Delete button di sisi Browser.

Gunakan garis network boundary tipis di tengah.

## Yang Disampaikan

Ini salah satu konsep Next.js yang mudah membuat peserta bingung.

Jelaskan:

> “Server Component bukan NestJS. Itu tetap bagian dari aplikasi Next.js.”

Server Component dan Client Component membahas **di environment mana React component dijalankan/dirender**, sedangkan NestJS adalah backend API terpisah pada arsitektur workshop.

Kemudian jelaskan pilihan Day 2:

> Untuk CRUD Task, kita sengaja membuat bagian interaktif berjalan di client supaya State, Event, Network Request, dan UI Update terlihat jelas ketika belajar.

Next.js juga dapat mengambil data pada Server Component. Itu valid dan akan berguna pada kasus lain. Jangan memberi kesan bahwa `useEffect + fetch` adalah satu-satunya cara mengambil data di Next.js.

---

# Slide 15 — Alur Lengkap: User sampai Database lalu Kembali ke UI

## Tujuan Slide

Menjadi mental map utama Day 2 dan menggabungkan materi Day 1 dengan frontend.

## Isi Slide

Contoh user menambahkan Task:

```text
User
 ↓
Task Form
 ↓
Event Submit
 ↓
Frontend State
 ↓
HTTP POST /tasks
 ↓
NestJS Controller
 ↓
Validation
 ↓
Service
 ↓
Prisma
 ↓
PostgreSQL
```

Kemudian hasilnya kembali:

```text
PostgreSQL
 ↓
NestJS Response
 ↓
Frontend menerima data
 ↓
State diperbarui
 ↓
UI dirender ulang
 ↓
User melihat Task baru
```

Pesan utama:

> **UI tidak langsung mengubah database. UI memicu Request.**

## Visual yang Disarankan

Gunakan satu flow horizontal besar dari User di kiri ke Database di kanan, lalu jalur response kembali ke UI.

Bedakan warna:

- Frontend.
- Network.
- Backend.
- Database.

Jangan mengulang semua detail NestJS dari Day 1; label Controller/Service cukup sebagai reminder.

## Yang Disampaikan

Ini adalah slide yang sebaiknya sering dirujuk saat live coding.

Tanyakan:

> “Saat tombol Tambah ditekan, apa yang sebenarnya terjadi?”

Jawaban bukan:

> “Task masuk database.”

Ada beberapa langkah di antaranya.

Hubungkan Day 1:

- DTO masih memvalidasi request.
- Service masih menjalankan operasi.
- Prisma masih menyimpan ke PostgreSQL.

Day 2 hanya menambahkan bagian sebelum request dan setelah response.

---

# Slide 16 — Fetch, Async, dan Response

## Tujuan Slide

Membuat peserta memahami kenapa API call tidak dapat diperlakukan seperti operasi instan.

## Isi Slide

Network operation membutuhkan waktu:

```text
Frontend
   ↓
Kirim Request
   ↓
MENUNGGU
   ↓
Response datang
```

Saat melakukan Request, tiga kemungkinan dasar:

```text
             Request
                ↓
       ┌────────┼────────┐
       ↓        ↓        ↓
    Loading   Success   Error
```

Konsep yang akan muncul saat live coding:

- `fetch` → mengirim HTTP Request.
- `async` → function melakukan pekerjaan asynchronous.
- `await` → menunggu Promise selesai sebelum melanjutkan bagian tertentu.
- `Response` → hasil HTTP yang perlu diperiksa/dibaca.

Tidak perlu menampilkan source code lengkap pada slide.

## Visual yang Disarankan

Gunakan timeline Request.

Contoh:

```text
0 ms         300 ms          600 ms
Klik ─────── Loading ─────── Data tampil
```

Bisa tambahkan Network panel mini:

```text
GET /tasks    200    182 ms
```

## Yang Disampaikan

Jelaskan bahwa browser tidak mengetahui berapa lama backend akan menjawab.

Itulah kenapa UI perlu Loading State.

Request juga bisa gagal karena:

- backend mati;
- server mengembalikan 4xx/5xx;
- network bermasalah;
- URL salah;
- browser memblokir request karena boundary tertentu.

Tekankan satu detail penting:

> `fetch` selesai bukan berarti business operation selalu berhasil. Frontend tetap perlu melihat status/response.

Saat live coding, Network Tab menjadi bukti konkret:

```text
GET /tasks → 200
POST /tasks → 201
```

---

# Slide 17 — API Contract: Kesepakatan Frontend dan Backend

## Tujuan Slide

Menghubungkan DTO/API Day 1 dengan TypeScript/frontend Day 2.

## Isi Slide

Frontend tidak perlu mengetahui implementasi Prisma atau tabel PostgreSQL.

Frontend perlu mengetahui **contract**:

### Request

```text
POST /tasks

title        → string, wajib
description  → string, opsional
```

### Response Task

```text
id
title
description
completed
createdAt
updatedAt
```

### Endpoint

```text
GET    /tasks
POST   /tasks
PATCH  /tasks/:id
DELETE /tasks/:id
```

Pesan utama:

> **API Contract adalah titik temu Frontend dan Backend.**

## Visual yang Disarankan

Buat tampilan seperti dokumen kontrak/handshake.

Kiri:

```text
Next.js
Needs:
- endpoint
- request shape
- response shape
```

Kanan:

```text
NestJS
Promises:
- endpoint
- validation
- response
```

Di tengah label **API Contract**.

## Yang Disampaikan

Hubungkan dengan DTO:

Day 1 backend berkata:

> “Untuk membuat Task, kirim title yang valid dan description bila ada.”

Day 2 frontend harus menghasilkan request yang sesuai.

TypeScript type/interface di frontend membantu developer memahami bentuk data saat menulis code.

Tetapi tekankan:

> TypeScript frontend bukan security boundary.

User/client lain masih dapat mengirim request yang berbeda. Karena itu Backend Validation Day 1 tetap diperlukan.

Jangan membuat satu source of truth lintas repo atau code generation sebagai topik hari ini. Cukup pahami kontraknya.

---

# Slide 18 — Read: Menampilkan Data dan UI State

## Tujuan Slide

Menjelaskan bahwa menampilkan hasil `GET /tasks` bukan hanya melakukan `map`, tetapi mengelola beberapa kondisi UI.

## Isi Slide

Saat `/tasks` dibuka:

```text
Page dibuka
   ↓
Request GET /tasks
   ↓
Response
   ↓
Task List
```

Tetapi UI perlu membedakan:

### Loading

```text
Sedang mengambil Task...
```

### Success + Data

```text
3 Task ditemukan
```

### Success + Empty

```text
Belum ada Task.
Buat Task pertama kamu.
```

### Error

```text
Gagal mengambil Task.
Coba lagi.
```

Visual state machine sederhana:

```text
             FETCH
               ↓
          Loading
          /              /            Success     Error
      /      Data   Empty
```

## Visual yang Disarankan

Gunakan empat mini-state dari **UI yang sama**, bukan empat card teori.

Misalnya Task List berubah dari skeleton → list → empty → error message.

## Yang Disampaikan

Ini salah satu perbedaan antara demo yang hanya berhasil sekali dan UI yang benar-benar dapat dipakai.

Ketika developer hanya memikirkan happy path:

```text
response → render
```

user bisa melihat layar kosong tanpa tahu apa yang terjadi.

Jelaskan bahwa Day 2 cukup memakai state sederhana. Kita belum membutuhkan state management library.

Jangan masuk React Query/SWR pada workshop dasar kecuali sebagai mention singkat di luar slide.

---

# Slide 19 — Create: Dari Form menjadi POST Request

## Tujuan Slide

Menjelaskan aliran data dari input user sampai Task baru muncul kembali di UI.

## Isi Slide

```text
User mengetik
      ↓
Input State
      ↓
Submit Form
      ↓
Frontend Validation ringan
      ↓
POST /tasks
      ↓
Backend Validation
      ↓
Task dibuat
      ↓
Response
      ↓
UI diperbarui
```

Contoh nilai:

```text
Title       : Belajar Next.js
Description : Integrasi frontend dan backend
```

Menjadi request body secara konsep:

```text
title        → "Belajar Next.js"
description  → "Integrasi frontend dan backend"
```

## Visual yang Disarankan

Gunakan satu form Task besar.

Beri nomor pada jalur:

1. Type.
2. Submit.
3. Request.
4. Response.
5. Task muncul.

Jangan menampilkan implementasi `useState` atau event handler pada slide.

## Yang Disampaikan

Hubungkan form dengan API Contract.

Frontend validation dapat memberi pengalaman yang lebih baik, misalnya mencegah submit title kosong dan memberi pesan langsung.

Tetapi Backend Validation tetap wajib.

Kenapa?

Karena endpoint dapat dipanggil tanpa UI Next.js melalui:

- Bruno;
- curl;
- aplikasi lain.

Setelah POST berhasil, frontend perlu menentukan bagaimana UI mengetahui data baru.

Untuk workshop, pilih mekanisme sederhana dan eksplisit saat live coding:

- update state dari response; atau
- ambil ulang daftar Task.

Jelaskan trade-off ketika praktik, tetapi jangan memperumit slide.

---

# Slide 20 — Update & Delete: Aksi User dan Sinkronisasi UI

## Tujuan Slide

Menjelaskan bahwa setelah operasi mutation berhasil, UI harus disinkronkan dengan kondisi backend.

## Isi Slide

### Update

```text
User klik Complete/Edit
        ↓
PATCH /tasks/:id
        ↓
Backend mengubah Task
        ↓
Response
        ↓
UI menampilkan nilai baru
```

### Delete

```text
User klik Delete
        ↓
DELETE /tasks/:id
        ↓
Backend menghapus Task
        ↓
Response
        ↓
Task hilang dari UI
```

Masalah yang harus dijawab frontend:

> Setelah backend berubah, bagaimana tampilan kita ikut berubah?

## Visual yang Disarankan

Gunakan before/after Task Item.

Before:

```text
□ Belajar Next.js
```

After PATCH:

```text
☑ Belajar Next.js
```

Delete:

```text
Belajar Next.js  →  hilang
```

Tambahkan label kecil `PATCH` dan `DELETE`, bukan source code.

## Yang Disampaikan

Perkenalkan istilah sederhana:

> **State synchronization**

Database adalah source persisten. UI memiliki representation lokal.

Setelah mutation, keduanya harus kembali konsisten.

Untuk Day 2, gunakan pendekatan yang mudah dilacak.

Jangan langsung memperkenalkan:

- optimistic update;
- cache invalidation framework;
- global query cache;
- complex state management.

Hal tersebut penting pada aplikasi besar, tetapi mengaburkan fundamental untuk workshop ini.

Tekankan failure case:

> Jangan menghapus item dari UI seolah-olah berhasil jika request backend sebenarnya gagal, kecuali memang sedang mengajarkan optimistic UI dengan rollback.

Day 2 lebih baik menunggu hasil backend terlebih dahulu.

---

# Slide 21 — Dari Satu Page ke Struktur yang Lebih Rapi

## Tujuan Slide

Menunjukkan arah modular, reusable, dan maintainable tanpa memberikan final architecture sejak awal.

## Isi Slide

### Tahap Awal

Saat belajar, kita boleh mulai sederhana:

```text
/tasks page
 ├── data
 ├── form
 ├── list
 └── actions
```

Ketika responsibility mulai bertambah:

```text
Tasks Page
│
├── TaskForm
├── TaskList
│   └── TaskItem
│
└── API Layer
    ├── getTasks
    ├── createTask
    ├── updateTask
    └── deleteTask
```

Tambahkan:

```text
Task Type
```

sebagai kontrak bentuk data frontend.

Pesan utama:

> **Pisahkan karena ada alasan, bukan karena ingin membuat banyak folder.**

## Visual yang Disarankan

Gunakan layout **Before → After**.

Before menunjukkan satu page yang mulai penuh responsibility.

After menunjukkan pembagian UI Component dan API Layer dengan garis dependency sederhana.

Jangan tampilkan file tree final lengkap pada slide.

## Yang Disampaikan

Ini harus konsisten dengan metode belajar yang sudah ditetapkan:

> Jangan langsung memberikan “best practice structure” final kepada peserta tanpa proses.

Saat live coding:

1. mulai dari sesuatu yang mudah dilihat;
2. buat GET bekerja;
3. tambah form;
4. tambah mutation;
5. baru lihat apa yang mulai berulang/bercampur.

Contoh alasan refactor:

- request API tersebar;
- satu page menangani terlalu banyak UI;
- tipe `Task` ditulis berulang;
- Task item memiliki action sendiri.

Baru pindahkan responsibility.

Tekankan bahwa modular bukan berarti abstraksi maksimum.

Untuk project kecil, struktur sederhana yang konsisten lebih baik daripada abstraction yang peserta belum memahami.

---

# Slide 22 — Roadmap Live Coding

## Tujuan Slide

Memberikan perjalanan praktik Day 2 dengan urutan yang logis dan tetap mengikuti metode problem → solution.

## Isi Slide

```text
1. Preflight
   Pastikan backend Day 1 + database bekerja
        ↓
2. Kenali frontend starter
   Jalankan Next.js dan lihat route /
        ↓
3. App Router
   Buat /tasks dan pahami page
        ↓
4. Static UI
   Buat Task Management layout sederhana
        ↓
5. Component dasar
   Pisahkan bagian UI ketika responsibility mulai terlihat
        ↓
6. READ
   Hubungkan GET /tasks dan tampilkan data
        ↓
7. UI State
   Tambahkan loading, error, dan empty state
        ↓
8. CREATE
   Buat form → POST /tasks
        ↓
9. UPDATE
   Hubungkan edit/complete → PATCH /tasks/:id
        ↓
10. DELETE
    Hubungkan Delete → DELETE /tasks/:id
        ↓
11. Refactor
    Rapikan API layer, Type, dan Component
        ↓
12. Full Flow Test
    CRUD dari browser + cek Network Tab
```

Tambahkan pattern sesi:

```text
Build
 ↓
Run
 ↓
Observe
 ↓
Temukan masalah
 ↓
Refactor
 ↓
Test kembali
```

## Visual yang Disarankan

Jangan gunakan 12 bullet kecil.

Buat roadmap seperti jalur perjalanan dengan enam checkpoint visual besar:

```text
SETUP
  ↓
ROUTING
  ↓
READ
  ↓
CREATE
  ↓
UPDATE / DELETE
  ↓
REFACTOR + TEST
```

Detail 1–12 dapat masuk speaker notes atau caption kecil.

## Yang Disampaikan

Tekankan:

> Kita tidak mulai dari structure final.

Peserta perlu melihat kenapa setiap layer dibuat.

Saat pertama menampilkan data, mungkin code masih berada dekat page.

Ketika API call dan UI mulai bertambah, baru pisahkan.

Saat form baru dibuat, validation belum perlu kompleks.

Setelah CRUD bekerja, baru rapikan.

Definition of Done sesi:

> Dari browser, peserta dapat create, read, update, dan delete Task terhadap NestJS API.

Browser DevTools Network menjadi alat verifikasi:

```text
GET     /tasks      → 200
POST    /tasks      → 201
PATCH   /tasks/:id  → 200
DELETE  /tasks/:id  → response sesuai API Day 1
```

Gunakan status yang benar-benar dihasilkan checkpoint backend Day 1; jangan mengarang response code yang berbeda dari implementasi.

---

# Slide 23 — Mental Model yang Perlu Diingat

## Tujuan Slide

Menutup presentasi dan memberi satu peta mental yang dapat dibawa peserta selama live coding.

## Isi Slide

Gunakan diagram besar:

```text
User
 ↓
Next.js UI
 ↓
State + Event
 ↓
HTTP Request
 ↓
NestJS API
 ↓
PostgreSQL
 ↓
HTTP Response
 ↓
Frontend State
 ↓
UI Update
```

### Empat Hal yang Perlu Diingat

**1. Frontend adalah Client dari API.**

**2. Component membagi UI; State menyimpan kondisi UI; Event merespons aksi user.**

**3. API Contract menghubungkan Next.js dan NestJS.**

**4. Setelah data backend berubah, UI harus ikut disinkronkan.**

## Pesan Penutup

> Tidak perlu menghafal semua syntax React dan Next.js hari ini.

Target utamanya adalah dapat menjawab:

- User melakukan apa?
- Event apa yang terjadi?
- State apa yang digunakan?
- Request apa yang dikirim?
- Endpoint mana yang menerima?
- Response apa yang kembali?
- Bagaimana UI berubah setelah response?

Kalimat transisi ke live coding:

> “Sekarang kita mulai dari kondisi paling sederhana: backend Day 1 sudah hidup, frontend baru punya halaman dasar. Dari sana kita ikuti satu Task dari data API sampai benar-benar muncul dan bisa diubah dari browser.”

Setelah itu:

**Pindah ke VS Code dan mulai live coding.**

---

# Panduan Durasi Presentasi

| Bagian | Halaman | Target durasi |
|---|---:|---:|
| Pembuka dan continuity Day 1 | 1–4 | 4 menit |
| React, Next.js, dan konteks project | 5–7 | 4,5 menit |
| Tools dan Preflight | 8–10 | 3,5 menit |
| Fundamental Next.js & React | 11–14 | 6 menit |
| Integrasi Frontend–Backend | 15–21 | 8 menit |
| Roadmap dan penutup | 22–23 | 3,5 menit |
| **Total** | **23** | **±29–30 menit** |

Cover, Tools, dan recap Bruno → Browser dapat bergerak cepat.

Beri waktu lebih pada:

- Props/State/Event.
- Server Component vs Client Component.
- Full-stack request lifecycle.
- API Contract.
- UI State.
- Sinkronisasi setelah mutation.

Preflight hanyalah orientasi. Pemeriksaan mesin peserta yang sebenarnya dilakukan saat praktik.

---

# Arahan Visual untuk Slide

Gunakan sistem visual yang sama dengan Day 1 agar deck terasa satu seri.

## Theme

Pertahankan theme **Sticker Pop** yang digunakan Day 1:

- warm peach background;
- aksen utama biru;
- pink dan kuning sebagai secondary accent;
- tipografi Outfit/Inter;
- garis tegas;
- cap/sticker kecil seperlunya;
- static deck tanpa animation.

Namun Day 2 sebaiknya terasa sedikit lebih **UI-centric** dibanding Day 1.

Gunakan lebih banyak:

- browser window;
- Task Management mockup;
- component outline;
- Network panel;
- state transition;
- input/form;
- before/after UI.

Kurangi penggunaan:

- ilustrasi karakter dekoratif;
- panah besar yang tidak menambah makna;
- deretan kartu identik;
- tabel panjang.

## Visual Prioritas

### Slide 2

Task Management UI final.

### Slide 4

Bruno → Browser transition.

### Slide 5

React sebagai UI foundation, Next.js sebagai framework.

### Slide 7

Screenshot project nyata.

### Slide 10

Dua development server: `:3000` dan `:3001`.

### Slide 11

File explorer → URL.

### Slide 12

UI → Component Tree.

### Slide 13

Input → State → Event.

### Slide 14

Server / Browser boundary.

### Slide 15

Full-stack lifecycle.

### Slide 16

Network timeline + Loading/Success/Error.

### Slide 17

API Contract sebagai jembatan Next.js ↔ NestJS.

### Slide 18

Loading, Data, Empty, Error dari UI yang sama.

### Slide 19

Form → POST.

### Slide 20

Before/After PATCH + DELETE.

### Slide 21

Before/After refactor.

### Slide 22

Roadmap live coding.

### Slide 23

Final mental model.

---

# Hal yang Tidak Perlu Masuk Slide

Karena coding dilakukan setelah presentasi, hindari memasukkan:

- source code `page.tsx` lengkap;
- source code Component;
- source code `useState`;
- source code `useEffect`;
- source code event handler;
- source code `fetch`;
- source code form;
- Tailwind class yang panjang;
- command `create-next-app` jika starter project sudah tersedia;
- seluruh file tree final;
- implementation API service;
- implementation TypeScript interface secara lengkap;
- `.env` atau `.env.local` lengkap;
- JWT;
- login/register implementation;
- auth middleware/proxy;
- token storage;
- protected route;
- user-owned Task;
- deployment;
- React Query;
- SWR;
- Redux;
- Zustand;
- optimistic update;
- cache invalidation kompleks;
- Suspense secara mendalam;
- Streaming secara mendalam;
- Server Actions secara mendalam;
- Route Handler sebagai backend alternatif;
- SEO;
- image optimization;
- metadata API;
- advanced performance optimization.

Beberapa konsep boleh disebut untuk konteks, tetapi jangan mengubah Day 2 menjadi survey seluruh fitur Next.js.

---

# Prinsip Penyampaian Day 2

## 1. Selalu Sambungkan dengan Day 1

Day 2 bukan tutorial terpisah.

Setiap konsep frontend harus dapat ditarik kembali ke backend.

Contoh:

```text
Task Form
   ↓
POST /tasks
   ↓
CreateTaskDto
```

```text
Task List
   ↑
GET /tasks
```

```text
Complete Checkbox
   ↓
PATCH /tasks/:id
```

```text
Delete Button
   ↓
DELETE /tasks/:id
```

Dengan begitu peserta melihat satu aplikasi yang tumbuh dari hari ke hari.

---

## 2. Jangan Mulai dari Syntax

Jangan mulai dengan:

```text
useState
useEffect
fetch
map
```

sebagai empat topik yang berdiri sendiri.

Mulai dari problem:

```text
Kita punya UI.
Bagaimana data API masuk ke UI?
```

Kemudian:

```text
Bagaimana input user disimpan sementara?
```

Kemudian:

```text
Bagaimana submit berubah menjadi Request?
```

Baru syntax diperkenalkan saat live coding.

---

## 3. Gunakan UI sebagai Titik Awal Penjelasan React

Jangan mendefinisikan Component, Props, State, dan Event secara akademis terlalu lama.

Tunjukkan Task UI dan tanyakan:

```text
Bagian mana yang bisa menjadi Component?
Data mana yang berubah?
Aksi apa yang dilakukan user?
```

Dari sana:

```text
Component
Props
State
Event
```

menjadi jawaban terhadap problem nyata.

---

## 4. Jelaskan Client-Side CRUD sebagai Pilihan Workshop

Next.js App Router menggunakan Server Components secara default dan juga mendukung data fetching pada server.

Tetapi learning outcome workshop adalah integrasi browser dengan REST API.

Karena itu Task Management sengaja memperlihatkan:

```text
Browser
 ↓
Client Component
 ↓
HTTP Request
 ↓
NestJS
```

Peserta dapat melihat request di Network Tab dan menghubungkannya dengan Day 1.

Jangan mengatakan:

> “Kalau Next.js, data harus diambil pakai useEffect.”

Yang lebih tepat:

> “Untuk latihan ini kita sengaja belajar client-side CRUD supaya lifecycle request dan state terlihat jelas. Next.js juga menyediakan pola server-side yang valid.”

---

## 5. Tunjukkan Problem Sebelum Refactor

Jangan langsung memberikan:

```text
components/
services/
hooks/
types/
utils/
```

tanpa alasan.

Biarkan peserta terlebih dahulu melihat page sederhana.

Setelah:

- request mulai berulang;
- file mulai panjang;
- responsibility bercampur;

baru tanyakan:

> “Bagian mana yang sebaiknya dipisah?”

Lalu refactor ke:

```text
TaskForm
TaskList
TaskItem
API layer
Task type
```

Ini membuat peserta memahami **kenapa struktur itu ada**.

---

## 6. Jangan Terjebak di Styling

Tailwind adalah alat bantu, bukan learning outcome utama.

Gunakan cukup untuk:

- layout;
- spacing;
- form;
- button;
- task item/card;
- status;
- responsive basic.

Jika styling membutuhkan waktu lebih lama daripada menjelaskan alur data, berarti scope sudah melenceng.

Targetnya:

```text
Create
Read
Update
Delete
```

berjalan dari browser.

---

## 7. Browser DevTools adalah Bagian dari Materi

Jangan hanya melihat halaman.

Buka **Network Tab** saat:

- page mengambil Task;
- form di-submit;
- Task di-update;
- Task di-delete.

Tunjukkan hubungan:

```text
Klik Button
    ↓
Network Request muncul
    ↓
Status Response
    ↓
UI berubah
```

Gunakan Console untuk error JavaScript, tetapi Network untuk membuktikan komunikasi API.

Ini menjembatani pengetahuan HTTP Day 1 dengan UI Day 2.

---

## 8. Frontend Validation Tidak Menggantikan Backend Validation

Frontend validation:

```text
UX
```

Backend validation:

```text
Data/API boundary
```

Contoh:

Frontend dapat mencegah submit title kosong.

Tetapi endpoint tetap harus menolak payload buruk jika request dikirim dari Bruno.

Mental model:

```text
User
 ↓
Frontend Validation
 ↓
HTTP
 ↓
Backend Validation
 ↓
Database
```

---

## 9. UI Harus Menjelaskan Kondisi Aplikasi

Jangan hanya pikirkan:

```text
data ada
```

Pikirkan:

```text
loading
success + data
success + empty
error
```

Pada mutation, pikirkan juga:

```text
submitting
success
failure
```

Tidak harus semua dibuat kompleks pada Day 2.

Yang penting peserta sadar bahwa asynchronous UI memiliki lebih dari satu keadaan.

---

## 10. Fokus pada Mental Model

Target Day 2 bukan agar peserta menghafal:

```text
Hook A
Function B
Syntax C
Folder D
```

Targetnya:

> Peserta dapat mengikuti perjalanan satu aksi user dari UI, menjadi HTTP Request, diproses NestJS, lalu kembali menjadi perubahan UI.

Final mental flow:

```text
User Action
    ↓
Event
    ↓
Frontend State
    ↓
HTTP Request
    ↓
NestJS API
    ↓
Database
    ↓
HTTP Response
    ↓
State Update
    ↓
UI Update
```

Jika peserta memahami flow ini, syntax dapat dicari dan dipelajari kembali.

---

# Rujukan untuk Revisi Ini

- Next.js App Router: https://nextjs.org/docs/app
- Layouts and Pages / File-Based Routing: https://nextjs.org/docs/app/getting-started/layouts-and-pages
- Server and Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components
- Fetching Data: https://nextjs.org/docs/app/getting-started/fetching-data
- Linking and Navigating: https://nextjs.org/docs/app/getting-started/linking-and-navigating
- Next.js Environment Variables: https://nextjs.org/docs/pages/guides/environment-variables
- pnpm Installation: https://pnpm.io/installation/

## Catatan Verifikasi Sebelum Deck Final Digenerate

Sebelum outline ini dipakai menjadi slide final, cocokkan sekali lagi dengan repository/checkpoint Day 2 yang benar-benar akan dipakai saat workshop:

- versi Node.js yang dipin repo;
- versi pnpm pada `packageManager`/lockfile;
- nama script frontend dan backend;
- port backend;
- port frontend;
- bentuk final `Task`;
- status code endpoint Day 1;
- apakah CORS sudah disiapkan pada starter;
- apakah frontend starter sudah memiliki Tailwind;
- nama file/folder API layer yang akhirnya dipilih;
- apakah screenshot project pribadi aman ditampilkan.

Tujuannya agar isi slide tidak menjanjikan behaviour yang berbeda dari code yang peserta jalankan.
