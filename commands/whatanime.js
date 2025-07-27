const axios = require('axios');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'whatanime',
    description: 'Mencari sumber anime dari sebuah gambar (screenshot).',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        const quotedMessage = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMessage || !quotedMessage.imageMessage) {
            await sock.sendMessage(from, { text: 'Perintah ini harus digunakan dengan cara me-reply sebuah gambar.' }, { quoted: msg });
            return;
        }

        try {
            await sock.sendMessage(from, { text: '🎨 Menganalisis gambar, mohon tunggu...' }, { quoted: msg });

            const stream = await downloadContentFromMessage(quotedMessage.imageMessage, 'image');
            let imageBuffer = Buffer.from([]);
            for await (const chunk of stream) {
                imageBuffer = Buffer.concat([imageBuffer, chunk]);
            }

            const apiUrl = 'https://api.trace.moe/search';
            const response = await axios.post(apiUrl, imageBuffer, {
                headers: { 'Content-Type': 'image/jpeg' } 
            });

            const result = response.data.result[0]; 

            if (!result) {
                await sock.sendMessage(from, { text: 'Maaf, tidak ada hasil yang ditemukan untuk gambar ini.' }, { quoted: msg });
                return;
            }

            const similarity = (result.similarity * 100).toFixed(2); 
            const episode = result.episode || 'N/A';
            const animeTitle = result.filename.match(/(^.*?) -/)?.[1] || 'Judul Tidak Ditemukan';

            const start = new Date(result.from * 1000).toISOString().substr(14, 5);
            const end = new Date(result.to * 1000).toISOString().substr(14, 5);

            const replyText = 
`✅ *Anime Ditemukan!*

*Judul:* ${animeTitle}
*Episode:* ${episode}
*Genre:* ${result.genre || 'N/A'}
*Kecocokan:* ${similarity}%
*Adegan di:* ${start} - ${end}
`;

            await sock.sendMessage(from, {
                video: { url: result.video },
                caption: replyText,
                gifPlayback: true 
            }, { quoted: msg });

        } catch (error) {
            console.error('Error di perintah whatanime:', error.response ? error.response.data : error.message);
            await sock.sendMessage(from, { text: 'Waduh, terjadi kesalahan saat mencari anime. Mungkin gambarnya kurang jelas atau ada gangguan di server API.' }, { quoted: msg });
        }
    }
};