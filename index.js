// =================================================================
// STRUKTUR BARU: index.js (Hanya sebagai Manajer/Otak)
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

// Fungsi utama untuk menjalankan bot
async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    // Buat koneksi socket
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
    });

    // =================================================================
    // BAGIAN PENTING: MEMBACA SEMUA PERINTAH DARI FOLDER 'commands'
    // =================================================================
    sock.commands = new Map();
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.join(__dirname, 'commands', file));
        sock.commands.set(command.name, command);
        console.log(`[Command Loader] Berhasil memuat perintah: ${command.name}.js`);
    }
    // =================================================================

    // Handler untuk koneksi
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            console.log('Pindai QR code ini:');
            qrcode.generate(qr, { small: true });
        }
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom) && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) connectToWhatsApp();
        } else if (connection === 'open') {
            console.log('Koneksi berhasil! Bot siap menerima perintah.');
        }
    });

    // Simpan kredensial
    sock.ev.on('creds.update', saveCreds);

    // Handler utama untuk pesan masuk
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const fullMessage = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || msg.message.videoMessage?.caption || '';
        if (!fullMessage) return;

        // Cek apakah pesan adalah perintah
        const prefix = '.';
        if (!fullMessage.startsWith(prefix)) return;

        const args = fullMessage.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = sock.commands.get(commandName);

        if (command) {
            try {
                // Jalankan perintah dari file yang sesuai
                await command.execute(sock, msg, args);
            } catch (error) {
                console.error(`Error saat menjalankan perintah '${commandName}':`, error);
                await sock.sendMessage(msg.key.remoteJid, { text: `Waduh, ada error pas jalanin perintah itu.\n\nError: ${error.message}` }, { quoted: msg });
            }
        }
    });
}

// Jalankan bot!
connectToWhatsApp();
