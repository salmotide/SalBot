const fs = require('fs')
const downloadMP3 = require('../utils/downloader')

module.exports = async (sock, msg, text) => {
    const jid = msg.key.remoteJid
    const url = text.split(' ')[1]

    if (!url) {
        return sock.sendMessage(jid, {
            text: '❌ Contoh:\n.igmp3 https://instagram.com/...'
        })
    }

    await sock.sendMessage(jid, { text: '🎧 Mengunduh audio Instagram...' })

    try {
        const file = await downloadMP3(url)

        await sock.sendMessage(jid, {
            audio: fs.readFileSync(file),
            mimetype: 'audio/mpeg'
        })

        fs.unlinkSync(file)
    } catch {
        await sock.sendMessage(jid, { text: '❌ Gagal unduh audio IG' })
    }
}
