const conf = require('../config.json');
const axios = require('axios')

module.exports = {
    name: 'weather',
    description: 'Gets current weather for a given zip code.',
    args: true,
    usage: '<zipcode> or <city>, <state>',
    aliases: ['w'],
    cooldown: 3,
    execute(message, args) {
        
        let url = `https://${conf.apis.weather.host}/${conf.apis.weather.api_key}/conditions/q/`;
        if(args.length == 2){
            let city  = args[0].replace(",", "");
            let state = args[1].toUpperCase();
            url += `${state}/${city}.json`;
        } else {
            let zip = args[0];
            url += `${zip}.json`;
        }
        
        axios.get(url).then((response) =>{
            try {
                let current = response.data.current_observation
                let loc = current.display_location;
                let city = loc.full;
                let cur_temp = current.temperature_string;
                let feels_like = current.feelslike_string;
                let cnd = current.weather;
                message.reply(`**${city}**: ${cur_temp} & ${cnd} | Feels like ${feels_like}`);
            }
            catch(error) {
                message.reply("There was an error parsing the response.");
            }
        }, (error) => {
            // TODO Better errors
            console.info(error)
            message.reply("There was an error fetching the weather.");
        })
    },
};