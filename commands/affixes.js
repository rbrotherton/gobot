const conf = require('../config.json');
const Discord = require('discord.js');
module.exports = {
    name: 'affixes',
    description: `WoW - Get current week's mythic+ affixes`,
    args: false,
    usage: '',
    aliases: ['aff','affix'],
    cooldown: 5,
    execute(message, args) {
        
    	let url = `https://raider.io/api/v1/mythic-plus/affixes?region=us&locale=en`;

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
		    if (!error) {
                
		    	try {
                    let obj 	 = JSON.parse(body);
                    let title    = obj.title;
                    let url      = obj.leaderboard_url;
                    let entries  = obj.affix_details;
                    
                    let embed = new Discord.RichEmbed({
                        "title": title,
                        "color": 16776448, // Yellow
                        "author": {"name": "Raider.io - affixes for current week", "url": url},
                    });

                    let markup = "";
                    let affix_levels = [2, 4, 7, 10];
                    entries.forEach(entry => {
                        var url   = entry.wowhead_url;
                        var name  = entry.name;
                        var desc  = entry.description;
                        var level = `+${affix_levels[0]}`;
                        var new_line = `**${name} (${level}):** ${desc}\n`
                        markup += new_line;

                        affix_levels.shift();

                    });

                    // message.reply(`🤖 ${embed}`);	
                    embed.setDescription(markup);

                    message.channel.send("", embed);
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
