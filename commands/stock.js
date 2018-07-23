const conf    = require('../config.json');

module.exports = {
    name: 'stock',
    description: 'Gets stock quotes',
    args: true,
    usage: '<ticker>',
    aliases: ['s'],
    cooldown: 1,
    execute(message, args) {

    	getTicker(message, args[0]);

        // Get a Ticker value
        function getTicker(message, ticker_id) {
        	
    		// Configure the request
            var request = require('request');
            var options = {
                url: `${conf.apis.stocks.host}/query?function=TIME_SERIES_INTRADAY&symbol=${ticker_id}&interval=60min&apikey=${conf.apis.stocks.key}&outputsize=compact`,
                method: 'GET',
                headers: {},
            }

            // Start the request
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {

                    try {
                        
                        let obj    = JSON.parse(body);
                        let meta   = obj['Meta Data'];
                        let date   = meta["3. Last Refreshed"];
                        let series = obj["Time Series (60min)"];
                        let data   = series[date];
                        let close_price = data[Object.keys(data)[3]];
                        
                        close_price = parseFloat(close_price).toFixed(2);

                        message.reply(`💰 **${ticker_id.toUpperCase()}**: \$${close_price}`); 
                    }
                    catch(error) {
                    	console.log(error);
                        message.reply("There was an error parsing the response.");  
                    }

                    
                } else {
                    // TODO Better errors
                    console.log(body);
                    message.reply("There was an error fetching the ticker.");
                }
            });
        }

    },
};