# Panduan Database Central Computers

Dokumen ini berisi panduan untuk mengatur database PostgreSQL dan mengisinya dengan data dummy untuk aplikasi Central Computers.

## Prasyarat

1. PostgreSQL 12 atau lebih tinggi terinstal di komputer Anda
2. Node.js dan npm terinstal
3. Project Central Computers sudah di-clone

## Langkah 1: Instalasi PostgreSQL

Jika PostgreSQL belum terinstal:

1. Download PostgreSQL dari [situs resmi](https://www.postgresql.org/download/)
2. Jalankan installer dan ikuti petunjuk instalasi
3. Saat diminta, buat password untuk user 'postgres' (catat password ini)
4. Pilih port default 5432
5. Selesaikan instalasi

## Langkah 2: Membuat Database

### Menggunakan pgAdmin:
1. Buka aplikasi pgAdmin yang terinstal bersama PostgreSQL
2. Klik dua kali pada server PostgreSQL dan masukkan password yang Anda buat
3. Klik kanan pada "Databases" dan pilih "Create" > "Database..."
4. Masukkan nama database: `toko_komputer_db`
5. Klik "Save"

### Atau menggunakan Command Line:
1. Buka Command Prompt
2. Jalankan perintah berikut:
```
psql -U postgres
```
3. Masukkan password PostgreSQL Anda
4. Buat database dengan perintah:
```
CREATE DATABASE toko_komputer_db;
```
5. Keluar dari psql dengan mengetik:
```
\q
```

## Langkah 3: Konfigurasi File .env

1. Buat file `.env` di folder root project (E:\central-computers)
2. Isi dengan konfigurasi berikut:
```
PORT=5000
DB_NAME=toko_komputer_db
DB_USER=postgres
DB_PASSWORD=password_anda
DB_HOST=localhost
DB_PORT=5432
SESSION_SECRET=central_computers_secret_key
```
3. Ganti `password_anda` dengan password PostgreSQL yang Anda buat saat instalasi

## Langkah 4: Mengisi Database dengan Data Dummy

Setelah database dibuat dan file `.env` dikonfigurasi, jalankan perintah berikut untuk mengisi database dengan data dummy:

```
npm run seed
```

Perintah ini akan:
1. Menguji koneksi ke database
2. Membuat tabel-tabel yang diperlukan
3. Mengisi tabel dengan data dummy

## Data yang Dibuat

Setelah menjalankan seeder, database akan berisi:

### Users
- admin (admin@example.com, password: password123)
- karyawan (karyawan@example.com, password: password123)
- owner (owner@example.com, password: password123)

### Suppliers
- PT Komputer Sejahtera
- CV Elektronik Maju
- UD Komponen Lengkap

### Products
- Laptop ASUS ROG
- Monitor LG 24 inch
- Keyboard Mechanical RGB
- Mouse Gaming Wireless
- SSD 1TB

### Sales
- 10 transaksi penjualan dengan detail item

## Troubleshooting

### Error "password authentication failed for user 'postgres'"
- Pastikan password di file `.env` sama dengan password PostgreSQL Anda
- Pastikan server PostgreSQL berjalan
- Coba restart aplikasi setelah mengubah konfigurasi

### Error "database toko_komputer_db does not exist"
- Pastikan Anda sudah membuat database dengan nama yang benar
- Cek apakah nama database di file `.env` sudah benar

### Error "relation does not exist"
- Pastikan Anda sudah menjalankan `npm run seed` untuk membuat tabel-tabel

## Menjalankan Aplikasi

Setelah database siap, jalankan aplikasi dengan perintah:

```
npm run dev:full
```

Ini akan menjalankan server backend dan frontend secara bersamaan. 