function chance(percent) {
  return Math.random() * 100 < percent
}

module.exports = { chance }
