const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

module.exports = {
    name: 'upscale',
    description: 'Memperbesar dan mempertajam gambar menggunakan Waifu2x.',
    async execute(sock, msg, args) {
        // --- MASUKKAN API KEY DEEPAI ABANG DI SINI ---
        const DEEPAI_API_KEY = 'ec0c3ef5-6727-49ff-9f8a-4d3d0ed429da';

        if (DEEPAI_API_KEY === 'GANTI_DENGAN_API_KEY_DEEPAI_KAMU') {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ API Key untuk layanan upscale belum diatur.' }, { quoted: msg });
            return;
        }

        const from = msg.key.remoteJid;

        // 1. Cek apakah user me-reply sebuah gambar
        const quotedMessage = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMessage || !quotedMessage.imageMessage) {
            await sock.sendMessage(from, { text: '❌ Perintah ini harus digunakan dengan cara me-reply sebuah gambar.' }, { quoted: msg });
            return;
        }

        try {
            await sock.sendMessage(from, { text: '🎨 Sedang memproses gambar dengan Waifu2x, ini mungkin butuh waktu agak lama...' }, { quoted: msg });

            // 2. Download gambar yang di-reply
            const stream = await downloadContentFromMessage(quotedMessage.imageMessage, 'image');
            let imageBuffer = Buffer.from([]);
            for await (const chunk of stream) {
                imageBuffer = Buffer.concat([imageBuffer, chunk]);
            }

            // 3. Siapkan data untuk dikirim ke API DeepAI
            const form = new FormData();
            form.append('image', imageBuffer, {
                filename: 'input.jpg',
                contentType: 'image/jpeg'
            });

            // 4. Panggil API DeepAI
            const response = await axios.post('https://api.deepai.org/api/waifu2x', form, {
                headers: {
                    'api-key': DEEPAI_API_KEY,
                    ...form.getHeaders()
                }
            });

            // 5. Ambil URL gambar hasil upscale dari respon API
            const outputUrl = response.data.output_url;

            if (!outputUrl) {
                throw new Error('Gagal mendapatkan URL output dari API.');
            }

            // 6. Kirim gambar hasil upscale ke user
            await sock.sendMessage(from, {
                image: { url: outputUrl },
                caption: '✅ Gambar berhasil di-upscale dengan Waifu2x!'
            }, { quoted: msg });

        } catch (error) {
            console.error('Error di perintah upscale:', error.response ? error.response.data : error.message);
            await sock.sendMessage(from, { text: 'Waduh, terjadi kesalahan saat melakukan upscale. Mungkin ada gangguan di server API atau batas penggunaan harian Abang sudah habis.' }, { quoted: msg });
        }
    }
};