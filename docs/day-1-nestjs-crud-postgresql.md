# Day 1 Workshop — NestJS CRUD Task + PostgreSQL

> Dokumen ini adalah acuan mengajar berdasarkan backend repository saat ini. `TasksModule`, DTO, `PrismaService`, migrasi awal, dan lima endpoint CRUD sudah tersedia pada checkout utama. Untuk live coding, kita menyusun ulang implementasinya dari route paling sederhana sampai ke query PostgreSQL. Setiap potongan sementara **menggantikan** versi sebelumnya pada tahap berikutnya; jangan menambahkan method dengan nama dan route yang sama dua kali. Day 1 berfokus pada backend. [Day 3](./day-3-auth-nextjs-nestjs.md) menambahkan authentication dan pembatasan task berdasarkan user.

## Hasil akhir dan urutan implementasi

Setelah Day 1, peserta diharapkan bisa menjelaskan alur request dan membangun lima endpoint berikut:

| Operasi | Request | Respons normal | Letak kode |
| --- | --- | --- | --- |
| Buat task | `POST /tasks` | `201` + task baru | Controller → Service → Prisma `create` |
| Daftar task | `GET /tasks` | `200` + array task | Prisma `findMany` |
| Detail task | `GET /tasks/:id` | `200` + satu task | `ParseIntPipe` → Prisma `findUnique` |
| Ubah task | `PATCH /tasks/:id` | `200` + task yang berubah | Update DTO → Prisma `update` |
| Hapus task | `DELETE /tasks/:id` | `200` + task yang dihapus | Cek task → Prisma `delete` |

Urutan live coding:

```text
HTTP dan route
  → controller dengan data statis
  → service dengan data di memori
  → POST dan masalah validasi runtime
  → DTO + ValidationPipe
  → schema Task + migrasi PostgreSQL
  → PrismaService + query database
  → GET by ID → PATCH → DELETE → seed dan uji akhir
```

```text
Client ──HTTP request──> TasksController ──> TasksService ──> PrismaService ──> PostgreSQL
Client <─HTTP response── TasksController <── TasksService <── PrismaService <── PostgreSQL
```

`TasksController` menentukan method dan path HTTP serta mengambil input request. DTO mendefinisikan aturan untuk body, lalu `ValidationPipe` menjalankannya saat request masuk. `TasksService` menjalankan operasi aplikasi dan memanggil Prisma Client melalui `PrismaService`. Hasil query atau exception dari service menentukan respons yang dikirim Nest. Pada tahap awal, service belum memakai Prisma; kita mengganti sumber datanya setelah peserta memahami controller, service, dan validasi.

## 0. Persiapan kelas dan cara memakai checkout

### 0a. Pilih titik awal live coding

Checkout utama sudah memuat implementasi Day 1. Untuk live coding dari awal tanpa mengubah implementasi acuan, siapkan **worktree terpisah** dari commit `945c575`. Perintah ini memerlukan clone Git yang memiliki commit tersebut. Jika materi dibagikan sebagai ZIP atau shallow clone tanpa commit itu, gunakan potongan tahap demi tahap sebagai demonstrasi dan bandingkan dengan checkout utama.

```bash
# Jalankan dari root repository, sekali saja untuk persiapan fasilitator.
git worktree add --detach ../task-management-day1-starter 945c575
cd ../task-management-day1-starter/backend
pnpm install
```

Commit `945c575` berisi kerangka Nest, model `Task`, dan migrasi SQL awal, tetapi belum memiliki `TasksModule` atau `PrismaService`. Peserta dapat menambahkan file sesuai urutan materi. Pada checkout utama, file-file itu sudah ada; gunakan untuk melihat hasil akhir tiap tahap.

Commit awal **belum mempunyai frontend**, dan perubahan di worktree tidak otomatis berpindah ke checkout utama. Untuk melanjutkan hasil coding peserta ke Day 2/3, pindahkan pekerjaan itu ke branch yang akan dipakai sepanjang workshop. Jika tidak, gunakan checkout utama yang sudah memuat frontend dan CRUD final.

Semua perintah `pnpm` dan `prisma` di materi ini dijalankan dari direktori **`backend/`**. Root repository tidak mempunyai `package.json` gabungan. Dependency NestJS, Prisma 7, `class-validator`, `class-transformer`, dan adapter PostgreSQL sudah tercantum di `backend/package.json`.

### 0b. Siapkan PostgreSQL latihan

Repository **tidak** menyediakan Docker Compose atau template `.env`. Gunakan database PostgreSQL yang disiapkan panitia. Jika peserta mempunyai Docker dan memerlukan database lokal sendiri, opsi latihan berikut dapat dipakai:

```bash
docker run -d --name task-day1-postgres \
  -e POSTGRES_USER=workshop \
  -e POSTGRES_PASSWORD=workshop_local_only \
  -e POSTGRES_DB=task_management \
  -p 127.0.0.1:5433:5432 \
  -v task-day1-pgdata:/var/lib/postgresql/data \
  postgres:16
```

Port host `5433` dipilih agar tidak bertabrakan dengan PostgreSQL lain yang mungkin memakai `5432`. Jika container sudah pernah dibuat dan sedang berhenti, gunakan `docker start task-day1-postgres`, bukan menjalankan `docker run` kedua kali. Contoh user/password di sini hanya untuk mesin latihan lokal.

Buat `backend/.env` **pada worktree yang dipakai peserta**, atau sesuaikan file `.env` lokal yang sudah ada. Jangan menyalin nilai kredensial nyata ke materi atau commit:

```dotenv
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL="postgresql://workshop:workshop_local_only@localhost:5433/task_management?schema=public"
```

Jika database panitia punya host/user/password berbeda, gunakan URL yang diberikan panitia. `DATABASE_URL` menunjuk **database yang boleh diubah oleh latihan**, karena migrasi dan seed akan menulis di sana. File `.env` diabaikan Git pada proyek ini.

**Fungsi setiap konfigurasi:**

- `PORT=3001`: Nest mendengarkan request di port 3001; frontend Day 2 memakai port 3000.
- `FRONTEND_URL`: alamat origin yang diizinkan CORS oleh kode akhir `main.ts`. CORS mengatur browser, bukan menggantikan validasi input.
- `DATABASE_URL`: alamat PostgreSQL yang dibaca Prisma CLI untuk migrasi dan oleh Nest saat aplikasi berjalan.
- Tanda kutip pada nilai URL boleh dipakai di file `.env`. Jangan menaruh password database di source code atau di variabel frontend `NEXT_PUBLIC_`.

### 0c. Kenali file yang akan disentuh

| File | Peran |
| --- | --- |
| `backend/src/main.ts` | Menyalakan Nest, pipe global, CORS, dan port. |
| `backend/src/app.module.ts` | Titik masuk daftar module. |
| `backend/src/tasks/tasks.module.ts` | Mendaftarkan controller dan service Task. |
| `backend/src/tasks/tasks.controller.ts` | Menghubungkan method + URL dengan service. |
| `backend/src/tasks/tasks.service.ts` | Operasi Task dan query Prisma. |
| `backend/src/tasks/dto/*.ts` | Aturan input create/update. |
| `backend/prisma/schema.prisma` | Bentuk model Task yang diinginkan. |
| `backend/prisma/migrations/.../migration.sql` | SQL yang benar-benar membuat tabel. |
| `backend/src/prisma/*` | Koneksi Prisma yang dapat di-inject ke module lain. |
| `backend/prisma/seed.ts` | Data contoh opsional; versi saat ini menghapus semua task dahulu. |

Gunakan tabel ini saat peserta membuka repository: route didefinisikan di controller, aturan body di DTO, dan operasi database di service melalui `PrismaService`. Ketiga file tersebut akan ditulis pada waktu yang berbeda sepanjang materi.

## 1. Fundamental HTTP, Nest, dan endpoint paling sederhana

### 1a. Hubungan HTTP method, path, body, dan status

Mulai dari bentuk request yang nanti diterima Nest:

```http
GET /tasks HTTP/1.1
Host: localhost:3001
```

`GET` adalah HTTP method dan `/tasks` adalah path. Kombinasinya memilih handler `GET /tasks` di controller. Respons memiliki status HTTP dan, jika ada data, body. `GET /tasks` meminta daftar; `GET /tasks/7` meminta task dengan ID 7. `POST /tasks` menambahkan body JSON untuk data task baru. Perbedaan method dan path ini yang nanti ditulis melalui dekorator `@Get()`, `@Post()`, dan `@Get(':id')`.

### 1b. Jalankan endpoint bawaan Nest

Pada commit awal, `AppController` sudah menangani `GET /` dan `AppService` mengembalikan `Hello World!`. Untuk memakai port dan `.env` sesuai repository sekarang, ubah `backend/src/app.module.ts` sementara menjadi:

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Ubah `backend/src/main.ts` sementara menjadi:

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
```

**Bedah baris:** `NestFactory.create(AppModule)` membuat aplikasi dari module utama. `ConfigModule.forRoot()` membaca `.env` untuk proses Nest; `isGlobal` membuat `ConfigService` dapat dipakai module lain nanti. `app.listen` mulai menerima request; `PORT` dari `.env` dipakai jika ada, dan `3001` adalah fallback. `bootstrap()` menjalankan fungsi tersebut. Perubahan `.env` membutuhkan **restart** proses Nest.

Jalankan dari `backend/`:

```bash
pnpm start:dev
```

Di terminal lain:

```bash
curl -i http://localhost:3001/
```

**Verifikasi langkah 1:** `curl -i` menampilkan status `200`, header respons, dan body `Hello World!`. Request ini baru melewati `AppController` dan `AppService`. Belum ada query PostgreSQL, jadi respons berhasil di tahap ini belum membuktikan konfigurasi database benar.

## 2. Buat route Task dengan data statis

**Tujuan langkah ini:** membuat `GET /tasks` dan melihat bagaimana `@Controller()` serta `@Get()` membentuk route. Data ditulis langsung di method agar hubungan antara route dan respons terlihat sebelum menambahkan service atau database.

Buat folder `backend/src/tasks/`. Buat `tasks.controller.ts`:

```ts
import { Controller, Get } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Get()
  findAll() {
    return [
      { id: 1, title: 'Belajar NestJS', completed: false },
      { id: 2, title: 'Coba curl', completed: false },
    ];
  }
}
```

Buat `tasks.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';

@Module({
  controllers: [TasksController],
})
export class TasksModule {}
```

Pada `app.module.ts`, tambahkan `import { TasksModule } from './tasks/tasks.module';` lalu masukkan `TasksModule` ke array `imports` yang sudah berisi `ConfigModule.forRoot(...)`. Jangan membuat dekorator `@Module()` kedua.

**Bedah baris:**

1. `@Controller('tasks')` memberi awalan path `/tasks` pada semua method di class.
2. `@Get()` memilih HTTP GET tanpa tambahan path; gabungannya menjadi `GET /tasks`.
3. `return [...]` adalah data statis di memori kode. Nest mengubah object/array itu menjadi JSON response.
4. `TasksModule` mendaftarkan controller agar Nest menemukannya.
5. `AppModule` mengimpor TasksModule agar module ini ikut dibangun saat aplikasi start. File yang ada di disk tetapi tidak didaftarkan belum menjadi route.

```bash
curl -i http://localhost:3001/tasks
```

**Verifikasi langkah 2:** `GET /tasks` mengembalikan `200` dan array dengan dua task sesuai kode. Jika backend di-restart, dua task yang sama tetap muncul karena nilainya merupakan bagian dari source code. Belum ada data yang dibuat melalui request atau disimpan di PostgreSQL.

## 3. Pindahkan pekerjaan ke Service dan pahami dependency injection

**Tujuan langkah ini:** memindahkan operasi Task dari controller ke `TasksService`. Route dan bentuk respons tetap sama; yang berubah adalah lokasi logic pengambilan data. Array sementara berada di service dan masih hidup hanya selama proses Nest berjalan.

Buat `backend/src/tasks/tasks.service.ts`:

```ts
import { Injectable } from '@nestjs/common';

type DemoTask = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
};

@Injectable()
export class TasksService {
  private readonly tasks: DemoTask[] = [
    { id: 1, title: 'Belajar NestJS', completed: false },
    { id: 2, title: 'Coba curl', completed: false },
  ];

  findAll() {
    return this.tasks;
  }
}
```

Ganti isi `tasks.controller.ts` menjadi:

```ts
import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }
}
```

Di `tasks.module.ts`, tambahkan import `TasksService` dan `providers: [TasksService]` pada metadata module yang sudah ada:

```ts
@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
```

**Baca alur dependency injection pada kode:** `@Injectable()` membuat `TasksService` dapat dipakai sebagai provider Nest. `providers: [TasksService]` mendaftarkannya dalam `TasksModule`. Constructor controller menyatakan dependency yang dibutuhkan; saat membangun controller, Nest menyediakan instance `TasksService`. Ketika `GET /tasks` dipanggil, controller menjalankan `tasksService.findAll()` dan Nest mengirim nilai kembalinya sebagai JSON. `private readonly tasks` adalah array dalam proses backend, **belum PostgreSQL**; `readonly` membatasi penggantian referensi property di TypeScript, bukan membuat isi array tidak dapat berubah.

Untuk memperlihatkan peran `providers`, hapus sementara `TasksService` dari array tersebut dan jalankan Nest. Nest gagal membuat `TasksController` karena dependency pada constructor tidak tersedia. Kembalikan `providers: [TasksService]` setelah melihat error, lalu pastikan aplikasi berjalan lagi. Perubahan sementara ini hanya untuk mengamati proses dependency injection.

```bash
curl -i http://localhost:3001/tasks
```

**Verifikasi langkah 3:** `GET /tasks` tetap menghasilkan `200` dan dua task yang sama. Respons HTTP belum berubah karena controller masih mengembalikan hasil `findAll()`; pemindahan array ke service mengubah struktur kode, bukan kontrak endpoint.

## 4. Tambah POST sederhana, lalu tunjukkan mengapa tipe TypeScript belum cukup

**Tujuan langkah ini:** menerima JSON body pada `POST /tasks` dan menambah satu Task ke array sementara. Contoh ini sengaja belum memakai DTO agar terlihat batas tipe TypeScript: anotasi `title: string` membantu saat menulis kode, tetapi tidak memeriksa JSON yang dikirim client pada runtime.

Pada `tasks.service.ts` sementara, tambahkan method di bawah `findAll()`:

```ts
create(body: { title: string; description?: string }) {
  const task: DemoTask = {
    id: this.tasks.length + 1,
    title: body.title,
    description: body.description,
    completed: false,
  };
  this.tasks.push(task);
  return task;
}
```

Pada `tasks.controller.ts`, tambahkan `Body` dan `Post` pada import `@nestjs/common`, lalu tambahkan method ini **di dalam class yang sama**:

```ts
@Post()
create(@Body() body: { title: string; description?: string }) {
  return this.tasksService.create(body);
}
```

**Ikuti request dari controller ke service:** `@Post()` memetakan method POST ke path `/tasks`. `@Body()` mengambil object hasil parsing JSON dan meneruskannya ke `create()`. Service memakai `body.title` dan `body.description` untuk membentuk `DemoTask`, mengisi `completed: false`, lalu `this.tasks.push(task)` menambahnya ke array proses. Nest memakai object yang dikembalikan service sebagai body respons dan default status POST adalah `201`. Nilai `id: this.tasks.length + 1` hanya cukup untuk tahap ini: setelah data dihapus atau beberapa request diproses berdekatan, ID bisa bentrok. Pada tahap database, ID dibuat oleh PostgreSQL melalui `autoincrement()`.

```bash
curl -i http://localhost:3001/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Tulis materi Day 1","description":"Mulai dari controller"}'

curl -i http://localhost:3001/tasks
```

`curl -d` mengirim POST secara otomatis. Respons pertama normalnya `201`, lalu GET menampilkan task baru. Sekarang coba input yang tidak sesuai:

```bash
curl -i http://localhost:3001/tasks \
  -H 'Content-Type: application/json' \
  -d '{"description":"Tidak ada judul"}'
```

Request tanpa `title` masih dapat mencapai method `create()`, karena `title: string` tidak menghasilkan pemeriksaan runtime. TypeScript menghapus anotasi tipe saat dikompilasi; client HTTP tidak menjalankan type checker proyek. Dari respons dan `GET /tasks`, tunjukkan bahwa data yang tidak sesuai kontrak bisa masuk ke array. Inilah alasan tahap berikutnya memasang DTO dan `ValidationPipe`.

**Verifikasi langkah 4:** POST dengan body valid menghasilkan `201` dan GET menampilkan Task baru. POST tanpa `title` menunjukkan bahwa input belum divalidasi oleh aplikasi. Setelah backend di-restart, Task yang dibuat melalui POST hilang karena array dibuat ulang dari nilai awal service.

## 5. DTO dan ValidationPipe: aturan input dijalankan saat request datang

**Tujuan langkah ini:** menjalankan validasi body pada runtime sebelum method controller memanggil service. Kita memakai class DTO untuk aturan field dan `ValidationPipe` global untuk menerapkan aturan tersebut pada request yang masuk.

Buat `backend/src/tasks/dto/create-task.dto.ts`:

```ts
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title!: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
```

**Bedah dekorator per baris:**

- `class` diperlukan agar Nest/class-validator punya metadata runtime; `type` atau `interface` TypeScript saja tidak cukup untuk `ValidationPipe` ini.
- `@IsString()` mewajibkan nilai bertipe string bila field diperiksa.
- `@IsNotEmpty()` menolak `''`, tetapi **tidak** men-trim string; judul berisi spasi saja masih lolos aturan saat ini.
- `@MaxLength(120)` dan `@MaxLength(500)` membatasi panjang teks sesuai DTO yang ada di repo.
- `@IsOptional()` mengizinkan field description tidak dikirim. Pada class-validator, `null` juga dilewati oleh dekorator ini; tipe `description?: string` tidak mengubah perilaku runtime itu.
- Tanda `!` memberi tahu TypeScript bahwa `title` akan diisi dari request yang diproses Nest.

Di `tasks.controller.ts`, import `CreateTaskDto`, lalu **ganti** anotasi body pada method `create`:

```ts
@Post()
create(@Body() body: CreateTaskDto) {
  return this.tasksService.create(body);
}
```

Di `tasks.service.ts`, import DTO dan ganti tipe parameter method `create` menjadi `body: CreateTaskDto`. Isi method in-memory untuk sementara tetap sama.

Sekarang ganti `backend/src/main.ts` dengan versi yang sesuai checkout akhir:

```ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  });

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
```

**Bedah baris yang menentukan:**

1. `app.useGlobalPipes(...)` memasang pemeriksaan input untuk seluruh aplikasi, termasuk method Task yang memakai DTO.
2. `whitelist: true` mengenali hanya property yang memiliki dekorator validasi pada DTO.
3. `forbidNonWhitelisted: true` membuat property asing **ditolak 400**, bukan diam-diam diterima. Dua opsi ini bekerja bersama.
4. `ValidationPipe` memeriksa body memakai metadata class DTO. Dengan `transform: true`, nilai hasil transformasi diteruskan ke handler dan parameter primitif tertentu dapat dikonversi; validasi DTO sendiri tetap dapat berjalan tanpa opsi ini. `ParseIntPipe` yang kita pasang nanti membuat konversi ID URL menjadi eksplisit.
5. `enableCors` mengizinkan browser dari origin frontend yang dikonfigurasi. `curl` tidak memerlukan CORS; CORS tidak menggantikan validasi dan tidak melindungi data.

Restart Nest setelah mengganti konfigurasi, lalu coba:

```bash
# Valid → 201
curl -i http://localhost:3001/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"DTO bekerja","description":"Ada validasi runtime"}'

# Tidak ada title → 400
curl -i http://localhost:3001/tasks \
  -H 'Content-Type: application/json' \
  -d '{"description":"Tanpa title"}'

# Field asing → 400
curl -i http://localhost:3001/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Contoh","role":"admin"}'
```

**Verifikasi langkah 5:** body valid menghasilkan `201`; body tanpa `title` dan body dengan field `role` menghasilkan `400`. Baca pesan pada respons `400`, lalu hubungkan masing-masing dengan decorator DTO atau opsi `forbidNonWhitelisted`. Controller tidak menjalankan `create()` ketika pipe menolak body. Perhatikan bahwa `@IsNotEmpty()` belum menolak judul yang hanya berisi spasi, karena kode belum memanggil `trim()`.

## 6. Kenalkan schema Task, migrasi SQL, dan Prisma Client

**Tujuan langkah ini:** memahami hubungan antara model Prisma, migrasi SQL, dan Prisma Client sebelum mengganti array sementara dengan query database. Model sudah ada pada commit awal latihan; kita membacanya, menerapkan migrasi, lalu generate client yang akan dipakai `PrismaService` pada langkah 7.

### 6a. Baca model yang sudah ada

Di `backend/prisma/schema.prisma`, repository sudah mempunyai:

```prisma
generator client {
  provider     = "prisma-client"
  output       = "../generate/prisma"
  moduleFormat = "cjs"
}

datasource db {
  provider = "postgresql"
}

model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Bedah baris model:**

1. `generator client`: Prisma akan membuat API TypeScript berdasarkan model. Output-nya adalah `backend/generate/prisma`, sehingga file service proyek ini mengimpor `PrismaClient` dari `generate/prisma/client`.
2. `datasource db`: jenis database adalah PostgreSQL. URL koneksi tidak ditaruh di schema, melainkan di `prisma7.config.ts` dan `.env`.
3. `id Int @id @default(autoincrement())`: primary key integer yang diisi database; kita tidak lagi memakai `this.tasks.length + 1`.
4. `title String`: kolom wajib. `description String?`: kolom boleh `NULL`.
5. `completed Boolean @default(false)`: task baru otomatis belum selesai jika client tidak mengirim nilai ini.
6. `createdAt @default(now())`: waktu pembuatan otomatis. `updatedAt @updatedAt`: Prisma memperbarui waktu ketika record berubah.

**Bandingkan model dengan migrasi SQL:** repository sudah menyimpan `backend/prisma/migrations/20260914143720_init_task/migration.sql`. Bagian intinya:

```sql
CREATE TABLE "Task" (
  "id" SERIAL NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "completed" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
```

`SERIAL` adalah integer yang bertambah otomatis; `TEXT NOT NULL` berarti judul wajib; `TEXT` tanpa `NOT NULL` membolehkan description kosong/null; `BOOLEAN ... DEFAULT false` sesuai nilai awal completed; `TIMESTAMP(3)` menyimpan waktu. `PRIMARY KEY ("id")` menjamin identitas unik tiap baris. Schema Prisma menyatakan **bentuk yang diinginkan**; migrasi SQL mengubah database yang nyata; Prisma Client memberi method query bertipe untuk kode Nest.

### 6b. Baca konfigurasi Prisma CLI

File `backend/prisma7.config.ts` yang sudah ada berisi empat hal penting:

```ts
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
});
```

**Bedah baris:** `dotenv/config` membaca `.env` untuk **proses CLI Prisma**. `schema` menunjuk model, `path` menunjuk riwayat migrasi, dan `seed` menunjuk skrip contoh. `datasource.url` adalah alamat DB. Ini berbeda dari `ConfigModule.forRoot()` yang membaca `.env` untuk **proses aplikasi Nest**. Keduanya memakai key `DATABASE_URL` yang sama.

Jika memakai worktree dari commit `945c575`, baris `seed: 'tsx prisma/seed.ts'` **belum ada** karena seed memang dibuat pada commit berikutnya. Itu tidak menghalangi validate/migrate/generate. Tambahkan baris seed baru saat masuk langkah 12, setelah membuat `seed.ts`.

### 6c. Jalankan tiga perintah, satu tujuan per perintah

Dari `backend/` dan dengan PostgreSQL latihan siap:

```bash
pnpm exec prisma validate
pnpm exec prisma migrate dev
pnpm exec prisma generate
```

**Artinya:**

- `validate` mengecek **format schema**. Ini belum membuktikan PostgreSQL dapat dihubungi.
- `migrate dev` menerapkan migrasi yang sudah disimpan repo ke database latihan. Karena `init_task` **sudah ada** di repository, tidak perlu membuat migrasi bernama sama lagi. Bila Anda menyusun schema dari proyek Nest yang benar-benar kosong, barulah `migrate dev --name init_task` membuat migrasi awal.
- `generate` membangun Prisma Client TypeScript. Pada Prisma 7 proyek ini, lakukan eksplisit setelah schema berubah atau setelah menyiapkan checkout awal; jangan mengira `migrate dev` otomatis melakukannya.

CLI proyek ini memang menemukan `prisma7.config.ts` secara otomatis saat perintah di atas dijalankan dari `backend/`. Jika `migrate dev` menawarkan **reset**, berhenti dan periksa bahwa URL benar-benar mengarah ke database latihan yang boleh dihapus; reset dapat menghilangkan data. Jika koneksi gagal, periksa PostgreSQL, port, user/password, nama database, dan `DATABASE_URL` tanpa menampilkan kredensial di layar publik.

**Verifikasi langkah 6:** tabel `Task` muncul di database latihan setelah `migrate dev`. Jika perlu melihatnya lewat UI, jalankan `pnpm exec prisma studio` dari `backend/`. Bandingkan field tabel dengan `schema.prisma` dan `migration.sql`. `GET /tasks` pada tahap ini masih membaca array di `TasksService`, sehingga hasil endpoint belum membuktikan penggunaan database. Perubahan itu baru dilakukan pada langkah 7.

## 7. Buat PrismaService, sambungkan module, ganti array dengan query

**Tujuan langkah ini:** mengganti implementasi `create()` dan `findAll()` agar keduanya memakai PostgreSQL. Route, body request, dan DTO tetap sama. Perubahan difokuskan pada provider koneksi Prisma dan method di `TasksService`.

### 7a. Koneksi Prisma sebagai provider Nest

Buat `backend/src/prisma/prisma.service.ts` sesuai pola repository:

```ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generate/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    const databaseUrl = configService.getOrThrow<string>('DATABASE_URL');
    const adapter = new PrismaPg({ connectionString: databaseUrl });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

**Bedah baris:**

1. `PrismaClient` berasal dari folder hasil `generate`, bukan import default `@prisma/client` pada konfigurasi generator repo ini.
2. `extends PrismaClient` membuat service memiliki method `task.findMany`, `task.create`, dan seterusnya.
3. `ConfigService` mengambil `DATABASE_URL` milik proses Nest. `getOrThrow` gagal jika key hilang; URL kosong/salah tetap akan bermasalah saat koneksi.
4. Prisma 7 dengan PostgreSQL pada repo ini memakai `PrismaPg` adapter. `super({ adapter })` menyerahkannya ke Prisma Client.
5. `onModuleInit` menyambung saat module mulai. `onModuleDestroy` menutup koneksi ketika lifecycle close Nest dijalankan, misalnya lewat `app.close()`; agar sinyal proses seperti Ctrl+C memicu hook ini secara terjamin, aplikasi perlu mengaktifkan shutdown hooks. Dengan demikian satu provider koneksi dapat dipakai service lain.

Buat `backend/src/prisma/prisma.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

`providers` membuat PrismaService di module ini; `exports` mengizinkan module lain yang **mengimpor PrismaModule** memakainya.

### 7b. Perbaiki wiring module sebelum meng-inject service

Ganti `backend/src/tasks/tasks.module.ts` menjadi:

```ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
```

Ganti `backend/src/app.module.ts` menjadi bentuk akhir Day 1:

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**Bedah wiring:** `TasksService` dibuat di `TasksModule`, sehingga module tersebut harus mengimpor `PrismaModule` untuk menerima `PrismaService`. Mengimpor `PrismaModule` hanya di `AppModule` **tidak** otomatis menyediakannya untuk sibling `TasksModule`. `ConfigModule` global menyediakan ConfigService untuk PrismaService. File checkout saat ini memakai alias import `src/prisma/...` pada TasksModule/Service; contoh di materi memakai path relatif `../prisma/...` yang menuju file yang sama.

### 7c. Ganti service sementara dengan query database

Hapus `DemoTask` dan array `private readonly tasks` dari `tasks.service.ts`. Ganti **seluruh isi** file sementara dengan:

```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  create(body: CreateTaskDto) {
    return this.prismaService.task.create({ data: body });
  }

  findAll() {
    return this.prismaService.task.findMany();
  }
}
```

**Ikuti baris pada service:** constructor meminta `PrismaService` yang diekspor `PrismaModule`. Pada `create()`, `data: body` mengirim field hasil validasi DTO ke Prisma; `id` dan `completed` mengikuti default pada schema, `createdAt` diisi saat pembuatan, dan `updatedAt` dikelola Prisma. `findMany()` membaca seluruh baris Task karena belum ada `where`. Kode ini tidak memakai `orderBy`, sehingga urutan daftar tidak ditentukan. Method Prisma mengembalikan Promise; Nest menunggu hasilnya sebelum mengirim respons HTTP.

Pada tahap ini method tidak diberi `async` karena tidak memakai `await`; Promise tetap diteruskan ke Nest. Referensi kode akhir di langkah 11 menulisnya dengan `async` seperti checkout sekarang. Keduanya bekerja untuk alur ini; tidak ada tahap tambahan yang terlewat.

Uji persistensi:

```bash
curl -i http://localhost:3001/tasks

curl -i http://localhost:3001/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Sekarang tersimpan di PostgreSQL"}'

curl -i http://localhost:3001/tasks
```

Restart Nest, lalu ulangi GET. Task baru tetap ada karena sumber datanya sekarang PostgreSQL. Respons task juga memuat `id`, `completed: false`, `createdAt`, dan `updatedAt` dari model. Catat ID hasil POST untuk tahap detail/update/delete; **jangan menebak ID 1** karena database bisa sudah berisi data.

**Verifikasi langkah 7:** setelah POST berhasil, ulangi GET lalu restart Nest dan jalankan GET lagi. Task tetap ada. Bandingkan `findAll()` tahap 3 yang mengembalikan array pada service dengan `findAll()` sekarang yang menjalankan query Prisma. Path dan status HTTP tetap sama, tetapi sumber data dan persistensinya berubah.

## 8. Ambil satu task berdasarkan ID

**Tujuan langkah ini:** menambahkan `GET /tasks/:id` dan membedakan dua kegagalan: parameter path yang bukan integer ditolak `ParseIntPipe` dengan `400`, sedangkan ID integer yang tidak ditemukan oleh Prisma menghasilkan `404` dari service.

Di `backend/src/tasks/tasks.service.ts`, tambahkan `NotFoundException` pada import `@nestjs/common` dan method berikut di bawah `findAll()`:

```ts
async findOne(id: number) {
  const task = await this.prismaService.task.findUnique({
    where: { id },
  });

  if (!task) throw new NotFoundException('Task tidak ditemukan!');
  return task;
}
```

Di controller, tambahkan `Param` dan `ParseIntPipe` ke import Nest, lalu method:

```ts
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.tasksService.findOne(id);
}
```

**Baca request sesuai urutan eksekusi:**

1. `@Get(':id')` menamai satu bagian URL sebagai parameter `id`.
2. `@Param('id', ParseIntPipe)` mengambil bagian itu dan mengubahnya menjadi integer. URL selalu datang sebagai teks; `ParseIntPipe` memberi `400` bila nilainya tidak valid.
3. `findUnique({ where: { id } })` mencari berdasarkan primary key.
4. Jika Prisma mengembalikan `null`, `NotFoundException` menghasilkan `404`; jika ada, service mengembalikan object task.

Gunakan ID yang didapat dari POST tahap 7:

```bash
TASK_ID='ganti-dengan-id-hasil-POST'
curl -i "http://localhost:3001/tasks/$TASK_ID"
curl -i http://localhost:3001/tasks/bukan-angka
curl -i http://localhost:3001/tasks/999999999
```

**Verifikasi langkah 8:** ID dari hasil POST menghasilkan `200`; `/tasks/bukan-angka` menghasilkan `400` sebelum service dipanggil; ID integer yang tidak ada menghasilkan `404` setelah `findUnique()` mengembalikan `null`. Hubungkan tiap status dengan baris kode yang menghasilkannya agar perbedaan validasi parameter dan pencarian data terlihat.

## 9. PATCH: ubah sebagian field

**Tujuan langkah ini:** menambahkan `PATCH /tasks/:id` untuk memperbarui sebagian field. Pada POST, `title` wajib untuk membuat Task baru. Pada PATCH, client cukup mengirim field yang ingin diubah, misalnya `{ "completed": true }`; field yang tidak dikirim tidak perlu diubah.

Buat `backend/src/tasks/dto/update-task.dto.ts` sesuai repository sekarang:

```ts
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @MaxLength(120)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
```

**Bedah baris:** seluruh field opsional karena PATCH boleh mengubah satu field saja. `@IsBoolean()` meminta JSON boolean `true` atau `false`, bukan string `"true"`. `description` dibatasi 500 karakter; `title` 120. `@IsOptional()` juga melewati `null`, jadi aturan DTO saat ini **belum** melindungi kolom database wajib dari `title: null`; itu bahan perbaikan setelah memahami CRUD dasar.

Di service, import `UpdateTaskDto` dan tambahkan:

```ts
async update(id: number, body: UpdateTaskDto) {
  return this.prismaService.task.update({
    where: { id },
    data: { ...body },
  });
}
```

Di controller, tambah `Patch` pada import Nest, import `UpdateTaskDto`, lalu method:

```ts
@Patch(':id')
update(
  @Param('id', ParseIntPipe) id: number,
  @Body() body: UpdateTaskDto,
) {
  return this.tasksService.update(id, body);
}
```

**Bedah baris:** `@Patch(':id')` memetakan sebagian perubahan ke task dengan ID pada URL. `body` hanya berisi field yang dikirim client dan lolos DTO. Spread `{ ...body }` memberikan field itu ke Prisma `data`, sedangkan `where: { id }` memilih baris. `updatedAt` berubah otomatis menurut model.

```bash
curl -i -X PATCH "http://localhost:3001/tasks/$TASK_ID" \
  -H 'Content-Type: application/json' \
  -d '{"completed":true}'

curl -i "http://localhost:3001/tasks/$TASK_ID"

# Ini salah: completed dikirim sebagai string, bukan boolean.
curl -i -X PATCH "http://localhost:3001/tasks/$TASK_ID" \
  -H 'Content-Type: application/json' \
  -d '{"completed":"true"}'
```

**Verifikasi langkah 9:** body `{ "completed": true }` menghasilkan `200` dan nilai `completed` terbaru; body `{ "completed": "true" }` menghasilkan `400` dari `@IsBoolean()`. Periksa bahwa `title` dan `description` tetap sama jika tidak dikirim. DTO menentukan apakah body diterima, sedangkan `task.update()` melakukan perubahan pada baris database.

> **Batas implementasi saat ini:** DTO mengizinkan `PATCH {}` dan `title: ''` karena semua field opsional dan `UpdateTaskDto` tidak memakai `@IsNotEmpty()`. Service juga langsung memanggil Prisma `update`; untuk ID yang tidak ada, error Prisma `P2025` belum diterjemahkan secara eksplisit menjadi `404`. Karena itu, jangan menjanjikan status `404` untuk PATCH ID yang hilang pada kode Day 1. Kasus ini menunjukkan bahwa validasi input dan pemetaan error database perlu ditentukan secara terpisah.

## 10. DELETE: hapus task yang sudah ditemukan

**Tujuan langkah ini:** menambahkan `DELETE /tasks/:id`. Jalankan demo detail dan PATCH lebih dulu, karena DELETE akan menghapus baris yang dipakai dalam pengujian tersebut.

Di service, tambahkan method yang mencerminkan kode saat ini:

```ts
async remove(id: number) {
  const task = await this.findOne(id);
  if (!task) throw new NotFoundException('Task tidak ditemukan');

  const deletedTask = await this.prismaService.task.delete({
    where: { id },
  });
  return deletedTask;
}
```

Di controller, tambahkan `Delete` pada import Nest, lalu:

```ts
@Delete(':id')
remove(@Param('id', ParseIntPipe) id: number) {
  return this.tasksService.remove(id);
}
```

**Bedah baris:** `@Delete(':id')` memilih endpoint hapus. `findOne(id)` mengecek keberadaan; jika ID tidak ada, method itu sudah melempar `NotFoundException` (`404`). `task.delete({where:{id}})` menghapus baris dan mengembalikan record yang dihapus, sehingga respons normal saat ini `200` berisi task. `if (!task)` setelah `findOne` adalah **pemeriksaan berlebih yang ada di checkout saat ini**: `findOne` sudah melempar ketika task tidak ditemukan, jadi kondisi itu tidak tercapai. Tunjukkan kepada peserta sebagai kesempatan membaca alur exception; saat merapikan kode nanti, baris itu bisa dihapus tanpa mengubah perilaku normal. Jika baris terhapus di antara cek dan delete oleh request lain, Prisma masih dapat memberi error yang perlu ditangani terpisah.

```bash
curl -i -X DELETE "http://localhost:3001/tasks/$TASK_ID"
curl -i "http://localhost:3001/tasks/$TASK_ID"
curl -i -X DELETE "http://localhost:3001/tasks/$TASK_ID"
```

**Verifikasi langkah 10:** DELETE pertama menghasilkan `200` dengan Task yang dihapus. GET menggunakan ID yang sama kemudian menghasilkan `404`; DELETE kedua juga `404` karena `findOne()` tidak menemukan Task lagi. Hasil ini hanya berlaku untuk ID yang sudah dicatat dan diuji pada langkah sebelumnya.

## 11. Lihat hasil akhir bersama peserta

Setelah membangun satu method per tahap, bandingkan controller peserta dengan bentuk akhir berikut. Ini **bukan** kode yang ditampilkan di awal kelas; gunakan sebagai pemeriksaan setelah peserta menulis route satu per satu.

```ts
// backend/src/tasks/tasks.controller.ts
import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() body: CreateTaskDto) {
    return this.tasksService.create(body);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }
}
```

Service akhir di checkout menggunakan lima method ini; versi berikut hanya merapikan indentasi dari kode yang ada:

```ts
// backend/src/tasks/tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(body: CreateTaskDto) {
    return this.prismaService.task.create({ data: body });
  }

  async findAll() {
    return this.prismaService.task.findMany();
  }

  async findOne(id: number) {
    const task = await this.prismaService.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task tidak ditemukan!');
    return task;
  }

  async update(id: number, body: UpdateTaskDto) {
    return this.prismaService.task.update({
      where: { id },
      data: { ...body },
    });
  }

  async remove(id: number) {
    const task = await this.findOne(id);
    if (!task) throw new NotFoundException('Task tidak ditemukan');
    const deletedTask = await this.prismaService.task.delete({ where: { id } });
    return deletedTask;
  }
}
```

**Cara membacanya dari atas ke bawah:** decorator controller memilih route; DTO dan pipe memeriksa input; service menerima data yang sudah diproses; Prisma membaca/menulis tabel; Nest mengirim hasil atau exception sebagai respons. Pada Day 1 belum ada `User` atau `userId`: semua task masih berada dalam satu daftar bersama. Day 3 menambahkan autentikasi dan pembatasan berdasarkan pemilik.

## 12. Seed data contoh: opsional dan menghapus task yang ada

Checkout `main` sudah mempunyai `backend/prisma/seed.ts`. Ini **bukan** langkah wajib untuk CRUD; pakai hanya jika fasilitator memang ingin mengisi tiga task contoh pada database latihan. Jika memakai worktree dari commit awal, buat file tersebut pada tahap ini dan pasang `tsx` yang digunakan oleh konfigurasi seed:

```bash
# Hanya untuk worktree awal yang belum memiliki tsx.
pnpm add -D tsx
```

Tambahkan `seed: 'tsx prisma/seed.ts'` di dalam object `migrations` pada `backend/prisma7.config.ts`. Berikut isi seed yang setara dengan checkout akhir:

```ts
// backend/prisma/seed.ts
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generate/prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined!');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.task.deleteMany();

  await prisma.task.createMany({
    data: [
      { title: 'Task 1', description: 'Description for Task 1' },
      { title: 'Task 2', description: 'Description for Task 2' },
      { title: 'Task 3', description: 'Description for Task 3' },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

`deleteMany()` menghapus **seluruh baris Task dalam database yang ditunjuk URL**, lalu `createMany()` membuat tiga baris baru. `.catch` menampilkan kegagalan lalu memanggil `process.exit(1)`; dalam jalur gagal itu proses dapat berhenti sebelum `.finally` selesai. Pada jalur sukses, `.finally` menutup koneksi database. Karena itu, jangan jalankan seed pada database yang berisi pekerjaan peserta yang ingin disimpan.

Dari `backend/`, jalankan hanya pada database latihan yang memang boleh diisi ulang:

```bash
pnpm exec prisma db seed
```

**Hubungan konfigurasi dan perintah:** `db seed` adalah subcommand Prisma CLI dari paket `prisma`, bukan script di `package.json`. Nilai `seed: 'tsx prisma/seed.ts'` pada `prisma7.config.ts` menentukan command yang dijalankan CLI; isi `seed.ts` menentukan operasi database yang dilakukan command itu. Pada Prisma 7, jalankan seed secara eksplisit. Ketiga Task hasil seed Day 1 belum punya pemilik, sehingga sebelum menambahkan kolom `userId` wajib pada Day 3 data ini perlu dihapus atau diberi pemilik lewat migrasi yang direncanakan.

**Verifikasi langkah 12:** setelah seed, `GET /tasks` menampilkan tiga Task contoh. Task manual sebelumnya tidak ada karena `deleteMany()` dijalankan sebelum `createMany()`. Tunjukkan bahwa perubahan ini berasal dari skrip seed, bukan dari endpoint GET.

## 13. Matriks uji Day 1 dan cara menjelaskan hasilnya

Jalankan tes dalam urutan ini agar ID yang dipakai masih ada. Mulai dari database latihan, lalu salin `id` dari hasil POST ke `TASK_ID`:

```bash
# 1. Buat task. Catat ID dari respons.
curl -i http://localhost:3001/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Latihan CRUD","description":"Day 1"}'

TASK_ID='isi-id-dari-respons-POST'

# 2. Baca daftar dan satu task.
curl -i http://localhost:3001/tasks
curl -i "http://localhost:3001/tasks/$TASK_ID"

# 3. Ubah status; cek lagi detailnya.
curl -i -X PATCH "http://localhost:3001/tasks/$TASK_ID" \
  -H 'Content-Type: application/json' \
  -d '{"completed":true}'
curl -i "http://localhost:3001/tasks/$TASK_ID"

# 4. Hapus paling akhir; baca ulang ID yang sama.
curl -i -X DELETE "http://localhost:3001/tasks/$TASK_ID"
curl -i "http://localhost:3001/tasks/$TASK_ID"
```

| Uji | Status yang diharapkan | Penyebab di kode |
| --- | --- | --- |
| `POST /tasks` valid | `201` | Route `@Post`, DTO lolos, Prisma `create`. |
| `GET /tasks` | `200` | `findMany()` mengembalikan array; urutannya tidak ditentukan kode. |
| `GET /tasks/:id` yang ada | `200` | `ParseIntPipe` dan `findUnique` berhasil. |
| `GET /tasks/bukan-angka` | `400` | `ParseIntPipe` menolak format ID. |
| `GET /tasks/999999999` | `404` | `findOne` melempar `NotFoundException`. |
| `PATCH /tasks/:id` yang ada | `200` | Prisma `update` mengembalikan task terbaru. |
| `PATCH` dengan `completed: "true"` | `400` | DTO meminta boolean, bukan string. |
| `DELETE /tasks/:id` yang ada | `200` | `delete` mengembalikan task yang dihapus. |
| `DELETE` ID yang sudah hilang | `404` | `findOne` menolak sebelum `delete`. |
| POST dengan field asing | `400` | Global pipe menolak property yang tidak ada pada DTO. |

**Batas implementasi Day 1 yang perlu dijelaskan:**

- `POST` dengan judul berisi spasi saja lolos `@IsNotEmpty()` karena tidak ada trim. Ini contoh bahwa aturan bisnis dan aturan tipe bisa berbeda.
- `PATCH {}` lolos DTO karena semua field optional. `PATCH` dengan ID yang hilang belum mengubah error Prisma `P2025` menjadi `404` yang konsisten.
- `@IsOptional()` melewati `null` juga; pada kolom wajib seperti `title`, input seperti itu dapat gagal saat Prisma menulis ke database.
- `GET /tasks` belum memakai pagination, sort, atau filter kepemilikan. Seluruh task masih dapat dilihat bersama. Day 3 akan menambahkan user dan membatasi akses ke task milik masing-masing.

Untuk menghubungkan Day 1 dengan materi berikutnya, tunjukkan dua kebutuhan yang belum ditangani kode ini. Menolak body `PATCH {}` memerlukan aturan validasi tambahan. Memisahkan Task per user memerlukan identitas hasil authentication dan filter pada query backend; menyembunyikan Task di tampilan frontend saja tidak membatasi akses lewat HTTP. Keduanya akan lebih mudah dipahami setelah peserta dapat menelusuri route, DTO, service, dan query dari satu request.

### Pemeriksaan kode setelah live coding

Dari `backend/`:

```bash
pnpm exec prisma validate
pnpm exec tsc --noEmit --incremental false
```

Kedua perintah memeriksa schema dan tipe kode. Keduanya **tidak** membuktikan request benar-benar membaca PostgreSQL; gunakan matriks HTTP di atas untuk itu. Test Jest yang ada di `backend/src/tasks/*.spec.ts` saat ini masih berupa starter spec dan belum menyediakan mock/provider untuk dependency service, jadi jangan memakai hasil `pnpm test` sebagai bukti CRUD berfungsi tanpa memperbaiki test-nya terlebih dahulu.

### Bila demo berhenti di tengah

| Gejala | Periksa dahulu |
| --- | --- |
| `ECONNREFUSED` saat migrasi/start | PostgreSQL hidup, port URL sesuai, database ada. |
| `DATABASE_URL` tidak ada | File `backend/.env`, lokasi menjalankan perintah, lalu restart Nest. |
| `Cannot find module 'generate/prisma/client'` | Jalankan `pnpm exec prisma generate` dari `backend/`. |
| `Nest can't resolve dependencies of the TasksService` | `PrismaModule` mengekspor `PrismaService` **dan** `TasksModule` mengimpor `PrismaModule`. |
| `/tasks` memberi `404` padahal file controller ada | `TasksController` ada di TasksModule dan TasksModule diimpor AppModule. |
| DTO tidak menolak input salah | Cek dekorator DTO, anotasi `@Body() body: CreateTaskDto`, dan `ValidationPipe` di `main.ts`. |
| `migrate dev` meminta reset | Periksa URL/database dan riwayat migrasi sebelum menyetujui penghapusan data. |
| Task lama hilang sesudah seed | `seed.ts` memanggil `task.deleteMany()` sebelum membuat contoh. |

## Penutup sesi

Rangkum kembali satu request POST yang sudah dijalankan peserta: `TasksController` menerima body, `ValidationPipe` memeriksanya memakai `CreateTaskDto`, `TasksService` memanggil `PrismaService.task.create()`, lalu hasil dari PostgreSQL dikirim sebagai respons `201`. Pada GET, PATCH, dan DELETE, alur controller ke service tetap sama, tetapi method Prisma dan kemungkinan status error berbeda. Minta peserta membuka satu contoh di Network atau `curl` dan menunjuk baris kode yang menghasilkan status serta body responsnya.

Sampai akhir Day 1, semua Task berada dalam daftar bersama. Day 2 memakai endpoint ini dari Next.js. Day 3 menambahkan model User, authentication, dan filter `userId` pada operasi Task.

## Rujukan resmi

- [NestJS: Controllers](https://docs.nestjs.com/controllers)
- [NestJS: Providers](https://docs.nestjs.com/providers)
- [NestJS: Modules](https://docs.nestjs.com/modules)
- [NestJS 11: ValidationPipe dan ParseIntPipe](https://docs.nestjs.com/v11/techniques/validation)
- [Prisma 7: model, client, dan PostgreSQL adapter](https://docs.prisma.io/docs/orm/v7)
- [Prisma 7: migrasi](https://docs.prisma.io/docs/orm/v7/prisma-migrate)
- [Prisma CLI: `db seed`](https://docs.prisma.io/docs/cli/db/seed)
- [Docker: image resmi PostgreSQL](https://hub.docker.com/_/postgres)
