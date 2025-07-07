/**
 * Konfigurasi API Keys untuk berbagai service upscaling
 * Ganti 'YOUR_API_KEY' dengan API key yang sebenarnya
 */

const API_CONFIG = {
    // DeepAI - Free tier tersedia
    // Daftar di: https://deepai.org/
    DEEPAI: {
        API_KEY: 'ec0c3ef5-6727-49ff-9f8a-4d3d0ed429da',
        ENDPOINT: 'https://api.deepai.org/api/waifu2x'
    },
    
    // Clipdrop - Free tier tersedia
    // Daftar di: https://clipdrop.co/
    CLIPDROP: {
        API_KEY: 'mLjJ3KXkmZPlMN6iUzvT1MmOst83',
        ENDPOINT: 'https://clipdrop-api.co/image-upscaling/v1/upscale'
    },
    
    // Replicate - Free tier tersedia
    // Daftar di: https://replicate.com/
    REPLICATE: {
        API_KEY: 'YOUR_REPLICATE_API_TOKEN',
        ENDPOINT: 'https://api.replicate.com/v1/predictions'
    },
    
    // Waifu2x - Gratis tanpa API key
    WAIFU2X: {
        ENDPOINT: 'https://api.waifu2x.booru.pics/api/v1/waifu2x'
    }
};

module.exports = API_CONFIG;