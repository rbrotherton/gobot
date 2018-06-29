module.exports = {
    name: 'roll',
    description: 'Rolls some dice',
    aliases: ['r'],
    usage: '<NdN (e.g. 3d6)>',
    cooldown: 1,
    args: true,
    execute(message, args) {

        var DiceRoller = function() {

          // Private

          // Create a "data type" to represent the roll results
          var ResultSet = function() {
            this.rolls = [];
            this.modifier = 0;
            this.total = 0;
          };

          // Add a toString method for convenience
          ResultSet.prototype.toString = function() {
            var rolls = this.rolls.join(' + ');
            var modifier = this.modifier;
            var total = this.total;

            if (modifier > 0) {
              return rolls + ' + ' + modifier + ' = ' + '**' + total + '**';
            } else if (modifier < 0) {
              return rolls + ' - ' + Math.abs(modifier) + ' = ' + '**' + total + '**';
            } else {
              return (rolls == total) ? total : rolls + ' = ' + '**' + total + '**';
            }
          };

          /**
           * Parse formula into component parts
           * Returns object on success and null on failure
           */
          var parse = function(formula) {
            var matches = formula.match(/^(\d+)?d(\d+)([+-]\d+)?$/i);
            if (matches === null || matches[2] == 0) {
              return null;
            }

            var rolls    = (matches[1] !== undefined) ? (matches[1] - 0) : 1;
            var sides    = (matches[2] !== undefined) ? (matches[2] - 0) : 0;
            var modifier = (matches[3] !== undefined) ? (matches[3] - 0) : 0;

            return { rolls: rolls, sides: sides, modifier: modifier };
          };

          // Public

          /**
           * Roll the dice described in formula
           * Returns a ResultSet on success and null on failure
           */
          this.roll = function(formula) {
            var pieces = parse(formula);
            if (pieces === null) {
              return null;
            }

            var results = new ResultSet();

            // rolls
            for (var i = 0; i < pieces.rolls; i++) {
              results.rolls[i] = (1 + Math.floor(Math.random() * pieces.sides));
            }

            // modifier
            results.modifier = pieces.modifier;

            // total
            for (var i = 0; i < results.rolls.length; i++) {
              results.total += results.rolls[i];
            }
            results.total += pieces.modifier;

            return results;
          };

          /**
           * Validates the format of formula
           * Returns true on success and false on failure
           */
          this.validate = function(formula) {
            return (parse(formula) === null) ? false : true ;
          };

        };
        
        let input = args[0];
        let roller = new DiceRoller();
        let output = roller.roll(input);
        // console.log(output);
        message.reply(output.toString());

    },
};