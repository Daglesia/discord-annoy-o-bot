const { kick_from_voicechat, mute_for_duration } = require('../config.json');
const { ANNOYERS } = require('./constants');

const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

const getRandomInt = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min));

const delayForRandomTime = async (conf) => await delay(getRandomInt(conf.minimum, conf.maximum));

async function startKickFromVoiceChat(state, user) {
    user.addLock(ANNOYERS.KICK);

    await delayForRandomTime(kick_from_voicechat.delay_from_login_in_milliseconds);
    if (user.isOnVoiceChat) {
        state.member.voice.setMute(false);
        state.member.voice.disconnect();
        console.log(`User ${user.nickname} successfully disconnected.`);
    }
    else {
        console.log(`User ${user.nickname} already left before disconnecting.`);
    }

    user.removeLock(ANNOYERS.KICK);
}

async function muteUserInVoiceChat(state, user) {
    if (user.isOnVoiceChat) {
        state.member.voice.setMute(true);
        console.log(`User ${user.nickname} muted forcefully.`);
    }
    await delayForRandomTime(mute_for_duration.duration_in_milliseconds);
    if (user.isOnVoiceChat) {
        state.member.voice.setMute(false);
        console.log(`User ${user.nickname} unmuted forcefully.`);
    }
}

async function muteUserInVoiceChatRoutine(state, user) {
    user.addLock(ANNOYERS.MUTE);

    await delayForRandomTime(mute_for_duration.delay_from_login_in_milliseconds);

    while(user.isOnVoiceChat) {
        const retries = mute_for_duration.consecutive_retries;

        for(let i = 0; i < getRandomInt(retries.minimum, retries.maximum); i++) {
            await muteUserInVoiceChat(state, user);
            delayForRandomTime(mute_for_duration.delay_from_last_retry_in_milliseconds);
        }
        delayForRandomTime(mute_for_duration.delay_from_last_in_milliseconds);
    }

    user.removeLock(ANNOYERS.MUTE);
}

module.exports = {
    startKickFromVoiceChat,
    muteUserInVoiceChatRoutine,
}
