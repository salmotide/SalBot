const fs = require('fs')
const path = require('path')

const playerPath = path.join(__dirname, '../database/players.json')

function loadPlayers() {
  return JSON.parse(fs.readFileSync(playerPath))
}

function savePlayers(data) {
  fs.writeFileSync(playerPath, JSON.stringify(data, null, 2))
}

module.exports = { loadPlayers, savePlayers }
