module.exports = {
    name: 'coinflip',
    description: 'Flips a coin',
    aliases: ['flip'],
    cooldown: 1,
    execute(message, args) {
    	x = (Math.floor(Math.random() * 2) == 0);
	    if(x){
	        message.reply(`heads!`);
	    }else{
	        message.reply(`tails!`);
	    }
    },
};