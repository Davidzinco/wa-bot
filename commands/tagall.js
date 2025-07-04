module.exports = {
    name: 'tagall',
    description: 'Mention semua anggota grup.',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        // Cek apakah pesan berasal dari grup
        if (!from.endsWith('@g.us')) {
            await sock.sendMessage(from, { text: 'Perintah ini hanya bisa dipakai di dalam grup!' }, { quoted: msg });
            return;
        }

        console.log(`[Tag All] Perintah diterima dari ${from}`);
        
        // Ambil data anggota grup
        const groupMetadata = await sock.groupMetadata(from);
        const participants = groupMetadata.participants;

        let text = '📣 *SEMUANYA, KUMPUL!* 📣\n\n';
        let mentions = [];

        // Buat daftar mention untuk setiap anggota
        for (let participant of participants) {
            // Ambil nomornya saja, tanpa @s.whatsapp.net
            const userNumber = participant.id.split('@')[0];
            text += `│ ↳ @${userNumber}\n`;
            mentions.push(participant.id);
        }

        // Kirim pesan dengan mention
        await sock.sendMessage(from, { text: text, mentions: mentions }, { quoted: msg });
    }
};
