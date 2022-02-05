const { Intents } = require('discord.js');

const intents = () => [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS];

module.exports = intents;