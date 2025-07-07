// File utama yang mengimport dan menggunakan handler
const { handleUpscaleImage } = require('./handlers/upscale-handler');

// Di dalam message handler:
// const processed = await handleUpscaleImage(sock, msg);
// if (processed) return; // Skip processing lainnya