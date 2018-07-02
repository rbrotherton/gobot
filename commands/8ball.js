const conf = require('../config.json');
module.exports = {
    name: '8ball',
    description: 'Gives a random answer to a question',
    args: false,
    usage: '',
    aliases: ['8'],
    cooldown: 1,
    execute(message, args) {
        
        let answers = [
            "It is certain", 
            "It is decidedly so", 
            "Without a doubt", 
            "Yes definitely", 
            "You may rely on it", 
            "As I see it, yes", 
            "Most likely", 
            "Outlook good", 
            "Yes", 
            "Signs point to yes", 
            "Reply hazy try again", 
            "Ask again later", 
            "Better not tell you now", 
            "Cannot predict now", 
            "Concentrate and ask again", 
            "Don't count on it", 
            "My reply is no", 
            "My sources say no", 
            "Outlook not so good", 
            "Very doubtful"
        ]

        let reply = answers[Math.floor(Math.random() * answers.length)];        
        message.reply("🎱" + " " + reply);
    },
};