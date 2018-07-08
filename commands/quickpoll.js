const conf = require('../config.json');
fs = require('fs');

module.exports = {
    name: 'quickpoll',
    description: 'Creates a quick yes/no poll',
    args: true,
    usage: '<question>',
    aliases: ['qp'],
    cooldown: 3,
    execute(message, args) {

        // Create poll
        let question = args.join(' ');
        let name = getAuthorNick(message);
        let poll = `**Poll:** ${question}  *(By ${name})*`;
        message.channel.send(poll)
        	.then(function(new_msg){
        		new_msg.react(`👍`);
    			new_msg.react(`👎`);
    			message.delete();
        	})
        	.catch(error => console.log(error))
        

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