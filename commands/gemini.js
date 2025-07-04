// commands/gemini.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { gemini_api_key } = require('../config.json');

const genAI = new GoogleGenerativeAI(gemini_api_key);

module.exports = {
    name: 'gemini',
    description: 'Tanya apa saja ke Gemini AI.',
    async execute(client, msg, args) {
        const prompt = args.join(' ');
        if (!prompt) {
            msg.reply('Mau tanya apa ke Gemini? Contoh: `!gemini Siapa penemu lampu?`');
            return;
        }

        try {
            msg.reply('Oke, lagi nanya ke Gemini... Mikir dulu ya...');
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            msg.reply(text);
        } catch (error) {
            console.error('Error Gemini:', error);
            msg.reply('Waduh, Gemini lagi pusing. Coba tanya lagi nanti.');
        }
    },
};