const axios = require('axios');
const { translate } = require('@vitalets/google-translate-api'); // <-- IMPORT INI

module.exports = {
    name: 'anime',
    description: 'Mencari informasi tentang anime berdasarkan judul.',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        if (args.length === 0) {
            await sock.sendMessage(from, { text: 'Gunakan format: *.anime [judul anime]*' }, { quoted: msg });
            return;
        }

        const animeTitle = args.join(' ');

        try {
            await sock.sendMessage(from, { text: `🔎 Sedang mencari anime *"${animeTitle}"*...` }, { quoted: msg });

            const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${animeTitle}&limit=1`);
            const searchResult = response.data.data[0];

            if (!searchResult) {
                await sock.sendMessage(from, { text: `Maaf, anime *"${animeTitle}"* tidak ditemukan.` }, { quoted: msg });
                return;
            }

            // --- BAGIAN BARU UNTUK TRANSLATE ---
            let sinopsisTranslated = 'Tidak ada sinopsis.';
            const sinopsisOriginal = searchResult.synopsis;

            if (sinopsisOriginal) {
                try {
                    console.log("Menerjemahkan sinopsis...");
                    const translation = await translate(sinopsisOriginal, { to: 'id' });
                    sinopsisTranslated = translation.text;
                } catch (err) {
                    console.error("Gagal menerjemahkan sinopsis:", err);
                    sinopsisTranslated = sinopsisOriginal + "\n\n(Gagal menerjemahkan ke Bahasa Indonesia)";
                }
            }
            // --- AKHIR BAGIAN BARU ---

            const animeInfo = 
`✅ *Anime Ditemukan!*

*Judul:* ${searchResult.title}
*Judul Jepang:* ${searchResult.title_japanese}

*⭐ Skor:* ${searchResult.score || 'N/A'}
*🎬 Total Episode:* ${searchResult.episodes || '?'}
*📺 Status:* ${searchResult.status}
*👥 Genre:* ${searchResult.genres.map(g => g.name).join(', ') || 'Tidak ada genre'}

*📚 Sinopsis:*
${sinopsisTranslated}

🔗 *Link MAL:*
${searchResult.url}`;

            const imageUrl = searchResult.images?.jpg?.large_image_url;
            if (imageUrl) {
                await sock.sendMessage(from, { image: { url: imageUrl }, caption: animeInfo }, { quoted: msg });
            } else {
                await sock.sendMessage(from, { text: animeInfo }, { quoted: msg });
            }

        } catch (error) {
            console.error('Error di perintah anime:', error.message);
            await sock.sendMessage(from, { text: 'Waduh, terjadi kesalahan saat mencari info anime.' }, { quoted: msg });
        }
    }
};