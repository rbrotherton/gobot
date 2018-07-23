module.exports = {
    name: 'server',
    description: 'Returns info about the server where this request originated.',
    execute(message, args) {
        message.reply(`Name: ${message.guild.name}\nID: ${message.guild.id}\nTotal members: ${message.guild.memberCount}`);
    },
};