const monsters = require('../database/monsters.json')
const { loadPlayers } = require('../utils/db')

module.exports = async (sock, msg) => {
  const players = Object.values(loadPlayers())

  players.sort((a, b) => {
    if (b.win !== a.win) return b.win - a.win
    const wrA = a.win / Math.max(1, a.win + a.lose)
    const wrB = b.win / Math.max(1, b.win + b.lose)
    return wrB - wrA
  })

  let text = '🏆 LEADERBOARD\n\n'
  players.forEach((p, i) => {
    const m = monsters.find(x => x.id === p.activeMonster)
    const total = p.win + p.lose
    const wr = total ? ((p.win / total) * 100).toFixed(1) : 0
    text += `${i + 1}. ${p.name} | ${m?.name || '-'} | ${p.win}/${p.lose} (${wr}%)\n`
  })

  sock.sendMessage(msg.key.remoteJid, { text })
}
