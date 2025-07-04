// index.js

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

// Inisialisasi client dengan strategi otentikasi lokal
// Ini akan menyimpan sesi di folder .wwebjs_auth agar tidak perlu scan QR terus-menerus
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true, // Jalankan browser di background
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ],
    }
});

// Menampung semua command yang ada
client.commands = new Map();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set command baru ke dalam Map dengan nama command sebagai key
    client.commands.set(command.name, command);
    console.log(`Memuat command: ${command.name}`);
}


// Event saat QR code perlu di-scan
client.on('qr', (qr) => {
    console.log('SCAN QR CODE DI BAWAH INI UNTUK LOGIN:');
    qrcode.generate(qr, { small: true });
});

// Event saat bot sudah berhasil login
client.on('ready', () => {
    console.log('Bot sudah siap dan terhubung ke WhatsApp!');
});

// Event saat ada pesan baru masuk
client.on('message', async (msg) => {
    // Abaikan pesan dari status atau bukan dari user
    if (msg.from === 'status@broadcast' || !msg.body.startsWith('!')) {
        return;
    }

    const args = msg.body.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) return;

    try {
        await command.execute(client, msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('Waduh, ada error pas jalanin perintah itu.');
    }
});


// Mulai koneksi
client.initialize();