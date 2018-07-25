const conf = require('../config.json');
module.exports = {
    name: 'repo',
    description: "Outputs a link to the bot's source code",
    args: false,
    usage: '',
    aliases: [],
    cooldown: 2,
    execute(message, args) {
    	message.reply(`🤖 You can find my source code at ${conf.repo}`);
    },
};