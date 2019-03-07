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
     
        message.reply("This functionality is currently disabled. ");

    }
};