# Panduan Setup Database PostgreSQL

Berikut adalah langkah-langkah untuk membuat dan mengkonfigurasi database PostgreSQL untuk aplikasi Central Computers:

## 1. Instalasi PostgreSQL

Jika PostgreSQL belum terinstal:
1. Download PostgreSQL dari [situs resmi](https://www.postgresql.org/download/)
2. Ikuti proses instalasi
3. Catat password yang Anda buat untuk user 'postgres'

## 2. Membuat Database

### Menggunakan pgAdmin:
1. Buka aplikasi pgAdmin
2. Login dengan password yang Anda buat saat instalasi
3. Klik kanan pada 'Databases' dan pilih 'Create' > 'Database'
4. Masukkan nama database: `toko_komputer_db`
5. Klik 'Save'

### Menggunakan Command Line:
```
psql -U postgres
CREATE DATABASE toko_komputer_db;
\q
```

## 3. Konfigurasi File .env

Buat file `.env` di root project dengan isi:
```
PORT=5000
DB_NAME=toko_komputer_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
SESSION_SECRET=central_computers_secret_key
```

Ganti `your_postgres_password` dengan password PostgreSQL Anda.

## 4. Sinkronisasi Model dengan Database

Setelah database dibuat dan konfigurasi selesai, jalankan aplikasi:
```
npm run dev
```

Aplikasi akan otomatis membuat tabel-tabel yang diperlukan berdasarkan model yang sudah didefinisikan.

## 5. Verifikasi

Untuk memverifikasi bahwa tabel-tabel sudah dibuat:
1. Buka pgAdmin
2. Buka database `toko_komputer_db`
3. Buka 'Schemas' > 'public' > 'Tables'
4. Anda seharusnya melihat tabel-tabel: Users, Products, Suppliers, dll.

## Troubleshooting

### Error "password authentication failed for user 'postgres'"
- Pastikan password di file `.env` sama dengan password PostgreSQL Anda
- Pastikan server PostgreSQL berjalan
- Coba restart aplikasi setelah mengubah konfigurasi 