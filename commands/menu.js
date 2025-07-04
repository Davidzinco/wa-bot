// commands/menu.js

module.exports = {
    name: 'menu',
    description: 'Menampilkan semua perintah yang tersedia.',
    execute(client, msg, args) {
        let menuMessage = `
╭───⌬ *🤖 DY BOT MENU* ⌬───╮
│ Berikut adalah daftar perintah yang tersedia:
╰─────────────────────────╯
`;

        const commands = client.commands;

        commands.forEach(command => {
            menuMessage += `🔹 *!${command.name}*\n`;
            menuMessage += `   _${command.description}_\n\n`;
        });

        menuMessage += `╭───────────────╮
│  📌 Ketik *!help <nama_perintah>* 
│  untuk info lebih lanjut.
╰───────────────╯

✨ copyright by @davidfes`;

        client.sendMessage(msg.from, menuMessage.trim());
    },
};
