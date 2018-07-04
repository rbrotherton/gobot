const conf = require('../config.json');
module.exports = {
    name: 'topic',
    description: 'Sets a channel topic',
    args: true,
    usage: '<topic>',
    aliases: [],
    cooldown: 5,
    execute(message, args) {

    	let topic = args.join(' ');
    	try {
    		channel = message.channel;
	    	channel.setTopic(topic);
			console.log(`Channel's new topic is ${topic}`);
			message.reply("🤖 The topic has been changed");
    	} catch (err) {
    		console.log(err);
    	}
    	
    },
};

