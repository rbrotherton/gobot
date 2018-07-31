const conf = require('../config.json');
module.exports = {
    name: 'realmstatus',
    description: 'Fetch status of a World of Warcraft realm',
    args: true,
    usage: '< [name] | [name] detail >',
    aliases: ['realm'],
    cooldown: 5,
    execute(message, args) {

    	let realm = args[0].toLowerCase();
    	args.shift();
    	if(args.length > 1){
    		args.forEach(function(arg){
    			if(arg.toLowerCase() != "detail"){
    				realm += `-${arg.toLowerCase()}`;
    			}
    		});
    	}
    	console.log(args);

    	const url = `${conf.apis.blizzard.host}/wow/realm/status?realms=${realm}&locale=un_US&apikey=${conf.apis.blizzard.key}`;
    
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
			    	let realms = obj.realms;

			    	// If we have an invalid realm name the API just returns all the realms. 
			    	// Let the user know rather than spam the response.
			    	if(realms.length > 1){
			    		message.reply("I couldn't find that realm!");
			    		return;
			    	}

			    	// Output realm(s)
			    	realms.forEach(function(realm){
			    		let type = realm.type;
			    		let population = realm.population;
			    		let queue = realm.queue; // Bool
			    		let status = realm.status; //Bool
			    		let name = realm.name;
			    		let battlegroup = realm.battlegroup;
			    		let timezone = realm.timezone;
			    		let connected = realm.connected_realms.join(", ");

			    		if(queue && status){
			    			queue = " (Queue to log in!)"
			    		} else {
			    			queue = "";
			    		}

			    		if(!status){
			    			status = "❌ DOWN";
			    		} else {
			    			status = "✅ Up"
			    		}

			    		if(args[args.length-1].toLowerCase() == "detail"){
			    			message.reply(`🛡 **${name}**: ${status} ${queue}\n **Population:** ${population}\n **Battlegroup:** ${battlegroup} \n **Connected Realms:** ${connected} `);			
			    		} else {
			    			message.reply(`🛡 **${name}**: ${status} ${queue}`);		
			    		}
			    		
			    	});

			    	
		    	}
		    	catch(error) {
		    		console.log(error);
		    		message.reply("There was an error parsing the response.");	
		    	}

		        
		    } else {
		    	// TODO Better errors
		    	console.log(error);
		    	message.reply("There was an error getting the realm status.");
		    }
		})



    },
};