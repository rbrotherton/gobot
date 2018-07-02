# GoBot
A simple Discord bot written in Node.js.

### Prerequisites

* Node v8 or greater
* discord.js
* project dependencies

## Testing

There is a test script so you can test commands locally without hooking into Discord. Just navigate to project directory and call it like so:

`node test weather 46268`
`node test weather Fresno, CA`
`node test roll 3d6`
`node test flip`

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

