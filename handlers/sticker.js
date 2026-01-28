const { downloadMediaMessage } = require('@whiskeysockets/baileys')
const {
    imageToSticker,
    videoToSticker,
    PACKNAME,
    AUTHOR
} = require('../utils/image')
const cooldown = require('../utils/cooldown')

module.exports = async (sock, msg) => {
    const jid = msg.key.remoteJid
    const sender = msg.key.participant || jid

    try {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
        const imageMsg = msg.message?.imageMessage || quoted?.imageMessage
        const videoMsg = msg.message?.videoMessage || quoted?.videoMessage

        if (!imageMsg && !videoMsg) {
            return sock.sendMessage(jid, {
                text: '❌ Kirim / reply FOTO atau GIF lalu ketik `.sticker`'
            })
        }

        // // =======================
        // // COOLDOWN (ANTI SPAM)
        // // =======================
        // if (cooldown(sender)) {
        //     return sock.sendMessage(jid, {
        //         text: '⏳ Tunggu sebentar...'
        //     })
        // }

        // =======================
        // FOTO
        // =======================
        if (imageMsg) {
            const buffer = await downloadMediaMessage(
                { message: { imageMessage: imageMsg } },
                'buffer',
                {},
                { logger: sock.logger }
            )

            const sticker = await imageToSticker(buffer)

            return sock.sendMessage(jid, {
                sticker,
                packname: PACKNAME,
                author: AUTHOR
            })
        }

        // =======================
        // VIDEO / GIF
        // =======================
        if (videoMsg) {
            const size = videoMsg.fileLength || 0
            if (size > 8 * 1024 * 1024) {
                return sock.sendMessage(jid, {
                    text: '❌ Video terlalu besar (max 8MB)'
                })
            }

            const buffer = await downloadMediaMessage(
                { message: { videoMessage: videoMsg } },
                'buffer',
                {},
                { logger: sock.logger }
            )

            const sticker = await videoToSticker(buffer)

            return sock.sendMessage(jid, {
                sticker,
                packname: PACKNAME,
                author: AUTHOR
            })
        }

    } catch (err) {
        console.error('[STICKER ERROR]', err)
        await sock.sendMessage(jid, {
            text: '❌ Gagal membuat sticker'
        })
    }
}
