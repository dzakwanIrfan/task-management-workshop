# Day 2 Workshop — Next.js CRUD Frontend untuk Task

Materi ini mengikuti struktur frontend pada `day-2-checkpoint`, sebelum authentication. Untuk live coding, mulai dari `day-2-starter`; proyek Next.js sudah ada pada branch itu, lalu halaman `/tasks` ditulis ulang dari JSX statis sampai terhubung ke API NestJS. Pemisahan ke `TaskForm`, `TaskItem`, dan `TaskView` dilakukan setelah alur CRUD dalam satu halaman dipahami. Rujukan "checkout saat ini/utama" di bawah berarti checkpoint Day 2, bukan `main` yang sudah memakai JWT.

**Cara memakai contoh kode:** langkah 1–3 adalah latihan sementara dengan data di browser. Pada langkah 5, kode lokal itu diganti ketika mulai memakai API. Potongan kode yang menyebut “tambahkan” disisipkan ke file pada langkah tersebut; potongan yang menyebut “ganti” menggantikan versi sebelumnya. Jangan menyimpan dua handler bernama sama. Kode lengkap pada langkah 9–10 adalah acuan hasil akhir, jadi tidak perlu ditempel ulang setelah peserta menyelesaikan langkah sebelumnya.

## Target pembelajaran

Pada akhir sesi, peserta bisa menelusuri alur satu interaksi sampai data di database berubah:

```text
Pengguna klik / mengetik
  → React membaca event
  → frontend mengirim HTTP request ke NestJS
  → NestJS membaca / mengubah Task di PostgreSQL
  → respons JSON diterima frontend
  → setState memperbarui tampilan
```

Halaman `/tasks` akan menampilkan form, daftar task, status selesai/belum, loading, error, dan empty state. Form edit judul/deskripsi belum dibuat; `PATCH` pada sesi ini hanya mengubah `completed`. Authentication dan kepemilikan task dibahas pada [Day 3](./day-3-auth-nextjs-nestjs.md).

| Aksi di UI | HTTP ke NestJS | Respons sukses | Perubahan di React |
| --- | --- | --- | --- |
| Buka halaman | `GET /tasks` | `200`, array task | `setTasks(data)` |
| Kirim form | `POST /tasks` | `201`, task baru | tambah task ke array |
| Klik status task | `PATCH /tasks/:id` | `200`, task terbaru | ganti satu item dalam array |
| Klik Delete | `DELETE /tasks/:id` | `200`, task terhapus | buang satu item dari array |

Backend juga mempunyai `GET /tasks/:id`, tetapi dashboard saat ini tidak memerlukan halaman detail. Semua task masih merupakan daftar bersama karena model Day 2 belum mempunyai pemilik.

Hubungan dengan Day 1: NestJS sudah menyediakan endpoint dan PostgreSQL menyimpan task. Di Day 2, browser memanggil endpoint tersebut dengan `fetch`. Setelah respons berhasil diterima, React memperbarui state sehingga daftar di halaman mengikuti data dari server.

## 0. Persiapan dan peta proyek

### 0a. Kenali file yang akan dipakai

Pada `day-2-checkpoint`, `frontend/src/app/tasks/page.tsx`, `tasks.api.ts`, `TaskForm`, `TaskItem`, dan `TaskView` sudah ada. Di `day-2-starter`, proyek Next.js dan halaman awal sudah ada, tetapi file fitur belum lengkap. Ganti isi `page.tsx` sesuai langkah 1, lalu tambahkan file sesuai urutan materi. Kode di checkpoint dipakai sebagai acuan struktur; di akhir materi ada perbaikan perilaku checkpoint yang ditandai secara eksplisit.

Folder yang perlu dibuka bersama peserta:

| File | Peran dalam materi |
| --- | --- |
| `frontend/src/app/page.tsx` | Halaman `/` dan tautan menuju `/tasks`. |
| `frontend/src/app/tasks/page.tsx` | Halaman `/tasks`; pada hasil akhir memiliki state daftar, loading, error, dan handler. |
| `frontend/src/features/tasks/types/task.ts` | Bentuk data task yang diterima frontend. |
| `frontend/src/features/tasks/api/tasks.api.ts` | Fungsi `fetch` untuk GET, POST, PATCH, DELETE. |
| `frontend/src/features/tasks/components/task-form.tsx` | Input judul/deskripsi dan proses membuat task. |
| `frontend/src/features/tasks/components/task-item.tsx` | Tampilan satu task dan tombol aksinya. |
| `frontend/src/features/tasks/components/task-view.tsx` | Menyusun form, daftar, loading, dan error. |
| `frontend/.env` | Alamat API yang dibaca kode browser. File ini diabaikan Git. |

Proyek memakai **Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, dan pnpm**. Semua perintah frontend di bawah dijalankan dari `frontend/`, karena root repo tidak memiliki satu `package.json` gabungan.

### 0b. Pastikan API Day 1 berjalan

Gunakan backend dan database latihan yang disiapkan pada [Day 1](./day-1-nestjs-crud-postgresql.md). Jalankan perintah berikut dari root **worktree latihan Day 2**, bukan repo `main`. Di terminal pertama:

```bash
cd backend
pnpm install
pnpm start:dev
```

Di terminal kedua, uji langsung NestJS sebelum menyalahkan frontend:

```bash
curl -i http://localhost:3001/tasks
```

Respons normal adalah status `200` dan JSON array seperti `[]` atau daftar task. Jika koneksi database gagal di sini, perbaiki backend/database dahulu. `GET /tasks` tanpa data **tetap sukses** dengan array kosong.

Buat `frontend/.env` jika belum ada di salinan kerja peserta. Template `frontend/.env.example` tersedia di `main` (belum ada pada checkpoint historis):

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Lalu jalankan frontend di terminal ketiga:

```bash
cd frontend
pnpm install
pnpm dev
```

Buka `http://localhost:3000`. Di backend, `main.ts` saat ini mengizinkan origin `FRONTEND_URL` atau `http://localhost:3000` melalui CORS. Jika frontend memakai port lain, sesuaikan `FRONTEND_URL` di backend dan restart backend. Setelah mengubah `frontend/.env`, restart `pnpm dev`. Nilai `NEXT_PUBLIC_` dikirim ke browser dan dibekukan saat build; **jangan** menaruh password database atau secret di sana.

```text
Browser :3000 ──fetch──> NestJS :3001 ──Prisma──> PostgreSQL
```

**Bedakan tiga alamat:** `localhost:3000` adalah halaman Next.js, `localhost:3001` adalah API NestJS, dan alamat PostgreSQL hanya dipakai backend. CORS adalah aturan browser untuk mengizinkan request lintas origin; CORS tidak memverifikasi siapa pemanggil API.

**Verifikasi sebelum coding:** `curl` harus menghasilkan `200` dan JSON array. Browser membuka Next.js di `3000`; request ke API menuju NestJS di `3001`. Jika `curl` gagal, periksa backend dan database lebih dulu. Jika `curl` berhasil tetapi request dari browser gagal, periksa `NEXT_PUBLIC_API_URL` dan pengaturan CORS.

## 1. Fundamental App Router: tampilkan dashboard statis dahulu

Di App Router, folder menentukan route: `src/app/page.tsx` dirender untuk `/`, sedangkan `src/app/tasks/page.tsx` untuk `/tasks`. Secara default, page adalah **Server Component**. Kita belum memakai state, event handler, atau browser API pada contoh pertama ini, sehingga `"use client"` belum diperlukan.

Di beranda proyek sudah ada pola tautan ini:

```tsx
import Link from "next/link";

// Di dalam JSX halaman /
<Link href="/tasks">View Tasks</Link>
```

`Link` adalah navigasi Next.js. Nilai `href="/tasks"` cocok dengan folder `app/tasks/`.

Untuk tahap pertama, **ganti seluruh isi** `frontend/src/app/tasks/page.tsx` sementara dengan:

```tsx
const sampleTasks = [
  { id: 1, title: "Belajar Next.js", completed: false },
  { id: 2, title: "Hubungkan API NestJS", completed: true },
];

export default function TasksPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">Tasks</h1>
      <p className="mb-6 text-gray-600">Manage your tasks here.</p>

      <ul className="space-y-3">
        {sampleTasks.map((task) => (
          <li key={task.id} className="rounded-lg border bg-white p-4">
            <h2 className="font-semibold text-gray-900">{task.title}</h2>
            <p className="text-sm text-gray-600">
              {task.completed ? "Completed" : "Incomplete"}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

**Yang perlu dijelaskan saat membaca kode:**

- `sampleTasks` adalah array JavaScript yang nilainya ditulis langsung di file. Halaman selalu menampilkan dua data ini, terlepas dari isi database.
- `export default function TasksPage()` adalah komponen page yang dipakai Next.js untuk route `/tasks`. Nilai yang dikembalikan fungsi ini adalah JSX untuk halaman.
- `<main>` membungkus konten utama, `<ul>` adalah daftar, dan setiap `<li>` mewakili satu task. `className` berisi kelas Tailwind untuk jarak, lebar, border, dan warna; kelas CSS tidak memengaruhi alur datanya.
- `{sampleTasks.map((task) => ...)}` menjalankan `map` atas array. Callback menerima satu `task` dan menghasilkan satu `<li>`. Jika array berisi dua objek, React menerima dua elemen daftar.
- `key={task.id}` memberi identitas stabil untuk setiap elemen hasil `map`. Ketika nanti daftar berubah, React dapat mencocokkan elemen dengan task yang sama.
- `task.completed ? "Completed" : "Incomplete"` memilih teks berdasarkan nilai boolean `completed`.

**Verifikasi:** buka `/tasks` dan pastikan dua task contoh terlihat. Di Network tab belum ada request `GET /tasks` ke NestJS. Tambahan data di PostgreSQL tidak akan muncul di tahap ini karena `sampleTasks` tidak berasal dari API.

## 2. Dari data statis ke state lokal

Sekarang daftar harus berubah ketika status task diklik. `useState` menyimpan nilai yang dibaca pada setiap render dan menyediakan setter untuk meminta React merender ulang dengan nilai baru. Jika hanya mengubah variabel atau properti objek biasa, React tidak mendapat update state yang dapat dipakai untuk memperbarui UI.

Sekarang **ganti isi** `page.tsx` tahap 1 dengan contoh lokal berikut. Ini masih belum menghubungi backend:

```tsx
"use client";

import { useState } from "react";

type LocalTask = {
  id: number;
  title: string;
  completed: boolean;
};

const initialTasks: LocalTask[] = [
  { id: 1, title: "Belajar Next.js", completed: false },
  { id: 2, title: "Hubungkan API NestJS", completed: true },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<LocalTask[]>(initialTasks);

  function handleToggle(id: number) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">Tasks</h1>
      <p className="mb-6 text-gray-600">Manage your tasks here.</p>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task.id} className="rounded-lg border bg-white p-4">
            <h2 className="font-semibold text-gray-900">{task.title}</h2>
            <button type="button" onClick={() => handleToggle(task.id)}>
              {task.completed ? "Completed" : "Incomplete"}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

**Baca kode sesuai urutan interaksinya:**

1. `"use client"` menandai `page.tsx` sebagai entry point Client Component. `useState` dan `onClick` dipakai untuk interaksi di browser. Page `/` tetap dapat menjadi Server Component. Next.js masih dapat mengirim HTML awal untuk Client Component; directive ini menentukan tempat logic interaksinya berjalan.
2. `type LocalTask` mendefinisikan bentuk objek selama latihan lokal. `useState<LocalTask[]>(initialTasks)` membuat `tasks` sebagai array task dan `setTasks` sebagai fungsi update-nya. Ini bantuan TypeScript saat coding; data dari jaringan tetap harus diperlakukan sebagai data runtime.
3. `onClick={() => handleToggle(task.id)}` mendaftarkan callback. Fungsi baru dipanggil ketika tombol diklik. Bentuk `onClick={handleToggle(task.id)}` justru memanggil handler saat render.
4. `handleToggle` menerima ID task yang diklik. `setTasks((currentTasks) => ...)` memakai nilai state terakhir, lalu `map` menghasilkan array baru. Untuk ID yang cocok, spread `{ ...task }` menyalin field lama dan `completed: !task.completed` membalik statusnya. Objek lain dikembalikan tanpa perubahan.
5. Setelah setter dipanggil, React merender ulang. Ekspresi `task.completed ? ... : ...` sekarang membaca nilai terbaru sehingga teks tombol berubah. Mengubah `task.completed` secara langsung akan memutasi objek state lama; karena itu update dilakukan dengan array dan objek baru.

**Verifikasi:** klik status beberapa kali. Teks berubah tanpa request ke API. Setelah refresh, dua nilai awal tampil lagi karena `initialTasks` dibaca ulang; belum ada perubahan yang disimpan di PostgreSQL.

## 3. Form terkontrol sebelum mengenalkan POST

Sebelum mengirim HTTP request, peserta perlu paham bagaimana nilai input masuk ke React. Tambahkan **di dalam** `TasksPage`, setelah state `tasks`:

```tsx
const [title, setTitle] = useState("");

function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
  event.preventDefault();

  const cleanTitle = title.trim();
  if (!cleanTitle) return;

  const newTask: LocalTask = {
    id: Date.now(),
    title: cleanTitle,
    completed: false,
  };

  setTasks((currentTasks) => [...currentTasks, newTask]);
  setTitle("");
}
```

Tambahkan **sebelum** `<ul>` di JSX halaman:

```tsx
<form onSubmit={handleSubmit} className="mb-6 flex gap-2">
  <input
    value={title}
    onChange={(event) => setTitle(event.target.value)}
    placeholder="Task title"
    className="flex-1 rounded border p-2"
  />
  <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white">
    Add Task
  </button>
</form>
```

**Urutan yang terjadi ketika form dipakai:**

1. `value={title}` menghubungkan nilai input ke state `title`. `onChange` membaca `event.target.value` setiap kali pengguna mengetik dan memanggil `setTitle`. React merender ulang input dengan nilai state terbaru. Pola ini disebut **controlled input**.
2. Tombol `type="submit"` mengaktifkan `onSubmit` pada `<form>`. `event.preventDefault()` menghentikan submit HTML bawaan yang akan memuat ulang halaman.
3. `title.trim()` menghapus spasi di awal dan akhir. Kondisi `if (!cleanTitle) return` menghentikan pembuatan task ketika isi input hanya spasi.
4. `Date.now()` dipakai sebagai ID sementara untuk contoh lokal. Nilai ini tidak menjamin ID unik jika beberapa item dibuat pada waktu yang sangat berdekatan; tahap ini hanya memperlihatkan render daftar. Setelah memakai API, ID dari database menggantikan nilai buatan browser tersebut.
5. `setTasks((currentTasks) => [...currentTasks, newTask])` menghasilkan array baru dengan satu task tambahan. `setTitle("")` mengosongkan input setelah update diminta.

**Verifikasi:** ketik judul dan klik Add Task. Task baru muncul tanpa reload, tetapi hilang setelah halaman di-refresh. State `title` dan `tasks` sama-sama berada di `TasksPage` pada tahap ini; keduanya dibuat ulang saat halaman dimuat kembali.

## 4. Sepakati bentuk JSON antara NestJS dan Next.js

Sebelum menulis `fetch`, buka `backend/src/tasks/tasks.controller.ts` serta DTO create/update dari Day 1. `TasksController` menentukan route dan method HTTP; DTO menentukan field serta validasi body request. `CreateTaskDto` mensyaratkan `title` berupa string tidak kosong dengan batas 120 karakter dan menerima `description` opsional sampai 500 karakter. `UpdateTaskDto` menerima field opsional, termasuk `completed` yang harus boolean. Tipe TypeScript di frontend membantu kita membentuk request saat coding, sedangkan `ValidationPipe` di backend memeriksa data yang benar-benar dikirim pada runtime.

Buat atau samakan `frontend/src/features/tasks/types/task.ts`:

```ts
export type Task = {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskInput = {
  title: string;
  description?: string | null;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string | null;
  completed?: boolean;
};
```

**Bedah field:**

- `Task` adalah bentuk objek **hasil dari API**. `id` dari database bernilai angka; `completed` boolean.
- `description?: string | null` menampung field yang mungkin tidak ada atau bernilai `null` dari database. Di tampilan, nilai kosong boleh tidak ditampilkan.
- `createdAt`/`updatedAt` bertipe `string` di browser karena tanggal pada JSON dikirim sebagai teks. Ini berbeda dengan objek `Date` di kode backend.
- `CreateTaskInput` hanya berisi data yang boleh dikirim ketika membuat task; ID/tanggal dibuat server.
- `UpdateTaskInput` mengizinkan field yang ingin diubah saja. Dashboard Day 2 hanya mengirim `completed`, walau backend juga menerima perubahan judul/deskripsi.

Contoh request POST yang bisa didemokan sebelum frontend:

```bash
curl -i -X POST http://localhost:3001/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Task dari curl","description":"Data latihan Day 2"}'
```

**Verifikasi kontrak:** request `curl` menghasilkan `201` dengan objek Task berisi `id`, `createdAt`, dan `updatedAt` dari server. Panggil `GET /tasks` lagi dan pastikan task tersebut ada. Dengan contoh ini, perbedaan `CreateTaskInput` (body POST), `UpdateTaskInput` (body PATCH), dan `Task` (respons API) terlihat dari data nyata.

## 5. GET: ambil data saat halaman dibuka

### 5a. Tulis satu fungsi API dahulu

Buat `frontend/src/features/tasks/api/tasks.api.ts` dengan fungsi pertama:

```ts
import type { Task } from "../types/task";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`);

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
}
```

**Bedah baris:**

- `import type` hanya membawa informasi TypeScript. Tidak menambah kode tipe ke JavaScript di browser.
- `process.env.NEXT_PUBLIC_API_URL` membaca alamat `http://localhost:3001` yang kita siapkan. Variabel ini **publik**. Pastikan `.env` ada di root `frontend/`, bukan di `src/`.
- `fetch` tanpa opsi memakai method GET. `await` menunggu respons HTTP.
- `fetch` **tidak otomatis melempar error untuk status 400/500**. Karena itu kita cek `response.ok`; jika gagal, `throw` masuk ke `catch` di halaman.
- `response.json()` membaca body respons. `Promise<Task[]>` adalah janji tipe saat coding, bukan pemeriksaan otomatis atas JSON tak tepercaya.

### 5b. Ganti data contoh dengan `useEffect`

Di `page.tsx`, hapus `initialTasks` dan inisialisasi daftar dengan `[]`. Tambahkan state loading/error dan effect. Ini **potongan yang masuk ke dalam `TasksPage`**, bukan komponen baru:

```tsx
const [tasks, setTasks] = useState<Task[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<Error | null>(null);

useEffect(() => {
  async function loadTasks() {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch {
      setError(new Error("Gagal mengambil task. Periksa backend dan koneksi."));
    } finally {
      setLoading(false);
    }
  }

  void loadTasks();
}, []);
```

Import yang sekarang diperlukan di bagian atas file:

```tsx
"use client";

import { useEffect, useState } from "react";
import { getTasks } from "@/features/tasks/api/tasks.api";
import type { Task } from "@/features/tasks/types/task";
```

Render loading/error sebelum tampilan utama:

```tsx
if (loading) return <p className="p-6">Loading tasks...</p>;
if (error) return <p className="p-6" role="alert">{error.message}</p>;
```

**Bedah alur:** `useEffect(..., [])` menjalankan efek setelah halaman terpasang di browser. Fungsi `loadTasks` dibuat di dalam effect karena callback effect sendiri tidak dibuat `async`. Awalnya `loading=true`; setelah request selesai, `finally` membuatnya `false` baik berhasil maupun gagal. Bila berhasil, `setTasks(data)` menyimpan respons, lalu JSX yang sudah dibuat pada tahap 2 menggambar setiap task. Bila gagal, kita menyimpan objek `Error` dan menampilkan `error.message`. `void loadTasks()` menunjukkan bahwa promise dari fungsi tersebut sengaja tidak ditunggu oleh effect; error jaringan sudah ditangani di `try/catch`.

Untuk sementara, **hapus** state `title`, fungsi `handleSubmit`, dan elemen `<form>` lokal tahap 3. Hapus juga fungsi `handleToggle(id: number)` lokal. Supaya file tetap berjalan, **ganti tombol status** di dalam `tasks.map` yang masih memanggil `handleToggle(task.id)` dengan teks biasa berikut:

```tsx
<span>{task.completed ? "Completed" : "Incomplete"}</span>
```

Langkah 6–8 akan mengembalikan aksi-aksi itu dengan data database. `LocalTask` dan `initialTasks` diganti oleh `Task` dari file types dan state awal `[]`. Jika data dari `curl` muncul di layar, GET sudah terhubung.

> **Catatan tentang kode saat ini:** checkout utama menambahkan `setTimeout` dua detik sebelum `getTasks()` untuk memperlihatkan spinner. Itu jeda demo, bukan waktu yang diperlukan API. Panduan ini tidak menambahkannya agar peserta mengamati durasi request yang nyata.

> **Catatan Development:** dalam `next dev`, React Strict Mode dapat membuat effect awal terlihat berjalan dua kali. Dua GET awal di Network tab bisa berasal dari pemeriksaan development. Ini berbeda dari bug dua PATCH per **satu klik** yang dijelaskan pada langkah 7.

**Verifikasi langkah 5:** buka DevTools → Network → Fetch/XHR, refresh `/tasks`, lalu buka respons `GET /tasks`. Cocokkan `id`, `title`, dan `completed` pada JSON dengan kartu yang dirender. Hentikan backend sementara dan refresh lagi: request gagal, `catch` mengisi `error`, lalu halaman menampilkan pesan setelah `finally` mengubah `loading` menjadi `false`. Nyalakan kembali backend sebelum melanjutkan.

## 6. POST: form mengirim JSON, parent menambah respons

### 6a. Tambahkan fungsi create pada file API yang sama

Di `tasks.api.ts`, ganti import type menjadi `import type { Task, CreateTaskInput } from "../types/task";`, lalu tambahkan fungsi berikut **di bawah** `getTasks`:

```ts
export async function createTask(input: CreateTaskInput): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  return response.json();
}
```

Pada fungsi ini, `method: "POST"` memilih route create di `TasksController`. Header `Content-Type: application/json` membuat body dibaca sebagai JSON oleh NestJS. `JSON.stringify(input)` mengubah object TypeScript menjadi teks request body. `response.ok` perlu diperiksa karena `fetch` tetap resolve saat server membalas `400`; hanya error jaringan yang otomatis membuat Promise reject. Jika sukses, `response.json()` membaca Task hasil database, termasuk `id`, `completed`, dan timestamp. Object dari respons inilah yang dipakai untuk memperbarui daftar agar state mengikuti nilai yang benar-benar disimpan server.

### 6b. Buat `TaskForm` yang hanya mengurus input form

Buat `frontend/src/features/tasks/components/task-form.tsx`:

```tsx
import { useState } from "react";
import { createTask } from "../api/tasks.api";
import type { Task } from "../types/task";

type TaskFormProps = {
  onCreated: (newTask: Task) => Promise<void>;
};

export function TaskForm({ onCreated }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || submitting) return;

    try {
      setSubmitting(true);
      setFormError(null);
      const newTask = await createTask({
        title: cleanTitle,
        description: description.trim(),
      });
      await onCreated(newTask);
      setTitle("");
      setDescription("");
    } catch {
      setFormError("Gagal membuat task. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Task title"
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
      {formError && <p role="alert" className="text-red-600">{formError}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
      >
        {submitting ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}
```

**Baca `TaskForm` sesuai urutan submit:**

- `TaskFormProps` adalah kontrak antara anak dan induk. Anak menerima callback `onCreated`; ia tidak mengubah array `tasks` milik halaman secara langsung.
- `title`/`description` adalah state lokal form. Tiap ketikan masuk melalui `onChange`, setter, render ulang, lalu `value` terbaru.
- `event.preventDefault()` menahan submit HTML bawaan. `title.trim()` membuang spasi di awal/akhir sebelum validasi lokal dan POST. `if (!cleanTitle || submitting)` menghentikan request untuk judul kosong dan klik berulang saat request belum selesai.
- `submitting` menonaktifkan tombol selama request berlangsung; `finally` mengembalikannya ke `false` pada jalur sukses maupun gagal.
- `required`/`maxLength` membantu pengguna sebelum request. DTO backend tetap memvalidasi input karena browser bisa dilewati dengan `curl`.
- `await createTask(...)` menunggu POST dan parsing respons. Setelah Task dari server tersedia, `await onCreated(newTask)` memanggil callback halaman. Input dikosongkan hanya pada jalur sukses; saat request gagal, nilai input tetap ada untuk dicoba lagi.
- `catch` mengisi `formError` untuk dirender lewat elemen `role="alert"`. Versi checkout saat ini belum menampilkan error atau status submit; dua state ini ditambahkan pada acuan workshop agar kegagalan request terlihat.

Di `TasksPage`, tambahkan `import { TaskForm } from "@/features/tasks/components/task-form";` di bagian atas. Buat callback untuk memperbarui array dan tampilkan form sebelum daftar:

```tsx
async function handleCreateTask(newTask: Task) {
  setTasks((currentTasks) => [...currentTasks, newTask]);
}

// Di JSX, sebelum <ul>:
<TaskForm onCreated={handleCreateTask} />
```

`TaskForm` tidak memiliki array daftar. `onCreated` adalah props yang menunjuk `handleCreateTask` di `TasksPage`. Setelah POST mengembalikan Task baru, callback itu memanggil `setTasks((currentTasks) => [...currentTasks, newTask])`. React merender ulang daftar dengan Task hasil server, sehingga ID dan nilai default berasal dari database.

**Verifikasi langkah 6:** isi judul dan deskripsi, kirim form, lalu periksa satu `POST /tasks` berstatus `201` pada Network tab. Respons berisi Task baru dengan ID dari database; kartu dengan ID itu muncul dan tetap ada setelah refresh. Ketika backend dihentikan lalu form dikirim lagi, request gagal, input tetap terisi, dan `formError` tampil.

## 7. PATCH: ubah status dengan satu request

Di `tasks.api.ts`, ganti import type menjadi `import type { Task, CreateTaskInput, UpdateTaskInput } from "../types/task";`, lalu tambahkan fungsi:

```ts
export async function updateTask(
  id: number,
  input: UpdateTaskInput,
): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to update task");
  }

  return response.json();
}
```

Di `TasksPage`, ganti import API menjadi `import { getTasks, updateTask } from "@/features/tasks/api/tasks.api";`. Tambahkan state error aksi dan handler ini:

```tsx
const [actionError, setActionError] = useState<string | null>(null);

async function handleToggle(task: Task) {
  try {
    setActionError(null);
    const updatedTask = await updateTask(task.id, {
      completed: !task.completed,
    });
    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === updatedTask.id ? updatedTask : currentTask,
      ),
    );
  } catch {
    setActionError("Gagal mengubah status task. Coba lagi.");
  }
}
```

Sementara sebelum komponen `TaskItem` dibuat, **ganti** `<span>` status biasa dari langkah 5 pada tiap `<li>` dengan tombol berikut:

```tsx
<button type="button" onClick={() => void handleToggle(task)}>
  {task.completed ? "Completed" : "Incomplete"}
</button>
```

Tampilkan `{actionError && <p role="alert">{actionError}</p>}` di atas daftar.

**Baca PATCH dari klik sampai render ulang:** tombol mengirim object `task` yang sedang dirender ke `handleToggle`. Ekspresi `!task.completed` membentuk nilai boolean berikutnya, lalu `updateTask(task.id, { completed: ... })` mengirim PATCH. Service backend menyimpan perubahan dan mengembalikan Task terbaru. `setTasks(...map...)` membuat array baru: item dengan `id` yang sama diganti oleh `updatedTask`, item lain tetap. Jika request gagal, eksekusi masuk `catch` dan `setTasks` tidak dijalankan; UI tetap menampilkan nilai sebelumnya dan `actionError` memberi informasi kegagalan. `void` pada callback klik menyatakan bahwa React tidak menunggu Promise handler, sementara `try/catch` di dalam handler tetap menangani error.

**Perbedaan penting dari checkout saat ini:** `frontend/src/app/tasks/page.tsx` sekarang melakukan `fetch` PATCH langsung ke URL yang ditulis keras, **lalu** memanggil `updateTask()` yang melakukan PATCH kedua. Satu klik menghasilkan dua request. Pada tahap ini, gunakan **hanya** `updateTask()` di atas. Ini sekaligus memastikan semua URL API berasal dari satu tempat, `NEXT_PUBLIC_API_URL`.

**Verifikasi langkah 7:** klik status satu Task sekali dan periksa satu PATCH pada Network tab. Request body berisi `completed` sebagai boolean; respons berisi nilai terbaru yang dipakai `setTasks`. Setelah refresh, status tetap sama karena GET membaca perubahan dari PostgreSQL. Pada development, dua GET awal akibat Strict Mode merupakan kejadian berbeda dari dua PATCH untuk satu klik.

## 8. DELETE: hapus data dan pahami event bubbling

Tambahkan fungsi terakhir di `tasks.api.ts` (import type dari langkah 7 tetap sama):

```ts
export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
}
```

`Promise<void>` berarti pemanggil tidak membutuhkan body respons. Backend Day 1 saat ini sebenarnya mengembalikan task yang dihapus dengan status `200`; untuk kebutuhan daftar, cukup periksa status suksesnya.

Di `TasksPage`, ganti import API menjadi `import { deleteTask, getTasks, updateTask } from "@/features/tasks/api/tasks.api";`, lalu tambahkan:

```tsx
async function handleDelete(task: Task) {
  if (!window.confirm(`Are you sure you want to delete ${task.title}?`)) {
    return;
  }

  try {
    setActionError(null);
    await deleteTask(task.id);
    setTasks((currentTasks) =>
      currentTasks.filter((currentTask) => currentTask.id !== task.id),
    );
  } catch {
    setActionError("Gagal menghapus task. Coba lagi.");
  }
}
```

Tambahkan tombol Delete di tiap task:

```tsx
<button type="button" onClick={() => void handleDelete(task)}>
  Delete
</button>
```

**Baca DELETE sesuai urutan eksekusi:** `window.confirm(...)` meminta keputusan pengguna sebelum request dikirim. Jika pengguna memilih Cancel, `return` menghentikan handler, sehingga tidak ada DELETE. Setelah konfirmasi, `await deleteTask(task.id)` menunggu respons sukses dari backend. Baru kemudian `setTasks(...filter...)` membuat array baru tanpa Task yang ID-nya dihapus. Jika request gagal, kode masuk `catch`, `setTasks` tidak dipanggil, dan `actionError` ditampilkan. Urutan ini membuat daftar tetap sesuai dengan data server setelah aksi selesai.

Pada contoh tahap ini, tombol status dan Delete adalah dua tombol terpisah sehingga klik Delete tidak memicu toggle. Pada struktur komponen checkout, **seluruh kartu** menjadi area klik untuk toggle. Tombol Delete berada di dalam kartu. Event klik akan “naik” ke parent (`event bubbling`), sehingga `TaskItem` perlu `event.stopPropagation()`; lihat tahap 9.

**Verifikasi langkah 8:** pilih Cancel dan pastikan Network tab tidak menampilkan DELETE. Pilih OK dan pastikan ada satu DELETE yang sukses; Task hilang dari daftar dan tetap tidak ada setelah refresh. Jika backend dimatikan sebelum DELETE, pesan error muncul dan item tetap terlihat karena `filter` hanya dijalankan sesudah respons sukses.

## 9. Pisahkan komponen sesuai struktur proyek

Sampai tahap 8, semua JSX daftar dan handler mudah dilihat dalam satu file. Setelah peserta memahami alurnya, pisahkan berdasarkan tanggung jawab yang **memang dipakai repository**:

```text
TasksPage  = pemilik tasks/loading/error; memuat GET dan handler PATCH/DELETE
    │
    ▼ props
TaskView  = menyusun loading, error, form, dan daftar
    ├── TaskForm = state input; POST; lapor hasil dengan onCreated
    └── TaskItem = menampilkan satu task; memanggil handleToggle/handleDelete
```

### 9a. `TaskItem`: satu kartu menerima data dan callback

Buat `frontend/src/features/tasks/components/task-item.tsx`:

```tsx
import type { Task } from "../types/task";

type TaskItemProps = {
  task: Task;
  handleToggle: (task: Task) => Promise<void>;
  handleDelete: (task: Task) => Promise<void>;
};

export function TaskItem({ task, handleToggle, handleDelete }: TaskItemProps) {
  return (
    <li
      className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50"
      onClick={() => void handleToggle(task)}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-lg font-semibold text-gray-900">{task.title}</h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            task.completed
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {task.completed ? "Completed" : "Incomplete"}
        </span>
      </div>
      {task.description && (
        <p className="mt-2 text-sm leading-6 text-gray-600">
          {task.description}
        </p>
      )}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          className="cursor-pointer px-3 py-1 text-sm text-red-600 hover:bg-red-50"
          onClick={(event) => {
            event.stopPropagation();
            void handleDelete(task);
          }}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
```

**Bedah props dan event:** `task` adalah data yang mengalir dari parent ke child. `handleToggle` dan `handleDelete` adalah fungsi dari parent yang dikirim sebagai props; child memanggilnya ketika terjadi klik. `event.stopPropagation()` menghentikan klik Delete sebelum mencapai `onClick` pada `<li>`, supaya task tidak ikut di-toggle. `key` **tidak** ditulis di `<li>` ini karena React membutuhkan `key` pada `<TaskItem>` di tempat `map` dijalankan.

> Seluruh `<li>` sebagai target klik mengikuti tampilan repo sekarang. Untuk latihan aksesibilitas lanjutan, jadikan status sebagai `<button>` tersendiri agar dapat diaktifkan dengan keyboard. Itu perbaikan UI setelah peserta memahami event dan CRUD dasar.

### 9b. `TaskView`: menerima state dan menyusun tampilan

Buat `frontend/src/features/tasks/components/task-view.tsx`:

```tsx
import type { Task } from "../types/task";
import { TaskForm } from "./task-form";
import { TaskItem } from "./task-item";

type TaskViewProps = {
  tasks: Task[];
  loading: boolean;
  error: Error | null;
  actionError?: string | null;
  handleCreateTask: (newTask: Task) => Promise<void>;
  handleToggle: (task: Task) => Promise<void>;
  handleDelete: (task: Task) => Promise<void>;
};

export function TaskView({
  tasks,
  loading,
  error,
  actionError,
  handleCreateTask,
  handleToggle,
  handleDelete,
}: TaskViewProps) {
  if (loading) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <p className="text-gray-600">Manage your tasks here.</p>
        <span className="mx-auto mt-4 block h-4 w-4 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </main>
    );
  }

  if (error) {
    return <p role="alert" className="p-6 text-red-600">{error.message}</p>;
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">Tasks</h1>
      <p className="mb-6 text-gray-600">Manage your tasks here.</p>

      <TaskForm onCreated={handleCreateTask} />
      {actionError && (
        <p role="alert" className="mt-4 text-red-600">{actionError}</p>
      )}

      {tasks.length === 0 ? (
        <p className="mt-6 text-gray-600">Belum ada task. Tambahkan yang pertama.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              handleToggle={handleToggle}
              handleDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
```

**Bedah cabang render:** `loading` ditangani dulu supaya layar tidak tampak kosong ketika GET belum selesai. `error` untuk kegagalan GET menghalangi daftar karena kita belum berhasil memuat data awal. `actionError` untuk PATCH/DELETE ditampilkan **bersama daftar**, sebab data yang sudah terlihat masih berguna. `tasks.length === 0` membedakan “berhasil memuat daftar kosong” dari “masih loading”. `key={task.id}` berada pada `<TaskItem>` yang langsung dihasilkan `tasks.map`.

`TaskView` dan komponen yang di-import oleh halaman Client Component masuk ke bagian yang berjalan di browser. Tidak perlu menambah `"use client"` pada setiap file anak dalam susunan ini; batasnya sudah ada di `app/tasks/page.tsx`. `actionError` dibuat opsional agar halaman lanjutan Day 3 yang tidak mengirim prop ini tetap cocok.

### 9c. `TasksPage`: pemilik state daftar dan handler

Setelah JSX dipindah ke `TaskView`, **ganti isi akhir** `frontend/src/app/tasks/page.tsx` dengan:

```tsx
"use client";

import { useEffect, useState } from "react";
import {
  deleteTask,
  getTasks,
  updateTask,
} from "@/features/tasks/api/tasks.api";
import { TaskView } from "@/features/tasks/components/task-view";
import type { Task } from "@/features/tasks/types/task";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch {
        setError(new Error("Gagal mengambil task. Periksa backend dan koneksi."));
      } finally {
        setLoading(false);
      }
    }

    void loadTasks();
  }, []);

  async function handleCreateTask(newTask: Task) {
    setTasks((currentTasks) => [...currentTasks, newTask]);
  }

  async function handleToggle(task: Task) {
    try {
      setActionError(null);
      const updatedTask = await updateTask(task.id, {
        completed: !task.completed,
      });
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === updatedTask.id ? updatedTask : currentTask,
        ),
      );
    } catch {
      setActionError("Gagal mengubah status task. Coba lagi.");
    }
  }

  async function handleDelete(task: Task) {
    if (!window.confirm(`Are you sure you want to delete ${task.title}?`)) {
      return;
    }

    try {
      setActionError(null);
      await deleteTask(task.id);
      setTasks((currentTasks) =>
        currentTasks.filter((currentTask) => currentTask.id !== task.id),
      );
    } catch {
      setActionError("Gagal menghapus task. Coba lagi.");
    }
  }

  return (
    <TaskView
      tasks={tasks}
      loading={loading}
      error={error}
      actionError={actionError}
      handleCreateTask={handleCreateTask}
      handleToggle={handleToggle}
      handleDelete={handleDelete}
    />
  );
}
```

**Bedah bagian akhir:**

- Hanya `TasksPage` yang memiliki daftar `tasks`. `TaskView` membaca daftar melalui props; ia tidak membuat daftar kedua.
- `loading` dan `error` menjelaskan proses GET pertama. `actionError` menjelaskan masalah pada aksi yang dilakukan sesudah daftar tampil.
- `handleCreateTask` menerima task baru dari `TaskForm` dan menambahkannya. Bentuk `async` membuat tipe callback-nya `Promise<void>`, sesuai `TaskForm` dan panduan Day 3; `TaskForm` tetap pemilik teks inputnya.
- `handleToggle` dan `handleDelete` melakukan request lalu mengubah state **setelah respons sukses**. Keduanya menangkap error agar klik gagal tidak menghasilkan promise yang tidak ditangani.
- `TaskView` menerima nilai dan callback. Dengan cara ini, perubahan API tetap di halaman/API helper, sedangkan tampilan kartu tetap sederhana.

**Alur props dan callback:** `TasksPage` menyimpan array `tasks`, lalu mengirimnya sebagai props ke `TaskView`. Saat `TaskView` menjalankan `tasks.map`, setiap object Task dikirim sebagai props `task` ke `TaskItem`. Klik pada item memanggil callback `handleToggle` yang berasal dari `TasksPage`. Setelah PATCH sukses, `TasksPage` menjalankan `setTasks`, React merender ulang `TaskView`, dan `TaskItem` menerima props Task yang sudah diperbarui. Alur ini bisa ditelusuri langsung dari deklarasi props dan pemanggilan callback di tiga file.

**Verifikasi langkah 9:** setelah file dipisah, ulangi GET, POST, PATCH, dan DELETE. Respons dan tampilan harus sama dengan langkah 8. Buka `TaskForm` serta `TaskItem`: keduanya memanggil callback melalui props, sedangkan `setTasks` tetap berada di `TasksPage`.

## 10. Acuan akhir file API dan perbedaan dengan checkout

Setelah menambah fungsi satu per satu pada tahap 5–8, `frontend/src/features/tasks/api/tasks.api.ts` seharusnya berisi empat fungsi berikut. Gunakan ini untuk membandingkan hasil peserta, **bukan** untuk ditempel lagi bila fungsi-fungsi tadi sudah ada:

```ts
import type { Task, CreateTaskInput, UpdateTaskInput } from "../types/task";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`);
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return response.json();
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("Failed to create task");
  return response.json();
}

export async function updateTask(
  id: number,
  input: UpdateTaskInput,
): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("Failed to update task");
  return response.json();
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete task");
}
```

Perbandingan antara checkout utama dan kode akhir yang dibangun selama workshop:

| Di checkout saat ini | Dalam acuan akhir workshop | Alasan |
| --- | --- | --- |
| GET ditunda buatan selama 2 detik. | GET dimulai langsung. | Loading mengikuti durasi request nyata. |
| Satu klik toggle mengirim PATCH langsung **dan** `updateTask()`. | Satu klik memanggil `updateTask()` sekali. | Satu aksi menghasilkan satu request dan URL tetap terpusat. |
| Error saat POST/PATCH/DELETE belum ditampilkan ke pengguna. | Form dan halaman menampilkan pesan sederhana. | Peserta dapat membedakan request gagal dari aksi sukses. |
| Daftar kosong hanya berupa `<ul>` kosong. | Ada teks “Belum ada task”. | Empty state berbeda dari loading/error. |

Tabel ini juga menjelaskan mengapa hasil live coding dapat berbeda dari checkout utama walaupun keduanya memakai struktur folder dan kontrak API yang sama. Perubahan pada contoh workshop hanya berada dalam potongan kode panduan sampai peserta menerapkannya. Day 3 menambahkan token dan pembatasan Task berdasarkan user di atas alur CRUD ini.

## 11. Uji alur end-to-end

Jalankan kedua aplikasi. Dari `frontend/` jalankan pemeriksaan kode:

```bash
pnpm lint
pnpm exec tsc --noEmit --incremental false
pnpm build
```

Ketiga perintah itu memeriksa lint, tipe, dan build; **bukan** bukti bahwa database dan interaksi browser berhasil. Untuk itu, buka `/tasks` dan DevTools → Network:

| Percobaan | Yang dicari di layar | Yang dicari di Network |
| --- | --- | --- |
| Refresh saat backend hidup | Daftar atau empty state | Respons GET `/tasks` `200` dan JSON array. Dalam dev, GET awal dapat terlihat dua kali karena Strict Mode. |
| Tambah task | Kartu baru, input kosong | Satu POST `201`; body memuat judul/deskripsi; respons memuat ID. |
| Toggle sekali | Badge berubah | **Satu PATCH per klik** dengan `completed` boolean. |
| Delete → Cancel | Kartu tetap ada | Tidak ada DELETE. |
| Delete → OK | Kartu hilang | Satu DELETE sukses. |
| Refresh lagi | Hasil tambah/ubah/hapus tetap | GET menunjukkan data yang sudah tersimpan. |
| Backend berhenti | Pesan error GET atau aksi | Request gagal; perubahan gagal tidak dianggap sukses. |

Setelah uji, telusuri satu Task dari POST hingga DELETE dengan data yang sama. Respons POST menjadi sumber `id` dan nilai default di state. PATCH mengirim `completed` sebagai boolean lalu mengganti satu object berdasarkan ID melalui `map`; DELETE menghapus object itu dari array melalui `filter` setelah respons sukses. Pada refresh berikutnya, GET membaca keadaan terbaru dari PostgreSQL. Gunakan Network tab untuk menunjukkan bahwa React state mengikuti respons server, bukan menggantikan penyimpanan database.

Bedakan pula `loading` dari empty state: saat `loading=true`, hasil GET belum diketahui; array kosong setelah GET `200` berarti database memang belum mengembalikan Task. `NEXT_PUBLIC_API_URL` boleh dipakai browser karena berisi alamat API, sedangkan `DATABASE_URL` dan kredensial PostgreSQL hanya dipakai backend. CORS menentukan apakah browser dapat mengirim request lintas origin; pembatasan Task berdasarkan user baru ditambahkan pada Day 3 melalui authentication dan filter query backend.

### Masalah yang sering muncul

| Gejala | Cek pertama |
| --- | --- |
| `Failed to fetch` | NestJS masih hidup di `3001`? `curl /tasks` sukses? `frontend/.env` sudah dibuat dan Next sudah direstart? |
| Error CORS di console browser | Origin frontend sama dengan `FRONTEND_URL` backend? Jika frontend pindah port, perbarui origin backend lalu restart. |
| POST `400` | `title` terisi dan maksimal 120 karakter? `description` maksimal 500? Lihat body dan respons di Network. |
| UI tidak berubah sesudah request | Handler memanggil setter? `map`/`filter` mengembalikan array baru? ID yang dibandingkan benar? |
| Dua PATCH untuk satu klik | Periksa apakah `handleToggle` masih mempunyai `fetch(...)` langsung **sekaligus** `updateTask(...)`; sisakan satu. |
| Task hilang setelah refresh | Apakah tadi hanya memakai data/state lokal tahap 2–3? Periksa POST sukses dan respons GET setelah refresh. |

Pada akhir Day 2, browser masih dapat meminta seluruh Task tanpa identitas. Day 3 menambahkan register, login, JWT pada request, dan filter Task berdasarkan ID user yang diverifikasi NestJS. Panduan Day 3 berangkat dari checkout utama sebelum perapian Day 2 ini. Jika peserta meneruskan hasil latihannya, bagian Day 3 yang kembali membahas error form atau PATCH ganda dapat dibaca sebagai pemeriksaan terhadap kode yang sudah dibuat; fokus perubahan berikutnya adalah authentication dan ownership. Kontrak props contoh akhir Day 2 sudah cocok dengan halaman pengganti Day 3.

## Referensi lanjutan

- [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — batas `"use client"` dan interaksi browser.
- [Next.js: Environment Variables](https://nextjs.org/docs/app/guides/environment-variables) — aturan `NEXT_PUBLIC_`.
- [React: `useEffect`](https://react.dev/reference/react/useEffect) — efek setelah render dan perilaku development.
- [React: Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state) — `map`, `filter`, dan array baru.
