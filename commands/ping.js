module.exports = {
    name: 'ping',
    cooldown: 5,
    description: 'Classic ping. Includes average lattency to websocket.',
    execute(message, args) {
    	let ping = Math.round(message.author.client.ping);
        message.reply(`💻 Pong! (${ping} avg ms)`);
    },
};