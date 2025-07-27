const axios = require('axios');

module.exports = {
    name: 'musimini',
    description: 'Menampilkan daftar anime yang sedang tayang musim ini.',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        try {
            await sock.sendMessage(from, { text: 'Mencari info anime musim ini...' }, { quoted: msg });

            const response = await axios.get('https://api.jikan.moe/v4/seasons/now');
            const animeList = response.data.data;

            if (!animeList || animeList.length === 0) {
                await sock.sendMessage(from, { text: 'Maaf, gagal mendapatkan data anime musim ini.' }, { quoted: msg });
                return;
            }

            let replyText = '📺 *Anime Paling Ditunggu Musim Ini*\n\n';
            
            const topAnime = animeList.slice(0, 5); // Ambil 5 pertama saja biar tidak spam

            topAnime.forEach((anime, index) => {
                replyText += 
`*${index + 1}. ${anime.title}*
⭐ Skor: ${anime.score || 'Belum ada'}
🎬 Total Episode: ${anime.episodes || '?'}
📺 Status: ${anime.status}
👥 Genre: ${anime.genres.map(g => g.name).join(', ') || 'Tidak ada genre'}
🔗 Selengkapnya: ${anime.url}
\n\n`;
            });

            replyText += 'Data diambil dari MyAnimeList.';

            const firstAnimeImageUrl = topAnime[0]?.images?.jpg?.large_image_url;

            if (firstAnimeImageUrl) {
                await sock.sendMessage(from, {
                    image: { url: firstAnimeImageUrl },
                    caption: replyText
                }, { quoted: msg });
            } else {
                await sock.sendMessage(from, { text: replyText }, { quoted: msg });
            }

        } catch (error) {
            console.error('Error di perintah musimini:', error);
            await sock.sendMessage(from, { text: 'Waduh, ada masalah saat mencari info anime. Coba lagi nanti.' }, { quoted: msg });
        }
    }
};