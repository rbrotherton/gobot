module.exports = {
    name: 'server',
    description: 'Returns info about the server where this request originated.',
    execute(message, args) {
        message.reply(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
    },
};