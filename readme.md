# GoBot
A simple Discord bot written in Node.js.

### Prerequisites

* Node v8 or greater
* discord.js
* project dependencies

## Deployment

1. Install Node.
2. Navigate to project directory
4. Create a config.json file with the following structure:
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
		}
	}
}
```
3. run `node app.js`


## License

This project is licensed under the MIT License

