module.exports = {
    name: 'katakata',
    description: 'Memberikan kata-kata bijak atau motivasi hari ini.',
    async execute(sock, msg, args) {
        const from = msg.key.remoteJid;

        const kataList = [
            // ===== MOTIVASI & KESUKSESAN =====
            "Kesuksesan tidak datang kepadamu, kamu yang harus mendatanginya.",
            "Satu-satunya batasan untuk meraih mimpimu adalah keraguanmu sendiri.",
            "Jangan takut gagal. Takutlah jika tidak pernah mencoba.",
            "Mulai dari mana pun kamu berada. Gunakan apa yang kamu punya. Lakukan apa yang kamu bisa.",
            "Orang yang berhenti belajar akan menjadi pemilik masa lalu. Orang yang terus belajar akan menjadi pemilik masa depan.",
            "Kerja keras mengalahkan bakat ketika bakat tidak bekerja keras.",
            "Jangan menunggu kesempatan, ciptakanlah.",
            "Mimpi tidak akan menjadi kenyataan melalui sihir; butuh keringat, tekad, dan kerja keras.",
            "Jatuh tujuh kali, bangkit delapan kali.",
            "Setiap ahli dulunya adalah seorang pemula.",
            "Jika kamu bisa memimpikannya, kamu bisa melakukannya.",
            "Satu-satunya cara untuk melakukan pekerjaan hebat adalah dengan mencintai apa yang kamu lakukan.",
            "Jangan biarkan hari kemarin menyita terlalu banyak hari ini.",
            "Tindakan adalah kunci dasar untuk semua kesuksesan.",
            "Percayalah kamu bisa dan kamu sudah setengah jalan.",
            "Kualitas bukanlah sebuah tindakan, melainkan sebuah kebiasaan.",
            "Untuk berhasil, keinginanmu untuk sukses harus lebih besar dari ketakutanmu akan kegagalan.",
            "Jangan menyerah. Awal adalah yang paling sulit.",
            "Tantangan adalah yang membuat hidup menarik dan mengatasinya adalah yang membuat hidup bermakna.",
            "Bukan seberapa keras kamu memukul, tapi seberapa keras kamu bisa terpukul dan tetap maju.",
            "Disiplin adalah jembatan antara tujuan dan pencapaian.",
            "Fokus pada tujuan, bukan pada hambatan.",
            "Orang pesimis melihat kesulitan di setiap kesempatan. Orang optimis melihat kesempatan di setiap kesulitan.",
            "Kamu tidak harus hebat untuk memulai, tapi kamu harus memulai untuk menjadi hebat.",
            "Jangan bandingkan bab-mu dengan bab orang lain. Setiap orang punya cerita yang berbeda.",
            "Sukses adalah jumlah dari usaha-usaha kecil yang diulang hari demi hari.",
            "Bekerjalah dalam diam, biarkan kesuksesanmu yang berteriak.",
            "Ambisimu harus lebih besar dari alasanmu.",
            "Lakukan sesuatu hari ini yang akan membuat dirimu di masa depan berterima kasih.",
            "Jika rencananya tidak berhasil, ubah rencananya, bukan tujuannya.",

            // ===== KEHIDUPAN & KEBIJAKSANAAN =====
            "Hidup adalah 10% apa yang terjadi padamu dan 90% bagaimana kamu menanggapinya.",
            "Kebahagiaan bukanlah sesuatu yang sudah jadi. Itu berasal dari tindakanmu sendiri.",
            "Masa depan adalah milik mereka yang percaya pada keindahan mimpi mereka.",
            "Dalam hidup ini, kita tidak bisa selalu melakukan hal besar. Tapi kita bisa melakukan hal-hal kecil dengan cinta yang besar.",
            "Jadilah perubahan yang ingin kamu lihat di dunia.",
            "Hidup menyusut atau berkembang sebanding dengan keberanian seseorang.",
            "Tiga hal dalam hidup yang tidak akan kembali: waktu, kata-kata, dan kesempatan.",
            "Pendidikan adalah senjata paling ampuh yang bisa kamu gunakan untuk mengubah dunia.",
            "Cara terbaik untuk memprediksi masa depan adalah dengan menciptakannya.",
            "Jangan menghitung hari, buatlah hari-hari itu berarti.",
            "Hidup itu seperti mengendarai sepeda. Untuk menjaga keseimbangan, kamu harus terus bergerak.",
            "Waktu terbaik untuk menanam pohon adalah 20 tahun yang lalu. Waktu terbaik kedua adalah sekarang.",
            "Orang bijak belajar ketika mereka bisa. Orang bodoh belajar ketika mereka terpaksa.",
            "Maafkan orang lain, bukan karena mereka pantas dimaafkan, tetapi karena kamu pantas mendapatkan kedamaian.",
            "Kamu tidak akan pernah menemukan pelangi jika kamu terus melihat ke bawah.",
            "Hiduplah seolah-olah kamu akan mati besok. Belajarlah seolah-olah kamu akan hidup selamanya.",
            "Kedamaian datang dari dalam. Jangan mencarinya di luar.",
            "Hati yang bersyukur adalah magnet untuk keajaiban.",
            "Keindahan sejati dimulai saat kamu memutuskan untuk menjadi dirimu sendiri.",
            "Jangan terlalu serius, tidak ada yang keluar dari hidup ini hidup-hidup.",
            "Kendalikan pikiranmu, atau pikiranmu yang akan mengendalikanmu.",
            "Perjalanan seribu mil dimulai dengan satu langkah.",
            "Jadilah dirimu sendiri; semua orang lain sudah ada yang punya.",
            "Hal-hal terbaik dalam hidup ini tidak terlihat, itulah mengapa kita menutup mata saat menangis, mencium, dan bermimpi.",
            "Terkadang, hal-hal yang tidak bisa kita ubah pada akhirnya mengubah kita.",
            "Setiap hari mungkin tidak baik, tetapi ada sesuatu yang baik di setiap hari.",
            "Ketenangan adalah kekuatan super.",
            "Saat kamu fokus pada yang baik, yang baik akan menjadi lebih baik.",
            "Jadilah alasan seseorang tersenyum hari ini.",
            "Bukan beban yang menghancurkanmu, tapi caramu membawanya.",

            // ===== CINTA & HUBUNGAN =====
            "Cinta sejati tidak buta, ia hanya melihat apa yang penting.",
            "Hal terbaik untuk dipegang dalam hidup adalah satu sama lain.",
            "Kita mencintai bukan karena menemukan orang yang sempurna, tetapi karena belajar melihat orang yang tidak sempurna menjadi sempurna.",
            "Dicintai secara mendalam oleh seseorang memberimu kekuatan, sementara mencintai seseorang secara mendalam memberimu keberanian.",
            "Cinta terdiri dari satu jiwa yang menghuni dua tubuh.",
            "Di mana ada cinta, di situ ada kehidupan.",
            "Jika aku tahu apa itu cinta, itu karena kamu.",
            "Cinta adalah persahabatan yang diiringi musik.",
            "Aku lebih suka berbagi satu kehidupan denganmu daripada menghadapi semua zaman di dunia ini sendirian.",
            "Kamu adalah 'selalu' dan 'selamanya'-ku.",
            "Cinta adalah saat kebahagiaan orang lain lebih penting dari kebahagiaanmu sendiri.",
            "Aku melihatmu dan melihat sisa hidupku di depan mataku.",
            "Aku bersumpah aku tidak bisa mencintaimu lebih dari saat ini, namun aku tahu aku akan melakukannya besok.",
            "Cinta terbaik adalah yang membangkitkan jiwa; yang membuat kita meraih lebih banyak.",
            "Kamu tidak menikah dengan seseorang yang bisa kamu hidupi, kamu menikah dengan seseorang yang tanpanya kamu tidak bisa hidup.",
            
            // ===== PERSAHABATAN =====
            "Seorang teman adalah seseorang yang mengetahui semua tentangmu dan tetap mencintaimu.",
            "Persahabatan lahir pada saat seseorang berkata kepada yang lain, 'Apa! Kamu juga? Kupikir hanya aku.'",
            "Berjalan dengan seorang teman dalam gelap lebih baik daripada berjalan sendirian dalam terang.",
            "Teman sejati adalah mereka yang langka yang datang untuk menemukanmu di tempat-tempat gelap dan membawamu kembali ke terang.",
            "Banyak orang akan masuk dan keluar dari hidupmu, tetapi hanya teman sejati yang akan meninggalkan jejak di hatimu.",
            "Teman adalah keluarga yang kita pilih sendiri.",
            "Persahabatan bukanlah tentang siapa yang kamu kenal paling lama. Ini tentang siapa yang datang dan tidak pernah meninggalkan sisimu.",
            "Seorang teman adalah hadiah yang kamu berikan pada dirimu sendiri.",
            "Hal-hal tidak pernah begitu menakutkan ketika kamu punya sahabat.",
            "Teman yang baik seperti bintang. Kamu tidak selalu melihat mereka, tetapi kamu tahu mereka selalu ada di sana.",
        ];

        // Ambil satu kata-kata secara acak
        const randomKata = kataList[Math.floor(Math.random() * kataList.length)];

        console.log(`[KataKata] Mengirim kata-kata ke ${from}`);
        await sock.sendMessage(from, { text: `"${randomKata}"` }, { quoted: msg });
    }
};
