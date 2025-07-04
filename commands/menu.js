module.exports = {
    name: 'menu',
    description: 'Menampilkan daftar menu perintah.',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const menuText = `
╭───「 *MENU BOT* 」
│
│ Halo! Aku bot buatan Muna-kun.
│ Ini daftar perintah yang bisa kamu pakai:
│
│ ❏  *.ig <link>*
│     Download video Reels Instagram.
│
│ ❏  *.tiktok <link>*
│     Download video TikTok tanpa watermark.
│
│ ❏  *.ai <pertanyaan>*
│     Tanya apa saja ke AI Gemini.
│
│ ❏  *.stiker*
│     Balas gambar/video atau kirim dengan
│     caption .stiker untuk mengubahnya
│     jadi stiker.
│
│ ❏  *.tagall*
│     Sebut (mention) semua anggota di
│     grup ini.
│
╰───「 ✨ 」
        `;
        await sock.sendMessage(from, { text: menuText }, { quoted: msg });
    }
};
