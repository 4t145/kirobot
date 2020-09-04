var bot = require('./bot/bot');
const Cmd = require('./cmd/mod');

bot.onText(/\/random_words ([0-9]+)/, Cmd.random_words)
bot.onText(/\/kona (\w{1,20})/, Cmd.kona);
bot.onText(/\/avmoo ([a-z|A-Z]{1,8})[-|\s]?([0-9]{1,5})/, Cmd.avmoo);
bot.onText(/\/btsow (.{1,20})/, Cmd.btsow);
bot.on("photo",Cmd.photo_search);


bot.onText(/\/help/, (msg,_) => {
    const chatId = msg.chat.id;
    const help = 
`/kona <tag>: konachan色图
/avmoo <番号>: av封面图
/btsow <keyword>：搜种子
/randowm_words <n>：随机考研词汇n个，n为1~15
发送图片：saucenao以图搜图
`;
    bot.sendMessage(chatId, help);
})