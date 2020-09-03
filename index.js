const TelegramBot = require('node-telegram-bot-api');
const Agent = require('socks5-https-client/lib/Agent');
const request = require('request');
const FileSystem = require('fs');
const cheerio = require('cheerio');
const urlencode = require('urlencode');

const Cmd = require('./cmd/mod');

const s5_config = {
    agentClass: Agent,
    agentOptions: {
        socksHost: '127.0.0.1',
        socksPort: 10808
    },
    headers: {
        'User-Agent': 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0',
        'Connetion': 'keep-alive',
        'Referer': 'https://btsow.casa/tags',

    }
}

const token = '1323070679:AAEEjyzkpJhxQ84j4WAHJ6t0uTgv9C13eBo';
const bot = new TelegramBot(token, {
    polling: true,
    request: { // 设置代理
        agentClass: Agent,
        agentOptions: {
            socksHost: '127.0.0.1',
            socksPort: 10808
        }
    }
});

const magnet_head = 'magnet:?xt=urn:btih:';
const btsow_url = (key) => {
    const url = 
        'https://btsow.casa/search/'
        + urlencode(key);
    return url;
}

const fict_buf = FileSystem.readFileSync("./asset/list.json");
const kaoyan_dict = JSON.parse(fict_buf.toString());
const avbangou_prefix_buf = FileSystem.readFileSync("./asset/prefix_table.json");
const bangou_prefix = JSON.parse(avbangou_prefix_buf.toString());

bot.onText(/\/hentai/, function onLoveText(msg) {
    bot.sendMessage(msg.chat.id, 'Are you a hentai?');
});


bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});

bot.onText(/\/random_words ([0-9]+)/, (msg, match) => {
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

    // console.log(resp)
    bot.sendMessage(chatId, resp);

})

bot.onText(/\/ghs (\w{1,20})/, (msg, match) => {
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
});

bot.onText(/\/avmoo ([a-z|A-Z]{1,8})[-|\s]?([0-9]{1,5})/, (msg, match) => {
    const chatId = msg.chat.id;
    const av_series = match[1].toString().toLowerCase();
    const av_number = match[2].toString().padStart(5,'0');
    const av_bangou = av_series + av_number;
    const prefix = bangou_prefix[av_series];
    console.log(prefix);
    const ambg = prefix+av_bangou;
    const url = 'https://jp.netcdn.space/digital/video/' + ambg + '/' + ambg +'pl.jpg';

    bot.sendPhoto(chatId, url, { caption: av_bangou }).scatch((err) => {
        bot.sendMessage(chatId, '请求失败:\n' + err);
    })
})


bot.onText(/\/help/, (msg,_) => {
    const chatId = msg.chat.id;
    const help = 
`/echo <消息>： 复读
/ghs <tag>: konachan色图
/avmoo <番号>: av封面图
发送图片：saucenao以图搜图
`;
    bot.sendMessage(chatId, help);
})
bot.on("photo",(msg, _) => {
    const chatId = msg.chat.id;
    const api_key = '2c44a50ebe753c0f2f17f24f3ee3e4caa3a05cd7';
    const minsim = '80!';
    // console.log(msg.photo[0].file_id);
    bot.getFileLink(msg.photo[0].file_id).then( (photo_path) => {
        // bot.sendMessage(chatId, photo_path);
        const url = 'http://saucenao.com/search.php?output_type=2&numres=1&minsim='+minsim+'&api_key='+api_key + '&url=' + photo_path;
        // bot.sendMessage(chatId, url);
        // bot.sendPhoto(chatId, msg.photo[0].file_id, { caption: '原图' }).catch((err) => {
        //     bot.sendMessage(chatId, '请求失败:\n' + err);
        // });
        // console.log(url);
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
})

bot.onText(/\/btsow (.{1,20})/, (msg, match) => {
    const chatId = msg.chat.id;
    const key_words = match[1].toString();
    let mag_link_list = new Array();
    request(btsow_url(key_words), s5_config, (error, response, body) => {
        if(error) {
            console.log(error);
            return;
        } 
        if (response.statusCode == 200) {
            const page = cheerio.load(body);
            // console.log(page.html());
            let data_list = page('.data-list');
            // console.log(data_list.html())
            const data_sellector = cheerio.load(data_list.html());
            data_sellector('.hidden-xs').remove();
            // console.log(data_sellector.html());
            const rows = data_sellector('.row').toArray();
            const item_num = rows.length;
            console.log(item_num);
            if(!item_num) {
                return;
            } else {
                rows.forEach(r => {
                    const $ = cheerio.load(r);
                    const magnet_item = $('a');

                    const href = magnet_item.attr('href');
                    const href_args = href.split(/\/{1,2}/);
                    const hash = href_args[5];
                    const magnet_link = magnet_head + hash;
                    const size_date= $('.size-date').text();
                    const item = {
                        'title' : magnet_item.attr('title'),
                        'magnet': magnet_link,
                        'size-date': size_date
                    };
                    mag_link_list.push(item);
                    console.log(item);
                });
            }
        } else {
            console.log(response.statusCode);
            // console.log(response);
            console.log(body);
        }
        if(mag_link_list.length == 0) {
            bot.sendMessage(chatId, '一个也找不到啦！');
        } else {
            mag_link_list.forEach( item => {
                bot.sendMessage(
                    chatId, 
                    '标题：' + item['title'] + '\n' + 
                    '磁力链接：' + item['magnet'] + '\n' +
                    '信息：' + item['size-date']
                );
            });
        }
    });
    
}) 