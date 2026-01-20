const os = require('os')
const fs = require('fs')
const path = require('path')

module.exports = async (sock, msg) => {
    const jid = msg.key.remoteJid
    const isGroup = jid.endsWith('@g.us')

    const uptime = Math.floor(process.uptime() / 60)
    const ram = ((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(0)

    const banner = `
════════════════════
    𝐒𝐀𝐋𝐌𝐎𝐓𝐈𝐃𝐄 𝐁𝐎𝐓 
    アニメ × RPG × DL
════════════════════
`

    const menuText = `
${banner}

👤 *Mode* : ${isGroup ? '👥 Group Chat' : '👤 Private Chat'}
⏱️ *Uptime* : ${uptime} menit
💾 *RAM* : ${ram} MB

━━━━━━━━━━━━━━━━━━
🖼️ *STICKER*
━━━━━━━━━━━━━━━━━━
✦ *.sticker* <reply foto/gif/video>

━━━━━━━━━━━━━━━━━━
🎵 *DOWNLOADER*
━━━━━━━━━━━━━━━━━━
mp3:
✦ *.ytmp3* <link>
✦ *.ttmp3* <link>
✦ *.igmp3* <link>

mp4:
✦ *.ytmp4* <link>
✦ *.ttmp4* <link>
✦ *.igmp4* <link>

━━━━━━━━━━━━━━━━━━
⚙️ *INFO*
━━━━━━━━━━━━━━━━━━
✦ *.ping*
✦ *.pingtag*
✦ *.menu*

🌸 Powered by *Salmotide*
`

    const imgPath = path.join(__dirname, 'assets', 'menu.jpeg')

    if (fs.existsSync(imgPath)) {
        await sock.sendMessage(jid, {
            image: fs.readFileSync(imgPath),
            caption: menuText
        })
    } else {
        await sock.sendMessage(jid, { text: menuText })
    }
}
