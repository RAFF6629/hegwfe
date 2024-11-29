const { tiktokdl } = require('../start/lib/scrape/scrape-tiktokdl');
const axios = require('axios');

module.exports = {
    command: 'tiktok',
    type: ['download'],
    description: '*provide Tiktok URL*',
    async execute(client, m, args, NReply) {
        const text = args.join(" ");
        if (!text) return NReply("Where is the TikTok URL? *Example :* .tiktok https://");
        let res = await tiktokdl(text);
        if (res && res.data && res.data.data) {
            let images = res.data.data.images || [];
            let play = res.data.data.play;
            let lagu = res.data.data.music

            const getMimeType = async (url) => {
                try {
                    const response = await axios.head(url);
                    return response.headers['content-type'];
                } catch (error) {
                    console.error(error);
                    return
                }
            };

            let mimeType = await getMimeType(play);
            
            if (mimeType && mimeType.startsWith('video/')) {
                await client.sendMessage(m.chat, {
                    video: { url: play },
                    caption: "Successfully downloaded video from TikTok"
                },{quoted:m});
            } else if (images.length > 0) {
                let totalImages = images.length;
                let estimatedTime = totalImages * 4;
                let message = `Estimasi waktu pengiriman gambar: ${estimatedTime} detik.`;
                await client.sendMessage(m.chat, { text: message },{quoted:m});

                const sendImageWithDelay = async (url, index) => {
                    let caption = `Gambar ke-${index + 1}`;
                    await client.sendMessage(m.chat, { image: { url }, caption: caption },{quoted:m});
                };
                await client.sendMessage(m.chat, { audio: { url: lagu }, mimetype: "audio/mpeg" },{quoted:m})

                for (let i = 0; i < images.length; i++) {
                    await sendImageWithDelay(images[i], i);
                    await new Promise(resolve => setTimeout(resolve, 4000));
                }
            } else {
                console.log('No valid video or images found.');
                await client.sendMessage(m.chat, {
                    text: "No media found or an error occurred while retrieving media."
                },{quoted:m});
            }
        } else {
            console.error('Error: Invalid response structure', res);
            await client.sendMessage(m.chat, {
                text: "No media found or an error occurred while retrieving media."
            },{quoted:m});
        }
    }
};
