const conf  = require('../config.json');
fs = require('fs');

module.exports = {
    name: 'weathersave',
    description: 'Saves a user\'s zipcode for ease of use with weather command' ,
    args: true,
    usage: '<zipcode>',
    aliases: ['ws'],
    prodOnly: true,
    cooldown: 1,
    execute(message, args) {

        // Determine type of input
        let loc = {};
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
            loc = ({"city": city, "state": state});

        } else if(args.length == 1) { // User passed in a zip code
            loc = {"zip": args[0]};
        } else {
            message.reply("Invalid locationt ype specified");
        }

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
                let lat   = place.lat;
                let lon   = place.lon;

                // Cache results
                fs.readFile('cache.json', 'utf8', function readFileCallback(err, data){
                    if (err){
                        console.log(err);
                        message.reply("Cache failure. Please try again.");
                    } else {
                        obj = JSON.parse(data);
                        let user_id = message.author.id;
                        let zips = obj.zips;
                        zips[user_id] = {"lat": lat, "lon": lon};
                        json = JSON.stringify(obj);
                        fs.writeFile('cache.json', json, 'utf8', function(){
                            message.reply("I've saved your location for future use.");
                        });
                    }
                });
                
            } else {
                console.log(body);
                message.reply("I failed to find coordinates for that locaion :(");
            }
        });

    },
};