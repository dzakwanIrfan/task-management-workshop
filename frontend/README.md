# Frontend workshop

Panduan utama dan checkpoint Git ada di [README repository](../README.md). Frontend ini memakai Next.js untuk halaman register, login, dan Task.

Jalankan dari direktori `frontend/` setelah backend siap:

```bash
cp .env.example .env
pnpm install --frozen-lockfile
pnpm dev
```

Buka `http://localhost:3000/register`. `NEXT_PUBLIC_API_URL` di `.env` menunjuk backend dan terlihat oleh browser; jangan isi dengan secret. Alur live coding ada di [Day 2](../docs/day-2-nextjs-crud-frontend.md) dan [Day 3](../docs/day-3-auth-nextjs-nestjs.md).
