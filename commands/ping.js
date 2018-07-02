module.exports = {
    name: 'ping',
    cooldown: 5,
    description: 'Classic ping. Includes average lattency to websocket.',
    execute(message, args) {
        message.reply(`💻 Pong! (${message.author.client.ping} avg ms)`);
    },
};