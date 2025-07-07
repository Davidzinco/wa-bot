const axios = require('axios');

module.exports = {
    name: 'gempa',
    description: 'Menampilkan info gempa terkini dari BMKG.',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        try {
            console.log(`[Gempa] Mengambil data dari BMKG...`);
            await sock.sendMessage(from, { text: 'Wait... 🌍' }, { quoted: msg });

            // Mengambil data dari API publik BMKG
            const response = await axios.get('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json');
            const data = response.data.Infogempa.gempa;

            const caption = `
*INFO GEMPA TERKINI*

🗓️  *Tanggal:* ${data.Tanggal}
⏰  *Waktu:* ${data.Jam}
🌊  *Magnitudo:* ${data.Magnitude}
⛰️  *Kedalaman:* ${data.Kedalaman}
📍  *Lokasi:* ${data.Wilayah}
⚠️  *Potensi:* ${data.Potensi}
            `;

            const shakemapUrl = `https://data.bmkg.go.id/DataMKG/TEWS/${data.Shakemap}`;

            // Kirim gambar peta guncangan dengan caption info gempa
            await sock.sendMessage(from, {
                image: { url: shakemapUrl },
                caption: caption
            }, { quoted: msg });

        } catch (error) {
            console.error('[Gempa] Error:', error);
            await sock.sendMessage(from, { text: 'Waduh, gagal ngambil data dari server BMKG. Coba lagi beberapa saat ya.' }, { quoted: msg });
        }
    }
};
