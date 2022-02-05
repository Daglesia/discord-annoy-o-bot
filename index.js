const conf = require('minimist')(process.argv.slice(2));
const { Client, Intents } = require('discord.js');

const { token, black_list } = require('./config.json');
const annoyers = require('./utils/annoyers');
const helpers = require('./utils/helper-functions');
const intents = require('./utils/intents');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS] });

client.once('ready', async () => {
	if(conf.watch) {
        const guilds = client.guilds.cache.map(server => client.guilds.cache.get(server.id));
        const userData = await Promise.all(guilds.map(async guild => {
            const logData = {
                serverName: guild.name,
                users: (await guild.members.fetch()).map(user => 
                    ({
                        globalName: user.user.tag,
                        nickname: user.nickname,
                        id: user.id,
                }))
            }
            return logData;
        }));
        userData.forEach(async server => {
            helpers.saveCsvData(server.users, server.serverName);
        });
        console.log('Saved data of users successfully.')
    }
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if(helpers.isPersonJoiningChannel(oldState, newState, black_list)) {
        //newState.member.voice.disconnect();
        annoyers.startKickFromVoiceChatRoutine(newState);
    }
    console.log(newState.member.user.id);
})

client.login(token);