const conf = require('../config.json');
const Twit = require('twit');
module.exports = {
    name: 'twitter',
    description: 'Fetch the latest tweet from a given user',
    args: true,
    usage: '<twitter screen name>',
    aliases: ['t'],
    cooldown: 5,
    execute(message, args) {

    	// Get user input
    	let user = args[0].replace('@', '');

		// Init Twit
		let twit = new Twit({
			consumer_key: conf.apis.twitter.consumer_key,
		    consumer_secret: conf.apis.twitter.consumer_secret,
		    app_only_auth: true,
		    timeout_ms: 60*1000,  // optional HTTP request timeout to apply to all requests.
		  	strictSSL: true,      // optional - requires SSL certificates to be valid.
		});

		// Get data
		twit.get('statuses/user_timeline', {'screen_name': user, 'count': 1})
			.catch(function (error) {
		    	console.log(error);
                message.reply("🤖 There was an error parsing the response.");  
		  	})
		  	.then(function (result) {
		    	// `result` is an Object with keys "data" and "resp".
		    	// `data` and `resp` are the same objects as the ones passed to the callback.
		    	// See https://github.com/ttezel/twit#tgetpath-params-callback for details.
		    	// console.log('data', result.data);

		    	let tweets 		= result.data;
		    	let tweet 		= tweets[0];
		    	let real_name 	= tweet.user.name;
		    	let screen_name = tweet.user.screen_name;
		    	let tweet_text  = tweet.text;
		    	let tweet_link  = `https://twitter.com/${screen_name}/status/${tweet.id_str}`;

		    	let response = `${real_name} (@${screen_name}): ${tweet_text}`;

		    	message.reply(`🐦 ${response}`);  

		  	})

    },
};