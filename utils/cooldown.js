const cooldown = new Map()

module.exports = (jid, seconds = 30) => {
    const now = Date.now()
    const expire = cooldown.get(jid) || 0

    if (now < expire) {
        const sisa = Math.ceil((expire - now) / 1000)
        return sisa
    }

    cooldown.set(jid, now + seconds * 1000)
    return 0
}
