const fs = require('fs')
const downloadMP3 = require('../utils/downloader')
const cooldown = require('../utils/cooldown')

module.exports = async (sock, msg, text) => {
    const jid = msg.key.remoteJid

    const cd = cooldown(jid, 60)
    if (cd > 0) {
        return sock.sendMessage(jid, {
            text: `⏳ Tunggu ${cd} detik`
        })
    }

    const url = text.split(' ')[1]
    if (!url) {
        return sock.sendMessage(jid, {
            text: '❌ Contoh:\n.ytmp3 https://youtube.com/...'
        })
    }

    await sock.sendMessage(jid, { text: '🎵 Mengunduh audio...' })

    try {
        const file = await downloadMP3(url)

        await sock.sendMessage(jid, {
            audio: fs.readFileSync(file),
            mimetype: 'audio/mpeg',
            fileName: 'audio.mp3'
        })

        fs.unlinkSync(file)
    } catch (e) {
        console.error(e)
        await sock.sendMessage(jid, {
            text: '❌ Gagal download (video terlalu panjang / diblokir)'
        })
    }
}
