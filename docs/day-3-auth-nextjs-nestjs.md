# Day 3 Workshop — Authentication, JWT Guard, dan User-Owned Tasks

> Dokumen ini adalah acuan mengajar dari kondisi akhir Day 2 menuju implementasi Day 3 yang kini ada di repository. Ikuti potongan kode secara bertahap saat mengajar. Jika sebuah langkah meminta mengganti isi file, versi sebelumnya diganti, bukan digabung dengan versi baru.

## Target implementasi

Pada titik awal Day 2, `GET /tasks` memanggil `findMany()` tanpa filter. Day 3 menambahkan model `User`, register dan login, verifikasi JWT melalui `JwtAuthGuard`, filter `userId` pada semua operasi Task, serta Proxy Next.js untuk redirect awal dari `/tasks` ke `/login`.

| Proses | Endpoint | Hasil akhir |
| --- | --- | --- |
| Register | `POST /auth/register` | User baru; respons hanya `id` dan `email`. |
| Login | `POST /auth/login` | `accessToken` dan data user publik. |
| Profil | `GET /auth/me` | `401` tanpa JWT valid; `200` dengan JWT valid. |
| CRUD Task | `/tasks` dan `/tasks/:id` | JWT wajib; query dibatasi oleh `userId` dari token yang diverifikasi. |
| Halaman Task | `/tasks` di Next.js | Tanpa cookie token, Proxy mengarahkan ke `/login` sebelum halaman dimuat. |

Urutan implementasinya: **model User → register dan hash password → login dan JWT → guard → relasi Task–User → filter query Task → integrasi Next.js → Proxy → uji dua akun**. Selesaikan dan uji kontrak backend sebelum mengubah request frontend. Dengan begitu, kegagalan `401` atau `404` dapat ditelusuri ke lapisan yang tepat.

Istilah yang dipakai sepanjang materi:

- **Authentication** memverifikasi kredensial saat login dan JWT pada request berikutnya.
- **Authorization** menentukan apakah user terautentikasi boleh mengakses sebuah Task. Dalam implementasi ini, `TasksService` selalu memakai `userId` dari `request.user` pada query Prisma.
- **Password hash** adalah nilai yang dihasilkan `bcrypt.hash(password)` dan disimpan sebagai `passwordHash`. Login memakai `bcrypt.compare(password, passwordHash)`.
- **JWT** berisi klaim `sub` (ID user) dan signature. `JwtAuthGuard` memverifikasi signature serta masa berlaku token sebelum mengisi `request.user`.
- **Cookie token** dipakai frontend latihan agar token dapat dibaca browser dan keberadaannya dapat diperiksa Proxy Next.js. Cookie ini dibuat oleh JavaScript dan bukan cookie `HttpOnly`.
- **Proxy** adalah nama Middleware pada Next.js 16. Ia berjalan sebelum request halaman selesai; pengecekan cookie di sini hanya mempercepat redirect, sedangkan guard backend memverifikasi JWT dan kepemilikan task.

Contoh data yang digunakan pada pengujian: satu akun dengan `userId = 1`, satu akun lain dengan `userId = 2`, dan sebuah Task dengan `id = 12` serta `userId = 1`. Untuk akun kedua, filter `{ id: 12, userId: 2 }` tidak menemukan Task. Angka ini hanya contoh untuk membaca query; ID nyata tetap mengikuti respons database.

## 0. Kondisi awal dan persiapan

Proyek memakai NestJS 11, Prisma 7 + PostgreSQL, Next.js 16 App Router, dan pnpm. Backend lokal memakai port `3001`; frontend memakai port `3000`. Di backend, `main.ts` sudah mengaktifkan `ValidationPipe` global dan CORS. Di frontend, `/tasks` adalah Client Component dan fungsi `fetch` Task berada di `tasks.api.ts`.

| File yang sudah ada | Peran |
| --- | --- |
| `backend/prisma/schema.prisma` | Model Task dan konfigurasi Prisma Client. |
| `backend/src/tasks/tasks.controller.ts` | Route HTTP Task. |
| `backend/src/tasks/tasks.service.ts` | Query Task melalui Prisma. |
| `backend/src/tasks/dto/` | Validasi body POST/PATCH. |
| `frontend/src/app/tasks/page.tsx` | State dan handler halaman Task. |
| `frontend/src/features/tasks/api/tasks.api.ts` | GET/POST/PATCH/DELETE dari browser. |

Jalankan backend dan frontend pada terminal terpisah. Gunakan database latihan yang boleh diubah. `backend/.env` memuat konfigurasi database; jangan tampilkan kredensialnya saat workshop. Jika `frontend/.env` belum ada di salinan kerja peserta, buat dengan `NEXT_PUBLIC_API_URL=http://localhost:3001` lalu restart Next.js.

```bash
# Terminal backend, dari root repository
cd backend
pnpm install
pnpm start:dev

# Terminal frontend, dari root repository
cd frontend
pnpm install
pnpm dev
```

Sebelum mengubah kode, panggil `GET /tasks` dan baca implementasi `TasksService.findAll()`:

```bash
curl -i http://localhost:3001/tasks
```

Respons `200` berasal dari `findMany()` tanpa `where`. Ini baseline yang akan berubah setelah guard dan filter ownership dipasang.

**Data migrasi:** pada langkah 6, kolom `Task.userId` dibuat wajib. Baris Task lama belum punya `userId`, sehingga migrasi tidak dapat langsung diterapkan pada tabel yang berisi data. Jalur utama materi memakai **database lokal latihan dengan tabel Task kosong**. Jika data lama perlu dipertahankan, migrasikan `userId` sebagai nullable, lakukan backfill berdasarkan pemilik yang ditetapkan, lalu ubah menjadi wajib. Jangan jalankan reset pada database bersama atau data yang masih diperlukan.

Jika database latihan memang boleh dihapus seluruhnya, jalankan dari `backend/` **sebelum** membuat akun pada langkah 3:

```bash
pnpm exec prisma migrate reset --force
```

Perintah ini menghapus seluruh data dan menerapkan ulang migrasi yang sudah ada. Pada Prisma 7 dalam proyek ini, seed tidak otomatis dijalankan oleh reset. Seed lama juga belum mengisi `userId`; langkah 6 menjelaskan penggantinya.

**Verifikasi awal:** `GET /tasks` dapat diakses tanpa token dan hasilnya belum dibatasi per user. Setelah langkah 6, request yang sama tanpa token harus mendapat `401`.

## 1. Tambahkan model User dulu

**Tujuan langkah ini:** membuat model `User` sebagai dasar untuk register dan relasi pemilik Task. Pada tahap ini, model `Task` dan CRUD yang sudah ada belum berubah. Tunjukkan perubahan schema terlebih dahulu, lalu jalankan migrasi supaya peserta dapat membedakan definisi model di Prisma dari tabel yang benar-benar dibuat di PostgreSQL.

Edit `backend/prisma/schema.prisma`. Pertahankan blok `generator`, `datasource`, dan model `Task` yang sudah ada; **tambahkan hanya model baru** berikut:

```prisma
model User {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}
```

**Penjelasan per baris:**

| Baris | Penjelasan |
| --- | --- |
| `model User { ... }` | Mendefinisikan model User di Prisma. Tabel PostgreSQL baru dibuat ketika migrasi dijalankan. |
| `id Int @id @default(autoincrement())` | `id` adalah primary key bertipe integer; database memberi nilai secara otomatis saat User dibuat. |
| `email String @unique` | Email harus unik. Constraint database tetap menolak duplikat jika dua request register datang hampir bersamaan. |
| `passwordHash String` | Menyimpan hasil `bcrypt.hash()`, bukan password dari request. Login nanti membandingkan password input dengan hash ini. |
| `createdAt DateTime @default(now())` | Database mengisi waktu pembuatan ketika record ditambahkan. Field ini tidak perlu dikirim saat register. |

Relasi ke `Task` ditambahkan pada langkah 6. Dengan urutan ini, peserta bisa memeriksa proses register lebih dulu sebelum semua query Task berubah.

Dari `backend/` jalankan:

```bash
pnpm exec prisma validate
pnpm exec prisma migrate dev --name add_users
pnpm exec prisma generate
```

Jalankan perintah secara berurutan. `prisma validate` memeriksa validitas schema; `prisma migrate dev` membuat dan menerapkan SQL migrasi di PostgreSQL; `prisma generate` memperbarui Prisma Client sehingga TypeScript mengenal `prisma.user`. Output Prisma Client proyek ini berada di `backend/generate/prisma`, sehingga kode berikutnya mengimpor dari `generate/prisma/client`. Pada Prisma 7 di proyek ini, jalankan `generate` secara eksplisit setelah schema berubah.

**Verifikasi langkah 1:** buka file migrasi yang baru dibuat dan tunjukkan SQL pembuatan tabel User serta unique constraint pada email. Cek bahwa model Task belum memiliki `userId`; relasinya baru dibuat setelah register, login, dan guard dapat diuji.

> `backend/prisma/seed.ts` lama membuat tiga task tanpa `userId` dan menghapus task lama. Setelah relasi pemilik dibuat, seed lama bahkan membuat **build TypeScript gagal** karena setiap task wajib punya `userId`. Langkah 6d akan menonaktifkannya secara jelas; lampiran memberi pilihan seed baru.

## 2. Siapkan bcrypt, JWT, dan secret server

**Tujuan langkah ini:** menyiapkan library untuk password hashing dan JWT. Sebelum memasang package, jelaskan alur data yang akan dibuat. Password tidak dienkripsi lalu didekripsi saat login; service akan memakai `bcrypt.compare()` untuk memeriksa password terhadap hash yang tersimpan.

```text
Register: password asli ──bcrypt.hash──> hash di database
Login:    password dari form + hash di database ──bcrypt.compare──> cocok/tidak
Sesudah login berhasil: ID user ──JWT sign──> token untuk request berikutnya
```

Dari `backend/`:

```bash
pnpm add bcrypt @nestjs/jwt
pnpm add -D @types/bcrypt
openssl rand -hex 32
```

`pnpm add` memasang dependency runtime backend; `-D @types/bcrypt` menambah deklarasi tipe untuk TypeScript; `openssl rand -hex 32` menghasilkan secret acak. Salin keluarannya ke baris baru di `backend/.env`:

```dotenv
JWT_SECRET=isi-dengan-hasil-openssl-anda
```

Restart `pnpm start:dev` setelah mengubah `.env` agar proses backend membaca secret baru. `JWT_SECRET` dipakai server untuk menandatangani dan memverifikasi JWT; browser hanya menerima token yang sudah dibuat. Nilai `NEXT_PUBLIC_` dapat masuk ke kode browser, jadi `JWT_SECRET` harus tetap berada di environment backend.

**Peran tiap komponen:**

- **bcrypt:** `bcrypt.hash(password, 10)` menghasilkan hash untuk disimpan dalam kolom `passwordHash`. Saat login, `bcrypt.compare(password, passwordHash)` memeriksa kecocokannya. Hash bcrypt memakai salt, sehingga meng-hash input yang sama lagi lalu membandingkan dua string hash bukan cara verifikasi yang benar.
- **JWT:** `JwtService.signAsync({ sub: user.id })` menerbitkan token setelah login berhasil. Payload JWT dapat dibaca oleh pemegang token; signature memungkinkan server mendeteksi perubahan payload. Simpan klaim yang diperlukan saja, yaitu `sub` sebagai ID user.
- **Guard:** `JwtAuthGuard` akan membaca header `Authorization: Bearer <token>`, lalu memverifikasi signature dan masa berlaku dengan `JwtService.verifyAsync()`. Jika valid, guard mengisi `request.user` agar controller dapat memakai ID hasil verifikasi.

**Verifikasi langkah 2:** pastikan package terpasang, `JWT_SECRET` terisi di backend, dan backend dapat di-restart. Sebelum menulis service, bedakan dua nilai yang nanti terlihat pada kode: database menyimpan `passwordHash`, sedangkan request ke endpoint protected mengirim JWT melalui header `Authorization`.

## 3. Register: terima input, validasi, hash, simpan, respons aman

**Tujuan langkah ini:** `POST /auth/register` membuat User dari email dan password yang valid. Respons hanya memuat `id` dan `email`; password dan `passwordHash` tidak dikirim kembali. Kaitkan dengan alur Day 1: route di controller menerima request, `ValidationPipe` memvalidasi DTO, service menjalankan aturan register, lalu Prisma menulis ke PostgreSQL.

```text
POST /auth/register { email, password }
  → ValidationPipe memvalidasi RegisterDto
  → AuthService membuat hash
  → Prisma menyimpan User
  → respons hanya { id, email }
```

### 3a. DTO validasi

Buat `backend/src/auth/dto/register.dto.ts`:

```ts
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;
}
```

**Penjelasan DTO per baris:**

| Kode | Artinya saat request masuk |
| --- | --- |
| `export class RegisterDto` | Class untuk mendefinisikan dan memvalidasi body route register, seperti DTO Task di Day 1. |
| `@IsEmail()` | Nilai email harus berbentuk alamat email. `"asal"` akan ditolak. |
| `@MaxLength(254)` | Batas panjang email untuk latihan ini. |
| `@IsString()` | Password harus berupa string, bukan angka atau object. |
| `@MinLength(8)` / `@MaxLength(72)` | Batas panjang password yang dijelaskan ke peserta. Pemeriksaan **byte UTF-8** tetap dilakukan di service karena 72 karakter tidak selalu sama dengan 72 byte. |
| Tanda `!` pada `email!`/`password!` | Menghindari error inisialisasi properti dari TypeScript. Tanda ini **tidak** memvalidasi nilai pada runtime; validasi dilakukan oleh decorator dan `ValidationPipe`. |

`ValidationPipe` global di `backend/src/main.ts` menjalankan aturan DTO. Konfigurasi `whitelist: true` dan `forbidNonWhitelisted: true` juga menolak field yang tidak didefinisikan dalam DTO. Coba body `{ "email": "bukan-email", "password": "123" }`: server mengembalikan `400` dan `AuthService.register()` tidak dijalankan.

### 3b. Service register

Buat `backend/src/auth/auth.service.ts`:

```ts
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from 'generate/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(body: RegisterDto) {
    const email = body.email.trim().toLowerCase();

    if (Buffer.byteLength(body.password, 'utf8') > 72) {
      throw new BadRequestException('Password maksimal 72 byte UTF-8');
    }

    const passwordHash = await bcrypt.hash(body.password, 10);

    try {
      return await this.prisma.user.create({
        data: { email, passwordHash },
        select: { id: true, email: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email sudah terdaftar');
      }
      throw error;
    }
  }
}
```

**Penjelasan service sesuai urutan eksekusi:**

1. Import `bcrypt` dipakai untuk membuat hash. `Prisma` menyediakan class error database yang dapat diperiksa saat unique constraint gagal.
2. `@Injectable()` menjadikan service dapat di-inject oleh Nest. Constructor meminta `PrismaService` yang sudah ada di proyek.
3. `trim().toLowerCase()` menormalisasi email supaya `User1@Example.com` dan `user1@example.com` menghasilkan nilai tersimpan yang sama. DTO divalidasi **sebelum** service, jadi email dengan spasi di awal/akhir dapat ditolak oleh `@IsEmail()` lebih dulu; `trim()` di sini bersifat defensif. Password sengaja **tidak** di-trim karena spasi dapat menjadi bagian password.
4. `Buffer.byteLength(..., 'utf8')` menegakkan batas 72 byte yang diproses bcrypt. `@MaxLength(72)` menghitung panjang string, sehingga pemeriksaan byte ini tetap diperlukan untuk karakter multibyte.
5. `await bcrypt.hash(..., 10)` menjalankan hash asinkron dengan cost factor 10. Hasil yang disimpan adalah `passwordHash`.
6. `data` berisi nilai yang masuk database. `select` menentukan field respons secara eksplisit: hanya `id` dan `email`.
7. `PrismaClientKnownRequestError` dengan kode `P2002` berarti unique constraint dilanggar, misalnya email sudah ada. Service mengubahnya menjadi `409 Conflict`; error database lain tetap dilempar agar penyebabnya terlihat.

Bedakan tiga nilai pada method ini: `body.password` dipakai sebagai input hashing, `passwordHash` disimpan, dan hasil `select: { id: true, email: true }` menjadi respons HTTP. Pemilihan field dilakukan di query backend, sehingga `passwordHash` tidak masuk ke object respons.

### 3c. Controller, module, dan pemasangan di AppModule

Buat `backend/src/auth/auth.controller.ts`:

```ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
}
```

Buat `backend/src/auth/auth.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
```

Di `backend/src/app.module.ts`, tambahkan import dan satu entry `AuthModule` pada metadata yang sudah ada:

```ts
import { AuthModule } from './auth/auth.module';

// Di dalam @Module({ ... }) yang sudah ada:
imports: [
  PrismaModule,
  ConfigModule.forRoot({ isGlobal: true }),
  AuthModule,
  TasksModule,
],
```

Potongan `imports` di atas **menggantikan array lama**, bukan membuat dekorator `@Module` kedua. Import AppController/AppService dan isi metadata lain tetap seperti file Day 2.

**Hubungan controller dan module:**

| Kode | Fungsi |
| --- | --- |
| `@Controller('auth')` + `@Post('register')` | Menghasilkan alamat `POST /auth/register`. Dua potongan path itu digabung Nest. |
| `@Body() body: RegisterDto` | Mengambil JSON body. `ValidationPipe` membaca dekorator pada DTO sebelum memanggil service. |
| `return this.authService.register(body)` | Controller meneruskan data yang sudah divalidasi ke service dan mengembalikan hasilnya. Aturan hashing dan akses database berada di service. |
| `providers: [AuthService]` | Memberi tahu Nest cara membuat service. |
| `imports: [PrismaModule]` | Membuat `PrismaService` dari module Prisma tersedia bagi `AuthService`. Import `PrismaModule` di AppModule saja tidak otomatis membagikan provider ke semua module. |
| `AuthModule` di `AppModule.imports` | Mengaktifkan route auth di aplikasi utama. |

Tes dari terminal lain:

```bash
curl -i http://localhost:3001/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"user1@example.com","password":"passwordUser1_123"}'
```

**Verifikasi langkah 3:** jalankan tiga request berurutan: register pertama menghasilkan `201` dengan `{ id, email }`; email yang sama menghasilkan `409`; email salah format atau password terlalu pendek menghasilkan `400`. Periksa status dan body setiap respons. Pastikan `password` serta `passwordHash` tidak muncul di respons, lalu lihat bahwa kolom `passwordHash` di database berisi hash. Perbedaan `400` dari validasi DTO dan `409` dari unique constraint perlu jelas sebelum masuk ke login.

## 4. Login: bandingkan password, baru terbitkan JWT

**Tujuan langkah ini:** memeriksa kredensial user yang sudah terdaftar, lalu menerbitkan JWT hanya jika password cocok. Login tidak membuat User baru. Mulai dari alur service yang paling singkat berikut; potongan ini adalah **ilustrasi**, bukan method tambahan yang perlu ditempel ke file:

```ts
const user = await prisma.user.findUnique({ where: { email } });
const cocok = user && await bcrypt.compare(passwordDariForm, user.passwordHash);
if (!cocok) throw new UnauthorizedException('Email atau password salah');
// Setelah lolos baris ini, barulah buat JWT.
```

Baris `bcrypt.compare()` menerima password dari request dan `passwordHash` dari database. `bcrypt.hash()` memakai salt, jadi memanggilnya kembali lalu membandingkan dua string hash tidak memverifikasi password dengan benar.

### 4a. DTO login

Buat `backend/src/auth/dto/login.dto.ts`:

```ts
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
```

Login tidak memakai `@MinLength(8)`: password yang tidak cocok diproses sebagai percobaan login dan mendapat `401` yang sama dengan email tidak dikenal. Email yang formatnya salah atau password yang bukan string tetap mendapat `400` dari DTO. Jadi DTO memvalidasi bentuk request, sedangkan service memverifikasi kredensial.

### 4b. Konfigurasi penandatanganan

Ganti isi `backend/src/auth/auth.module.ts` menjadi:

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.getOrThrow<string>('JWT_SECRET');
        if (secret.length < 32) {
          throw new Error('JWT_SECRET minimal 32 karakter');
        }
        return {
          secret,
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
```

**Penjelasan konfigurasi:**

| Baris | Mengapa ada? |
| --- | --- |
| `JwtModule.registerAsync(...)` | Nest menyiapkan `JwtService` memakai konfigurasi saat aplikasi dinyalakan. |
| `imports: [ConfigModule]` dan `inject: [ConfigService]` | Factory menerima pembaca environment dari Nest. |
| `getOrThrow('JWT_SECRET')` | Aplikasi gagal start jika secret tidak ada; lebih jelas daripada menerbitkan token dengan konfigurasi kosong. |
| `if (secret.length < 32)` | Menolak konfigurasi secret yang terlalu pendek saat startup. Panjang saja tidak menjamin kualitas secret; gunakan nilai acak dari `openssl`. |
| `secret` | Kunci yang dipakai server untuk tanda tangan dan verifikasi token. Tidak dikirim ke frontend. |
| `expiresIn: '1h'` | Token berlaku satu jam. Jika habis, user perlu login lagi pada alur latihan ini. |

Jika `JWT_SECRET` berubah setelah token diterbitkan, token lama tidak lolos `verifyAsync()`: signature token tersebut dibuat dengan secret sebelumnya.

### 4c. Tambahkan login ke service

Pada `backend/src/auth/auth.service.ts`, tambahkan `UnauthorizedException` pada import dari `@nestjs/common`, `JwtService` dari `@nestjs/jwt`, dan `LoginDto` dari `./dto/login.dto`. Ubah constructor menjadi:

```ts
constructor(
  private readonly prisma: PrismaService,
  private readonly jwt: JwtService,
) {}
```

Di bawah method `register`, tambahkan:

```ts
async login(body: LoginDto) {
  const email = body.email.trim().toLowerCase();

  if (Buffer.byteLength(body.password, 'utf8') > 72) {
    throw new UnauthorizedException('Email atau password salah');
  }

  const user = await this.prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
    throw new UnauthorizedException('Email atau password salah');
  }

  const accessToken = await this.jwt.signAsync({ sub: user.id });

  return {
    accessToken,
    user: { id: user.id, email: user.email },
  };
}
```

**Baca method login sesuai urutan eksekusi:**

| Kode | Input → hasil |
| --- | --- |
| `body.email.trim().toLowerCase()` | Email dari form → bentuk yang sama dengan saat register. |
| `Buffer.byteLength(body.password, 'utf8') > 72` | Login juga menolak password yang melewati batas byte bcrypt, dengan respons `401` yang sama. Tanpa ini, bagian password setelah byte ke-72 bisa diabaikan bcrypt. |
| `findUnique({ where: { email } })` | Email → satu User atau `null`. Di sini service boleh membaca `passwordHash` untuk verifikasi. |
| `!user || !(await bcrypt.compare(...))` | Akun tidak ada atau password tidak cocok → `401`. Isi pesan sama untuk dua kondisi itu; ini bukan jaminan semua perbedaan waktu respons hilang. |
| `this.jwt.signAsync({ sub: user.id })` | ID user → JWT yang ditandatangani. `sub` berarti *subject*, yaitu siapa pemilik token. |
| `return { accessToken, user: { id, email } }` | Respons berisi JWT untuk request berikutnya dan data user publik. `passwordHash` tidak ikut keluar. |

Password tetap diminta **setiap kali user melakukan login**. Sesudah login berhasil, frontend mengirim `accessToken` pada request ke endpoint protected; guard memverifikasi token itu setiap kali request masuk.

### 4d. Tambahkan endpoint login

Pada `backend/src/auth/auth.controller.ts`, tambahkan `HttpCode` dan `HttpStatus` pada import `@nestjs/common`, dan import `LoginDto`. Di bawah `register`, tambahkan:

```ts
@HttpCode(HttpStatus.OK)
@Post('login')
login(@Body() body: LoginDto) {
  return this.authService.login(body);
}
```

`@Post()` Nest secara default mengembalikan `201`. `@HttpCode(HttpStatus.OK)` menjadikan login `200` sesuai kontrak kita: login tidak membuat record baru. Controller ini tetap hanya meneruskan body ke `AuthService.login()`; pengecekan password tetap di service.

```bash
curl -i http://localhost:3001/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user1@example.com","password":"passwordUser1_123"}'
```

**Verifikasi langkah 4:** login dengan password benar menghasilkan `200` dan `accessToken`; password salah menghasilkan `401`. JWT memiliki tiga bagian, `header.payload.signature`. Payload dapat dibaca tanpa secret, sehingga hasil decode saja tidak membuktikan token valid; validitasnya diperiksa dengan `verifyAsync()` pada langkah berikutnya. Hindari mencetak token atau password ke log dan slide publik.

## 5. Guard: verifikasi token dan buat endpoint `/auth/me`

**Tujuan langkah ini:** lindungi `GET /auth/me` dengan `JwtAuthGuard` sebelum memasang guard pada CRUD Task. Endpoint ini memudahkan peserta menguji tiga kondisi: header tidak ada, JWT tidak valid, dan JWT valid.

Saat live coding, bangun guard secara bertahap: **(1) baca header → (2) verifikasi JWT → (3) validasi `sub` dan cari User → (4) isi `request.user`**. Setelah tiap tahap, jelaskan nilai yang masuk, pemeriksaan yang dilakukan, dan kapan `401` dikembalikan. Kode berikut menunjukkan hasil akhir tahap ini.

Buat `backend/src/auth/auth.types.ts`:

```ts
import type { Request } from 'express';

export type AuthenticatedRequest = Request & {
  user: { id: number };
};
```

`Request` adalah tipe request HTTP dari Express yang dipakai proyek ini. Interseksi tipe `& { user: { id: number } }` menyatakan bahwa controller protected menerima request dengan ID user. Deklarasi tipe hanya diperiksa oleh TypeScript; `request.user` pada runtime tetap harus diisi oleh guard.

Buat `backend/src/auth/jwt-auth.guard.ts`:

```ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedRequest } from './auth.types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const [scheme, token, extra] =
      request.headers.authorization?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token || extra) {
      throw new UnauthorizedException('Token diperlukan');
    }

    let payload: { sub?: unknown };
    try {
      payload = await this.jwt.verifyAsync<{ sub?: unknown }>(token);
    } catch {
      throw new UnauthorizedException('Token tidak valid atau kedaluwarsa');
    }

    if (typeof payload.sub !== 'number' || !Number.isInteger(payload.sub) || payload.sub <= 0) {
      throw new UnauthorizedException('Isi token tidak valid');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true },
    });
    if (!user) throw new UnauthorizedException('User tidak ditemukan');

    request.user = { id: user.id };
    return true;
  }
}
```

**Penjelasan guard sesuai urutan eksekusi:**

| Kode | Apa yang masuk? | Keputusan / hasil |
| --- | --- | --- |
| `implements CanActivate` | Nest memanggil `canActivate` sebelum handler route. | Method harus mengembalikan `true` atau melempar exception. |
| `context.switchToHttp().getRequest()` | Request HTTP saat ini. | Guard bisa membaca header dan, setelah aman, menambah `request.user`. |
| `authorization?.split(' ') ?? []` | Contoh: `Bearer abc.def.ghi`. | Dipecah menjadi skema, token, dan kemungkinan bagian tambahan. `?.` aman jika header tidak ada. |
| `scheme !== 'Bearer' || !token || extra` | Format header. | Salah format → `401`. Ini baru memeriksa **bentuk**, belum keaslian token. |
| `jwt.verifyAsync(token)` | Teks JWT dari header. | Memeriksa tanda tangan dan masa berlaku dengan secret server. `decode` saja tidak melakukan ini. |
| `typeof payload.sub ...` | Klaim `sub` dari token yang sudah diverifikasi. | Hanya integer positif diterima sebagai ID. Tipe TypeScript tidak memvalidasi isi jaringan saat runtime. |
| `prisma.user.findUnique(...)` | ID dari klaim `sub`. | Akun yang sudah tidak ada ditolak `401`. `select: { id: true }` cukup untuk guard. |
| `request.user = { id: user.id }` | User yang ditemukan server. | Controller dapat memakai ID hasil verifikasi ini. `userId` dari body atau query browser tidak dipakai untuk menentukan pemilik Task. |
| `return true` | Semua pemeriksaan lolos. | Nest melanjutkan request ke controller. Jika ada exception sebelumnya, controller tidak berjalan. |

Jika angka `sub` pada payload JWT diubah tanpa menandatangani ulang token dengan secret server, `verifyAsync()` menolaknya sebelum query User dijalankan. Pemeriksaan tipe dan nilai `sub` baru berlaku setelah signature dan masa berlaku token lolos.

Di `backend/src/auth/auth.module.ts`, tambahkan import `JwtAuthGuard`, lalu ubah bagian provider/export menjadi:

```ts
providers: [AuthService, JwtAuthGuard],
exports: [JwtAuthGuard, JwtModule],
```

`JwtAuthGuard` memerlukan `JwtService` dan `PrismaService`. `AuthModule` sudah mengimpor kedua module penyedianya. Kita mengekspor **guard dan `JwtModule` yang sudah dikonfigurasi** agar saat guard dipakai pada controller di `TasksModule`, Nest juga dapat menyediakan `JwtService` dalam konteks module itu. Tanpa ekspor `JwtModule`, aplikasi dapat gagal start dengan pesan `Nest can't resolve dependencies of the JwtAuthGuard` saat guard ditempel ke `TasksController`. Setelah mengubah metadata module, restart Nest dan lihat apakah dependency guard berhasil dibuat.

Di `backend/src/auth/auth.controller.ts`, tambahkan `Get`, `Req`, `UseGuards` ke import Nest, dan import `JwtAuthGuard` serta tipe `AuthenticatedRequest` dengan sintaks berikut:

```ts
import { JwtAuthGuard } from './jwt-auth.guard';
import type { AuthenticatedRequest } from './auth.types';
```

`import type` diperlukan untuk tipe parameter yang memakai decorator `@Req()` pada konfigurasi TypeScript proyek ini. Tambahkan method berikut:

```ts
@UseGuards(JwtAuthGuard)
@Get('me')
async me(@Req() request: AuthenticatedRequest) {
  return this.authService.findPublicUser(request.user.id);
}
```

Untuk request `GET /auth/me`, Nest menjalankan `@UseGuards(JwtAuthGuard)` sebelum method controller. Jika guard mengembalikan `true`, `@Req()` memberi controller request yang telah berisi `user.id`, lalu service mengambil data publik User tersebut. Jika token tidak ada atau tidak valid, `findPublicUser()` tidak dijalankan.

Di `AuthService`, tambahkan:

```ts
async findPublicUser(id: number) {
  const user = await this.prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true },
  });
  if (!user) throw new UnauthorizedException('User tidak ditemukan');
  return user;
}
```

Guard membaca ID untuk memastikan akun masih ada. `/auth/me` melakukan query lagi untuk mengambil email yang akan ditampilkan, dengan `select: { id: true, email: true }`. Dua query ini membuat peran guard dan respons profil terpisah dan eksplisit. Mengembalikan record User lengkap akan ikut mengirim `passwordHash`.

Tes tanpa token, lalu dengan token yang disalin dari respons login:

```bash
curl -i http://localhost:3001/auth/me

TOKEN_USER_1='tempel-accessToken-user1-di-sini'
curl -i http://localhost:3001/auth/me \
  -H "Authorization: Bearer $TOKEN_USER_1"
```

**Verifikasi langkah 5:** tanpa token, respons `401` berasal dari pemeriksaan header; dengan token valid, respons `200` berisi `{ id, email }`; dengan token yang satu karakternya diubah, respons `401` berasal dari `verifyAsync()`. Pada tahap ini guard baru dipasang pada `/auth/me`; route Task belum protected dan akan diubah pada langkah 6.

## 6. Task milik user: lindungi semua route dan batasi semua query

**Tujuan langkah ini:** setelah JWT valid, backend tetap harus membatasi akses Task berdasarkan `userId`. `JwtAuthGuard` mengidentifikasi user dari token dan mengisi `request.user`; `TasksService` memakai ID tersebut dalam query Prisma. Tanpa filter ini, user yang sudah login dapat mengakses Task user lain.

Gunakan contoh data berikut untuk menjelaskan filter query. Angka `1` dan `2` hanya contoh; ID aktual bergantung pada isi database latihan.

```text
User pertama memiliki id 1; user kedua memiliki id 2.
Task 12 tersimpan dengan userId 1.

Request user pertama: { id: 12, userId: 1 } → task ditemukan.
Request user kedua:   { id: 12, userId: 2 } → task tidak ditemukan → 404.
```

ID Task pada URL dapat diketahui user lain. Karena itu GET detail, PATCH, dan DELETE harus memakai `id` **dan** `userId` dari `request.user`. Untuk daftar, `findMany()` juga memerlukan `where: { userId }`. Menambahkan guard saja hanya memverifikasi token; query tanpa filter masih dapat mengembalikan Task milik user lain.

### 6a. Hubungkan model Task ke User

**Sebelum migrasi, cek data latihan yang sedang dipakai.** Dari terminal lain, saat backend masih hidup:

```bash
curl -s http://localhost:3001/tasks
```

Jalur utama workshop memakai tabel Task kosong, sehingga responsnya `[]`. Jika ada Task lama, kolom `userId` yang wajib tidak dapat ditambahkan sebelum setiap baris mempunyai pemilik. Untuk database lokal latihan, pilih reset seperti langkah 0 dan daftarkan ulang user; jika datanya perlu dipertahankan, tambahkan `userId` sebagai nullable, isi pemilik tiap Task (backfill), lalu ubah menjadi wajib. Seed lama proyek membuat tiga Task tanpa `userId`, sehingga jangan jalankan seed tersebut sebelum diperbarui.

Setelah memastikan tabel Task kosong, hentikan proses `pnpm start:dev` sebentar. Schema, Prisma Client, dan service Task harus diubah sebagai satu kelompok sebelum backend dapat berjalan lagi. Di `backend/prisma/schema.prisma`, tambahkan `tasks Task[]` pada model `User` yang dibuat di langkah 1, lalu tambahkan tiga baris terkait pemilik pada model `Task` yang sudah ada:

```prisma
model User {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  passwordHash String
  tasks        Task[]
  createdAt    DateTime @default(now())
}

model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId      Int
  user        User     @relation(fields: [userId], references: [id])

  @@index([userId])
}
```

**Bedah relasi baris demi baris:**

| Kode | Penjelasan untuk peserta |
| --- | --- |
| `tasks Task[]` di `User` | Satu User dapat memiliki banyak Task. Field ini adalah sisi relasi pada model `User`. |
| `userId Int` di `Task` | Foreign key pemilik yang tersimpan di tabel Task dan wajib berisi nilai. |
| `user User @relation(fields: [userId], references: [id])` | Relasi Prisma yang menghubungkan `Task.userId` dengan `User.id`. |
| `@@index([userId])` | Indeks membantu query daftar task yang berulang kali memakai filter pemilik. |

Saat membuat Task, backend mengambil `userId` dari `request.user.id` yang diisi guard. Body dari browser tidak menentukan pemilik Task.

Jika cek tadi menunjukkan `[]`, dari `backend/` jalankan:

```bash
pnpm exec prisma validate
pnpm exec prisma migrate dev --name add_task_owners
pnpm exec prisma generate
```

`validate` memeriksa schema, `migrate dev` menerapkan perubahan tabel dan relasi, sedangkan `generate` memperbarui tipe Prisma Client. Jika ternyata masih ada Task tanpa pemilik, selesaikan reset atau backfill sebelum menjalankan migrasi wajib. Reset juga menghapus akun uji sehingga register dan login harus diulang. Setelah `generate`, `TasksService` lama belum memenuhi relasi wajib; selesaikan 6b–6c sebelum menjalankan Nest kembali.

### 6b. Hubungkan module dan controller

Ganti isi `backend/src/tasks/tasks.module.ts` menjadi:

```ts
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
```

`TasksModule` mengimpor `AuthModule` agar `JwtAuthGuard` dan `JwtModule` yang diekspor module tersebut tersedia untuk controller Task. `JwtModule` diperlukan oleh `JwtService` di guard. `PrismaModule` tetap diimpor untuk `PrismaService` yang dipakai `TasksService` dan guard.

Ubah controller secara bertahap. Pertama, letakkan `@UseGuards(JwtAuthGuard)` pada class; setelah backend dijalankan kembali, request tanpa token pada route Task akan menghasilkan `401`. Kedua, tambahkan `@Req() request` pada `create` dan `findAll`, lalu kirim `request.user.id` ke service. Terapkan pola yang sama pada detail, PATCH, dan DELETE. Acuan akhir `backend/src/tasks/tasks.controller.ts` adalah:

```ts
import {
  Body, Controller, Delete, Get, Param, ParseIntPipe,
  Patch, Post, Req, UseGuards,
} from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Req() request: AuthenticatedRequest, @Body() body: CreateTaskDto) {
    return this.tasksService.create(request.user.id, body);
  }

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.tasksService.findAll(request.user.id);
  }

  @Get(':id')
  findOne(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tasksService.findOne(request.user.id, id);
  }

  @Patch(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTaskDto,
  ) {
    return this.tasksService.update(request.user.id, id, body);
  }

  @Delete(':id')
  remove(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tasksService.remove(request.user.id, id);
  }
}
```

**Baca controller dari atas ke bawah:**

| Kode | Akibatnya |
| --- | --- |
| `@UseGuards(JwtAuthGuard)` di atas class | **Semua** route Task diperiksa. Jika diletakkan hanya pada `findAll`, route PATCH/DELETE masih terbuka. |
| `@Controller('tasks')` | URL tetap `/tasks`, jadi frontend Day 2 tidak perlu mengganti path. |
| `@Req() request: AuthenticatedRequest` | Method membaca `request.user.id` setelah guard berhasil memverifikasi JWT dan mengisi `request.user`. |
| `@Body() body: CreateTaskDto` atau `UpdateTaskDto` | Aturan input Day 1 tetap digunakan. Browser **tidak** mengirim `userId` pada body. |
| `@Param('id', ParseIntPipe)` | ID URL diubah menjadi number; teks seperti `/tasks/abc` ditolak. |
| `this.tasksService...(request.user.id, ...)` | Service selalu menerima ID pemanggil yang berasal dari guard. |

Pada tahap ini guard sudah aktif, tetapi pembatasan kepemilikan belum lengkap sampai query di service juga menerima dan memakai `userId`.

### 6c. Filter setiap operasi di service

Kerjakan service dalam tiga tahap: `create` dan `findAll` lebih dulu agar terlihat bagaimana Task mendapat pemilik dan daftar difilter; lanjutkan `findOne` dengan filter `id` serta `userId`; terakhir ubah `update` dan `remove` agar operasi tulis memakai kedua nilai itu. Di setiap method, tunjukkan asal `userId` dari controller dan tempat nilai tersebut masuk ke query Prisma. Jalankan kembali backend setelah semua method selesai, karena schema sudah mewajibkan relasi baru.

Ganti isi `backend/src/tasks/tasks.service.ts` menjadi:

```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generate/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: number, body: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        userId,
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.task.findMany({ where: { userId } });
  }

  async findOne(userId: number, id: number) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });
    if (!task) throw new NotFoundException('Task tidak ditemukan');
    return task;
  }

  async update(userId: number, id: number, body: UpdateTaskDto) {
    try {
      return await this.prisma.task.update({
        where: { id, userId },
        data: {
          title: body.title,
          description: body.description,
          completed: body.completed,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Task tidak ditemukan');
      }
      throw error;
    }
  }

  async remove(userId: number, id: number) {
    try {
      return await this.prisma.task.delete({
        where: { id, userId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Task tidak ditemukan');
      }
      throw error;
    }
  }
}
```

**Jelaskan perubahan setiap method dari Day 1:**

| Method | Baris penting | Efeknya |
| --- | --- | --- |
| `create` | `userId` di `data` | Task baru tersimpan dengan ID user dari JWT yang telah diverifikasi. Form tidak mengirim ID pemilik. |
| `findAll` | `where: { userId }` | Prisma hanya mengambil Task milik user pada request. Tanpa filter ini, daftar memuat Task semua user. |
| `findOne` | `where: { id, userId }` | ID Task dan ID pemilik harus cocok. Jika tidak ada baris yang cocok, service mengembalikan `404`. |
| `update` | `where: { id, userId }` lalu `data` | Hanya Task dengan ID dan pemilik yang sesuai dapat diubah. `data` tidak memuat `userId`, sehingga PATCH tidak memindahkan kepemilikan. |
| `remove` | `where: { id, userId }` | DELETE hanya menghapus Task milik user yang sedang login. |
| `catch P2025` | `NotFoundException` | Prisma mengeluarkan `P2025` ketika baris untuk update/delete tidak ditemukan; service mengubahnya menjadi respons `404`. Error lain tetap dilempar. |

**Contoh query untuk dijelaskan:** Jika Task ID `12` tersimpan dengan `userId: 1`, request dari user ID `2` menghasilkan filter `{ id: 12, userId: 2 }`. `findFirst` mengembalikan `null`, lalu service melempar `NotFoundException`. Pada `update` dan `remove`, Prisma menghasilkan `P2025` untuk filter yang tidak menemukan baris, lalu service mengembalikan `404`. Frontend mungkin menyembunyikan Task tersebut, tetapi pembatasan akses tetap harus berada pada query backend karena HTTP request dapat dikirim tanpa UI.

Pada Prisma 7 yang dipakai repo ini, `id` adalah field unik dan `userId` boleh ditambahkan sebagai filter pada `update`/`delete`. Filter berada dalam **query tulis yang sama**, jadi kita tidak hanya mengecek kepemilikan lalu melakukan update terpisah. Ini penting ketika banyak request datang bersamaan.

DTO Task lama tetap dipakai. `userId` yang dikirim dalam body ditolak oleh `ValidationPipe` karena `forbidNonWhitelisted` aktif. Satu batas DTO lama yang perlu diketahui: `UpdateTaskDto.title` memakai `@IsOptional()`, sehingga `title: null` dapat lolos DTO tetapi gagal di Prisma karena kolom `title` wajib. Kasus ini dapat dibahas sebagai validasi lanjutan setelah alur auth selesai.

### 6d. Bereskan seed Day 2 yang tidak cocok dengan schema baru

**Langkah ini diperlukan untuk checkout saat ini.** `backend/prisma/seed.ts` lama memakai `createMany` untuk tiga Task tanpa `userId`. Setelah `prisma generate`, data tersebut tidak lagi sesuai tipe Prisma Client dan `pnpm run build` gagal, meskipun seed tidak dijalankan.

Karena akun uji dibuat melalui endpoint register, **ganti sementara seluruh isi** `backend/prisma/seed.ts` dengan:

```ts
console.info('Seed Day 3 belum dipakai; buat akun lewat /auth/register.');
export {};
```

`console.info` menunjukkan bahwa seed Day 3 belum menyediakan data. `export {}` membuat file menjadi module TypeScript yang valid. Stub ini tidak menulis atau menghapus data. Lampiran A memuat contoh seed dengan `userId` jika nanti diperlukan.

Sekarang jalankan lagi `pnpm start:dev` dari `backend/`. Periksa bahwa Nest berhasil start tanpa error TypeScript atau dependency injection sebelum mencoba endpoint. Untuk memastikan seluruh file backend ikut diperiksa, jalankan `pnpm run build` dari `backend/` setelah backend sudah bisa start.

**Buat akun uji kedua melalui API** agar filter `userId` dapat diverifikasi sebelum masuk ke frontend. Akun `user1@example.com` dibuat pada langkah 3. Jika database sempat direset, register dan login lagi untuk memperoleh `TOKEN_USER_1` baru. Register `user2@example.com` lalu login dengan perintah berikut. Salin `accessToken` dari respons login ke variabel `TOKEN_USER_2`:

```bash
curl -i http://localhost:3001/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"user2@example.com","password":"passwordUser2_123"}'

curl -i http://localhost:3001/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user2@example.com","password":"passwordUser2_123"}'

TOKEN_USER_2='tempel-accessToken-user2-di-sini'
```

Jalankan tiga request berikut secara berurutan. `TOKEN_USER_1` berasal dari login `user1@example.com` pada langkah 5; setelah reset database, token lama harus diganti dengan hasil login baru.

```bash
curl -i http://localhost:3001/tasks

curl -i http://localhost:3001/tasks \
  -H "Authorization: Bearer $TOKEN_USER_1" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Task milik user pertama"}'

curl -i http://localhost:3001/tasks \
  -H "Authorization: Bearer $TOKEN_USER_2"
```

**Checkpoint 6:** `GET /tasks` tanpa token menghasilkan `401`. POST dengan `TOKEN_USER_1` membuat Task dengan `userId` milik `user1@example.com`. GET dengan `TOKEN_USER_2` menghasilkan daftar yang tidak memuat Task tersebut. Verifikasi ini memastikan guard dan filter query sudah bekerja sebelum frontend dibuat. Langkah 10 memuat skenario `curl` lengkap, termasuk akses detail, PATCH, dan DELETE lintas user.

## 7. Frontend tahap pertama: form register tanpa state login

**Tujuan langkah ini:** buat form register untuk memanggil endpoint yang sudah diuji dengan `curl`. Alurnya memakai konsep Day 2: nilai input disimpan di React state, `onChange` memperbaruinya, `onSubmit` mengirim request, lalu UI menampilkan respons. Register belum menghasilkan token; validasi dan penyimpanan user tetap dilakukan backend.

### 7a. API auth publik

Buat `frontend/src/features/auth/api/auth.api.ts`:

```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type PublicUser = { id: number; email: string };
export type Credentials = { email: string; password: string };

async function errorMessage(response: Response): Promise<string> {
  const data: unknown = await response.json().catch(() => null);

  if (data && typeof data === "object" && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string") return message;
    if (Array.isArray(message)) return message.join(", ");
  }

  return `Request gagal (${response.status})`;
}

export async function register(input: Credentials): Promise<PublicUser> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) throw new Error(await errorMessage(response));
  return response.json();
}
```

**Baca satu fungsi dari input sampai output:**

| Kode | Cara menjelaskan |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Alamat backend yang boleh diketahui browser. Fallback `localhost:3001` hanya memudahkan latihan lokal; file `.env` Day 2 tetap sumber konfigurasi utama. Jangan taruh `JWT_SECRET` di sini. |
| `Credentials` | Tipe input untuk email dan password. TypeScript membantu saat menulis frontend; validasi request tetap dilakukan DTO backend. |
| `fetch(.../auth/register, { method: 'POST' })` | Browser memanggil endpoint register yang sudah diuji dengan `curl`. Tidak ada header token karena user belum login. |
| `Content-Type` + `JSON.stringify(input)` | Mengirim body sebagai JSON agar Nest dapat membaca `email` dan `password`. |
| `response.ok` | `true` untuk status `2xx`; `400` dan `409` masuk jalur error. `fetch` sendiri tidak melempar hanya karena server membalas `400`. |
| `errorMessage(response)` | Nest kadang mengirim `message` berupa string, kadang array kesalahan DTO. Helper mengubahnya menjadi satu teks untuk ditampilkan. |
| `response.json()` | JSON sukses diubah menjadi object JavaScript. `Promise<PublicUser>` membantu tipe di editor, tetapi tidak memvalidasi isi respons saat runtime. |

Saat menguji form nanti, buka Network tab untuk melihat URL `/auth/register`, request body, status HTTP, dan response body.

### 7b. Halaman register

**Urutan implementasi halaman register:**

1. Buat route `frontend/src/app/register/page.tsx` yang hanya menampilkan judul. Jalankan Next dan buka `/register` untuk membuktikan bahwa nama folder menjadi URL.

   ```tsx
   export default function RegisterPage() {
     return <main className="p-6"><h1>Register</h1></main>;
   }
   ```

2. Tambahkan `"use client"` dan dua `useState` untuk email/password. Hubungkan tiap input dengan `value` dan `onChange`. Untuk mengamati perubahan React state sebelum mengirim request, tampilkan teks sementara `<p>Email: {email}</p>`; jangan tampilkan nilai password. Hapus teks sementara setelah alurnya terlihat.
3. Baru tambahkan `handleSubmit`: `preventDefault` → `await register({ email, password })` → sukses/error. Uji satu register di Network tab.
4. Terakhir tambahkan `submitting`, tampilan `created`, label, validasi HTML, dan tautan login. Bandingkan hasil peserta dengan acuan akhir di bawah.

**Acuan akhir** `frontend/src/app/register/page.tsx` setelah empat putaran:

```tsx
"use client";

import Link from "next/link";
import { useState, type SubmitEvent } from "react";
import { register } from "@/features/auth/api/auth.api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register({ email, password });
      setCreated(true);
      setPassword("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Register gagal");
    } finally {
      setSubmitting(false);
    }
  }

  if (created) {
    return (
      <main className="mx-auto max-w-md p-6">
        <h1 className="text-2xl font-bold">Akun berhasil dibuat</h1>
        <p className="mt-2">Sekarang login dengan email dan password tadi.</p>
        <Link className="mt-4 inline-block text-blue-600" href="/login">
          Ke halaman login
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Register</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </label>
        <label className="block">
          <span>Password</span>
          <input
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </label>
        {error && <p role="alert" className="text-red-600">{error}</p>}
        <button type="submit" disabled={submitting} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
          {submitting ? "Menyimpan..." : "Buat akun"}
        </button>
      </form>
      <Link className="mt-4 inline-block text-blue-600" href="/login">
        Sudah punya akun? Login
      </Link>
    </main>
  );
}
```

**Jelaskan halaman register dalam tiga bagian:**

1. **React state untuk input.** `useState("")` menyediakan nilai awal dan setter untuk `email` serta `password`. `value={email}` menampilkan nilai state pada input. Saat user mengetik, `onChange` mengambil `event.target.value`, `setEmail` memperbarui state, dan React melakukan render ulang dengan nilai terbaru. `error`, `submitting`, dan `created` menyimpan status UI form.
2. **Submit.** `onSubmit={handleSubmit}` memanggil handler. `event.preventDefault()` mencegah reload biasa. `setSubmitting(true)` menonaktifkan tombol; `await register({ email, password })` menunggu server. Jika sukses, `setCreated(true)` mengganti form dengan pesan sukses dan password dikosongkan. Jika gagal, `catch` menampilkan pesan. `finally` melepas status proses dalam kedua keadaan.
3. **JSX.** `"use client"` diperlukan karena ada state dan event di browser. `<label>` menghubungkan teks dengan input; `type="password"` menyamarkan tampilan saat mengetik, **bukan** mengenkripsi password. `required`, `minLength`, dan `maxLength` membantu pengguna sebelum request, tetapi DTO backend tetap memutuskan valid/tidak. `role="alert"` membantu pesan error diumumkan oleh teknologi bantu.

**Checkpoint 7:** buka `http://localhost:3000/register` dan daftarkan `user3@example.com` (`user1@example.com` dan `user2@example.com` sudah dibuat melalui `curl`). Buka lagi `/register` dan kirim email yang sama untuk melihat respons `409` beserta pesan error. Halaman dibuka ulang karena setelah register berhasil form diganti dengan tampilan sukses. Di Network tab, periksa `POST /auth/register` dan respons `201` yang hanya berisi `id` serta `email`, tanpa `passwordHash`. Register belum membuat user login karena belum ada token yang diterima atau disimpan frontend.

Tautan `/login` baru berfungsi setelah halaman login dibuat pada langkah 8. Sebelum itu, Next.js mengembalikan `404` untuk route yang belum tersedia.

## 8. Frontend tahap kedua: login dan simpan access token

**Tujuan langkah ini:** setelah kredensial diverifikasi backend, frontend menerima access token dan menyimpannya untuk request protected berikutnya. Pada latihan ini, token disimpan dalam cookie browser supaya Proxy Next.js pada langkah 9f dapat membaca keberadaannya ketika `/tasks` diminta. Cookie ini berlaku untuk host frontend dan path `/`, terbaca di tab lain pada browser yang sama, dan biasanya hilang ketika sesi browser berakhir. Cookie ini bukan sesi server dan bukan bukti token valid.

### 8a. Tambahkan request login ke API auth

Di `frontend/src/features/auth/api/auth.api.ts`, tambahkan tipe ini setelah `PublicUser` dan `Credentials`:

```ts
export type LoginResult = { accessToken: string; user: PublicUser };
```

Lalu **tambahkan** fungsi berikut di bawah `register`; jangan membuat file API kedua:

```ts
export async function login(input: Credentials): Promise<LoginResult> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) throw new Error(await errorMessage(response));
  return response.json();
}
```

**Perbedaan dari register:** request body masih berisi email dan password, tetapi URL-nya `/auth/login`. Respons sukses berisi `accessToken` serta data publik `user`. Respons `401` diproses oleh `errorMessage`. Browser hanya mengirim kredensial; pembandingan password dilakukan oleh `bcrypt.compare` di `AuthService` backend.

### 8b. Simpan token dan buat halaman login

Buat `frontend/src/features/auth/session.ts`:

```ts
export const TOKEN_KEY = "workshop_access_token";

export function saveToken(token: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${TOKEN_KEY}=${token}; Path=/; SameSite=Lax${secure}`;
}

export function getToken(): string | null {
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${TOKEN_KEY}=`));
  return cookie?.slice(TOKEN_KEY.length + 1) ?? null;
}

export function clearToken() {
  document.cookie = `${TOKEN_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
}
```

**Baca perlahan dari atas ke bawah:**

| Kode | Yang terjadi |
| --- | --- |
| `TOKEN_KEY` | Nama cookie. Diekspor agar `proxy.ts` membaca nama yang sama; nilainya bukan JWT secret. |
| `window.location.protocol === "https:"` | Saat situs memakai HTTPS, tambahkan atribut `Secure`. Pada `http://localhost`, atribut itu tidak dipasang agar latihan lokal tetap berjalan. |
| `document.cookie = ...` pada `saveToken` | Browser menyimpan JWT dari respons login sebagai cookie sesi. `Path=/` membuatnya tersedia saat membuka `/tasks`; `SameSite=Lax` membatasi pengiriman dalam konteks lintas situs. |
| `document.cookie.split("; ")` | Browser memberi daftar cookie sebagai string. Kode memisahkannya menjadi item. |
| `.find(...)` | Cari item yang namanya tepat `workshop_access_token`. Cookie lain tidak dipakai. |
| `.slice(...) ?? null` | Ambil nilai setelah `nama=`. Jika cookie tidak ada, kembalikan `null`. |
| `Max-Age=0` pada `clearToken` | Hapus cookie yang sama saat logout atau saat backend mengembalikan `401`. |

Fungsi ini dijalankan di browser dari handler atau effect, bukan saat Server Component dirender. Proxy nanti membaca cookie dari **request** memakai `request.cookies`, bukan memanggil `getToken()`. JWT berbentuk karakter yang aman untuk nilai cookie; browser masih dapat membacanya karena cookie dibuat dengan JavaScript.

**Urutan implementasi halaman login:** mulai dari form register. Ubah judul menjadi Login, gunakan `autoComplete="current-password"`, lalu pertahankan pola `useState` untuk `email`, `password`, `error`, dan `submitting`. Pada submit, fokus dulu pada tiga baris berikut:

```ts
const result = await login({ email, password });
saveToken(result.accessToken);
router.replace("/tasks");
```

`login(...)` menunggu respons backend. Jika sukses, `saveToken(...)` menyimpan access token dan `router.replace(...)` membuka halaman Task. Jika backend menolak kredensial, eksekusi masuk `catch`, sehingga token tidak disimpan oleh submit ini. Setelah alur tersebut berjalan, tambahkan penanganan error dan status tombol. **Acuan akhir** `frontend/src/app/login/page.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { login } from "@/features/auth/api/auth.api";
import { saveToken } from "@/features/auth/session";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await login({ email, password });
      saveToken(result.accessToken);
      router.replace("/tasks");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Login gagal");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </label>
        <label className="block">
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </label>
        {error && <p role="alert" className="text-red-600">{error}</p>}
        <button type="submit" disabled={submitting} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
          {submitting ? "Memeriksa..." : "Login"}
        </button>
      </form>
      <Link className="mt-4 inline-block text-blue-600" href="/register">
        Belum punya akun? Register
      </Link>
    </main>
  );
}
```

**Alur submit:** `onSubmit` memanggil `handleSubmit`, lalu `event.preventDefault()` mencegah reload form. `setSubmitting(true)` menonaktifkan tombol selama request. `await login({ email, password })` menunggu respons backend; hanya pada jalur sukses `saveToken(result.accessToken)` dijalankan, kemudian `router.replace("/tasks")` melakukan navigasi tanpa menambahkan halaman login ke riwayat. Pada App Router, `useRouter` berasal dari `next/navigation`. Jika login gagal, `catch` menyimpan pesan error dalam React state. `finally` mengembalikan `submitting` menjadi `false`.

**Bedakan React state dan cookie browser:** `password` serta `submitting` adalah React state milik komponen login. Nilainya hilang ketika komponen tidak lagi dirender. Cookie token tetap tersedia setelah navigasi atau refresh dan dibagikan antar-tab pada origin frontend yang sama.

**Checkpoint 8:** jika pernah memakai versi Day 3 sebelumnya, hapus token lama dari Session Storage dan lakukan login ulang; kode baru membaca cookie. Sebelum menguji password salah, logout atau hapus cookie `workshop_access_token` di DevTools agar token lama tidak memengaruhi hasil. Password salah menampilkan error dan tidak membuat cookie baru. Password benar menghasilkan cookie `workshop_access_token` pada host frontend. Hindari menyalin access token yang aktif ke chat, screenshot publik, atau repository.

Pada titik ini login sudah berhasil, tetapi request `/tasks` belum menyertakan header `Authorization` sampai langkah 9. Karena itu, setelah `router.replace("/tasks")`, request Task masih dapat menghasilkan `401`. Respons tersebut berasal dari request Task tanpa token, bukan dari request login.

> **Catatan keamanan:** cookie pada latihan ini dapat dibaca JavaScript, sehingga XSS juga dapat mencuri token. Proxy hanya memeriksa keberadaan cookie, bukan signature JWT. Backend tetap memverifikasi JWT pada setiap request. Untuk aplikasi produksi, pertimbangkan sesi yang dibuat server dengan cookie `HttpOnly` serta kebijakan CSRF dan revokasi yang sesuai.

## 9. Frontend tahap ketiga: kirim access token pada request protected

**Tujuan langkah ini:** setiap request ke endpoint protected membawa header `Authorization: Bearer <accessToken>`. Buat satu fungsi `authFetch` untuk membaca token dan menambahkan header tersebut. Fungsi CRUD Task dari Day 2 tetap bernama `getTasks`, `createTask`, `updateTask`, dan `deleteTask`.

```text
TaskForm / TasksPage
  → tasks.api.ts memilih GET/POST/PATCH/DELETE
  → authFetch mengambil token dan memasang header
  → JwtAuthGuard memverifikasi token
  → TasksService memfilter userId
```

Urutan implementasinya: selesaikan `authFetch`, pakai untuk `/auth/me`, pindahkan fungsi API Task ke helper yang sama, lalu sesuaikan halaman Task.

### 9a. Helper request protected

Buat `frontend/src/features/auth/api/auth-fetch.ts`:

```ts
import { clearToken, getToken } from "../session";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function authFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getToken();
  if (!token) {
    window.location.replace("/login");
    throw new Error("Silakan login terlebih dahulu");
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearToken();
    window.location.replace("/login");
    throw new Error("Sesi berakhir. Silakan login kembali");
  }

  return response;
}
```

**Bedah helper per kelompok baris:**

| Kode | Penjelasan |
| --- | --- |
| `authFetch(path, options = {})` | `path` adalah `/tasks` atau `/auth/me`; `options` berisi method, body, dan header tambahan jika diperlukan. Nilai baliknya tetap `Response` seperti `fetch`. |
| `const token = getToken()` | Token dibaca **setiap kali request dibuat**. Jika dibaca sekali saat file pertama di-import, login baru mungkin tidak terbaca. |
| `if (!token) { ... }` | Browser diarahkan ke `/login` dan request protected tidak dikirim. Redirect ini mengatur navigasi; pembatasan akses tetap dilakukan guard backend. |
| `new Headers(options.headers)` | Header dari pemanggil, misalnya `Content-Type: application/json`, tidak hilang. |
| `headers.set('Authorization', ...)` | Menambahkan header dengan skema `Bearer` yang dibaca `JwtAuthGuard`. |
| `fetch(\`${API_URL}${path}\`, { ...options, headers })` | Opsi GET/POST/PATCH/DELETE tetap dipakai; `headers` yang baru mengganti header lama setelah `...options`. |
| `response.status === 401` | Token salah/kedaluwarsa → hapus token lokal dan arahkan ke login. Status lain tetap dikembalikan kepada pemanggil. |

Helper dipakai dari event handler atau effect pada Client Component, sehingga `window.location.replace` tersedia. Saat backend mengembalikan `401`, helper menghapus token dan memulai navigasi ke login, lalu melempar error. Pemanggil masih dapat menangkap error sebelum navigasi selesai. Guard NestJS tetap melakukan verifikasi token pada setiap request ke endpoint protected.

### 9b. Ambil profil dari endpoint protected

Pada `frontend/src/features/auth/api/auth.api.ts`, tambahkan import berikut di atas kode yang sudah ada:

```ts
import { authFetch } from "./auth-fetch";
```

Tambahkan method ini di akhir file:

```ts
export async function getMe(): Promise<PublicUser> {
  const response = await authFetch("/auth/me");
  if (!response.ok) throw new Error("Gagal mengambil profil");
  return response.json();
}
```

`/auth/me` memverifikasi kembali token yang dibaca dari cookie setelah navigasi atau refresh. Endpoint ini mengembalikan `{ id, email }` untuk user pada token yang valid. Email di halaman Task nanti berasal dari respons endpoint ini; frontend tidak perlu membaca payload JWT.

### 9c. Ganti seluruh API task agar memakai helper

Ganti isi `frontend/src/features/tasks/api/tasks.api.ts` menjadi:

```ts
import { authFetch } from "@/features/auth/api/auth-fetch";
import type { Task, CreateTaskInput, UpdateTaskInput } from "../types/task";

export async function getTasks(): Promise<Task[]> {
  const response = await authFetch("/tasks");
  if (!response.ok) throw new Error("Gagal mengambil task");
  return response.json();
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const response = await authFetch("/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("Gagal membuat task");
  return response.json();
}

export async function updateTask(
  id: number,
  input: UpdateTaskInput,
): Promise<Task> {
  const response = await authFetch(`/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("Gagal mengubah task");
  return response.json();
}

export async function deleteTask(id: number): Promise<void> {
  const response = await authFetch(`/tasks/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Gagal menghapus task");
}
```

**Bandingkan perubahan API Task dengan Day 2:**

| Sebelumnya | Sekarang | Yang tidak berubah |
| --- | --- | --- |
| `fetch(\`${API_URL}/tasks\`)` | `authFetch('/tasks')` | `getTasks()` tetap mengembalikan array Task. |
| POST/PATCH membuat `fetch` sendiri | POST/PATCH memanggil helper dengan `method`, `headers`, dan `body` yang sama | DTO backend masih menerima `title`, `description`, `completed`. |
| Tidak ada header login | Helper menambah `Authorization` | `response.ok` dan `response.json()` tetap dipakai. |

`tasks.api.ts` tetap menentukan endpoint, method, body, dan cara membaca respons untuk tiap operasi Task. `authFetch` menambahkan token dan menangani `401` secara konsisten. Input create/update hanya memuat field Task; backend mengambil `userId` dari `request.user.id` setelah guard memverifikasi JWT. Tipe `Task` Day 2 tetap cukup untuk field yang dipakai UI, walaupun respons backend kini mempunyai `userId` tambahan.

**Checkpoint sementara:** setelah mengganti file API, refresh `/tasks` dan periksa header `Authorization` pada GET `/tasks` di Network tab. Jika respons masih `401`, periksa cookie token, format `Bearer`, serta `JWT_SECRET` yang dipakai backend untuk menandatangani dan memverifikasi JWT. Jika halaman masih memakai `handleToggle` dari checkout lama, tunggu perbaikan di langkah 9d sebelum menguji PATCH.

### 9d. Rapikan halaman Tasks dan satu request toggle

Di checkout saat ini, `handleToggle` dalam `frontend/src/app/tasks/page.tsx` melakukan PATCH melalui `fetch` langsung ke `http://localhost:3001`, lalu memanggil `updateTask()`. Akibatnya satu klik mengirim dua PATCH. Acuan akhir Day 2 sudah memperbaiki ini. Setelah endpoint protected, request langsung pada checkout lama juga tidak membawa token dan menghasilkan `401`.

Checkout saat ini juga menambahkan jeda dua detik sebelum GET Task untuk menampilkan spinner. Acuan akhir di bawah menghapus jeda demo tersebut. Jeda ini berasal dari kode halaman, bukan dari verifikasi JWT.

**Urutan perubahan dari halaman Day 2:**

1. **Perbaiki toggle lebih dulu.** Pada `handleToggle`, hapus `fetch('http://localhost:3001/...')` langsung. Sisakan satu pemanggilan `updateTask()` dan pembaruan React state melalui `setTasks(...map...)`. Jika peserta memakai acuan akhir Day 2, perubahan ini sudah ada. Setelah login, klik satu Task dan pastikan Network tab menampilkan satu PATCH.
2. **Tambahkan profil.** Import `getMe` dan tipe `PublicUser`; buat `const [user, setUser] = useState<PublicUser | null>(null)`. Pada `useEffect`, panggil `getMe()` sebelum `getTasks()`, lalu simpan respons melalui `setUser` dan `setTasks`. Tampilkan `{user.email}` di atas `TaskView`. Nilai email berasal dari endpoint backend, bukan dari payload JWT yang dibaca frontend.
3. **Sesuaikan penanganan CRUD.** Handler create/toggle/delete masih memperbarui array Task seperti Day 2. Gunakan `try/catch` untuk PATCH dan DELETE, lalu tampilkan `actionError` jika request gagal. Variabel `active` dan cleanup pada effect mencegah respons lama mengubah React state setelah komponen tidak lagi aktif.
4. **Tambahkan logout.** `clearToken()` menghapus cookie token; kosongkan `user` dan `tasks`; lalu `router.replace('/login')` mengarahkan browser. Jika `/tasks` dibuka lagi tanpa token, Proxy pada langkah 9f langsung mengarahkan ke login. Guard backend tetap menolak request tanpa token yang dikirim langsung ke API.

Setelah perubahan bertahap tersebut, cocokkan halaman dengan acuan akhir berikut. Struktur `TasksPage -> TaskView -> TaskForm/TaskItem` tetap dipakai:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, type PublicUser } from "@/features/auth/api/auth.api";
import { clearToken } from "@/features/auth/session";
import { deleteTask, getTasks, updateTask } from "@/features/tasks/api/tasks.api";
import { TaskView } from "@/features/tasks/components/task-view";
import type { Task } from "@/features/tasks/types/task";

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTasks() {
      try {
        const currentUser = await getMe();
        if (active) setUser(currentUser);
        const data = await getTasks();
        if (active) {
          setTasks(data);
        }
      } catch (cause) {
        if (active) {
          setError(cause instanceof Error ? cause : new Error("Gagal memuat task"));
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadTasks();
    return () => { active = false; };
  }, []);

  async function handleCreateTask(newTask: Task) {
    setTasks((current) => [...current, newTask]);
  }

  async function handleToggle(task: Task) {
    setActionError("");
    try {
      const updatedTask = await updateTask(task.id, {
        completed: !task.completed,
      });
      setTasks((current) =>
        current.map((item) => item.id === updatedTask.id ? updatedTask : item),
      );
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : "Gagal mengubah task");
    }
  }

  async function handleDelete(task: Task) {
    if (!confirm(`Hapus task ${task.title}?`)) return;
    setActionError("");
    try {
      await deleteTask(task.id);
      setTasks((current) => current.filter((item) => item.id !== task.id));
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : "Gagal menghapus task");
    }
  }

  function handleLogout() {
    clearToken();
    setUser(null);
    setTasks([]);
    setActionError("");
    router.replace("/login");
  }

  return (
    <>
      {user && (
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 pt-6">
          <span>Login sebagai {user.email}</span>
          <button type="button" onClick={handleLogout} className="text-blue-600">
            Logout
          </button>
        </div>
      )}
      {actionError && (
        <p role="alert" className="mx-auto max-w-3xl px-6 text-red-600">
          {actionError}
        </p>
      )}
      <TaskView
        tasks={tasks}
        loading={loading}
        error={error}
        handleCreateTask={handleCreateTask}
        handleToggle={handleToggle}
        handleDelete={handleDelete}
      />
    </>
  );
}
```

**Bedah baris penting setelah peserta melihat file lengkap:**

| Baris / kelompok | Mengapa ditulis? |
| --- | --- |
| `"use client"` | Halaman memakai `useState`, `useEffect`, tombol, dan storage browser. Komponen anak yang di-import dari halaman ini ikut berada di sisi client. |
| `useState<PublicUser \| null>(null)` | Sebelum `/auth/me` berhasil, kita belum tahu user yang aktif. Setelah sukses, email bisa ditampilkan. |
| `useState<Task[]>([])` | Daftar task tetap dimiliki `TasksPage`, sama seperti Day 2. `TaskView` hanya menerima props. |
| `getMe()` lalu `getTasks()` | Request profil memastikan token dapat diverifikasi; request berikutnya mengambil Task yang difilter backend berdasarkan user yang sama. |
| `let active = true` dan cleanup `active = false` | Respons dari request lama tidak mengubah state jika halaman sudah ditinggalkan. Ini **tidak** membatalkan request jaringan. |
| `handleCreateTask(newTask)` | Task hasil POST ditambahkan ke state parent. Kita memakai object hasil server, bukan membuat ID sendiri. |
| `updateTask(task.id, { completed: !task.completed })` | Satu klik → satu PATCH. Respons mengganti item yang cocok melalui `map`. |
| `deleteTask` lalu `filter` | Setelah server sukses menghapus, item dikeluarkan dari state. |
| `actionError` | Gagal PATCH/DELETE tampil sebagai pesan; data yang sudah ada tetap terlihat. |
| `clearToken()` dan `router.replace('/login')` | Logout menghapus token dari browser dan mengarahkan UI ke login. JWT yang sudah diterbitkan tetap valid sampai kedaluwarsa jika server tidak mempunyai mekanisme revokasi. |

**Alur data saat user mengubah Task:** `TasksPage` mengirim array `tasks` ke `TaskView`, lalu ke `TaskItem`. Event klik memanggil callback milik `TasksPage`, yang memanggil API helper. Setelah guard dan service backend memproses request, respons digunakan oleh `setTasks` untuk memperbarui React state; React merender ulang item yang berubah.

### 9e. Tampilkan error saat membuat task

Ada dua kemungkinan titik awal. Pada checkout saat ini, `TaskForm` Day 2 belum menangani error dengan `try/catch`. Pada contoh akhir panduan Day 2, form sudah memiliki `trim`, batas panjang input, status submit, dan pesan error. Jika peserta memakai hasil akhir Day 2, form tersebut dapat dipertahankan karena `createTask()` sudah memakai `authFetch` setelah langkah 9c. Jika memakai checkout saat ini, ganti isi `frontend/src/features/tasks/components/task-form.tsx` dengan acuan berikut:

```tsx
import { useState } from "react";
import type { Task } from "../types/task";
import { createTask } from "../api/tasks.api";

type TaskFormProps = {
  onCreated: (newTask: Task) => Promise<void>;
};

export function TaskForm({ onCreated }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || submitting) return;
    setError("");
    setSubmitting(true);

    try {
      const newTask = await createTask({
        title: cleanTitle,
        description: description.trim(),
      });
      await onCreated(newTask);
      setTitle("");
      setDescription("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal membuat task");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="flex w-full flex-col gap-2" onSubmit={handleSubmit}>
      <input
        value={title}
        placeholder="Task title"
        onChange={(event) => setTitle(event.target.value)}
        required
        maxLength={120}
        className="w-full rounded border p-2"
      />
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Task description"
        maxLength={500}
        className="w-full rounded border p-2"
      />
      {error && <p role="alert" className="text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
      >
        {submitting ? "Menyimpan..." : "Add Task"}
      </button>
    </form>
  );
}
```

**Penjelasan form:** `title.trim()` menghapus spasi di awal dan akhir judul. Kondisi `!cleanTitle || submitting` mencegah request dengan judul kosong atau submit berulang. Atribut `required` dan `maxLength` memberi validasi awal di browser; DTO backend tetap memvalidasi request. `await createTask(...)` menunggu respons POST, lalu `await onCreated(newTask)` mengirim Task hasil server ke state parent. Input dikosongkan setelah kedua operasi berhasil. `catch` menyimpan pesan error untuk dirender, sedangkan `finally` mengembalikan `submitting` menjadi `false`. Jika backend mengembalikan `401`, `authFetch` juga menghapus token dan mengarahkan ke login. Struktur props Day 2 tetap dipakai.

**Checkpoint 9:** login sebagai `user1@example.com`, lalu buat, ubah status, dan hapus Task sambil memeriksa Network tab. Request ke `/auth/me` dan `/tasks` membawa header `Authorization: Bearer ...`; satu klik toggle menghasilkan satu PATCH. Pada development dengan React Strict Mode, `useEffect` dapat memicu dua GET awal. Flag `active` mencegah respons lama mengubah state, tetapi tidak membatalkan request jaringan. Dua GET tersebut berbeda dari dua PATCH pada satu klik yang berasal dari implementasi `handleToggle` lama. Setelah logout, akses ulang `/tasks` dan periksa redirect ke `/login`. Guard dan filter backend tetap menjadi mekanisme yang membatasi akses data.

### 9f. Redirect awal dengan Proxy Next.js (Middleware)

**Mulai dari masalah yang terlihat.** Sebelum langkah ini, `authFetch()` memang mengarahkan user tanpa token ke `/login`, tetapi `authFetch()` baru dipanggil oleh `useEffect` setelah halaman `/tasks` mulai dimuat. Jika token tidak ada, helper mengarahkan browser tanpa mengirim request `/auth/me` ke backend. Kita ingin browser menerima redirect **sebelum halaman `/tasks` dirender**.

Pada Next.js 16, fitur yang dahulu bernama *Middleware* sekarang bernama **Proxy**. File yang dipakai adalah `frontend/src/proxy.ts`, sejajar dengan folder `app` di dalam `src`. Proxy menerima request halaman, dapat membaca cookie pada request itu, lalu memilih melanjutkan request atau mengirim redirect. Proxy tidak dapat membaca `window.sessionStorage` atau `document.cookie`: dua API tersebut hanya tersedia pada JavaScript browser. Itulah alasan langkah 8b menyimpan token dalam cookie; browser menyertakannya pada request ke Next.js.

Kerjakan pelan-pelan dalam tiga putaran:

1. **Amati perilaku lama.** Tanpa login, buka langsung `http://localhost:3000/tasks`. Sebelum Proxy ditambahkan, request halaman sempat berjalan; lalu `getMe()` memanggil `authFetch()`, yang mengarahkan browser ke `/login` ketika token tidak ada.
2. **Selesaikan `session.ts` dari langkah 8b.** Login harus menyimpan cookie `workshop_access_token`. Logout dan respons `401` harus menghapus cookie yang sama. Jika sebelumnya ada token di Session Storage, login ulang karena kode baru tidak membacanya.
3. **Tambahkan Proxy berikut.** Untuk melihat akibat tiap bagian saat mengajar, mulai dengan `matcher`, lalu pengecekan cookie dan redirect, lalu jalur `NextResponse.next()`.

Buat `frontend/src/proxy.ts`:

```ts
import { NextResponse, type NextRequest } from "next/server";
import { TOKEN_KEY } from "./features/auth/session";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_KEY)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/tasks/:path*",
};
```

**Penjelasan per baris, sesuai urutan request:**

| Kode | Artinya |
| --- | --- |
| `import { NextResponse, type NextRequest } ...` | `NextRequest` adalah tipe request yang diterima Proxy; `NextResponse` menyediakan respons redirect atau lanjut. `type` hanya membantu TypeScript. |
| `import { TOKEN_KEY } ...` | Memakai nama cookie yang sama dengan `saveToken()` saat login. Import ini tidak menjalankan `getToken()` yang khusus browser. |
| `export function proxy(request: NextRequest)` | Next.js memanggil fungsi ini ketika sebuah request cocok dengan `matcher`. |
| `request.cookies.get(TOKEN_KEY)?.value` | Baca nilai cookie dari request. `?.value` menghasilkan `undefined` jika cookie tidak ada. Proxy tidak membaca React state atau Session Storage. |
| `if (!token)` | Jika cookie tidak ada atau kosong, user belum memiliki token yang dapat dikirim untuk halaman ini. |
| `new URL("/login", request.url)` | Buat alamat `/login` pada origin yang sama dengan request; tidak perlu menulis `localhost:3000` secara tetap. |
| `NextResponse.redirect(...)` | Kirim respons redirect ke browser; halaman `/tasks` tidak dilanjutkan pada request ini. |
| `NextResponse.next()` | Cookie ada, jadi Next.js boleh melanjutkan request halaman. Baris ini **belum** menyatakan JWT valid. |
| `matcher: "/tasks/:path*"` | Jalankan Proxy hanya untuk `/tasks` dan path di bawahnya. `/login`, `/register`, dan halaman utama tetap terbuka. |

**Uji satu kondisi setiap kali:**

| Kondisi | Hasil yang diamati |
| --- | --- |
| Tidak ada cookie, buka `/tasks` langsung atau klik tautan dari `/` | Redirect ke `/login` sebelum halaman Task dimuat. Di Network, request halaman `/tasks` mendapat redirect. |
| Login berhasil, lalu buka atau refresh `/tasks` | Cookie ada; Proxy meneruskan request. `getMe()` dan `getTasks()` mengirim JWT melalui header `Authorization`, lalu backend memverifikasinya. |
| Logout, lalu buka `/tasks` lagi | `clearToken()` menghapus cookie; Proxy mengarahkan kembali ke `/login`. |
| Cookie ada tetapi JWT salah atau kedaluwarsa | Proxy hanya melihat keberadaan cookie. `JwtAuthGuard` mengembalikan `401`; `authFetch()` menghapus cookie dan mengarahkan ke `/login`. |

Untuk memeriksa redirect tanpa membuka browser, jalankan `curl -i http://localhost:3000/tasks` saat tidak ada cookie. Respons halaman adalah `307` dengan header `Location: /login`. Request langsung ke API NestJS tanpa JWT tetap mendapat `401`; dua status ini berasal dari lapisan yang berbeda.

**Batas tanggung jawab:** Proxy mempermudah navigasi, bukan memutuskan kepemilikan data. Cookie yang dibuat JavaScript bisa dibaca dan diubah dari browser; keberadaannya saja tidak membuktikan user telah login. `JwtAuthGuard` NestJS tetap memverifikasi signature dan masa berlaku JWT pada setiap request API. `TasksService` tetap membatasi query berdasarkan `userId`. Jangan mengganti guard backend dengan pemeriksaan cookie Proxy.

## 10. Uji dua akun dan jelaskan status HTTP

Mulai dari API sebelum mencoba alur yang sama di dashboard. Gunakan dua akun yang dibuat pada langkah backend: `user1@example.com` dan `user2@example.com`. Jika database latihan sempat di-reset, register ulang kedua akun, lalu login untuk mendapatkan access token masing-masing. Simpan token hanya di variabel shell pada terminal latihan:

```bash
curl -i http://localhost:3001/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user1@example.com","password":"passwordUser1_123"}'

curl -i http://localhost:3001/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"user2@example.com","password":"passwordUser2_123"}'
```

Pada `curl`, opsi `-d` mengirim request body dan menggunakan method POST ketika method tidak ditentukan secara eksplisit. Header `Content-Type: application/json` menyatakan bahwa body berisi JSON. Respons login berisi `accessToken`; setiap akun harus menghasilkan token yang berbeda.

Salin masing-masing nilai `accessToken` dari respons ke variabel berikut. Nilai di bawah adalah placeholder, bukan token yang bisa langsung dipakai:

```bash
TOKEN_USER_1='access-token-dari-login-user1'
TOKEN_USER_2='access-token-dari-login-user2'
```

Gunakan token user 1 untuk membuat task. Respons `POST /tasks` seharusnya `201` dan mengembalikan `id` task serta `userId` yang ditetapkan backend. Catat `id` tersebut untuk request berikutnya:

```bash
curl -i http://localhost:3001/tasks \
  -H "Authorization: Bearer $TOKEN_USER_1" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Task user 1","description":"Dibuat oleh user 1"}'

TASK_ID='id-task-dari-respons'
```

Ganti `TASK_ID` dengan angka `id` yang benar-benar dikembalikan server. Lalu jalankan request berikut satu per satu. Perhatikan status HTTP dan body respons setiap request:

```bash
curl -i http://localhost:3001/tasks

curl -i http://localhost:3001/tasks -H "Authorization: Bearer $TOKEN_USER_1"
curl -i http://localhost:3001/tasks -H "Authorization: Bearer $TOKEN_USER_2"

curl -i "http://localhost:3001/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN_USER_2"

curl -i -X PATCH "http://localhost:3001/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN_USER_2" \
  -H 'Content-Type: application/json' \
  -d '{"completed":true}'

curl -i -X DELETE "http://localhost:3001/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN_USER_2"

curl -i "http://localhost:3001/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN_USER_1"

curl -i -X PATCH "http://localhost:3001/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN_USER_1" \
  -H 'Content-Type: application/json' \
  -d '{"completed":true}'

curl -i http://localhost:3001/tasks \
  -H "Authorization: Bearer $TOKEN_USER_1" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Mencoba userId palsu","userId":999}'

curl -i -X DELETE "http://localhost:3001/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN_USER_1"
```

Request DELETE dengan token user 1 ada di bagian akhir agar task masih tersedia selama pengujian GET dan PATCH. Jika ingin mengulang pengujian setelah DELETE berhasil, buat task baru dan gunakan `id` yang baru.

| Request atau kondisi | Hasil yang diharapkan | Baris logika yang menentukan hasil |
| --- | --- | --- |
| Register dengan email baru | `201` | `AuthService.register` menyimpan `passwordHash` dan hanya mengembalikan `id` serta `email`. |
| Register dengan email yang sudah ada | `409` | Email unik di database; `P2002` diterjemahkan menjadi `ConflictException`. |
| Login dengan password salah | `401` | `bcrypt.compare` bernilai `false`; access token tidak diterbitkan. |
| `/auth/me` atau `/tasks` tanpa token | `401` | `JwtAuthGuard` menolak request sebelum handler controller dijalankan. |
| JWT dengan signature tidak valid atau sudah kedaluwarsa | `401` | `JwtService.verifyAsync` gagal memverifikasi token. |
| `POST /tasks` oleh user 1 | `201` | Service mengisi `userId` dari `request.user.id`. |
| `GET /tasks` oleh user 1 | `200`, termasuk task yang baru dibuat | Query memakai `where: { userId: 1 }` **jika** ID user 1 adalah `1`. |
| `GET /tasks` oleh user 2 | `200`, tanpa task user 1 | Query memakai `where: { userId: 2 }` **jika** ID user 2 adalah `2`. |
| GET/PATCH/DELETE task user 1 dengan token user 2 | `404` | Query mencocokkan `id` task sekaligus `userId` dari token user 2. |
| GET/PATCH/DELETE task sendiri | `200` | Kedua syarat query cocok. |
| `POST /tasks` dengan field `userId` tambahan | `400` | `ValidationPipe` menolak field yang tidak ada di DTO. |

Angka `1` dan `2` pada contoh query hanya ilustrasi. Nilai sebenarnya mengikuti `id` akun di respons register atau `/auth/me`; service menggunakan nilai dari `request.user`, bukan angka yang ditulis di frontend.

**Uji di frontend:** login sebagai user 1 dan buat satu task. Logout, lalu login sebagai user 2; task user 1 tidak muncul. Login kembali sebagai user 1; task tersebut muncul lagi. Jika ingin membandingkan dua akun secara bersamaan, buka keduanya di profil browser terpisah karena cookie login dibagikan antar-tab pada host frontend yang sama. Hubungkan hasilnya ke dua bagian backend: guard menentukan apakah request boleh masuk, sedangkan filter `userId` menentukan task mana yang bisa diakses.

Terakhir, periksa kode setelah semua potongan dipasang. Jalankan dari direktori masing-masing:

```bash
# backend/
pnpm run build

# frontend/
pnpm exec tsc --noEmit
```

Build/type-check menemukan masalah import atau tipe; tabel uji API di atas tetap diperlukan untuk membuktikan guard dan pembatasan kepemilikan saat aplikasi berjalan.

### Jika terjadi error saat workshop

| Gejala | Periksa |
| --- | --- |
| Backend gagal start: `JWT_SECRET` tidak ada | Tambahkan di `backend/.env`, lalu restart proses Nest. |
| Migrasi gagal karena `userId` wajib | Ada task lama tanpa pemilik; gunakan database latihan kosong atau migrasi nullable → backfill → wajib. |
| Prisma tidak mengenali model `User`/field `userId` | Jalankan `pnpm exec prisma generate` dari `backend/`, lalu restart Nest. |
| `Nest can't resolve dependencies` untuk guard/service | Pastikan `AuthModule` mengimpor `PrismaModule` dan `JwtModule`, lalu mengekspor **`JwtAuthGuard` serta `JwtModule`**. `TasksModule` harus mengimpor `AuthModule` dan `PrismaModule`. |
| Browser menerima CORS error | Pastikan alamat frontend sesuai `FRONTEND_URL` backend (default `http://localhost:3000`) dan Nest direstart. |
| Semua request task `401` | Lihat header Authorization di Network, secret backend, masa berlaku JWT, dan apakah token tersimpan di tab itu. |
| Toggle mengirim dua PATCH | Hapus `fetch` langsung lama dari `tasks/page.tsx`; cukup `updateTask()`. |
| Build gagal pada `prisma/seed.ts` setelah `userId` wajib | Seed Day 2 masih membuat task tanpa pemilik. Kerjakan langkah 6d untuk stub aman, atau ganti dengan seed baru pada Lampiran A. |

## Lampiran A — Seed opsional setelah auth selesai

Kerjakan bagian ini setelah register, login, guard, dan pembatasan kepemilikan task selesai diuji. Seed Day 2 membuat task tanpa `userId`; setelah relasi Task–User diwajibkan, setiap task dari seed juga harus memiliki pemilik. Contoh berikut membuat satu user untuk database latihan dan menambahkan dua task milik user tersebut.

Tambahkan `SEED_USER_EMAIL` dan `SEED_USER_PASSWORD` ke `backend/.env` lokal. Isi password melalui environment variable agar kredensial demo tidak disimpan di source code. Lalu ganti isi `backend/prisma/seed.ts` dengan:

```ts
import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generate/prisma/client';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} wajib diisi`);
  return value;
}

const databaseUrl = requiredEnv('DATABASE_URL');
const email = requiredEnv('SEED_USER_EMAIL').trim().toLowerCase();
const password = requiredEnv('SEED_USER_PASSWORD');

if (!email) throw new Error('SEED_USER_EMAIL wajib diisi');
if (password.length < 8 || password.length > 72 || Buffer.byteLength(password, 'utf8') > 72) {
  throw new Error('Password seed harus 8–72 karakter dan maksimal 72 byte UTF-8');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function main() {
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash: await bcrypt.hash(password, 10) },
    select: { id: true },
  });

  const existing = await prisma.task.count({ where: { userId: user.id } });
  if (existing === 0) {
    await prisma.task.createMany({
      data: [
        { title: 'Coba login', userId: user.id },
        { title: 'Buat task sendiri', userId: user.id },
      ],
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Jalankan eksplisit dari `backend/`:

```bash
pnpm exec prisma db seed
```

Perhatikan bagian yang perlu dijelaskan setelah peserta membaca kodenya:

| Kode | Alasan |
| --- | --- |
| `requiredEnv(...)` | Seed berhenti dengan pesan yang jelas jika variabel yang wajib diisi belum tersedia. |
| `trim().toLowerCase()` | Format email seed mengikuti normalisasi email pada register. |
| Pemeriksaan panjang karakter dan `Buffer.byteLength(...)` | Password seed mengikuti batas yang sama dengan DTO register dan bcrypt: maksimal 72 byte UTF-8. |
| `bcrypt.hash(password, 10)` | Kolom `passwordHash` menerima hash, sehingga akun seed dapat login melalui alur autentikasi yang sama. |
| `prisma.user.upsert(...)` | `where: { email }` mencari user berdasarkan email unik. `create` dijalankan bila belum ada; `update: {}` tidak mengganti password user yang sudah ada. Karena itu, `SEED_USER_PASSWORD` hanya menjadi password akun ketika akun tersebut baru dibuat. |
| `select: { id: true }` | Seed hanya memerlukan ID user untuk mengisi relasi task. |
| `prisma.task.count({ where: { userId: user.id } })` | Seed menambahkan task contoh hanya ketika user itu belum memiliki task. Menjalankan seed ulang tidak menggandakan data contoh. |
| `userId: user.id` pada `createMany` | Setiap task seed terhubung ke user yang dibuat atau ditemukan melalui `upsert`. |
| `$disconnect()` pada `finally` | Koneksi Prisma ditutup baik seed berhasil maupun gagal. |

Seed ini untuk database latihan. Jika dua akun dan task sudah dibuat manual selama workshop, bagian ini tidak diperlukan.

## Penutup sesi

Simpulkan alurnya secara berurutan. Register memvalidasi input, membuat `passwordHash`, lalu menyimpan user. Login memakai `bcrypt.compare` untuk memeriksa password dan menerbitkan JWT dengan ID user di klaim `sub`. Pada request protected, `JwtAuthGuard` memverifikasi JWT dan menaruh identitas user di `request.user`. `TasksService` menggunakan `request.user.id` saat membuat task dan saat membatasi query task. Frontend menyimpan access token dan mengirimnya melalui header `Authorization`; keputusan akses tetap dilakukan di backend.

Sebagai latihan mandiri, peserta membuat dua akun dan membuktikan empat hasil melalui Network tab atau `curl`: daftar task terpisah per user, akses ke ID task user lain menghasilkan `404`, request tanpa token menghasilkan `401`, dan satu aksi toggle menghasilkan satu PATCH. Minta peserta mengaitkan masing-masing respons dengan guard, validasi DTO, atau filter `userId` di service.

## Catatan lanjutan untuk tentor setelah demo inti

Implementasi workshop memusatkan pembelajaran pada alur HTTP, JWT, dan pembatasan data berdasarkan pemilik. Jika pembahasan berlanjut ke aplikasi produksi, gunakan poin berikut untuk menunjukkan keputusan tambahan yang perlu dibuat:

| Yang dipakai di workshop | Yang perlu dipikirkan untuk aplikasi nyata |
| --- | --- |
| Token dalam cookie yang ditulis JavaScript | JavaScript di halaman dapat membacanya, sehingga XSS juga dapat mencurinya. Evaluasi cookie sesi `HttpOnly` yang dibuat server atau pola BFF; pertimbangkan atribut `Secure`, `SameSite`, dan perlindungan CSRF yang sesuai. |
| JWT berlaku satu jam dan logout hanya menghapus token lokal | Token yang sudah terbit masih valid sampai kedaluwarsa, kecuali server punya revokasi/rotasi sesi. |
| Register dan login sederhana | Tambahkan HTTPS, rate limit login, dan kebijakan recovery akun. |
| `User.email` unik + normalisasi lowercase | Tetapkan kebijakan perubahan email, verifikasi email, dan penanganan akun duplikat sesuai kebutuhan produk. |

Bahas poin ini setelah peserta berhasil menunjukkan hasil pengujian dua akun. Dengan begitu, perbedaan antara implementasi latihan dan kebutuhan aplikasi produksi dapat dihubungkan ke kode yang baru mereka jalankan.

## Rujukan konsep resmi

- [NestJS: hashing dengan bcrypt](https://docs.nestjs.com/v11/security/encryption-and-hashing)
- [NestJS 11: JWT bearer dan guard](https://docs.nestjs.com/v11/security/authentication)
- [NestJS: batas module dan provider](https://docs.nestjs.com/modules)
- [NestJS: validasi request](https://docs.nestjs.com/techniques/validation)
- [bcrypt: batas 72 byte](https://github.com/kelektiv/node.bcrypt.js/#security-issues-and-concerns)
- [Prisma: relasi satu ke banyak](https://docs.prisma.io/docs/orm/prisma-schema/data-model/relations/one-to-many-relations)
- [Prisma 7: generate setelah migrate dev](https://docs.prisma.io/docs/guides/upgrade-prisma-orm/v7)
- [Next.js App Router: Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js 16: Proxy (nama baru Middleware)](https://nextjs.org/docs/app/getting-started/proxy)
- [Next.js App Router: autentikasi dan sesi](https://nextjs.org/docs/app/guides/authentication)
