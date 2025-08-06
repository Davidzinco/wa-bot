const axios = require('axios');
const { translate } = require('@vitalets/google-translate-api');

module.exports = {
    name: 'komik',
    description: 'Mencari informasi manga / manhua / manhwa / donghua berdasarkan judul.',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        if (args.length === 0) {
            await sock.sendMessage(from, { text: 'Gunakan format: *.manga [judul manga]*' }, { quoted: msg });
            return;
        }

        const query = args.join(' ');
        try {
            await sock.sendMessage(from, { text: `🔎 Sedang mencari manga *"${query}"*...` }, { quoted: msg });

            // panggil endpoint manga Jikan
            const { data } = await axios.get(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&limit=1`);
            const res = data.data[0];

            if (!res) {
                await sock.sendMessage(from, { text: `Maaf, manga *"${query}"* tidak ditemukan.` }, { quoted: msg });
                return;
            }

            // terjemah sinopsis
            let sinopsis = 'Tidak ada sinopsis.';
            if (res.synopsis) {
                try {
                    const tr = await translate(res.synopsis, { to: 'id' });
                    sinopsis = tr.text;
                } catch {
                    sinopsis = res.synopsis + '\n\n(Gagal menerjemahkan)';
                }
            }

            const info =
`*📙 Manga Ditemukan!*

*Judul:* ${res.title}
*Judul Jepang:* ${res.title_japanese || '-'}

*⭐ Skor:* ${res.score || 'N/A'}
*📖 Total Chapter:* ${res.chapters || '?'}
*📚 Total Volume:* ${res.volumes || '?'}
*📺 Status:* ${res.status}
*🏷️ Genre:* ${res.genres.map(g => g.name).join(', ') || '-'}

*📚 Sinopsis:*
${sinopsis}

🔗 *Link MAL:*
${res.url}`;

            const img = res.images?.jpg?.large_image_url;
            if (img) {
                await sock.sendMessage(from, { image: { url: img }, caption: info }, { quoted: msg });
            } else {
                await sock.sendMessage(from, { text: info }, { quoted: msg });
            }

        } catch (e) {
            console.error('Error di perintah manga:', e.message);
            await sock.sendMessage(from, { text: 'Waduh, terjadi kesalahan saat mencari info manga.' }, { quoted: msg });
        }
    }
};
