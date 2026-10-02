# Day 2 Workshop — Next.js CRUD Frontend untuk Task

> **Untuk fasilitator:** materi ini merekonstruksi frontend yang **sudah ada** di repository saat ini. Mulai dari halaman statis, lalu tambah interaksi lokal, sambungkan ke API NestJS, dan terakhir pecah komponennya. Saat live coding, **ganti** potongan tahap sebelumnya; jangan menempelkan fungsi baru di samping fungsi lama yang bernama sama. Contoh akhir mempertahankan struktur proyek sekarang, dengan perbaikan satu request `PATCH` per klik dan penanganan error sederhana yang dijelaskan di bawah.

## Hasil belajar dan batas Day 2

Peserta akan dapat menjelaskan alur berikut tanpa hanya menghafal kode:

```text
Pengguna klik / mengetik
  → React membaca event
  → frontend mengirim HTTP request ke NestJS
  → NestJS membaca / mengubah Task di PostgreSQL
  → respons JSON diterima frontend
  → setState memperbarui tampilan
```

Dashboard sederhana yang dibuat adalah halaman `/tasks`: ada judul, form tambah task, daftar task, status selesai/belum, aksi ubah status dan hapus, serta tampilan loading/error. **Belum ada** grafik, statistik, form edit judul/deskripsi, login, atau pembatasan task per pengguna. Login dan kepemilikan task adalah materi [Day 3](./day-3-auth-nextjs-nestjs.md).

| Aksi di UI | HTTP ke NestJS | Respons sukses | Perubahan di React |
| --- | --- | --- | --- |
| Buka halaman | `GET /tasks` | `200`, array task | `setTasks(data)` |
| Kirim form | `POST /tasks` | `201`, task baru | tambah task ke array |
| Klik status task | `PATCH /tasks/:id` | `200`, task terbaru | ganti satu item dalam array |
| Klik Delete | `DELETE /tasks/:id` | `200`, task terhapus | buang satu item dari array |

Backend juga mempunyai `GET /tasks/:id`, tetapi dashboard saat ini tidak memerlukan halaman detail. Semua task masih merupakan daftar bersama karena model Day 2 belum mempunyai pemilik.

**Kalimat pembuka:** “Kemarin kita membuat dapur API. Hari ini kita membuat layar yang menerima input pengguna dan berbicara dengan dapur itu melalui HTTP. React menyimpan hasil respons untuk menggambar ulang layar.”

## 0. Persiapan dan peta proyek

### 0a. Pakai kode sekarang sebagai target, bukan sebagai titik kosong

Pada checkout utama, `frontend/src/app/tasks/page.tsx`, `tasks.api.ts`, `TaskForm`, `TaskItem`, dan `TaskView` sudah ada. Untuk live coding dari nol, pakai branch latihan atau salinan kerja terpisah, lalu **ganti isi** `frontend/src/app/tasks/page.tsx` dengan versi paling sederhana di langkah 1. File `/tasks` di checkout utama menjadi acuan perbandingan. Jika peserta hanya mengikuti penjelasan tanpa mengubah repo, setiap potongan “sementara” dibaca sebagai tahapan menuju file akhir.

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

Gunakan backend dan database latihan yang disiapkan pada [Day 1](./day-1-nestjs-crud-postgresql.md). Di terminal pertama:

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

Buat `frontend/.env` jika belum ada di salinan kerja peserta:

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

**Checkpoint 0:** minta peserta menyebutkan hasil `curl`, URL frontend, URL backend, dan alasan browser perlu tahu `NEXT_PUBLIC_API_URL`.

## 1. Fundamental App Router: tampilkan dashboard statis dahulu

Next.js App Router memakai folder sebagai path. `src/app/page.tsx` adalah `/`; `src/app/tasks/page.tsx` adalah `/tasks`. File halaman dapat berupa **Server Component** secara default. Halaman yang hanya menampilkan teks dan data statis belum memerlukan `"use client"`.

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

**Bedah baris dan konsep:**

- `sampleTasks` adalah array JavaScript biasa. Belum ada API dan belum ada state.
- `export default function TasksPage()` adalah komponen yang dirender untuk URL `/tasks`.
- `<main>`, `<h1>`, `<ul>`, dan `<li>` adalah struktur HTML; `className` adalah atribut CSS di JSX. Kelas seperti `max-w-3xl` dan `p-6` berasal dari Tailwind yang sudah dikonfigurasi proyek.
- `{sampleTasks.map(...)}` mengubah setiap objek menjadi satu elemen JSX. Kurung kurawal berarti “jalankan ekspresi JavaScript di sini”.
- `key={task.id}` membantu React mencocokkan item lama dan baru; gunakan ID stabil dari task. `key` diletakkan pada elemen yang langsung dihasilkan oleh `map`.
- `task.completed ? ... : ...` adalah pilihan tampilan berdasarkan boolean.

**Checkpoint 1:** buka `/tasks`. Dua kartu terlihat. Buka Network tab: belum ada request ke `localhost:3001/tasks`. Tanya: “Kalau database bertambah, apakah daftar ini berubah?” Jawab: tidak, karena datanya masih ditulis di file.

## 2. Dari data statis ke state lokal

**State adalah memori komponen.** Jika data berubah dan layar perlu menggambar ulang, simpan data itu di state. Variabel JavaScript biasa dapat diubah, tetapi React tidak memakai perubahan variabel biasa sebagai sinyal untuk render ulang.

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

**Bedah baris penting:**

- `"use client"` menandai halaman sebagai batas Client Component. `useState` dan `onClick` perlu berjalan di browser. File beranda `/` tetap bisa menjadi Server Component.
- `type LocalTask` menjelaskan bentuk data **sementara**. TypeScript membantu saat menulis kode, tetapi tipe ini tidak memeriksa respons jaringan saat runtime.
- `useState<LocalTask[]>(initialTasks)` menghasilkan pasangan `tasks` (nilai sekarang) dan `setTasks` (cara meminta render baru). `<LocalTask[]>` berarti state berisi array task.
- `setTasks((currentTasks) => ...)` memakai nilai state terbaru. Bentuk fungsi ini aman saat update datang berdekatan.
- `map` membuat array baru. Untuk task dengan ID yang cocok, `{ ...task, completed: !task.completed }` membuat objek baru dan membalik boolean. Task lain dikembalikan apa adanya. **Jangan** menulis `task.completed = ...` langsung pada objek state.
- `onClick={() => handleToggle(task.id)}` memberi React fungsi untuk dijalankan ketika diklik. Jika ditulis `onClick={handleToggle(task.id)}`, fungsi akan langsung dijalankan saat render.

**Jejak satu klik:** klik tombol → `handleToggle` → `setTasks` → React render ulang → teks `Completed`/`Incomplete` berubah.

**Checkpoint 2:** klik status beberapa kali. Tampilan berubah, tetapi refresh mengembalikan data contoh awal. Itulah batas state lokal: memori halaman tidak sama dengan penyimpanan PostgreSQL.

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

**Jelaskan alur tiap baris:**

1. `value={title}` membuat teks yang tampak berasal dari state.
2. Saat mengetik, `onChange` menerima event dan `setTitle(event.target.value)` menyimpan teks baru.
3. Setter memicu render ulang; JSX membaca `title` terbaru. Ini disebut **controlled input**.
4. Tombol `type="submit"` memicu `onSubmit` pada `<form>`. `event.preventDefault()` mencegah browser memuat ulang halaman.
5. `trim()` membuang spasi di awal/akhir; judul yang hanya berisi spasi tidak ditambahkan.
6. `Date.now()` hanya pembuat ID **sementara untuk latihan lokal**. Pada tahap API, ID diberikan database; jangan kirim ID buatan browser saat POST.
7. `[...currentTasks, newTask]` membuat array baru dengan task tambahan. `setTitle("")` mengosongkan input setelah berhasil menambah.

**Checkpoint 3:** ketik satu judul, klik Add Task, lihat kartu baru tanpa refresh. Refresh halaman: kartu hilang. Tanyakan kepada peserta komponen mana yang “mengingat” teks input dan mana yang “mengingat” daftar task: keduanya sementara berada di `TasksPage`.

## 4. Sepakati bentuk JSON antara NestJS dan Next.js

Sebelum menulis `fetch`, buka `backend/src/tasks/tasks.controller.ts` serta DTO create/update dari Day 1. Browser perlu mengirim **JSON** dengan field yang dikenal backend. Backend memvalidasi judul wajib, maksimal 120 karakter; deskripsi opsional, maksimal 500 karakter. `completed` adalah boolean untuk update. Frontend type membantu editor, sedangkan validasi DTO backend tetap menjadi penjaga request sesungguhnya.

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

**Checkpoint 4:** minta peserta membedakan `Task` (respons), `CreateTaskInput` (body POST), dan `UpdateTaskInput` (body PATCH). Setelah `curl`, refresh `GET /tasks`: task dari curl kini ada di database.

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

**Checkpoint 5:** buka DevTools → Network → Fetch/XHR, refresh `/tasks`, lalu buka respons `GET /tasks`. Data JSON di respons harus cocok dengan kartu. Hentikan backend sebentar: halaman menampilkan error setelah request gagal. Nyalakan kembali backend untuk tahap berikutnya.

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

`method: "POST"` memilih operasi buat. Header `Content-Type` memberi tahu NestJS bahwa body adalah JSON. `JSON.stringify(input)` mengubah objek JavaScript menjadi teks JSON. Respons `201` berisi task yang **sudah diberi ID dan tanggal oleh server**; respons itulah yang ditambahkan ke state, bukan objek buatan browser.

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

**Bedah alur form:**

- `TaskFormProps` adalah kontrak antara anak dan induk. Anak menerima callback `onCreated`; ia tidak mengubah array `tasks` milik halaman secara langsung.
- `title`/`description` adalah state lokal form. Tiap ketikan masuk melalui `onChange`, setter, render ulang, lalu `value` terbaru.
- `submitting` mencegah submit berulang selama request berlangsung dan memberi teks tombol yang jelas.
- `required`/`maxLength` membantu pengguna sebelum request. DTO backend tetap memvalidasi input karena browser bisa dilewati dengan `curl`.
- `await createTask(...)` menunggu task **yang benar-benar tersimpan**. Baru setelah berhasil, `onCreated(newTask)` memberi tahu parent dan input dikosongkan. Jika gagal, data form tetap ada agar bisa dicoba lagi.
- `try/catch/finally` memisahkan keberhasilan, kegagalan, dan pembersihan status loading tombol. Versi checkout saat ini belum menampilkan error atau status submit; bagian ini merupakan perapian untuk contoh workshop.

Di `TasksPage`, tambahkan `import { TaskForm } from "@/features/tasks/components/task-form";` di bagian atas. Buat callback untuk memperbarui array dan tampilkan form sebelum daftar:

```tsx
async function handleCreateTask(newTask: Task) {
  setTasks((currentTasks) => [...currentTasks, newTask]);
}

// Di JSX, sebelum <ul>:
<TaskForm onCreated={handleCreateTask} />
```

Alur data: `TaskForm` → `POST` → task baru dari server → `onCreated` → `TasksPage.setTasks` → daftar render ulang.

**Checkpoint 6:** isi judul/deskripsi, kirim, lalu lihat **satu** `POST /tasks` berstatus `201` di Network tab. Kartu baru muncul dan tetap ada setelah refresh. Coba matikan backend lalu submit: form mempertahankan isinya dan menampilkan error.

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

**Bedah alur:** `!task.completed` membalik status saat ini. Backend mengembalikan objek terbaru. `map` mempertahankan urutan daftar dan mengganti hanya objek dengan ID yang sama. Jika request gagal, `setTasks` tidak dipanggil, sehingga tampilan tidak berpura-pura bahwa database berubah. `void` pada event handler menandai bahwa event React tidak menunggu promise; handler sendiri sudah menangani error.

**Perbedaan penting dari checkout saat ini:** `frontend/src/app/tasks/page.tsx` sekarang melakukan `fetch` PATCH langsung ke URL yang ditulis keras, **lalu** memanggil `updateTask()` yang melakukan PATCH kedua. Satu klik menghasilkan dua request. Pada tahap ini, gunakan **hanya** `updateTask()` di atas. Ini sekaligus memastikan semua URL API berasal dari satu tempat, `NEXT_PUBLIC_API_URL`.

**Checkpoint 7:** klik satu task sekali dan lihat **satu PATCH per klik** di Network tab. Responsnya berisi `completed` terbaru. Refresh: status tetap sama, menandakan perubahan tersimpan di database. Dua GET awal saat development tidak boleh disamakan dengan dua PATCH untuk satu klik.

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

**Bedah alur:** `confirm` mencegah penghapusan karena salah klik. `await deleteTask` harus selesai **sebelum** task dibuang dari UI. `filter` membuat array baru yang berisi semua task kecuali ID target. Jika pengguna memilih Cancel atau request gagal, daftar tidak berubah.

Pada contoh tahap ini, tombol status dan Delete adalah dua tombol terpisah sehingga klik Delete tidak memicu toggle. Pada struktur komponen checkout, **seluruh kartu** menjadi area klik untuk toggle. Tombol Delete berada di dalam kartu. Event klik akan “naik” ke parent (`event bubbling`), sehingga `TaskItem` perlu `event.stopPropagation()`; lihat tahap 9.

**Checkpoint 8:** pilih Cancel: tidak ada request DELETE. Pilih OK: terlihat **satu** DELETE dan task hilang. Refresh: task tetap hilang. Tanyakan mengapa `filter` dilakukan setelah respons sukses, bukan sebelum request.

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

**Jejak props yang bisa digambar di papan:** `TasksPage.tasks` → `TaskView.tasks` → `TaskItem.task`; kemudian klik di `TaskItem` → callback `handleToggle` dari `TasksPage` → PATCH → `setTasks` → props baru turun lagi.

**Checkpoint 9:** setelah pemisahan file, GET/POST/PATCH/DELETE tetap berjalan. Tunjuk `TaskForm` dan `TaskItem`: keduanya tidak pernah memanggil `setTasks` milik parent secara langsung.

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

Perbandingan yang perlu disampaikan dengan jujur saat menunjukkan checkout utama:

| Di checkout saat ini | Dalam acuan akhir workshop | Alasan |
| --- | --- | --- |
| GET ditunda buatan selama 2 detik. | GET dimulai langsung. | Loading mengikuti durasi request nyata. |
| Satu klik toggle mengirim PATCH langsung **dan** `updateTask()`. | Satu klik memanggil `updateTask()` sekali. | Satu aksi menghasilkan satu request dan URL tetap terpusat. |
| Error saat POST/PATCH/DELETE belum ditampilkan ke pengguna. | Form dan halaman menampilkan pesan sederhana. | Peserta dapat membedakan request gagal dari aksi sukses. |
| Daftar kosong hanya berupa `<ul>` kosong. | Ada teks “Belum ada task”. | Empty state berbeda dari loading/error. |

Ini adalah **perbaikan dalam contoh pembelajaran**, bukan klaim bahwa source code checkout sudah berubah. Materi Day 3 nanti mengganti alur task lagi untuk menambahkan token dan kepemilikan user.

## 11. Uji alur end-to-end dan pertanyaan untuk peserta

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

**Pertanyaan penutup:**

1. “Mengapa setelah `POST` kita menambahkan objek dari **respons server**, bukan membuat sendiri ID di browser?” Karena server/database yang menentukan ID dan nilai final.
2. “Mengapa `setTasks` memakai `map` untuk PATCH, `filter` untuk DELETE, dan spread array untuk POST?” Karena masing-masing membuat array baru sesuai perubahan yang diperlukan, tanpa memutasi state lama.
3. “Apa bedanya `loading` dan daftar kosong?” Loading berarti hasil GET belum diketahui; array kosong setelah sukses berarti memang belum ada task.
4. “Mengapa `NEXT_PUBLIC_API_URL` boleh ada di browser tetapi `DATABASE_URL` tidak?” Browser perlu alamat API; koneksi dan kredensial database hanya milik backend.
5. “Apakah CORS membuat task aman untuk tiap pengguna?” Belum. Day 3 menambahkan identitas dan filter user di backend.

### Masalah yang sering muncul

| Gejala | Cek pertama |
| --- | --- |
| `Failed to fetch` | NestJS masih hidup di `3001`? `curl /tasks` sukses? `frontend/.env` sudah dibuat dan Next sudah direstart? |
| Error CORS di console browser | Origin frontend sama dengan `FRONTEND_URL` backend? Jika frontend pindah port, perbarui origin backend lalu restart. |
| POST `400` | `title` terisi dan maksimal 120 karakter? `description` maksimal 500? Lihat body dan respons di Network. |
| UI tidak berubah sesudah request | Handler memanggil setter? `map`/`filter` mengembalikan array baru? ID yang dibandingkan benar? |
| Dua PATCH untuk satu klik | Periksa apakah `handleToggle` masih mempunyai `fetch(...)` langsung **sekaligus** `updateTask(...)`; sisakan satu. |
| Task hilang setelah refresh | Apakah tadi hanya memakai data/state lokal tahap 2–3? Periksa POST sukses dan respons GET setelah refresh. |

**Jembatan ke Day 3:** saat ini browser boleh meminta seluruh task tanpa identitas. Berikutnya peserta akan membuat register/login, mengirim JWT pada request, dan meminta NestJS menyaring task berdasarkan user yang sudah diverifikasi. Panduan Day 3 berangkat dari checkout utama sebelum perapian Day 2 ini; jika peserta meneruskan hasil latihan, langkah Day 3 yang mengulang penanganan error form atau penghapusan PATCH ganda cukup dipakai untuk menambahkan bagian auth-nya. Kontrak props contoh akhir Day 2 sudah dibuat cocok dengan halaman pengganti Day 3.

## Referensi untuk fasilitator

- [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — batas `"use client"` dan interaksi browser.
- [Next.js: Environment Variables](https://nextjs.org/docs/app/guides/environment-variables) — aturan `NEXT_PUBLIC_`.
- [React: `useEffect`](https://react.dev/reference/react/useEffect) — efek setelah render dan perilaku development.
- [React: Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state) — `map`, `filter`, dan array baru.
