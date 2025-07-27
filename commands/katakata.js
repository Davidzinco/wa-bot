const axios     = require('axios');
const translate = require('google-translate-api-x');

module.exports = {
    name: 'katakata',
    description: 'Quote random (anime atau umum) + terjemahan.',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        const fallback = [
            "Kesuksesan tidak datang kepadamu, kamu yang harus mendatanginya.",
            "Hiduplah seolah-olah kamu akan mati besok.",
            "Jangan menyerah. Awal adalah yang paling sulit."
        ];

        const useAnime = Math.random() < 0.5;

        try {
            if (useAnime) {
                const { data } = await axios.get('https://katanime.vercel.app/api/getrandom', { timeout: 8000 });
                const pick = data.result[Math.floor(Math.random() * data.result.length)];
                await sock.sendMessage(from, { text: `"${pick.indo}" — ${pick.character}` }, { quoted: msg });
            } else {
                const { data } = await axios.get('https://zenquotes.io/api/random', { timeout: 8000 });
                const { q: quoteEn, a: author } = data[0];
                const tr = await translate(quoteEn, { to: 'id' });
                const text = `"${tr.text}" — ${author}\n\n(Original: “${quoteEn}”)`;
                await sock.sendMessage(from, { text }, { quoted: msg });
            }
        } catch (e) {
            console.error('[katakata] Error:', e.message);
            const random = fallback[Math.floor(Math.random() * fallback.length)];
            await sock.sendMessage(from, { text: random }, { quoted: msg });
        }
    }
};