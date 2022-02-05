const { kick_from_voicechat } = require('../config.json');

async function startKickFromVoiceChatRoutine(state) {
    state.member.voice.disconnect();
}

module.exports = {
    startKickFromVoiceChatRoutine,
}
