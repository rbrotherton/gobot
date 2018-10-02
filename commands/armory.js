const conf = require('../config.json');
const Discord = require('discord.js');
module.exports = {
    name: 'armory',
    description: `WoW - Get link to an armory profile`,
    args: false,
    usage: 'realm character',
    aliases: ['arm'],
    cooldown: 5,
    execute(message, args) {
        
        let character = args.pop();
        let realm = args.join("-");
        let realm_slug = realm;
        let url = `https://worldofwarcraft.com/en-us/character/${realm_slug}/${character}`

    	message.reply(url);
    },
};