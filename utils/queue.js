class TaskQueue {
    constructor(limit = 1) {
        this.queue = []
        this.running = 0
        this.limit = limit
    }

    async add(task) {
        return new Promise((resolve, reject) => {
            this.queue.push({ task, resolve, reject })
            this.run()
        })
    }

    async run() {
        if (this.running >= this.limit) return
        const item = this.queue.shift()
        if (!item) return

        this.running++
        try {
            const result = await item.task()
            item.resolve(result)
        } catch (e) {
            item.reject(e)
        } finally {
            this.running--
            this.run()
        }
    }
}

module.exports = new TaskQueue(1) // ❗ 1 ffmpeg only
