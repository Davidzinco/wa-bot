// commands/tiktok.js

const { MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');

module.exports = {
    name: 'tiktok',
    description: 'Mendownload video TikTok tanpa watermark (metode final).',
    async execute(client, msg, args) {
        const url = args[0];
        if (!url || !url.includes('tiktok.com')) {
            msg.reply('Kasih link TikTok yang bener dong. Contoh: `!tiktok https://vt.tiktok.com/xxxxxx/`');
            return;
        }

        try {
            msg.reply('Lagi cari link download TikTok, sabar...');

            // Langkah 1: Tetap dapatkan link download dari lovetik.com
            const response = await axios.post('https://lovetik.com/api/ajax/search', new URLSearchParams({
                query: url
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
                }
            });

            const result = response.data;
            if (result.status !== 'ok' || !result.links || result.links.length === 0) {
                throw new Error(result.mess || 'Tidak dapat menemukan link download.');
            }

            const downloadLink = result.links[0].a;
            if (!downloadLink) {
                throw new Error('Gagal parsing link download dari API.');
            }

            console.log(`[TikTok] Link ditemukan: ${downloadLink}`);
            msg.reply('Link download ditemukan! Sekarang biarkan WA yang download videonya...');

            // Langkah 2: Biarkan whatsapp-web.js yang men-download dari URL
            const media = await MessageMedia.fromUrl(downloadLink, { 
                unsafeMime: true // Opsi ini kadang membantu untuk video
            });

            // Langkah 3: Kirim media
            await client.sendMessage(msg.from, media, { caption: 'Nih videonya! ✨' });

        } catch (error) {
            console.error('Error TikTok Downloader:', error);
            msg.reply(`Waduh, ada error pas proses TikTok. \n\nError: ${error.message}`);
        }
    },
};