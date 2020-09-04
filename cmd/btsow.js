var bot = require('../bot/bot');
const base_url = require('../env/mod').btsow_base_url;

const Agent = require('socks5-https-client/lib/Agent');
const cheerio = require('cheerio');
const urlencode = require('urlencode');
const request = require('request');
const request_config = {
    // agentClass: Agent,
    // agentOptions: {
    //     socksHost: '127.0.0.1',
    //     socksPort: 10808
    // },
    headers: {
        'User-Agent': 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0',
        'Connetion': 'keep-alive',
        'Referer': base_url+'tags',
    }
}
const magnet_head = 'magnet:?xt=urn:btih:';
const btsow_url = (key) => {
    const url = 
        base_url
        + 'search/'
        + urlencode(key);
    return url;
}

module.exports = (msg, match) => {
    const chatId = msg.chat.id;
    const key_words = match[1].toString();
    let mag_link_list = new Array();
    request(btsow_url(key_words), request_config, (error, response, body) => {
        if(error) {
            console.log(error);
            return;
        } 
        if (response.statusCode == 200) {
            const page = cheerio.load(body);
            let data_list = page('.data-list');
            const data_sellector = cheerio.load(data_list.html());
            data_sellector('.hidden-xs').remove();
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
    
}