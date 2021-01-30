const conf    = require('../config.json');
const Discord = require('discord.js');
module.exports = {
    name: 'stock',
    description: 'Gets stock quotes',
    args: true,
    usage: '<ticker>',
    aliases: ['s'],
    cooldown: 1, // Free API key has a limit of 60 requests per minute
    execute(message, args) {

        // Define variables
        let ticker_id = args[0].toUpperCase();

        // Configure the request
        var url = `${conf.apis.stocks.host}/quote?symbol=${ticker_id}&token=${conf.apis.stocks.key}`;
        console.log(url);
        var request = require('request');
        var options = {
            url: url,
            method: 'GET',
            headers: {},
        }

        // Start the request
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                try {

                    // Get data from response
                    let obj      = JSON.parse(body);
                    let current  = obj.c;
                    let previous = obj.pc;
                    
                    let first_price  = parseFloat(current);
                    let second_price = parseFloat(previous);

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
                        "title": `💰 Latest stock quote for ${ticker_id}`,
                        "url": `https://www.google.com/search?q=stock%20quote%20${ticker_id}`,
                        "color": color, 
                        "footer": {"text": "Source: FinnHub.io API"},
                        "fields": [
                            {
                                "name": "Latest Today",
                                "value": `$${today_value.toString()} (${dir}${change_value.toString()}%)`,
                                "inline": true
                            },
                            {
                                "name": "Previous Close",
                                "value": `$${previous_value.toString()}`,
                                "inline": true
                            }
                        ]
                    }); 
            
                    message.reply(`💰 **${ticker_id.toUpperCase()}**: \$${today_value}`); 
                    message.channel.send("", embed);
                    // message.channel.send(`Today: $${today_value} (${dir}${change_value}%)`);
                    // message.channel.send(`Previous: $${previous_value}`);
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