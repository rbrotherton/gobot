const conf = require('../config.json');
module.exports = {
    name: 'wowhead',
    description: 'Perform a search on wowhead.com',
    args: true,
    usage: '<query>',
    aliases: ['wow'],
    cooldown: 3,
    execute(message, args) {
    	
    	// https://www.wowhead.com/search?q=bloodfang

    	let word = args.join(' ');
    	let url = encodeURI(`https://www.wowhead.com/search?q=${word}`);
    	message.reply(`${url}`);	

    },
};