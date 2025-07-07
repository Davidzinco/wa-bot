// =================================================================
//              index.js (FINAL DENGAN REQUEST & RESPONSE LOG)
// =================================================================

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal');
const chalk = require('chalk');

// Fungsi utama untuk menjalankan bot
async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: true
    });

    // --- AWAL PEMBUNGKUS sendMessage UNTUK LOGGING RESPON ---
    const originalSendMessage = sock.sendMessage;
    sock.sendMessage = async function(...args) {
        const [jid, content] = args;

        // Log respon bot ke terminal
        let responseLog = chalk.bgMagenta.white(`[ RESPON BOT ]`) + `\n`;
        responseLog += `├ ${chalk.yellow('Pukul')}: ${new Date().toLocaleTimeString('id-ID')}\n`;
        responseLog += `└ ${chalk.cyan('Ke')}: ${jid}\n`;

        if (content.text) {
            responseLog += `   └─[ Teks ] "${content.text}"`;
        } else if (content.sticker) {
            responseLog += `   └─[ Media ] Mengirim Stiker`;
        } else if (content.image) {
            responseLog += `   └─[ Media ] Mengirim Gambar`;
        } else if (content.video) {
            responseLog += `   └─[ Media ] Mengirim Video/GIF`;
        } else {
            responseLog += `   └─[ Media ] Mengirim media lain`;
        }
        console.log(responseLog);

        // Panggil fungsi asli untuk benar-benar mengirim pesan
        return originalSendMessage.apply(this, args);
    };
    // --- AKHIR PEMBUNGKUS ---


    sock.commands = new Map();
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        try {
            const command = require(path.join(__dirname, 'commands', file));
            sock.commands.set(command.name, command);
            console.log(chalk.green(`[Command Loader] Berhasil memuat: ${command.name}.js`));
        } catch (error) {
            console.error(chalk.red(`[Command Loader] Gagal memuat file ${file}:`), error);
        }
    }

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom) && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) connectToWhatsApp();
        } else if (connection === 'open') {
            console.log(chalk.blue.bold('Koneksi berhasil! Bot siap menerima perintah.'));
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const prefix = '.';
        let body = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || msg.message.videoMessage?.caption || '';
        
        const senderName = msg.pushName || 'Tanpa Nama';
        const senderJid = msg.key.remoteJid;
        const isGroup = senderJid.endsWith('@g.us');

        if (isGroup) {
            const mentionedJids = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            if (sock.user && sock.user.id) {
                const botJid = sock.user.id.replace(/:.*$/, "") + '@s.whatsapp.net';
                if (mentionedJids.includes(botJid)) {
                    const cleanedText = body.replace(/@\d+/g, '').trim();
                    if (cleanedText.length > 0 && !cleanedText.startsWith(prefix)) {
                        let log = chalk.bgBlue.white(`[ MENTION DITERIMA ]`) + `\n... (log mention seperti sebelumnya) ...`;
                        console.log(log); // Log untuk mention tetap ada
                        const introMessage = `Halo! 👋 Ada yang bisa saya bantu?\n\nKetik *.about* untuk melihat daftar perintah yang tersedia.`;
                        await sock.sendMessage(msg.key.remoteJid, { text: introMessage }, { quoted: msg });
                        return;
                    }
                    body = cleanedText;
                }
            }
        }
        
        if (!body.startsWith(prefix)) return;

        const args = body.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = sock.commands.get(commandName);

        if (command) {
            let log = chalk.bgGreen.white(`[ PERINTAH DITERIMA ]`) + `\n`;
            log += `├ ${chalk.yellow('Pukul')}: ${new Date().toLocaleTimeString('id-ID')}\n`;
            log += `├ ${chalk.green('Dari')}: ${senderName}\n`;
            if (isGroup) {
                try {
                    const groupMeta = await sock.groupMetadata(senderJid);
                    log += `├ ${chalk.cyan('Di Grup')}: ${groupMeta.subject}\n`;
                } catch (e) {}
            }
            log += `└ ${chalk.magenta('Perintah')}: ${chalk.bold(commandName)} | ${chalk.magenta('Args')}: "${args.join(' ')}"`;
            console.log(log);

            try {
                await command.execute(sock, msg, args);
            } catch (error) {
                console.error(chalk.red(`Error saat menjalankan perintah '${commandName}':`), error);
                await sock.sendMessage(msg.key.remoteJid, { text: `Waduh, ada error pas jalanin perintah itu.`}, { quoted: msg });
            }
        }
    });
}

connectToWhatsApp();