const config = require('./config')
const prefix = config.bot.prefix

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

module.exports = async (sock, msg, text) => {
    if (!text) return

    const prefixes = Array.isArray(prefix) ? prefix : [prefix]
    const usedPrefix = prefixes.find(p => text.startsWith(p))
    if (!usedPrefix) return

    const args = text
        .slice(usedPrefix.length)
        .trim()
        .split(/\s+/)

    const command = args.shift()?.toLowerCase()
    if (!command) return

    const handler = commands[command]
    if (!handler) return

    try {
        await handler(sock, msg, text, args)
    } catch (err) {
        console.error(`Error command ${usedPrefix}${command}`, err)
    }
}
