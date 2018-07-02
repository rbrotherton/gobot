module.exports = {
    name: 'user',
    description: 'Returns info about the requesting user',
    execute(message, args) {
        let user = message.author;
        let ping = Math.round(user.client.ping);
		message.reply(`Username: ${user.username} | ID: ${user.id} | Ping: ${ping}`);
    },
};