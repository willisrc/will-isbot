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

client.on('message', (channel, tags, message, self) => {
  // Ignore echoed messages.
  if(self) return;

  if(message.toLowerCase() === '!hello') {
    // "@alca, heya!"
    // console.log('channel: ' + channel
    //             + '\ntags: ' + `${tags.subscriber}`);
    client.say(channel, `@${tags.username}, heya!`);
  }
});


function onJoinHandler (channel, tags, self) {
  console.log('Someone Joined');
  if (tags.subscriber) {
    client.say(channel, `Good to see you @${tags.username}! Thanks again for the money :P`);
  }
  else if (tags.mod) {
    client.say(channel, `Oh snap, it's @${tags.username}. Ban hammer incomming`);
  }
  else return;
}
