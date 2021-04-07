require('dotenv').config();

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

client.connect();

// Called every time the bot connects to Twitch chat

client.on('message', (channel, userstate, message, self) => {
  // Ignore echoed messages.
  if(self) return;

  if(message.toLowerCase() === '!hello') {
    // console.log(userstate);
    client.say(channel, `@${userstate.username}, hiya!`);
  }
});


function onJoinHandler (channel, username, self) {
  console.log(`${username} Joined`);


  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", 'https://api.twitch.tv/kraken/channels/TWITCH_CLIENT_ID/subscriptions', true ); // false for synchronous request
  xmlHttp.send();
  console.log(xmlHttp.responseText);


  // tags can't be passed on the join listener. need to check sub list
  // if (tags.subscriber) {
  //   client.say(channel, `Good to see you @${tags.username}! Thanks again for the money :P`);
  // }
  // else if (tags.mod) {
  //   client.say(channel, `Oh snap, it's @${tags.username}. Ban hammer incomming`);
  // }
  // else return;
}
