module.exports = async (sock, update) => {
    const jid = update.id

    await sock.sendMessage(jid, {
        text: `👋 *Halo semua!*

Aku *Salmotide Bot* 🤖
Ketik *.menu* untuk melihat fiturku 🚀`
    })
}
