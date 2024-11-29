const { igdl } = require('../start/lib/scrape/scrape-igdl');
const axios = require('axios');

module.exports = {
    command: 'ig',
    type: ['download'],
    description: '*provide Instagram URL*',
    async execute(client, m, args, NReply) {
        const text = args.join(" ");
        if (!text) return NReply(`Where is the Instagram URL? *Example*: https://`);

        let memek = await igdl(text);
        let respon = memek.data.url_list;

        if (respon && respon.length > 0) {
            const mediaUrl = respon[0];

            try {
                const headResponse = await axios.head(mediaUrl);
                const mimeType = headResponse.headers['content-type'];

                const isImage = /image\/.*/.test(mimeType);
                const isVideo = /video\/.*/.test(mimeType);

                if (isImage) {
                    await client.sendMessage(m.chat, {
                        image: { url: mediaUrl },
                        caption: "Successfully downloaded image from that URL"
                    }, { quoted: m });
                } else if (isVideo) {
                    await client.sendMessage(m.chat, {
                        video: { url: mediaUrl },
                        caption: "Successfully downloaded video from that URL"
                    }, { quoted: m });
                } else {
                    await client.sendMessage(m.chat, {
                        text: "Unsupported media type received."
                    }, { quoted: m });
                }
            } catch (error) {
                console.error('Error fetching media type:', error);
                await client.sendMessage(m.chat, {
                    text: "Error occurred while retrieving media type."
                }, { quoted: m });
            }
        } else {
            await client.sendMessage(m.chat, {
                text: "No media found or an error occurred while retrieving media."
            }, { quoted: m });
        }
    }
};
