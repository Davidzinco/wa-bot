//...
const axios = require('axios');

module.exports = {
    name: 'waifu',
    description: 'Mengirim gambar waifu random.',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        try {
            await sock.sendMessage(from, { text: 'Sedang mencari waifu...' }, { quoted: msg });
            
            const apiResponse = await axios.get('https://api.waifu.pics/sfw/waifu');
            const imageUrl = apiResponse.data.url;

            if (!imageUrl) {
                await sock.sendMessage(from, { text: 'Maaf, gagal mendapatkan link gambar waifu.' }, { quoted: msg });
                return;
            }

            const imageBuffer = await axios.get(imageUrl, {
                responseType: 'arraybuffer' 
            });

            await sock.sendMessage(from, {
                image: Buffer.from(imageBuffer.data), 
                caption: 'Ini dia waifu untukmu, bang!'
            }, { quoted: msg });

        } catch (error) {
            console.error('Error di perintah waifu:', error);
            await sock.sendMessage(from, { text: 'Waduh, ada masalah saat nyari waifu. Coba lagi nanti ya.' }, { quoted: msg });
        }
    }
};