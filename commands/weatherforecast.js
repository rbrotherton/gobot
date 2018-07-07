const conf = require('../config.json');
fs = require('fs');

module.exports = {
    name: 'weatherforecast',
    description: 'Gets weather forecast',
    args: false,
    usage: '<zipcode> or <city>, <state>',
    aliases: ['wf'],
    cooldown: 3,
    execute(message, args) {
        
        let api_key = conf.apis.weather.api_key;
        let url = `https://${conf.apis.weather.host}/${api_key}/forecast/q/`;
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
                        
                        let obj  = JSON.parse(body);
                        let fc   = obj.forecast.simpleforecast;
                        let fctx = obj.forecast.txt_forecast;

                        let result = "";

                        fctx.forecastday.forEach(function(day){
                        	if(day.title.indexOf("Night") == -1){ // Ignore 'Night' entries
                        		result += `\n **${day.title}**: ${day.fcttext}`;
                        	}
                        });
                        message.reply(result);
                        // Create response
                        // message.reply(`**${city}**: ${cur_temp} and feels like ${feels_like} | Humidity: ${humid} | ${cnd_icon} ${cnd}`); 
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
        function getIcon(condition) {

            // Rain/storm icons
            var icon_cloud_rain = `🌧`;
            var icon_thunder_cloud_rain = `⛈`;
            var icon_sun_rain_cloud = `🌦`;
            var icon_lightning = `🌩`;

            // Snow/ice
            var icon_snowing = `🌨`;
            var icon_snowflake = `❄`;

            // Cloudy
            var icon_overcast = `☁`;
            var icon_cloudy = `🌥`;
            var icon_light_clouds = `🌤`;

            // Sun
            var icon_sun = `☀`;

            // Fog
            var icon_fog = `🌁`;

            // Map condition keywrods to an emoji
            var conditions = [
                {"name": 'drizzle', "icon": icon_cloud_rain},
                {"name": 'showers', "icon": icon_sun_rain_cloud},
                {"name": 'rain',    "icon": icon_cloud_rain},
                {"name": 'spray',   "icon": icon_cloud_rain},
                {"name": 'snow',    "icon": icon_snowing},
                {"name": 'ice',     "icon": icon_snowflake},
                {"name": 'hail',    "icon": icon_snowflake},
                {"name": 'mist',    "icon": icon_fog},
                {"name": 'fog',     "icon": icon_fog},
                {"name": 'smoke',   "icon": icon_fog},
                {"name": 'volcanic',"icon": icon_fog},
                {"name": 'dust',    "icon": icon_fog},
                {"name": 'sand',    "icon": icon_fog},
                {"name": 'haze',    "icon": icon_fog},
                {"name": 'thunder', "icon": icon_thunder_cloud_rain},
                {"name": 'overcast',"icon": icon_overcast},
                {"name": 'clear',   "icon": icon_sun},
                {"name": 'sunny',   "icon": icon_sun},
                {"name": 'cloud',   "icon": icon_cloudy}
            ];

            // For each condition keyword, see if condition contains it
            let result   = icon_sun;
            let haystack = condition.toString().toLowerCase();
            conditions.forEach(function(condition_entry){
                var needle = condition_entry.name.toLowerCase();
                if(haystack.indexOf(needle) !== -1){
                    result = condition_entry.icon;
                }
            });

            return result;

        }
    },
};