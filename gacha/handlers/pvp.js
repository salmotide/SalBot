const monsters = require('../database/monsters.json')
const { loadPlayers, savePlayers } = require('../utils/db')
const { attack } = require('../utils/battle')

module.exports = async (sock, msg) => {
  const players = loadPlayers()
  const ids = Object.keys(players)

  if (ids.length < 2) return

  const p1 = players[ids[0]]
  const p2 = players[ids[1]]

  let m1 = monsters.find(m => m.id === p1.activeMonster)
  let m2 = monsters.find(m => m.id === p2.activeMonster)

  let hp1 = m1.hp
  let hp2 = m2.hp
  let turn = true

  while (hp1 > 0 && hp2 > 0) {
    if (turn) {
      const r = attack(m1, m2)
      hp2 -= r.damage
    } else {
      const r = attack(m2, m1)
      hp1 -= r.damage
    }
    turn = !turn
  }

  if (hp1 > 0) {
    p1.win++; p2.lose++
  } else {
    p2.win++; p1.lose++
  }

  savePlayers(players)
}
