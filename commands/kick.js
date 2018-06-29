module.exports = {
    name: 'kick',
    guildOnly: true,
    description: 'Kicks a user out of a server',
    execute(message, args) {
        if (!message.mentions.users.size) {
			return message.reply('I need to know who you want to kick! Format: .kick @username');
		}

		const taggedUser = message.mentions.users.first();
		if(typeof taggedUser !== 'undefined'){
			message.reply(`I would kick ${taggedUser.username}, but that would be rude :| `);	
		}
    },
};