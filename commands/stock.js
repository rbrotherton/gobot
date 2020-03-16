const conf    = require('../config.json');
const Discord = require('discord.js');
module.exports = {
    name: 'stock',
    description: 'Gets stock quotes',
    args: true,
    usage: '<ticker>',
    aliases: ['s'],
    cooldown: 1,
    execute(message, args) {

        // Define period for time series change data
        let period = "D";
        /*if(typeof(args[1]) != "undefined") {
            let inp_period = args[1].toUpperCase();
            console.log(inp_period);
            if(["D", "W", "M"].includes(inp_period)) {
                period = inp_period;
                console.log("inp set");
            }
        }*/

        // Define variables
        let ticker_id = args[0].toUpperCase();
        let chunk        = "";
        let chunk_index  = "";
        let previous     = "";
        let api          = "";
        let first_day    = new Date();
        let second_day   = "";
        let first_stamp  = "";
        let second_stamp = "";
            
        switch(period) {
            case "D": 
                second_day = new Date(Date.now() - 86400000);
                chunk = "Daily";
                previous = "Yesterday";
                chunk_index = "Time Series (Daily)";
                api = "TIME_SERIES_DAILY";
                break;

            case "W": 
                chunk = "Weekly";
                chunk_index = "Weekly Time Series";
                previous = "End of Last Week";
                api = "TIME_SERIES_WEEKLY";
                second_day = new Date(Date.now() - (86400000 * 7)); // TODO: Needs to be previous friday
                break;

            case "M": 
                chunk = "Monthly";
                chunk_index = "Monthly Time Series";
                previous = "End of Last Month";
                api = "TIME_SERIES_MONTHLY";
                second_day = new Date(Date.now() - (86400000 * 30)); // TODO: Needs to be last day of previous month

            default:
                message.reply("Invalid period type. Please use 'm', 'd', or 'y'");
                throw new Error();
        }

        // Define time stamps we want to see from the time series data
        let m = "";
        m = first_day.getMonth()+1;
        m = (m < 10 ? `0${m}` : m);
        first_stamp  = `${first_day.getFullYear()}-${m}-${first_day.getDate()}`;
        m = second_day.getMonth()+1;
        m = (m < 10 ? `0${m}` : m);
        second_stamp = `${second_day.getFullYear()}-${m}-${second_day.getDate()}`;

        // Configure the request
        var request = require('request');
        var options = {
            url: `${conf.apis.stocks.host}/query?function=${api}&symbol=${ticker_id}&apikey=${conf.apis.stocks.key}`,
            method: 'GET',
            headers: {},
        }

        // Start the request
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                try {

                    // Get data from response
                    let obj    = JSON.parse(body);
                    let meta   = obj['Meta Data'];
                    let series = obj[chunk_index];

                    let first_day_values = series[Object.keys(series)[0]];
                    let second_day_values = series[Object.keys(series)[1]];
                    console.log(first_day_values);
                    let first_price  = parseFloat(first_day_values["4. close"]);
                    let second_price = parseFloat(second_day_values["4. close"]);

                    // Get percent change
                    var change;
                    var dir;
                    var color;
                    if(first_price > second_price) {
                        dir = "+";
                        color = 1222182; // Green
                        change = ((first_price - second_price) / second_price) * 100;
                    } else {
                        color = 13897487; // Red
                        dir = "-";
                        change = ((second_price - first_price) / second_price) * 100;
                    }
                    
                    // Format output
                    let today_value    = first_price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
                    let previous_value = second_price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
                    let change_value   = change.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
                    let embed = new Discord.RichEmbed({
                        "title": `💰 ${chunk} stock quote for ${ticker_id}`,
                        "url": `https://www.google.com/search?q=stock%20quote%20${ticker_id}`,
                        "color": color, 
                        "footer": {"text": "Source: AlphaVantage.co API"},
                        "fields": [
                            {
                                "name": "Latest Today",
                                "value": `$${today_value} (${dir}${change_value}%)`,
                                "inline": true
                            },
                            {
                                "name": previous,
                                "value": `$${previous_value}`,
                                "inline": true
                            }
                        ]
                    }); 
            
                    // message.reply(`💰 **${ticker_id.toUpperCase()}**: \$${close_price}`); 
                    message.channel.send("", embed);
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


    },
};