const { traced_tags } = require('../config.json');

class BlackList {
  constructor() {
    this.tags = [];
  }

  get tags() {
    return this._tags;
  }

  set tags(value) {
    this._tags = value;
  }

  async initializeBlackList(client) {
    const guilds = client.guilds.cache.map(server => client.guilds.cache.get(server.id));
    const blackList = [];
    await Promise.all(guilds.map(async guild => {
        (await guild.members.fetch()).forEach(user => {
            if (traced_tags.includes(user.user.tag)) {
              blackList.push(user.user.id);
            }
        })
    }));
    this.tags = blackList;
  }
}

module.exports = BlackList;