const wiki = require('wikijs').default;

module.exports = {
    name: 'wiki',
    description: 'Mencari informasi dari Wikipedia.',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const query = args.join(' ');

        if (!query) {
            await sock.sendMessage(from, { text: 'Mau cari apa di Wikipedia? Contoh: .wiki Indonesia' }, { quoted: msg });
            return;
        }

        try {
            console.log(`[Wiki] Mencari: ${query}`);
            await sock.sendMessage(from, { text: 'Wait...' }, { quoted: msg });

            // Mencari halaman di Wikipedia (bahasa Indonesia)
            const page = await wiki({ apiUrl: 'https://id.wikipedia.org/w/api.php' }).page(query);
            const summary = await page.summary();
            const imageUrl = await page.mainImage();
            const pageUrl = page.url();

            // Batasi ringkasan agar tidak terlalu panjang
            const shortSummary = summary.substring(0, 400) + '...';

            const caption = `
*${page.title}*

${shortSummary}

*Baca selengkapnya:*
${pageUrl}
            `;

            // Kirim gambar (jika ada) dengan caption ringkasan
            await sock.sendMessage(from, {
                image: { url: imageUrl },
                caption: caption
            }, { quoted: msg });

        } catch (error) {
            console.error('[Wiki] Error:', error);
            await sock.sendMessage(from, { text: `Waduh, nggak nemu info tentang "${query}". Coba pakai kata kunci lain ya.` }, { quoted: msg });
        }
    }
};
