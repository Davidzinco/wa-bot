module.exports = {
    name: 'about',
    description: 'Menampilkan informasi tentang bot.',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        const introMessage = `
*Halo! Aku adalah Muze-Chan Bot!*
🤖 *Aku dibuat untuk membantu kamu dengan berbagai informasi dan hiburan.*
📚 *Berikut beberapa perintah yang bisa kamu gunakan:*
- *.anime [judul]* - Mencari informasi tentang anime.
- *.whatanime* - Mencari sumber anime dari screenshot.
- *.ai [pertanyaan]* - Mengajukan pertanyaan ke AI.
dan masih banyak lagi!
        `;

        // Kirim pesan perkenalan
        await sock.sendMessage(from, { text: introMessage }, { quoted: msg });
    }
};