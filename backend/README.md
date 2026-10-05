# Backend workshop

Panduan utama, checkpoint Git, setup database, dan alur Day 1–3 ada di [README repository](../README.md). Backend ini memakai NestJS, Prisma, dan PostgreSQL.

Jalankan perintah dari direktori `backend/`. Salin `.env.example` ke `.env`, isi `DATABASE_URL` untuk database latihan dan `JWT_SECRET` acak minimal 32 karakter, lalu:

```bash
pnpm install --frozen-lockfile
pnpm exec prisma validate
pnpm exec prisma generate
pnpm exec prisma migrate deploy
pnpm start:dev
```

Migrasi Day 3 membutuhkan database latihan kosong jika Task lama belum mempunyai pemilik. API lokal berjalan di `http://localhost:3001` dengan contoh env. Detail live coding ada di [Day 1](../docs/day-1-nestjs-crud-postgresql.md) dan [Day 3](../docs/day-3-auth-nextjs-nestjs.md).
