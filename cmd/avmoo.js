var bot = require('../bot/bot');
const bangou_prefix = require('../env/mod').bangou_prefix;
const cmd_avmoo = (msg, match) => {
    // console.log('IM LIVING');
    try {
        const chatId = msg.chat.id;
        const av_series = match[1].toString().toLowerCase();
        const av_number = match[2].toString().padStart(5,'0');
        const av_bangou = av_series + av_number;
        const prefix = bangou_prefix[av_series];
        console.log(prefix);
        const ambg = prefix+av_bangou;
        const url = 'https://jp.netcdn.space/digital/video/' + ambg + '/' + ambg +'pl.jpg';
        
        bot.sendPhoto(chatId, url, { caption: av_bangou }).catch((err) => {
            bot.sendMessage(chatId, '请求失败:\n' + err);
        });
    } catch (error) {
        console.log(error);
    }
    
}

module.exports = cmd_avmoo;