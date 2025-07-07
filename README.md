# WA-Bot

WA-Bot adalah sebuah bot WhatsApp multifungsi yang dibuat menggunakan Node.js dan pustaka [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys). Bot ini dirancang untuk menyediakan berbagai fitur interaktif, mulai dari pemrosesan gambar dengan AI, pencarian informasi, hingga interaksi seru lainnya langsung dari chat WhatsApp Anda.

## ✨ Fitur

Berikut adalah beberapa fitur utama yang tersedia di bot ini:

- **`.upscale`**: Meningkatkan resolusi gambar menggunakan berbagai API AI.
- **`.toimg`**: Mengubah stiker menjadi gambar.
- **`.whatanime`**: Mengidentifikasi judul anime dari sebuah gambar/screenshot.
- **`.musimini`**: Menampilkan daftar anime yang sedang tayang musim ini.
- **`.wiki <query>`**: Mencari ringkasan artikel dari Wikipedia.
- **`.waifu` / `.waifuneko`**: Mengirim gambar waifu atau neko secara acak.
- **`.pantun`**: Mengirim pantun jenaka atau romantis secara acak.

## 🚀 Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:

- Node.js (disarankan versi 16.x atau lebih baru)
- Git
- FFmpeg (diperlukan untuk fitur `.toimg`)

## ⚙️ Instalasi

Ikuti langkah-langkah berikut untuk menjalankan bot di perangkat Anda:

1.  **Clone repository ini:**
    ```bash
    git clone https://github.com/Davidzinco/wa-bot.git
    ```

2.  **Masuk ke direktori proyek:**
    ```bash
    cd wa-bot
    ```

3.  **Install dependensi:**
    ```bash
    npm install
    ```

4.  **Konfigurasi API Key:**
    Beberapa fitur (seperti `.upscale`) memerlukan API key dari layanan pihak ketiga.

    - Buat salinan dari file `.env.example` (jika ada) menjadi `.env`, atau buat file `.env` baru.
    - Isi dengan API key yang Anda dapatkan. Anda bisa mendaftar secara gratis di situs masing-masing penyedia.

    Contoh isi file `.env`:
    ```
    REPLICATE_API_TOKEN=YOUR_REPLICATE_API_TOKEN
    DEEPAI_API_KEY=YOUR_DEEPAI_API_KEY
    CLIPDROP_API_KEY=YOUR_CLIPDROP_API_KEY
    ```

    > **Penting:** Pastikan Anda sudah memodifikasi kode untuk membaca variabel dari file `.env` (lihat Saran Peningkatan).

## ▶️ Menjalankan Bot

1.  **Jalankan bot dengan perintah:**
    ```bash
    node index.js
    ```
    *(Asumsi file utama Anda adalah `index.js`)*

2.  **Pindai Kode QR:**
    Buka aplikasi WhatsApp di ponsel Anda, lalu pindai kode QR yang muncul di terminal untuk menghubungkan bot.

3.  **Selesai!**
    Bot sekarang sudah aktif dan siap menerima perintah.

## 📝 Contoh Penggunaan

Berikut cara menggunakan beberapa perintah:

- **Meningkatkan Resolusi Gambar:**
  Kirim sebuah gambar dengan caption `.upscale` atau balas sebuah gambar dengan pesan `.upscale`. Anda juga bisa menentukan skala, contoh: `.upscale 4`.

- **Mencari Info Anime:**
  Kirim potongan gambar dari sebuah anime dengan caption `.whatanime`.

- **Mencari di Wikipedia:**
  Ketik `.wiki Indonesia` untuk mendapatkan ringkasan tentang Indonesia.

## 🤝 Kontribusi

Kontribusi dalam bentuk apapun sangat kami hargai! Jika Anda menemukan bug atau memiliki ide fitur baru, silakan buat *issue* atau *pull request*.

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT.