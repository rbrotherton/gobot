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

## Functions
* 8ball - Ask the magic 8ball a question
* coinflip - Flip a coin
* define - Look up a word in the Oxford dictionary
* google - Return Google search results for a query
* help - display help with my commands
* ping - Classic ping. See if you & the bot can communicate.
* roll - Roll an assortment of dice (e.g. 3d6+5)
* server - Display server info
* urban - Lookup a word on UrbanDictionary.com
* weather - Lookup the weather for a <zip> or <city, state>.
* weathersave - Save your <zip> in memory to use weather without parameters

## Deployment

1. Install Node (& npm).
2. Navigate to project directory
3. Create a config.json file in the project root with the following structure:
```
{
	"prefix": ".",
	"token": "YOUR DISCORD BOT TOKEN",
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
		}
	}
}
```
4. Create a cache.json file in the project root with the folowing structure:
```
{"zips":{}}
```
5. run `npm init` to install dependencies
6. run `node app.js`


## License

This project is licensed under the MIT License

