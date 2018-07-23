module.exports = {
    name: 'user',
    description: 'Returns info about the requesting user',
    execute(message, args) {

    	// Which user?
    	let user = message.author;
    	if(args.length){
    		user = message.mentions.users.first();

    		if(null == user){
    			message.reply("You must mention a user by @name to look up their details");
    			return;
    		}
    	}

    	// Send responses
        let ping = Math.round(user.client.ping);
		message.reply(`Username: ${user.username} | ID: ${user.id} | Ping: ${ping}`);
    },
};