var bot = require('../bot/bot');
const request = require('request');

module.exports = (msg, match) => {
    const chatId = msg.chat.id;
    const tag = match[1];
    // console.log(tag);
    request('https://konachan.com/post.json?tags=' + tag + '&limit=50', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const result = JSON.parse(body) || [];
            if(result.length==0) {
                bot.sendMessage(chatId, '无效的tag');
                return;
            }
            const index = parseInt(Math.random() * result.length);
            const info = '作者' + result[index].author + '\n' + '来源' + result[index].source;
            // console.log(info)

            bot.sendPhoto(chatId, result[index].file_url, { caption: tag }).catch((err) => {
                bot.sendMessage(chatId, '请求失败:\n' + err);
            })

            bot.sendMessage(chatId, info);

        } else {
            bot.sendMessage(chatId, '请求失败');
        }
    });
}