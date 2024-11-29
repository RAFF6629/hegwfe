const { llama3_8b } = require('../start/lib/scrape/scrape-llama3')

module.exports = {
    command: 'llama',
    type: ['artificial intelligence'],
    description: '*query*',
    async execute(client, m, args, NReply) {
        const text = args.join(" ")
        if (!text) return NReply('want to ask a llama what *Example:* .llama what is the big bang theory')
        let lol = await llama3_8b(text)
        let memek = lol.data
        client.sendMessage(m.chat, {
            text: memek }, {quoted:m})
    }
}