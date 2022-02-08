const conf = require('minimist')(process.argv.slice(2));
const { Client } = require('discord.js');

const { token } = require('./config.json');
const { annoyersMapping } = require('./utils/annoyers');
const helpers = require('./utils/helper-functions');
const { intents, ANNOYERS } = require('./utils/constants');

const User = require('./utils/user-class');
const BlackList = require('./utils/black-list-class');

const blackList = new BlackList();
const client = new Client({ intents: intents() });
let listOfVictims = [];

client.once('ready', async () => {
    await blackList.initializeBlackList(client);

	if(conf.watch) {
        const userData = await Promise.all(guilds.map(async guild => (
            {
                serverName: guild.name,
                users: (await guild.members.fetch()).map(user => 
                    ({
                        globalName: user.user.tag,
                        nickname: user.nickname,
                        id: user.id,
                }))
            }
        )));
        userData.forEach(server => {
            helpers.saveCsvData(server.users, server.serverName);
        });
        console.log('Saved data of users successfully.')
    }
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if(helpers.isPersonNotLeavingChannel(oldState, newState, blackList.tags) && !listOfVictims.find(user => user.id === newState.member.user.id)) {
        listOfVictims.push(new User(newState.member.user.id, newState.member.user.tag, newState.mute));
    };
    if(helpers.isPersonJoiningChannel(oldState, newState, blackList.tags)) {
        newState.member.voice.setMute(false);
        newState.member.voice.setDeaf(false);
        console.log(`User ${newState.member.user.tag} joined the voice chat.`)
        const user = listOfVictims.find(user => user.id === newState.member.user.id);
        if(!user.locks.length) {
            Object.keys(conf).map(option => {
                if (annoyersMapping[option]) {
                    annoyersMapping[option](newState, user);
                }
            })
        }
    }
    if(helpers.isPersonLeavingChannel(oldState, newState, blackList.tags)) {
        console.log(`User ${newState.member.user.tag} left the voice chat.`);
        const user = listOfVictims.find(user => user.id === newState.member.user.id);
        if(user) {
            user.isOnVoiceChat = false;
            listOfVictims = listOfVictims.filter(user => {
                //todo refactor, but simple filtering doesnt work
                if(user.id !== newState.member.user.id) {
                    return user;
                }
            });
        }
    }

    //todo see if i need it
    if(helpers.hasPersonMutedThemself(oldState, newState, blackList.tags)) {
        console.log(`User ${newState.member.user.tag} muted.`);
        listOfVictims.find(user => user.id === newState.member.user.id).isMuted = true;
    }
    if(helpers.hasPersonUnmutedThemself(oldState, newState, blackList.tags)) {
        console.log(`User ${newState.member.user.tag} unmuted.`);
        listOfVictims.find(user => user.id === newState.member.user.id).isMuted = false;
    }
})

client.login(token);