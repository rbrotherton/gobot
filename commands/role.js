const conf = require('../config.json');
module.exports = {
    name: 'role',
    description: 'Give yourself roles, or remove them.',
    args: true,
    usage: '<role name> (CaSe SeNsItIvE!)',
    aliases: [],
    cooldown: 5,
    execute(message, args) {

    	const guild = message.guild;
    	const user 	= message.member;
    	const role_name = args.join(' ');
    	const bot = null;

    	// Find Role in guild
    	let role = guild.roles.find("name", role_name);
    	if(!role){
    		message.reply("I could not find that role.");
    		return;
    	}

    	// Does User have role?
    	user_has_role = user.roles.find("name", role_name);

    	// Add or remove role
    	if(!user_has_role){
    		user.addRole(role)
			  .then(function(){
			  	console.log(`${guild.name} - Added '${role.name}' role to ${user.user.username}`);
			  	message.reply(`🤖 I have given you the ${role.name} role!`);
			  	return;
			  })
			  .catch(function(error){
					if(error.code == 50013){
						message.reply("🤖 Sorry, I can't manage that role.")
					} else {
						message.reply("🤖 Sorry, an error occured.")
					}
			  	});
    	} else {
    		user.removeRole(role)
			  	 .then(function(){
				  	console.log(`${guild.name} - Removed '${role.name}' role from ${user.user.username}`);
				  	message.reply(`🤖 I have removed your ${role.name} role!`);
				  	return;
				  })
				.catch(function(error){
					if(error.code == 50013){
						message.reply("🤖 Sorry, I can't manage that role.")
					} else {
						message.reply("🤖 Sorry, an error occured.")
					}
			  	});
    	}
    	
    },
};