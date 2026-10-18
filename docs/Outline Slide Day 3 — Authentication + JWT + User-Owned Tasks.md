# Day 3 — Authentication, JWT, dan Task Milik User

## Gambaran Umum Presentasi

**Target durasi:** ±29–30 menit  
**Jumlah halaman:** 23  
**Peran presentasi:** membangun mental model sebelum live coding, bukan menggantikan panduan implementasi.

Day 1 menghasilkan REST API Task dengan NestJS dan PostgreSQL. Day 2 menghubungkan Next.js ke API itu sehingga CRUD bisa dipakai melalui browser. Day 3 menjawab pertanyaan yang muncul ketika aplikasi mulai dipakai lebih dari satu orang: **siapa yang sedang mengirim request, dan Task milik siapa yang boleh ia lihat atau ubah?**

**Acuan materi:** [panduan Day 3](./day-3-auth-nextjs-nestjs.md), branch `day-3-starter` sebagai kondisi awal, dan tag `day-3-checkpoint` sebagai hasil implementasi. Branch `main` telah melewati latihan ini. Saat mengajar langkah awal, gunakan worktree `day-3-starter` agar `GET /tasks` masih publik; gunakan checkpoint untuk menunjukkan hasil akhirnya. Contoh ID user dan Task di outline adalah ilustrasi, bukan hasil request yang baru dijalankan.

**Cara memakai outline:** `Isi Slide` dan `Visual yang Disarankan` menjadi konten halaman. `Yang Disampaikan` menjadi speaker notes berbahasa Indonesia. Satu slide membawa satu pesan utama. Nama teknikal seperti Authentication, Authorization, JWT, Guard, Bearer token, Proxy, Cookie, Prisma, DTO, Request, Response, dan HTTP status tetap memakai istilah aslinya, lalu dijelaskan dengan bahasa yang mudah dipahami.

Pilih satu contoh yang berulang: **Alya** membuat Task “Siapkan demo”; **Bima** adalah user kedua. ID mereka hanya dipakai sebagai contoh. Dengan contoh ini, peserta dapat mengikuti satu Task sejak register sampai pembuktian bahwa akun Bima tidak dapat membaca Task Alya.

Setelah presentasi, peserta diharapkan memahami:

- Mengapa CRUD Day 2 yang masih publik belum memisahkan data tiap user.
- Perbedaan Authentication dan Authorization pada aplikasi ini.
- Hubungan User, Task, `passwordHash`, JWT, `request.user.id`, dan `userId`.
- Mengapa password di-hash dan mengapa payload JWT tidak boleh dianggap rahasia.
- Bagaimana register, login, `GET /auth/me`, dan `JwtAuthGuard` bekerja.
- Mengapa semua operasi Task, termasuk list, harus memakai ID user dari token yang telah diverifikasi.
- Bagaimana Next.js menyimpan token latihan dan mengirim `Authorization: Bearer ...` ke NestJS.
- Mengapa Proxy mempercepat redirect, sementara keputusan akses tetap ada di backend.
- Cara membaca hasil uji dua akun dan status `400`, `401`, `404`, `409`, serta redirect `307`.

### Ritme penyampaian

| Bagian | Slide | Durasi |
| --- | ---: | ---: |
| Konteks dan masalah | 1–4 | ±3,5 menit |
| Fundamental Authentication | 5–6 | ±2,5 menit |
| Preflight dan data | 7–9 | ±3,5 menit |
| Register, login, dan identitas request | 10–15 | ±8,25 menit |
| Kepemilikan Task dan respons API | 16–17 | ±3,25 menit |
| Integrasi Next.js | 18–20 | ±4 menit |
| Pembuktian dan transisi praktik | 21–23 | ±4,5 menit |
| **Total** | **23** | **±29,5 menit** |

### Arah visual untuk deck

Lanjutkan bahasa visual deck Day 1 dan Day 2: kertas peach, headline navy, aksen biru, serta pink dan kuning hanya saat membantu penekanan. Variasikan komposisi editorial, ilustrasi, tabel tipografis, cuplikan browser, dan cuplikan IDE. Jangan menyusun semua informasi menjadi deretan kotak atau panah. Gunakan logo Next.js, NestJS, Prisma, dan PostgreSQL ketika teknologi itu benar-benar sedang dibahas. Cuplikan kode tampil singkat pada jendela IDE gelap dengan huruf yang cukup besar untuk proyektor. Deck dapat tetap statis; satu adegan yang jelas lebih berguna daripada animasi yang mengaburkan urutan request.

---

# Struktur Besar Presentasi

## Bagian 1 — Konteks Workshop

1. Day 3: Authentication dan Task Milik User
2. Apa yang Akan Berhasil di Akhir Hari?
3. Dari Day 1 dan Day 2 ke Day 3
4. Masalahnya: Task Masih Publik

## Bagian 2 — Fundamental Authentication

5. Authentication dan Authorization Menjawab Pertanyaan Berbeda
6. Analogi Ruang Kerja dan Loker Task

## Bagian 3 — Environment dan Data

7. Preflight Day 3: Cek Baseline dan Data
8. Satu User Bisa Memiliki Banyak Task
9. Password, Password Hash, dan Access Token

## Bagian 4 — Backend: Dari Register ke Identitas Request

10. Register: Membuat User tanpa Membocorkan Password
11. Login: Memeriksa Password lalu Menerbitkan JWT
12. Membaca JWT dengan Benar
13. Request Berikutnya Membawa Bearer Token
14. Guard Mengisi Identitas yang Tepercaya
15. `GET /auth/me`: Siapa yang Sedang Login?

## Bagian 5 — Task Milik User

16. Semua Query Task Harus Mengenal Pemiliknya
17. Membaca Status dari Penyebabnya

## Bagian 6 — Integrasi Next.js

18. Register dan Login di Browser
19. Cookie dan `authFetch`: Token Menjadi Header
20. Proxy Mengarahkan Lebih Awal

## Bagian 7 — Pembuktian dan Praktik

21. Uji Dua Akun, Satu Task
22. Roadmap Live Coding
23. Mental Model yang Perlu Diingat

---

# Slide 1 — Day 3: Authentication dan Task Milik User

## Tujuan Slide

Membuka Day 3 dengan satu perubahan yang akan dirasakan user: Task kini mempunyai pemilik.

## Isi Slide

**Authentication dan Task Milik User**

Day 3 · Next.js, NestJS, dan PostgreSQL

> Dari CRUD yang bisa dipakai siapa saja menjadi daftar Task milik akun yang sedang login.

## Visual yang Disarankan

Headline besar di kiri. Di kanan, satu kartu Task “Siapkan demo” dengan nama Alya pada sisi atas dan penanda akun Bima di luar kartu. Gunakan logo Next.js dan NestJS sebagai jangkar kecil; bukan diagram arsitektur yang padat.

## Yang Disampaikan

**±30 detik.** “Kemarin tombol Create, Update, dan Delete sudah bekerja dari browser. Sekarang bayangkan Alya dan Bima membuka aplikasi yang sama. Mereka tentu tidak ingin melihat daftar Task yang tercampur. Hari ini kita membuat akun, mengenali siapa yang mengirim request, lalu memastikan setiap Task hanya bisa diakses pemiliknya. Setelah mental model ini jelas, kita masuk ke live coding.”

---

# Slide 2 — Apa yang Akan Berhasil di Akhir Hari?

## Tujuan Slide

Menunjukkan hasil yang bisa diamati, bukan daftar library.

## Isi Slide

**Alya register dan login.**

Halaman Task menampilkan “Login sebagai alya@example.com”. Task “Siapkan demo” muncul di akun Alya. Saat Bima login, Task itu tidak muncul di daftarnya.

Tiga bukti kecil: `/register` · `/login` · `/tasks`

## Visual yang Disarankan

Buat dua cuplikan browser dengan ukuran berbeda, seperti spread editorial. Layar Alya memuat satu Task; layar Bima memuat empty state. Satu strip kecil Network menunjukkan `GET /tasks` berhasil untuk masing-masing akun. Jangan memakai deretan kartu fitur yang sama besar.

## Yang Disampaikan

**±1 menit.** “Target akhirnya terlihat sederhana: masing-masing orang membuka halaman yang sama tetapi menerima daftar Task miliknya sendiri. Register membuat akun, login memberi akses, lalu setiap request Task membawa identitas. Teks email pada mockup hanyalah contoh akun Alya. Kita tidak akan berhenti pada tampilan login; kita akan buktikan bahwa backend juga menolak akses ke Task orang lain. Kalau hanya tombol atau halaman yang disembunyikan, datanya belum terlindungi.”

---

# Slide 3 — Dari Day 1 dan Day 2 ke Day 3

## Tujuan Slide

Menghubungkan pengetahuan lama dengan perubahan Day 3 tanpa mengulang seluruh materi.

## Isi Slide

| Kemarin | Sekarang |
| --- | --- |
| Day 1: NestJS menyimpan Task | Tambah User dan pemilik Task |
| Day 2: Next.js memanggil API Task | Request membawa identitas user |

**API yang sama, aturan akses yang baru.**

## Visual yang Disarankan

Gunakan tiga halaman sebagai lembar kerja yang ditumpuk: terminal API Day 1, browser CRUD Day 2, dan browser dua akun Day 3 paling depan. Tampilkan garis tipis penghubung di tepi lembar, bukan panah panjang.

## Yang Disampaikan

**±45 detik.** “Day 1 kita membangun lima operasi CRUD Task. Day 2 kita menghubungkannya ke halaman Next.js. Day 3 tidak mengganti CRUD itu. Kita menambahkan User, login, dan aturan bahwa setiap query Task memakai identitas dari request yang sudah diverifikasi. Perubahan ini akan terasa baik pada respons API maupun pada halaman yang dipakai user.”

---

# Slide 4 — Masalahnya: Task Masih Publik

## Tujuan Slide

Membuat kebutuhan Authentication dan kepemilikan data muncul dari perilaku codebase awal.

## Isi Slide

**Pada `day-3-starter`:**

    GET /tasks              200 tanpa token
    prisma.task.findMany()  semua Task

**Pertanyaan:** jika Alya dan Bima memakai API yang sama, Task mana yang diterima masing-masing?

## Visual yang Disarankan

Tampilkan satu cuplikan IDE yang memuat `findMany()` tanpa `where`, dipasangkan dengan dua avatar kecil yang menghadap daftar Task yang sama. Area daftar adalah satu lembar data besar, tidak perlu empat kotak terpisah.

## Yang Disampaikan

**±1 menit 15 detik.** “Kita mulai dari kondisi nyata branch latihan. `GET /tasks` masih bisa dipanggil tanpa token, dan query `findMany()` mengambil Task tanpa filter pemilik. Itu cukup untuk CRUD satu pengguna saat Day 2, tetapi tidak cukup ketika ada dua akun. Kita perlu menjawab dua hal secara berurutan: siapa yang mengirim request, lalu data mana yang boleh diterimanya. Itulah alasan Day 3 memiliki Authentication dan Authorization.”

---

# Slide 5 — Authentication dan Authorization Menjawab Pertanyaan Berbeda

## Tujuan Slide

Membedakan verifikasi identitas dari keputusan akses ke data tertentu.

## Isi Slide

**Authentication:** “Kamu siapa?”  
Login memeriksa password. Guard memeriksa JWT pada request berikutnya.

**Authorization:** “Task ini milikmu?”  
TasksService mencocokkan `userId` ketika membaca atau mengubah Task.

> JWT yang valid belum berarti semua Task boleh diakses.

## Visual yang Disarankan

Tata sebagai dua pertanyaan besar pada bidang kertas yang sama, dengan jarak lebar di antaranya. Letakkan label `JwtAuthGuard` di bawah pertanyaan pertama dan potongan query `{ id, userId }` di bawah pertanyaan kedua. Hindari ikon gembok berulang.

## Yang Disampaikan

**±1 menit 30 detik.** “Authentication adalah proses mengenali Alya. Saat login, backend memeriksa email dan password. Setelah itu, setiap request protected membawa JWT yang diperiksa Guard. Authorization terjadi setelah identitas diketahui: bolehkah Alya membaca Task dengan ID tertentu? Di latihan ini jawabannya ditentukan oleh `userId` pada query Prisma. Jadi token Bima boleh valid, tetapi tetap tidak memberinya Task Alya.”

---

# Slide 6 — Analogi Ruang Kerja dan Loker Task

## Tujuan Slide

Memberi gambaran yang mudah diingat tentang Guard dan pemeriksaan pemilik, tanpa menyamakan analogi dengan mekanisme kode.

## Isi Slide

**Pintu ruang kerja** memeriksa tanda pengenal.  
**Rak loker** memeriksa nama pemilik pada loker yang diminta.

Alya boleh masuk. Bima juga boleh masuk. Isi loker Alya tetap hanya untuk Alya.

## Visual yang Disarankan

Satu ilustrasi ruang kerja utuh: pintu dan petugas di kiri, rak loker di kanan. Dua karakter berwarna berbeda membawa tanda pengenal. Label `Guard` diletakkan dekat pintu; label `TasksService` dekat rak. Loker “Siapkan demo” memakai label Alya yang tetap terlihat. Sisakan ruang kosong agar label dan karakter tidak saling menimpa. Komposisi boleh terasa seperti potongan adegan, bukan bagan proses.

## Yang Disampaikan

**±1 menit.** “Bayangkan sebuah ruang kerja dengan loker masing-masing. Petugas pintu memastikan orang yang datang punya tanda pengenal yang sah. Setelah masuk, petugas rak tetap memeriksa loker mana yang menjadi miliknya. Di kode kita, `JwtAuthGuard` memverifikasi token dan menghasilkan ID user yang tepercaya. `TasksService` memakai ID itu saat mencari Task. Analogi ini membantu mengingat dua pemeriksaan, tetapi JWT bukan kartu fisik, dan kepemilikan Task diperiksa melalui query database pada setiap operasi.”

---

# Slide 7 — Preflight Day 3: Cek Baseline dan Data

## Tujuan Slide

Menyiapkan kondisi latihan yang benar sebelum perubahan schema dan route dilakukan.

## Isi Slide

**Tiga hal yang dicek sebelum coding**

1. Backend `:3001` dan frontend `:3000` berjalan dari `day-3-starter`.
2. `GET /tasks` masih memberi `200` tanpa token.
3. Tabel Task pada database latihan kosong sebelum `userId` dibuat wajib.

`JWT_SECRET` disiapkan hanya di environment backend.
Bruno atau curl memeriksa API; DevTools Network memeriksa request browser.

## Visual yang Disarankan

Gunakan meja kerja ilustratif: dua terminal kecil, satu hasil request `200`, dan satu tampilan tabel Task kosong. Penanda “siap” dapat berupa tiga angka besar, bukan kotak checklist yang berulang. Nilai secret tidak pernah ditampilkan.

## Yang Disampaikan

**±1 menit.** “Kita pastikan peserta berada di branch starter, lalu jalankan dua aplikasi seperti Day 2. Pakai Bruno atau curl untuk memanggil `GET /tasks` tanpa token; respons `200` adalah baseline yang nantinya berubah menjadi `401`. DevTools Network nanti menunjukkan request dari browser. Satu syarat data perlu perhatian: migrasi Day 3 menambahkan `Task.userId` yang wajib. Baris Task lama belum punya pemilik, sehingga migrasi tidak bisa langsung diterapkan pada tabel yang berisi Task. Gunakan database lokal latihan yang tabel Task-nya kosong. Jika data perlu dipertahankan, buat migrasi bertahap dengan backfill. Secret JWT disimpan di backend, bukan pada variabel publik frontend.”

---

# Slide 8 — Satu User Bisa Memiliki Banyak Task

## Tujuan Slide

Menjelaskan schema yang membuat kepemilikan Task dapat disimpan dan dicari.

## Isi Slide

**User 1 : N Task**

    User: id · email (unique) · passwordHash
    Task: id · title · completed · userId

`Task.userId` mengarah ke `User.id`. Nilai `userId` pada Task wajib ada.

## Visual yang Disarankan

Tampilkan Alya sebagai satu label nama besar di tepi kiri dan beberapa judul Task sebagai baris seperti indeks arsip di kanan. Satu garis pengelompokan menghubungkan semua baris ke Alya. Di sudut kecil, cuplikan Prisma Schema hanya memperlihatkan `userId` dan `@relation`. Jangan memakai tabel ERD penuh dengan semua field Day 1.

## Yang Disampaikan

**±1 menit 15 detik.** “Day 1 Task berdiri sendiri. Day 3 menambahkan model User dan relasi satu ke banyak: satu user dapat memiliki banyak Task, setiap Task punya satu pemilik. Pada schema Prisma, `userId` berada di Task dan merujuk ke `User.id`. Kita juga membuat index `userId` karena daftar Task akan sering dicari per user. Field status tetap bernama `completed` seperti Day 1 dan Day 2. Setelah schema diubah, `prisma migrate dev` mengubah database dan `prisma generate` memperbarui Prisma Client yang digunakan TypeScript.”

---

# Slide 9 — Password, Password Hash, dan Access Token

## Tujuan Slide

Mencegah tiga nilai berbeda ini dianggap sebagai hal yang sama.

## Isi Slide

| Nilai | Dipakai untuk | Tempatnya |
| --- | --- | --- |
| Password input | Bukti saat register dan login | Request, sementara |
| `passwordHash` | Pembanding saat login | Database |
| `accessToken` | Identitas request setelah login | Browser, lalu header |

**Password tidak masuk ke respons register atau payload JWT.**

## Visual yang Disarankan

Tiga potongan tipografi pada satu garis horizontal dengan tekstur berbeda: form password, nilai hash yang dipendekkan, dan potongan token yang disamarkan. Gunakan warna untuk membedakan fungsi, bukan panah besar. Teks hash dan token jelas merupakan ilustrasi.

## Yang Disampaikan

**±1 menit 15 detik.** “Password adalah teks yang diketik user. Saat register, backend menghasilkan `passwordHash` dengan bcrypt, lalu menyimpan hash itu. Saat login, bcrypt membandingkan password yang baru diketik dengan hash yang tersimpan. Setelah cocok, backend menerbitkan `accessToken`. Token itu bukan password dan tidak berisi `passwordHash`. Batas bcrypt pada implementasi ini juga diperiksa: register menerima password 8 sampai 72 karakter, dengan maksimum 72 byte UTF-8. Jadi validasi karakter dan byte tetap perlu dibedakan.”

---

# Slide 10 — Register: Membuat User tanpa Membocorkan Password

## Tujuan Slide

Menjelaskan kontrak endpoint register dan urutan kerja backend.

## Isi Slide

**`POST /auth/register`**

    Body:     email, password
    Proses:   validate · lowercase email · bcrypt.hash · simpan User
    Response: id, email

Email baru `201` · input salah `400` · email duplikat `409`

## Visual yang Disarankan

Satu cuplikan request dan satu cuplikan respons bergaya Bruno/IDE, dipisahkan whitespace. Sorot bahwa respons tidak mempunyai `password` atau `passwordHash`. Logo NestJS dan Prisma boleh kecil di dekat bagian proses.

## Yang Disampaikan

**±1 menit 30 detik.** “Ketika Alya mengirim form register, DTO memeriksa bentuk email dan panjang password. Service merapikan email menjadi lowercase, memeriksa batas byte password, membuat hash bcrypt, lalu menyimpan User. Respons sengaja memilih hanya `id` dan `email`; hash tidak dikirim ke browser. Email mempunyai unique constraint di database. Jika email yang sama didaftarkan lagi, error Prisma diterjemahkan menjadi `409 Conflict`. Register di workshop ini belum otomatis membuat sesi login; langkah berikutnya tetap login.”

---

# Slide 11 — Login: Memeriksa Password lalu Menerbitkan JWT

## Tujuan Slide

Menjelaskan kapan token boleh diterbitkan dan data apa yang dikembalikan.

## Isi Slide

**`POST /auth/login`**

    cari User dengan email
    bcrypt.compare(password, passwordHash)
    signAsync({ sub: user.id })

Berhasil `200`: `accessToken` dan `user { id, email }`.  
Email atau password salah `401`.

## Visual yang Disarankan

Gunakan jendela IDE gelap berisi tiga baris inti di tengah halaman. Di pinggir, buat dua respons kecil: hasil sukses dan `401`. Hindari menaruh seluruh `AuthService` pada slide.

## Yang Disampaikan

**±1 menit 30 detik.** “Login mengambil User berdasarkan email yang sudah dinormalisasi, lalu `bcrypt.compare` memeriksa password input terhadap hash di database. Jika user tidak ada atau password salah, keduanya mendapat pesan umum yang sama dan status `401`. Jika cocok, `JwtService.signAsync` menerbitkan JWT dengan `sub` berisi ID User. Respons berisi token serta profil publik untuk UI. Konfigurasi `JWT_SECRET` ada di server, minimal 32 karakter dalam codebase latihan, dan token berlaku satu jam.”

---

# Slide 12 — Membaca JWT dengan Benar

## Tujuan Slide

Memberi mental model tentang isi dan verifikasi JWT tanpa menjadikannya kuliah kriptografi.

## Isi Slide

**JWT = header . payload . signature**

Payload contoh:

    { "sub": 7, "iat": ..., "exp": ... }

`sub` menunjuk User. `exp` membatasi masa berlaku. **Payload dapat dibaca; signature harus diverifikasi.**

## Visual yang Disarankan

Perbesar tiga segmen token sebagai tipografi pada satu baris, masing-masing punya warna kecil yang berbeda. Di bawah segmen payload, tampilkan `sub` dan `exp` seperti anotasi editorial. Jangan menggambar token sebagai brankas tertutup karena payload bukan rahasia.

## Yang Disampaikan

**±1 menit 30 detik.** “JWT memiliki tiga bagian. Payload bisa di-decode, jadi jangan masukkan password, `passwordHash`, atau secret ke sana. Pada aplikasi ini, `sub` berisi ID user; saat token diterbitkan, masa berlaku satu jam juga ditambahkan. Signature membantu backend mendeteksi token yang diubah. Token baru boleh dipercaya setelah `verifyAsync` memeriksa signature dan masa berlakunya dengan secret backend. Sekadar melihat `sub` pada teks token belum cukup.”

---

# Slide 13 — Request Berikutnya Membawa Bearer Token

## Tujuan Slide

Menghubungkan hasil login dengan request API yang protected.

## Isi Slide

**Setelah login, request Task membawa header:**

    GET /tasks
    Authorization: Bearer <accessToken>

Backend membaca header ini. Cookie browser tidak langsung menjadi identitas pada NestJS API.

## Visual yang Disarankan

Tampilkan satu request HTTP besar seperti lembar Network tab. `Authorization` diberi sorotan biru; body tidak perlu tampil. Logo browser dan NestJS cukup menjadi dua penanda kecil di tepi atas, tanpa panah.

## Yang Disampaikan

**±1 menit.** “Login hanya menerbitkan token. Agar backend mengenali request berikutnya, frontend harus mengirim token itu dalam header `Authorization` dengan format `Bearer`. Itulah yang dibaca Guard NestJS. Pada latihan ini frontend menyimpan token dalam cookie agar browser dan Proxy dapat membacanya, tetapi API NestJS tidak menerima cookie itu sebagai kredensial secara langsung. Helper frontend akan menyalin nilai token ke header setiap request protected.”

---

# Slide 14 — Guard Mengisi Identitas yang Tepercaya

## Tujuan Slide

Memperlihatkan asal `request.user.id` yang kelak dipakai semua query Task.

## Isi Slide

**`JwtAuthGuard` memeriksa:**

Format `Bearer` · signature dan masa berlaku · `sub` yang valid · User masih ada

Jika lolos:

    request.user = { id: user.id }

Jika gagal: `401 Unauthorized`.

## Visual yang Disarankan

Gunakan ilustrasi satu meja pemeriksaan dengan empat cap kecil di sepanjang satu jalur lurus. Di ujungnya, cuplikan IDE dua baris `request.user`. Susun cap dan cuplikan dengan jarak besar agar tidak bertumpuk; hindari bagan empat kotak.

## Yang Disampaikan

**±1 menit 45 detik.** “Guard berjalan sebelum method Controller yang dilindungi. `AuthModule` menyediakan Guard dan JWT untuk dipakai `TasksModule`; Guard dipasang pada kelas `TasksController` sehingga semua route CRUD ikut dilindungi. Ia memastikan header benar-benar memakai `Bearer` dan hanya berisi satu token. `verifyAsync` menolak signature salah atau token kedaluwarsa. Setelah itu Guard memeriksa `sub` adalah ID angka positif dan User tersebut masih ada di database. Barulah Guard mengisi `request.user.id`. Nilai ini berasal dari token yang telah diverifikasi dan hasil lookup User, bukan dari body yang bisa dikarang client. Jika salah satu pemeriksaan gagal, request berhenti dengan `401`.”

---

# Slide 15 — `GET /auth/me`: Siapa yang Sedang Login?

## Tujuan Slide

Menunjukkan satu endpoint sederhana untuk membuktikan token dan mengambil profil publik.

## Isi Slide

    GET /auth/me
    Authorization: Bearer <accessToken>

**Hasil `200`:** `{ id, email }`  
**Tanpa token valid:** `401`

Halaman `/tasks` memanggil endpoint ini sebelum mengambil daftar Task.

## Visual yang Disarankan

Pasangkan profil mini “Login sebagai alya@example.com” pada browser dengan respons JSON ringkas di sampingnya. Sisakan satu ruang kecil untuk label `Guard` yang menandai pemeriksaan, bukan diagram proses penuh.

## Yang Disampaikan

**±1 menit.** “Bagaimana halaman mengetahui akun yang sedang aktif? Ia memanggil `GET /auth/me` dengan Bearer token. Endpoint ini memakai Guard, lalu mencari data publik User dari ID yang sudah diverifikasi. Responsnya `id` dan `email` saja. Di checkpoint, halaman Task memanggil `getMe()` sebelum `getTasks()`. Jika token salah atau sudah habis masa berlakunya, `401` memicu pembersihan token dan kembali ke halaman login.”

---

# Slide 16 — Semua Query Task Harus Mengenal Pemiliknya

## Tujuan Slide

Menunjukkan bahwa perlindungan Task tidak selesai hanya dengan memasang Guard pada route.

## Isi Slide

**Guard mengenali user. Service membatasi data.**

| Operasi | Syarat query |
| --- | --- |
| Create | `userId` diisi dari `request.user.id` |
| List | `where: { userId }` |
| Detail, Update, Delete | `where: { id, userId }` |

Contoh toggle tetap memakai field `completed`.

## Visual yang Disarankan

Jadikan potongan `where: { id, userId }` sebagai headline kode besar pada jendela IDE. Tabel operasi berada sebagai anotasi tipografis di samping, bukan grid kartu. Sertakan satu Task Alya yang tidak muncul pada indeks Bima.

## Yang Disampaikan

**±1 menit 45 detik.** “Setelah Guard mengisi ID user, Controller meneruskannya ke TasksService. Saat Create, service sendiri yang mengisi `userId`; client tidak boleh menentukan pemilik lewat body. Saat List, `findMany` menggunakan `where: { userId }` sehingga Alya hanya mendapat Task Alya. Detail, Update, dan Delete mencocokkan ID Task sekaligus ID pemilik. Kalau salah satunya tidak cocok, operasi itu menghasilkan `404`. Guard saja belum cukup: token Bima valid, tetapi query tetap harus menolak Task Alya. Field untuk toggle tetap `completed`, bukan nama baru.”

---

# Slide 17 — Membaca Status dari Penyebabnya

## Tujuan Slide

Membuat peserta dapat menelusuri kegagalan ke lapisan yang tepat.

## Isi Slide

| Status | Contoh | Sumber keputusan |
| --- | --- | --- |
| `400` | `userId` palsu di body Task, token valid | DTO dan ValidationPipe |
| `401` | Token hilang/salah; login gagal | Guard atau AuthService |
| `404` | ID Task bukan milik akun ini | Query TasksService |
| `409` | Email register sudah ada | Unique email |

**Akun Bima yang valid tetap mendapat `404` untuk Task Alya.**

## Visual yang Disarankan

Gunakan angka status besar sebagai kolom editorial dengan satu kalimat kecil per baris. Sorot `401` dan `404` memakai warna berbeda agar peserta melihat perbedaan identitas dan kepemilikan. Hindari deretan empat kotak tebal.

## Yang Disampaikan

**±1 menit 30 detik.** “Status membantu kita mencari sumber masalah. `401` berarti kredensial atau token tidak diterima; request Task tanpa token berhenti di Guard. `404` untuk Task orang lain berarti token boleh valid, tetapi query `id` dan `userId` tidak menemukan Task yang boleh diakses. Jika Bima meminta list, ia bisa menerima `200` dengan daftar kosong; hanya permintaan terhadap ID Task Alya yang menghasilkan `404`. Dengan token yang valid, `400` muncul saat input melanggar DTO, termasuk body yang mencoba menyisipkan `userId`. `409` menandai email register duplikat. Implementasi ini memilih `404` untuk Task lintas akun.”

---

# Slide 18 — Register dan Login di Browser

## Tujuan Slide

Menjelaskan urutan pengalaman user dan peran form frontend.

## Isi Slide

**Register:** isi email dan password, akun dibuat, lalu pergi ke Login.  
**Login:** kirim kredensial, simpan `accessToken`, buka `/tasks`.

Form memiliki `submitting` dan pesan `error`; hasil register tidak otomatis login.

## Visual yang Disarankan

Gunakan dua cuplikan halaman seperti halaman majalah yang bersebelahan, tetapi ukuran dan posisinya berbeda. Di antaranya cukup teks “Akun berhasil dibuat” dan “Sekarang login”. Jangan meniru diagram kotak alur aplikasi.

## Yang Disampaikan

**±1 menit 15 detik.** “Frontend menyediakan dua halaman yang berbeda. Register memanggil endpoint publik, lalu menampilkan pesan bahwa akun berhasil dibuat beserta tautan ke Login. Ia tidak menyimpan token karena endpoint register tidak mengembalikan token. Login mengirim email dan password, menerima `accessToken`, menyimpannya, lalu membuka `/tasks`. Kedua form menampilkan keadaan sedang mengirim dan error, jadi user tahu apa yang sedang terjadi ketika request menunggu atau gagal.”

---

# Slide 19 — Cookie dan `authFetch`: Token Menjadi Header

## Tujuan Slide

Menjelaskan jembatan antara sesi browser workshop dan kontrak Bearer backend.

## Isi Slide

**Browser menyimpan `workshop_access_token`.**  
**`authFetch` membaca token itu dan menambah header Bearer.**  
**Jika API menjawab `401`, token dihapus dan user kembali ke Login.**

    const token = getToken();
    headers.set("Authorization", `Bearer ${token}`);

## Visual yang Disarankan

Gambarkan browser sebagai satu lembar besar dengan cookie kecil di tepi dan Network request di dalamnya. Di bawahnya, satu cuplikan IDE `authFetch` yang sangat pendek. Garis pengelompokan cukup untuk mengaitkan cookie dengan header; tidak perlu panah melintasi halaman.

## Yang Disampaikan

**±1 menit 30 detik.** “Setelah login, `saveToken` menaruh token pada cookie `workshop_access_token`. Helper `authFetch` membaca cookie itu pada browser dan menambahkan header `Authorization: Bearer ...` saat memanggil API. Dengan begitu, fungsi `getMe` dan semua fungsi CRUD Task memakai aturan yang sama. Jika token tidak ada, helper mengarahkan ke Login; jika backend menjawab `401`, helper menghapus cookie dan mengarahkan kembali. Cookie ini sengaja dapat dibaca JavaScript untuk latihan dan Proxy; ia bukan `HttpOnly`. Logout di checkpoint hanya menghapus token browser, bukan membatalkan JWT yang sudah terbit di server.”

---

# Slide 20 — Proxy Mengarahkan Lebih Awal

## Tujuan Slide

Menempatkan Next.js Proxy pada urutan request yang benar dan menjelaskan batasnya.

## Isi Slide

**Request halaman `/tasks` tiba di Next.js lebih dulu.**

Cookie tidak ada: `307` ke `/login`.  
Cookie ada: halaman diteruskan; API tetap memeriksa JWT.

**Proxy melihat keberadaan cookie, bukan keabsahan token.**

## Visual yang Disarankan

Perlihatkan dua state dari satu halaman browser: tab tanpa cookie berhenti pada layar Login, tab dengan cookie sampai ke halaman Task. Di sisi bawah, tempel cuplikan `matcher: "/tasks/:path*"` seperti label kode. Beri ruang terpisah untuk catatan “Guard + TasksService” di backend, agar tidak terlihat seolah Proxy memutuskan pemilik Task.

## Yang Disampaikan

**±1 menit 15 detik.** “Pada Next.js 16, fitur yang dahulu disebut Middleware bernama Proxy. Ia berjalan untuk path `/tasks` sebelum halaman dilanjutkan. Jika cookie token tidak ada, Proxy langsung mengirim redirect `307` ke `/login`. Jika cookie ada, Proxy membiarkan halaman lanjut. Ini baru pemeriksaan keberadaan cookie; token palsu atau kedaluwarsa juga bisa lolos dari Proxy. Ketika halaman memanggil API, Guard NestJS tetap memverifikasi token, lalu TasksService membatasi data. Karena itu Proxy membantu navigasi, sementara keamanan data ditentukan backend.”

---

# Slide 21 — Uji Dua Akun, Satu Task

## Tujuan Slide

Mengubah konsep Authentication dan kepemilikan menjadi bukti yang dapat diamati peserta.

## Isi Slide

**Alya membuat “Siapkan demo”.**

| Aksi | Hasil |
| --- | --- |
| Alya membuka daftar | Task terlihat |
| Bima membuka daftar | Task Alya tidak terlihat |
| Bima meminta ID Task Alya | `404` |
| Request tanpa token | `401` |

## Visual yang Disarankan

Gunakan dua profil browser yang tampak berbeda, bukan dua tab pada profil yang sama. Letakkan Task Alya sebagai objek pusat dan dua hasil respons sebagai anotasi di pinggir. Sisipkan potongan Network tab kecil yang membedakan `200` daftar Bima dari `404` saat meminta ID Task Alya.

## Yang Disampaikan

**±1 menit 30 detik.** “Kita akan buktikan dari API dan browser. Alya login lalu membuat Task. Dengan token Alya, Task terlihat. Dengan token Bima, daftar tetap `200` tetapi tidak memuat Task Alya. Perhatikan perbedaan dua hasil ini di Network: daftar Bima boleh berhasil meskipun kosong; ketika Bima meminta ID Task Alya secara langsung, hasilnya `404`. Tanpa token, request API berhenti lebih awal dengan `401`. Untuk melihat dua akun bersamaan di browser, gunakan dua profil browser karena cookie pada host yang sama dibagikan antar-tab.”

---

# Slide 22 — Roadmap Live Coding

## Tujuan Slide

Memberi urutan praktik yang sesuai panduan dan memperjelas checkpoint pembelajaran.

## Isi Slide

**Praktik setelah presentasi**

1. Baseline dan data latihan.
2. User, register, dan password hash.
3. Login, JWT, Guard, dan `/auth/me`.
4. Relasi Task dan filter semua query.
5. Form Next.js, `authFetch`, dan Proxy.
6. Uji dua akun serta satu `PATCH` per toggle.

## Visual yang Disarankan

Roadmap sebagai enam nomor besar pada satu halaman dengan ritme vertikal yang bervariasi, seperti daftar isi editorial. Dua checkpoint kecil di tepi: `GET /tasks` berubah dari `200` publik menjadi `401` tanpa token, dan akses Task akun lain menjadi `404`. Tidak perlu panah untuk setiap langkah.

## Yang Disampaikan

**±1 menit 30 detik.** “Kita akan mulai dari hasil Day 2, bukan dari proyek kosong. Pertama cek baseline dan database latihan. Lalu buat User, register, dan hash password; setelah itu login dan Guard. Begitu `/auth/me` bekerja, kita pasang `userId` pada Task serta filter semua query. Seed lama Day 2 yang membuat Task tanpa pemilik juga harus disesuaikan sebelum build. Baru kemudian frontend mengirim Bearer token dan Proxy memberi redirect awal. Kita tutup dengan dua akun dan pengecekan Network. Urutan ini sengaja membuat setiap kegagalan bisa ditelusuri: sebelum UI diubah, kontrak backend sudah kita uji.”

---

# Slide 23 — Mental Model yang Perlu Diingat

## Tujuan Slide

Menutup presentasi dengan satu hubungan sebab akibat yang akan dipakai saat live coding.

## Isi Slide

**Login menghasilkan token. Guard menghasilkan identitas tepercaya. Query menentukan Task yang boleh diakses.**

Di browser: token disimpan, dikirim sebagai Bearer, dan dihapus saat logout atau `401`.

> Token valid membuka request. `userId` membatasi datanya.

## Visual yang Disarankan

Gunakan halaman navy penuh dengan tiga frasa besar pada baris yang berbeda. Di bagian bawah, tampilkan Task “Siapkan demo” dengan label Alya dan respons `404` kecil untuk Bima. Tiga titik warna deck cukup sebagai aksen penutup.

## Yang Disampaikan

**±1 menit 30 detik.** “Kalau hanya satu kalimat yang diingat, ingat urutan ini: login menerbitkan token, Guard memverifikasi token dan memberi ID user yang tepercaya, lalu TasksService memakai ID itu untuk setiap query. Frontend bertugas mengirim token dan menunjukkan keadaan UI, tetapi tidak boleh menjadi satu-satunya penjaga data. Ketika nanti ada `401`, periksa token dan Guard. Ketika Task seseorang tidak muncul atau ID Task orang lain mendapat `404`, periksa filter `userId`. Sekarang kita implementasikan satu lapisan pada satu waktu.”

---

## Batas Materi yang Perlu Dijaga

- Presentasi berfokus pada implementasi workshop. Ia tidak menjanjikan refresh token, revokasi JWT, reset password, verifikasi email, role, atau deployment. Jika ditanya, bahas sebagai kelanjutan setelah alur inti berhasil.
- Jangan menyebut cookie JavaScript pada latihan sebagai `HttpOnly`. Cookie hanya membantu penyimpanan token di browser dan pemeriksaan keberadaan token oleh Proxy. Backend tetap menerima Bearer header.
- Jangan menyebut Proxy sebagai pemeriksa signature JWT atau pemilik Task. Proxy hanya melihat cookie pada request halaman.
- Jangan menganggap semua `404` berasal dari ID yang tidak ada; pada implementasi ini ID Task milik akun lain juga menjadi `404`.
- Jangan menampilkan secret, password nyata, atau JWT utuh pada slide dan screenshot. Token serta ID dalam outline adalah contoh.
- Gunakan `completed` untuk status Task. Jangan mengganti nama field menjadi `isCompleted`.
- Perintah reset database dan kode lengkap tetap berada pada panduan live coding. Jika data latihan tidak kosong, pilih penanganan migrasi yang menjaga data sebelum menambahkan `userId` wajib.

## Rujukan Codebase untuk Penulis Deck

Periksa sumber pada **tag `day-3-checkpoint`** ketika mengambil cuplikan kode atau screenshot hasil akhir. Untuk perilaku sebelum Authentication, periksa **branch `day-3-starter`**. Path di bawah menunjukkan bagian yang relevan; isinya tidak perlu ditampilkan seluruhnya pada slide.

| Materi | Sumber |
| --- | --- |
| Baseline Task publik | `day-3-starter:backend/src/tasks/tasks.service.ts` |
| User, relasi Task, dan `completed` | `day-3-checkpoint:backend/prisma/schema.prisma` |
| Migrasi `userId` wajib | `day-3-checkpoint:backend/prisma/migrations/20261003000001_add_task_owners/migration.sql` |
| DTO dan validasi input | `backend/src/auth/dto/register.dto.ts`, `backend/src/tasks/dto/`, `backend/src/main.ts` |
| Hash, login, JWT, dan profil | `backend/src/auth/auth.service.ts`, `backend/src/auth/auth.module.ts`, `backend/src/auth/auth.controller.ts` |
| Verifikasi token | `backend/src/auth/jwt-auth.guard.ts` |
| Guard dan pembatasan semua Task | `backend/src/tasks/tasks.controller.ts`, `backend/src/tasks/tasks.service.ts` |
| Form dan profil browser | `frontend/src/app/register/page.tsx`, `frontend/src/app/login/page.tsx`, `frontend/src/app/tasks/page.tsx` |
| Cookie, header Bearer, dan API Task | `frontend/src/features/auth/session.ts`, `frontend/src/features/auth/api/auth-fetch.ts`, `frontend/src/features/tasks/api/tasks.api.ts` |
| Redirect halaman | `frontend/src/proxy.ts` |
| Langkah dan hasil uji | [panduan Day 3](./day-3-auth-nextjs-nestjs.md) |

## Rujukan Konsep

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Prisma: relasi satu ke banyak](https://docs.prisma.io/docs/orm/prisma-schema/data-model/relations/one-to-many-relations)
- [Next.js Proxy](https://nextjs.org/docs/app/getting-started/proxy)
