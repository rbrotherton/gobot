const conf  = require('../config.json');
const cache = require('../cache.json');
fs = require('fs');

module.exports = {
    name: 'quote',
    description: 'Stores & retrieves quotes for users',
    args: true,
    usage: '<@user | @user "quote to store" | stats>',
    aliases: ['q'],
    prodOnly: true,
    cooldown: 1,
    execute(message, args) {
        
        // Did the user mention someone by name?
        let arg = args[0].trim().toLowerCase();
        if(arg !== "stats" && arg !== "random"){
        	if(message.mentions.users.size != 1){
	    		message.reply("You must mention a user by @name to use this function");
	    		return;
    		}	
        }
    	
    	// What did they want to do?
        if(args.length > 1){ // User passed in a quote
        	storeQuote(message, args);
		} else if(arg == "stats"){
			getStats(message, args);
		} else if(arg == "random"){
			getRandomQuoteForServer(message, args);
		} else {
			let user_id = message.mentions.users.first().id;
			getRandomQuoteForUser(message, user_id);
		}

		//===========================================================
		// Functions
		//===========================================================

		// Store a passed in quote
    	function storeQuote(message, args){
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
	                let guild_id = message.guild.id;
	                let quotes = obj.quotes;
	                let guild_quotes = quotes[guild_id];
	                let user_quotes = guild_quotes[user_id];

	                if(typeof user_quotes == "undefined"){
	                	user_quotes = [];
	                }

	                // Add a new quote to the array
	                let stamp = Math.floor(new Date() / 1000);
	                user_quotes.push({"stamp":stamp, "quote":quote});
	                obj.quotes[guild_id][user_id] = user_quotes;

	                // Save array back to cache
	                json = JSON.stringify(obj);
	                fs.writeFile('cache.json', json, 'utf8', function(){
	                    message.reply("Quote saved.");
	                });
	            }
	        });
    	};

    	// Get quote stats for this server/guild
       	function getStats(message, args){
       		fs.readFile('cache.json', 'utf8', function readFileCallback(err, data){
	            
	            if (err){
	                console.log(err);
	                message.reply("Failed to load quote data. Please try again.");
	            } else {
					
	            	obj = JSON.parse(data);
	            	let guild_id = message.guild.id;
					let quotes = obj.quotes;
					let guild_quotes = quotes[guild_id];
					let guild = message.guild;

					// This guild have any quotes stored?
					if(null == guild_quotes){
						message.reply("I don't have any quotes stored for this server.");
						return;
					}

        			// Build a list of users from this guild and their quotes
        			let results = [];
        			for (var user_id in guild_quotes) {
					    if (guild_quotes.hasOwnProperty(user_id)) {
					        results.push({"member": user_id, "count": guild_quotes[user_id].length});  	
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
				}
			});
       	};

       	// Get a random quote from a random person on the server/guild
		function getRandomQuoteForServer(message, args){

			fs.readFile('cache.json', 'utf8', function readFileCallback(err, data){
    
	            if (err){
	                console.log(err);
	                message.reply("Failed to load quote data. Please try again.");
	            } else {

	            	obj = JSON.parse(data);
	            	let guild_id = message.guild.id;
					let quotes = obj.quotes;
					let guild_quotes = quotes[guild_id];

					// This guild have any quotes stored?
					if(null == guild_quotes){
						message.reply("I don't have any quotes stored for this server.");
						return;
					}

					// Get a random user saved quotes
					var keys = Object.keys(guild_quotes)
					var n = keys.length * Math.random() << 0;
					var user_id = keys[n];

					// Get random quote for this user
					getRandomQuoteForUser(message, user_id);
					
				}
			});
		};

		// Get a random quote for a give user		
    	function getRandomQuoteForUser(message, user_id){

			fs.readFile('cache.json', 'utf8', function readFileCallback(err, data){
    
	            if (err){
	                console.log(err);
	                message.reply("Failed to load quote data. Please try again.");
	            } else {

	            	obj = JSON.parse(data);
	            	let guild_id = message.guild.id;
					let quotes = obj.quotes;
					let guild_quotes = quotes[guild_id];

					// This guild have any quotes stored?
					if(null == guild_quotes){
						message.reply("I don't have any quotes stored for this server.");
						return;
					}

					// See if we have any quotes saved for this user
	                if(guild_quotes.hasOwnProperty(user_id)){
	                    let user_quotes = guild_quotes[user_id];

	                    // Get random quote
						var quote = user_quotes[Math.floor(Math.random() * user_quotes.length)];

						// Get user
						message.client.fetchUser(user_id)
							.then(function(user){
								// Respond
								message.reply(`**${user.username}:** "${quote.quote}"`);		
							})
							.catch(error => console.log(error));

	                } else {
	                    message.reply(`I don't have any quotes stored for that user.`);
	                }
	            }
	        });
    	};
    }
};