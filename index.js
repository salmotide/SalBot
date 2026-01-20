require('dotenv').config()

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require('@whiskeysockets/baileys')

const Pino = require('pino')
const qrcode = require('qrcode-terminal')

const getText = require('./utils/getText')
const commandRouter = require('./router')

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session')

    const sock = makeWASocket({
        auth: state,
        logger: Pino({ level: 'silent' }),
        browser: ['Salmotide Bot', 'Chrome', '1.0.0']
    })

    // 🔐 SAVE SESSION
    sock.ev.on('creds.update', saveCreds)

    // 📡 CONNECTION
    sock.ev.on('connection.update', ({ qr, connection, lastDisconnect }) => {
        if (qr) qrcode.generate(qr, { small: true })

        if (
            connection === 'close' &&
            lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
        ) {
            startBot()
        }
    })

    // 📩 MESSAGE HANDLER
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]
        if (!msg?.message) return
        if (msg.key.fromMe) return

        const text = getText(msg)
        if (!text) return

        await commandRouter(sock, msg, text)
    })
}

console.log(`🤖 ${process.env.BOT_NAME || 'Salmotide Bot'} aktif`)
startBot()
