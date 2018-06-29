const conf = require('../config.json');
module.exports = {
    name: 'weather',
    description: 'Gets current weather for a given zip code.',
    args: true,
    usage: '<zipcode>',
    aliases: ['w'],
    cooldown: 3,
    execute(message, args) {
        
        let zip = args[0];
        let api_key = conf.apis.weather.api_key;
        let url = `https://${conf.apis.weather.host}/${api_key}/conditions/q/${zip}.json`;
        
        // Configure the request
        var request = require('request');
        var options = {
            url: url,
            method: 'GET',
            headers: {},
            // qs: {'': 'xxx', 'key2': 'yyy'}
        }

        // Start the request
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                try {
                    
                    let obj = JSON.parse(body);
                    let current = obj.current_observation
                    let loc = current.display_location;
                    let city = loc.full;

                    // Misc
                    let cur_temp = current.temperature_string;
                    let feels_like = current.feelslike_string;
                    let cnd = current.weather;

                    message.reply(`**${city}**: ${cur_temp} & ${cnd} | Feels like ${feels_like}`); 
                }
                catch(error) {
                    message.reply("There was an error parsing the response.");  
                }

                
            } else {
                // TODO Better errors
                console.log(body);
                message.reply("There was an error fetching the weather.");
            }
        })
    },
};