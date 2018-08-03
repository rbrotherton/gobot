const conf = require('../config.json');
module.exports = {
    name: 'tictactoe',
    description: 'Play a game of Tic Tac Toe',
    args: false,
    usage: '<start | restart | reset | board | [row (1-3)] [col (1-3)] >',
    aliases: ['ttt'],
    cooldown: 3,
    execute(message, args) {

    	// Load server/channel info
    	const server  = message.guild;
    	const channel = message.channel;

    	// Create our game
  		const game = {
  			"board": {
  				0: [0, 0, 0],
  				1: [0, 0, 0],
  				2: [0, 0, 0]
  			},
  			"message": message,

  			// Store my board in memory
  			save: function(){

  				let board = this.board;

  				// Get Cache
		        fs.readFile('cache.json', 'utf8', function readFileCallback(err, data){
		            if (err){
		                console.log(err);
		                message.reply("Cache failure. Please try again.");
		            } else {
		                obj = JSON.parse(data);
		                let boards = obj.boards;

		                let server_channel_key = server.id + channel.id;
		                boards[server_channel_key] = board;
		                obj.boards = boards;
		                json = JSON.stringify(obj);
		                fs.writeFile('cache.json', json, 'utf8', function(){{};});
		            }
		        });
  			},

  			// Load my board from memory and update it
  			load: function(row, col) {

  				// Get Cache
		        fs.readFile('cache.json', 'utf8', function readFileCallback(err, data){
		            if (err){
		                console.log(err);
		                this.message.reply("Cache failure. Please try again.");
		            } else {
		                obj = JSON.parse(data);
		                let boards = obj.boards;

		                let server_channel_key = server.id + channel.id;
		                game.setBoard(boards[server_channel_key]);

		                // Make a play or just draw the board?
		                if(null != row && null != col){
		                	game.play(row, col);	
		                } else {
		                	game.draw();
		                }
		                
		            }
		        });
  			},

  			// Reset my board
  			reset: function(){
  				this.board = {
	  				0: [0, 0, 0],
	  				1: [0, 0, 0],
	  				2: [0, 0, 0]
	  			};
  			},

  			// Draw my board to Discord
  			draw: function(){
  				
				// Define characters/lines
				let horiz_line = '--------------------';
				let line1 = this.numToSymbol(this.board[0][0]) + " | " + this.numToSymbol(this.board[0][1]) + " | " + this.numToSymbol(this.board[0][2]);
				let line2 = this.numToSymbol(this.board[1][0]) + " | " + this.numToSymbol(this.board[1][1]) + " | " + this.numToSymbol(this.board[1][2]);
				let line3 = this.numToSymbol(this.board[2][0]) + " | " + this.numToSymbol(this.board[2][1]) + " | " + this.numToSymbol(this.board[2][2]);

				// Create & send message
				let message = `Board: \n ${line1} \n ${horiz_line} \n ${line2} \n ${horiz_line} \n ${line3}`;
				this.message.reply(message)

  			},

  			// Log a play 
  			play: function(row, col) {

  				// If game has ended, reset it
  				if(this.isGameOver()){
  					this.reset();
  				}

  				if(!this.isInt(row) || !this.isInt(col)){
  					message.reply("Please specify valid values for row and column. Example: `.ttt 1 3`");
  					return;
  				}

  				// Already filled?
  				if(parseInt(this.board[row-1][col-1]) !== 0){
  					this.message.reply("That spot has already been played.");
  					return;
  				}

  				// Whose turn is it?
  				let x = 0;
  				let o = 0;
  				this.board[0].forEach(function(cell){if(cell == 1){x = x+1;}if(cell == 2){o = o+1;}});
  				this.board[1].forEach(function(cell){if(cell == 1){x = x+1;}if(cell == 2){o = o+1;}});
  				this.board[2].forEach(function(cell){if(cell == 1){x = x+1;}if(cell == 2){o = o+1;}});

  				let next_play = 0;
  				if(x > o){
  					next_play = 2;  // O is next
  				} else {
  					next_play = 1; // X is next
  				}
  				
  				// Update board & save
  				this.board[row-1][col-1] = next_play;
  				this.save();

  				// Check for wins - 8 combinations
  				if(this.isGameOver()){
  					this.message.reply("Game over!");
  				}

  				this.draw();

  			},

  			// Set my board
  			setBoard: function(board) {
  				this.board = board;
  			},

  			// Log my board, used for debugging
  			log: function() {
  				console.log(this.board[0][0] + " | " + this.board[0][1] + " | " + this.board[0][2]);
  				console.log(this.board[1][0] + " | " + this.board[1][1] + " | " + this.board[1][2]);
  				console.log(this.board[2][0] + " | " + this.board[2][1] + " | " + this.board[2][2]);
  			},

  			// Is n an integer?
  			isInt: function (n) {
			  return !isNaN(n) && (function(x) { return (x | 0) === x; })(parseFloat(n))
			},

			// Convert number to symbol
			numToSymbol: function(n){

				let x = "❌";
				let o = "⭕";
				let space = "▫";

				n = parseInt(n);
				if(n == 0){
					return space;
				} else if(n == 1) {
					return x;
				} else if(n == 2) {
					return o;
				} else {
					return space;
				}
			},

			// Is my current game done?
			isGameOver: function() {

				// Check rows for X
				if(this.board[0][0] == 1 && this.board[0][1] == 1 && this.board[0][2] == 1){return true;}
				else if(this.board[1][0] == 1 && this.board[1][1] == 1 && this.board[1][2] == 1){return true;}
				else if(this.board[2][0] == 1 && this.board[2][1] == 1 && this.board[2][2] == 1){return true;}

				// Check columns for X
				else if(this.board[0][0] == 1 && this.board[1][0] == 1 && this.board[2][0] == 1){return true;}
				else if(this.board[0][1] == 1 && this.board[1][1] == 1 && this.board[2][1] == 1){return true;}
				else if(this.board[0][2] == 1 && this.board[1][2] == 1 && this.board[2][2] == 1){return true;}

				// Check diagonal for X
				else if(this.board[0][0] == 1 && this.board[1][1] == 1 && this.board[2][2] == 1){return true;}
				else if(this.board[0][2] == 1 && this.board[1][1] == 1 && this.board[2][0] == 1){return true;}

				// Check rows for O
				if(this.board[0][0] == 2 && this.board[0][1] == 2 && this.board[0][2] == 2){return true;}
				else if(this.board[1][0] == 2 && this.board[1][1] == 2 && this.board[1][2] == 2){return true;}
				else if(this.board[2][0] == 2 && this.board[2][1] == 2 && this.board[2][2] == 2){return true;}

				// Check columns for O
				else if(this.board[0][0] == 2 && this.board[1][0] == 2 && this.board[2][0] == 2){return true;}
				else if(this.board[0][1] == 2 && this.board[1][1] == 2 && this.board[2][1] == 2){return true;}
				else if(this.board[0][2] == 2 && this.board[1][2] == 2 && this.board[2][2] == 2){return true;}

				// Check diagonal for O
				else if(this.board[0][0] == 2 && this.board[1][1] == 2 && this.board[2][2] == 2){return true;}
				else if(this.board[0][2] == 2 && this.board[1][1] == 2 && this.board[2][0] == 2){return true;}
				
        // Check for a full board with no winners
        else if(
          this.board[0][0] != 0 && 
          this.board[0][1] != 0 && 
          this.board[0][2] != 0 && 
          this.board[1][0] != 0 && 
          this.board[1][1] != 0 && 
          this.board[1][2] != 0 &&
          this.board[2][0] != 0 && 
          this.board[2][1] != 0 && 
          this.board[2][2] != 0){
          return true;
        }

        // Game still going
        else { return false;}

			}	
  		};

    	// Start new game/restart
    	if(!args.length || ["start", "restart", "reset"].includes(args[0].toLowerCase())){
    		game.save();
    		game.draw();
    	} else if(args[0].toLowerCase() == "board") {
    		game.load(); // Show the board
    	} else if(args.length == 2) { // Make a play
    		game.load(args[0], args[1]);
    	}
    	
    },
};