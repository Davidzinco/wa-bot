const axios = require('axios');

/**
 * Fungsi untuk download video Instagram Reels
 * @param {string} url URL video Instagram Reels
 * @returns {Promise<Buffer>} Buffer dari video mp4
 */
async function downloadInstagramReel(url) {
    const rapidApiKey = '856160434msh49a23ba789543a4p1a7231jsne74c00da2056'; // Kunci RapidAPI kamu

    if (!rapidApiKey) {
        return Promise.reject(new Error('Kunci RapidAPI untuk Instagram Downloader belum dimasukkan ke kode!'));
    }
    
    const options = {
        method: 'GET',
        url: 'https://instagram-media-downloader.p.rapidapi.com/rapid/post.php',
        params: { url: url },
        headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'instagram-media-downloader.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const result = response.data;

        if (!result || !result.video) {
            throw new Error('API tidak mengembalikan link video yang valid.');
        }

        const downloadLink = result.video;
        console.log(`[Instagram] Ditemukan link download via API Baru: ${downloadLink}`);
        
        const videoResponse = await axios.get(downloadLink, {
            responseType: 'arraybuffer'
        });

        return Buffer.from(videoResponse.data, 'binary');

    } catch (error) {
        console.error('[Instagram] Gagal mendownload video via API Baru:', error.response ? error.response.data : error.message);
        throw new Error(`Gagal mendownload video Instagram. Pastikan kamu sudah subscribe ke plan gratis API baru ini. (${error.message})`);
    }
}

module.exports = {
    name: 'ig',
    description: 'Download video Reels Instagram.',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const url = args[0];

        if (!url) {
            await sock.sendMessage(from, { text: 'Link Reels-nya mana? Contoh: .ig https://www.instagram.com/reel/...' }, { quoted: msg });
            return;
        }

        console.log(`[Instagram] Perintah diterima dari ${from} dengan URL: ${url}`);
        await sock.sendMessage(from, { text: 'Oke, pakai jalur VIP baru buat download Reels... Sabar ya. 🎬' }, { quoted: msg });
        
        const videoBuffer = await downloadInstagramReel(url);
        await sock.sendMessage(from, { 
            video: videoBuffer,
            caption: 'Nih video Reels-nya, Muna-kun! ✨'
        }, { quoted: msg });
    }
};
