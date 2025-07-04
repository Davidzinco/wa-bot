// commands/sticker.js
const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
    name: 'sticker',
    description: 'Membuat stiker dari gambar atau video/gif yang kamu kirim.',
    async execute(client, msg, args) {
        if (!msg.hasMedia) {
            msg.reply('Kirim gambar atau video dulu, baru kasih caption `!sticker`');
            return;
        }

        try {
            msg.reply('Oke, stiker lagi dibikin... Sabar ya!');
            const media = await msg.downloadMedia();

            // Kirim media sebagai stiker
            client.sendMessage(msg.from, media, {
                sendMediaAsSticker: true,
                stickerAuthor: 'Bot Keren Buatanmu',
                stickerName: 'Sticker Anjay'
            });

        } catch (error) {
            console.error('Error saat membuat stiker:', error);
            msg.reply('Gagal bikin stiker nih, coba lagi ya.');
        }
    },
};