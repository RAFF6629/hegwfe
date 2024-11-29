const { tiktokSearch } = require('../start/lib/scrape/scrape-tiktokS')

module.exports = {
    command: 'tiktoksearch',
    type: ['search'],
    description: '*it will rain*',
    async execute(client, m, args, NReply) {
        const query = args.join(' ');
        if (!query) return NReply('What video do you want to search for? Example: .tiktoksearch jujutsu kaisen');
        
        const results = await tiktokSearch(query);
        
        if (results.data && results.data.length > 0) {
            const firstResult = results.data[0];
            await client.sendMessage(m.chat, { video: { url: firstResult.no_watermark } },{quoted:m});
        } else {
            await client.sendMessage(m.chat, { text: 'No results found for this search.' },{quoted:m});
        }
    }
};
