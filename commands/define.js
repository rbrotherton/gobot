const conf = require('../config.json')
const axios = require('axios')

// Set the headers
axios.defaults.headers = {
    'app_id': conf.apis.define.app_id,
    'app_key': conf.apis.define.app_key
}

module.exports = {
    name: 'define',
    description: 'Gets the definition of an English word',
    aliases: ['def'],
    cooldown: 1,
    args: true,
    execute(message, args) {
    	
    	// https://od-api.oxforddictionaries.com/api/v1/entries/en/dog

    	let word = args[0];
    	let url = `${conf.apis.define.host}/entries/${conf.apis.define.language}/${word.toLowerCase()}`;

        axios.get(url).then((response) =>{
            try {
                let lexEntry = response.data.results[0].lexicalEntries[0]
                let type 	 = lexEntry.lexicalCategory;
                let entry 	 = lexEntry.entries[0];
                let def 	 = entry.senses[0].definitions[0];
                // let notes 	 = entry.senses[0].notes[0];
                message.reply(`**${word}** (${type}): ${def}`);
            }
            catch(error) {
                message.reply("There was an error parsing the response.");
            }
        }, (error) => {
            // TODO Better errors
            console.info(error)
            message.reply("There was an error looking up that word.");
        })
    }
};

