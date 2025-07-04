// commands/textsticker.js
const { createCanvas } = require('canvas');
const { MessageMedia } = require('whatsapp-web.js');

function createTextSticker(text) {
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d');

    // Background transparan
    ctx.clearRect(0, 0, 512, 512);

    // Styling teks
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.font = 'bold 70px "Comic Sans MS"'; // Font bisa diganti
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Wrapping teks agar tidak keluar canvas
    const words = text.split(' ');
    let line = '';
    const lines = [];
    const maxWidth = 480;
    const lineHeight = 80;

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    const startY = 256 - (lines.length - 1) * lineHeight / 2;

    lines.forEach((l, i) => {
        const y = startY + i * lineHeight;
        ctx.strokeText(l.trim(), 256, y);
        ctx.fillText(l.trim(), 256, y);
    });

    return canvas.toBuffer('image/png');
}

module.exports = {
    name: 'textsticker',
    description: 'Membuat stiker dari teks (stiker anomali).',
    async execute(client, msg, args) {
        const text = args.join(' ');
        if (!text) {
            msg.reply('Kasih teksnya dong. Contoh: `!textsticker Halo Dunia`');
            return;
        }

        try {
            msg.reply('Stiker anomali lagi dibikin...');
            const imageBuffer = createTextSticker(text);
            const media = new MessageMedia('image/png', imageBuffer.toString('base64'), 'sticker.png');
            
            client.sendMessage(msg.from, media, {
                sendMediaAsSticker: true,
                stickerAuthor: 'Bot Anomali',
                stickerName: 'Teks Ajaib'
            });

        } catch (error) {
            console.error('Error membuat text sticker:', error);
            msg.reply('Gagal bikin stiker dari teks nih.');
        }
    },
};