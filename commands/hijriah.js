const axios = require('axios');

module.exports = {
    name: 'hijriah',
    description: 'Menampilkan tanggal kalender Hijriah hari ini.',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        try {
            console.log(`[Hijriah] Mengambil data kalender...`);
            await sock.sendMessage(from, { text: 'Wait... 🌙' }, { quoted: msg });

            // Mengambil tanggal hari ini
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            const formattedDate = `${day}-${month}-${year}`;

            // Mengambil data dari API publik Aladhan
            const response = await axios.get(`http://api.aladhan.com/v1/gToH?date=${formattedDate}`);
            const data = response.data.data;

            const hijriDate = data.hijri;
            const masehiDate = data.gregorian;

            const resultText = `
*KALENDER HARI INI*

📅  *Masehi:*
    ${masehiDate.weekday.en}, ${masehiDate.day} ${masehiDate.month.en} ${masehiDate.year}

☪️  *Hijriah:*
    ${hijriDate.weekday.ar}, ${hijriDate.day} ${hijriDate.month.ar} ${hijriDate.year} H

Selamat beraktivitas! ✨
            `;

            await sock.sendMessage(from, { text: resultText }, { quoted: msg });

        } catch (error) {
            console.error('[Hijriah] Error:', error);
            await sock.sendMessage(from, { text: 'Waduh, gagal ngambil data kalender. Coba lagi beberapa saat ya.' }, { quoted: msg });
        }
    }
};
