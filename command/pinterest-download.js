const { pindl } = require('../start/lib/scrape/scrape-pindl');

module.exports = {
    command: 'pindl',
    type: ['download'],
    description: '*provide Pinterest URL*',
    async execute(client, m, args) {
        const text = args.join(" ");
        if (!text) return NReply('Where is the Pinterest URL? *Example:* .pindl https://pin.it/1DyLc8cGU');

        let res = await pindl(text);
        let mek = res.data.result;

        if (mek && mek.data) {
            const mediaUrl = mek.data;

            const isImage = mediaUrl.match(/\.(jpeg|jpg|png|gif)$/i);
            const isVideo = mediaUrl.match(/\.(mp4|webm|ogg)$/i);

            if (isImage) {
                await client.sendMessage(m.chat, {
                    image: { url: mediaUrl },
                    caption: "Successfully downloaded photo using the Pinterest URL"
                }, { quoted: m });
            } else if (isVideo) {
                await client.sendMessage(m.chat, {
                    video: { url: mediaUrl },
                    caption: "Successfully downloaded video using the Pinterest URL"
                }, { quoted: m });
            } else {
                await client.sendMessage(m.chat, {
                    text: "Unsupported media type received."
                }, { quoted: m });
            }
        } else {
            await client.sendMessage(m.chat, {
                text: "No media found or an error occurred while retrieving media."
            }, { quoted: m });
        }
    }
};
