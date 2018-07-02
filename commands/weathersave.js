const conf  = require('../config.json');
fs = require('fs');

module.exports = {
    name: 'weathersave',
    description: 'Saves a user\'s zipcode for ease of use with weather command' ,
    args: true,
    usage: '<zipcode>',
    aliases: ['ws'],
    cooldown: 1,
    execute(message, args) {
        
        let zip = args[0];

        // Get cache
        fs.readFile('cache.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
                message.reply("Cache failure. Please try again.");
            } else {
                obj = JSON.parse(data);
                let user_id = message.author.id;
                let zips = obj.zips;
                zips[user_id] = zip;
                json = JSON.stringify(obj);
                fs.writeFile('cache.json', json, 'utf8', function(){
                    message.reply("I've saved your zipcode for future use.");
                });
            }
        });
    },
};