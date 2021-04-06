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
    console.log('channel: ' + channel
                + '\ntags: ' + `@${tags}`);
    client.say(channel, `@${tags.username}, heya!`);
  }
});


function onJoinHandler (channel, tags, username, self) {
  if (tags.isSubscriber) {
    client.say(channel, `@${tags.username}, has join the chat! Welcome friend!`);
  }
  else return;
}
