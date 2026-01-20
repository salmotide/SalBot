const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const { exec } = require('child_process')

/* =======================
   KONFIG
======================= */
const TMP = path.join(__dirname, '../temp')
if (!fs.existsSync(TMP)) fs.mkdirSync(TMP, { recursive: true })

const config = require('../config')

const PACKNAME = config.sticker.packname
const AUTHOR = config.sticker.author


/* =======================
   UTIL
======================= */
function tmp(ext) {
    return path.join(TMP, `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`)
}

function run(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, { maxBuffer: 50 * 1024 * 1024 }, (err, stdout, stderr) => {
            if (err) {
                console.error('FFMPEG ERROR:\n', stderr)
                return reject(err)
            }
            resolve()
        })
    })
}

/* =======================
   IMAGE → STICKER
   - Rasio asli
   - Tidak dipaksa kotak
======================= */
async function imageToSticker(buffer) {
    return sharp(buffer, { limitInputPixels: false })
        .resize(512, 512, {
            fit: 'cover',        // 🔥 PENTING
            position: 'centre'   // crop tengah
        })
        .webp({
            quality: 70,
            effort: 3
        })
        .toBuffer()
}

/* =======================
   VIDEO / GIF → STICKER
   - WA WAJIB 512x512
   - Scale + pad
   - FPS rendah
======================= */
async function videoToSticker(buffer) {
    const input = tmp('mp4')
    const output = tmp('webp')

    fs.writeFileSync(input, buffer)

    const cmd = `ffmpeg -y -i "${input}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=white,fps=10" -vcodec libwebp -loop 0 -preset default -quality 60 -an -t 6 "${output}"`

    try {
        await run(cmd)

        if (!fs.existsSync(output)) {
            throw new Error('Output sticker tidak dibuat FFmpeg')
        }

        const result = fs.readFileSync(output)
        return result

    } finally {
        // cleanup aman
        if (fs.existsSync(input)) fs.unlinkSync(input)
        if (fs.existsSync(output)) fs.unlinkSync(output)
    }
}

/* =======================
   EXPORT
======================= */
module.exports = {
    imageToSticker,
    videoToSticker,
    PACKNAME,
    AUTHOR
}
