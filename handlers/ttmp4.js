const axios = require('axios');

module.exports = async (sock, m, args) => {
    if (!args[0]) return m.reply('❌ Masukkan link TikTok');

    m.reply('⏳ Processing...');

    const { data } = await axios.get(
        `https://tikwm.com/api/?url=${args[0]}`
    );

    await sock.sendMessage(
        m.chat,
        {
            video: { url: data.data.play },
            caption: '✅ TikTok → MP4'
        },
        { quoted: m }
    );
};
