const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

try {
    const ffmpegPath = require('ffmpeg-static');
    ffmpeg.setFfmpegPath(ffmpegPath);
} catch (e) {
    console.warn("ffmpeg-static tidak ditemukan, pastikan ffmpeg terinstall di sistem PATH Abang.");
}


module.exports = {
    name: 'toimg',
    description: 'Mengubah stiker menjadi gambar.',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        const quotedMessage = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMessage || !quotedMessage.stickerMessage) {
            await sock.sendMessage(from, { text: '❌ Perintah ini harus digunakan dengan cara me-reply sebuah stiker.' }, { quoted: msg });
            return;
        }

        try {
            await sock.sendMessage(from, { text: '⏳ Sedang memproses stiker menjadi gambar...' }, { quoted: msg });

            const stream = await downloadContentFromMessage(quotedMessage.stickerMessage, 'sticker');
            let stickerBuffer = Buffer.from([]);
            for await (const chunk of stream) {
                stickerBuffer = Buffer.concat([stickerBuffer, chunk]);
            }

            const tempInputPath = path.join(__dirname, `../temp_sticker_${Date.now()}.webp`);
            const tempOutputPath = path.join(__dirname, `../temp_image_${Date.now()}.png`);

            fs.writeFileSync(tempInputPath, stickerBuffer);

            await new Promise((resolve, reject) => {
                ffmpeg(tempInputPath)
                    .on('error', (err) => {
                        console.error('Error saat konversi toimg:', err);
                        reject(err);
                    })
                    .on('end', () => resolve())
                    .save(tempOutputPath);
            });

            const imageResultBuffer = fs.readFileSync(tempOutputPath);
            await sock.sendMessage(from, {
                image: imageResultBuffer,
                caption: '✅ Stiker berhasil diubah menjadi gambar!'
            }, { quoted: msg });

            fs.unlinkSync(tempInputPath);
            fs.unlinkSync(tempOutputPath);

        } catch (error) {
            console.error('Error di perintah toimg:', error);
            await sock.sendMessage(from, { text: 'Waduh, terjadi kesalahan saat mengubah stiker.' }, { quoted: msg });
        }
    }
};