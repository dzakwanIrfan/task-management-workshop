# Day 3 Workshop — Auth Next.js + NestJS dan Task Milik Pengguna

> **Cara memakai materi ini:** kerjakan satu tahap, jalankan, lihat hasilnya, baru lanjut. Potongan kode di bawah adalah **perubahan yang akan dibuat peserta**, bukan gambaran bahwa repository sudah memiliki auth. Semua perintah dijalankan dari direktori yang tertulis di setiap tahap.

## Hasil akhir yang ingin dicapai

Peserta dapat menjelaskan dan mendemokan alur berikut:

```text
Register -> password di-hash -> User tersimpan
Login -> password dibandingkan -> server menerbitkan JWT
Browser -> Authorization: Bearer <JWT> -> JwtAuthGuard -> identitas user
Identitas user -> query Prisma dibatasi userId -> hanya task sendiri
```

| Aksi | Endpoint | Perlu token? | Hasil penting |
| --- | --- | --- | --- |
| Register | `POST /auth/register` | Tidak | `201`, user tanpa hash password |
| Login | `POST /auth/login` | Tidak | `200`, `accessToken` dan user |
| Siapa saya? | `GET /auth/me` | Ya | `200` jika token valid; `401` jika tidak |
| CRUD task | `POST/GET/PATCH/DELETE /tasks...` | Ya | Selalu dibatasi ke user dari token |

**Kalimat pembuka untuk peserta:** “Kemarin semua orang melihat daftar task yang sama. Hari ini kita membuat identitas pengguna, membuktikan identitas itu saat login, lalu meminta database mengambil task berdasarkan identitas yang sudah diverifikasi server.”

## 0. Kenali titik awal proyek dan istilahnya

Proyek ini sudah memakai **NestJS 11, Prisma 7 + PostgreSQL, Next.js 16 App Router, dan pnpm**. Backend berjalan pada port `3001`, frontend pada port `3000`. Di backend, `Task` sekarang belum memiliki pemilik; `TasksController` dan `TasksService` sudah melayani CRUD. `main.ts` sudah mengaktifkan `ValidationPipe` global dan CORS untuk alamat frontend. Di frontend, `/tasks` adalah Client Component yang menyimpan state daftar task, sementara `tasks.api.ts` mengirim `fetch` langsung ke NestJS.

Lihat dahulu file berikut bersama peserta:

- `backend/prisma/schema.prisma` — bentuk tabel saat ini.
- `backend/src/tasks/tasks.controller.ts` — pintu HTTP.
- `backend/src/tasks/tasks.service.ts` — query database.
- `backend/src/tasks/dto/` — aturan validasi request yang sudah dipakai proyek.
- `frontend/src/app/tasks/page.tsx` — state dan alur UI.
- `frontend/src/features/tasks/api/tasks.api.ts` — semua request task dari browser.

**Tiga istilah yang perlu dibedakan:**

1. **Authentication:** apakah pemanggil benar-benar pengguna yang mengaku login? Password dan JWT menjawabnya.
2. **Authorization:** setelah identitas diketahui, bolehkah pengguna menyentuh data tertentu? Filter `userId` menjawabnya.
3. **Session di browser:** bagaimana browser menyimpan bukti login untuk request berikutnya? Pada latihan ini kita memakai bearer token di `sessionStorage` supaya alur HTTP terlihat jelas.

**Pertanyaan pemantik:** “Jika endpoint `GET /tasks` masih memakai `findMany()` tanpa filter, apa yang dilihat Bob setelah Alice membuat task?” Jawabannya: task Alice juga. Menyembunyikan kartu di UI tidak mengubah respons API.

### Persiapan lingkungan

Jalankan backend dan frontend pada terminal berbeda. File `backend/.env` sudah dipakai oleh koneksi database; `frontend/.env` sudah berisi `NEXT_PUBLIC_API_URL=http://localhost:3001`. Jangan menampilkan isi `backend/.env` di layar workshop karena berisi kredensial.

```bash
# Terminal 1
cd backend
pnpm install
pnpm start:dev

# Terminal 2, dari root proyek
cd frontend
pnpm install
pnpm dev
```

> **Perhatian data Day 2:** kolom `Task.userId` di langkah 6 nanti wajib diisi. Jika database masih berisi task lama tanpa pemilik, migrasi itu akan gagal. Untuk workshop, gunakan database PostgreSQL **khusus latihan yang kosong**, atau reset database lokal **hanya setelah data yang perlu disimpan dicadangkan**. Jangan menjalankan reset pada database bersama/produksi. Alternatif untuk data yang perlu dipertahankan: migrasikan `userId` sebagai nullable, buat atau tentukan pemilik untuk setiap task lama, isi semua `userId`, lalu buat migrasi kedua yang mengubahnya menjadi wajib. Pada panduan utama di bawah, anggap database latihan kosong setelah migrasi Day 2 diterapkan.

Jika Anda **sengaja memilih menghapus seluruh data database lokal latihan**, jalankan perintah ini dari `backend/` sebelum `migrate dev` pada langkah 1:

```bash
pnpm exec prisma migrate reset --force
```

Perintah itu menerapkan ulang migrasi yang sudah ada dan **menghapus semua data**, bukan hanya task. Prisma 7 tidak otomatis menjalankan seed pada reset. Seed Day 2 yang belum punya `userId` jangan dijalankan setelah langkah 6. Bila data Day 2 perlu dipertahankan, gunakan jalur migrasi dua tahap di atas.

**Checkpoint 0:** sebelum mengubah kode, minta peserta menyebutkan mengapa `GET /tasks` saat ini tidak tahu siapa pemanggilnya.

## 1. Tambahkan model User dulu

**Tujuan kecil:** database dapat menyimpan akun, sementara CRUD Task Day 2 tetap berjalan selama register/login dipelajari. Edit `backend/prisma/schema.prisma`. Pertahankan blok `generator`, `datasource`, dan model `Task` yang sudah ada; **tambahkan hanya model baru** berikut:

```prisma
model User {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}
```

**Bedah baris penting:**

- `email String @unique`: database menolak dua akun dengan email sama. Validasi di kode saja belum cukup ketika dua request datang hampir bersamaan.
- `passwordHash String`: kolom ini menyimpan hasil hash, **bukan password asli**. Namanya sengaja jelas agar tidak tertukar.
- `id`: nomor user yang nanti dimasukkan ke klaim `sub` JWT.
- `createdAt`: waktu akun dibuat; Prisma mengisinya otomatis.

**Analogi:** sebelum kartu task bisa diberi nomor pemilik, kita perlu membuat daftar pemiliknya dahulu. Pada langkah 6, barulah model Task dihubungkan ke User.

Dari `backend/` jalankan:

```bash
pnpm exec prisma validate
pnpm exec prisma migrate dev --name add_users
pnpm exec prisma generate
```

`migrate dev` membuat dan menerapkan migrasi. `generate` membangun ulang Prisma Client di lokasi khusus proyek ini, yaitu `backend/generate/prisma`; karena itu import di backend tetap `generate/prisma/client`, bukan menggantinya dengan `@prisma/client`. Pada Prisma 7 proyek ini, jalankan `generate` secara eksplisit setelah perubahan schema.

**Checkpoint 1:** buka migrasi baru dan tunjuk keunikan `User.email`. `Task` tetap seperti Day 2 sehingga kode backend tetap dapat dikompilasi untuk checkpoint register/login. Data Task lama masih ada; penanganannya baru diperlukan pada langkah 6.

> `backend/prisma/seed.ts` lama membuat tiga task tanpa `userId` dan menghapus task lama. **Jangan jalankan seed lama setelah langkah 6**. Bagian akhir materi memberi pilihan seed baru.

## 2. Siapkan bcrypt, JWT, dan secret server

**Tujuan kecil:** menyiapkan dua alat dengan tugas berbeda. Dari `backend/`:

```bash
pnpm add bcrypt @nestjs/jwt
pnpm add -D @types/bcrypt
openssl rand -hex 32
```

Salin keluaran perintah terakhir ke baris baru di `backend/.env`:

```dotenv
JWT_SECRET=isi-dengan-hasil-openssl-anda
```

Restart `pnpm start:dev` setelah mengubah `.env` agar proses membaca secret baru. `JWT_SECRET` hanya milik **backend**. Jangan menaruhnya di `frontend/.env` atau variabel `NEXT_PUBLIC_` karena nilai `NEXT_PUBLIC_` masuk ke kode browser.

**Bedakan perannya:**

- **bcrypt** mengubah password menjadi hash satu arah saat register dan membandingkan password dengan hash saat login. Password asli tidak bisa diambil kembali dari hash.
- **JWT** adalah token yang **ditandatangani**, bukan dienkripsi. Isinya dapat dibaca, tetapi perubahan isinya membuat tanda tangannya tidak valid. Maka masukkan hanya identitas minimal, bukan password atau secret.
- **Guard** memeriksa token pada tiap request yang dilindungi. Keberadaan token saja belum cukup; tanda tangan dan masa berlaku harus diverifikasi.

**Pertanyaan pemantik:** “Kalau password dan JWT sama-sama terlihat acak, apakah fungsinya sama?” Tidak: password di-hash untuk verifikasi kredensial; JWT membawa klaim identitas yang ditandatangani untuk request berikutnya.

## 3. Register: terima input, validasi, hash, simpan, respons aman

**Tujuan kecil:** satu request bisa membuat User, tetapi responsnya tidak pernah mengandung `passwordHash`.

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

**Bedah baris:** `@IsEmail()` memeriksa format email; `@MinLength(8)` memberi batas minimum latihan; `!` memberi tahu TypeScript bahwa Nest akan mengisi field dari body request. `ValidationPipe` global di `main.ts` menjalankan dekorator tersebut, menolak field yang tidak dikenal, dan mengembalikan `400` jika input tidak sah. Bcrypt membatasi password berdasarkan **byte**, jadi pemeriksaan byte tambahan tetap perlu di service.

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

**Bedah alur baris demi baris:**

1. Import `bcrypt` dipakai untuk membuat hash. `Prisma` menyediakan tipe error database seperti `P2002`.
2. `@Injectable()` menjadikan service dapat di-inject oleh Nest. Constructor meminta `PrismaService` yang sudah ada di proyek.
3. `trim().toLowerCase()` menormalisasi email supaya `Alice@Example.com` dan `alice@example.com` dianggap sama dalam alur ini. DTO divalidasi **sebelum** service, jadi email dengan spasi di awal/akhir bisa ditolak oleh `@IsEmail()` lebih dulu; `trim()` di sini bersifat defensif. Password tidak di-trim; spasi dapat menjadi bagian password.
4. `Buffer.byteLength(...)` mencegah password multibyte melewati batas 72 byte bcrypt; `@MaxLength` menghitung karakter, sehingga keduanya punya peran berbeda.
5. `await bcrypt.hash(..., 10)` menjalankan hash asinkron dengan cost factor 10. Hasil yang disimpan adalah `passwordHash`.
6. `data` berisi nilai yang masuk database. `select` menentukan field respons secara eksplisit: hanya `id` dan `email`.
7. `P2002` berarti unique constraint dilanggar; ubah menjadi `409 Conflict`. Error lain tetap dilempar agar tidak menyembunyikan kegagalan database.

**Demo singkat di papan:** tulis `password -> bcrypt.hash -> passwordHash`. Saat login nanti alurnya `password dari form + passwordHash di DB -> bcrypt.compare -> true/false`; jangan mencoba meng-hash ulang lalu membandingkan dua string hash, karena bcrypt memakai salt.

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

**Bedah baris:** `@Controller('auth')` memberi awalan `/auth`. `@Post('register')` membuat `POST /auth/register`. `@Body()` mengambil JSON body dan DTO memvalidasinya. Controller meneruskan pekerjaan ke service. `AuthModule` mengimpor `PrismaModule` supaya `AuthService` dapat menerima `PrismaService`; provider Nest memiliki cakupan module, tidak otomatis tersedia hanya karena `AppModule` juga mengimpor Prisma.

Tes dari terminal lain:

```bash
curl -i http://localhost:3001/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@example.com","password":"contohPassword123"}'
```

**Checkpoint 3:** respons pertama `201` dengan `{id,email}`; request yang sama lagi `409`; email salah format atau password terlalu pendek `400`. Pastikan tidak ada `password` atau `passwordHash` di respons. Pada database, kolom `passwordHash` terisi string hash, bukan password asli.

## 4. Login: bandingkan password, baru terbitkan JWT

**Tujuan kecil:** pisahkan “password cocok” dari “token diterbitkan”. Tunjukkan dahulu logika `bcrypt.compare`, lalu pasang `JwtModule`.

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

Login tidak perlu `@MinLength(8)`: password yang salah tetap diproses sebagai percobaan login dan mendapat `401` yang sama dengan email tidak dikenal. Format input yang bukan email/string tetap `400`.

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

**Bedah baris:** `registerAsync` meminta konfigurasi saat Nest membangun module. `getOrThrow` menolak key yang tidak ada; pemeriksaan panjang tambahan menolak string kosong atau terlalu pendek. Gunakan hasil acak `openssl` dari langkah 2, bukan string yang mudah ditebak. `expiresIn: '1h'` berarti token berlaku satu jam. Nilai ini untuk latihan; bukan mekanisme refresh token.

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

**Bedah baris:** `findUnique` mencari email yang sudah dinormalisasi; `bcrypt.compare` mengecek password terhadap hash tanpa membuka password lama. Pesan `401` sama untuk email tidak ditemukan dan password salah sehingga respons tidak langsung membocorkan apakah sebuah email terdaftar. `sub` adalah *subject* atau ID user. `signAsync` menandatangani payload `{sub: user.id}`. Respons mengirim token dan data user publik saja.

### 4d. Tambahkan endpoint login

Pada `backend/src/auth/auth.controller.ts`, tambahkan `HttpCode` dan `HttpStatus` pada import `@nestjs/common`, dan import `LoginDto`. Di bawah `register`, tambahkan:

```ts
@HttpCode(HttpStatus.OK)
@Post('login')
login(@Body() body: LoginDto) {
  return this.authService.login(body);
}
```

`@Post()` Nest secara default mengembalikan `201`. `@HttpCode(HttpStatus.OK)` menjadikan login `200` sesuai kontrak kita: login tidak membuat record baru.

```bash
curl -i http://localhost:3001/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@example.com","password":"contohPassword123"}'
```

**Checkpoint 4:** login benar memberi `200` dan `accessToken`; password salah `401`. Ajak peserta melihat tiga bagian JWT yang dipisahkan titik, lalu jelaskan: payload dapat dibaca, tetapi **jangan** percaya hasil decode tanpa verifikasi tanda tangan server. Jangan mencetak token atau password ke log.

## 5. Guard: verifikasi token dan buat endpoint `/auth/me`

**Tujuan kecil:** buat satu endpoint protected sebelum mengubah seluruh CRUD. Dengan begitu peserta dapat melihat persis kapan request berhenti di guard.

Buat `backend/src/auth/auth.types.ts`:

```ts
import type { Request } from 'express';

export type AuthenticatedRequest = Request & {
  user: { id: number };
};
```

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

**Bedah baris sesuai urutan request:**

1. `context.switchToHttp().getRequest()` mengambil request HTTP yang sedang diproses.
2. `authorization` dipecah menjadi skema `Bearer` dan isi token; format yang hilang/salah menjadi `401`.
3. `verifyAsync` memeriksa tanda tangan dan waktu kedaluwarsa memakai secret dari `JwtModule`. `decode` saja tidak melakukan ini.
4. Pemeriksaan runtime `sub` memastikan ID bertipe integer positif; tipe TypeScript sendiri tidak memvalidasi isi token dari jaringan.
5. Query User memastikan akun tersebut masih ada.
6. `request.user` ditulis **oleh server setelah verifikasi**. Nilai inilah yang boleh dipercaya controller; bukan `userId` dari body/query browser.
7. `return true` membiarkan request lanjut ke controller. Bila ada exception, controller tidak dijalankan.

Di `backend/src/auth/auth.module.ts`, tambahkan import `JwtAuthGuard`, lalu ubah bagian provider/export menjadi:

```ts
providers: [AuthService, JwtAuthGuard],
exports: [JwtAuthGuard, JwtModule],
```

`JwtModule` ikut diekspor agar `JwtService` tersedia saat guard dipakai dari `TasksModule`. Setelah mengubah metadata module, restart Nest dan lihat apakah semua dependency guard berhasil dibuat.

Di `backend/src/auth/auth.controller.ts`, tambahkan `Get`, `Req`, `UseGuards` ke import Nest, dan import `JwtAuthGuard` serta tipe `AuthenticatedRequest` dengan sintaks berikut:

```ts
import { JwtAuthGuard } from './jwt-auth.guard';
import type { AuthenticatedRequest } from './auth.types';
```

`import type` wajib untuk tipe pada parameter yang memakai decorator `@Req()` di konfigurasi TypeScript proyek ini. Tambahkan method berikut:

```ts
@UseGuards(JwtAuthGuard)
@Get('me')
async me(@Req() request: AuthenticatedRequest) {
  return this.authService.findPublicUser(request.user.id);
}
```

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

**Kenapa ada `select` lagi?** Walaupun guard sudah mengecek user, endpoint profil tetap memilih field yang boleh keluar. Jangan pernah me-return record User lengkap karena berisi `passwordHash`.

Tes tanpa token, lalu dengan token yang disalin dari respons login:

```bash
curl -i http://localhost:3001/auth/me

TOKEN_A='tempel-accessToken-A-di-sini'
curl -i http://localhost:3001/auth/me \
  -H "Authorization: Bearer $TOKEN_A"
```

**Checkpoint 5:** tanpa token `401`; dengan token valid `200` berisi `{id,email}`; token yang diubah satu karakter `401`.

## 6. Task milik user: lindungi semua route dan batasi semua query

**Tujuan kecil:** token yang valid belum otomatis mencegah Bob membuka task Alice. Guard menjawab “siapa?”, sedangkan service harus menjawab “task ini punya siapa?”.

### 6a. Hubungkan model Task ke User

Hentikan proses `pnpm start:dev` sebentar. Pada tahap ini schema, Prisma Client, dan service Task harus diubah sebagai satu kelompok sebelum backend dapat berjalan lagi. Di `backend/prisma/schema.prisma`, tambahkan `tasks Task[]` pada model `User` yang dibuat di langkah 1, lalu tambahkan tiga baris terkait pemilik pada model `Task` yang sudah ada:

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

**Bedah baris:** `tasks Task[]` berarti satu user dapat memiliki banyak task. `userId Int` adalah foreign key yang benar-benar disimpan pada setiap task dan wajib diisi. `@relation` menunjuk `User.id`, sedangkan indeks mempercepat pencarian task berdasarkan pemilik. Kini setiap kartu task memiliki nomor pemilik.

Jika reset database latihan sudah dilakukan di persiapan, tabel Task kosong dan dari `backend/` Anda dapat menjalankan:

```bash
pnpm exec prisma validate
pnpm exec prisma migrate dev --name add_task_owners
pnpm exec prisma generate
```

Jika tabel Task masih berisi baris tanpa pemilik, **jangan paksa migrasi ini**. Pilih reset lokal yang dijelaskan di awal (konsekuensinya akun Alice/Bob dari latihan auth juga hilang sehingga harus didaftarkan ulang), atau lakukan jalur `userId` nullable → tentukan pemilik tiap baris → backfill → ubah `userId` menjadi wajib. Panduan utama memakai tabel Task kosong agar fokus peserta tetap pada auth dan ownership. Setelah `generate`, kode TasksService lama memang tidak cocok dengan relasi wajib yang baru; selesaikan 6b–6c sebelum menyalakan Nest lagi.

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

`AuthModule` tadi mengekspor `JwtAuthGuard` dan `JwtModule`; tanpa import ini Nest tidak dapat menyediakan guard beserta `JwtService` di `TasksModule`.

Ganti isi `backend/src/tasks/tasks.controller.ts` menjadi:

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

**Bedah baris:** `@UseGuards` di tingkat class mencakup kelima route. Setiap method mengambil `request.user.id` yang dipasang guard, lalu meneruskannya ke service. `ParseIntPipe` tetap menolak ID URL yang bukan angka. DTO Task yang sudah ada tetap dipakai; browser **tidak** mengirim `userId` di body.

### 6c. Filter setiap operasi di service

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

**Bedah operasi satu per satu:**

- `create`: service menulis `userId` dari parameter yang datang dari guard. Walau browser mencoba mengirim `userId` lain, DTO/ValidationPipe menolak field asing; service juga tidak memakai field itu.
- `findAll`: `where: { userId }` adalah pagar utama daftar task. Tanpanya, semua task bocor.
- `findOne`: gabungan `id` dan `userId` hanya menemukan task milik pemanggil. Task tidak ada dan task orang lain sama-sama menghasilkan `404`.
- `update`/`remove`: `where: { id, userId }` membatasi **operasi tulis** secara atomik di database. Jangan hanya memfilter daftar di UI atau mengecek kepemilikan setelah update.
- `P2025`: Prisma tidak menemukan record yang cocok untuk update/delete. Kita terjemahkan menjadi `404`; error database lain tetap muncul sebagai error sebenarnya.
- `data` update menyebut field yang boleh diubah satu per satu; `userId` tidak dapat dipindah melalui PATCH.

Setelah service dan controller selesai, jalankan lagi `pnpm start:dev` dari `backend/`. Periksa bahwa Nest berhasil start tanpa error TypeScript atau dependency injection sebelum mencoba endpoint.

**Checkpoint 6:** `GET /tasks` tanpa token menjadi `401`. Dengan token Alice, `POST /tasks` menciptakan task dengan `userId` Alice. Dengan token Bob, `GET /tasks` tidak menampilkan task Alice. Jangan lanjut ke frontend sebelum ini terbukti melalui API.

## 7. Frontend tahap pertama: form register tanpa state login

**Tujuan kecil:** peserta melihat bagaimana input React berubah menjadi request HTTP. Kita belum menyimpan token di tahap ini.

### 7a. API auth publik

Buat `frontend/src/features/auth/api/auth.api.ts`:

```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type PublicUser = { id: number; email: string };
export type LoginResult = { accessToken: string; user: PublicUser };
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

**Bedah baris:** `NEXT_PUBLIC_API_URL` boleh dibaca browser karena hanya alamat API, bukan secret. `Credentials` adalah bentuk input kedua form. `fetch` mengirim JSON ke NestJS; `response.ok` hanya benar untuk status `2xx`, jadi `400/401/409` menjadi pesan yang dapat ditampilkan. Nest dapat mengirim `message` sebagai string atau array kesalahan validasi. `response.json()` mengubah JSON respons menjadi object JavaScript; anotasi `Promise<...>` membantu TypeScript, tetapi tidak menggantikan validasi server.

### 7b. Halaman register

Buat `frontend/src/app/register/page.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { register } from "@/features/auth/api/auth.api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded border p-2"
          />
        </label>
        {error && <p role="alert" className="text-red-600">{error}</p>}
        <button disabled={submitting} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
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

**Penjelasan yang mudah diucapkan:** “State adalah memori komponen. Ketika peserta mengetik, `onChange` memanggil setter, React merender ulang, dan `value` menampilkan isi state terbaru. Saat tombol dikirim, `preventDefault` mencegah browser me-reload halaman. Kita tunggu `register`, lalu tampilkan sukses atau error. `submitting` mencegah klik ganda.”

`"use client"` diperlukan karena halaman memakai state, event form, dan nanti browser storage. Validasi `required`/`minLength` membantu UX, tetapi validasi yang berwenang tetap DTO backend.

**Checkpoint 7:** buka `http://localhost:3000/register`; buat akun Bob; buka kembali `/register`, lalu coba email yang sama lagi dan lihat pesan `409`. Form sengaja diganti dengan halaman sukses setelah pendaftaran pertama, jadi perlu membukanya kembali. Pada tab Network, tunjukkan request `POST /auth/register` dan respons aman tanpa hash.

## 8. Frontend tahap kedua: login dan simpan bukti login

**Tujuan kecil:** setelah login, browser mempunyai access token untuk request berikutnya. Agar mudah didemokan, token disimpan pada `sessionStorage` tab saat ini. Token tetap ada saat halaman di-refresh dalam tab yang sama dan hilang ketika tab ditutup.

Buat `frontend/src/features/auth/session.ts`:

```ts
const TOKEN_KEY = "workshop_access_token";

export function saveToken(token: string) {
  window.sessionStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return window.sessionStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  window.sessionStorage.removeItem(TOKEN_KEY);
}
```

**Bedah baris:** `TOKEN_KEY` adalah nama penyimpanan, bukan secret. `saveToken` dipanggil setelah login berhasil. `getToken` dipanggil saat membuat request protected. `clearToken` dipanggil saat logout atau backend menolak token. Modul ini hanya dipakai dari kode yang berjalan di browser; jangan memanggil `window` saat render Server Component.

Buat `frontend/src/app/login/page.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { login } from "@/features/auth/api/auth.api";
import { saveToken } from "@/features/auth/session";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
        <button disabled={submitting} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
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

**Bedah alur:** `login()` mengirim email/password ke endpoint publik; backend memeriksa bcrypt dan mengembalikan token. `saveToken()` menyimpan token **setelah** respons sukses. `router.replace('/tasks')` berpindah halaman tanpa menaruh halaman login sebagai langkah “kembali” setelah berhasil login. Pada App Router, `useRouter` diimpor dari `next/navigation`.

**Checkpoint 8:** password salah menampilkan error dan tidak menyimpan token. Password benar menghasilkan item `workshop_access_token` pada Session Storage. Jangan menyalin token sungguhan ke chat, screenshot publik, atau repository.

> **Batasan keamanan pilihan workshop:** JavaScript di halaman dapat membaca `sessionStorage`, sehingga XSS juga dapat membaca token. Penyimpanan ini dipilih untuk memperlihatkan `Authorization: Bearer ...` dengan jelas, **bukan pola sesi produksi yang direkomendasikan**. Untuk aplikasi nyata, evaluasi session/cookie `HttpOnly`, `Secure`, `SameSite` yang diatur server atau BFF, perlindungan CSRF untuk cookie, HTTPS, rate limit login, dan kebijakan rotasi/revokasi token. Menghapus token lokal saat logout tidak membatalkan JWT yang sudah terbit; token itu masih valid sampai kedaluwarsa kecuali ada mekanisme revokasi.

## 9. Frontend tahap ketiga: tempel token ke semua request task

**Tujuan kecil:** cukup satu tempat untuk memasang header `Authorization`; seluruh fungsi task tetap punya bentuk pemanggilan yang sama seperti Day 2.

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

**Bedah baris:** `getToken()` membaca token pada saat request dibuat, bukan saat module pertama di-load. `new Headers(options.headers)` mempertahankan header pemanggil, misalnya `Content-Type`. `Authorization` berisi skema `Bearer` dan token. `401` membersihkan sesi tab lalu membuka login; status lain tetap diteruskan agar pemanggil dapat menampilkan error yang sesuai. Fungsi ini memang untuk **Client Component/browser** pada arsitektur latihan ini.

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

**Kenapa memanggil `/auth/me`?** Login sudah memberi user publik, tetapi `/auth/me` membuktikan token tersimpan benar-benar dapat dipakai lagi setelah navigasi atau refresh. Nama/email yang ditampilkan nantinya berasal dari server, bukan hasil membaca payload JWT di browser.

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

**Bedah baris:** URL dan token sekarang dikumpulkan di `authFetch`; `tasks.api.ts` tetap menjelaskan aksi bisnis `GET/POST/PATCH/DELETE`. Input create/update hanya berisi field task; **tidak ada `userId`**. Type `Task` lama boleh tetap karena field yang dipakai UI belum berubah; respons backend boleh punya tambahan `userId`.

### 9d. Rapikan halaman Tasks dan satu request toggle

Di kode saat ini, `handleToggle` dalam `frontend/src/app/tasks/page.tsx` melakukan `fetch` PATCH langsung ke `http://localhost:3001` **lalu** memanggil `updateTask()`, sehingga satu klik mengirim dua PATCH. Setelah endpoint diproteksi, request langsung itu tidak membawa token dan akan `401`. Ganti isi halaman menjadi berikut; struktur `TasksPage -> TaskView -> TaskForm/TaskItem` tetap dipakai:

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

**Bedah alur halaman:**

1. `useState` menyimpan user, task, loading, dan error. State adalah memori komponen; perubahan state memicu tampilan baru.
2. `useEffect` memanggil `/auth/me`, lalu `/tasks` setelah halaman muncul di browser. `active` mencegah respons request lama mengubah state setelah halaman ditinggalkan.
3. `handleToggle` sekarang hanya memanggil `updateTask` **sekali**; fungsi API itu otomatis menempelkan token. Error mutasi ditangkap ke `actionError` supaya tidak menjadi promise rejection tanpa pesan UI.
4. `handleCreateTask` menambahkan task hasil API ke state parent, sama seperti pola Day 2.
5. `handleLogout` menghapus token dan data dari state, lalu menuju login. Logout ini bersifat lokal; tidak mencabut JWT yang sudah beredar.
6. `TaskView`, `TaskForm`, dan `TaskItem` tetap memakai props/callback yang sama. `TaskForm` memanggil `createTask()` dari API client yang kini authenticated.

### 9e. Tampilkan error saat membuat task

`TaskForm` Day 2 langsung memanggil `createTask()` tanpa `try/catch`. Jika token kedaluwarsa atau API gagal, promise dapat ditolak tanpa pesan yang mudah dipahami. Ganti isi `frontend/src/features/tasks/components/task-form.tsx` dengan versi kecil berikut:

```tsx
import { useState } from "react";
import { Task } from "../types/task";
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
    setError("");
    setSubmitting(true);

    try {
      const newTask = await createTask({ title, description });
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
        className="w-full rounded border p-2"
      />
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Task description"
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

**Bedah baris:** `try` menunggu server membuat task, lalu memberi hasilnya ke callback parent. Input baru dikosongkan setelah keduanya berhasil. `catch` menampilkan error; `finally` melepas tombol agar bisa dicoba lagi. Jika errornya `401`, `authFetch` juga menghapus token dan mengarahkan pengguna ke login. Props dan struktur komponen Day 2 tetap sama.

**Checkpoint 9:** login Alice, buat/toggle/hapus task sambil buka tab Network. Setiap request ke `/auth/me` dan `/tasks` membawa header `Authorization: Bearer ...`; satu klik toggle menghasilkan **satu** PATCH. Pada mode development React Strict Mode, `useEffect` dapat membuat dua GET awal; flag `active` mencegah update state usang, tetapi tidak membatalkan request. Bedakan hal itu dari bug dua PATCH saat toggle. Logout, buka `/tasks` lagi, lalu lihat redirect ke `/login`. Redirect client membantu pengalaman pengguna; pengamanan data sebenarnya tetap berada di guard dan filter backend.

## 10. Uji dua akun dan jelaskan status HTTP

Lakukan pengujian API sebelum demo UI. Alice sudah didaftarkan di langkah 3; daftarkan Bob dengan email berbeda. Login keduanya dan salin token dari respons ke variabel shell **di terminal latihan pribadi**, bukan ke file repository:

```bash
curl -i http://localhost:3001/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"bob@example.com","password":"passwordBob123"}'

curl -i http://localhost:3001/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@example.com","password":"contohPassword123"}'

curl -i http://localhost:3001/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"bob@example.com","password":"passwordBob123"}'
```

Jika Bob sudah dibuat pada tahap frontend, request register Bob akan `409`; langsung gunakan login.

Simpan token yang diterima:

```bash
TOKEN_A='tempel-token-Alice'
TOKEN_B='tempel-token-Bob'
```

Alice membuat task. Catat `id` dari respons, lalu isi `TASK_ID`:

```bash
curl -i http://localhost:3001/tasks \
  -H "Authorization: Bearer $TOKEN_A" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Task Alice","description":"Hanya Alice yang boleh mengubah"}'

TASK_ID='isi-id-task-Alice'
```

Periksa batas kepemilikan:

```bash
curl -i http://localhost:3001/tasks

curl -i http://localhost:3001/tasks -H "Authorization: Bearer $TOKEN_A"
curl -i http://localhost:3001/tasks -H "Authorization: Bearer $TOKEN_B"

curl -i "http://localhost:3001/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN_B"

curl -i -X PATCH "http://localhost:3001/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN_B" \
  -H 'Content-Type: application/json' \
  -d '{"completed":true}'

curl -i -X DELETE "http://localhost:3001/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN_B"

curl -i "http://localhost:3001/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN_A"

curl -i -X PATCH "http://localhost:3001/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN_A" \
  -H 'Content-Type: application/json' \
  -d '{"completed":true}'

curl -i http://localhost:3001/tasks \
  -H "Authorization: Bearer $TOKEN_A" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Mencoba userId palsu","userId":999}'

curl -i -X DELETE "http://localhost:3001/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN_A"
```

Urutan ini sengaja menguji DELETE Alice **terakhir** agar task masih ada saat semua tes GET/PATCH dijalankan. Untuk menguji ulang DELETE, buat task baru dan gunakan ID barunya.

| Skenario | Hasil yang diharapkan | Penjelasan untuk peserta |
| --- | --- | --- |
| Register email baru | `201` | User dibuat; hash tidak keluar. |
| Register email sama | `409` | Constraint unik email bekerja. |
| Login password salah | `401` | Bukti identitas gagal. |
| `/auth/me` atau `/tasks` tanpa token | `401` | Guard menolak sebelum controller. |
| JWT rusak/kedaluwarsa | `401` | Tanda tangan/masa berlaku gagal diverifikasi. |
| Alice melihat daftar | Task Alice muncul | Query memakai `where: { userId: Alice }`. |
| Bob melihat daftar | Task Alice tidak muncul | Query memakai `where: { userId: Bob }`. |
| Bob GET/PATCH/DELETE ID task Alice | `404` | Task itu tidak cocok dengan pasangan `id + userId`. |
| Alice GET/PATCH/DELETE task sendiri | `200` | Identitas dan kepemilikan cocok. |
| Body task menyertakan `userId` orang lain | `400` | `ValidationPipe` menolak field DTO yang tidak dikenal. |

**Demo frontend dua akun:** login Alice dan buat task; logout; login Bob dan pastikan daftar kosong; logout; login Alice dan pastikan task Alice masih ada. Untuk demo paralel, gunakan profil browser atau jendela privat terpisah agar sesi kedua akun benar-benar terpisah.

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
| `Nest can't resolve dependencies` untuk guard/service | Pastikan `AuthModule` mengimpor `PrismaModule`, menyediakan dan mengekspor guard; `TasksModule` mengimpor `AuthModule`. |
| Browser menerima CORS error | Pastikan alamat frontend sesuai `FRONTEND_URL` backend (default `http://localhost:3000`) dan Nest direstart. |
| Semua request task `401` | Lihat header Authorization di Network, secret backend, masa berlaku JWT, dan apakah token tersimpan di tab itu. |
| Toggle mengirim dua PATCH | Hapus `fetch` langsung lama dari `tasks/page.tsx`; cukup `updateTask()`. |
| Menjalankan seed lama gagal | Seed Day 2 belum mengisi `userId`; gunakan pilihan seed baru di bawah. |

## 11. Pilihan seed untuk Day 3

Jika perlu data contoh otomatis, ubah `backend/prisma/seed.ts` agar membuat task **untuk satu user demo**. Seed lama tidak lagi cocok karena task wajib memiliki pemilik. Jangan memakai password demo tetap di source code. Tambahkan `SEED_USER_EMAIL` dan `SEED_USER_PASSWORD` ke `backend/.env` **khusus database lokal latihan**, kemudian gunakan pola berikut:

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

**Bedah pilihan seed:** `upsert` membuat user demo hanya jika belum ada; `count` mencegah task contoh berlipat saat seed diulang; setiap task mempunyai `userId`. Pemeriksaan byte menjaga perilaku bcrypt sama dengan register. `update: {}` sengaja tidak mengganti password akun lama saat seed diulang, sehingga `SEED_USER_PASSWORD` hanya berlaku ketika akun seed **baru dibuat**. Seed ini hanya untuk database latihan. Jika peserta sudah membuat Alice/Bob manual, seed tidak diperlukan.

## Penutup yang bisa diucapkan fasilitator

“Register menyimpan **hash**, bukan password. Login membandingkan password dengan hash lalu menerbitkan token yang ditandatangani. Guard memverifikasi token dan menaruh ID user di request. Service mengambil ID itu untuk setiap query Task. Jadi bahkan kalau Bob menebak ID task Alice atau mengirim `userId` palsu, server tetap tidak memberinya akses. Frontend menyimpan token dan mengirimnya pada setiap request, tetapi keputusan aman tetap dibuat backend.”

**Latihan mandiri:** minta peserta membuat dua akun dan membuktikan empat hal tanpa melihat kode: daftar terpisah, akses ID milik orang lain `404`, request tanpa token `401`, dan satu klik toggle hanya satu PATCH. Setelah itu, minta mereka menunjukkan tepat baris kode yang menyebabkan setiap hasil.

## Rujukan konsep resmi

- [NestJS: hashing dengan bcrypt](https://docs.nestjs.com/v11/security/encryption-and-hashing)
- [NestJS 11: JWT bearer dan guard](https://docs.nestjs.com/v11/security/authentication)
- [NestJS: validasi request](https://docs.nestjs.com/techniques/validation)
- [Prisma: relasi satu ke banyak](https://docs.prisma.io/docs/orm/prisma-schema/data-model/relations/one-to-many-relations)
- [Prisma 7: generate setelah migrate dev](https://docs.prisma.io/docs/guides/upgrade-prisma-orm/v7)
- [Next.js App Router: Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js App Router: autentikasi dan sesi](https://nextjs.org/docs/app/guides/authentication)
