const conf = require('../config.json');
const Discord = require('discord.js');
module.exports = {
    name: 'holidays',
    description: 'Find holidays celebrated on a given date. Default today.',
    args: false,
    usage: '<MM/DD/YYYY>',
    aliases: [],
    cooldown: 5,
    execute(message, args) {

        
        
        let date = "";
        if(args.length){
            date = args[0];
        } else {
            var today = new Date(); 
            var dd = today.getDate(); 
            var mm = today.getMonth()+1; 
            var yyyy = today.getFullYear(); 
            date = `${mm}/${dd}/${yyyy}`;
        }
        
    	let url = `${conf.apis.holidays.host}/?d=${date}`;

    	// Create request
		var request = require('request');

		// Configure the request
		var options = {
		    url: url,
		    method: 'GET',
		    headers: {},
		}

		// Start the request
		request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {

		    	try {
		    		let obj 	 = JSON.parse(body);
                    let er 	     = obj.error;

                    if(er == "none"){                    
                        let holidays = obj.holidays;
                        
                        let embed = new Discord.RichEmbed({
                            "title": `Holidays for ${date}`,
                            "color": 1454686,
                            "author": {"name": "Checkiday.com", "url": `https://www.checkiday.com/${date}`},
                        });

                        let markup = "";
                        holidays.forEach(holiday => {
                            var url  = holiday.url;
                            var name = holiday.name;
                            // embed.addField(name, url);
                            markup += `[${name}](<${url}>)\n`;
                        });

                        // message.reply(`🤖 ${embed}`);	
                        embed.setDescription(markup);

                        message.channel.send("", embed);
                    } else {
                        console.log(er);
                        message.reply(er);	
                    }
		    	}
		    	catch(error) {
		    		console.log(error);
		    		message.reply("There was an error parsing the response.");	
		    	}

		        
		    } else {
		    	// TODO Better errors
		    	message.reply("There was an error fetching the data.");
		    }
		})
    },
};