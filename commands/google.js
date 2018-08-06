const conf = require('../config.json');
const Discord = require('discord.js');
module.exports = {
    name: 'google',
    description: 'Fetch the first result of a Google query',
    args: true,
    usage: '<query>',
    aliases: ['g', 'goog'],
    cooldown: 5,
    execute(message, args) {

    	let query = args.join(' ');
    	let url = `${conf.apis.google.host}?key=${conf.apis.google.key}&cx=${conf.apis.google.cx}&q=${query}`;
    	console.log(url);

    	// Create request
		var request = require('request');

		// Configure the request
		var options = {
		    url: url,
		    method: 'GET',
		    headers: {},
		}

		// Start the request
		request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {

		    	try {
		    		let obj 	 = JSON.parse(body);
			    	let item 	 = obj.items[0];
			    	let title 	 = item.title;
			    	let link 	 = item.link;
			    	let snippet	 = item.snippet;

			    	let embed = new Discord.RichEmbed({
			    		"title": title,
			    		"description": snippet,
			    		"url": link,
			    		"color": 6037821,
			    		// "author": {"name": "Google", "url": link},
			    	});

			    	// message.reply(`🤖 ${embed}`);	
			    	message.channel.send("", embed);
		    	}
		    	catch(error) {
		    		console.log(error);
		    		message.reply("There was an error parsing the response.");	
		    	}

		        
		    } else {
		    	// TODO Better errors
		    	message.reply("There was an error performing your search.");
		    }
		})
    },
};