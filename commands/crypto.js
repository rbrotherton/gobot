const conf    = require('../config.json');
const tickers = require('../cache_crypto.json');

module.exports = {
    name: 'crypto',
    description: 'Gets crypto-currency quotes',
    args: true,
    usage: '<ticker> | populate | top <n>',
    aliases: ['c'],
    cooldown: 5,
    execute(message, args) {

    	// What to do?
        if(args[0] === 'populate'){
        	populateTickerCache(message);
        	return;
        } else if(args[0] === "top" || args[0] === "big"){
        	getTop(message, args[1]);
        	return;
        } else {
        	for(i=0; i<args.length; i++){
        		var arg = args[i];
        		var ticker_symbol = arg.toLowerCase();
        		getTicker(message, ticker_symbol);
        	}
        	return;
        }

        // Get a Ticker value
        function getTicker(message, ticker_symbol) {
        	
        	// Can we translate this symbol to an ID?
        	if(tickers.hasOwnProperty(ticker_symbol)){
        		
        		let ticker_id = tickers[ticker_symbol];

        		// Configure the request
	            var request = require('request');
	            var options = {
	                url: `${conf.apis.crypto.host}/ticker/${ticker_id}/`,
	                method: 'GET',
	                headers: {},
	            }

	            // Start the request
	            request(options, function (error, response, body) {
	                if (!error && response.statusCode == 200) {

	                    try {
	                        
	                        let obj    = JSON.parse(body);
	                        let data   = obj.data;
	                        let name   = data.name;
	                        let symbol = data.symbol;
	                        let rank   = data.rank;
	                        let price  = data.quotes.USD.price.toFixed(2);
	                        let change = data.quotes.USD.percent_change_24h;

	                        message.reply(`💰 **${symbol}**: \$${price} (${change}% 24h)`); 
	                    }
	                    catch(error) {
	                        message.reply("There was an error parsing the response.");  
	                    }

	                    
	                } else {
	                    // TODO Better errors
	                    console.log(body);
	                    message.reply("There was an error fetching the ticker.");
	                }
	            });

        	} else {
        		message.reply("Sorry I don't understand that ticker symbol. Try running `.crypto populate` first.");
        	}
        }

        // Populate the Ticker cache
        function populateTickerCache(message){

			var request = require('request');
            var options = {
                url: `${conf.apis.crypto.host}/ticker/?limit=25`,
                method: 'GET',
                headers: {},
            }

            // Start the request
            request(options, function (error, response, body) {
            	if (!error && response.statusCode == 200) {

                    try {
                        let obj    = JSON.parse(body);
                        let data   = obj.data;
                        let new_cache = {};

						for (var property in data) {
						    if (data.hasOwnProperty(property)) {
						    	var t = data[property];
						    	new_cache[t.symbol.toLowerCase()] = t.id;    
						    }
						}

						// Write to disk
						const fs = require('fs');
                        fs.writeFile('cache_crypto.json', JSON.stringify(new_cache), 'utf8', function(){
                        	message.reply(`Ticker cache updated`); 
                        });
                        
                    }
                    catch(error) {
                    	console.log(error);
                        message.reply("There was an error parsing the populateTicketCache() response.");  
                    }

                    
                } else {
                    console.log(body);
                    message.reply("There was an error populating the ticker cache.");
                }
            });
        }

        // Get value of top X tickers
        function getTop(message, n){

        	if(n > 10){
        		n = 10;
        	}

        	var request = require('request');
            var options = {
                url: `${conf.apis.crypto.host}/ticker/?limit=${n}`,
                method: 'GET',
                headers: {},
            }

            // Start the request
            request(options, function (error, response, body) {
            	if (!error && response.statusCode == 200) {

                    try {
                        let obj    = JSON.parse(body);
                        let data   = obj.data;
                        let response = "";

						for (var property in data) {
						    if (data.hasOwnProperty(property)) {

						    	var t 	   = data[property];
						    	var price  = t.quotes.USD.price.toFixed(2);
						    	var change = t.quotes.USD.percent_change_24h.toFixed(2);
						    	response  += ` **${t.symbol}**: \$${price} (${change}% 24h) |`
						    }
						}

                        message.reply(`💰 ${response}`); 
                    }
                    catch(error) {
                    	console.log(error);
                        message.reply("There was an error parsing the getTop() response.");  
                    }

                    
                } else {
                    console.log(body);
                    message.reply("There was an error fetching Top X.");
                }
            });
        }

    },
};