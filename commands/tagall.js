module.exports = {
    name: 'tagall',
    description: 'Mention semua anggota grup.',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        if (!from.endsWith('@g.us')) {
            await sock.sendMessage(from, { text: 'Perintah ini hanya bisa dipakai di dalam grup!' }, { quoted: msg });
            return;
        }

        console.log(`[Tag All] Perintah diterima dari ${from}`);

        const groupMetadata = await sock.groupMetadata(from);
        const participants = groupMetadata.participants;

        let text = '📣\n\n';
        let mentions = [];

        for (let participant of participants) {
            const userNumber = participant.id.split('@')[0];
            text += `↳ @${userNumber}\n`;
            mentions.push(participant.id);
        }

        await sock.sendMessage(from, { text: text, mentions: mentions }, { quoted: msg });
    }
};
