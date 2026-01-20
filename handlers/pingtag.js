module.exports = async (sock, msg) => {
    const jid = msg.key.remoteJid

    if (!jid || !jid.endsWith('@g.us')) {
        return sock.sendMessage(jid, {
            text: '❌ Command ini hanya untuk grup'
        }, { quoted: msg })
    }

    const metadata = await sock.groupMetadata(jid)

    // ambil nomor WA VALID
    const members = metadata.participants
        .map(p => p.phoneNumber)
        .filter(jid =>
            typeof jid === 'string' &&
            jid.endsWith('@s.whatsapp.net')
        )

    if (!members.length) {
        return sock.sendMessage(jid, {
            text: '❌ Tidak ada member valid'
        }, { quoted: msg })
    }

    // 🔥 BUAT TEKS @NOMOR ASLI
    const text =
        `📢 *PING ALL MEMBER*\n\n` +
        members.map(j => `@${j.split('@')[0]}`).join(' ')

    await sock.sendMessage(
        jid,
        {
            text,
            mentions: members // ⚠️ INI WAJIB
        },
        { quoted: msg }
    )
}
