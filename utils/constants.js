const { Intents } = require('discord.js');
const conf = require('../config.json');

const intents = () => [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS];

const ANNOYERS = {
    KICK: 'kick',
    MUTE: 'mute',
}

module.exports = { intents, ANNOYERS };