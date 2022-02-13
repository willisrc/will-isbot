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

client.on("subscription", function (channel, username, methods ) {

	client.say(channel, username + " Has subscribed PogChamp " )
	
	});
	
client.on("resub", function (channel, username, months, message, userstate, methods) {

	client.say(channel, username + " Has subscribed for " + months + " months in a row PogChamp " )

	});

client.on('join', onJoinHandler);
client.on('message', onMessageHandler);
// client.on('subscription', onSubHandler);
// client.on('resub', onResubHandler);
client.on('raided', onRaidHandler);

client.connect();

var isVoting = false;

// Called every time the bot connects to Twitch chat

function onMessageHandler (channel, userstate, message, self) {
  // Ignore echoed messages.
  if(self) return;
	//Ignore Nightbot
	if(userstate.username == 'Nightbot') return;

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
				client.say(channel, `Here is the current playlist I use during streams: https://open.spotify.com/playlist/7tUt7hqU4p21C3dw4cdMLU?si=bfd45c999c7d4ad7`);
			break;

			case 'voting':
				//check if user is mod/channel owner
				if (userstate.username == 'will_is' || userstate.mod == true) {
					if (params[0].localeCompare('on') == 0) {
						isVoting = true;
						console.log('Voting is now on');
					}
					else if (params[0].localeCompare('off') == 0) {
						isVoting = false;
						console.log('Voting is now off');
					}
					else if (params[0].localeCompare('clear') == 0) {
						console.log('Voting will now be cleared');
						vote.clear();
					}
					else if (params[0].localeCompare('print') == 0) {
						vote.print();
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
					vote.record(userstate, params);
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
	console.log('@${username}` subbed')
}

function onResubHandler (channel, username, streakMonths, message, userstate, methods) {
	client.say(`@${username} is a glutton and came back for more. Thanks for continuing your sub with ${methods}`);
}

function onRaidHandler (channel, username, viewers) {
	client.say(`RAID peepoRun RAID peepoRun RAID peepoRun RAID peepoRun RAID peepoRun RAID peepoRun`);
	client.say(`Thanks for the raid, @${username}!`);
}
