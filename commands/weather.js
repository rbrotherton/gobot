const conf = require('../config.json');
fs = require('fs');

module.exports = {
    name: 'weather',
    description: 'Gets current weather for a given zip code.',
    args: false,
    usage: '<zipcode> or <city>, <state>',
    aliases: ['w'],
    cooldown: 3,
    execute(message, args) {
        
        let api_key = conf.apis.weather.api_key;
        let url = `https://${conf.apis.weather.host}/${api_key}/conditions/q/`;
        if(args.length == 2){ // User passed in city, state
            let city  = args[0].replace(",", "");
            let state = args[1].toUpperCase();
            url += `${state}/${city}.json`;
            getWeather(url);
        } else if(args.length == 1) { // User passed in a zip code
            let zip = args[0];
            url += `${zip}.json`;
            getWeather(url);
        } else { // No arguments. See if we have cached zip code for user
            fs.readFile('cache.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
                message.reply("Cache failure. Please try again.");
            } else {
                obj = JSON.parse(data);
                let user_id = message.author.id;
                let zips = obj.zips;

                if(zips.hasOwnProperty(user_id)){
                    let zip = zips[user_id];
                    url += `${zip}.json`;
                    getWeather(url);
                } else {
                    message.reply("I don't have a saved zipcode for you. Please use .ws <zip> to save a zipcode, or .w <zip> to get the weather.");
                }

                
            }
        });
        }

        function getWeather(url) {
            // Configure the request
            var request = require('request');
            var options = {
                url: url,
                method: 'GET',
                headers: {}
            }

            // Start the request
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {

                    try {
                        
                        let obj     = JSON.parse(body);
                        let current = obj.current_observation
                        let loc     = current.display_location;
                        let city    = loc.full;

                        // Misc
                        let cur_temp   = current.temperature_string;
                        let feels_like = current.feelslike_string;
                        let cnd        = current.weather;
                        let humid      = current.relative_humidity;

                        // Format feels like
                        feels_like = feels_like.replace(" (", "** *(");
                        feels_like = feels_like.replace(")", ")*");
                        feels_like = "**"+feels_like;

                        message.reply(`**${city}**: ${cur_temp} & ${cnd} | Feels like ${feels_like} | Humidity: ${humid}`); 
                    }
                    catch(error) {
                        message.reply("There was an error parsing the response.");  
                    }

                    
                } else {
                    // TODO Better errors
                    console.log(body);
                    message.reply("There was an error fetching the weather.");
                }
            });
        }
    },
};