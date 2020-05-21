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

        /**
         * Determine which type of request, and if we need to automatically load location info from cache
         */
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
            getCoords({"city": city, "state": state});

        } else if(args.length == 1) { // User passed in a zip code
            getCoords({"zip": args[0]});
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
         * @param {*} url 
         */
        function getWeather(place) {

            let api_key = conf.apis.weather.api_key;
            let host    = conf.apis.weather.host;
            let exclude = "minutely,hourly,daily,flags";
            let url     = `${host}/forecast/${api_key}/${place.lat},${place.lon}?exclude=${exclude}`;

            // Do we have a label for this location to show to the user?
            let place_label = "";
            
            if(place.hasOwnProperty('address')){
                let address = place.address;
                if(address.hasOwnProperty('city') && address.hasOwnProperty('state')){
                    place_label = `**${address.city}, ${address.state}** `;
                } else if(address.hasOwnProperty('postcode')) {
                    place_label = `**${address.postcode}** `;
                }
            }

            // Configure the request
            var request = require('request');
            var options = {url: url, method: 'GET', headers: {"User-Agent": "GoBot - Discord Bot"}}

            // Start the request
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {

                    try {

                        let obj = JSON.parse(body);
                        // obj = JSON.parse(testJson());

                        // Format data
                        let current    = obj.currently
                        let cnd        = current.summary;
                        let icon       = current.icon;
                        let humid      = Math.round(current.humidity * 100);
                        let temp_f     = Math.round(current.temperature);
                        let temp_c     = Math.round((temp_f - 32) * .55555555);
                        let feels_f    = Math.round(current.apparentTemperature);
                        let feels_c    = Math.round((feels_f - 32) * .55555555);

                        let cur_temp   = `${temp_f} F (${temp_c} C)`;
                        let feels_like = `${feels_f} F (${feels_c} C)`;

                        // Add icon to 'Feels Like' string for extreme temps
                        if(feels_f >= 100){
                            feels_like = `🔥 ${feels_like}`;
                        } else if(feels_f <= 32) {
                            feels_like = `❄ ${feels_like}`;   
                        }
                        
                        // Get a condition icon
                        icon = getIcon(icon);
                        let msg = ``;
                        msg += `<@${message.author.id}> - `;
                        msg += `${place_label}${cnd} and ${cur_temp} | Feels like ${feels_like} | Humidity: ${humid}% | Today: ${icon} `;
                        
                        // Have any alerts to notify the user of?
                        if(obj.hasOwnProperty("alerts") && obj.alerts.length > 0){
                            let alert_text = obj.alerts.map(alert => {
                                return `[ALERT] [${alert.title}](${alert.uri})\n`;
                            }).join('');
                            
                            let embed = new Discord.RichEmbed({
                                // "title": `⚠️ Alert(s) for you`,
                                "color": 13897487,  // red
                                "description": alert_text,
                                // "footer": {"text": "Source: DarkSky API"}                                
                            }); 

                            // message.reply(msg, embed); 
                            message.channel.send(msg, embed);
                        } else {
                            message.channel.send(msg); 
                        }

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

        /**
         * Geocode a given location
         * @param {*} loc 
         */
        function getCoords(loc) {

            // Zip or city+state switch
            let loc_str = "";
            if(loc.hasOwnProperty('zip')){
                loc_str = loc.zip;
            } else {
                loc_str = `${loc.city}, ${loc.state}`;
            }

            // Configure the request
            let url = `https://nominatim.openstreetmap.org/search?q=${loc_str}&format=json&addressdetails=1`;
            var request = require('request');
            var options = {url: url, method: 'GET', headers: {"User-Agent": "GoBot - Discord Bot"}}

            // Send request
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    let place = JSON.parse(body)[0];
                    getWeather(place);
                } else {
                    console.log(body);
                    message.reply("I failed to find coordinates for that locaion :(");
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
                {"name": 'sleet',   "icon": icon_snowing},
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
                {"name": 'cloud',   "icon": icon_cloudy},
                {"name": 'cloudy',  "icon": icon_cloudy},
                {"name": 'partly-cloudy', "icon": icon_light_clouds},
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