const ytdlp = require('yt-dlp-exec')
const path = require('path')
const fs = require('fs')

module.exports = async function downloadMP3(url) {
    const tempDir = path.join(__dirname, '../temp')
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

    const file = path.join(tempDir, `${Date.now()}.mp3`)

    await ytdlp(url, {
        extractAudio: true,
        audioFormat: 'mp3',
        audioQuality: 0,
        ffmpegLocation: path.join(__dirname, '../ffmpeg/bin'),
        output: file,
        noPlaylist: true
    })

    return file
}
