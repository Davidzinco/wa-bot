const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { Sticker, StickerTypes } = require('wa-sticker-formatter'); // <-- IMPORT INI
const fs = require('fs');
const path = require('path');




async function createSticker(media, type, author, pack) {
    const sticker = new Sticker(media, {
        pack: pack,        
        author: author,    
        type: type,        
        quality: 50        
    });

    return await sticker.toBuffer(); 
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
        await sock.sendMessage(from, { text: 'Wait...' }, { quoted: msg });
        
        const stream = await downloadContentFromMessage(mediaMsg, mediaType.replace('Message', ''));
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

        try {
            const stickerBuffer = await createSticker(
                buffer, 
                StickerTypes.DEFAULT, 
                'Bot Keren',          
                'Sticker Anjay'       
            );

            await sock.sendMessage(from, { sticker: stickerBuffer }, { quoted: msg });

        } catch (error) {
            console.error('Error saat membuat stiker:', error);
            await sock.sendMessage(from, { text: 'Gagal membuat stiker, coba lagi ya.' }, { quoted: msg });
        }
    }
};