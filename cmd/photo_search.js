var bot = require('../bot/bot');
const request = require('request');
const api_key = require('../env/mod').saucenao_api_key;
module.exports = (msg, _) => {
    const chatId = msg.chat.id;
    const minsim = '80!';
    bot.getFileLink(msg.photo[0].file_id).then( (photo_path) => {
        const url = 'http://saucenao.com/search.php?output_type=2&numres=1&minsim='+minsim+'&api_key='+api_key + '&url=' + photo_path;
        request.get(url, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                const result = JSON.parse(body).results[0];
                console.log(result);
                const res_url = result.header.thumbnail;
                const res_sim = result.header.similarity;
                const res_link = result.data.ext_urls[0];
                const res_title = result.data.title;

                bot.sendPhoto(chatId, res_url, { caption: '相似度：'+res_sim}).catch((err) => {
                    bot.sendMessage(chatId, '请求失败:\n' + err);
                });

                const info = '外链：' + res_link + '\n标题：' + res_title;
                bot.sendMessage(chatId, info);
            }
        })
    });
}