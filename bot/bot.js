
const TelegramBot = require('node-telegram-bot-api');
// const Agent = require('socks5-https-client/lib/Agent');
const token = '1323070679:AAEEjyzkpJhxQ84j4WAHJ6t0uTgv9C13eBo';
var bot = new TelegramBot(token, {
    polling: true,
    // request: {
    //     agentClass: Agent,
    //     agentOptions: {
    //         socksHost: '127.0.0.1',
    //         socksPort: 10808
    //     }
    // }
});

module.exports = bot;