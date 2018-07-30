const conf = require('../config.json');
module.exports = {
    name: 'news',
    description: 'Fetch top world news headlines',
    args: false,
    usage: '<[num of results] | [keyword] [num of results]>',
    aliases: ['n'],
    cooldown: 5,
    execute(message, args) {

   		let limit = 1;
   		let url = "";

   		// What did the user want to do?
    	if(args.length == 0 || isNumber(args[0])){ // Top news

    		if(isNumber(args[0])){
				limit = parseInt(args[0]);

				if(limit > 3){
					message.reply("Please use a number smaller than 4");
					return;
				}

			}
    		url = `${conf.apis.news.host}/top-headlines?pageSize=${limit}&apiKey=${conf.apis.news.key}&country=${conf.apis.news.country}`;	
    	} else { // Search

    		if(args.length > 1 && isNumber(args[1])){
				limit = parseInt(args[1]);

				if(limit > 3){
					message.reply("Please use a number smaller than 4");
					return;
				}

			}

			let oldest_date = getOldestDate();

			url = `${conf.apis.news.host}/everything?q=${args[0]}&pageSize=${limit}&language=${conf.apis.news.language}&from=${oldest_date}&sortBy=publishedAt&apiKey=${conf.apis.news.key}`;	
    	}
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
			    	let articles = obj.articles;

			    	articles.forEach(function(article){
			    		let source = article.source;
			    		let link = article.url;
			    		// message.reply(`\n📰 **${source.name}** (${article.title})\n${link}`);		
			    		message.reply(`\n📰${link}`);		
			    	});

			    	
		    	}
		    	catch(error) {
		    		message.reply("There was an error parsing the response.");	
		    	}

		        
		    } else {
		    	// TODO Better errors
		    	console.log(error);
		    	message.reply("There was an error getting the news results.");
		    }
		})

		// Is n a number?
		function isNumber(n) {
		  return !isNaN(parseFloat(n)) && isFinite(n);
		}

		// Get oldest publication date for search results
		function getOldestDate() {
			// var today = new Date();
			var dateObj = new Date();
			dateObj.setDate(dateObj.getDate() - 7);
			var dd = dateObj.getDate();
			var mm = dateObj.getMonth()+1; //January is 0!

			var yyyy = dateObj.getFullYear();
			if(dd<10){
			    dd='0'+dd;
			} 
			if(mm<10){
			    mm='0'+mm;
			} 
			var result = yyyy+'-'+mm+'-'+dd;
			return result;
		}

    },
};