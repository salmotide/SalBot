require('dotenv').config()

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require('@whiskeysockets/baileys')

const Pino = require('pino')
const qrcode = require('qrcode-terminal')
const fs = require('fs')
const path = require('path')

const getText = require('./utils/getText')
const commandRouter = require('./router')

let _reconnectTimer = null
let _starting = false
let _sock = null

// Clear session files when logged out
function clearSession() {
    const sessionPath = './session'
    if (fs.existsSync(sessionPath)) {
        const files = fs.readdirSync(sessionPath)
        files.forEach(file => {
            if (!file.startsWith('.')) {
                try {
                    fs.unlinkSync(path.join(sessionPath, file))
                } catch (e) {
                    console.error(`Failed to delete ${file}:`, e.message)
                }
            }
        })
        console.log('Session cleared — please scan QR code again')
    }
}

async function startBot() {
    if (_starting) return
    _starting = true

    let state, saveCreds
    try {
        ({ state, saveCreds } = await useMultiFileAuthState('./session'))
    } catch (err) {
        console.error('Failed to load auth state:', err)
        _starting = false
        return
    }

    _sock = makeWASocket({
        auth: state,
        logger: Pino({ level: 'silent' }),
        browser: ['Salmotide Bot', 'Chrome', '1.0.0']
    })

    // 🔐 SAVE SESSION (wrapped for logging)
    _sock.ev.on('creds.update', async () => {
        try {
            await saveCreds()
            console.log('creds.update — saved')
        } catch (e) {
            console.error('Failed to save creds:', e)
        }
    })

    // 📡 CONNECTION
    _sock.ev.on('connection.update', (update) => {
        try {
            console.log('connection.update', JSON.stringify(update))
        } catch (e) { /* ignore */ }

        const { qr, connection, lastDisconnect } = update
        if (qr) qrcode.generate(qr, { small: true })

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode
            const reason = lastDisconnect?.error?.data?.reason
            
            // 401 = Unauthorized (session expired/invalid)
            // DisconnectReason.loggedOut is usually 3
            if (statusCode === 401 || statusCode === DisconnectReason.loggedOut || reason === '401') {
                console.error('❌ Session invalid (401 Unauthorized) — clearing session')
                clearSession()
                _starting = false
                
                if (_reconnectTimer) clearTimeout(_reconnectTimer)
                _reconnectTimer = setTimeout(() => {
                    _starting = false
                    console.log('🔄 Restarting bot for new QR code...')
                    startBot()
                }, 2000)
                return
            }

            console.error('Connection closed. lastDisconnect:', lastDisconnect)

            if (_reconnectTimer) clearTimeout(_reconnectTimer)
            // small delay before reconnect to avoid rapid restarts
            _reconnectTimer = setTimeout(() => {
                _starting = false
                console.log('🔄 Reconnecting...')
                startBot()
            }, 5000)
        }

        if (connection === 'open') {
            console.log('✅ Connected — socket open')
            _starting = false
        }
    })

    // 📩 MESSAGE HANDLER
    _sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]
        if (!msg?.message) return
        if (msg.key.fromMe) return

        const text = getText(msg)
        if (!text) return

        await commandRouter(_sock, msg, text)
    })
}

console.log(`🤖 ${process.env.BOT_NAME || 'Salmotide Bot'} aktif`)
startBot()
