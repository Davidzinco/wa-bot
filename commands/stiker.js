const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

// Fungsi untuk membuat stiker (ini bisa kita simpan di file terpisah nanti, misal 'utils.js')
async function createSticker(media, isVideo = false) {
    return new Promise((resolve, reject) => {
        const tempFileIn = path.join(__dirname, `../temp_in_${Date.now()}.${isVideo ? 'mp4' : 'jpg'}`);
        const tempFileOut = path.join(__dirname, `../temp_out_${Date.now()}.webp`);
        fs.writeFileSync(tempFileIn, media);

        ffmpeg(tempFileIn)
            .on('error', (err) => {
                console.error('Error ffmpeg (image sticker):', err);
                if (fs.existsSync(tempFileIn)) fs.unlinkSync(tempFileIn);
                reject(err);
            })
            .on('end', () => {
                const sticker = fs.readFileSync(tempFileOut);
                fs.unlinkSync(tempFileIn);
                fs.unlinkSync(tempFileOut);
                resolve(sticker);
            })
            .toFormat('webp')
            .addOutputOptions([
                '-vcodec', 'libwebp',
                '-vf', `scale='min(512,iw)':min'(512,ih)':force_original_aspect_ratio=decrease,fps=15, pad=512:512:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`
            ])
            .duration(isVideo ? 5 : 999)
            .save(tempFileOut);
    });
}


module.exports = {
    name: 'stiker',
    description: 'Mengubah gambar/video menjadi stiker.',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        
        const messageType = Object.keys(msg.message)[0];
        const isMedia = (messageType === 'imageMessage' || messageType === 'videoMessage');
        const isQuotedMedia = msg.message.extendedTextMessage?.contextInfo?.quotedMessage && (msg.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage || msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage);

        if (!isMedia && !isQuotedMedia) {
             await sock.sendMessage(from, { text: `Perintah .stiker harus dikirim bareng gambar/video, atau balas gambar/video yang sudah ada.` }, { quoted: msg });
            return;
        }

        let mediaMsg;
        let mediaType;
        if (isMedia) {
            mediaMsg = msg.message[messageType];
            mediaType = messageType;
        } else {
            mediaMsg = msg.message.extendedTextMessage.contextInfo.quotedMessage[Object.keys(msg.message.extendedTextMessage.contextInfo.quotedMessage)[0]];
            mediaType = Object.keys(msg.message.extendedTextMessage.contextInfo.quotedMessage)[0];
        }
        
        console.log(`[Sticker] Perintah diterima dari ${from}`);
        await sock.sendMessage(from, { text: 'Sabar ya, stiker lagi dibikin...' }, { quoted: msg });
        
        const stream = await downloadContentFromMessage(mediaMsg, mediaType.replace('Message', ''));
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        
        const sticker = await createSticker(buffer, mediaType === 'videoMessage');
        await sock.sendMessage(from, { sticker: sticker }, { quoted: msg });
    }
};
