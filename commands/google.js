module.exports = {
    name: 'google',
    description: 'Fetch the first result of a Google query',
    args: true,
    usage: '<query>',
    aliases: ['g', 'goog'],
    cooldown: 5,
    execute(message, args) {

    	let query = args.join(' ');
    	var google = require('google')

		google.resultsPerPage = 10
		var nextCounter = 0

		google(query, function (err, res){
		  if (err) console.error(err)
		    var link = res.links[0];
			let result = `🤖 **${link.title}** (${link.link})\n\`\`\`${link.description}\`\`\` `;
			message.reply(result);
		})
    },
};