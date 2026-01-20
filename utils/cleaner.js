const fs = require('fs')
const path = require('path')

const TMP = path.join(__dirname, '../temp')

setInterval(() => {
    fs.readdirSync(TMP).forEach(f => {
        const p = path.join(TMP, f)
        if (Date.now() - fs.statSync(p).mtimeMs > 60000) {
            fs.unlinkSync(p)
        }
    })
}, 60000)
