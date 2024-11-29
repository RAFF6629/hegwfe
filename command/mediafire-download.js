const { mediafire } = require('../start/lib/scrape/scrape-mediafire');
const path = require('path')

module.exports = {
    command: 'mediafire',
    type: ['download'],
    description: '*provide MediaFire URL*',
    async execute(client, m, args, NReply) {
        const text = args.join(" ");
        if (!text) return NReply(`Where is the MediaFire URL? *Example:* .mediafire https://www.mediafire.com/file/l5urnlewucsuhmm/LANABOTZ-V.0.3.zip/file`);

        let donlot = await mediafire(text);
        let result = donlot.data;

        const fileType = result.mimetype || await getFileTypeFromUrl(result.link);
        const fileName = result.filename || path.basename(result.link);

        if (fileType === "application/zip" || fileType === "application/pdf" || fileType === "application/vnd.ms-excel") {
            client.sendMessage(m.chat, { 
                document: { url: result.link },
                fileName: fileName,
                mimetype: fileType 
            },{quoted:m});
        } else if (fileType.startsWith("image/")) {
            client.sendMessage(m.chat, { 
                image: { url: result.link },
                caption: fileName 
            },{quoted:m});
        } else if (fileType.startsWith("audio/")) {
            client.sendMessage(m.chat, { 
                audio: { url: result.link },
                mimetype: fileType,
                ptt: true // Push-to-talk untuk audio
            },{quoted:m});
        } else if (fileType.startsWith("video/")) {
            client.sendMessage(m.chat, { 
                video: { url: result.link },
                caption: fileName 
            });
        } else {
            client.sendMessage(m.chat, { 
                document: { url: result.link },
                fileName: fileName,
                mimetype: fileType 
            },{quoted:m});
        }
    }
}

async function getFileTypeFromUrl(url) {
    const ext = path.extname(url).toLowerCase();
    switch (ext) {
        case '.zip':
            return 'application/zip';
        case '.pdf':
            return 'application/pdf';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        case '.mp3':
            return 'audio/mpeg';
        case '.ogg':
            return 'audio/ogg';
        case '.wav':
            return 'audio/wav';
        case '.mp4':
            return 'video/mp4';
        case '.mkv':
            return 'video/x-matroska';
        case '.webm':
            return 'video/webm';
        default:
            return;
    }
}
