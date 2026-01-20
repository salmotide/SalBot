module.exports = (msg) => {
    return (
        msg.message?.conversation ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption ||
        msg.message?.extendedTextMessage?.text ||
        ''
    ).trim()
}
