# ✦ DAWNIE — Bespoke Fullstack & UI/UX Portfolio with Visual CMS Studio

Template portofolio interaktif dengan **estetika atelier & editorial mewah (Warm Obsidian & Editorial Cream)**, dirancang khusus untuk Fullstack Web Developer dan UI/UX Designer agar tampil profesional, berkelas, dan **sama sekali tidak terkesan klise AI**.

Dilengkapi dengan **Dashboard CMS Studio Visual (`admin.html`)** yang memungkinkan Anda menambah, mengedit, dan menghapus konten apa pun **tanpa harus menyentuh kode sama sekali**.

---

## 🌟 Fitur Utama Portofolio (`index.html`)

1. **Estetika Editorial & Anti-AI Cliché**:
   - Palet warna: **Warm Obsidian Charcoal** (`#0b0c0f`), aksen **Champagne Gold** (`#d4a373`), sentuhan **Terracotta** (`#c96b4b`), dan alternatif **Editorial Cream Paper** untuk mode terang.
   - Tipografi kelas dunia: **Newsreader** (serif editorial anggun) dipadukan dengan **Plus Jakarta Sans** (humanist sans bersih) dan **JetBrains Mono** (monospace rekayasa presisi).
   - Tekstur analog film grain halus untuk memberikan sensasi kertas taktil.
   - Spotlight cursor glow dinamis yang mengikuti pergerakan kursor mouse.

2. **Interaktivitas Penuh**:
   - **Filter Kategori Proyek**: *Semua Karya, Fullstack & Web, Product & SaaS, Creative & Audio*.
   - **Studi Kasus Interaktif (Native `<dialog>`)**: Klik kartu proyek mana pun untuk membuka modal dengan detail lengkap: *Tantangan, Solusi Teknis, Dampak & Hasil Terukur, Live Demo, dan Link GitHub*.
   - **Matriks Keahlian & Tech Stack Terstruktur**: Mengelompokkan Frontend Architecture, Backend & Systems, dan UI/UX Design System dengan level keahlian dan badge.
   - **Linimasa Karir & Milestones**: Riwayat perjalanan profesional dengan nodus visual.
   - **Ulasan Klien & Rekan**: Menampilkan testimonial terpercaya dengan avatar dan rating bintang.
   - **Formulir Kontak Terintegrasi**: Fitur salin alamat surel instan dan feedback form interaktif.

---

---

## 🔒 Keamanan & Akses Terproteksi (Zero Public Exposure)

Sesuai standar keamanan dan profesionalisme web modern:
1. **Tidak Ada Tautan CMS di Tampilan Publik**:
   - Pengunjung, klien, atau pihak umum **tidak akan pernah melihat tombol admin/CMS** di navigasi maupun tombol melayang. Tampilan depan 100% murni, bersih, dan berwibawa sebagai portofolio profesional.
2. **Brute-Force Protected Auth Gate (`admin.html`)**:
   - Jika seseorang membuka URL `/admin.html`, seluruh konten dashboard dikunci rapat di balik **Vault Lock Screen**.
   - Diotentikasi menggunakan hashing kriptografi **SHA-256** native browser.
   - **Kata Sandi Default**: `dawnie2026` (Dapat diubah kapan saja di tab *Keamanan & Password*).
   - Menggunakan `sessionStorage`: sesi otomatis terkunci kembali saat tab peramban ditutup.
3. **Pintu Masuk Rahasia Pemilik (Stealth Shortcuts)**:
   - Dari halaman depan portofolio, pemilik dapat langsung menuju panel CMS dengan:
     - **Pintasan Keyboard**: Tekan `Ctrl + Shift + A` (atau `Cmd + Shift + A` di macOS).
     - **Klik Logo Monogram**: Klik 3x berturut-turut pada inisial monogram `DP` di navigasi atas.
     - Atau akses langsung URL: `http://localhost:4173/admin.html`.

---

## ⚙️ Dashboard CMS Studio (`admin.html`) — Edit Tanpa Koding

1. **👤 Profil & Hero**: Ubah nama, peran, tagline, bio, status badge, foto avatar (unggah dari perangkat atau tautan GDrive), metrik pengalaman, dan kontak.
2. **💼 Karya & Proyek (Full CRUD)**: Tambah proyek baru, edit proyek yang ada, unggah gambar sampul langsung dari komputer atau Google Drive, serta kelola studi kasus.
3. **⚡ Keahlian (Skills Matrix)**: Tambah kategori kemampuan baru atau teknologi spesifik beserta badge dan tingkat kemahiran.
4. **🛠️ Layanan & Nilai (Services)**: Sesuaikan pilar layanan yang Anda tawarkan beserta poin deliverables.
5. **📜 Riwayat Karir (Experience)**: Tambahkan riwayat pengalaman kerja dan pencapaian.
6. **💬 Ulasan Klien (Testimonials)**: Kelola feedback klien dengan nama, jabatan, foto avatar (via perangkat/GDrive), dan kutipan.
7. **🌐 Sosial & Kontak**: Kelola link ke GitHub, LinkedIn, Figma, WhatsApp, Dribbble, dll.
8. **🎨 Warna & Tema**: Pilih palet warna aksen (*Warm Champagne, Terracotta Rust, Atelier Cyan, Lavender Slate, Ochre Bronze*) atau masukkan kode HEX kustom.
9. **🔒 Keamanan & Password**: Ganti kata sandi master CMS kapan saja dengan enkripsi SHA-256.
10. **💾 Pusat Backup & Migrasi Data**:
    - **Unduh Backup JSON**: Download salinan portofolio Anda ke komputer dengan 1 klik.
    - **Pulihkan Backup JSON**: Unggah file `.json` untuk restore instan.
    - **Reset ke Bawaan**: Kembalikan data kurasi awal kapan saja.

### 🖼️ Fitur Pengunggah Gambar (Media Uploader)
Anda tidak perlu lagi mencari URL gambar eksternal yang rumit:
- **📁 Unggah dari Perangkat**: Klik atau seret file gambar langsung dari laptop/HP Anda. Sistem secara otomatis mengompresi gambar via canvas client-side sehingga tersimpan instan tanpa batas kuota server.
- **☁️ Google Drive**: Cukup salin link file dari menu **Bagikan (Share)** Google Drive (pastikan akses diset *"Siapa saja yang memiliki link"*), sistem akan mengonversinya menjadi gambar beresolusi tinggi secara otomatis.


---

## 🚀 Cara Menjalankan Portofolio Lokal

Buka terminal pada direktori proyek:

```bash
# Opsi 1: Menggunakan Python (bawaan macOS / Linux / Windows)
python3 -m http.server 4173

# Opsi 2: Menggunakan Node.js
npx serve . -p 4173
```

Buka peramban di:
- **Portofolio Publik**: `http://localhost:4173/`
- **Dashboard CMS Studio**: `http://localhost:4173/admin` (atau `/admin.html`)

---

## ☁️ Panduan Deploy ke Vercel (Gratis & Cepat)

Proyek ini telah dikonfigurasi dengan file `vercel.json` sehingga langsung siap di-hosting ke **Vercel** dengan URL bersih (`/admin` tanpa `.html`) dan keamanan optimal.

### Metode A: Lewat GitHub (Sangat Direkomendasikan)
1. **Buat repositori baru di GitHub** (bisa diset Publik atau Privat):
   ```bash
   git add .
   git commit -m "feat: prepare portfolio for Vercel deployment"
   git branch -M main
   git remote add origin https://github.com/USERNAME_ANDA/NAMA_REPO.git
   git push -u origin main
   ```
2. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
3. Klik tombol **"Add New..."** lalu pilih **"Project"**.
4. Pilih repositori GitHub Anda dan klik **"Import"**.
5. Pada pengaturan proyek:
   - **Framework Preset**: Pilih `Other` (otomatis terdeteksi).
   - **Root Directory**: `./` (default).
   - **Build & Output Settings**: Biarkan kosong/default.
6. Klik **"Deploy"**. Dalam 15-30 detik website Anda akan langsung online dengan domain gratis seperti `https://nama-proyek.vercel.app`!

### Metode B: Deploy Langsung via Terminal (Vercel CLI)
Jika Anda tidak ingin upload ke GitHub terlebih dahulu, Anda bisa langsung deploy dari terminal:
```bash
npx vercel
```
1. Tekan `Enter` untuk login ke akun Vercel melalui peramban.
2. Jawab pertanyaan yang muncul:
   - *Set up and deploy?* -> `Y`
   - *Which scope?* -> (Pilih akun Vercel Anda)
   - *Link to existing project?* -> `N`
   - *What's your project's name?* -> (Ketik nama proyek, misal `dawnie-portfolio`)
   - *In which directory is your code located?* -> `./`
3. Selesai! Vercel akan langsung memberikan link pratinjau dan link produksi.
4. Untuk update berikutnya, cukup ketik `npx vercel --prod`.

### 💡 Tips Penting Penggunaan CMS di Vercel
- **Akses CMS**: Anda bisa mengakses dashboard CMS di `https://domain-anda.vercel.app/admin`.
- **Pintasan Rahasia**: Tetap dapat menggunakan `Ctrl + Shift + A` (atau `Cmd + Shift + A`) atau klik 3x logo monogram `DP`.
- **Pencadangan Data**: Gunakan menu **"Unduh Cadangan JSON"** di tab Pengaturan CMS sewaktu-waktu Anda ingin mencadangkan atau memindahkan konten ke perangkat lain.

