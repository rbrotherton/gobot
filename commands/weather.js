const conf = require('../config.json');
const Discord = require('discord.js');
fs = require('fs');

module.exports = {
    name: 'weather',
    description: 'Gets current weather for a given zip code.',
    args: false,
    usage: '<zipcode> or <city> <state>',
    aliases: ['w'],
    cooldown: 3,
    execute(message, args) {

        if(args.length > 1){ // User passed in a location by name

            // Get City
            var city = "";
            if(args.length > 2){
                city = `${args[0]} ${args[1].replace(",", "")}`;    
            } else {
                city = args[0].replace(",", "");
            }

            // Get state
            let state = args[(args.length - 1)].toUpperCase();

            // Send request
            getWeather({"city": city, "state": state});

        } else if(args.length == 1) { // User passed in a zip code
            getWeather({"zip": args[0]});
        } else { // No arguments. See if we have cached location for user
            fs.readFile('cache.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
                message.reply("Cache failure. Please try again.");
            } else {
                obj = JSON.parse(data);
                let user_id = message.author.id;
                let zips = obj.zips;

                if(zips.hasOwnProperty(user_id)){
                    let place = zips[user_id];
                    getWeather(place);
                } else {
                    message.reply("I don't have a saved location for you. Please use `.ws <zip>` or `.ws city state` to save a location first.");
                }
            }
        });
        }

        /**
         * Function to retrieve weather for a given input
         * @param {*} loc 
         */
        function getWeather(loc) {

            let api_key = conf.apis.weather.api_key;
            let host    = "https://api.openweathermap.org/data/2.5/weather";
            let units   = "imperial";
            let url     = `${host}?appid=${api_key}`;

            if (loc.hasOwnProperty('zip')) {
                url += `&zip=${loc.zip}`;
            } else {
                url += `&q=${loc.city},${loc.state}`;
            }

            url += `&units=${units}`;

            // Configure the request
            var request = require('request');
            var options = {url: url, method: 'GET', headers: {"User-Agent": "GoBot - Discord Bot"}}

            // Start the request
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {

                    try {

                        let obj = JSON.parse(body);

                        // Get location information from response
                        let location = obj.name;
                        let state = (obj.sys.region) ? `, ${obj.sys.region}` : "";
                        let country = `, ${obj.sys.country}`;

                        // Format data
                        let current    = obj.weather[0];
                        let cnd        = current.description;
                        let icon       = current.icon;
                        let main       = obj.main;
                        let humid      = Math.round(main.humidity);
                        let temp_f     = Math.round(main.temp);
                        let temp_c     = Math.round((temp_f - 32) * .55555555);
                        let feels_f    = Math.round(main.feels_like);
                        let feels_c    = Math.round((feels_f - 32) * .55555555);

                        let cur_temp   = `${temp_f} F (${temp_c} C)`;
                        let feels_like = `${feels_f} F (${feels_c} C)`;

                        // Get a condition icon
                        icon = getIcon(icon);
                        let msg = ``;
                        msg += `<@${message.author.id}> - `;
                        msg += `Weather for ${location}${state}${country}: ${cnd} and ${cur_temp} | Feels like ${feels_like} | Humidity: ${humid}% | Today: ${icon} `;
                        
                        message.channel.send(msg);

                    }
                    catch(error) {
                        console.log(error);
                        message.reply("There was an error parsing the response.");  
                    }

                } else {
                    // TODO Better errors
                    console.log(body);
                    message.reply("There was an error fetching the weather.");
                }
            });
        }

        // Get an icon to represent a given condition
        function getIcon(icon_code) {

            // Map OpenWeather icon codes to emojis
            const icon_map = {
                "01d": "☀️",
                "01n": "🌑",
                "02d": "🌤",
                "02n": "🌥",
                "03d": "☁️",
                "03n": "☁️",
                "04d": "☁️",
                "04n": "☁️",
                "09d": "🌧",
                "09n": "🌧",
                "10d": "🌦",
                "10n": "🌦",
                "11d": "⛈",
                "11n": "⛈",
                "13d": "🌨",
                "13n": "🌨",
                "50d": "🌁",
                "50n": "🌁"
            };

            return icon_map[icon_code] || "❓";

        }
    },
};
