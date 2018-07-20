// Include filesystem
const fs = require('fs');

// Require Discord.js library
const Discord = require('discord.js');

// Load config
const conf   = require('./config.json');
const prefix = conf.prefix;
const token  = conf.token;

// Create a new Discord client
const client = new Discord.Client();

// Load bot commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Prep cooldowns
const cooldowns = new Discord.Collection();

// On client ready, report status
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Handle inbound messages
client.on('message', message => {

	// If message was sent by a bot, or lacks our prefix, ignore message
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// Pull args and command out of message
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	// Load command if we find it by name or alias
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;
		
	// Guild only command?
	if (command.guildOnly && message.channel.type !== 'text') {
	    return message.reply('I can\'t execute that command inside DMs!');
	}

	// Production only commend?
	if(conf.environment != "production" && command.prodOnly == true){
        message.reply("I'm currently running in development mode and cannot execute that command. Sorry!");
        return;
    }

	// Command requires args?
	if (command.args && !args.length) {
        let reply = `Missing input.`;
    	
    	if (command.usage) {
        	reply += ` Try: \`${prefix}${command.name} ${command.usage}\``;
    	}

    	return message.reply(reply);
	}

	// Check cooldowns/prevent spam
	if (!cooldowns.has(command.name)) {
	    cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (!timestamps.has(message.author.id)) {
	    if (!timestamps.has(message.author.id)) {
		    timestamps.set(message.author.id, now);
		    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		}
	}
	else {
	    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	    if (now < expirationTime) {
	        const timeLeft = (expirationTime - now) / 1000;
	        return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
	    }

	    timestamps.set(message.author.id, now);
	    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

	// Try to process command
	try {
	    command.execute(message, args);
	}
	catch (error) {
	    console.error(error);
	    message.reply('there was an error trying to execute that command!');
	}

  	// Log messages
  	console.log(message.content);

});

// Login to Discord
try {
	client.login(token);
}
catch (error) {
    console.error("CLIENT.LOGIN FAILURE:", error);
}	