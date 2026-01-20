const commands = {
    menu: require('./handlers/menu'),
    sticker: require('./handlers/sticker'),
    ping: require('./handlers/ping'),
    igmp3: require('./handlers/igmp3'),
    ttmp3: require('./handlers/ttmp3'),
    ytmp3: require('./handlers/ytmp3'),
    igmp4: require('./handlers/igmp4'),
    ttmp4: require('./handlers/ttmp4'),
    ytmp4: require('./handlers/ytmp4'),
    pingtag: require('./handlers/pingtag'),

    // RPG
    profile: require('./gacha/handlers/profile'),
    grind: require('./gacha/handlers/grind'),
    pvp: require('./gacha/handlers/pvp'),
    leaderboard: require('./gacha/handlers/leaderboard')
}

// =============================== ROUTER ===============================
module.exports = async (sock, msg, text) => {
    if (!text.startsWith('.')) return

    const args = text
        .slice(1)
        .trim()
        .split(/\s+/)

    const command = args.shift().toLowerCase()

    if (!commands[command]) return

    try {
        await commands[command](sock, msg, text, args)
    } catch (err) {
        console.error(`Error command .${command}`, err)
    }
}
