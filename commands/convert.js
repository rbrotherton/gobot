const conf = require('../config.json');
const Discord = require('discord.js');
const convert = require('convert-units');

module.exports = {
    name: 'convert',
    description: 'Convert a quantity from one unit to another',
    args: true,
    usage: '<1 lb to kg> | <units>',
    aliases: ['conv'],
    cooldown: 1,
    execute(message, args) {

        // Alternaate modes
        // List available conversion units
        if(args[0].toString().toLowerCase() == "units") {
            message.reply(`Valid units: ${convert().possibilities().join(", ")}`);
            return;
        }

        // Get quantity
        let qty = parseFloat(args[0]);
        if(isNaN(qty)) {message.reply(`${args[0]} is not a valid quantity`); return;}

        // Get first unit
        let unit1 = args[1].toString().toLowerCase();
        unit1 = getUnitAbbr(unit1);
        if(!convert().possibilities().includes(unit1)) {
            message.reply(`${unit1} is not a valid unit type. For all valid units try '${conf.prefix}${this.name} units'`);
            return;
        }

        // Try to find second unit
        let arg2 = args[2].toString().toLowerCase();
        let unit2 = "";
        arg2 = getUnitAbbr(arg2);
        if(convert().possibilities().includes(arg2)) {
            unit2 = arg2;
        } else {
            let arg3 = args[3].toString().toLowerCase();
            arg3 = getUnitAbbr(arg3);
            if(convert().possibilities().includes(arg3)) {
                unit2 = arg3;
            } else {
                let possibilities = convert().from(unit1).possibilities().join(', ');
                message.reply(`Could not find a valid second unit. Valid conversion units for '${unit1}' are: ${possibilities}`);
                return;
            }
        }   
        
        // Return conversion since we have everything we need at this point
        try {
            let result = convert(qty).from(unit1).to(unit2).toFixed(2);
            let msg = `${qty} ${unit1} 🔀 ${result} ${unit2}`;
            message.reply(msg);
        } catch(error) {
            console.log(error);
            message.reply(`Error: ${error}`);	
        }

        return;

        // Get the abbreviated form of a unit full name
        function getUnitAbbr(inp) {
            let result = inp;
            convert().list().forEach(unit => {
                if(unit.singular.toLowerCase() == inp || unit.plural.toLowerCase() == inp) {
                    result = unit.abbr;
                    return;
                }
            });

            return result;
        }
    },
};