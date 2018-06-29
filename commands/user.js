module.exports = {
    name: 'user',
    description: 'Returns info about the requesting user',
    execute(message, args) {
        let usr = message.author;
		message.reply(`Username: ${usr.username} | ID: ${usr.id} | Ping: ${usr.client.ping}`);
    },
};