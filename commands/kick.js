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

			if(taggedUser.id == 142390439356399616){
				message.reply(`I would never harm my creator ❤`);
				return;
			}

			if(taggedUser.id == 462062772088209419){
				message.reply(`I can't kick myself 🤖`);
				return;	
			}

			message.reply(`Kicking ${taggedUser.username} would be rude 😐`);
		}
    },
};