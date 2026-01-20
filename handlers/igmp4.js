const axios = require('axios');

module.exports = async (sock, m, args) => {
    if (!args[0]) return m.reply('❌ Masukkan link Instagram');

    const url = args[0];
    m.reply('⏳ Mengambil video IG...');

    try {
        const { data } = await axios.get(
            `https://snapinsta.app/api/ajaxSearch`,
            {
                params: { q: url },
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Referer': 'https://snapinsta.app/'
                }
            }
        );

        if (!data || !data.data) return m.reply('❌ Gagal mengambil video');

        const videoUrl = data.data.match(/href="(https:[^"]+)"/)?.[1];
        if (!videoUrl) return m.reply('❌ Video tidak ditemukan');

        await sock.sendMessage(
            m.chat,
            {
                video: { url: videoUrl },
                caption: '✅ Instagram → MP4'
            },
            { quoted: m }
        );
    } catch (err) {
        console.error(err);
        m.reply('❌ Error IG downloader');
    }
};
