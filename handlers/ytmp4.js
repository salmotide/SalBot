const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const YTDLP = path.join(__dirname, '../bin/yt-dlp.exe')

function run(cmd, args) {
    return new Promise((resolve, reject) => {
        const p = spawn(cmd, args, {
            windowsHide: true,
            stdio: ['ignore', 'pipe', 'pipe']
        })

        let stderr = ''
        p.stderr.on('data', d => stderr += d)

        p.on('close', code => {
            if (code === 0) resolve()
            else reject(stderr)
        })
    })
}

module.exports = async (sock, m, args) => {
    const jid = m.key.remoteJid
    const url = args[0]

    if (!url || !url.startsWith('http')) {
        return sock.sendMessage(jid, { text: '❌ Link tidak valid' }, { quoted: m })
    }

    if (!fs.existsSync('temp')) fs.mkdirSync('temp')

    const base = Date.now().toString()
    const output = path.join('temp', `${base}.mp4`)
    const fixed  = path.join('temp', `${base}_wa.mp4`)

    try {
        await sock.sendMessage(jid, { text: '⏳ Downloading video...' }, { quoted: m })

        // === yt-dlp ===
        await run(YTDLP, [
            '--no-playlist',
            '--js-runtimes', 'node',
            '-f', 'bv*[height<=720][ext=mp4]+ba[ext=m4a]/b[ext=mp4]',
            '--merge-output-format', 'mp4',
            '-o', output,
            url
        ])

        // === ffmpeg (WA compatible) ===
        await run('ffmpeg', [
            '-y',
            '-i', output,
            '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
            '-c:v', 'libx264',
            '-profile:v', 'baseline',
            '-level', '3.1',
            '-pix_fmt', 'yuv420p',
            '-r', '30',
            '-movflags', '+faststart',
            '-c:a', 'aac',
            '-b:a', '128k',
            '-ac', '2',
            '-ar', '44100',
            fixed
        ])

        const sizeMB = fs.statSync(fixed).size / (1024 * 1024)
        if (sizeMB > 64) throw 'Video terlalu besar untuk WhatsApp'

        await sock.sendMessage(jid, {
            video: fs.readFileSync(fixed),
            caption: `✅ YouTube → WhatsApp (${sizeMB.toFixed(1)} MB)`
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        await sock.sendMessage(jid, { text: '❌ Gagal memproses video' }, { quoted: m })
    } finally {
        if (fs.existsSync(output)) fs.unlinkSync(output)
        if (fs.existsSync(fixed)) fs.unlinkSync(fixed)
    }
}
