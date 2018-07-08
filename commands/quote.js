const conf  = require('../config.json');
const cache = require('../cache.json');
fs = require('fs');

module.exports = {
    name: 'quote',
    description: 'Stores & retrieves quotes for users',
    args: true,
    usage: '@user or @user <quote to store>',
    aliases: ['q'],
    cooldown: 1,
    execute(message, args) {
        
        // Did the user mention someone by name?
    	if(message.mentions.array().length != 1){
    		message.reply("You must mention a user by @name to use this function");
    		return;
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
	                obj = JSON.parse(data);
	                let user_id = message.mentions.first().id;
	                let quotes = obj.quotes;
	                let user_quotes = quotes[user_id];
	                
	                if(typeof user_quotes == "undefined"){
	                	user_quotes = [];
	                }

	                let stamp = Math.floor(new Date() / 1000);
	                user_quotes.push({"stamp":stamp, "quote":quote});
	                obj.quotes.user_id = user_quotes;
	                json = JSON.stringify(obj);
	                fs.writeFile('cache.json', json, 'utf8', function(){
	                    message.reply("Quote saved.");
	                });
	            }
	        });


        } else if(args.length == 1){ // One argument. See if we have any quotes saved for this user
        	fs.readFile('cache.json', 'utf8', function readFileCallback(err, data){
	            if (err){
	                console.log(err);
	                message.reply("Cache failure. Please try again.");
	            } else {
	                
	                let user_id = message.mentions.first().id.toString();
	                let quotes = cache.quotes;

	                if(quotes.hasOwnProperty(user_id)){
	                    let user_quotes = quotes[user_id];

	                    // Get random quote
						var quote = user_quotes[Math.floor(Math.random() * user_quotes.length)];
						message.reply(`"${quote.quote}"`);
	                } else {
	                    message.reply(`I don't have any quotes stored for that user.`);
	                }
	            }
        	});
        } else { // No arguemnts. Can't do anything
           message.reply("You need to specify a @user");
        }
    },
};