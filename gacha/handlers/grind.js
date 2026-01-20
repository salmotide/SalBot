const monsters = require('../database/monsters.json')
const { loadPlayers, savePlayers } = require('../utils/db')
const { chance } = require('../utils/rng')

module.exports = async (sock, msg, text) => {
  const id = msg.key.participant || msg.key.remoteJid
  const hours = parseInt(text.split(' ')[1])

  if (!hours) return sock.sendMessage(msg.key.remoteJid, { text: '❌ Contoh: !grind 24' })

  const players = loadPlayers()
  const player = players[id]
  if (!player) return

  // ZONK chance (makin lama makin bahaya)
  if (chance(40 + hours * 0.3)) {
    return sock.sendMessage(msg.key.remoteJid, { text: '💀 Grind gagal... ZONK total.' })
  }

  // Pool rarity
  let pool = monsters.filter(m => {
    if (hours < 24) return m.rarity === 'Common'
    if (hours < 72) return m.rarity !== 'Legendary'
    return true
  })

  const drop = pool[Math.floor(Math.random() * pool.length)]

  // Duplikat = HANGUS
  if (player.monsters.includes(drop.id)) {
    return sock.sendMessage(msg.key.remoteJid, { text: `🔥 Kamu menemukan ${drop.name}, tapi sudah punya. HANGUS.` })
  }

  player.monsters.push(drop.id)
  if (!player.activeMonster) player.activeMonster = drop.id

  savePlayers(players)
  sock.sendMessage(msg.key.remoteJid, { text: `🎉 Kamu mendapatkan ${drop.name} (${drop.rarity})` })
}
