// commands/toimg.js

module.exports = {
    name: 'toimg',
    description: 'Mengubah stiker menjadi gambar/video (gif).',
    async execute(client, msg, args) {
        // Cek apakah pesan yang di-reply adalah stiker
        if (!msg.hasQuotedMsg || !msg.getQuotedMessage().hasMedia || msg._getQuotedMessage().type !== 'sticker') {
            msg.reply('Reply stiker yang mau diubah dengan perintah `!toimg`');
            return;
        }

        try {
            msg.reply('Oke, lagi diubah jadi gambar...');
            const quotedMsg = await msg.getQuotedMessage();
            const media = await quotedMsg.downloadMedia();
            
            client.sendMessage(msg.from, media);
        } catch (error) {
            console.error('Error saat mengubah stiker:', error);
            msg.reply('Gagal mengubah stiker, coba lagi ya.');
        }
    },
};