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
		channel = message.channel;
    	channel.setTopic(topic)
		  .then(updated => console.log(`Channel's new topic is ${updated.topic}`))
		  .catch(function(error){
		  		console.log(error);
		  		if(error.code == 50013){
		  			message.reply("I don't have permission to do that!")
		  		}
		  });	
    },
};

