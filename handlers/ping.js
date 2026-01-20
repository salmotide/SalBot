const os = require('os')

module.exports = async (sock, msg) => {
    const uptime = Math.floor(process.uptime() / 60)
    const ram = ((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(0)

    await sock.sendMessage(msg.key.remoteJid, {
        text: `⚙️ *STATUS BOT*

⏱ Uptime: ${uptime} menit
💾 RAM: ${ram} MB
🟢 Status: Online`
    })
}
