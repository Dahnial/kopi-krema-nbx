# Panduan Lengkap Instalasi & Deployment Kopi Krema NBX

Panduan ini berisi 2 bagian utama:
1. **Bagian A: Setup Backend Google Apps Script (Database Google Sheets & Storage Drive)**
2. **Bagian B: Deploy Frontend ke GitHub Pages**

---

## Bagian A: Setup Backend Google Apps Script (GAS)

1. Buka [Google Sheets](https://sheets.new) di browser Anda dan beri nama Spreadsheet: `Database Kopi Krema NBX`.
2. Di menu atas, klik **Extensions (Ekstensi)** > **Apps Script**.
3. Hapus semua kode default `myFunction()` di editor Apps Script.
4. Buka file [`Kode.gs`](file:///Users/ahmadgibran/Desktop/AntiGravity/Webhalaman%20PutriBali/Kode.gs), salin seluruh isinya, dan tempel ke editor Apps Script.
5. Klik ikon **Save (Simpan)** (ikon disket).
6. Di dropdown fungsi bagian atas editor, pilih fungsi **`setupAppEnvironment`**, lalu klik **Run (Jalankan)**.
   - Izinkan hak akses (Review Permissions -> Pilih Akun Google -> Advanced -> Go to Untitled project (unsafe) -> Allow).
   - Tunggu hingga muncul log *Selesai* (Semua tabel sheets `PRODUK`, `PESANAN`, `RESERVASI`, `USERS`, `SETTINGS`, dan folder Google Drive `Kopi Krema NBX Uploads` otomatis terbuat!).
7. Klik tombol biru **Deploy** di kanan atas > pilih **New deployment**.
   - Pilih jenis: **Web app** (ikon gear di samping 'Select type').
   - **Description**: `v1.0 Produksi Kopi Krema NBX`
   - **Execute as**: `Me (email Anda)`
   - **Who has access**: `Anyone` *(Wajib pilih Anyone agar frontend GitHub Pages bisa memanggil API)*
   - Klik **Deploy**.
8. **Salin Web App URL** yang berakhiran `/exec` (misal: `https://script.google.com/macros/s/AKfycb.../exec`).

---

## Bagian B: Konfigurasi Frontend & Deploy ke GitHub Pages

### Langkah 1: Pasang Web App URL di `js/config.js`
Buka file [`js/config.js`](file:///Users/ahmadgibran/Desktop/AntiGravity/Webhalaman%20PutriBali/js/config.js) di folder proyek:
```javascript
const CONFIG = {
  GAS_URL: 'TEMPEL_URL_WEB_APP_GAS_ANDA_DISINI/exec',
  APP_NAME: 'Kopi Krema NBX',
  HOTLINE_WA: '082121210694'
};
```
Simpan file.

---

### Langkah 2: Buat Repository di GitHub
1. Buka [github.com](https://github.com) dan login.
2. Klik tombol **New** (ikon plus hijau) untuk membuat repository baru.
3. Beri nama repository, misalnya: `kopi-krema-nbx`.
4. Pilih **Public**.
5. **JANGAN centang** *"Add a README file"*, *"Add .gitignore"*, atau *"Choose a license"*. Biarkan kosong.
6. Klik **Create repository**.
7. Salin URL repository yang muncul (misal: `https://github.com/username/kopi-krema-nbx.git`).

---

### Langkah 3: Push Frontend dari Terminal / Git
Buka Terminal (Mac/Linux) atau PowerShell (Windows), pastikan berada di folder frontend:

```bash
# 1. Inisialisasi Git
git init

# 2. Tambahkan semua file frontend
git add index.html css js README.md PANDUAN-INSTALASI.md

# 3. Buat commit pertama
git commit -m "feat: initial commit frontend kopi krema nbx"

# 4. Arahkan branch ke main
git branch -M main

# 5. Hubungkan ke repository GitHub Anda (ganti URL dengan milik Anda)
git remote add origin https://github.com/USERNAME/kopi-krema-nbx.git

# 6. Push ke GitHub
git push -u origin main
```

---

### Langkah 4: Aktifkan GitHub Pages
1. Di halaman repository GitHub Anda, klik tab **Settings** (Pengaturan) di kanan atas.
2. Di menu sidebar kiri, klik **Pages**.
3. Di bagian **Build and deployment** > **Branch**:
   - Pilih dropdown branch: **`main`**.
   - Pilih folder: **`/(root)`**.
   - Klik **Save**.
4. Tunggu sekitar 1–2 menit, refresh halaman. GitHub akan memberikan tautan situs aktif Anda:
   `https://USERNAME.github.io/kopi-krema-nbx/`

---

## 🔐 Akun Login Default Pengelola
- **Owner / Pemilik**: Username: `admin` | Password: `krema123`
- **Kasir / Staf**: Username: `kasir` | Password: `kasir123`
