/**
 * Fungsi untuk berinteraksi dengan Google Gemini AI
 * @param {string} prompt Pertanyaan atau perintah dari user
 * @returns {Promise<string>} Jawaban dari AI
 */
async function chatWithGemini(prompt) {
    try {
        console.log(`[Gemini AI] Mengirim prompt: "${prompt}"`);
        const apiKey = "AIzaSyB137iAwbVB88PuLYekWx9SJCE_J6Ey6J8"; // API Key kamu
        if (!apiKey) return "Waduh, API Key Gemini belum dimasukkan.";

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        
        // Kita bisa langsung pakai fetch karena sudah bawaan Node.js
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
        }
        const result = await response.json();
        if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
            return result.candidates[0].content.parts[0].text;
        } else {
            return "Maaf, aku bingung mau jawab apa.";
        }
    } catch (error) {
        console.error("[Gemini AI] Gagal menghubungi AI:", error);
        return `Waduh, lagi ada gangguan koneksi ke server AI.\n\nDetail Error: ${error.message}`;
    }
}

module.exports = {
    name: 'ai',
    description: 'Mengajukan pertanyaan ke AI Gemini.',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;
        const userPrompt = args.join(' ');

        if (!userPrompt) {
            await sock.sendMessage(from, { text: 'Mau tanya apa ke AI? Contoh: .ai Siapa penemu bola lampu?' }, { quoted: msg });
            return;
        }
        
        await sock.sendMessage(from, { text: 'Wait... Let Me Think' }, { quoted: msg });


        const aiResponse = await chatWithGemini(userPrompt);
        await sock.sendMessage(from, { text: aiResponse }, { quoted: msg });
    }
};
