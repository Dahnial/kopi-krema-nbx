# Kopi Krema NBX — Frontend Web App

Aplikasi web modern untuk **Kopi Krema NBX** (Nabire, Papua Tengah) yang di-deploy di **GitHub Pages** dengan backend terintegrasi **Google Apps Script (GAS)**, Google Sheets, dan Google Drive.

---

## ☕ Fitur Utama
- **Katalog Menu & Live Search**: Filter kategori instan (Kopi, Non-Kopi, Makanan, Snack) dengan 0ms cold-start.
- **Keranjang & Checkout Interaktif**: Dine In, Take Away, dan COD dengan QRIS dinamis & upload bukti transfer.
- **Direct WhatsApp CRM**: Integrasi otomatis hotline `082121210694`.
- **Reservasi Meja Kafe**: Formulir reservasi meja lengkap dengan indikator Ready / Full.
- **Dashboard Pengelola (Admin & Kasir)**:
  - Role-Based Access Control (Owner & Kasir).
  - Manajemen Pesanan (Pending, Diproses, Selesai, Batal).
  - CRUD Modul Produk & Menu + Upload Foto ke Google Drive.
  - Laporan Keuangan & AI Business Insight via Chart.js.
  - Saklar Toko Online vs Offline.
- **Dark Mode & Warm Artisan Espresso UI System**.

---

## 📁 Struktur Berkas (Kontrak GitHub Pages)

```text
├── index.html          # Halaman utama Single Page Application (SPA)
├── README.md           # Dokumentasi proyek
├── PANDUAN-INSTALASI.md # Panduan setup & deployment langkah-demi-langkah
├── css/
│   └── style.css       # Design System Warm Artisan Espresso & Dark Mode
└── js/
    ├── config.js       # Konfigurasi URL Web App GAS & Hotline WA
    ├── api.js          # API Client CORS-friendly untuk Google Apps Script
    └── app.js          # State Management, 0ms Optimistic UI & Rendering
```

---

## ⚙️ Cara Menghubungkan ke Backend GAS
1. Deploy file backend `Kode.gs` di Google Apps Script sebagai **Web App** (Access: *Anyone*).
2. Salin URL Web App yang berakhiran `/exec`.
3. Buka file `js/config.js`, tempel URL pada properti `GAS_URL`:
   ```javascript
   const CONFIG = {
     GAS_URL: 'https://script.google.com/macros/s/AKfycbx.../exec',
     APP_NAME: 'Kopi Krema NBX',
     HOTLINE_WA: '082121210694'
   };
   ```
4. Commit dan push perubahan ke GitHub Pages.

---
© 2026 Kopi Krema NBX • Nabire, Papua Tengah.
