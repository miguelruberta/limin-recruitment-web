# Dry Dock Management System

Marine ERP untuk perencanaan dan biaya dry docking kapal. Monorepo npm workspaces:
backend Express (REST API) dan frontend Vue 3 (Vite + Pinia + Chart.js).

## Struktur

```
backend/    API Express (repositories -> services -> controllers -> routes)
frontend/   SPA Vue 3 (services -> stores -> views -> components)
```

Arsitektur mengikuti `docs/CODE_STYLE.md`: dependency injection manual lewat
`backend/src/container.js`, private field (`#`), serta response dibungkus
`{ success, data, meta }`.

## Prasyarat

- Node.js >= 20
- MySQL 8

## Menjalankan

### 1. Siapkan database

Buat database dan user aplikasi (jalankan sebagai user MySQL yang punya hak):

```sql
CREATE DATABASE drydock CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'drydock_app'@'localhost' IDENTIFIED BY 'ganti-dengan-password-kuat';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX
  ON drydock.* TO 'drydock_app'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Konfigurasi environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Sesuaikan `DB_PASSWORD` dan ganti `JWT_SECRET` serta `JWT_REFRESH_SECRET`
dengan nilai acak minimal 32 karakter:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 3. Install, migrate, seed

```bash
npm install
npm run migrate
npm run seed
```

`migrate` menjalankan migrasi yang belum tercatat pada tabel `schema_migrations`;
`seed` mengisi data contoh (perusahaan, kapal, shipyard, specification group,
work order master, dan akun admin).

### 4. Jalankan

```bash
npm run dev          # backend :3000 + frontend :5173
```

Frontend memakai proxy ke backend, jadi buka `http://localhost:5173`.
Login admin memakai kredensial dari seed.

## Menjalankan dengan Docker

Compose menjalankan MySQL, migrasi, backend, dan nginx untuk frontend.

```bash
cp docker/.env.example docker/.env     # ganti password dan JWT_SECRET
docker compose --env-file docker/.env up -d --build
```

Buka `http://localhost:5173`. Migrasi dijalankan otomatis oleh service
`migrate` sebelum backend start. Isi data contoh dengan:

```bash
docker compose --env-file docker/.env run --rm seed
```

Perintah lain:

```bash
docker compose --env-file docker/.env logs -f backend   # log backend
docker compose --env-file docker/.env ps
docker compose --env-file docker/.env down              # hentikan
docker compose --env-file docker/.env down -v           # hapus juga volume
```

Layout service:

| Service | Peran | Port host |
| --- | --- | --- |
| `db` | MySQL 8, volume `db_data` | tidak dipublish |
| `migrate` | Menjalankan migrasi sekali lalu keluar | - |
| `backend` | API Express, volume `uploads_data` | 3000 |
| `frontend` | nginx untuk hasil build Vite | 5173 |
| `seed` | Data contoh, profil `tools` | - |

Variable `DB_PASSWORD`, `MYSQL_ROOT_PASSWORD`, `JWT_SECRET`, dan
`JWT_REFRESH_SECRET` dibaca dari `docker/.env`. Data MySQL dan berkas unggahan
disimpan pada volume bernama, sehingga tetap ada saat container dibangun ulang.

## Perintah

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Jalankan backend dan frontend bersamaan |
| `npm run build` | Build produksi frontend ke `frontend/dist` |
| `npm run lint` | ESLint untuk seluruh workspace |
| `npm test` | Unit test backend (`node --test`) |
| `npm run migrate` | Terapkan migrasi database |
| `npm run seed` | Isi data contoh |

## Endpoint utama

Semua endpoint berada di `prefix /api/v1` dan wajib memakai access token
(`Authorization: Bearer <token>`), kecuali `/auth/login` dan `/auth/refresh`.

| Metode | Path | Keterangan |
| --- | --- | --- |
| POST | `/auth/login` | Login, mengembalikan access dan refresh token |
| POST | `/auth/refresh` | Tukar refresh token |
| GET | `/dry-docks` | Daftar dry dock (paginated, search, sort, filter) |
| GET | `/dry-docks/:id` | Detail dry dock |
| PATCH | `/dry-docks/:id/shipyard` | Pilih shipyard |
| PATCH | `/dry-docks/:id/status` | Ubah status sesuai alur |
| POST | `/dry-docks/:id/start` | Mulai dry dock (butuh shipyard) |
| GET | `/dry-docks/:id/cost-summary` | Ringkasan biaya |
| GET | `/dry-docks/:id/charts/*` | Data grafik status, yard stay, perbandingan |
| GET | `/dry-docks/:id/specifications` | Work order per specification group |
| POST | `/dry-docks/:id/specifications/export` | Ekspor spesifikasi, naikkan versi |
| GET | `/dry-docks/:id/purchase-orders` | Purchase order per kategori |
| GET | `/dry-docks/:id/attachments` | Lampiran dry dock |

Rincian lengkap ada di `docs/API.md`.

## Peran

`ADMIN` (CRUD penuh), `SUPERINTENDENT` (CRUD tanpa hapus dry dock), dan
`VIEWER` (hanya baca). Transisi status mundur hanya diizinkan oleh `ADMIN`.

## Keamanan

- Password di-hash dengan bcrypt, akun dikunci sementara setelah beberapa
  percobaan login gagal.
- Refresh token disimpan sebagai SHA-256 hash dan juga dikirim sebagai cookie
  `HttpOnly`.
- Berkas unggahan disimpan di luar web root dan hanya dilayani melalui endpoint
  terautentikasi dengan header `X-Content-Type-Options: nosniff`.
- Sort dan filter memakai allowlist kolom sehingga tidak ada kolom di luar
  allowlist yang masuk ke query.
- Query dinamis memakai prepared statement.
