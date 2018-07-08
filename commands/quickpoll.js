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
        let poll = `**Poll:** ${question}  *(By ${message.author.username})*`;
        message.channel.send(poll)
        	.then(function(new_msg){
        		new_msg.react(`👍`);
    			new_msg.react(`👎`);
    			message.delete();
        	})
        	.catch(error => console.log(error))
        
    },
};