require('dotenv').config();

const responses = require('./responses.json');

const vote = require('./vote.js');

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

var isVoting = false;

// Called every time the bot connects to Twitch chat

function onMessageHandler (channel, userstate, message, self) {
  // Ignore echoed messages.
  if(self) return;

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

			case 'playlist':
				//spotify playlist
				client.say(channel, `Here is the current playlist I use during streams: https://open.spotify.com/playlist/087Ettes0ZzLQ6WViwrz39?si=201676f0ccc34e40`);
			break;

			case 'voting':
				//check if user is mod/channel owner
				console.log(params);
				if (userstate.username == 'will_is' || userstate.mod == true) {
					if (params == 'on') {
						isVoting = true;
					}
					if (params == 'off') {
						isVoting = false;
					}
					else {
						client.say(channel, `Invalid param, try again`);
					}
				}
				else {
					client.say(channel, `You do not have permisson to use this command`);
				}
			break;

			case 'vote':
				//check if boolean is true
				if (!isVoting) {
					console.log('voting is not enabled');
					return;
				}
				else {
					console.log('voting is enabled');
					//vote.record(userstate.username, params)
				}
			break;

			default:
			break;

		}
		return;
	}

	//RESPONSE HANDLER
	var msg = message.split(' ');
	console.log(msg);
	var x;
	for (x in msg) {
		if (responses[msg[x]]) {
			client.say(channel, responses[msg[x]]);
		}
	}

	// if (responses[message]) {
	// 	// console.log(message);
	// 	// console.log(responses[message]);
	// 	client.say(channel, responses[message]);
	// }

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
	client.say(`RAID peepoRun RAID peepoRun RAID peepoRun RAID peepoRun RAID peepoRun RAID peepoRun`);
	client.say(`Thanks for the raid @${username}!`);
}
