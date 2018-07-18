const conf = require('../config.json');
module.exports = {
    name: 'youtube',
    description: 'Fetch the first result of a YouTube query',
    args: true,
    usage: '<query>',
    aliases: ['yt'],
    cooldown: 5,
    execute(message, args) {

    	let query = args.join(' ');
    	let url = `${conf.apis.youtube.host}/search?key=${conf.apis.youtube.key}&q=${query}&part=snippet&maxresults=1&type=video`;
    	console.log(url);

    	// https://www.youtube.com/watch?v=e67Q-sTHVhc&t=812s

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
			    	let snippet	 = item.snippet;
			    	let title 	 = snippet.title;
			    	let id 		 = item.id.videoId;
			    	let link 	 = `https://www.youtube.com/watch?v=${id}`;

			    	message.reply(`🎥 **${title}**: ${link}`);	
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