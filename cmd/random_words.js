var bot = require('../bot/bot');
const kaoyan_dict = require('../env/mod').kaoyan_dict;

module.exports = (msg, match) => {
    const chatId = msg.chat.id
    num = parseInt(match[1], 10)
    let resp = ''
    if ((0 < num) && (num < 30)) {
        for (let index = 0; index < parseInt(num, 10); index++) {
            let word_ind = Math.floor(Math.random() * kaoyan_dict.length)
            resp += (parseInt(word_ind, 10) + '\t' + kaoyan_dict[word_ind] + '\n')
        }
    } else {
        resp = "请输入1-30之间的数字！"
    }
    bot.sendMessage(chatId, resp);
}