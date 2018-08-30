const conf = require('../config.json');
const Discord = require('discord.js');
module.exports = {
    name: 'spoiler',
    description: 'Embed a spoiler ',
    args: false,
    usage: '<spoiler text>',
    aliases: ['spoiler'],
    cooldown: 3,
    execute(message, args) {

        // Get input
        let input = args.join(" ");
        let spoiler = `[Hover to View Spoiler](https://www.google.com "${input}")`;
        let author = getAuthorNick(message);

        // Create embed
        let embed  = new Discord.RichEmbed();
        embed.setDescription(spoiler);
        embed.setTitle(`Spoiler by ${author}`);

        // Send embed and delete original message
        message.channel.send("", embed)
        	.then(function(new_msg){})
            .catch(error => console.log(error))
        message.delete();
        
        // Function to get user nickname
        function getAuthorNick(message){
        	let guild  = message.guild;
        	let member = guild.members.get(message.author.id);
        	let nick   = member.nickname;

        	if(nick !== null){
        		return nick;
        	} else {
        		return message.author.username;
        	}

        }
    },
};