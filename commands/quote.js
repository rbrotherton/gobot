const conf  = require('../config.json');
const cache = require('../cache.json');
fs = require('fs');

module.exports = {
    name: 'quote',
    description: 'Stores & retrieves quotes for users',
    args: true,
    usage: '@user | @user <quote to store> | stats',
    aliases: ['q'],
    prodOnly: true,
    cooldown: 1,
    execute(message, args) {
        
        // Did the user mention someone by name?
        if(args[0].trim() !== "stats"){
        	if(message.mentions.users.size != 1){
	    		message.reply("You must mention a user by @name to use this function");
	    		return;
    		}	
        }
    	
    	// What did they want to do?
        if(args.length > 1){ // User passed in a quote
        	args.splice(0, 1); // Remove @name from quote to be saved
        	let quote = args.join(" ");

        	// Store quote
	        fs.readFile('cache.json', 'utf8', function readFileCallback(err, data){
	            if (err){
	                console.log(err);
	                message.reply("Cache failure. Please try again.");
	            } else {
	            	// get existing user quotes
	                obj = JSON.parse(data);
	                let user_id = message.mentions.users.first().id;
	                let quotes = obj.quotes;
	                let user_quotes = quotes[user_id];

	                if(typeof user_quotes == "undefined"){
	                	user_quotes = [];
	                }

	                // Add a new quote to the array
	                let stamp = Math.floor(new Date() / 1000);
	                user_quotes.push({"stamp":stamp, "quote":quote});
	                obj.quotes[user_id] = user_quotes;

	                // Save array back to cache
	                json = JSON.stringify(obj);
	                fs.writeFile('cache.json', json, 'utf8', function(){
	                    message.reply("Quote saved.");
	                });
	            }
	        });


        } else if(args.length == 1){ // One argument 

        	// Get data
        	fs.readFile('cache.json', 'utf8', function readFileCallback(err, data){
	            if (err){
	                console.log(err);
	                message.reply("Failed to load quote data. Please try again.");
	            } else {
					
	            	let obj = JSON.parse(data);
	            	let quotes = obj.quotes;

					// Want to stats, or a quote?	                
            		if(args[0].trim() === "stats"){ // Stats

            			let guild = message.guild;

            			// Build a list of users from this guild and their quotes
            			let results = [];
            			for (var user_id in quotes) {
						    if (quotes.hasOwnProperty(user_id)) {
						        results.push({"member": user_id, "count": quotes[user_id].length});  	
						    }
						}

						// Sort
						results.sort(function(a, b){return a.count < b.count});

						let output = "";
						let processed = 0;
						results.forEach(function(user){
							guild.fetchMember(user.member)
								.then(function(member){

									let name = member.nickname;
									if(null === name){
										name = member.user.username;
									}

									output += `\n ${user.count}: ${name}`; 
									processed++;

									// Spit out results when we're done
									if(processed == results.length){
										message.reply(output);
									}

								})
								.catch(function(error){
									processed++;
									// Spit out results when we're done
									if(processed == results.length){
										message.reply(output);
									}
								});
						});

						// 

		        	} else { // Random quote

						// See if we have any quotes saved for this user
		                let user_id = message.mentions.users.first().id;
		                
		                if(quotes.hasOwnProperty(user_id)){
		                    let user_quotes = quotes[user_id];

		                    // Get random quote
							var quote = user_quotes[Math.floor(Math.random() * user_quotes.length)];
							message.reply(`"${quote.quote}"`);
		                } else {
		                    message.reply(`I don't have any quotes stored for that user.`);
		                }

		        	}

	                
	            }
	        });

        	
        } else { // No arguemnts. Can't do anything
           message.reply("You need to specify a @user");
        }
    },
};