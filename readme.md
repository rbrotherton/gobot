# GoBot
A simple Discord bot written in Node.js.

### Prerequisites

* Node v8 or greater
* discord.js
* project dependencies

## Testing

There is a test script so you can test commands locally without hooking into Discord. Just navigate to project directory and call it like so:

* `node test weather 46268`
* `node test weather Fresno, CA`
* `node test roll 3d6`
* `node test flip`

## Permissions

The bot will need the following permissions

 * Send Messages (duh)
 * Read Text Channels (duh)
 * Manage Channel (To use .topic)
 * Manage Roles (To use .role)
 * Manage Messages (To use .quickpoll)

## Functions
* `8ball` - Ask the magic 8ball a question
* `coinflip` - Flip a coin
* `crypto` - Get a crypto currency quote, or several.
* `define` - Look up a word in the Oxford dictionary
* `google` - Return Google search results for a query
* `help` - display help with my commands
* `news` - get top world news or search keyword news articles.
* `ping` - Classic ping. See if you & the bot can communicate.
* `quickpoll` - Create a yes/no poll.
* `quote` - Save/recall quotes form users.
* `repo` - Outputs a link to the bot's source code.
* `role` - Give yourself roles, or remove them.
* `roll` - Roll an assortment of dice (e.g. 3d6+5)
* `server` - Display server info
* `stock` - Get a stock quote
* `tictactoe` - Play a game of Tic Tac Toe
* `topic` - Set the topic of the channel
* `twitter` - Get the latest Tweet from a given Twitter user
* `urban` - Lookup a word on UrbanDictionary.com
* `user` - Get user info for you or someone else 
* `weather` - Lookup the weather for a ZIP or CITY, STATE.
* `weatherforecast` - Lookup the weather forecast for a ZIP or CITY, STATE.
* `weathersave` - Save your ZIP in memory to use weather commands without parameters
* `youtube` - Search for a YouTube video

## Deployment

1. Install Node (& npm).
2. Navigate to project directory
3. Create a config.json file in the project root with the following structure:
```
{
	"prefix": ".",
	"token": "YOUR DISCORD BOT TOKEN",
	"environment": "production",
	"repo": "https://github.com/rbrotherton/gobot",
	"apis": {
		"define" : {
			"host": "https://od-api.oxforddictionaries.com/api/v1",
			"app_id": "",
			"app_key": "",
			"language": "en"
		},
		"weather": {
			"host": "api.wunderground.com/api",
			"api_key": ""
		},
		"google": {
			"host": "https://www.googleapis.com/customsearch/v1",
			"cx":"",
			"key":""
		},
		"youtube": {
			"host": "https://www.googleapis.com/youtube/v3",
			"key": ""	
		},
		"crypto": {
			"host": "https://api.coinmarketcap.com/v2"
		},
		"stocks": {
			"host": "https://www.alphavantage.co",
			"key": ""
		},
		"twitter": {
			"consumer_key": "",
			"consumer_secret": ""
		},
		"news": {
			"key": "",
			"host": "https://newsapi.org/v2",
			"country": "us",
			"language": "en"
		}
	}
}
```
4. Create a cache.json file in the project root with the folowing structure:
```
{"zips":{},"quotes":[],"boards":{}}
```
5. Create a cache_crypto.json file in the project root with the folowing structure:
```
{}
```
6. run `npm install` to install dependencies
7. run `node app.js`


## License

This project is licensed under the MIT License

## Atribution

Thanks to [NewsAPI.org](https://newsapi.org) for providing a free news API!

