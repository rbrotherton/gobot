const conf = require('../config.json');
const Discord = require('discord.js');
module.exports = {
    name: 'wowhead',
    description: 'Perform a search on wowhead.com',
    args: true,
    usage: '<query>',
    aliases: ['wow'],
    cooldown: 3,
    execute(message, args) {
        let query = args.join(' ');
    	let url = encodeURI(`https://www.wowhead.com/search?q=${query}`);
    	message.reply(`${url}`);	
    },
};