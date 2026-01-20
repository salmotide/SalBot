const { chance } = require('./rng')

const dodgeRate = {
  Common: 5,
  Rare: 8,
  Epic: 12,
  Legendary: 15
}

function attack(attacker, defender) {
  // Dodge
  if (chance(dodgeRate[defender.rarity])) {
    return { damage: 0, log: 'DODGE' }
  }

  // Block
  let blockChance = (defender.def / attacker.atk) * 25
  if (blockChance > 40) blockChance = 40

  let baseDamage = attacker.atk - defender.def * 0.4
  if (baseDamage < 1) baseDamage = 1

  if (chance(blockChance)) {
    baseDamage = Math.floor(baseDamage * 0.5)
    return { damage: baseDamage, log: 'BLOCK' }
  }

  return { damage: Math.floor(baseDamage), log: 'HIT' }
}

module.exports = { attack }
