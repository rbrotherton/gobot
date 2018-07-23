const conf = require('../config.json');
const Twit = require('twit');
module.exports = {
    name: 'twitter',
    description: 'Fetch the latest tweet from a given user',
    args: true,
    usage: '<twitter screen name> <number of recent tweets to load>',
    aliases: ['t'],
    cooldown: 5,
    execute(message, args) {

    	// Get user input
    	let count = 1;
    	let user = args[0].replace('@', '');

    	if(args.length > 1){
    		count = parseInt(args[1]);
    	}

    	// Sanity checks
    	if(count > 10){
    		count = 10;
    	}

    	if(user.length < 3){
    		message.reply("That doesn't appear to be a valid twitter husername");
    		return;
    	}

		// Init Twit
		let twit = new Twit({
			consumer_key: conf.apis.twitter.consumer_key,
		    consumer_secret: conf.apis.twitter.consumer_secret,
		    app_only_auth: true,
		    timeout_ms: 60*1000,  // optional HTTP request timeout to apply to all requests.
		  	strictSSL: true,      // optional - requires SSL certificates to be valid.
		});

		// Get data
		twit.get('statuses/user_timeline', {'screen_name': user, 'count': count, 'tweet_mode': 'extended'})
			.catch(function (error) {
		    	console.log(error);
                message.reply("🤖 There was an error parsing the response.");  
		  	})
		  	.then(function (result) {
		    	// `result` is an Object with keys "data" and "resp".
		    	// `data` and `resp` are the same objects as the ones passed to the callback.
		    	// See https://github.com/ttezel/twit#tgetpath-params-callback for details.
		    	// console.log('data', result.data);

		    	result.data.forEach(function(tweet){

		    		let real_name 	= tweet.user.name;
		    		let screen_name = tweet.user.screen_name;
		    		// let tweet_text  = tweet.text; // Non-extended
		    		let tweet_text  = tweet.full_text; // Extended
		    		let tweet_link  = `https://twitter.com/${screen_name}/status/${tweet.id_str}`;
		    		let response = `${real_name} (@${screen_name}): ${tweet_text}`;

		    		message.reply(`🐦 ${response}`);  
		    	});
		    	

		  	})

    },
};