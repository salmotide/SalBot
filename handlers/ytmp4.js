const { exec } = require('child_process');
const fs = require('fs');

module.exports = async (sock, m, args) => {
    if (!args[0]) return m.reply('❌ Masukkan link YouTube');

    const url = args[0];
    const output = `temp/${Date.now()}.mp4`;

    m.reply('⏳ Downloading video...');

    exec(`yt-dlp -f mp4 -o "${output}" ${url}`, async (err) => {
        if (err) {
            return m.reply('❌ Gagal download');
        }

        await sock.sendMessage(
            m.chat,
            {
                video: fs.readFileSync(output),
                caption: '✅ YouTube → MP4'
            },
            { quoted: m }
        );

        fs.unlinkSync(output);
    });
};
