const { loadPlayers, savePlayers } = require('../utils/db')

module.exports = async (sock, msg, text) => {
  const id = msg.key.participant || msg.key.remoteJid
  const name = text.split(' ').slice(1).join(' ')

  if (!name) return sock.sendMessage(msg.key.remoteJid, { text: '❌ Nama wajib diisi' })

  const players = loadPlayers()
  if (players[id]) return sock.sendMessage(msg.key.remoteJid, { text: '❌ Profile sudah ada' })

  players[id] = {
    id,
    name,
    monsters: [],
    activeMonster: null,
    win: 0,
    lose: 0
  }

  savePlayers(players)
  sock.sendMessage(msg.key.remoteJid, { text: `✅ Profile dibuat: ${name}` })
}
