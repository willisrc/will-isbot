require('dotenv').config();

const response = require('responses.json');
const tmi = require('tmi.js');

const client = new tmi.Client({
	connection: { reconnect: true },
	channels: [ 'will_is' ],
  identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN
	},
});

client.on('join', onJoinHandler);
client.on('message', onMessageHandler);
client.on('subscription', onSubHandler);
client.on('resub', onResubHandler);
client.on('raided', onRaidHandler);

client.connect();

// Called every time the bot connects to Twitch chat

function onMessageHandler (channel, userstate, message, self) {
  // Ignore echoed messages.
  if(self) return;

	//RESPONSE HANDLER
	var msg = message.split(' ');
	var x;
	for (x in msg) {
		if (response[msg[x]]) {
			client.say(response[msg[x]]);
		}
	}


	//FUNCTION HANDLER
	if(message.startsWith('!')) {
		var params = message.substring(1).split(' ');
		var cmd = params[0];
		params = params.splice(1);

		switch(cmd) {
			case 'hello':
				//hello function
				client.say(channel, `@${userstate.username}, hello friend!`);
			break;

			case 'so':
				//Shoutout function
				client.say(channel, `Shout out to twitch.tv/` + params + ` for being awesome! Go check them out and send them some love <3`);
			break;

			default:
			break;

		}
	}

//   if(message.toLowerCase() === '!hello') {
//     // console.log(userstate);
//     client.say(channel, `@${userstate.username}, hiya!`);
//   }
}


function onJoinHandler (channel, username, self) {
  console.log(`${username} Joined`);

  // var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  // var xmlHttp = new XMLHttpRequest();
  // xmlHttp.open( "GET", 'https://api.twitch.tv/kraken/channels/TWITCH_CLIENT_ID/subscriptions', true ); // false for synchronous request
  // xmlHttp.send();
  // console.log(xmlHttp.responseText);


  // tags can't be passed on the join listener. need to check sub list
  // if (tags.subscriber) {
  //   client.say(channel, `Good to see you @${tags.username}! Thanks again for the money :P`);
  // }
  // else if (tags.mod) {
  //   client.say(channel, `Oh snap, it's @${tags.username}. Ban hammer incomming`);
  // }
  // else return;
}

function onSubHandler (channel, username, method, message, userstate) {
	client.say(`Thank you for subbing @${username}`);
}

function onResubHandler (channel, username, streakMonths, message, userstate, methods) {
	client.say(`@${username} is a glutton and came back for more. Thanks for continuing your sub with ${methods}`);
}

function onRaidHandler (channel, username, viewers) {
	client.say(`RAID RAID RAID RAID RAID RAID`);
	client.say(`Thanks for the raid @${username}!`);
}
