const { Parser } = require('json2csv');
const fs = require('fs');

const { path_to_log_directory } = require('../config.json');

const isPersonJoiningChannel = (oldState, newState, personIdList) => personIdList.includes(newState.member.user.id) && !oldState.channel && oldState.channel !== newState.channel;

const isPersonLeavingChannel = (oldState, newState, personIdList) => personIdList.includes(newState.member.user.id) && oldState.channel && !newState.channel && oldState.channel !== newState.channel;

const hasPersonMutedThemself = (oldState, newState, personIdList) => personIdList.includes(newState.member.user.id) && !oldState.mute && newState.mute;

const hasPersonUnmutedThemself = (oldState, newState, personIdList) => personIdList.includes(newState.member.user.id) && oldState.mute && !newState.mute;

const isPersonNotLeavingChannel = (oldState, newState, personIdList) => personIdList.includes(newState.member.user.id) && !(oldState.channel && !newState.channel && oldState.channel !== newState.channel);

const makeNameSaveFriendly = (nameString) => nameString.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(" ", "_").toLowerCase();

function parseCsvData(data) {
    try {
        const parser = new Parser();
        const csv = parser.parse(data);
        return csv;
      } catch (err) {
        throw err;
    }
}

function saveCsvData(data, fileName) {
    try {
        const csvData = parseCsvData(data);
        const pathToFile = `${path_to_log_directory}/${makeNameSaveFriendly(fileName)}`
    
        fs.writeFile(pathToFile, csvData, (err) => {
            if (err)
                throw err;
        });
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = {
    isPersonJoiningChannel,
    isPersonLeavingChannel,
    isPersonNotLeavingChannel,
    hasPersonMutedThemself,
    hasPersonUnmutedThemself,
    saveCsvData,
}