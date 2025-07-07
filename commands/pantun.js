module.exports = {
    name: 'pantun',
    description: 'Memberikan pantun acak.',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        const pantunList = [
            // =================================
            // PANTUN KOCAK
            // =================================
            "Burung perkutut, burung kutilang,\nkamu kentut nggak bilang-bilang.",
            "Makan jengkol perut melilit,\npunya utang pura-pura sakit.",
            "Jalan-jalan ke Bekasi,\nnaik ojek ongkosnya pas.\nHari gini masih galau, sini aku traktir es.",
            "Beli baju di toko batik,\nkamu lucu tapi kok pelit.",
            "Ikan hiu makan tomat,\nI love you so much...amat.",
            "Buah manggis, buah kedondong,\nNona manis, gendong aku dong.",
            "Jaka sembung naik ojek,\nNggak nyambung, jek.",
            "Minum jamu sambil berdiri,\ndiseduh sama air panas.\nKatanya mau diet hari ini,\nkok malah nambah nasi panas?",
            "Buah semangka buah duren,\nnggak nyangka aku keren.",
            "Di sini gunung di sana gunung,\ndi tengah-tengahnya Pulau Jawa.\nKamu bingung aku pun bingung,\nkenapa kita jadi ketawa?",
            "Beli duren ke Cikini,\npulangnya naik taksi.\nSadar diri dong, hei,\nkamu kan cuma teman fiksi.",

            // =================================
            // PANTUN BUCIN
            // =================================
            "Hari Minggu pergi ke pasar,\npulangnya beli alpukat.\nHatiku langsung bergetar,\nsetiap kali melihatmu lewat.",
            "Nonton drakor sampai pagi,\npemerannya ganteng-ganteng.\nTapi cuma kamu di hati,\nyang lain nggak ada yang penting.",
            "Makan bakso di Cimaung,\npedesnya bikin keringetan.\nDaripada aku bingung,\nmending langsung ke pelaminan.",
            "Langit biru banyak awannya,\nkalau kamu banyak yang punya?\nSemoga nggak ada ya.",
            "Beli benang di toko kain,\nbenangnya putus melulu.\nDaripada mikirin yang lain,\nmending mikirin aku melulu.",
            "Makan siang pakai bakwan,\npulangnya kehujanan.\nWalau banyak cowok tampan,\ncuma kamu yang jadi idaman.",
            "Pergi ke Bandung lewat Cipularang,\njangan lupa beli oleh-oleh.\nHatiku ini sedang bimbang,\napakah aku memilikimu boleh?",
            "Bunga mawar bunga melati,\nwanginya sampai ke sini.\nTiap detik kamu di hati,\ntiap menit kamu di sini.",
            "Satu tambah satu sama dengan dua,\naku tambah kamu sama dengan sempurna.",
            "Naik delman ke Surabaya,\nboleh dong aku bilang I love ya?",
            "Ada pelangi di kala senja,\nwarnanya indah tiada tara.\nWahai kamu yang di sana,\nkapan kita akan berjumpa?",

            // =================================
            // PANTUN NGINGETIN & NASIHAT
            // =================================
            "Langit malam penuh bintang,\nudaranya dingin banget.\nJangan sering-sering begadang,\nnanti sakit repot lho, inget.",
            "Beli kopi di warung Pak Amat,\nkopinya pahit bikin melek.\nKalau tugas belum tamat,\nbesok lanjut jangan capek.",
            "Lihat bulan di atas genteng,\ncahayanya terang sekali.\nUdah malam, ayo merem ganteng/cantik,\nbiar besok seger lagi.",
            "Kalau ada sumur di ladang,\nboleh kita menumpang mandi.\nKalau lagi banyak kerjaan jangan begadang,\njaga kesehatan diri.",
            "Makan bubur di pagi hari,\njangan lupa pakai kerupuk.\nJangan lupa minum air hari ini,\nbiar badan nggak dehidrasi dan remuk.",
            "Anak ayam turun sepuluh,\nmati satu tinggal sembilan.\nJangan lupa sholat subuh,\nbiar hari penuh keberkahan.",
            "Ke Cimaung beli bakso petir,\nrasanya pedas luar biasa.\nJangan lupa untuk berpikir,\nsebelum bertindak dan berkata.",
            "Naik motor ke Katapang,\njalannya kadang berlubang.\nJangan lupa untuk menabung,\nbuat masa depan yang lebih gemilang.",
            "Kalau ada jarum yang patah,\njangan disimpan di dalam peti.\nKalau ada kata yang salah,\njangan disimpan di dalam hati.",
            "Beli tali di warung sebelah,\ntalinya kuat buat mengikat.\nJangan lupa bilang 'bismillah',\nbiar semua kerjaan jadi berkat.",
            "Sore-sore enaknya ngeteh,\nsambil makan pisang goreng.\nJangan lupa istirahat ya,\nbiar pikiran jadi fresh.",
            "Ada semut di atas papan,\npapannya dari kayu jati.\nJangan lupa sarapan,\nbiar kuat hadapi hari ini.",

            // =================================
            // PANTUN ORIGINAL
            // =================================
            "Makan roti pakai selai,\nMinumnya teh anget-anget.\nNgoding dari pagi sampai selesai,\nDemi bot yang keren banget!"
        ];

        // Ambil satu pantun secara acak
        const randomPantun = pantunList[Math.floor(Math.random() * pantunList.length)];

        console.log(`[Pantun] Mengirim pantun ke ${from}`);
        await sock.sendMessage(from, { text: randomPantun }, { quoted: msg });
    }
};
