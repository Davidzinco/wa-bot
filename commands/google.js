// commands/google.js
const { google } = require('googleapis');
const { Google_Search_api_key, Google_Search_engine_id } = require('../config.json');

const customsearch = google.customsearch('v1');

module.exports = {
    name: 'google',
    description: 'Cari informasi di Google.',
    async execute(client, msg, args) {
        const query = args.join(' ');
        if (!query) {
            msg.reply('Mau cari apa di Google? Contoh: `!google harga iPhone terbaru`');
            return;
        }

        try {
            msg.reply(`Lagi cari "${query}" di Google...`);
            const res = await customsearch.cse.list({
                auth: Google_Search_api_key,
                cx: Google_Search_engine_id,
                q: query,
                num: 3 // Ambil 3 hasil teratas
            });

            const items = res.data.items;
            if (!items || items.length === 0) {
                msg.reply(`Tidak ada hasil untuk "${query}"`);
                return;
            }

            let searchResult = `*Hasil Pencarian Google untuk "${query}":*\n\n`;
            items.forEach((item, index) => {
                searchResult += `*${index + 1}. ${item.title}*\n`;
                searchResult += `_${item.snippet}_\n`;
                searchResult += `${item.link}\n\n`;
            });

            msg.reply(searchResult);

        } catch (error) {
            console.error('Error Google Search:', error);
            msg.reply('Waduh, Google-nya lagi error.');
        }
    },
};