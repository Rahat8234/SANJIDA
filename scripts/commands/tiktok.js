const axios = require("axios");

const baseApiUrl = async () => {
    const base = await axios.get(
        `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
    );
    return base.data.api;
};

module.exports.config = {
  name: "tiktok",
  version: "1.0.0",
  permission: 0,
  prefix: true,
  credits: "RAHAT",
  description: "Search for TikTok videos",
  category: "MEDIA",
  usages: "<search> - <optional: number of results | blank>",
  dependencies: {
        "axios": "",
        "fs-extra": ""
  };

module.exports.run = async function ({ api, args, event }) {
    let search = args.join(" ");
    let searchLimit = 30;

    const match = search.match(/^(.+)\s*-\s*(\d+)$/);
    if (match) {
        search = match[1].trim();
        searchLimit = parseInt(match[2], 10);
    }

    const apiUrl = `${await baseApiUrl()}/tiktoksearch?search=${encodeURIComponent(search)}&limit=${searchLimit}`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data.data;
        const videoData = data[Math.floor(Math.random() * data.length)];

        const stream = await axios({
            method: "get",
            url: videoData.video,
            responseType: "stream",
        });

        let infoMessage = `🎥 Video Title: ${videoData.title}\n`;
        infoMessage += `🔗 Video URL: ${videoData.video}\n`;

        api.sendMessage(
            { body: infoMessage, attachment: stream.data },
            event.threadID,
        );
    } catch (error) {
        console.error(error);
        api.sendMessage(
            "An error occurred while downloading the TikTok video.",
            event.threadID,
        );
    }
};