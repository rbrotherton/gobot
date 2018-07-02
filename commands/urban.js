const conf = require('../config.json');
module.exports = {
    name: 'urban',
    description: 'Gets a definition from UrbanDicitonary.com',
    args: true,
    usage: '<query>',
    aliases: ['urb'],
    cooldown: 3,
    execute(message, args) {
    	
    	// http://api.urbandictionary.com/v0/define?term=hood

    	let word = args[0];
    	let url = `https://api.urbandictionary.com/v0/define?term=${word}`;
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
			    	let list 	 = obj.list;
			    	let def 	 = list[0].definition;
			    	let ups 	 = list[0].thumbs_up;
			    	let downs 	 = list[0].thumbs_down;
			    	let rating   = Math.round((ups / (ups + downs) * 100));
			    	let up 		 = "👍";

					rating = `(${rating}% ${up})`;
			    	message.reply(`**${word}** ${rating}\n${def}`);	
		    	}
		    	catch(error) {
		    		message.reply("There was an error parsing the response.");	
		    	}

		        
		    } else {
		    	// TODO Better errors
		    	message.reply("There was an error looking up that word.");
		    }
		})

    },
};