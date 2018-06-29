const conf = require('../config.json');
module.exports = {
    name: 'define',
    description: 'Gets the definition of an English word',
    aliases: ['def'],
    cooldown: 1,
    args: true,
    execute(message, args) {
    	
    	// https://od-api.oxforddictionaries.com/api/v1/entries/en/dog

    	let word = args[0];
    	let url = `${conf.apis.define.host}/entries/${conf.apis.define.language}/${word.toLowerCase()}`;
    	console.log(url);

    	// Create request
		var request = require('request');

		// Set the headers
		var headers = {
		    'app_id': conf.apis.define.app_id,
		    'app_key': conf.apis.define.app_key
		}

		// Configure the request
		var options = {
		    url: url,
		    method: 'GET',
		    headers: headers,
		    // qs: {'key1': 'xxx', 'key2': 'yyy'}
		}

		// Start the request
		request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {

		    	try {
		    		let obj = JSON.parse(body);
			    	let lexEntry = obj.results[0].lexicalEntries[0];
			    	let type 	 = lexEntry.lexicalCategory;
			    	let entry 	 = lexEntry.entries[0];
			    	let def 	 = entry.senses[0].definitions[0];
			    	// let notes 	 = entry.senses[0].notes[0];
			    	message.reply(`**${word}** (${type}): ${def}`);	
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

